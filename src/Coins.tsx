import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useGameStore } from './store';
import { HealthyItemDef, getRandomHealthyItem, FOOD_GROUP_COLORS, FOOD_EMOJI } from './foodData';
import * as THREE from 'three';

const LANE_WIDTH = 2.5;
const SPAWN_Z = -150;

/* ── Detailed per-item 3D models for healthy food ── */

// ─── HYDRATION ───

function WaterBottle() {
  return (
    <group position={[0, 0.55, 0]}>
      {/* Body */}
      <mesh castShadow><cylinderGeometry args={[0.18, 0.2, 0.7, 16]} /><meshStandardMaterial color="#B3E5FC" transparent opacity={0.7} metalness={0.1} roughness={0.15} /></mesh>
      {/* Water inside */}
      <mesh position={[0, -0.08, 0]}><cylinderGeometry args={[0.16, 0.18, 0.5, 16]} /><meshStandardMaterial color="#29B6F6" transparent opacity={0.6} roughness={0.2} /></mesh>
      {/* Cap */}
      <mesh position={[0, 0.42, 0]}><cylinderGeometry args={[0.12, 0.14, 0.14, 12]} /><meshStandardMaterial color="#0288D1" roughness={0.3} /></mesh>
      {/* Neck */}
      <mesh position={[0, 0.32, 0]}><cylinderGeometry args={[0.12, 0.12, 0.06, 12]} /><meshStandardMaterial color="#E1F5FE" transparent opacity={0.5} roughness={0.2} /></mesh>
      {/* Label */}
      <mesh position={[0, 0, 0.19]}><boxGeometry args={[0.22, 0.25, 0.01]} /><meshStandardMaterial color="#E1F5FE" roughness={0.4} /></mesh>
    </group>
  );
}

function CoconutWater() {
  return (
    <group position={[0, 0.45, 0]}>
      {/* Coconut body */}
      <mesh castShadow><sphereGeometry args={[0.3, 14, 14]} /><meshStandardMaterial color="#795548" roughness={0.7} /></mesh>
      {/* Top cut */}
      <mesh position={[0, 0.22, 0]}><cylinderGeometry args={[0.15, 0.2, 0.1, 12]} /><meshStandardMaterial color="#FFF8E1" roughness={0.5} /></mesh>
      {/* Inner white */}
      <mesh position={[0, 0.28, 0]}><cylinderGeometry args={[0.13, 0.13, 0.04, 12]} /><meshStandardMaterial color="#FFFFFF" roughness={0.4} /></mesh>
      {/* Straw */}
      <mesh position={[0.05, 0.5, 0]} rotation={[0, 0, -0.1]}><cylinderGeometry args={[0.02, 0.02, 0.45, 8]} /><meshStandardMaterial color="#4CAF50" roughness={0.3} /></mesh>
    </group>
  );
}

function HerbalTea() {
  return (
    <group position={[0, 0.4, 0]}>
      {/* Cup */}
      <mesh castShadow><cylinderGeometry args={[0.25, 0.2, 0.35, 16]} /><meshStandardMaterial color="#FFFFFF" roughness={0.3} /></mesh>
      {/* Tea liquid */}
      <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.23, 0.23, 0.06, 16]} /><meshStandardMaterial color="#A5D6A7" roughness={0.4} /></mesh>
      {/* Handle */}
      <mesh position={[0.28, 0.05, 0]} rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[0.1, 0.025, 8, 12, Math.PI]} /><meshStandardMaterial color="#FFFFFF" roughness={0.3} /></mesh>
      {/* Tea bag tag */}
      <mesh position={[-0.2, 0.2, 0]}><boxGeometry args={[0.08, 0.06, 0.01]} /><meshStandardMaterial color="#C8E6C9" roughness={0.4} /></mesh>
      {/* Tea bag string */}
      <mesh position={[-0.12, 0.2, 0]} rotation={[0, 0, 0.3]}><cylinderGeometry args={[0.005, 0.005, 0.15, 4]} /><meshStandardMaterial color="#8D6E63" roughness={0.5} /></mesh>
      {/* Steam */}
      <mesh position={[0, 0.3, 0]}><sphereGeometry args={[0.05, 8, 8]} /><meshStandardMaterial color="#FFFFFF" transparent opacity={0.25} /></mesh>
      <mesh position={[0.06, 0.35, 0.03]}><sphereGeometry args={[0.035, 8, 8]} /><meshStandardMaterial color="#FFFFFF" transparent opacity={0.18} /></mesh>
    </group>
  );
}

// ─── FRUITS ───

