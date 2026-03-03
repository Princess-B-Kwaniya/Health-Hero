import { useFrame } from '@react-three/fiber';
import { useGameStore } from './store';

export function GameManager() {
  const status = useGameStore((state) => state.status);
  const addHeroPoints = useGameStore((state) => state.addHeroPoints);
  const addDistance = useGameStore((state) => state.addDistance);
  const drainHealth = useGameStore((state) => state.drainHealth);
  const tick = useGameStore((state) => state.tick);

  useFrame((_, delta) => {
    if (status === 'playing') {
      // Distance-based score (1 HP per metre equivalent)
      addHeroPoints(delta * 5);
      addDistance(delta * 10);

      // Aggressive speed ramp — noticeable acceleration, capped at 3x base speed
      useGameStore.setState((prev) => ({
        speed: Math.min(90, prev.speed + delta * 0.5),
      }));

      // Slow health drain to encourage collecting healthy food
      drainHealth(delta * 0.8);

      // Tick timers (combo, facts, effects)
      tick(Date.now());
    }
  });

  return null;
}
