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

  // Flat base
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 256, 256);

  // Studs grid (Roblox classic baseplate look)
  const studSize = 8;
  const spacing = 32;
  ctx.fillStyle = studColor;
  for (let y = spacing / 2; y < 256; y += spacing) {
    for (let x = spacing / 2; x < 256; x += spacing) {
      ctx.beginPath();
      ctx.arc(x, y, studSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Subtle stud highlight
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  for (let y = spacing / 2; y < 256; y += spacing) {
    for (let x = spacing / 2; x < 256; x += spacing) {
      ctx.beginPath();
      ctx.arc(x - 2, y - 2, studSize * 0.5, 0, Math.PI * 2);
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

  // Dark grey road base (Roblox "Medium stone grey")
  ctx.fillStyle = '#A3A2A5';
  ctx.fillRect(0, 0, 512, 512);

  // Studs on road
  const studSize = 6;
  const spacing = 32;
  ctx.fillStyle = '#B4B4B6';
  for (let y = spacing / 2; y < 512; y += spacing) {
    for (let x = spacing / 2; x < 512; x += spacing) {
      ctx.beginPath();
      ctx.arc(x, y, studSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Lane dividers — bright yellow Roblox bricks
  ctx.fillStyle = '#F5CD30';
  ctx.setLineDash([40, 30]);
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#F5CD30';
  [180, 332].forEach(lx => {
    ctx.beginPath();
    ctx.moveTo(lx, 0);
    ctx.lineTo(lx, 512);
    ctx.stroke();
  });

  // Road edge — bright blue Roblox accent
  ctx.strokeStyle = '#00A2FF';
  ctx.lineWidth = 6;
  ctx.setLineDash([]);
  [10, 502].forEach(lx => {
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
      {/* Road — Roblox studded baseplate */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, -50]} receiveShadow>
        <planeGeometry args={[15, 200]} />
        <meshStandardMaterial map={laneTex} roughness={0.35} metalness={0.02} />
      </mesh>
      {/* Grass — bright green Roblox baseplate */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, -50]} receiveShadow>
        <planeGeometry args={[120, 200]} />
        <meshStandardMaterial map={grassTex} roughness={0.4} metalness={0.02} />
      </mesh>
    </>
  );
}