function RedApple() {
  return (
    <group position={[0, 0.45, 0]}>
      {/* Apple body */}
      <mesh castShadow><sphereGeometry args={[0.3, 16, 16]} /><meshStandardMaterial color="#E53935" roughness={0.35} /></mesh>
      {/* Top indent */}
      <mesh position={[0, 0.25, 0]}><sphereGeometry args={[0.08, 8, 8]} /><meshStandardMaterial color="#C62828" roughness={0.4} /></mesh>
      {/* Stem */}
      <mesh position={[0, 0.35, 0]}><cylinderGeometry args={[0.02, 0.015, 0.12, 6]} /><meshStandardMaterial color="#5D4037" roughness={0.6} /></mesh>
      {/* Leaf */}
      <mesh position={[0.06, 0.38, 0]} rotation={[0.2, 0, 0.4]}><sphereGeometry args={[0.07, 8, 6]} /><meshStandardMaterial color="#4CAF50" roughness={0.4} /></mesh>
      {/* Highlight */}
      <mesh position={[0.12, 0.12, 0.2]}><sphereGeometry args={[0.06, 8, 8]} /><meshStandardMaterial color="#FFFFFF" transparent opacity={0.25} roughness={0.2} /></mesh>
    </group>
  );
}

function Banana() {
  return (
    <group position={[0, 0.4, 0]} rotation={[0, 0, 0.3]}>
      {/* Banana body — curved via torus segment */}
      <mesh castShadow rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.3, 0.1, 12, 20, Math.PI * 0.65]} /><meshStandardMaterial color="#FFD54F" roughness={0.35} /></mesh>
      {/* Tip */}
      <mesh position={[0.22, 0.18, 0]} rotation={[0, 0, -0.6]}><coneGeometry args={[0.06, 0.1, 8]} /><meshStandardMaterial color="#F9A825" roughness={0.4} /></mesh>
      {/* Stem end */}
      <mesh position={[-0.22, 0.18, 0]} rotation={[0, 0, 0.6]}><cylinderGeometry args={[0.04, 0.02, 0.08, 6]} /><meshStandardMaterial color="#8D6E63" roughness={0.5} /></mesh>
      {/* Brown spots */}
      <mesh position={[0.05, 0.08, 0.1]}><sphereGeometry args={[0.015, 6, 6]} /><meshStandardMaterial color="#8D6E63" roughness={0.5} /></mesh>
      <mesh position={[-0.1, 0.12, 0.09]}><sphereGeometry args={[0.012, 6, 6]} /><meshStandardMaterial color="#795548" roughness={0.5} /></mesh>
    </group>
  );
}

function Orange() {
  return (
    <group position={[0, 0.45, 0]}>
      {/* Orange body */}
      <mesh castShadow><sphereGeometry args={[0.3, 16, 16]} /><meshStandardMaterial color="#FF9800" roughness={0.55} /></mesh>
      {/* Navel dimple */}
      <mesh position={[0, -0.28, 0]}><sphereGeometry args={[0.05, 8, 8]} /><meshStandardMaterial color="#E65100" roughness={0.5} /></mesh>
      {/* Stem nub */}
      <mesh position={[0, 0.28, 0]}><sphereGeometry args={[0.04, 8, 8]} /><meshStandardMaterial color="#33691E" roughness={0.5} /></mesh>
      {/* Small leaf */}
      <mesh position={[0.06, 0.32, 0]} rotation={[0.2, 0, 0.5]}><sphereGeometry args={[0.06, 8, 6]} /><meshStandardMaterial color="#388E3C" roughness={0.4} /></mesh>
    </group>
  );
}

function Strawberry() {
  return (
    <group position={[0, 0.4, 0]}>
      {/* Berry body — cone with rounded top */}
      <mesh castShadow rotation={[Math.PI, 0, 0]}><coneGeometry args={[0.22, 0.4, 12]} /><meshStandardMaterial color="#E91E63" roughness={0.35} /></mesh>
      {/* Rounded top cap */}
      <mesh position={[0, 0.05, 0]}><sphereGeometry args={[0.22, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#E91E63" roughness={0.35} /></mesh>
      {/* Green leaves on top */}
      {[0, 1.2, 2.4, 3.6, 4.8].map((angle, i) => (
        <mesh key={i} position={[Math.cos(angle) * 0.08, 0.12, Math.sin(angle) * 0.08]} rotation={[0.5 * Math.cos(angle), angle, 0.3]}>
          <boxGeometry args={[0.04, 0.12, 0.02]} /><meshStandardMaterial color="#2E7D32" roughness={0.4} />
        </mesh>
      ))}
      {/* Seeds — little yellow dots */}
      {[[0.15, -0.05, 0.12], [-0.1, -0.1, 0.16], [0.08, 0.0, -0.18], [-0.14, -0.08, -0.1], [0.0, -0.12, 0.18]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}><sphereGeometry args={[0.018, 6, 6]} /><meshStandardMaterial color="#FFEB3B" roughness={0.4} /></mesh>
      ))}
    </group>
  );
}

