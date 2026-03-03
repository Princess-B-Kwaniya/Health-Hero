import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from './store';
import { JunkItemDef, getRandomJunkItem } from './foodData';
import * as THREE from 'three';

const LANE_WIDTH = 2.5;
const SPAWN_Z = -150;


interface ObstacleData {
  id: number;
  lane: number;
  z: number;
  type: 'barrier' | 'overhead' | 'lowWall' | 'highBeam';
  junk: JunkItemDef;
}

/* â”€â”€ Detailed per-item 3D models â”€â”€ */

function ColaCan({ color }: { color: string }) {
  return (
    <group position={[0, 0.55, 0]}>
      {/* Body */}
      <mesh castShadow><cylinderGeometry args={[0.3, 0.3, 0.8, 20]} /><meshStandardMaterial color={color} metalness={0.65} roughness={0.15} /></mesh>
      {/* Top rim */}
      <mesh position={[0, 0.42, 0]}><cylinderGeometry args={[0.28, 0.3, 0.04, 20]} /><meshStandardMaterial color="#C0C0C0" metalness={0.85} roughness={0.1} /></mesh>
      {/* Pull tab */}
      <mesh position={[0, 0.46, 0]} rotation={[0, 0, 0]}><boxGeometry args={[0.08, 0.01, 0.15]} /><meshStandardMaterial color="#D0D0D0" metalness={0.9} roughness={0.1} /></mesh>
      {/* Label band */}
      <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.305, 0.305, 0.3, 20]} /><meshStandardMaterial color="#FFFFFF" metalness={0.1} roughness={0.3} transparent opacity={0.5} /></mesh>
      {/* Bottom ring */}
      <mesh position={[0, -0.42, 0]}><cylinderGeometry args={[0.3, 0.28, 0.04, 20]} /><meshStandardMaterial color="#C0C0C0" metalness={0.85} roughness={0.1} /></mesh>
    </group>
  );
}

function EnergyDrink({ color }: { color: string }) {
  return (
    <group position={[0, 0.6, 0]}>
      <mesh castShadow><cylinderGeometry args={[0.22, 0.22, 1.0, 20]} /><meshStandardMaterial color={color} metalness={0.7} roughness={0.12} /></mesh>
      <mesh position={[0, 0.52, 0]}><cylinderGeometry args={[0.2, 0.22, 0.04, 20]} /><meshStandardMaterial color="#A0A0A0" metalness={0.85} roughness={0.1} /></mesh>
      {/* Lightning bolt decal (Z-stripe) */}
      <mesh position={[0.24, 0, 0]} rotation={[0, 0, 0.3]}><boxGeometry args={[0.02, 0.5, 0.08]} /><meshStandardMaterial color="#FFD000" emissive="#FFD000" emissiveIntensity={0.6} /></mesh>
    </group>
  );
}

