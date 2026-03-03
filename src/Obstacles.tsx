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

        const junkMat = <meshStandardMaterial color={junkColor} roughness={0.55} metalness={0.05} />;
        const warnMat = <meshStandardMaterial color={warningColor} emissive={warningColor} emissiveIntensity={0.35} roughness={0.4} />;

        if (obs.type === 'barrier') {
          return (
            <group key={obs.id} position={[obs.lane * LANE_WIDTH, 0.5, obs.z]}>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[1.8, 1, 1]} />
                {junkMat}
              </mesh>
              <mesh position={[0, 0.65, 0]}>
                <coneGeometry args={[0.2, 0.3, 8]} />
                {warnMat}
              </mesh>
              <mesh position={[-0.5, 0.65, 0]}>
                <coneGeometry args={[0.15, 0.25, 8]} />
                {warnMat}
              </mesh>
              <mesh position={[0.5, 0.65, 0]}>
                <coneGeometry args={[0.15, 0.25, 8]} />
                {warnMat}
              </mesh>
            </group>
          );
        } else if (obs.type === 'overhead') {
          return (
            <group key={obs.id} position={[obs.lane * LANE_WIDTH, 1.25, obs.z]}>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[1.8, 1.5, 1]} />
                <meshStandardMaterial color={junkColor} roughness={0.55} metalness={0.05} transparent opacity={0.85} />
              </mesh>
              <mesh position={[0, -0.9, 0]}>
                <coneGeometry args={[0.25, 0.3, 8]} />
                {warnMat}
              </mesh>
            </group>
          );
        } else {
          return (
            <group key={obs.id} position={[obs.lane * LANE_WIDTH, 1.5, obs.z]}>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[2, 3, 6]} />
                {junkMat}
              </mesh>
              <mesh position={[0, 1.2, 3.05]} rotation={[0, 0, Math.PI / 4]}>
                <boxGeometry args={[0.15, 1.5, 0.05]} />
                <meshStandardMaterial color={warningColor} emissive={warningColor} emissiveIntensity={0.5} roughness={0.3} />
              </mesh>
              <mesh position={[0, 1.2, 3.05]} rotation={[0, 0, -Math.PI / 4]}>
                <boxGeometry args={[0.15, 1.5, 0.05]} />
                <meshStandardMaterial color={warningColor} emissive={warningColor} emissiveIntensity={0.5} roughness={0.3} />
              </mesh>
            </group>
          );
        }
      })}
    </>
  );
}