function WatermelonSlice() {
  return (
    <group position={[0, 0.4, 0]}>
      {/* Slice — half-disc shape */}
      <mesh castShadow rotation={[0, 0, 0]}><cylinderGeometry args={[0.35, 0.35, 0.12, 16, 1, false, 0, Math.PI]} /><meshStandardMaterial color="#E53935" roughness={0.35} /></mesh>
      {/* Rind — green outer shell */}
      <mesh rotation={[0, 0, 0]}><cylinderGeometry args={[0.38, 0.38, 0.12, 16, 1, false, 0, Math.PI]} /><meshStandardMaterial color="#4CAF50" roughness={0.45} /></mesh>
      {/* White inner rind */}
      <mesh position={[0, 0, 0]}><cylinderGeometry args={[0.36, 0.36, 0.11, 16, 1, false, 0, Math.PI]} /><meshStandardMaterial color="#C8E6C9" roughness={0.4} /></mesh>
      {/* Red flesh on top */}
      <mesh position={[0, 0, 0]}><cylinderGeometry args={[0.32, 0.32, 0.1, 16, 1, false, 0, Math.PI]} /><meshStandardMaterial color="#EF5350" roughness={0.35} /></mesh>
      {/* Seeds */}
      {[[0.1, 0.07, 0.0], [-0.08, 0.07, 0.03], [0.15, 0.07, -0.03], [-0.15, 0.07, 0.01]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}><sphereGeometry args={[0.025, 6, 6]} /><meshStandardMaterial color="#212121" roughness={0.5} /></mesh>
      ))}
    </group>
  );
}

function Grapes() {
  return (
    <group position={[0, 0.4, 0]}>
      {/* Grape cluster */}
      {[
        [0, 0, 0], [0.12, 0.02, 0.05], [-0.12, 0.02, 0.05],
        [0.06, -0.12, 0.03], [-0.06, -0.12, 0.03], [0, -0.22, 0],
        [0.06, 0.12, 0.04], [-0.06, 0.12, 0.04],
      ].map(([x, y, z], i) => (
        <mesh key={i} castShadow position={[x, y, z]}><sphereGeometry args={[0.09, 10, 10]} /><meshStandardMaterial color={i % 2 === 0 ? '#7B1FA2' : '#9C27B0'} roughness={0.3} /></mesh>
      ))}
      {/* Stem */}
      <mesh position={[0, 0.22, 0]}><cylinderGeometry args={[0.015, 0.01, 0.12, 6]} /><meshStandardMaterial color="#5D4037" roughness={0.6} /></mesh>
      {/* Small leaf */}
      <mesh position={[0.05, 0.26, 0]} rotation={[0.3, 0, 0.4]}><sphereGeometry args={[0.05, 8, 6]} /><meshStandardMaterial color="#4CAF50" roughness={0.4} /></mesh>
    </group>
  );
}

function Mango() {
  return (
    <group position={[0, 0.42, 0]} rotation={[0, 0, 0.2]}>
      {/* Mango body — elongated sphere */}
      <mesh castShadow scale={[1, 0.8, 0.75]}><sphereGeometry args={[0.32, 14, 14]} /><meshStandardMaterial color="#FFB74D" roughness={0.35} /></mesh>
      {/* Red blush on one side */}
      <mesh position={[0.15, 0.1, 0.15]} scale={[1, 0.8, 0.75]}><sphereGeometry args={[0.18, 10, 10]} /><meshStandardMaterial color="#EF6C00" transparent opacity={0.5} roughness={0.35} /></mesh>
      {/* Stem */}
      <mesh position={[0.25, 0.08, 0]}><cylinderGeometry args={[0.02, 0.015, 0.08, 6]} /><meshStandardMaterial color="#5D4037" roughness={0.6} /></mesh>
    </group>
  );
}

// ─── VEGETABLES ───