function Milkshake({ color }: { color: string }) {
  return (
    <group position={[0, 0.55, 0]}>
      {/* Cup */}
      <mesh castShadow><cylinderGeometry args={[0.32, 0.22, 0.7, 16]} /><meshStandardMaterial color="#FFFFFF" roughness={0.25} metalness={0.05} /></mesh>
      {/* Milkshake fill */}
      <mesh position={[0, 0.2, 0]}><sphereGeometry args={[0.35, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color={color} roughness={0.4} /></mesh>
      {/* Whipped cream top */}
      <mesh position={[0, 0.45, 0]}><sphereGeometry args={[0.2, 12, 12]} /><meshStandardMaterial color="#FFF8E1" roughness={0.6} /></mesh>
      {/* Straw */}
      <mesh position={[0.1, 0.65, 0]} rotation={[0, 0, -0.15]}><cylinderGeometry args={[0.025, 0.025, 0.6, 8]} /><meshStandardMaterial color="#E91E63" roughness={0.3} /></mesh>
      {/* Cherry */}
      <mesh position={[0, 0.58, 0]}><sphereGeometry args={[0.06, 10, 10]} /><meshStandardMaterial color="#D32F2F" roughness={0.3} /></mesh>
    </group>
  );
}

function Lollipop({ color }: { color: string }) {
  return (
    <group position={[0, 0.55, 0]}>
      {/* Stick */}
      <mesh><cylinderGeometry args={[0.03, 0.03, 0.6, 8]} /><meshStandardMaterial color="#F5F5DC" roughness={0.5} /></mesh>
      {/* Candy disc â€” spiral look via layered rings */}
      <mesh position={[0, 0.45, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.22, 0.1, 12, 24]} /><meshStandardMaterial color={color} roughness={0.25} /></mesh>
      <mesh position={[0, 0.45, 0]}><sphereGeometry args={[0.12, 12, 12]} /><meshStandardMaterial color="#FFFFFF" roughness={0.25} /></mesh>
      {/* Outer swirl ring */}
      <mesh position={[0, 0.45, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.3, 0.03, 8, 20]} /><meshStandardMaterial color="#FFFFFF" transparent opacity={0.7} roughness={0.25} /></mesh>
    </group>
  );
}

function GummyBears({ color }: { color: string }) {
  return (
    <group position={[0, 0.4, 0]}>
      {/* Three little bears in a row */}
      {[-0.22, 0, 0.22].map((x, i) => {
        const c = i === 0 ? '#FF5722' : i === 1 ? color : '#4CAF50';
        return (
          <group key={i} position={[x, 0, 0]}>
            {/* body */}
            <mesh castShadow><sphereGeometry args={[0.13, 12, 12]} /><meshStandardMaterial color={c} roughness={0.35} transparent opacity={0.85} /></mesh>
            {/* head */}
            <mesh position={[0, 0.15, 0]}><sphereGeometry args={[0.09, 10, 10]} /><meshStandardMaterial color={c} roughness={0.35} transparent opacity={0.85} /></mesh>
            {/* ears */}
            <mesh position={[-0.07, 0.22, 0]}><sphereGeometry args={[0.035, 8, 8]} /><meshStandardMaterial color={c} roughness={0.35} transparent opacity={0.85} /></mesh>
            <mesh position={[0.07, 0.22, 0]}><sphereGeometry args={[0.035, 8, 8]} /><meshStandardMaterial color={c} roughness={0.35} transparent opacity={0.85} /></mesh>
          </group>
        );
      })}
    </group>
  );
}

function ChocolateBar({ color }: { color: string }) {
  return (
    <group position={[0, 0.45, 0]}>
      {/* Wrapper */}
      <mesh castShadow><boxGeometry args={[0.75, 0.2, 0.4]} /><meshStandardMaterial color="#7B1FA2" metalness={0.2} roughness={0.3} /></mesh>
      {/* Exposed chocolate segments */}
      {[-0.2, 0, 0.2].map((x) => (
        <mesh key={x} position={[x, 0.14, 0]} castShadow><boxGeometry args={[0.18, 0.08, 0.35]} /><meshStandardMaterial color={color} roughness={0.5} /></mesh>
      ))}
    </group>
  );
}

function CottonCandy({ color }: { color: string }) {
  return (
    <group position={[0, 0.55, 0]}>
      {/* Stick */}
      <mesh><cylinderGeometry args={[0.025, 0.025, 0.55, 8]} /><meshStandardMaterial color="#F5F5DC" roughness={0.5} /></mesh>
      {/* Fluffy cloud layers */}
      <mesh position={[0, 0.35, 0]}><sphereGeometry args={[0.28, 12, 12]} /><meshStandardMaterial color={color} roughness={0.6} transparent opacity={0.8} /></mesh>
      <mesh position={[0.12, 0.4, 0]}><sphereGeometry args={[0.2, 10, 10]} /><meshStandardMaterial color="#F8BBD0" roughness={0.6} transparent opacity={0.75} /></mesh>
      <mesh position={[-0.1, 0.42, 0.06]}><sphereGeometry args={[0.18, 10, 10]} /><meshStandardMaterial color="#E1BEE7" roughness={0.6} transparent opacity={0.75} /></mesh>
    </group>
  );
}

const FRIES_DATA = [
  { pos: [-0.12, 0.4, -0.04] as const, rot: [-0.1, 0, 0.05] as const, h: 0.38 },
  { pos: [0.05, 0.45, 0.03] as const, rot: [0.08, 0, -0.12] as const, h: 0.42 },
  { pos: [-0.05, 0.42, -0.08] as const, rot: [-0.05, 0, 0.1] as const, h: 0.35 },
  { pos: [0.14, 0.38, 0.06] as const, rot: [0.12, 0, -0.07] as const, h: 0.4 },
  { pos: [0, 0.48, 0.02] as const, rot: [-0.08, 0, 0.06] as const, h: 0.44 },
];

function FrenchFries({ color }: { color: string }) {
  return (
    <group position={[0, 0.45, 0]}>
      {/* Red carton */}
      <mesh castShadow><boxGeometry args={[0.5, 0.45, 0.35]} /><meshStandardMaterial color="#D32F2F" roughness={0.4} /></mesh>
      {/* Fries sticking up */}
      {FRIES_DATA.map((f, i) => (
        <mesh key={i} position={[f.pos[0], f.pos[1], f.pos[2]]} rotation={[f.rot[0], f.rot[1], f.rot[2]]}>
          <boxGeometry args={[0.06, f.h, 0.06]} />
          <meshStandardMaterial color={color} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function FriedChickenModel({ color }: { color: string }) {
  return (
    <group position={[0, 0.4, 0]}>
      {/* Drumstick body */}
      <mesh castShadow rotation={[0, 0, 0.4]}><sphereGeometry args={[0.25, 12, 12]} /><meshStandardMaterial color={color} roughness={0.6} /></mesh>
      {/* Crispy bumps */}
      <mesh position={[0.15, 0.1, 0.12]}><sphereGeometry args={[0.1, 8, 8]} /><meshStandardMaterial color="#E8A040" roughness={0.7} /></mesh>
      <mesh position={[-0.1, 0.12, -0.1]}><sphereGeometry args={[0.08, 8, 8]} /><meshStandardMaterial color="#D49030" roughness={0.7} /></mesh>
      {/* Bone */}
      <mesh position={[-0.25, -0.15, 0]} rotation={[0, 0, 0.4]}><cylinderGeometry args={[0.035, 0.025, 0.35, 8]} /><meshStandardMaterial color="#FFF8E1" roughness={0.4} /></mesh>
    </group>
  );
}

function DoughnutModel({ color }: { color: string }) {
  return (
    <group position={[0, 0.45, 0]}>
      {/* Dough ring */}
      <mesh castShadow rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.25, 0.12, 16, 24]} /><meshStandardMaterial color="#D4A050" roughness={0.5} /></mesh>
      {/* Icing on top */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}><torusGeometry args={[0.25, 0.1, 12, 24, Math.PI]} /><meshStandardMaterial color={color} roughness={0.3} /></mesh>
      {/* Sprinkles */}
      {[[-0.15, 0.08, 0.08], [0.1, 0.09, -0.12], [0.18, 0.07, 0.05], [-0.08, 0.09, -0.15]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[0, i, i * 0.5]}><boxGeometry args={[0.04, 0.015, 0.015]} /><meshStandardMaterial color={['#FF4444', '#FFD000', '#4CAF50', '#2196F3'][i]} /></mesh>
      ))}
    </group>
  );
}

function ChipsModel({ color }: { color: string }) {
  return (
    <group position={[0, 0.45, 0]}>
      {/* Bag */}
      <mesh castShadow><boxGeometry args={[0.55, 0.6, 0.2]} /><meshStandardMaterial color={color} roughness={0.4} metalness={0.3} /></mesh>
      {/* Top crinkle */}
      <mesh position={[0, 0.35, 0]}><boxGeometry args={[0.35, 0.12, 0.15]} /><meshStandardMaterial color={color} roughness={0.35} metalness={0.3} /></mesh>
      {/* Label stripe */}
      <mesh position={[0, -0.05, 0.11]}><boxGeometry args={[0.5, 0.25, 0.01]} /><meshStandardMaterial color="#FFFFFF" transparent opacity={0.6} roughness={0.3} /></mesh>
    </group>
  );
}

function CheesePuffs({ color }: { color: string }) {
  return (
    <group position={[0, 0.4, 0]}>
      {/* Scattered puffs */}
      {[[0, 0, 0], [0.2, 0.05, 0.08], [-0.18, 0.02, -0.06], [0.08, 0.1, -0.12], [-0.1, 0.08, 0.1]].map(([x, y, z], i) => (
        <mesh key={i} castShadow position={[x, y, z]}><sphereGeometry args={[0.1 + i * 0.01, 8, 8]} /><meshStandardMaterial color={color} roughness={0.6} /></mesh>
      ))}
      {/* Bowl underneath */}
      <mesh position={[0, -0.08, 0]}><cylinderGeometry args={[0.35, 0.25, 0.12, 16]} /><meshStandardMaterial color="#8D6E63" roughness={0.5} /></mesh>
    </group>
  );
}

function NoodlesModel({ color }: { color: string }) {
  return (
    <group position={[0, 0.45, 0]}>
      {/* Cup */}
      <mesh castShadow><cylinderGeometry args={[0.3, 0.22, 0.6, 16]} /><meshStandardMaterial color="#F5F5F5" roughness={0.3} /></mesh>
      {/* Noodle swirls sticking up */}
      {[0, 1.2, 2.4].map((r, i) => (
        <mesh key={i} position={[Math.cos(r) * 0.1, 0.38, Math.sin(r) * 0.1]} rotation={[0.3, r, 0]}>
          <torusGeometry args={[0.08, 0.02, 6, 12]} />
          <meshStandardMaterial color={color} roughness={0.5} />
        </mesh>
      ))}
      {/* Steam wisps */}
      <mesh position={[0, 0.55, 0]}><sphereGeometry args={[0.06, 8, 8]} /><meshStandardMaterial color="#FFFFFF" transparent opacity={0.3} /></mesh>
      <mesh position={[0.08, 0.6, 0.04]}><sphereGeometry args={[0.04, 8, 8]} /><meshStandardMaterial color="#FFFFFF" transparent opacity={0.2} /></mesh>
    </group>
  );
}

function CakeSliceModel({ color }: { color: string }) {
  return (
    <group position={[0, 0.4, 0]}>
      {/* Cake triangular wedge â€“ built from box */}
      <mesh castShadow rotation={[0, 0.3, 0]}><boxGeometry args={[0.6, 0.4, 0.5]} /><meshStandardMaterial color="#FFF8E1" roughness={0.5} /></mesh>
      {/* Icing layer on top */}
      <mesh position={[0, 0.22, 0]} rotation={[0, 0.3, 0]}><boxGeometry args={[0.62, 0.06, 0.52]} /><meshStandardMaterial color={color} roughness={0.3} /></mesh>
      {/* Middle cream layer */}
      <mesh position={[0, 0.02, 0]} rotation={[0, 0.3, 0]}><boxGeometry args={[0.58, 0.04, 0.48]} /><meshStandardMaterial color="#FFFFFF" roughness={0.4} /></mesh>
      {/* Cherry on top */}
      <mesh position={[0, 0.3, 0]}><sphereGeometry args={[0.06, 10, 10]} /><meshStandardMaterial color="#D32F2F" roughness={0.3} /></mesh>
    </group>
  );
}

function IceCreamModel({ color }: { color: string }) {
  return (
    <group position={[0, 0.5, 0]}>
      {/* Waffle cone */}
      <mesh castShadow position={[0, -0.15, 0]} rotation={[Math.PI, 0, 0]}><coneGeometry args={[0.2, 0.45, 12]} /><meshStandardMaterial color="#D4A055" roughness={0.6} /></mesh>
      {/* Scoop 1 */}
      <mesh position={[0, 0.15, 0]}><sphereGeometry args={[0.2, 14, 14]} /><meshStandardMaterial color={color} roughness={0.35} /></mesh>
      {/* Scoop 2 */}
      <mesh position={[0, 0.38, 0]}><sphereGeometry args={[0.17, 14, 14]} /><meshStandardMaterial color="#FFF8E1" roughness={0.35} /></mesh>
      {/* Scoop 3 */}
      <mesh position={[0.08, 0.52, 0]}><sphereGeometry args={[0.13, 12, 12]} /><meshStandardMaterial color="#8D6E63" roughness={0.35} /></mesh>
      {/* Wafer stick */}
      <mesh position={[0.12, 0.55, 0]} rotation={[0, 0, -0.3]}><boxGeometry args={[0.03, 0.3, 0.03]} /><meshStandardMaterial color="#D4A055" roughness={0.5} /></mesh>
    </group>
  );
}

/* â”€â”€ Map item id to creative model â”€â”€ */
function JunkFoodModel({ junk }: { junk: JunkItemDef }) {
  switch (junk.id) {
    case 'JF-001': return <ColaCan color={junk.color} />;
    case 'JF-002': return <EnergyDrink color={junk.color} />;
    case 'JF-003': return <Milkshake color={junk.color} />;
    case 'JF-004': return <Lollipop color={junk.color} />;
    case 'JF-005': return <GummyBears color={junk.color} />;
    case 'JF-006': return <ChocolateBar color={junk.color} />;
    case 'JF-007': return <CottonCandy color={junk.color} />;
    case 'JF-008': return <FrenchFries color={junk.color} />;
    case 'JF-009': return <FriedChickenModel color={junk.color} />;
    case 'JF-010': return <DoughnutModel color={junk.color} />;
    case 'JF-011': return <ChipsModel color={junk.color} />;
    case 'JF-012': return <CheesePuffs color={junk.color} />;
    case 'JF-013': return <NoodlesModel color={junk.color} />;
    case 'JF-014': return <CakeSliceModel color={junk.color} />;
    case 'JF-015': return <IceCreamModel color={junk.color} />;
    default: return <ColaCan color={junk.color} />;
  }
}

/* â”€â”€ Animated glow ring around barrier obstacles â”€â”€ */
function PulseRing({ color, radius = 0.8 }: { color: string; radius?: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
      <ringGeometry args={[radius - 0.06, radius, 32]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} transparent opacity={0.4} side={THREE.DoubleSide} />
    </mesh>
  );
}

export function Obstacles() {
  const [obstacles, setObstacles] = useState<ObstacleData[]>([]);
  const speed = useGameStore((state) => state.speed);
  const status = useGameStore((state) => state.status);
  const hitJunkFood = useGameStore((state) => state.hitJunkFood);
  const endGame = useGameStore((state) => state.endGame);
  const playerLane = useGameStore((state) => state.playerLane);
  const playerY = useGameStore((state) => state.playerY);
  const playerHeight = useGameStore((state) => state.playerHeight);

  const obstacleId = useRef(0);

  useFrame((_, delta) => {
    if (status !== 'playing') {
      if (obstacles.length > 0) {
        setObstacles([]);
      }
      return;
    }

    setObstacles((prev) => {
      let newObstacles = prev.map((obs) => ({
        ...obs,
        z: obs.z + speed * delta,
      }));

      // Collision detection
      for (const obs of newObstacles) {
        const obsDepth = (obs.type === 'lowWall' || obs.type === 'highBeam') ? 3 : 1;
        const obsMinZ = obs.z - obsDepth / 2;
        const obsMaxZ = obs.z + obsDepth / 2;

        if (obsMaxZ > -0.5 && obsMinZ < 0.5 && obs.lane === playerLane) {
          let hit = false;
          const pMinY = playerY - playerHeight / 2;
          const pMaxY = playerY + playerHeight / 2;

          if (obs.type === 'barrier') {
            if (pMinY < 1) hit = true;
          } else if (obs.type === 'overhead') {
            if (pMaxY > 0.5) hit = true;
          } else if (obs.type === 'lowWall') {
            // Low wall — must JUMP over (hits if player is low)
            if (pMinY < 0.9) hit = true;
          } else if (obs.type === 'highBeam') {
            // High beam — must ROLL under (hits if player is tall/standing)
            if (pMaxY > 0.6) hit = true;
          }

          if (hit) {
            if (obs.type === 'lowWall' || obs.type === 'highBeam') {
              // Big boxes = instant game over
              endGame();
              return [];
            }
            hitJunkFood(
              obs.junk.penalty,
              obs.junk.effect,
              obs.junk.effectDuration,
              { item: obs.junk.name, fact: obs.junk.fact, isHealthy: false }
            );
            newObstacles = newObstacles.filter(o => o.id !== obs.id);
            return newObstacles;
          }
        }
      }

      newObstacles = newObstacles.filter((obs) => obs.z < 10);

      // Spawn new
      const minZ = newObstacles.length > 0 ? Math.min(...newObstacles.map(o => o.z)) : 0;
      if (minZ > SPAWN_Z + 30) {
        const numToSpawn = Math.random() > 0.7 ? 2 : 1;
        const usedLanes = new Set<number>();

        for (let i = 0; i < numToSpawn; i++) {
          let lane;
          do {
            lane = Math.floor(Math.random() * 3) - 1;
          } while (usedLanes.has(lane));
          usedLanes.add(lane);

          const rand = Math.random();
          let type: 'barrier' | 'overhead' | 'lowWall' | 'highBeam' = 'barrier';
          if (rand > 0.82) type = 'lowWall';
          else if (rand > 0.65) type = 'highBeam';
          else if (rand > 0.35) type = 'overhead';

          newObstacles.push({
            id: obstacleId.current++,
            lane,
            z: SPAWN_Z - (Math.random() * 5),
            type,
            junk: getRandomJunkItem(),
          });
        }
      }

      return newObstacles;
    });
  });

  return (
    <>
      {obstacles.map((obs) => {
        const warningColor = '#EF5350';

        if (obs.type === 'barrier') {
          return (
            <group key={obs.id} position={[obs.lane * LANE_WIDTH, 0, obs.z]}>
              {/* Ground warning ring */}
              <PulseRing color={warningColor} />

              {/* The creative food model */}
              <JunkFoodModel junk={obs.junk} />


            </group>
          );
        } else if (obs.type === 'overhead') {
          return (
            <group key={obs.id} position={[obs.lane * LANE_WIDTH, 0, obs.z]}>
              {/* Two support poles â€” metallic pipe look */}
              {[-0.9, 0.9].map((x) => (
                <group key={x}>
                  <mesh castShadow position={[x, 1.0, 0]}><cylinderGeometry args={[0.055, 0.06, 2.0, 12]} /><meshStandardMaterial color="#707070" metalness={0.7} roughness={0.2} /></mesh>
                  {/* Bolt detail */}
                  <mesh position={[x, 1.98, 0]}><sphereGeometry args={[0.07, 8, 8]} /><meshStandardMaterial color="#505050" metalness={0.8} roughness={0.15} /></mesh>
                </group>
              ))}

              {/* Hanging food model (scaled up slightly, raised) */}
              <group position={[0, 1.0, 0]} scale={[1.3, 1.3, 1.3]}>
                <JunkFoodModel junk={obs.junk} />
              </group>

              {/* Red warning bar along bottom */}
              <mesh position={[0, 0.95, 0]}><boxGeometry args={[2.0, 0.08, 0.9]} /><meshStandardMaterial color={warningColor} emissive={warningColor} emissiveIntensity={0.5} /></mesh>

              {/* Top cross-bar */}
              <mesh position={[0, 2.0, 0]}><boxGeometry args={[2.0, 0.08, 0.08]} /><meshStandardMaterial color="#505050" metalness={0.7} roughness={0.2} /></mesh>


            </group>
          );
        } else if (obs.type === 'lowWall') {
          return (
            <group key={obs.id} position={[obs.lane * LANE_WIDTH, 0, obs.z]}>
              <mesh castShadow receiveShadow position={[0, 0.45, 0]}>
                <boxGeometry args={[2.4, 0.9, 3]} />
                <meshStandardMaterial color="#E65100" roughness={0.4} metalness={0.15} />
              </mesh>
              {[-0.6, 0, 0.6].map((x) => (
                <mesh key={x} position={[x, 0.45, 1.52]}>
                  <boxGeometry args={[0.4, 0.7, 0.02]} />
                  <meshStandardMaterial color="#FFD000" emissive="#FFD000" emissiveIntensity={0.4} />
                </mesh>
              ))}
              {[-0.8, 0.8].map((x) => (
                <group key={x} position={[x, 0.45, 1.53]}>
                  <mesh><boxGeometry args={[0.08, 0.5, 0.02]} /><meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.6} /></mesh>
                  <mesh position={[0, 0.3, 0]} rotation={[0, 0, Math.PI / 4]}><boxGeometry args={[0.08, 0.22, 0.02]} /><meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.6} /></mesh>
                  <mesh position={[0, 0.3, 0]} rotation={[0, 0, -Math.PI / 4]}><boxGeometry args={[0.08, 0.22, 0.02]} /><meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.6} /></mesh>
                </group>
              ))}
              <group position={[0, 0.9, 0]}>
                <JunkFoodModel junk={obs.junk} />
              </group>
              <PulseRing color="#FF9800" radius={1.4} />
            </group>
          );
        } else if (obs.type === 'highBeam') {
          return (
            <group key={obs.id} position={[obs.lane * LANE_WIDTH, 0, obs.z]}>
              {[-1.1, 1.1].map((x) => (
                <mesh key={x} castShadow position={[x, 1.25, 0]}>
                  <boxGeometry args={[0.2, 2.5, 0.2]} />
                  <meshStandardMaterial color="#455A64" metalness={0.6} roughness={0.25} />
                </mesh>
              ))}
              <mesh castShadow receiveShadow position={[0, 1.3, 0]}>
                <boxGeometry args={[2.4, 1.2, 3]} />
                <meshStandardMaterial color="#7B1FA2" roughness={0.35} metalness={0.2} />
              </mesh>
              <mesh position={[0, 0.72, 1.52]}>
                <boxGeometry args={[2.2, 0.08, 0.02]} />
                <meshStandardMaterial color="#FFD000" emissive="#FFD000" emissiveIntensity={0.5} />
              </mesh>
              {[-0.7, 0, 0.7].map((x) => (
                <group key={x} position={[x, 0.9, 1.53]}>
                  <mesh><boxGeometry args={[0.08, 0.35, 0.02]} /><meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={0.6} /></mesh>
                  <mesh position={[0, -0.22, 0]} rotation={[0, 0, Math.PI / 4]}><boxGeometry args={[0.08, 0.18, 0.02]} /><meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={0.6} /></mesh>
                  <mesh position={[0, -0.22, 0]} rotation={[0, 0, -Math.PI / 4]}><boxGeometry args={[0.08, 0.18, 0.02]} /><meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={0.6} /></mesh>
                </group>
              ))}
              <group position={[0, 0.2, 0]} scale={[0.8, 0.8, 0.8]}>
                <JunkFoodModel junk={obs.junk} />
              </group>
              <PulseRing color="#7B1FA2" radius={1.4} />
            </group>
          );
        } else {
          return null;
        }
      })}
    </>
  );
}