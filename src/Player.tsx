import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from './store';
import { playMove, playJump, playRoll } from './sounds';
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
      const state = useGameStore.getState();
      if (status !== 'playing' || state.paused) return;
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setLane((l) => {
          const next = Math.max(l - 1, -1);
          if (next !== l) playMove();
          return next;
        });
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        setLane((l) => {
          const next = Math.min(l + 1, 1);
          if (next !== l) playMove();
          return next;
        });
      } else if (e.key === 'ArrowUp' || e.key === 'w') {
        if (!isJumping && !isRolling) {
          setIsJumping(true);
          velocityY.current = 15;
          playJump();
        }
      } else if (e.key === 'ArrowDown' || e.key === 's') {
        if (!isJumping && !isRolling) {
          setIsRolling(true);
          playRoll();
          setTimeout(() => setIsRolling(false), 800);
        } else if (isJumping) {
          velocityY.current = -30;
          playRoll();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, isJumping, isRolling]);

  useFrame((_, delta) => {
    const state = useGameStore.getState();
    if (!playerRef.current || status !== 'playing' || state.paused) return;

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

  const skin = '#F1C27D';
  const shirt = '#212121';
  const shirtAccent = '#00E639';
  const pants = '#1565C0';
  const shoe = '#ECEFF1';
  const shoeSole = '#333333';
  const capColor = '#D32F2F';
  const wristband = '#FFD000';
  const belt = '#8D6E63';

  return (
    <group ref={playerRef as any} position={[0, 0.5, 0]} rotation={[0, Math.PI, 0]}>
      <mesh castShadow position={[0, 0.15, 0]}>
        <boxGeometry args={[0.7, 0.5, 0.35]} />
        <meshStandardMaterial color={shirt} roughness={0.55} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.18, 0.178]}>
        <boxGeometry args={[0.5, 0.1, 0.005]} />
        <meshStandardMaterial color={shirtAccent} emissive={shirtAccent} emissiveIntensity={0.3} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.08, 0]}>
        <boxGeometry args={[0.72, 0.06, 0.37]} />
        <meshStandardMaterial color={belt} roughness={0.6} metalness={0.15} />
      </mesh>
      <mesh position={[0, -0.08, 0.19]}>
        <boxGeometry args={[0.08, 0.06, 0.01]} />
        <meshStandardMaterial color="#FFD000" metalness={0.8} roughness={0.15} />
      </mesh>

      <group ref={leftArmRef} position={[-0.5, 0.35, 0]}>
        <mesh castShadow position={[0, -0.225, 0]}>
          <boxGeometry args={[0.25, 0.45, 0.25]} />
          <meshStandardMaterial color={skin} roughness={0.6} />
        </mesh>
        <mesh castShadow position={[0, -0.05, 0]}>
          <boxGeometry args={[0.27, 0.15, 0.27]} />
          <meshStandardMaterial color={shirt} roughness={0.55} metalness={0.05} />
        </mesh>
        <mesh position={[0, -0.42, 0]}>
          <boxGeometry args={[0.27, 0.05, 0.27]} />
          <meshStandardMaterial color={wristband} roughness={0.3} metalness={0.1} />
        </mesh>
      </group>

      <group ref={rightArmRef} position={[0.5, 0.35, 0]}>
        <mesh castShadow position={[0, -0.225, 0]}>
          <boxGeometry args={[0.25, 0.45, 0.25]} />
          <meshStandardMaterial color={skin} roughness={0.6} />
        </mesh>
        <mesh castShadow position={[0, -0.05, 0]}>
          <boxGeometry args={[0.27, 0.15, 0.27]} />
          <meshStandardMaterial color={shirt} roughness={0.55} metalness={0.05} />
        </mesh>
        <mesh position={[0, -0.42, 0]}>
          <boxGeometry args={[0.27, 0.05, 0.27]} />
          <meshStandardMaterial color={wristband} roughness={0.3} metalness={0.1} />
        </mesh>
      </group>

      <group ref={leftLegRef} position={[-0.2, -0.1, 0]}>
        <mesh castShadow position={[0, -0.15, 0]}>
          <boxGeometry args={[0.28, 0.3, 0.28]} />
          <meshStandardMaterial color={pants} roughness={0.65} />
        </mesh>
        <mesh castShadow position={[0, -0.35, 0.05]}>
          <boxGeometry args={[0.3, 0.1, 0.35]} />
          <meshStandardMaterial color={shoe} roughness={0.35} metalness={0.05} />
        </mesh>
        <mesh position={[0, -0.41, 0.05]}>
          <boxGeometry args={[0.31, 0.025, 0.36]} />
          <meshStandardMaterial color={shoeSole} roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.34, 0.23]}>
          <boxGeometry args={[0.2, 0.04, 0.005]} />
          <meshStandardMaterial color={shirtAccent} roughness={0.3} />
        </mesh>
      </group>

      <group ref={rightLegRef} position={[0.2, -0.1, 0]}>
        <mesh castShadow position={[0, -0.15, 0]}>
          <boxGeometry args={[0.28, 0.3, 0.28]} />
          <meshStandardMaterial color={pants} roughness={0.65} />
        </mesh>
        <mesh castShadow position={[0, -0.35, 0.05]}>
          <boxGeometry args={[0.3, 0.1, 0.35]} />
          <meshStandardMaterial color={shoe} roughness={0.35} metalness={0.05} />
        </mesh>
        <mesh position={[0, -0.41, 0.05]}>
          <boxGeometry args={[0.31, 0.025, 0.36]} />
          <meshStandardMaterial color={shoeSole} roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.34, 0.23]}>
          <boxGeometry args={[0.2, 0.04, 0.005]} />
          <meshStandardMaterial color={shirtAccent} roughness={0.3} />
        </mesh>
      </group>

      <group position={[0, 0.65, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.45, 0.45, 0.45]} />
          <meshStandardMaterial color={skin} roughness={0.6} />
        </mesh>
        {[-0.1, 0.1].map((x) => (
          <group key={x} position={[x, 0.05, 0.228]}>
            <mesh><boxGeometry args={[0.08, 0.08, 0.005]} /><meshBasicMaterial color="#FFFFFF" /></mesh>
            <mesh position={[0, 0, 0.003]}><boxGeometry args={[0.04, 0.05, 0.005]} /><meshBasicMaterial color="#111" /></mesh>
          </group>
        ))}
        <mesh position={[-0.1, 0.12, 0.228]}><boxGeometry args={[0.09, 0.02, 0.005]} /><meshBasicMaterial color="#5D4037" /></mesh>
        <mesh position={[0.1, 0.12, 0.228]}><boxGeometry args={[0.09, 0.02, 0.005]} /><meshBasicMaterial color="#5D4037" /></mesh>
        <mesh position={[0, -0.1, 0.228]}>
          <boxGeometry args={[0.14, 0.035, 0.005]} />
          <meshBasicMaterial color="#111" />
        </mesh>
        <mesh position={[-0.08, -0.09, 0.228]}><boxGeometry args={[0.025, 0.025, 0.005]} /><meshBasicMaterial color="#111" /></mesh>
        <mesh position={[0.08, -0.09, 0.228]}><boxGeometry args={[0.025, 0.025, 0.005]} /><meshBasicMaterial color="#111" /></mesh>

        <mesh castShadow position={[0, 0.25, 0]}>
          <boxGeometry args={[0.48, 0.1, 0.48]} />
          <meshStandardMaterial color={capColor} roughness={0.6} metalness={0.05} />
        </mesh>
        <mesh castShadow position={[0, 0.2, -0.3]}>
          <boxGeometry args={[0.47, 0.05, 0.2]} />
          <meshStandardMaterial color={capColor} roughness={0.6} metalness={0.05} />
        </mesh>
        <mesh position={[0, 0.32, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.03, 8]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
}