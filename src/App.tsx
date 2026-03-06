import { Game } from './Game';
import { useGameStore, FoodGroup } from './store';
import { FOOD_GROUP_LABELS, FOOD_GROUP_COLORS } from './foodData';
import { Heart, Play, RotateCcw, Footprints, BookOpen } from 'lucide-react';
import { LearnPage } from './LearnPage';
import { useCallback, useRef, useEffect } from 'react';

const FOOD_GROUPS: FoodGroup[] = ['fruits', 'vegetables', 'proteins', 'grains', 'dairy', 'hydration'];

export default function App() {
  const status = useGameStore((state) => state.status);
  const heroPoints = useGameStore((state) => state.heroPoints);
  const healthMeter = useGameStore((state) => state.healthMeter);
  const distance = useGameStore((state) => state.distance);
  const foodGroupCounts = useGameStore((state) => state.foodGroupCounts);
  const junkContacts = useGameStore((state) => state.junkContacts);
  const activeFact = useGameStore((state) => state.activeFact);
  const activeEffect = useGameStore((state) => state.activeEffect);
  const comboMultiplierActive = useGameStore((state) => state.comboMultiplierActive);
  const comboMessage = useGameStore((state) => state.comboMessage);
  const longestCleanRun = useGameStore((state) => state.longestCleanRun);
  const startGame = useGameStore((state) => state.startGame);
  const goToLearn = useGameStore((state) => state.goToLearn);

  // Health meter color
  const healthColor = healthMeter > 60 ? '#4CAF50' : healthMeter > 30 ? '#FFD54F' : '#EF5350';
  const healthPulse = healthMeter < 30 ? 'animate-pulse' : '';

  // Mobile touch controls — dispatch keyboard events so Player.tsx picks them up
  const fireKey = useCallback((key: string) => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key }));
  }, []);

  // Swipe gesture detection
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
      if (elapsed > 500) return; // too slow — not a swipe
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);
      if (absDx < SWIPE_THRESHOLD && absDy < SWIPE_THRESHOLD) return; // tap, not swipe
      if (absDx > absDy) {
        // horizontal swipe
        fireKey(dx > 0 ? 'd' : 'a');
      } else {
        // vertical swipe
        fireKey(dy > 0 ? 's' : 'w');
      }
    };
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [fireKey]);

  // Total healthy items collected
  const totalHealthy = Object.values(foodGroupCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="relative w-full bg-[#1B2838] overflow-hidden" style={{ fontFamily: "'Fredoka One', 'Nunito', sans-serif", height: '100dvh' }}>
      <Game />

      {/* Visual effect overlays from junk food */}
      {status === 'playing' && activeEffect === 'blur' && (
        <div className="absolute inset-0 pointer-events-none" style={{ backdropFilter: 'blur(3px)', border: '8px solid rgba(239, 83, 80, 0.3)', borderRadius: '0' }} />
      )}
      {status === 'playing' && activeEffect === 'tilt' && (
        <div className="absolute inset-0 pointer-events-none" style={{ transform: 'rotate(1.5deg)', border: '6px solid rgba(255, 152, 0, 0.3)' }} />
      )}
      {status === 'playing' && activeEffect === 'invert' && (
        <div className="absolute inset-0 pointer-events-none" style={{ filter: 'hue-rotate(180deg)', mixBlendMode: 'difference', background: 'rgba(206,147,216,0.15)' }} />
      )}
      {status === 'playing' && activeEffect === 'slow' && (
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle, transparent 40%, rgba(239,83,80,0.15) 100%)' }} />
      )}

      {/* HUD */}
      {status === 'playing' && (
        <>
          <div className="absolute top-0 left-0 w-full p-2 sm:p-4 flex justify-between items-start pointer-events-none">
            {/* Top-Left: HeroPoints — Roblox dark panel style */}
            <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2 sm:px-4 py-1.5 sm:py-2 border border-white/10 shadow-lg flex items-center gap-1.5 sm:gap-2">
              <div className="w-5 h-5 sm:w-7 sm:h-7 rounded flex items-center justify-center text-[10px] sm:text-xs font-black" style={{ background: '#00E639', color: '#000' }}>HP</div>
              <span className="font-mono text-sm sm:text-xl font-black" style={{ color: '#00E639' }}>{Math.floor(heroPoints)}</span>
              {comboMultiplierActive && (
                <span className="text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded animate-bounce" style={{ background: '#FFD000', color: '#000' }}>2x</span>
              )}
            </div>

            {/* Top-Center: Distance */}
            <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 border border-white/10 flex items-center gap-1">
              <Footprints className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: '#FFD000' }} />
              <span className="font-mono text-xs sm:text-sm font-bold" style={{ color: '#FFD000' }}>{Math.floor(distance)}m</span>
            </div>

            {/* Top-Right: Health Meter — Roblox green bar */}
            <div className={`bg-black/60 backdrop-blur-sm rounded-lg px-2 sm:px-4 py-1.5 sm:py-2 border border-white/10 shadow-lg flex items-center gap-1.5 sm:gap-2 ${healthPulse}`}>
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: healthColor, fill: healthColor }} />
              <div className="w-14 sm:w-24 h-2 sm:h-3 rounded overflow-hidden" style={{ background: '#1A1A2E' }}>
                <div
                  className="h-full rounded transition-all duration-300"
                  style={{ width: `${healthMeter}%`, background: healthColor }}
                />
              </div>
              <span className="font-mono text-xs sm:text-sm font-bold" style={{ color: healthColor }}>{Math.floor(healthMeter)}</span>
            </div>
          </div>

          {/* NutriFact Pop-up — Roblox notification style */}
          {activeFact && (
            <div className="absolute top-12 sm:top-16 right-2 sm:right-4 pointer-events-none z-10">
              <div
                className="rounded-lg px-3 py-1.5 shadow-lg border text-xs font-bold"
                style={{
                  background: activeFact.isHealthy ? 'rgba(0,230,57,0.9)' : 'rgba(255,60,60,0.9)',
                  borderColor: activeFact.isHealthy ? '#00FF41' : '#FF4444',
                  color: '#FFFFFF',
                }}
              >
                {activeFact.isHealthy ? `+ ${activeFact.item}` : `- ${activeFact.item}`}
              </div>
            </div>
          )}

          {/* Combo Message — Roblox style */}
          {comboMultiplierActive && comboMessage && (
            <div className="absolute top-20 sm:top-24 right-2 sm:right-4 pointer-events-none z-10">
              <div className="rounded-lg px-3 py-1 shadow-lg text-xs font-black" style={{ background: '#FFD000', color: '#000' }}>
                {comboMessage} 2x
              </div>
            </div>
          )}
        </>
      )}

      {/* Start Screen — Roblox-style dark modal */}
      {status === 'start' && (
        <div className="absolute inset-0 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}>
          <div className="rounded-xl p-5 sm:p-8 max-w-sm w-full text-center shadow-2xl border max-h-[90vh] overflow-y-auto" style={{ background: '#2A2A3E', borderColor: '#3D3D5C' }}>
            <h1 className="text-2xl sm:text-4xl font-black mb-1 uppercase tracking-tight" style={{ color: '#00E639' }}>Health Hero</h1>
            <p className="text-base sm:text-lg font-bold mb-1" style={{ color: '#FFD000' }}>The Healthy Runner</p>
            <p className="mb-4 sm:mb-6 font-medium text-xs sm:text-sm" style={{ color: '#A0A0C0' }}>Collect healthy food, dodge junk food, and learn about nutrition!</p>

            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 text-left rounded-lg p-3 sm:p-4 border" style={{ background: '#1A1A2E', borderColor: '#3D3D5C' }}>
              <p className="text-xs font-bold sm:hidden" style={{ color: '#A0A0C0' }}>Swipe to play on mobile!</p>
              <div className="hidden sm:flex items-center gap-3" style={{ color: '#00E639' }}>
                <kbd className="border rounded px-2 py-1 font-mono text-xs sm:text-sm shadow-sm" style={{ background: '#2A2A3E', borderColor: '#3D3D5C', color: '#FFFFFF' }}>A / D</kbd>
                <span className="text-xs sm:text-sm font-medium">Move Left / Right</span>
              </div>
              <div className="hidden sm:flex items-center gap-3" style={{ color: '#00E639' }}>
                <kbd className="border rounded px-2 py-1 font-mono text-xs sm:text-sm shadow-sm" style={{ background: '#2A2A3E', borderColor: '#3D3D5C', color: '#FFFFFF' }}>W</kbd>
                <span className="text-xs sm:text-sm font-medium">Jump</span>
              </div>
              <div className="hidden sm:flex items-center gap-3" style={{ color: '#00E639' }}>
                <kbd className="border rounded px-2 py-1 font-mono text-xs sm:text-sm shadow-sm" style={{ background: '#2A2A3E', borderColor: '#3D3D5C', color: '#FFFFFF' }}>S</kbd>
                <span className="text-xs sm:text-sm font-medium">Roll / Slide</span>
              </div>
              {/* Mobile swipe instructions */}
              <div className="flex sm:hidden items-center gap-3" style={{ color: '#00E639' }}>
                <span className="text-lg">👈👉</span>
                <span className="text-xs font-medium">Swipe Left / Right to move</span>
              </div>
              <div className="flex sm:hidden items-center gap-3" style={{ color: '#00E639' }}>
                <span className="text-lg">👆</span>
                <span className="text-xs font-medium">Swipe Up to jump</span>
              </div>
              <div className="flex sm:hidden items-center gap-3" style={{ color: '#00E639' }}>
                <span className="text-lg">👇</span>
                <span className="text-xs font-medium">Swipe Down to roll / slide</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-4 sm:mb-6">
              {FOOD_GROUPS.map((fg) => (
                <div key={fg} className="rounded-lg px-1.5 sm:px-2 py-1 sm:py-1.5 text-center border" style={{ background: FOOD_GROUP_COLORS[fg] + '22', borderColor: FOOD_GROUP_COLORS[fg] + '44' }}>
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded mx-auto mb-0.5" style={{ background: FOOD_GROUP_COLORS[fg] }} />
                  <div className="text-[10px] sm:text-xs font-bold" style={{ color: '#C0C0E0' }}>{FOOD_GROUP_LABELS[fg]}</div>
                </div>
              ))}
            </div>

            <button
              onClick={startGame}
              className="w-full text-white rounded-lg py-3 sm:py-4 font-bold text-base sm:text-lg flex items-center justify-center gap-2 transition-all shadow-lg uppercase tracking-wide mb-3"
              style={{ background: 'linear-gradient(180deg, #00E639 0%, #00B82E 100%)', boxShadow: '0 6px 20px rgba(0,230,57,0.35)' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(180deg, #00FF41 0%, #00CC33 100%)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(180deg, #00E639 0%, #00B82E 100%)'}
            >
              <Play className="w-5 h-5 fill-current" />
              START RUNNING!
            </button>
            <button
              onClick={goToLearn}
              className="w-full rounded-lg py-3 font-bold text-sm flex items-center justify-center gap-2 transition-all uppercase tracking-wide border"
              style={{ background: 'transparent', color: '#FFD000', borderColor: '#FFD000' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#FFD00022'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <BookOpen className="w-4 h-4" />
              LEARN ABOUT FOOD
            </button>
          </div>
        </div>
      )}

      {/* Game Over / Run Summary — Roblox-style dark modal */}
      {status === 'gameover' && (
        <div className="absolute inset-0 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}>
          <div className="rounded-xl p-4 sm:p-6 max-w-md w-full text-center shadow-2xl border max-h-[90vh] overflow-y-auto" style={{ background: '#2A2A3E', borderColor: '#3D3D5C' }}>
            <h2 className="text-2xl sm:text-3xl font-black mb-1 uppercase tracking-tight" style={{ color: '#FFD000' }}>Run Summary</h2>
            <p className="mb-3 sm:mb-4 font-medium text-xs sm:text-sm" style={{ color: '#A0A0C0' }}>
              {healthMeter <= 0 ? 'Your health ran out! Eat more healthy food next time!' : 'You bumped into a wall! Try to dodge next time!'}
            </p>

            {/* Score row — Roblox stat cards */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="rounded-lg p-2 sm:p-3 border" style={{ background: '#1A1A2E', borderColor: '#00E639' }}>
                <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#00E639' }}>HeroPoints</div>
                <div className="text-lg sm:text-2xl font-black" style={{ color: '#FFFFFF' }}>{Math.floor(heroPoints)}</div>
              </div>
              <div className="rounded-lg p-2 sm:p-3 border" style={{ background: '#1A1A2E', borderColor: '#00A2FF' }}>
                <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#00A2FF' }}>Distance</div>
                <div className="text-lg sm:text-2xl font-black" style={{ color: '#FFFFFF' }}>{Math.floor(distance)}m</div>
              </div>
              <div className="rounded-lg p-2 sm:p-3 border" style={{ background: '#1A1A2E', borderColor: '#FFD000' }}>
                <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#FFD000' }}>Clean Run</div>
                <div className="text-lg sm:text-2xl font-black" style={{ color: '#FFFFFF' }}>{Math.floor(longestCleanRun)}m</div>
              </div>
            </div>

            {/* Food groups collected */}
            <div className="rounded-lg p-2 sm:p-3 border mb-3 sm:mb-4" style={{ background: '#1A1A2E', borderColor: '#3D3D5C' }}>
              <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#00E639' }}>
                Food Groups Collected ({totalHealthy} items)
              </div>
              <div className="grid grid-cols-3 gap-2">
                {FOOD_GROUPS.map((fg) => {
                  const count = foodGroupCounts[fg];
                  return (
                    <div key={fg} className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded flex-shrink-0" style={{ background: FOOD_GROUP_COLORS[fg] }} />
                      <span className="text-xs font-bold truncate" style={{ color: '#A0A0C0' }}>
                        {FOOD_GROUP_LABELS[fg]}
                      </span>
                      <span className="text-xs font-black ml-auto" style={{ color: count > 0 ? '#00E639' : '#555' }}>
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
              {/* Bar chart */}
              <div className="mt-2 flex gap-1 h-8 items-end">
                {FOOD_GROUPS.map((fg) => {
                  const count = foodGroupCounts[fg];
                  const maxCount = Math.max(1, ...Object.values(foodGroupCounts));
                  const pct = (count / maxCount) * 100;
                  return (
                    <div
                      key={fg}
                      className="flex-1 rounded-t transition-all duration-500"
                      style={{ height: `${Math.max(4, pct)}%`, background: FOOD_GROUP_COLORS[fg], opacity: count > 0 ? 1 : 0.2 }}
                      title={`${FOOD_GROUP_LABELS[fg]}: ${count}`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Junk contacts */}
            <div className="flex justify-center gap-4 mb-3 sm:mb-4 text-xs sm:text-sm">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded" style={{ background: '#FF4444' }} />
                <span className="font-bold" style={{ color: '#A0A0C0' }}>Junk Food Hits: {junkContacts}</span>
              </div>
            </div>

            <button
              onClick={goToLearn}
              className="w-full rounded-lg py-3 mb-3 font-bold text-sm flex items-center justify-center gap-2 transition-all uppercase tracking-wide border"
              style={{ background: 'transparent', color: '#FFD000', borderColor: '#FFD000' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#FFD00022'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <BookOpen className="w-4 h-4" />
              LEARN WHY
            </button>

            <button
              onClick={startGame}
              className="w-full text-white rounded-lg py-3 sm:py-4 font-bold text-base sm:text-lg flex items-center justify-center gap-2 transition-all shadow-lg uppercase tracking-wide"
              style={{ background: 'linear-gradient(180deg, #00E639 0%, #00B82E 100%)', boxShadow: '0 6px 20px rgba(0,230,57,0.35)' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(180deg, #00FF41 0%, #00CC33 100%)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(180deg, #00E639 0%, #00B82E 100%)'}
            >
              <RotateCcw className="w-5 h-5" />
              RUN AGAIN!
            </button>
          </div>
        </div>
      )}

      {/* Learn / Education Page */}
      {status === 'learn' && <LearnPage />}
    </div>
  );
}
