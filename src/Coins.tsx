import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useGameStore } from './store';
import { HealthyItemDef, getRandomHealthyItem, FOOD_GROUP_COLORS, FOOD_EMOJI } from './foodData';
import * as THREE from 'three';

const LANE_WIDTH = 2.5;
const SPAWN_Z = -150;

function SphereFood({ color, item }: { color: string, item: any }) {
  return (
    <group position={[0, 0.45, 0]}>
      <mesh castShadow><sphereGeometry args={[0.25, 8, 8]} /><meshStandardMaterial color={color} /></mesh>
      {item.foodGroup === 'fruits' && (
        <mesh position={[0, 0.28, 0]}><cylinderGeometry args={[0.02, 0.02, 0.1, 4]} /><meshStandardMaterial color="#5D4037" /></mesh>
      )}
    </group>
  );
}

function BottleFood({ color }: { color: string }) {
  return (
    <group position={[0, 0.5, 0]}>
      <mesh castShadow><cylinderGeometry args={[0.18, 0.18, 0.7, 6]} /><meshStandardMaterial color={color} transparent opacity={0.6} /></mesh>
    </group>
  );
}

function HealthyFoodModel({ item }: { item: any }) {
  const color = FOOD_GROUP_COLORS[item.foodGroup];
  if (item.foodGroup === 'hydration') return <BottleFood color={color} />;
  return <SphereFood color={color} item={item} />;
}

export function HealthyItems() {
  const [items, setItems] = useState<any[]>([]);
  const status = useGameStore((state) => state.status);
  const itemId = useRef(0);

  useFrame((_, delta) => {
    if (status !== 'playing') {
      if (items.length > 0) setItems([]);
      return;
    }

    const state = useGameStore.getState();
    const speed = state.speed;
    const playerLane = state.playerLane;
    const playerY = state.playerY;

    setItems((prev) => {
      let newItems = prev.map((item) => ({ ...item, z: item.z + speed * delta }));

      newItems = newItems.map((item) => {
        if (!item.collected && Math.abs(item.z) < 1.2 && item.lane === playerLane) {
          if (Math.abs(item.y - playerY) < 1.5) {
            state.collectHealthyItem(item.item.foodGroup, item.item.points, {
              item: item.item.name, fact: item.item.fact, isHealthy: true, foodGroup: item.item.foodGroup
            });
            return { ...item, collected: true };
          }
        }
        return item;
      });

      const filtered = newItems.filter((item) => item.z < 10 && !item.collected);

      const minZ = filtered.length > 0 ? Math.min(...filtered.map(o => o.z)) : 0;
      if (minZ > SPAWN_Z + 20 && Math.random() > 0.4) {
        const lane = Math.floor(Math.random() * 3) - 1;
        const itemDef = getRandomHealthyItem();
        const isHigh = Math.random() > 0.8;
        for (let i = 0; i < 3; i++) {
          filtered.push({
            id: itemId.current++,
            lane,
            z: SPAWN_Z - i * 4,
            y: isHigh ? 2.5 : 0.7,
            collected: false,
            item: itemDef,
          });
        }
      }
      return filtered;
    });
  });

  return (
    <>
      {items.map((item) => (
        <group key={item.id} position={[item.lane * LANE_WIDTH, item.y, item.z]}>
          <HealthyFoodModel item={item.item} />
          <Html position={[0, 0.5, 0]} center sprite distanceFactor={12} style={{ pointerEvents: 'none' }}>
            <div style={{ fontSize: '2.8rem', lineHeight: 1, filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.3))' }}>
              {FOOD_EMOJI[item.item.name] || '\u{1F34F}'}
            </div>
          </Html>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
            <ringGeometry args={[0.4, 0.45, 8]} />
            <meshBasicMaterial color={FOOD_GROUP_COLORS[item.item.foodGroup]} transparent opacity={0.3} />
          </mesh>
        </group>
      ))}
    </>
  );
}
