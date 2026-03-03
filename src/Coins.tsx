import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from './store';
import { HealthyItemDef, getRandomHealthyItem, FOOD_GROUP_COLORS } from './foodData';
import * as THREE from 'three';

const LANE_WIDTH = 2.5;
const SPAWN_Z = -150;

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
        const count = 3 + Math.floor(Math.random() * 3);
        for (let i = 0; i < count; i++) {
          newItems.push({
            id: itemId.current++,
            lane,
            z: SPAWN_Z - i * 2.5,
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
        const baseColor = item.item.color;

        if (item.item.shape === 'sphere') {
          return (
            <group key={item.id} position={[item.lane * LANE_WIDTH, item.y, item.z]}>
              <mesh castShadow>
                <sphereGeometry args={[0.4, 12, 12]} />
                <meshStandardMaterial color={baseColor} metalness={0.08} roughness={0.25} envMapIntensity={0.8} />
              </mesh>
              <mesh position={[0, 0.38, 0]}>
                <cylinderGeometry args={[0.12, 0.12, 0.08, 10]} />
                <meshStandardMaterial color={baseColor} metalness={0.08} roughness={0.25} envMapIntensity={0.8} />
              </mesh>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.55, 0.06, 8, 16]} />
                <meshStandardMaterial color={groupColor} emissive={groupColor} emissiveIntensity={0.8} transparent opacity={0.35} />
              </mesh>
            </group>
          );
        } else if (item.item.shape === 'cylinder') {
          return (
            <group key={item.id} position={[item.lane * LANE_WIDTH, item.y, item.z]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.3, 0.3, 0.6, 12]} />
                <meshStandardMaterial color={baseColor} metalness={0.08} roughness={0.25} envMapIntensity={0.8} />
              </mesh>
              <mesh position={[0, 0.35, 0]}>
                <cylinderGeometry args={[0.1, 0.1, 0.08, 10]} />
                <meshStandardMaterial color={baseColor} metalness={0.08} roughness={0.25} envMapIntensity={0.8} />
              </mesh>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.5, 0.06, 8, 16]} />
                <meshStandardMaterial color={groupColor} emissive={groupColor} emissiveIntensity={0.8} transparent opacity={0.35} />
              </mesh>
            </group>
          );
        } else {
          return (
            <group key={item.id} position={[item.lane * LANE_WIDTH, item.y, item.z]}>
              <mesh castShadow>
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial color={baseColor} metalness={0.08} roughness={0.25} envMapIntensity={0.8} />
              </mesh>
              <mesh position={[0, 0.3, 0]}>
                <cylinderGeometry args={[0.12, 0.12, 0.08, 10]} />
                <meshStandardMaterial color={baseColor} metalness={0.08} roughness={0.25} envMapIntensity={0.8} />
              </mesh>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.5, 0.06, 8, 16]} />
                <meshStandardMaterial color={groupColor} emissive={groupColor} emissiveIntensity={0.8} transparent opacity={0.35} />
              </mesh>
            </group>
          );
        }
      })}
    </group>
  );
}
