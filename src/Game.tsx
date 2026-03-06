import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import { Player } from './Player';
import { Obstacles } from './Obstacles';
import { Ground } from './Ground';
import { HealthyItems } from './Coins';
import { GameManager } from './GameManager';
import { CityBackground } from './CityBackground';

class R3FErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: string | null }
> {
  state = { error: null as string | null };
  static getDerivedStateFromError(err: Error) {
    return { error: err.message + '\n' + err.stack };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ position: 'absolute', inset: 0, zIndex: 99999, background: '#B71C1C', color: '#fff', padding: 20, fontFamily: 'monospace', whiteSpace: 'pre-wrap', overflow: 'auto' }}>
          <h2>Canvas Error</h2>
          <p>{this.state.error}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export function Game() {
  return (
    <R3FErrorBoundary>
      <Canvas
        camera={{ position: [0, 6, 12], fov: 55 }}
        shadows
        gl={{ antialias: true, toneMapping: 4 /* ACESFilmic */ }}
      >
        {/* Bright Roblox-style sky blue background */}
        <color attach="background" args={['#78B9FF']} />
        <fog attach="fog" args={['#A8D8FF', 80, 200]} />

        {/* Bright ambient fill — Roblox is well-lit */}
        <ambientLight intensity={0.75} color="#ffffff" />

        {/* Strong main sun — clean Roblox shadows */}
        <directionalLight
          position={[15, 30, 10]}
          castShadow
          intensity={2.2}
          color="#FFFFFF"
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-left={-30}
          shadow-camera-right={30}
          shadow-camera-top={30}
          shadow-camera-bottom={-30}
          shadow-camera-near={0.5}
          shadow-camera-far={80}
          shadow-bias={-0.001}
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
    </R3FErrorBoundary>
  );
}
