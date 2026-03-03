import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from './store';
import * as THREE from 'three';

interface BuildingData {
  id: number;
  x: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  color: string;
  roofColor: string;
  windowColor: string;
  roofStyle: 'flat' | 'pitched' | 'gable';
  hasAwning: boolean;
  awningColor: string;
}

const BUILDING_COLORS = [
  '#E8D5B7', '#D4C4A8', '#C9B99A', '#BFB093', '#CFBFA5',
  '#F5E6CC', '#E0D2BA', '#D6C8B0', '#CCC0A4', '#B8A88E',
  '#E2D4BC', '#D8CAAC', '#F0E0C8', '#C4B496', '#DAC8A8',
];

const ROOF_COLORS = [
  '#8D6E63', '#795548', '#6D4C41', '#A1887F', '#5D4037',
  '#4E342E', '#3E2723', '#7B5B4C', '#6B4E3D', '#8B7355',
];

const AWNING_COLORS = [
  '#EF5350', '#4CAF50', '#FFD54F', '#42A5F5', '#FF9800',
  '#CE93D8', '#26A69A', '#EC407A',
];

const WINDOW_COLORS = ['#B3E5FC', '#BBDEFB', '#90CAF9', '#E1F5FE', '#80DEEA'];

function generateBuildings(startZ: number, count: number, idOffset: number): BuildingData[] {
  const buildings: BuildingData[] = [];
  let id = idOffset;
  for (let side = -1; side <= 1; side += 2) {
    let z = startZ;
    for (let i = 0; i < count; i++) {
      const width = 3 + Math.random() * 5;
      const depth = 4 + Math.random() * 6;
      const height = 4 + Math.random() * 14;
      const gap = 1 + Math.random() * 2;
      const xOffset = 10 + Math.random() * 8;
      const roofStyles: ('flat' | 'pitched' | 'gable')[] = ['flat', 'pitched', 'gable'];
      buildings.push({
        id: id++,
        x: side * xOffset,
        z: z - depth / 2,
        width, depth, height,
        color: BUILDING_COLORS[Math.floor(Math.random() * BUILDING_COLORS.length)],
        roofColor: ROOF_COLORS[Math.floor(Math.random() * ROOF_COLORS.length)],
        windowColor: WINDOW_COLORS[Math.floor(Math.random() * WINDOW_COLORS.length)],
        roofStyle: roofStyles[Math.floor(Math.random() * roofStyles.length)],
        hasAwning: Math.random() > 0.5,
        awningColor: AWNING_COLORS[Math.floor(Math.random() * AWNING_COLORS.length)],
      });
      z -= depth + gap;
    }
  }
  return buildings;
}

