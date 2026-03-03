import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from './store';
import * as THREE from 'three';

/* ── Roblox BrickColor-style saturated palette ── */
const ROBLOX_BUILDING_COLORS = [
  '#00A2FF', // Really blue
  '#FF6B6B', // Bright red-ish
  '#F5CD30', // Bright yellow
  '#A3D44E', // Lime green
  '#D47BFF', // Lavender / Alder
  '#FF9E40', // Neon orange
  '#FF85C8', // Hot pink
  '#4CB050', // Bright green
  '#5BCEFA', // Pastel blue
  '#FFFFFF', // White
  '#C4B496', // Brick yellow
  '#E8BAC8', // Pink
  '#8ECEDA', // Light blue
  '#B4D455', // Bright yellow-green
  '#CC4400', // Dark orange
];

const ROBLOX_ROOF_COLORS = [
  '#842B00', // Dark orange
  '#194D33', // Earth green
  '#0D47A1', // Navy
  '#880E4F', // Deep magenta
  '#5D4037', // Brown
  '#C62828', // Bright red
];

const ROBLOX_ACCENT_COLORS = [
  '#FF0000', '#00FF00', '#FFFF00', '#00A2FF', '#FF6EC7', '#FF8C00',
];

interface RobloxBuilding {
  id: number;
  x: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  color: string;
  roofColor: string;
  accentColor: string;
  windowRows: number;
  windowCols: number;
  hasFlag: boolean;
}

function generateBuildings(startZ: number, count: number, idOffset: number): RobloxBuilding[] {
  const buildings: RobloxBuilding[] = [];
  let id = idOffset;
  for (let side = -1; side <= 1; side += 2) {
    let z = startZ;
    for (let i = 0; i < count; i++) {
      const width = 4 + Math.random() * 5;
      const depth = 4 + Math.random() * 5;
      const height = 4 + Math.random() * 16;
      const gap = 1.5 + Math.random() * 2;
      const xOffset = 11 + Math.random() * 7;
      buildings.push({
        id: id++,
        x: side * xOffset,
        z: z - depth / 2,
        width, depth, height,
        color: ROBLOX_BUILDING_COLORS[Math.floor(Math.random() * ROBLOX_BUILDING_COLORS.length)],
        roofColor: ROBLOX_ROOF_COLORS[Math.floor(Math.random() * ROBLOX_ROOF_COLORS.length)],
        accentColor: ROBLOX_ACCENT_COLORS[Math.floor(Math.random() * ROBLOX_ACCENT_COLORS.length)],
        windowRows: 2 + Math.floor(Math.random() * 4),
        windowCols: 2 + Math.floor(Math.random() * 3),
        hasFlag: Math.random() > 0.65,
      });
      z -= depth + gap;
    }
  }
  return buildings;
}

/* ── Simple Roblox block building (flat-color, SmoothPlastic) ── */
function RobloxBuildingMesh({ b }: { b: RobloxBuilding }) {
  const mat = <meshStandardMaterial roughness={0.3} metalness={0.05} />;

  return (
    <group>
      {/* Main body — bright solid color */}
      <mesh position={[b.x, b.height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[b.width, b.height, b.depth]} />
        <meshStandardMaterial color={b.color} roughness={0.3} metalness={0.05} />
      </mesh>

      {/* Flat roof slab — contrasting color */}
      <mesh position={[b.x, b.height + 0.15, 0]}>
        <boxGeometry args={[b.width + 0.4, 0.3, b.depth + 0.4]} />
        <meshStandardMaterial color={b.roofColor} roughness={0.3} metalness={0.05} />
      </mesh>

      {/* Simple window grid — small inset dark cubes on the front face */}
      {Array.from({ length: b.windowRows }).map((_, r) =>
        Array.from({ length: b.windowCols }).map((_, c) => {
          const winW = b.width * 0.15;
          const winH = b.height / (b.windowRows + 1) * 0.45;
          const spacingX = b.width / (b.windowCols + 1);
          const spacingY = b.height / (b.windowRows + 1);
          const wx = b.x - b.width / 2 + spacingX * (c + 1);
          const wy = spacingY * (r + 1);
          return (
            <mesh key={`w-${r}-${c}`} position={[wx, wy, b.depth / 2 + 0.01]}>
              <boxGeometry args={[winW, winH, 0.05]} />
              <meshStandardMaterial color="#1A3A5C" roughness={0.2} metalness={0.3} />
            </mesh>
          );
        })
      )}

      {/* Door — with frame and handle */}
      <mesh position={[b.x, 0.75, b.depth / 2 + 0.02]}>
        <boxGeometry args={[b.width * 0.25, 1.5, 0.05]} />
        <meshStandardMaterial color={b.accentColor} roughness={0.3} metalness={0.05} />
      </mesh>
      {/* Door frame */}
      <mesh position={[b.x, 0.75, b.depth / 2 + 0.04]}>
        <boxGeometry args={[b.width * 0.27, 1.55, 0.02]} />
        <meshStandardMaterial color="#5D4037" roughness={0.5} />
      </mesh>
      {/* Door handle */}
      <mesh position={[b.x + b.width * 0.09, 0.7, b.depth / 2 + 0.06]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#FFD000" metalness={0.8} roughness={0.15} />
      </mesh>

      {/* Awning over door */}
      <mesh position={[b.x, 1.6, b.depth / 2 + 0.15]}>
        <boxGeometry args={[b.width * 0.35, 0.06, 0.3]} />
        <meshStandardMaterial color={b.accentColor} roughness={0.4} metalness={0.05} />
      </mesh>

      {/* AC unit on side (sometimes) */}
      {b.height > 10 && (
        <mesh position={[b.x + b.width / 2 + 0.15, b.height * 0.6, 0]}>
          <boxGeometry args={[0.3, 0.25, 0.35]} />
          <meshStandardMaterial color="#E0E0E0" roughness={0.4} metalness={0.3} />
        </mesh>
      )}

      {/* Optional flag pole on roof */}
      {b.hasFlag && (
        <group position={[b.x, b.height + 0.3, 0]}>
          <mesh position={[0, 1.0, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 2, 6]} />
            <meshStandardMaterial color="#C0C0C0" roughness={0.2} metalness={0.4} />
          </mesh>
          <mesh position={[0.35, 1.7, 0]}>
            <boxGeometry args={[0.6, 0.35, 0.02]} />
            <meshStandardMaterial color={b.accentColor} roughness={0.3} metalness={0.05} />
          </mesh>
        </group>
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
        <RobloxBuildingMesh key={b.id} b={b} />
      ))}
    </group>
  );
}