import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useGameStore } from './store';
import { JunkItemDef, getRandomJunkItem } from './foodData';
import * as THREE from 'three';

const LANE_WIDTH = 2.5;
const SPAWN_Z = -150;

interface ObstacleData {
  id: number;
  lane: number;
  z: number;
  type: 'barrier' | 'overhead' | 'train';
  junk: JunkItemDef;
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
        const obsDepth = obs.type === 'train' ? 6 : 1;
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
          } else if (obs.type === 'train') {
            hit = true;
          }

          if (hit) {
            // For "train" (large wall) obstacles, it's game over instantly
            if (obs.type === 'train') {
              endGame();
              return prev;
            }
            // For smaller junk food obstacles, apply penalty effects
            hitJunkFood(
              obs.junk.penalty,
              obs.junk.effect,
              obs.junk.effectDuration,
              { item: obs.junk.name, fact: obs.junk.fact, isHealthy: false }
            );
            // Remove this obstacle after hit
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
          let type: 'barrier' | 'overhead' | 'train' = 'barrier';
          if (rand > 0.85) type = 'train';
          else if (rand > 0.45) type = 'overhead';

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
        const junkColor = obs.junk.color;
        const warningColor = '#EF5350';
        const categoryColors: Record<string, string> = {
          'Sugary Drinks': '#B71C1C',
          'Candy & Sweets': '#E91E63',
          'Fried Foods': '#FF8F00',
          'Processed Snacks': '#FDD835',
          'Excessive Sugar': '#EC407A',
        };
        const catColor = categoryColors[obs.junk.category] || warningColor;

        if (obs.type === 'barrier') {
          // --- Recognizable junk food obstacle based on shape ---
          return (
            <group key={obs.id} position={[obs.lane * LANE_WIDTH, 0, obs.z]}>
              {/* Base platform so players can see where it sits */}
              <mesh castShadow receiveShadow position={[0, 0.1, 0]}>
                <boxGeometry args={[1.6, 0.2, 1.2]} />
                <meshStandardMaterial color="#2A2A2A" roughness={0.4} metalness={0.1} />
              </mesh>

              {/* Main junk food shape - varies by item shape */}
              {obs.junk.shape === 'cylinder' ? (
                // Cans / Bottles — tall cylinder
                <mesh castShadow receiveShadow position={[0, 0.65, 0]}>
                  <cylinderGeometry args={[0.35, 0.3, 0.9, 16]} />
                  <meshStandardMaterial color={junkColor} roughness={0.25} metalness={0.2} />
                </mesh>
              ) : obs.junk.shape === 'sphere' ? (
                // Candy / sweets — round shape
                <mesh castShadow receiveShadow position={[0, 0.6, 0]}>
                  <sphereGeometry args={[0.4, 16, 16]} />
                  <meshStandardMaterial color={junkColor} roughness={0.3} metalness={0.05} />
                </mesh>
              ) : (
                // Boxes — fried foods, chips, cake
                <mesh castShadow receiveShadow position={[0, 0.55, 0]}>
                  <boxGeometry args={[0.7, 0.7, 0.5]} />
                  <meshStandardMaterial color={junkColor} roughness={0.3} metalness={0.05} />
                </mesh>
              )}

              {/* Category color band at top */}
              <mesh position={[0, 1.15, 0]}>
                <boxGeometry args={[1.0, 0.08, 0.6]} />
                <meshStandardMaterial color={catColor} roughness={0.3} />
              </mesh>

              {/* Red warning stripe on sides */}
              <mesh position={[0, 0.55, 0.62]}>
                <boxGeometry args={[1.4, 0.12, 0.02]} />
                <meshStandardMaterial color={warningColor} emissive={warningColor} emissiveIntensity={0.4} roughness={0.3} />
              </mesh>

              {/* Floating name label */}
              <Text
                position={[0, 1.45, 0]}
                fontSize={0.22}
                color="#FFFFFF"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.03}
                outlineColor="#000000"
                font="https://fonts.gstatic.com/s/fredokaone/v14/k3kUo8kEI-tA1RRcTZGmTlHGCaen8wf-.woff2"
              >
                {obs.junk.name}
              </Text>

              {/* Penalty indicator */}
              <Text
                position={[0, 1.2, 0]}
                fontSize={0.15}
                color={warningColor}
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.02}
                outlineColor="#000000"
                font="https://fonts.gstatic.com/s/fredokaone/v14/k3kUo8kEI-tA1RRcTZGmTlHGCaen8wf-.woff2"
              >
                {`-${obs.junk.penalty} HP`}
              </Text>
            </group>
          );
        } else if (obs.type === 'overhead') {
          // --- Overhead obstacle: hanging junk food sign ---
          return (
            <group key={obs.id} position={[obs.lane * LANE_WIDTH, 0, obs.z]}>
              {/* Support poles on each side */}
              <mesh castShadow position={[-0.8, 1.0, 0]}>
                <cylinderGeometry args={[0.06, 0.06, 2.0, 8]} />
                <meshStandardMaterial color="#555555" roughness={0.4} metalness={0.3} />
              </mesh>
              <mesh castShadow position={[0.8, 1.0, 0]}>
                <cylinderGeometry args={[0.06, 0.06, 2.0, 8]} />
                <meshStandardMaterial color="#555555" roughness={0.4} metalness={0.3} />
              </mesh>

              {/* Hanging board */}
              <mesh castShadow receiveShadow position={[0, 1.5, 0]}>
                <boxGeometry args={[1.8, 1.0, 0.8]} />
                <meshStandardMaterial color={junkColor} roughness={0.3} metalness={0.05} />
              </mesh>

              {/* Colored stripe across front */}
              <mesh position={[0, 1.5, 0.42]}>
                <boxGeometry args={[1.7, 0.15, 0.02]} />
                <meshStandardMaterial color={catColor} emissive={catColor} emissiveIntensity={0.3} roughness={0.3} />
              </mesh>

              {/* Red warning bottom edge */}
              <mesh position={[0, 0.98, 0]}>
                <boxGeometry args={[1.8, 0.06, 0.82]} />
                <meshStandardMaterial color={warningColor} emissive={warningColor} emissiveIntensity={0.4} roughness={0.3} />
              </mesh>

              {/* Name label */}
              <Text
                position={[0, 1.65, 0.45]}
                fontSize={0.18}
                color="#FFFFFF"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.025}
                outlineColor="#000000"
                font="https://fonts.gstatic.com/s/fredokaone/v14/k3kUo8kEI-tA1RRcTZGmTlHGCaen8wf-.woff2"
              >
                {obs.junk.name}
              </Text>
              <Text
                position={[0, 1.4, 0.45]}
                fontSize={0.13}
                color={warningColor}
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.02}
                outlineColor="#000000"
                font="https://fonts.gstatic.com/s/fredokaone/v14/k3kUo8kEI-tA1RRcTZGmTlHGCaen8wf-.woff2"
              >
                {`DUCK! -${obs.junk.penalty} HP`}
              </Text>
            </group>
          );
        } else {
          // --- Train/Wall: big dangerous wall ---
          return (
            <group key={obs.id} position={[obs.lane * LANE_WIDTH, 0, obs.z]}>
              {/* Main wall */}
              <mesh castShadow receiveShadow position={[0, 1.5, 0]}>
                <boxGeometry args={[2.2, 3, 6]} />
                <meshStandardMaterial color="#3A3A3A" roughness={0.5} metalness={0.1} />
              </mesh>

              {/* Red danger stripes across front */}
              {[0.5, 1.0, 1.5, 2.0, 2.5].map((y) => (
                <mesh key={y} position={[0, y, 3.02]}>
                  <boxGeometry args={[2.0, 0.12, 0.02]} />
                  <meshStandardMaterial
                    color={y % 1 === 0 ? warningColor : '#FFD000'}
                    emissive={y % 1 === 0 ? warningColor : '#FFD000'}
                    emissiveIntensity={0.5}
                    roughness={0.3}
                  />
                </mesh>
              ))}

              {/* X cross on face */}
              <mesh position={[0, 1.5, 3.04]} rotation={[0, 0, Math.PI / 4]}>
                <boxGeometry args={[0.25, 2.2, 0.02]} />
                <meshStandardMaterial color={warningColor} emissive={warningColor} emissiveIntensity={0.6} roughness={0.25} />
              </mesh>
              <mesh position={[0, 1.5, 3.04]} rotation={[0, 0, -Math.PI / 4]}>
                <boxGeometry args={[0.25, 2.2, 0.02]} />
                <meshStandardMaterial color={warningColor} emissive={warningColor} emissiveIntensity={0.6} roughness={0.25} />
              </mesh>

              {/* DANGER label */}
              <Text
                position={[0, 2.8, 3.06]}
                fontSize={0.35}
                color="#FFFFFF"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.04}
                outlineColor="#B71C1C"
                font="https://fonts.gstatic.com/s/fredokaone/v14/k3kUo8kEI-tA1RRcTZGmTlHGCaen8wf-.woff2"
              >
                DANGER
              </Text>
            </group>
          );
        }
      })}
    </>
  );
}