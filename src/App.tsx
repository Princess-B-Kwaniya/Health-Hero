import { Game } from './Game';
import { useGameStore, FoodGroup } from './store';
import { FOOD_GROUP_LABELS, FOOD_GROUP_COLORS } from './foodData';
import { Heart, Play, RotateCcw, Footprints, BookOpen, Volume2, VolumeX, Pause } from 'lucide-react';
import React, { memo, useCallback, useRef, useEffect } from 'react';
import { LearnPage } from './LearnPage';
import { startMusic, stopMusic } from './sounds';

const FOOD_GROUPS: FoodGroup[] = ['fruits', 'vegetables', 'proteins', 'grains', 'dairy', 'hydration'];

// --- Isolated Components for high-frequency updates ---

const HeroPointsDisplay = memo(() => {
  const heroPoints = useGameStore((state) => state.heroPoints);
  const comboMultiplierActive = useGameStore((state) => state.comboMultiplierActive);
  return (
    <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2 sm:px-4 py-1.5 sm:py-2 border border-white/10 shadow-lg flex items-center gap-1.5 sm:gap-2">
      <div className="w-5 h-5 sm:w-7 sm:h-7 rounded flex items-center justify-center text-[10px] sm:text-xs font-black" style={{ background: '#00E639', color: '#000' }}>HP</div>
      <span className="font-mono text-sm sm:text-xl font-black" style={{ color: '#00E639' }}>{Math.floor(heroPoints)}</span>
      {comboMultiplierActive && (
        <span className="text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded animate-bounce" style={{ background: '#FFD000', color: '#000' }}>2x</span>
      )}
    </div>
  );
});

const DistanceDisplay = memo(() => {
  const distance = useGameStore((state) => state.distance);
  return (
    <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 border border-white/10 flex items-center gap-1">
      <Footprints className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: '#FFD000' }} />
      <span className="font-mono text-xs sm:text-sm font-bold" style={{ color: '#FFD000' }}>{Math.floor(distance)}m</span>
    </div>
  );
});

const HealthDisplay = memo(() => {
  const healthMeter = useGameStore((state) => state.healthMeter);
  const healthColor = healthMeter > 60 ? '#4CAF50' : healthMeter > 30 ? '#FFD54F' : '#EF5350';
  const healthPulse = healthMeter < 30 ? 'animate-pulse' : '';
  return (
    <div className={`bg-black/60 backdrop-blur-sm rounded-lg px-2 sm:px-4 py-1.5 sm:py-2 border border-white/10 shadow-lg flex items-center gap-1.5 sm:gap-2 ${healthPulse}`}>
      <Heart className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: healthColor, fill: healthColor }} />
      <div className="w-14 sm:w-24 h-2 sm:h-3 rounded overflow-hidden" style={{ background: '#1A1A2E' }}>
        <div className="h-full transition-all duration-300" style={{ width: `${healthMeter}%`, background: healthColor }} />
      </div>
      <span className="font-mono text-xs sm:text-sm font-bold" style={{ color: healthColor }}>{Math.floor(healthMeter)}</span>
    </div>
  );
});

const EffectsOverlay = memo(() => {
  const status = useGameStore((state) => state.status);
  const activeEffect = useGameStore((state) => state.activeEffect);
  if (status !== 'playing' || activeEffect === 'none') return null;

  if (activeEffect === 'blur') {
    return <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle, transparent 20%, rgba(239,83,80,0.25) 100%)', animation: 'dizzy 0.4s ease-in-out' }} />;
  }

  const styles: Record<string, React.CSSProperties> = {
    tilt: { transform: 'rotate(1.5deg)', border: '6px solid rgba(255, 152, 0, 0.3)' },
    invert: { filter: 'hue-rotate(180deg)', mixBlendMode: 'difference', background: 'rgba(206,147,216,0.15)' },
    slow: { background: 'radial-gradient(circle, transparent 40%, rgba(239,83,80,0.15) 100%)' }
  };

  return <div className="absolute inset-0 pointer-events-none" style={styles[activeEffect] || {}} />;
});

