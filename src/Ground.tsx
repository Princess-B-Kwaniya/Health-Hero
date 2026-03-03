import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useGameStore } from './store';

function createPathTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Asphalt base
  ctx.fillStyle = '#505050';
  ctx.fillRect(0, 0, 1024, 1024);

  // Asphalt noise / grain
  for (let i = 0; i < 12000; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const v = 60 + Math.floor(Math.random() * 40);
    ctx.fillStyle = `rgb(${v},${v},${v})`;
    ctx.globalAlpha = Math.random() * 0.12;
    ctx.fillRect(x, y, 1 + Math.random() * 2, 1 + Math.random() * 2);
  }
  ctx.globalAlpha = 1;

  // Small cracks
  ctx.strokeStyle = '#3a3a3a';
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.35;
  for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    let cx = Math.random() * 1024;
    let cy = Math.random() * 1024;
    ctx.moveTo(cx, cy);
    for (let j = 0; j < 5; j++) {
      cx += (Math.random() - 0.5) * 60;
      cy += Math.random() * 40;
      ctx.lineTo(cx, cy);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Lane dividers — dashed white lines
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 6;
  ctx.globalAlpha = 0.7;
  ctx.setLineDash([60, 50]);
  [370, 654].forEach(lx => {
    ctx.beginPath();
    ctx.moveTo(lx, 0);
    ctx.lineTo(lx, 1024);
    ctx.stroke();
  });
  ctx.setLineDash([]);
  ctx.globalAlpha = 1;

  // Road edge lines (solid yellow)
  ctx.strokeStyle = '#FFD54F';
  ctx.lineWidth = 5;
  ctx.globalAlpha = 0.6;
  [72, 952].forEach(lx => {
    ctx.beginPath();
    ctx.moveTo(lx, 0);
    ctx.lineTo(lx, 1024);
    ctx.stroke();
  });
  ctx.globalAlpha = 1;

  // Curb / sidewalk strip
  ctx.fillStyle = '#9E9E9E';
  ctx.fillRect(0, 0, 65, 1024);
  ctx.fillRect(959, 0, 65, 1024);
  // Curb edge highlight
  ctx.fillStyle = '#BDBDBD';
  ctx.fillRect(63, 0, 3, 1024);
  ctx.fillRect(959, 0, 3, 1024);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 20);
  tex.anisotropy = 8;
  return tex;
}

function createGrassTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Grass base
  ctx.fillStyle = '#4a8c3f';
  ctx.fillRect(0, 0, 512, 512);

  // Grass blades / variation
  for (let i = 0; i < 6000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const shade = Math.random() > 0.5 ? '#5a9e4a' : '#3d7a34';
    ctx.fillStyle = shade;
    ctx.globalAlpha = Math.random() * 0.4;
    ctx.fillRect(x, y, 1, 2 + Math.random() * 4);
  }
  ctx.globalAlpha = 1;

  // Occasional dirt patches
  for (let i = 0; i < 15; i++) {
    ctx.fillStyle = '#8D6E63';
    ctx.globalAlpha = 0.15;
    ctx.beginPath();
    ctx.arc(Math.random() * 512, Math.random() * 512, 4 + Math.random() * 10, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Small flowers
  const flowerColors = ['#EF5350', '#FFD54F', '#CE93D8', '#81D4FA', '#FFFFFF'];
  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = flowerColors[Math.floor(Math.random() * flowerColors.length)];
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.arc(Math.random() * 512, Math.random() * 512, 2 + Math.random() * 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(8, 40);
  tex.anisotropy = 4;
  return tex;
}

export function Ground() {
  const pathTex = useMemo(createPathTexture, []);
  const grassTex = useMemo(createGrassTexture, []);
  const speed = useGameStore((state) => state.speed);
  const status = useGameStore((state) => state.status);

  useFrame((_, delta) => {
    if (status === 'playing') {
      const offset = (speed / 10) * delta;
      pathTex.offset.y -= offset;
      grassTex.offset.y -= offset;
    }
  });

  return (
    <>
      {/* Road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, -50]} receiveShadow>
        <planeGeometry args={[15, 200]} />
        <meshStandardMaterial map={pathTex} roughness={0.85} metalness={0.0} />
      </mesh>
      {/* Grass field */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, -50]} receiveShadow>
        <planeGeometry args={[120, 200]} />
        <meshStandardMaterial map={grassTex} roughness={0.95} metalness={0.0} />
      </mesh>
    </>
  );
}
