import { Canvas } from '@react-three/fiber';
import { Sky, Environment } from '@react-three/drei';
import { Player } from './Player';
import { Obstacles } from './Obstacles';
import { Ground } from './Ground';
import { HealthyItems } from './Coins';
import { GameManager } from './GameManager';
import { CityBackground } from './CityBackground';

export function Game() {
  return (
    <Canvas
      camera={{ position: [0, 6, 12], fov: 55 }}
      shadows={{ type: 'soft' as any }}
      gl={{ antialias: true, toneMapping: 4 /* ACESFilmic */ }}
    >
      {/* Bright Roblox-style sky blue background */}
      <color attach="background" args={['#78B9FF']} />
      <fog attach="fog" args={['#A8D8FF', 80, 200]} />

      {/* Studio-style environment for plastic reflections */}
      <Environment preset="city" background={false} environmentIntensity={0.5} />

      {/* Bright ambient fill — Roblox is well-lit */}
      <ambientLight intensity={0.75} color="#ffffff" />

      {/* Strong main sun — clean Roblox shadows */}
      <directionalLight
        position={[15, 30, 10]}
        castShadow
        intensity={2.2}
        color="#FFFFFF"
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-camera-near={0.5}
        shadow-camera-far={80}
        shadow-bias={-0.0005}
      />

      {/* Sky / ground hemisphere fill — brighter */}
      <hemisphereLight args={['#87CEEB', '#4CB050', 0.5]} />

      {/* Fill from behind camera */}
      <pointLight position={[0, 10, 15]} color="#FFFFFF" intensity={0.5} distance={50} />

      <Sky
        sunPosition={[100, 60, 100]}
        rayleigh={0.3}
        turbidity={3}
        mieCoefficient={0.002}
        mieDirectionalG={0.7}
      />

      <GameManager />
      <Player />
      <Obstacles />
      <HealthyItems />
      <Ground />
      <CityBackground />
    </Canvas>
  );
}
