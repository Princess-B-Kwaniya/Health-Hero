import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useGameStore } from './store';

/* ── Roblox-Style Studded Baseplate Texture ── */
function createBaseplateTexture(baseColor: string, studColor: string) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Grass base with variation
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 256, 256);

  // Subtle grass blades / texture variation
  for (let i = 0; i < 600; i++) {
    const gx = Math.random() * 256;
    const gy = Math.random() * 256;
    const green = 120 + Math.floor(Math.random() * 80);
    ctx.fillStyle = `rgba(${Math.floor(green * 0.3)},${green},${Math.floor(green * 0.3)},0.3)`;
    ctx.fillRect(gx, gy, 1, 3 + Math.random() * 3);
  }

  // Studs grid (Roblox classic baseplate look)
  const studSize = 7;
  const spacing = 32;
  ctx.fillStyle = studColor;
  for (let y = spacing / 2; y < 256; y += spacing) {
    for (let x = spacing / 2; x < 256; x += spacing) {
      ctx.beginPath();
      ctx.arc(x, y, studSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Stud highlights — 3D pop
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  for (let y = spacing / 2; y < 256; y += spacing) {
    for (let x = spacing / 2; x < 256; x += spacing) {
      ctx.beginPath();
      ctx.arc(x - 2, y - 2, studSize * 0.45, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // Stud shadows
  ctx.fillStyle = 'rgba(0,0,0,0.08)';
  for (let y = spacing / 2; y < 256; y += spacing) {
    for (let x = spacing / 2; x < 256; x += spacing) {
      ctx.beginPath();
      ctx.arc(x + 2, y + 2, studSize * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 50);
  tex.anisotropy = 4;
  return tex;
}

function createLaneTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Asphalt base — slightly textured dark grey
  ctx.fillStyle = '#707070';
  ctx.fillRect(0, 0, 512, 512);
  // Subtle noise grain for asphalt feel
  for (let i = 0; i < 3000; i++) {
    const nx = Math.random() * 512;
    const ny = Math.random() * 512;
    const shade = 100 + Math.floor(Math.random() * 30);
    ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
    ctx.fillRect(nx, ny, 2, 2);
  }

  // Lane dividers — bright yellow dashes
  ctx.setLineDash([40, 28]);
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#F5CD30';
  [213, 299].forEach(lx => {
    ctx.beginPath();
    ctx.moveTo(lx, 0);
    ctx.lineTo(lx, 512);
    ctx.stroke();
  });

  // Road edge — solid white borders
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 5;
  ctx.setLineDash([]);
  [12, 500].forEach(lx => {
    ctx.beginPath();
    ctx.moveTo(lx, 0);
    ctx.lineTo(lx, 512);
    ctx.stroke();
  });

  // Bright green shoulder accent outside white lines
  ctx.strokeStyle = '#00E639';
  ctx.lineWidth = 3;
  [5, 507].forEach(lx => {
    ctx.beginPath();
    ctx.moveTo(lx, 0);
    ctx.lineTo(lx, 512);
    ctx.stroke();
  });



  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 20);
  tex.anisotropy = 8;
  return tex;
}

export function Ground() {
  const laneTex = useMemo(createLaneTexture, []);
  const grassTex = useMemo(() => createBaseplateTexture('#4CB050', '#5BC760'), []);
  const speed = useGameStore((state) => state.speed);
  const status = useGameStore((state) => state.status);

  useFrame((_, delta) => {
    if (status === 'playing') {
      const offset = (speed / 10) * delta;
      laneTex.offset.y -= offset;
      grassTex.offset.y -= offset;
    }
  });

  return (
    <>
      {/* Road — textured asphalt */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, -50]} receiveShadow>
        <planeGeometry args={[15, 200]} />
        <meshStandardMaterial map={laneTex} roughness={0.55} metalness={0.02} />
      </mesh>
      {/* Sidewalk curb */}
      {[-7.7, 7.7].map((x) => (
        <mesh key={x} position={[x, 0.05, -50]} receiveShadow castShadow>
          <boxGeometry args={[0.4, 0.12, 200]} />
          <meshStandardMaterial color="#BDBDBD" roughness={0.5} />
        </mesh>
      ))}
      {/* Grass — bright green with texture */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, -50]} receiveShadow>
        <planeGeometry args={[120, 200]} />
        <meshStandardMaterial map={grassTex} roughness={0.5} metalness={0.01} />
      </mesh>
    </>
  );
}