function Carrot() {
  return (
    <group position={[0, 0.4, 0]} rotation={[0, 0, 0.15]}>
      {/* Body — tapered cone */}
      <mesh castShadow rotation={[0, 0, 0]}><coneGeometry args={[0.14, 0.6, 10]} /><meshStandardMaterial color="#FF7043" roughness={0.45} /></mesh>
      {/* Rings/texture lines */}
      {[-0.05, 0.05, 0.15].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}><torusGeometry args={[0.11 - i * 0.02, 0.008, 6, 12]} /><meshStandardMaterial color="#E64A19" roughness={0.5} /></mesh>
      ))}
      {/* Green tops */}
      {[-0.15, 0, 0.15].map((angle, i) => (
        <mesh key={i} position={[Math.sin(angle) * 0.02, 0.32, Math.cos(angle) * 0.02]} rotation={[Math.sin(angle) * 0.3, 0, Math.cos(angle) * 0.2]}>
          <cylinderGeometry args={[0.015, 0.008, 0.2, 6]} /><meshStandardMaterial color="#2E7D32" roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function Broccoli() {
  return (
    <group position={[0, 0.4, 0]}>
      {/* Stem */}
      <mesh castShadow position={[0, -0.1, 0]}><cylinderGeometry args={[0.08, 0.1, 0.25, 8]} /><meshStandardMaterial color="#66BB6A" roughness={0.5} /></mesh>
      {/* Floret clusters — rounded bumps on top */}
      {[
        [0, 0.1, 0, 0.16], [0.12, 0.08, 0.05, 0.12], [-0.12, 0.08, 0.05, 0.12],
        [0.05, 0.08, -0.12, 0.11], [-0.05, 0.08, 0.12, 0.11],
        [0, 0.18, 0, 0.1],
      ].map(([x, y, z, r], i) => (
        <mesh key={i} castShadow position={[x, y, z]}><sphereGeometry args={[r, 10, 10]} /><meshStandardMaterial color={i % 2 === 0 ? '#388E3C' : '#4CAF50'} roughness={0.5} /></mesh>
      ))}
    </group>
  );
}

function SpinachLeaf() {
  return (
    <group position={[0, 0.35, 0]}>
      {/* Leaves — flattened spheres as leaves */}
      {[
        { pos: [0, 0, 0] as const, rot: [0.3, 0, 0] as const, s: 1.0 },
        { pos: [0.12, 0.05, 0.08] as const, rot: [-0.2, 0.5, 0.1] as const, s: 0.85 },
        { pos: [-0.1, 0.03, -0.06] as const, rot: [0.2, -0.4, -0.1] as const, s: 0.9 },
      ].map((leaf, i) => (
        <mesh key={i} castShadow position={leaf.pos} rotation={leaf.rot} scale={[leaf.s, 0.15, leaf.s * 0.6]}>
          <sphereGeometry args={[0.25, 10, 8]} /><meshStandardMaterial color={i === 0 ? '#2E7D32' : '#388E3C'} roughness={0.45} side={THREE.DoubleSide} />
        </mesh>
      ))}
      {/* Stem vein lines */}
      <mesh position={[0, 0, 0]} rotation={[0.3, 0, 0]}><cylinderGeometry args={[0.01, 0.008, 0.35, 4]} /><meshStandardMaterial color="#1B5E20" roughness={0.5} /></mesh>
    </group>
  );
}

function BellPepper() {
  return (
    <group position={[0, 0.42, 0]}>
      {/* Body lobes */}
      {[0, 1.2, 2.4, 3.6, 4.8].map((angle, i) => (
        <mesh key={i} castShadow position={[Math.cos(angle) * 0.08, 0, Math.sin(angle) * 0.08]}>
          <sphereGeometry args={[0.2, 10, 10]} /><meshStandardMaterial color={i % 2 === 0 ? '#F44336' : '#E53935'} roughness={0.35} />
        </mesh>
      ))}
      {/* Green stem */}
      <mesh position={[0, 0.25, 0]}><cylinderGeometry args={[0.04, 0.06, 0.1, 8]} /><meshStandardMaterial color="#388E3C" roughness={0.4} /></mesh>
      <mesh position={[0, 0.32, 0]}><cylinderGeometry args={[0.02, 0.04, 0.06, 6]} /><meshStandardMaterial color="#2E7D32" roughness={0.4} /></mesh>
    </group>
  );
}

function Tomato() {
  return (
    <group position={[0, 0.42, 0]}>
      {/* Body */}
      <mesh castShadow scale={[1, 0.85, 1]}><sphereGeometry args={[0.28, 16, 16]} /><meshStandardMaterial color="#E53935" roughness={0.3} /></mesh>
      {/* Top indent */}
      <mesh position={[0, 0.2, 0]}><sphereGeometry args={[0.06, 8, 8]} /><meshStandardMaterial color="#C62828" roughness={0.35} /></mesh>
      {/* Star-shaped green leaves on top */}
      {[0, 1.26, 2.51, 3.77, 5.03].map((angle, i) => (
        <mesh key={i} position={[Math.cos(angle) * 0.06, 0.22, Math.sin(angle) * 0.06]} rotation={[0.6 * Math.cos(angle), angle, 0.3]}>
          <boxGeometry args={[0.03, 0.1, 0.015]} /><meshStandardMaterial color="#2E7D32" roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function Peas() {
  return (
    <group position={[0, 0.38, 0]} rotation={[0, 0, 0.1]}>
      {/* Pod — elongated shape */}
      <mesh castShadow scale={[1.8, 0.5, 0.6]}><sphereGeometry args={[0.2, 12, 10]} /><meshStandardMaterial color="#66BB6A" roughness={0.4} /></mesh>
      {/* Pod opening — top half lighter */}
      <mesh scale={[1.6, 0.35, 0.5]} position={[0, 0.05, 0]}><sphereGeometry args={[0.2, 12, 10, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#81C784" roughness={0.4} /></mesh>
      {/* Peas inside */}
      {[-0.14, -0.05, 0.05, 0.14].map((x, i) => (
        <mesh key={i} position={[x, 0.06, 0]}><sphereGeometry args={[0.06, 10, 10]} /><meshStandardMaterial color="#43A047" roughness={0.3} /></mesh>
      ))}
    </group>
  );
}

function SweetPotato() {
  return (
    <group position={[0, 0.4, 0]} rotation={[0, 0, 0.15]}>
      {/* Body — elongated oval */}
      <mesh castShadow scale={[1.4, 0.7, 0.7]}><sphereGeometry args={[0.25, 14, 14]} /><meshStandardMaterial color="#E65100" roughness={0.55} /></mesh>
      {/* Darker patches */}
      <mesh position={[0.1, 0.05, 0.12]} scale={[0.6, 0.3, 0.4]}><sphereGeometry args={[0.2, 8, 8]} /><meshStandardMaterial color="#BF360C" transparent opacity={0.4} roughness={0.6} /></mesh>
      {/* Root tip */}
      <mesh position={[0.3, -0.02, 0]} rotation={[0, 0, -0.3]}><coneGeometry args={[0.05, 0.1, 6]} /><meshStandardMaterial color="#BF360C" roughness={0.6} /></mesh>
    </group>
  );
}

function Cucumber() {
  return (
    <group position={[0, 0.4, 0]} rotation={[0, 0, Math.PI / 6]}>
      {/* Body — elongated cylinder with rounded caps */}
      <mesh castShadow><cylinderGeometry args={[0.12, 0.12, 0.55, 12]} /><meshStandardMaterial color="#4CAF50" roughness={0.4} /></mesh>
      {/* End caps */}
      <mesh position={[0, 0.28, 0]}><sphereGeometry args={[0.12, 10, 10]} /><meshStandardMaterial color="#388E3C" roughness={0.4} /></mesh>
      <mesh position={[0, -0.28, 0]}><sphereGeometry args={[0.12, 10, 10]} /><meshStandardMaterial color="#66BB6A" roughness={0.4} /></mesh>
      {/* Subtle ridges / bumps */}
      {[0.1, -0.05, -0.18].map((y, i) => (
        <mesh key={i} position={[0.1, y, 0.05]}><sphereGeometry args={[0.025, 6, 6]} /><meshStandardMaterial color="#388E3C" roughness={0.5} /></mesh>
      ))}
    </group>
  );
}

// ─── PROTEINS ───

function GrilledChicken() {
  return (
    <group position={[0, 0.4, 0]}>
      {/* Drumstick body */}
      <mesh castShadow rotation={[0, 0, 0.4]} scale={[1, 0.8, 0.9]}><sphereGeometry args={[0.25, 12, 12]} /><meshStandardMaterial color="#BCAAA4" roughness={0.5} /></mesh>
      {/* Grill lines */}
      {[-0.08, 0, 0.08].map((y, i) => (
        <mesh key={i} position={[0, y, 0.2]} rotation={[0, 0, 0.4]}><boxGeometry args={[0.35, 0.02, 0.01]} /><meshStandardMaterial color="#5D4037" roughness={0.5} /></mesh>
      ))}
      {/* Bone */}
      <mesh position={[-0.25, -0.18, 0]} rotation={[0, 0, 0.4]}><cylinderGeometry args={[0.03, 0.025, 0.3, 8]} /><meshStandardMaterial color="#FFF8E1" roughness={0.4} /></mesh>
      {/* Bone knob */}
      <mesh position={[-0.37, -0.28, 0]}><sphereGeometry args={[0.04, 8, 8]} /><meshStandardMaterial color="#FFF8E1" roughness={0.4} /></mesh>
    </group>
  );
}

function BoiledEgg() {
  return (
    <group position={[0, 0.42, 0]}>
      {/* Egg white — outer */}
      <mesh castShadow scale={[1, 1.2, 1]}><sphereGeometry args={[0.25, 14, 14]} /><meshStandardMaterial color="#FAFAFA" roughness={0.25} /></mesh>
      {/* Cut surface — flat face showing yolk */}
      <mesh position={[0, 0, 0.24]} rotation={[0, 0, 0]}><circleGeometry args={[0.22, 16]} /><meshStandardMaterial color="#FFFFFF" roughness={0.3} /></mesh>
      {/* Yolk circle */}
      <mesh position={[0, 0, 0.245]}><circleGeometry args={[0.12, 16]} /><meshStandardMaterial color="#FFD54F" roughness={0.3} /></mesh>
      {/* Yolk highlight */}
      <mesh position={[0.03, 0.03, 0.25]}><circleGeometry args={[0.04, 10]} /><meshStandardMaterial color="#FFECB3" roughness={0.3} /></mesh>
    </group>
  );
}

function FishFillet() {
  return (
    <group position={[0, 0.38, 0]}>
      {/* Fish body — flattened oval */}
      <mesh castShadow scale={[1.3, 0.45, 0.7]}><sphereGeometry args={[0.25, 12, 12]} /><meshStandardMaterial color="#90CAF9" roughness={0.3} metalness={0.15} /></mesh>
      {/* Tail fin */}
      <mesh position={[-0.32, 0.02, 0]} rotation={[0, 0, 0]} scale={[0.5, 0.8, 0.5]}>
        <coneGeometry args={[0.15, 0.2, 4]} /><meshStandardMaterial color="#64B5F6" roughness={0.35} />
      </mesh>
      {/* Eye */}
      <mesh position={[0.22, 0.06, 0.14]}><sphereGeometry args={[0.03, 8, 8]} /><meshStandardMaterial color="#FFFFFF" roughness={0.2} /></mesh>
      <mesh position={[0.22, 0.06, 0.16]}><sphereGeometry args={[0.015, 6, 6]} /><meshStandardMaterial color="#212121" roughness={0.2} /></mesh>
      {/* Fin on top */}
      <mesh position={[0, 0.12, 0]} rotation={[0, 0, 0]} scale={[0.7, 1, 0.3]}>
        <coneGeometry args={[0.08, 0.15, 4]} /><meshStandardMaterial color="#42A5F5" roughness={0.35} />
      </mesh>
    </group>
  );
}

function BeanBowl() {
  return (
    <group position={[0, 0.35, 0]}>
      {/* Bowl */}
      <mesh castShadow><cylinderGeometry args={[0.3, 0.2, 0.2, 16]} /><meshStandardMaterial color="#FFFFFF" roughness={0.3} /></mesh>
      {/* Bean fill surface */}
      <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.28, 0.28, 0.04, 16]} /><meshStandardMaterial color="#8D6E63" roughness={0.5} /></mesh>
      {/* Individual beans on top */}
      {[[0.08, 0.14, 0.05], [-0.06, 0.14, -0.08], [0.1, 0.14, -0.06], [-0.1, 0.14, 0.06], [0, 0.15, 0]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} scale={[1, 0.6, 0.7]}><sphereGeometry args={[0.05, 8, 8]} /><meshStandardMaterial color={i % 2 === 0 ? '#6D4C41' : '#8D6E63'} roughness={0.5} /></mesh>
      ))}
    </group>
  );
}

function Almonds() {
  return (
    <group position={[0, 0.38, 0]}>
      {/* Almond cluster */}
      {[
        { pos: [0, 0, 0] as const, rot: [0, 0, 0.3] as const },
        { pos: [0.15, 0.02, 0.08] as const, rot: [0.2, 0.5, -0.2] as const },
        { pos: [-0.12, 0.01, -0.05] as const, rot: [-0.1, -0.3, 0.4] as const },
        { pos: [0.05, 0.05, -0.12] as const, rot: [0.3, 0.2, -0.1] as const },
      ].map((almond, i) => (
        <mesh key={i} castShadow position={almond.pos} rotation={almond.rot} scale={[1, 0.6, 0.55]}>
          <sphereGeometry args={[0.1, 10, 10]} /><meshStandardMaterial color={i % 2 === 0 ? '#D7CCC8' : '#BCAAA4'} roughness={0.45} />
        </mesh>
      ))}
    </group>
  );
}

function LentilSoup() {
  return (
    <group position={[0, 0.38, 0]}>
      {/* Bowl */}
      <mesh castShadow><cylinderGeometry args={[0.3, 0.2, 0.22, 16]} /><meshStandardMaterial color="#8D6E63" roughness={0.4} /></mesh>
      {/* Soup surface */}
      <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.28, 0.28, 0.04, 16]} /><meshStandardMaterial color="#FF9800" roughness={0.45} /></mesh>
      {/* Lentil dots */}
      {[[0.08, 0.15, 0.05], [-0.1, 0.15, 0.05], [0, 0.15, -0.1], [0.12, 0.15, -0.05]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}><sphereGeometry args={[0.03, 6, 6]} /><meshStandardMaterial color="#E65100" roughness={0.5} /></mesh>
      ))}
      {/* Steam */}
      <mesh position={[0, 0.25, 0]}><sphereGeometry args={[0.04, 8, 8]} /><meshStandardMaterial color="#FFFFFF" transparent opacity={0.2} /></mesh>
      <mesh position={[0.05, 0.3, 0.03]}><sphereGeometry args={[0.03, 8, 8]} /><meshStandardMaterial color="#FFFFFF" transparent opacity={0.15} /></mesh>
    </group>
  );
}

// ─── GRAINS ───

function BrownBread() {
  return (
    <group position={[0, 0.42, 0]}>
      {/* Bread slice — rounded rectangle */}
      <mesh castShadow>
        <boxGeometry args={[0.4, 0.5, 0.12]} /><meshStandardMaterial color="#8D6E63" roughness={0.6} />
      </mesh>
      {/* Rounded top crust */}
      <mesh position={[0, 0.22, 0]} scale={[1, 0.5, 1]}><cylinderGeometry args={[0.2, 0.2, 0.12, 12, 1, false, 0, Math.PI]} /><meshStandardMaterial color="#6D4C41" roughness={0.6} /></mesh>
      {/* Inner lighter area */}
      <mesh position={[0, -0.02, 0.065]}><boxGeometry args={[0.32, 0.38, 0.01]} /><meshStandardMaterial color="#A1887F" roughness={0.5} /></mesh>
      {/* Grain specks */}
      {[[0.1, 0.1, 0.07], [-0.08, -0.05, 0.07], [0.05, -0.12, 0.07]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}><sphereGeometry args={[0.015, 6, 6]} /><meshStandardMaterial color="#5D4037" roughness={0.6} /></mesh>
      ))}
    </group>
  );
}

