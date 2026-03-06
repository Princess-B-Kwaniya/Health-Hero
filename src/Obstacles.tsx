import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useGameStore } from './store';
import { JunkItemDef, getRandomJunkItem, FOOD_EMOJI } from './foodData';
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

// --- Simplified 3D models with lower segment counts ---

function ColaCan({ color }: { color: string }) {
  return (
    <group position={[0, 0.55, 0]}>
      <mesh castShadow><cylinderGeometry args={[0.3, 0.3, 0.8, 8]} /><meshStandardMaterial color={color} metalness={0.6} /></mesh>
      <mesh position={[0, 0.42, 0]}><cylinderGeometry args={[0.28, 0.3, 0.04, 8]} /><meshStandardMaterial color="#C0C0C0" /></mesh>
    </group>
  );
}

function EnergyDrink({ color }: { color: string }) {
  return (
    <group position={[0, 0.6, 0]}>
      <mesh castShadow><cylinderGeometry args={[0.22, 0.22, 1.0, 8]} /><meshStandardMaterial color={color} metalness={0.7} /></mesh>
      <mesh position={[0, 0.52, 0]}><cylinderGeometry args={[0.2, 0.22, 0.04, 8]} /><meshStandardMaterial color="#A0A0A0" /></mesh>
    </group>
  );
}

