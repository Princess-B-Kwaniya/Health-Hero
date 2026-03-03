import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from './store';
import * as THREE from 'three';

const LANE_WIDTH = 2.5;

export function Player() {
  const playerRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);

  const status = useGameStore((state) => state.status);
  const setPlayerState = useGameStore((state) => state.setPlayerState);

  const [lane, setLane] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const velocityY = useRef(0);
  const runTime = useRef(0);

  useEffect(() => {
    if (status !== 'playing') {
      setLane(0);
      setIsJumping(false);
      setIsRolling(false);
      runTime.current = 0;
    }
  }, [status]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status !== 'playing') return;
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setLane((l) => Math.max(l - 1, -1));
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        setLane((l) => Math.min(l + 1, 1));
      } else if (e.key === 'ArrowUp' || e.key === 'w') {
        if (!isJumping && !isRolling) {
          setIsJumping(true);
          velocityY.current = 15;
        }
      } else if (e.key === 'ArrowDown' || e.key === 's') {
        if (!isJumping && !isRolling) {
          setIsRolling(true);
          setTimeout(() => setIsRolling(false), 800);
        } else if (isJumping) {
          velocityY.current = -30;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, isJumping, isRolling]);

  useFrame((_, delta) => {
    if (!playerRef.current || status !== 'playing') return;

    const targetX = lane * LANE_WIDTH;
    playerRef.current.position.x = THREE.MathUtils.lerp(playerRef.current.position.x, targetX, 15 * delta);

    if (isJumping) {
      playerRef.current.position.y += velocityY.current * delta;
      velocityY.current -= 40 * delta;
      if (playerRef.current.position.y <= 0.5) {
        playerRef.current.position.y = 0.5;
        setIsJumping(false);
        velocityY.current = 0;
      }
    } else {
      playerRef.current.position.y = isRolling ? 0.25 : 0.5;
    }

    if (isRolling) {
      playerRef.current.scale.y = THREE.MathUtils.lerp(playerRef.current.scale.y, 0.5, 15 * delta);
    } else {
      playerRef.current.scale.y = THREE.MathUtils.lerp(playerRef.current.scale.y, 1, 15 * delta);
    }

    // Running animation
    runTime.current += delta * 10;
    const swing = Math.sin(runTime.current) * 0.6;
    if (leftArmRef.current) leftArmRef.current.rotation.x = swing;
    if (rightArmRef.current) rightArmRef.current.rotation.x = -swing;
    if (leftLegRef.current) leftLegRef.current.rotation.x = -swing * 0.8;
    if (rightLegRef.current) rightLegRef.current.rotation.x = swing * 0.8;

    setPlayerState(lane, playerRef.current.position.y, playerRef.current.scale.y);
  });

  const skin = '#D2A679';
  const shirt = '#FFFFFF';
  const shorts = '#388E3C';
  const shoe = '#5D4037';

  return (
    <group ref={playerRef as any} position={[0, 0.5, 0]} rotation={[0, Math.PI, 0]}>
      {/* Torso */}
      <mesh castShadow>
        <boxGeometry args={[0.6, 0.7, 0.35]} />
        <meshStandardMaterial color={shirt} roughness={0.75} />
      </mesh>
      {/* Carrot emblem */}
      <mesh position={[0, 0.05, 0.18]}>
        <coneGeometry args={[0.045, 0.12, 8]} />
        <meshStandardMaterial color="#FF7043" roughness={0.5} />
      </mesh>
      {/* Shorts */}
      <mesh castShadow position={[0, -0.3, 0]}>
        <boxGeometry args={[0.6, 0.2, 0.37]} />
        <meshStandardMaterial color={shorts} roughness={0.65} />
      </mesh>

      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.4, 0.15, 0]}>
        <mesh castShadow position={[0, -0.1, 0]}>
          <capsuleGeometry args={[0.07, 0.18, 6, 12]} />
          <meshStandardMaterial color={shirt} roughness={0.75} />
        </mesh>
        <mesh castShadow position={[0, -0.3, 0]}>
          <capsuleGeometry args={[0.06, 0.14, 6, 12]} />
          <meshStandardMaterial color={skin} roughness={0.8} />
        </mesh>
      </group>
      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.4, 0.15, 0]}>
        <mesh castShadow position={[0, -0.1, 0]}>
          <capsuleGeometry args={[0.07, 0.18, 6, 12]} />
          <meshStandardMaterial color={shirt} roughness={0.75} />
        </mesh>
        <mesh castShadow position={[0, -0.3, 0]}>
          <capsuleGeometry args={[0.06, 0.14, 6, 12]} />
          <meshStandardMaterial color={skin} roughness={0.8} />
        </mesh>
      </group>

      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.14, -0.42, 0]}>
        <mesh castShadow position={[0, -0.1, 0]}>
          <capsuleGeometry args={[0.08, 0.2, 6, 12]} />
          <meshStandardMaterial color={skin} roughness={0.8} />
        </mesh>
        <mesh castShadow position={[0, -0.3, 0.03]}>
          <boxGeometry args={[0.14, 0.09, 0.22]} />
          <meshStandardMaterial color={shoe} roughness={0.4} metalness={0.1} />
        </mesh>
      </group>
      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.14, -0.42, 0]}>
        <mesh castShadow position={[0, -0.1, 0]}>
          <capsuleGeometry args={[0.08, 0.2, 6, 12]} />
          <meshStandardMaterial color={skin} roughness={0.8} />
        </mesh>
        <mesh castShadow position={[0, -0.3, 0.03]}>
          <boxGeometry args={[0.14, 0.09, 0.22]} />
          <meshStandardMaterial color={shoe} roughness={0.4} metalness={0.1} />
        </mesh>
      </group>

      {/* Head */}
      <mesh castShadow position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.26, 24, 24]} />
        <meshStandardMaterial color={skin} roughness={0.75} />
      </mesh>
      {/* Hair cap */}
      <mesh position={[0, 0.7, -0.06]}>
        <sphereGeometry args={[0.24, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshStandardMaterial color="#3E2723" roughness={0.9} />
      </mesh>
      {/* Headband */}
      <mesh position={[0, 0.73, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.22, 0.03, 8, 24]} />
        <meshStandardMaterial color="#FFD54F" roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Eyes: sclera + iris + pupil */}
      <group position={[-0.08, 0.63, 0.22]}>
        <mesh><sphereGeometry args={[0.045, 12, 12]} /><meshStandardMaterial color="#FFFFFF" roughness={0.3} /></mesh>
        <mesh position={[0, 0, 0.025]}><sphereGeometry args={[0.028, 10, 10]} /><meshStandardMaterial color="#4CAF50" roughness={0.2} /></mesh>
        <mesh position={[0, 0, 0.04]}><sphereGeometry args={[0.015, 8, 8]} /><meshStandardMaterial color="#111" roughness={0.1} /></mesh>
      </group>
      <group position={[0.08, 0.63, 0.22]}>
        <mesh><sphereGeometry args={[0.045, 12, 12]} /><meshStandardMaterial color="#FFFFFF" roughness={0.3} /></mesh>
        <mesh position={[0, 0, 0.025]}><sphereGeometry args={[0.028, 10, 10]} /><meshStandardMaterial color="#4CAF50" roughness={0.2} /></mesh>
        <mesh position={[0, 0, 0.04]}><sphereGeometry args={[0.015, 8, 8]} /><meshStandardMaterial color="#111" roughness={0.1} /></mesh>
      </group>

      {/* Nose */}
      <mesh position={[0, 0.58, 0.25]}>
        <sphereGeometry args={[0.022, 8, 8]} />
        <meshStandardMaterial color="#C4956A" roughness={0.8} />
      </mesh>

      {/* Smile */}
      <mesh position={[0, 0.53, 0.24]} rotation={[0.2, 0, 0]}>
        <torusGeometry args={[0.035, 0.01, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#D32F2F" roughness={0.6} />
      </mesh>
    </group>
  );
}