function Oatmeal() {
  return (
    <group position={[0, 0.35, 0]}>
      {/* Bowl */}
      <mesh castShadow><cylinderGeometry args={[0.3, 0.2, 0.2, 16]} /><meshStandardMaterial color="#F5F5F5" roughness={0.3} /></mesh>
      {/* Oatmeal surface */}
      <mesh position={[0, 0.11, 0]}><cylinderGeometry args={[0.28, 0.28, 0.04, 16]} /><meshStandardMaterial color="#D7CCC8" roughness={0.5} /></mesh>
      {/* Blueberry toppings */}
      {[[0.1, 0.14, 0.05], [-0.05, 0.14, 0.1], [0.05, 0.14, -0.08]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}><sphereGeometry args={[0.035, 8, 8]} /><meshStandardMaterial color="#3F51B5" roughness={0.35} /></mesh>
      ))}
      {/* Honey drizzle */}
      <mesh position={[0, 0.14, 0]} rotation={[0, 0.5, 0]}><torusGeometry args={[0.1, 0.015, 6, 12, Math.PI]} /><meshStandardMaterial color="#FFB74D" roughness={0.4} /></mesh>
    </group>
  );
}

function BrownRice() {
  return (
    <group position={[0, 0.35, 0]}>
      {/* Bowl */}
      <mesh castShadow><cylinderGeometry args={[0.28, 0.2, 0.2, 16]} /><meshStandardMaterial color="#FFFFFF" roughness={0.3} /></mesh>
      {/* Rice mound */}
      <mesh position={[0, 0.15, 0]}><sphereGeometry args={[0.22, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#A1887F" roughness={0.5} /></mesh>
      {/* Individual rice grains on top */}
      {[[0.05, 0.22, 0.02], [-0.06, 0.2, -0.04], [0.08, 0.19, -0.05], [-0.02, 0.23, 0.06]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[0.3 * i, 0.5 * i, 0]} scale={[1, 0.5, 0.5]}><sphereGeometry args={[0.025, 6, 6]} /><meshStandardMaterial color="#8D6E63" roughness={0.5} /></mesh>
      ))}
    </group>
  );
}