function BuildingMesh({ building }: { building: BuildingData }) {
  const facadeTex = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Wall base
    ctx.fillStyle = building.color;
    ctx.fillRect(0, 0, 256, 512);

    // Subtle brick / plaster texture
    ctx.globalAlpha = 0.08;
    for (let y = 0; y < 512; y += 8) {
      const off = (Math.floor(y / 8) % 2) * 16;
      for (let x = off; x < 256; x += 32) {
        ctx.strokeStyle = '#8D6E63';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x, y, 30, 7);
      }
    }
    ctx.globalAlpha = 1;

    // Windows
    const cols = 4;
    const rows = Math.max(2, Math.floor(building.height / 2));
    const winW = 30;
    const winH = 40;
    const spacingX = (256 - cols * winW) / (cols + 1);
    const spacingY = (512 - rows * winH) / (rows + 1);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const wx = spacingX + c * (winW + spacingX);
        const wy = spacingY + r * (winH + spacingY);

        // Window recess shadow
        ctx.fillStyle = '#5D4037';
        ctx.globalAlpha = 0.25;
        ctx.fillRect(wx - 1, wy - 1, winW + 2, winH + 2);
        ctx.globalAlpha = 1;

        // Glass
        const lit = Math.random() > 0.2;
        ctx.fillStyle = lit ? building.windowColor : '#78909C';
        ctx.globalAlpha = lit ? 0.85 : 0.5;
        ctx.fillRect(wx, wy, winW, winH);
        ctx.globalAlpha = 1;

        // Window frame
        ctx.strokeStyle = '#ECEFF1';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(wx, wy, winW, winH);

        // Cross divider
        ctx.beginPath();
        ctx.moveTo(wx + winW / 2, wy);
        ctx.lineTo(wx + winW / 2, wy + winH);
        ctx.moveTo(wx, wy + winH / 2);
        ctx.lineTo(wx + winW, wy + winH / 2);
        ctx.stroke();

        // Sill
        ctx.fillStyle = '#BDBDBD';
        ctx.fillRect(wx - 2, wy + winH, winW + 4, 3);
      }
    }

    // Door on ground floor (centre)
    const doorW = 36;
    const doorH = 55;
    const doorX = (256 - doorW) / 2;
    const doorY = 512 - doorH - 8;
    ctx.fillStyle = '#6D4C41';
    ctx.fillRect(doorX, doorY, doorW, doorH);
    ctx.strokeStyle = '#4E342E';
    ctx.lineWidth = 2;
    ctx.strokeRect(doorX, doorY, doorW, doorH);
    // Door handle
    ctx.fillStyle = '#FFD54F';
    ctx.beginPath();
    ctx.arc(doorX + doorW - 8, doorY + doorH / 2, 3, 0, Math.PI * 2);
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, [building]);

  return (
    <group>
      {/* Main body */}
      <mesh position={[building.x, building.height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[building.width, building.height, building.depth]} />
        <meshStandardMaterial
          map={facadeTex}
          roughness={0.85}
          metalness={0.0}
          emissiveMap={facadeTex}
          emissive="#ffffff"
          emissiveIntensity={0.04}
        />
      </mesh>

      {/* Roof */}
      {building.roofStyle === 'flat' && (
        <mesh position={[building.x, building.height + 0.15, 0]}>
          <boxGeometry args={[building.width + 0.3, 0.3, building.depth + 0.3]} />
          <meshStandardMaterial color={building.roofColor} roughness={0.7} metalness={0.05} />
        </mesh>
      )}
      {building.roofStyle === 'pitched' && (
        <mesh position={[building.x, building.height + 0.8, 0]} rotation={[0, Math.PI / 2, 0]}>
          <coneGeometry args={[building.depth / 2 + 0.3, 1.6, 4]} />
          <meshStandardMaterial color={building.roofColor} roughness={0.7} metalness={0.05} />
        </mesh>
      )}
      {building.roofStyle === 'gable' && (
        <>
          <mesh position={[building.x, building.height + 0.5, 0]} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0, building.width / 2 + 0.2, 1, 4, 1]} />
            <meshStandardMaterial color={building.roofColor} roughness={0.7} metalness={0.05} />
          </mesh>
        </>
      )}

      {/* Awning over door (street-facing side) */}
      {building.hasAwning && (
        <mesh
          position={[building.x, building.height * 0.35, building.depth / 2 + 0.3]}
          rotation={[-0.3, 0, 0]}
          castShadow
        >
          <boxGeometry args={[building.width * 0.6, 0.05, 1.2]} />
          <meshStandardMaterial color={building.awningColor} roughness={0.6} metalness={0.0} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

export function CityBackground() {
  const groupRef = useRef<THREE.Group>(null);
  const speed = useGameStore((state) => state.speed);
  const status = useGameStore((state) => state.status);

  const buildings = useMemo(() => generateBuildings(20, 30, 0), []);

  const initialized = useRef(false);
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (!initialized.current) {
      groupRef.current.children.forEach((child, i) => {
        if (buildings[i]) child.position.z = buildings[i].z;
      });
      initialized.current = true;
    }

    if (status !== 'playing') return;

    groupRef.current.children.forEach((child) => {
      child.position.z += speed * delta;
      if (child.position.z > 30) child.position.z -= 350;
    });
  });

  return (
    <group ref={groupRef}>
      {buildings.map((b) => (
        <BuildingMesh key={b.id} building={b} />
      ))}
    </group>
  );
}