function Milkshake({ color }: { color: string }) {
  return (
    <group position={[0, 0.55, 0]}>
      <mesh castShadow><cylinderGeometry args={[0.32, 0.22, 0.7, 8]} /><meshStandardMaterial color="#FFFFFF" /></mesh>
      <mesh position={[0, 0.2, 0]}><sphereGeometry args={[0.35, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color={color} /></mesh>
    </group>
  );
}

function Lollipop({ color }: { color: string }) {
  return (
    <group position={[0, 0.55, 0]}>
      <mesh><cylinderGeometry args={[0.03, 0.03, 0.6, 6]} /><meshStandardMaterial color="#F5F5DC" /></mesh>
      <mesh castShadow position={[0, 0.45, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.22, 0.1, 8, 12]} /><meshStandardMaterial color={color} /></mesh>
    </group>
  );
}

function JunkFoodModel({ junk }: { junk: JunkItemDef }) {
  switch (junk.id) {
    case 'JF-001': return <ColaCan color={junk.color} />;
    case 'JF-002': return <EnergyDrink color={junk.color} />;
    case 'JF-003': return <Milkshake color={junk.color} />;
    case 'JF-004': return <Lollipop color={junk.color} />;
    default: return <ColaCan color={junk.color} />;
  }
}

function PulseRing({ color, radius = 0.8 }: { color: string; radius?: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
      <ringGeometry args={[radius - 0.06, radius, 12]} />
      <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} />
    </mesh>
  );
}

export function Obstacles() {
  const [obstacleData, setObstacleData] = useState<ObstacleData[]>([]);
  const status = useGameStore((state) => state.status);
  const obstacleId = useRef(0);

  useFrame((_, delta) => {
    if (status !== 'playing') {
      if (obstacleData.length > 0) setObstacleData([]);
      return;
    }

    const state = useGameStore.getState();
    const speed = state.speed;
    const playerLane = state.playerLane;
    const playerY = state.playerY;
    const playerHeight = state.playerHeight;

    setObstacleData(prev => {
      let updated = prev.map(obs => ({ ...obs, z: obs.z + speed * delta }));

      for (const obs of updated) {
        if (Math.abs(obs.z) < 1.0 && obs.lane === playerLane) {
          let hit = false;
          const pMinY = playerY - playerHeight / 2;
          const pMaxY = playerY + playerHeight / 2;

          if (obs.type === 'barrier' && pMinY < 1) hit = true;
          else if (obs.type === 'overhead' && pMaxY > 0.5) hit = true;
          else if (obs.type === 'lowWall' && pMinY < 0.9) hit = true;
          else if (obs.type === 'highBeam' && pMaxY > 0.6) hit = true;

          if (hit) {
            if (obs.type === 'lowWall' || obs.type === 'highBeam') {
              state.endGame();
              return [];
            }
            state.hitJunkFood(obs.junk.penalty, obs.junk.effect, obs.junk.effectDuration, { item: obs.junk.name, fact: obs.junk.fact, isHealthy: false });
            return updated.filter(o => o.id !== obs.id);
          }
        }
      }

      const filtered = updated.filter(obs => obs.z < 10);
      const minZ = filtered.length > 0 ? Math.min(...filtered.map(o => o.z)) : 0;
      if (minZ > SPAWN_Z + 40) {
        const lane = Math.floor(Math.random() * 3) - 1;
        const rand = Math.random();
        let type: ObstacleData['type'] = 'barrier';
        if (rand > 0.85) type = 'lowWall';
        else if (rand > 0.7) type = 'highBeam';
        else if (rand > 0.4) type = 'overhead';

        filtered.push({
          id: obstacleId.current++,
          lane,
          z: SPAWN_Z,
          type,
          junk: getRandomJunkItem(),
        });
      }
      return filtered;
    });
  });

  return (
    <>
      {obstacleData.map((obs) => {
        const warningColor = '#EF5350';
        return (
          <group key={obs.id} position={[obs.lane * LANE_WIDTH, 0, obs.z]}>
            {obs.type === 'barrier' && (
              <>
                <PulseRing color={warningColor} />
                <JunkFoodModel junk={obs.junk} />
                <Html position={[0, 0.7, 0]} center sprite distanceFactor={12} style={{ pointerEvents: 'none' }}>
                  <div style={{ fontSize: '2.8rem', lineHeight: 1, filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.3))' }}>
                    {FOOD_EMOJI[obs.junk.name] || '\u{1F6AB}'}
                  </div>
                </Html>
              </>
            )}
            {obs.type === 'overhead' && (
              <>
                {[-0.9, 0.9].map((x) => (
                  <group key={x}>
                    <mesh castShadow position={[x, 1.0, 0]}><cylinderGeometry args={[0.04, 0.04, 2, 4]} /><meshStandardMaterial color="#707070" /></mesh>
                    <mesh position={[x, 1.98, 0]}><sphereGeometry args={[0.07, 8, 8]} /><meshStandardMaterial color="#505050" /></mesh>
                  </group>
                ))}
                <group position={[0, 1.1, 0]} scale={[1.2, 1.2, 1.2]}><JunkFoodModel junk={obs.junk} /></group>
                <Html position={[0, 1.4, 0]} center sprite distanceFactor={12} style={{ pointerEvents: 'none' }}>
                  <div style={{ fontSize: '2.8rem', lineHeight: 1, filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.3))' }}>
                    {FOOD_EMOJI[obs.junk.name] || '\u{1F6AB}'}
                  </div>
                </Html>
                <mesh position={[0, 0.95, 0]}><boxGeometry args={[2.0, 0.05, 0.9]} /><meshStandardMaterial color={warningColor} transparent opacity={0.4} /></mesh>
                <mesh position={[0, 2, 0]}><boxGeometry args={[2, 0.05, 0.05]} /><meshStandardMaterial color="#505050" /></mesh>
              </>
            )}
            {obs.type === 'lowWall' && (
              <>
                <mesh castShadow receiveShadow position={[0, 0.45, 0]}><boxGeometry args={[2.4, 0.9, 3]} /><meshStandardMaterial color="#E65100" /></mesh>
                <group position={[0, 0.9, 0]}><JunkFoodModel junk={obs.junk} /></group>
                <PulseRing color="#FF9800" radius={1.4} />
                <Html position={[0, 1.2, 0]} center sprite distanceFactor={12} style={{ pointerEvents: 'none' }}>
                  <div style={{ fontSize: '2.8rem', lineHeight: 1, filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.3))' }}>
                    {FOOD_EMOJI[obs.junk.name] || '\u{1F6AB}'}
                  </div>
                </Html>
              </>
            )}
            {obs.type === 'highBeam' && (
              <>
                <mesh castShadow receiveShadow position={[0, 1.3, 0]}><boxGeometry args={[2.4, 1.2, 3]} /><meshStandardMaterial color="#7B1FA2" /></mesh>
                <group position={[0, 0.2, 0]} scale={[0.8, 0.8, 0.8]}><JunkFoodModel junk={obs.junk} /></group>
                <PulseRing color="#7B1FA2" radius={1.4} />
                <Html position={[0, 1.5, 0]} center sprite distanceFactor={12} style={{ pointerEvents: 'none' }}>
                  <div style={{ fontSize: '2.8rem', lineHeight: 1, filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.3))' }}>
                    {FOOD_EMOJI[obs.junk.name] || '\u{1F6AB}'}
                  </div>
                </Html>
              </>
            )}
          </group>
        );
      })}
    </>
  );
}