function WheatPasta() {
  return (
    <group position={[0, 0.38, 0]}>
      {/* Plate */}
      <mesh castShadow position={[0, -0.05, 0]}><cylinderGeometry args={[0.35, 0.35, 0.05, 16]} /><meshStandardMaterial color="#FFFFFF" roughness={0.2} /></mesh>
      {/* Pasta swirls */}
      {[0, 0.8, 1.6, 2.4, 3.2, 4.0].map((r, i) => (
        <mesh key={i} position={[Math.cos(r) * 0.1, 0.08, Math.sin(r) * 0.1]} rotation={[0.4 * Math.cos(r), r, 0.3 * Math.sin(r)]}>
          <torusGeometry args={[0.08, 0.025, 6, 12]} /><meshStandardMaterial color="#FFE082" roughness={0.4} />
        </mesh>
      ))}
      {/* Sauce on top */}
      <mesh position={[0, 0.12, 0]}><sphereGeometry args={[0.08, 10, 10]} /><meshStandardMaterial color="#E53935" roughness={0.4} /></mesh>
    </group>
  );
}

// ─── DAIRY ───

function MilkCarton() {
  return (
    <group position={[0, 0.48, 0]}>
      {/* Box body */}
      <mesh castShadow><boxGeometry args={[0.35, 0.55, 0.35]} /><meshStandardMaterial color="#FFFFFF" roughness={0.3} /></mesh>
      {/* Roof — triangular gable top */}
      <mesh position={[0, 0.32, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.25, 0.15, 4]} /><meshStandardMaterial color="#FFFFFF" roughness={0.3} />
      </mesh>
      {/* Blue brand stripe */}
      <mesh position={[0, 0.05, 0.18]}><boxGeometry args={[0.3, 0.2, 0.01]} /><meshStandardMaterial color="#1565C0" roughness={0.3} /></mesh>
      {/* "MILK" red label */}
      <mesh position={[0, -0.1, 0.18]}><boxGeometry args={[0.25, 0.12, 0.01]} /><meshStandardMaterial color="#E53935" roughness={0.35} /></mesh>
    </group>
  );
}

