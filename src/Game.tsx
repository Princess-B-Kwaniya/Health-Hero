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
      camera={{ position: [0, 5, 10], fov: 60 }}
      shadows={{ type: 'soft' as any }}
      gl={{ antialias: true, toneMapping: 4 /* ACESFilmic */ }}
    >
      <color attach="background" args={['#7EC8E3']} />
      <fog attach="fog" args={['#C5E4F0', 60, 180]} />

      {/* Environment for realistic reflections */}
      <Environment preset="city" background={false} environmentIntensity={0.35} />

      {/* Ambient fill */}
      <ambientLight intensity={0.55} color="#ffffff" />

      {/* Main sun */}
      <directionalLight
        position={[15, 25, 10]}
        castShadow
        intensity={1.8}
        color="#FFF5E1"
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

      {/* Sky / ground hemisphere fill */}
      <hemisphereLight args={['#87CEEB', '#8D6E63', 0.4]} />

      {/* Subtle warm fill from behind camera */}
      <pointLight position={[0, 8, 15]} color="#FFF8E1" intensity={0.4} distance={40} />

      <Sky
        sunPosition={[100, 40, 100]}
        rayleigh={0.5}
        turbidity={6}
        mieCoefficient={0.003}
        mieDirectionalG={0.8}
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