const AudioControls = memo(() => {
  const muted = useGameStore((state) => state.muted);
  const toggleMute = useGameStore((state) => state.toggleMute);

  return (
    <button
      onClick={toggleMute}
      className="bg-black/60 backdrop-blur-sm rounded-lg p-2 sm:p-2.5 border border-white/10 shadow-lg pointer-events-auto hover:bg-black/80 transition-colors"
      title={muted ? "Unmute" : "Mute"}
    >
      {muted ? (
        <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
      ) : (
        <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#00E639]" />
      )}
    </button>
  );
});

const PauseButton = memo(() => {
  const paused = useGameStore((state) => state.paused);
  const togglePause = useGameStore((state) => state.togglePause);

  return (
    <button
      onClick={togglePause}
      className="bg-black/60 backdrop-blur-sm rounded-lg p-2 sm:p-2.5 border border-white/10 shadow-lg pointer-events-auto hover:bg-black/80 transition-colors"
      title={paused ? "Resume" : "Pause"}
    >
      {paused ? (
        <Play className="w-4 h-4 sm:w-5 sm:h-5 text-[#00E639] fill-[#00E639]" />
      ) : (
        <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-[#00E639] fill-[#00E639]" />
      )}
    </button>
  );
});

const PauseMenu = memo(() => {
  const paused = useGameStore((state) => state.paused);
  const togglePause = useGameStore((state) => state.togglePause);
  const goToStart = useGameStore((state) => state.goToStart);

  if (!paused) return null;

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl transition-all duration-500">
      <div className="bg-[#1A1A2E] border border-[#3D3D5C] rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in slide-in-from-bottom-4 duration-300">
        <h2 className="text-3xl font-black text-[#FFD000] uppercase italic tracking-tighter mb-6">Game Paused</h2>
        <div className="space-y-3">
          <button
            onClick={togglePause}
            className="w-full bg-[#00E639] hover:bg-[#00FF41] text-white font-black py-4 rounded-xl uppercase tracking-tighter flex items-center justify-center gap-3 transition-all"
          >
            <Play className="w-6 h-6 fill-white" /> Continue
          </button>
          <button
            onClick={goToStart}
            className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl uppercase transition-all"
          >
            Quit to Menu
          </button>
        </div>
      </div>
    </div>
  );
});