function YoghurtCup() {
  return (
    <group position={[0, 0.38, 0]}>
      {/* Cup */}
      <mesh castShadow><cylinderGeometry args={[0.22, 0.18, 0.35, 16]} /><meshStandardMaterial color="#FFFFFF" roughness={0.3} /></mesh>
      {/* Yoghurt surface */}
      <mesh position={[0, 0.15, 0]}><cylinderGeometry args={[0.2, 0.2, 0.04, 16]} /><meshStandardMaterial color="#FFF8E1" roughness={0.35} /></mesh>
      {/* Fruit swirl on top */}
      <mesh position={[0, 0.18, 0]} rotation={[0, 0, 0]}><torusGeometry args={[0.08, 0.025, 6, 12, Math.PI * 1.5]} /><meshStandardMaterial color="#F48FB1" roughness={0.35} /></mesh>
      {/* Pink label band */}
      <mesh position={[0, -0.02, 0]}><cylinderGeometry args={[0.225, 0.185, 0.15, 16]} /><meshStandardMaterial color="#F8BBD0" roughness={0.35} /></mesh>
    </group>
  );
}

/* ── Map item id to detailed model ── */
function HealthyFoodModel({ item }: { item: HealthyItemDef }) {
  switch (item.id) {
    // Hydration
    case 'HC-001': return <WaterBottle />;
    case 'HC-002': return <CoconutWater />;
    case 'HC-003': return <HerbalTea />;
    // Fruits
    case 'HC-004': return <RedApple />;
    case 'HC-005': return <Banana />;
    case 'HC-006': return <Orange />;
    case 'HC-007': return <Strawberry />;
    case 'HC-008': return <WatermelonSlice />;
    case 'HC-009': return <Grapes />;
    case 'HC-010': return <Mango />;
    // Vegetables
    case 'HC-011': return <Carrot />;
    case 'HC-012': return <Broccoli />;
    case 'HC-013': return <SpinachLeaf />;
    case 'HC-014': return <BellPepper />;
    case 'HC-015': return <Tomato />;
    case 'HC-016': return <Peas />;
    case 'HC-017': return <SweetPotato />;
    case 'HC-018': return <Cucumber />;
    // Proteins
    case 'HC-019': return <GrilledChicken />;
    case 'HC-020': return <BoiledEgg />;
    case 'HC-021': return <FishFillet />;
    case 'HC-022': return <BeanBowl />;
    case 'HC-023': return <Almonds />;
    case 'HC-024': return <LentilSoup />;
    // Grains
    case 'HC-025': return <BrownBread />;
    case 'HC-026': return <Oatmeal />;
    case 'HC-027': return <BrownRice />;
    case 'HC-028': return <WheatPasta />;
    // Dairy
    case 'HC-029': return <MilkCarton />;
    case 'HC-030': return <YoghurtCup />;
    default: return <RedApple />;
  }
}

