import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from './store';
import * as THREE from 'three';

const LANE_WIDTH = 2.5;

/* ── Roblox "SmoothPlastic" material preset ── */
const plastic = (color: string) => (
  <meshStandardMaterial color={color} roughness={0.3} metalness={0.05} />
);

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
    const swing = Math.sin(runTime.current) * 0.7;
    if (leftArmRef.current) leftArmRef.current.rotation.x = swing;
    if (rightArmRef.current) rightArmRef.current.rotation.x = -swing;
    if (leftLegRef.current) leftLegRef.current.rotation.x = -swing * 0.8;
    if (rightLegRef.current) rightLegRef.current.rotation.x = swing * 0.8;

    setPlayerState(lane, playerRef.current.position.y, playerRef.current.scale.y);
  });

  // ── Classic Roblox Color Palette ──
  const skinYellow = '#F3D35B';      // Classic Roblox yellow
  const torsoColor = '#00A2FF';      // Bright Really Blue
  const pantsColor = '#194D33';      // Dark green (Earth Green)
  const shoeColor = '#624732';       // Reddish brown
  const hatColor = '#A3D44E';        // Lime green

  return (
    <group ref={playerRef as any} position={[0, 0.5, 0]} rotation={[0, Math.PI, 0]}>
      {/* === TORSO (Classic Roblox brick proportions) === */}
      <mesh castShadow position={[0, 0.15, 0]}>
        <boxGeometry args={[0.8, 0.55, 0.4]} />
        {plastic(torsoColor)}
      </mesh>
      {/* Roblox logo decal on chest */}
      <mesh position={[0, 0.18, 0.205]}>
        <boxGeometry args={[0.2, 0.2, 0.01]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.2} metalness={0.0} />
      </mesh>

      {/* === LEFT ARM === */}
      <group ref={leftArmRef} position={[-0.55, 0.35, 0]}>
        <mesh castShadow position={[0, -0.2, 0]}>
          <boxGeometry args={[0.28, 0.5, 0.28]} />
          {plastic(skinYellow)}
        </mesh>
        {/* Sleeve */}
        <mesh castShadow position={[0, -0.02, 0]}>
          <boxGeometry args={[0.3, 0.18, 0.3]} />
          {plastic(torsoColor)}
        </mesh>
        {/* Hand sphere */}
        <mesh castShadow position={[0, -0.48, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          {plastic(skinYellow)}
        </mesh>
      </group>

      {/* === RIGHT ARM === */}
      <group ref={rightArmRef} position={[0.55, 0.35, 0]}>
        <mesh castShadow position={[0, -0.2, 0]}>
          <boxGeometry args={[0.28, 0.5, 0.28]} />
          {plastic(skinYellow)}
        </mesh>
        <mesh castShadow position={[0, -0.02, 0]}>
          <boxGeometry args={[0.3, 0.18, 0.3]} />
          {plastic(torsoColor)}
        </mesh>
        <mesh castShadow position={[0, -0.48, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          {plastic(skinYellow)}
        </mesh>
      </group>

      {/* === LEFT LEG === */}
      <group ref={leftLegRef} position={[-0.2, -0.1, 0]}>
        <mesh castShadow position={[0, -0.15, 0]}>
          <boxGeometry args={[0.35, 0.35, 0.35]} />
          {plastic(pantsColor)}
        </mesh>
        {/* Chunky Roblox foot */}
        <mesh castShadow position={[0, -0.38, 0.05]}>
          <boxGeometry args={[0.35, 0.12, 0.4]} />
          {plastic(shoeColor)}
        </mesh>
      </group>

      {/* === RIGHT LEG === */}
      <group ref={rightLegRef} position={[0.2, -0.1, 0]}>
        <mesh castShadow position={[0, -0.15, 0]}>
          <boxGeometry args={[0.35, 0.35, 0.35]} />
          {plastic(pantsColor)}
        </mesh>
        <mesh castShadow position={[0, -0.38, 0.05]}>
          <boxGeometry args={[0.35, 0.12, 0.4]} />
          {plastic(shoeColor)}
        </mesh>
      </group>

      {/* === HEAD (Oversized classic Roblox head) === */}
      <group position={[0, 0.7, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.6, 0.6, 0.6]} />
          {plastic(skinYellow)}
        </mesh>

        {/* Classic Roblox smiley face */}
        {/* Left Eye */}
        <mesh position={[-0.12, 0.06, 0.305]}>
          <circleGeometry args={[0.05, 16]} />
          <meshBasicMaterial color="#1A1A1A" />
        </mesh>
        {/* Right Eye */}
        <mesh position={[0.12, 0.06, 0.305]}>
          <circleGeometry args={[0.05, 16]} />
          <meshBasicMaterial color="#1A1A1A" />
        </mesh>
        {/* Classic Roblox smile */}
        <mesh position={[0, -0.1, 0.305]}>
          <torusGeometry args={[0.1, 0.02, 8, 16, Math.PI]} />
          <meshBasicMaterial color="#1A1A1A" />
        </mesh>

        {/* === Roblox Beanie Hat === */}
        <mesh castShadow position={[0, 0.35, 0]}>
          <sphereGeometry args={[0.33, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
          {plastic(hatColor)}
        </mesh>
        <mesh castShadow position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.34, 0.34, 0.06, 12]} />
          {plastic(hatColor)}
        </mesh>
        {/* Pom-pom */}
        <mesh castShadow position={[0, 0.48, 0]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          {plastic('#FFFFFF')}
        </mesh>
      </group>
    </group>
  );
}