const SummaryScreen = memo(() => {
  const startGame = useGameStore((state) => state.startGame);
  const goToLearn = useGameStore((state) => state.goToLearn);
  const heroPoints = useGameStore((state) => state.heroPoints);
  const distance = useGameStore((state) => state.distance);
  const healthMeter = useGameStore((state) => state.healthMeter);
  const foodGroupCounts = useGameStore((state) => state.foodGroupCounts);
  const junkContacts = useGameStore((state) => state.junkContacts);
  const longestCleanRun = useGameStore((state) => state.longestCleanRun);

  const totalHealthy = Object.values(foodGroupCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md">
      <div className="rounded-xl p-4 sm:p-6 max-w-md w-full text-center shadow-2xl border bg-[#2A2A3E] border-[#3D3D5C] max-h-[90vh] overflow-y-auto relative overflow-hidden">
        <h2 className="text-2xl sm:text-3xl font-black mb-1 uppercase text-[#FFD000]">Run Summary</h2>
        <p className="mb-3 sm:mb-4 text-xs sm:text-sm text-[#A0A0C0]">
          {healthMeter <= 0 ? 'Your health ran out! Eat more healthy food!' : 'Great run hero!'}
        </p>

        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="rounded-lg p-2 sm:p-3 border border-[#00E639] bg-[#1A1A2E]">
            <div className="text-[10px] uppercase text-[#00E639]">Points</div>
            <div className="font-black text-lg sm:text-2xl">{Math.floor(heroPoints)}</div>
          </div>
          <div className="rounded-lg p-2 sm:p-3 border border-[#00A2FF] bg-[#1A1A2E]">
            <div className="text-[10px] uppercase text-[#00A2FF]">Meters</div>
            <div className="font-black text-lg sm:text-2xl">{Math.floor(distance)}m</div>
          </div>
          <div className="rounded-lg p-2 sm:p-3 border border-[#FFD000] bg-[#1A1A2E]">
            <div className="text-[10px] uppercase text-[#FFD000]">Clean</div>
            <div className="font-black text-lg sm:text-2xl">{Math.floor(longestCleanRun)}m</div>
          </div>
        </div>

        <div className="rounded-lg p-3 border mb-3 sm:mb-4 bg-[#1A1A2E] border-[#3D3D5C]">
          <div className="text-[10px] sm:text-xs font-bold uppercase text-[#00E639] mb-2">Food Collected ({totalHealthy})</div>
          <div className="grid grid-cols-3 gap-1">
            {FOOD_GROUPS.map(fg => (
              <div key={fg} className="flex items-center gap-1.5 overflow-hidden">
                <div className="w-2.5 h-2.5 rounded flex-shrink-0" style={{ background: FOOD_GROUP_COLORS[fg] }} />
                <span className="text-[10px] truncate text-[#A0A0C0] uppercase">{FOOD_GROUP_LABELS[fg]}</span>
                <span className="text-xs font-black ml-auto">{foodGroupCounts[fg]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-3 sm:mb-4 text-xs sm:text-sm text-[#A0A0C0]">
          <span>Junk Food Hits: {junkContacts}</span>
        </div>

        <button onClick={startGame} className="w-full text-white rounded-lg py-3 sm:py-4 font-bold text-base sm:text-lg bg-green-500 shadow-lg uppercase mb-3 text-white">Run Again!</button>
        <button onClick={goToLearn} className="w-full rounded-lg py-3 font-bold text-sm uppercase border border-[#FFD000] text-[#FFD000]">Learn About Food</button>
      </div>
    </div>
  );
});

export default function App() {
  const status = useGameStore((state) => state.status);
  const activeEffect = useGameStore((state) => state.activeEffect);
  const activeFact = useGameStore((state) => state.activeFact);
  const comboMultiplierActive = useGameStore((state) => state.comboMultiplierActive);
  const comboMessage = useGameStore((state) => state.comboMessage);

  const startGame = useGameStore((state) => state.startGame);
  const goToLearn = useGameStore((state) => state.goToLearn);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const s = useGameStore.getState();
      if (e.key === 'p' || e.key === 'Escape') {
        if (s.status === 'playing') s.togglePause();
      } else if (e.key === 'm') {
        s.toggleMute();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const fireKey = useCallback((key: string) => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key }));
  }, []);

  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);

  useEffect(() => {
    const SWIPE_THRESHOLD = 30;
    const handleTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      touchStart.current = { x: t.clientX, y: t.clientY, time: Date.now() };
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart.current) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStart.current.x;
      const dy = t.clientY - touchStart.current.y;
      const elapsed = Date.now() - touchStart.current.time;
      touchStart.current = null;
      if (elapsed > 500) return;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);
      if (absDx < SWIPE_THRESHOLD && absDy < SWIPE_THRESHOLD) return;
      if (absDx > absDy) fireKey(dx > 0 ? 'd' : 'a');
      else fireKey(dy > 0 ? 's' : 'w');
    };
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [fireKey]);

  // Background Music Control
  useEffect(() => {
    const paused = useGameStore.getState().paused;
    if (status === 'playing' && !paused) {
      startMusic();
    } else {
      stopMusic();
    }
    return () => stopMusic();
  }, [status, useGameStore((state) => state.paused)]);

  return (
    <div className="relative w-full h-screen bg-[#1B2838] overflow-hidden" style={{ fontFamily: "'Fredoka One', 'Nunito', sans-serif" }}>
      <div style={status === 'playing' && activeEffect === 'blur' ? { filter: 'blur(6px)', transition: 'filter 0.2s ease-in' } : { filter: 'none', transition: 'filter 0.3s ease-out' }} className="w-full h-full">
        <Game />
      </div>

      <EffectsOverlay />

      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex flex-col gap-2 z-[110]">
        {!status.includes('playing') && <AudioControls />}
      </div>

      {status === 'playing' && (
        <>
          <PauseMenu />
          {!useGameStore((state) => state.paused) && (
            <>
              <div className="absolute top-0 left-0 w-full p-2 sm:p-4 flex justify-between items-start pointer-events-none">
                <div className="flex items-start gap-1.5 sm:gap-2">
                  <div className="flex flex-col gap-2 pointer-events-auto">
                    <HeroPointsDisplay />
                    <div className="flex gap-2">
                      <AudioControls />
                      <PauseButton />
                    </div>
                  </div>
                  <DistanceDisplay />
                </div>
                <div className="flex items-start gap-2">
                  <HealthDisplay />
                </div>
              </div>

              {activeFact && (
                <div className="absolute top-12 sm:top-16 right-2 sm:right-4 pointer-events-none z-10">
                  <div className="rounded-lg px-3 py-1.5 shadow-lg border text-xs font-bold" style={{ background: activeFact.isHealthy ? 'rgba(0,230,57,0.9)' : 'rgba(255,60,60,0.9)', borderColor: activeFact.isHealthy ? '#00FF41' : '#FF4444', color: '#FFFFFF' }}>
                    {activeFact.isHealthy ? `+ ${activeFact.item}` : `- ${activeFact.item}`}
                  </div>
                </div>
              )}

              {comboMultiplierActive && comboMessage && (
                <div className="absolute top-20 sm:top-24 right-2 sm:right-4 pointer-events-none z-10">
                  <div className="rounded-lg px-3 py-1 shadow-lg text-xs font-black" style={{ background: '#FFD000', color: '#000' }}>
                    {comboMessage} 2x
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      {status === 'start' && (
        <div className="absolute inset-0 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md">
          <div className="rounded-xl p-5 sm:p-8 max-w-sm w-full text-center shadow-2xl border bg-[#2A2A3E] border-[#3D3D5C] max-h-[90vh] overflow-y-auto">
            <h1 className="text-2xl sm:text-4xl font-black mb-1 uppercase text-[#00E639]">Health Hero</h1>
            <p className="text-sm text-[#A0A0C0] mb-6">Collect healthy food and dodge the junk!</p>

            <div className="space-y-2 mb-6 text-left rounded-lg p-3 border border-[#3D3D5C] bg-[#1A1A2E]">
              <div className="hidden sm:block space-y-2">
                <div className="flex items-center gap-3 text-[#00E639] text-sm font-medium">
                  <kbd className="border border-[#3D3D5C] rounded px-2 py-1 bg-[#2A2A3E] text-white">A / D</kbd> Move
                </div>
                <div className="flex items-center gap-3 text-[#00E639] text-sm font-medium">
                  <kbd className="border border-[#3D3D5C] rounded px-2 py-1 bg-[#2A2A3E] text-white">W</kbd> Jump
                </div>
                <div className="flex items-center gap-3 text-[#00E639] text-sm font-medium">
                  <kbd className="border border-[#3D3D5C] rounded px-2 py-1 bg-[#2A2A3E] text-white">S</kbd> Roll
                </div>
              </div>
              <div className="sm:hidden space-y-1 text-[#00E639] text-xs">
                <div>👈👉 Swipe Left/Right to move</div>
                <div>👆 Swipe Up to jump</div>
                <div>👇 Swipe Down to roll</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-6">
              {FOOD_GROUPS.map(fg => (
                <div key={fg} className="rounded-lg p-1.5 border border-[#3D3D5C] bg-[#1A1A2E]">
                  <div className="w-2.5 h-2.5 rounded-full mx-auto mb-1" style={{ background: FOOD_GROUP_COLORS[fg] }} />
                  <div className="text-[10px] font-bold text-[#C0C0E0]">{FOOD_GROUP_LABELS[fg]}</div>
                </div>
              ))}
            </div>

            <button onClick={startGame} className="w-full text-white rounded-lg py-3 sm:py-4 font-bold text-base sm:text-lg bg-green-500 shadow-lg uppercase mb-3 text-white">Play Now!</button>
            <button onClick={goToLearn} className="w-full rounded-lg py-3 font-bold text-sm uppercase border border-[#FFD000] text-[#FFD000]">How to Play</button>
          </div>
        </div>
      )}

      {status === 'gameover' && <SummaryScreen />}
      {status === 'learn' && <LearnPage />}
    </div>
  );
}