/* ── Glow ring for food group identification ── */
function FoodGroupRing({ color }: { color: string }) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
      <ringGeometry args={[0.48, 0.55, 24]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} transparent opacity={0.4} side={THREE.DoubleSide} />
    </mesh>
  );
}

interface HealthyData {
  id: number;
  lane: number;
  z: number;
  y: number;
  collected: boolean;
  item: HealthyItemDef;
}

export function HealthyItems() {
  const [items, setItems] = useState<HealthyData[]>([]);
  const speed = useGameStore((state) => state.speed);
  const status = useGameStore((state) => state.status);
  const playerLane = useGameStore((state) => state.playerLane);
  const playerY = useGameStore((state) => state.playerY);
  const collectHealthyItem = useGameStore((state) => state.collectHealthyItem);

  const itemId = useRef(0);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (status !== 'playing') {
      if (items.length > 0) {
        setItems([]);
      }
      return;
    }

    // Rotate items
    if (groupRef.current) {
      groupRef.current.children.forEach((child) => {
        child.rotation.y += 3 * delta;
      });
    }

    setItems((prev) => {
      let newItems = prev.map((item) => ({
        ...item,
        z: item.z + speed * delta,
      }));

      // Collision detection
      newItems = newItems.map((item) => {
        if (!item.collected && Math.abs(item.z) < 1.2 && item.lane === playerLane) {
          if (Math.abs(item.y - playerY) < 1.5) {
            collectHealthyItem(
              item.item.foodGroup,
              item.item.points,
              { item: item.item.name, fact: item.item.fact, isHealthy: true, foodGroup: item.item.foodGroup }
            );
            return { ...item, collected: true };
          }
        }
        return item;
      });

      newItems = newItems.filter((item) => item.z < 10 && !item.collected);

      // Spawn new
      const minZ = newItems.length > 0 ? Math.min(...newItems.map(o => o.z)) : 0;
      if (minZ > SPAWN_Z + 18 && Math.random() > 0.3) {
        const lane = Math.floor(Math.random() * 3) - 1;
        const isHigh = Math.random() > 0.75;
        const itemDef = getRandomHealthyItem();

        // Spawn a line of food items (same food group for combo potential)
        const count = 2 + Math.floor(Math.random() * 2);
        for (let i = 0; i < count; i++) {
          newItems.push({
            id: itemId.current++,
            lane,
            z: SPAWN_Z - i * 4,
            y: isHigh ? 2.5 : 0.7,
            collected: false,
            item: i === 0 ? itemDef : (Math.random() > 0.4 ? itemDef : getRandomHealthyItem()),
          });
        }
      }

      return newItems;
    });
  });

  return (
    <group ref={groupRef}>
      {items.map((item) => {
        const groupColor = FOOD_GROUP_COLORS[item.item.foodGroup];
        return (
          <group key={item.id} position={[item.lane * LANE_WIDTH, item.y, item.z]}>
            <FoodGroupRing color={groupColor} />
            <Html position={[0, 0.5, 0]} center sprite distanceFactor={12} style={{ pointerEvents: 'none' }}>
              <div style={{ fontSize: '2.8rem', lineHeight: 1, filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.3))' }}>
                {FOOD_EMOJI[item.item.name] || '\u{1F34F}'}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
