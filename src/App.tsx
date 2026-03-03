import { Game } from './Game';
import { useGameStore, FoodGroup } from './store';
import { FOOD_GROUP_LABELS, FOOD_GROUP_COLORS } from './foodData';
import { Heart, Play, RotateCcw, Footprints } from 'lucide-react';

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

  // Health meter color
  const healthColor = healthMeter > 60 ? '#4CAF50' : healthMeter > 30 ? '#FFD54F' : '#EF5350';
  const healthPulse = healthMeter < 30 ? 'animate-pulse' : '';

  // Total healthy items collected
  const totalHealthy = Object.values(foodGroupCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="relative w-full h-screen bg-amber-50 overflow-hidden" style={{ fontFamily: "'Nunito', 'Quicksand', sans-serif" }}>
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
          <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start pointer-events-none">
            {/* Top-Left: HeroPoints */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl px-4 py-2 border border-green-200 shadow-md flex items-center gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black" style={{ background: '#4CAF50', color: 'white' }}>HP</div>
              <span className="font-mono text-xl font-black" style={{ color: '#4CAF50' }}>{Math.floor(heroPoints)}</span>
              {comboMultiplierActive && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full animate-bounce" style={{ background: '#FFD54F', color: '#8D6E63' }}>2x</span>
              )}
            </div>

            {/* Top-Center: Distance */}
            <div className="bg-white/50 backdrop-blur-sm rounded-xl px-3 py-1 border border-amber-100 flex items-center gap-1">
              <Footprints className="w-4 h-4" style={{ color: '#8D6E63' }} />
              <span className="font-mono text-sm font-bold" style={{ color: '#8D6E63' }}>{Math.floor(distance)}m</span>
            </div>

            {/* Top-Right: Health Meter */}
            <div className={`bg-white/70 backdrop-blur-sm rounded-2xl px-4 py-2 border shadow-md flex items-center gap-2 ${healthPulse}`} style={{ borderColor: healthColor + '44' }}>
              <Heart className="w-5 h-5" style={{ color: healthColor, fill: healthColor }} />
              <div className="w-24 h-3 rounded-full overflow-hidden" style={{ background: '#FFF8E1' }}>
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${healthMeter}%`, background: healthColor }}
                />
              </div>
              <span className="font-mono text-sm font-bold" style={{ color: healthColor }}>{Math.floor(healthMeter)}</span>
            </div>
          </div>

          {/* NutriFact Pop-up — top-right, compact */}
          {activeFact && (
            <div className="absolute top-16 right-4 pointer-events-none z-10">
              <div
                className="rounded-xl px-3 py-1.5 shadow-md border text-xs font-bold"
                style={{
                  background: activeFact.isHealthy ? '#E8F5E9' : '#FFEBEE',
                  borderColor: activeFact.isHealthy ? '#4CAF50' : '#EF5350',
                  color: activeFact.isHealthy ? '#2E7D32' : '#C62828',
                }}
              >
                {activeFact.isHealthy ? `+ ${activeFact.item}` : `- ${activeFact.item}`}
              </div>
            </div>
          )}

          {/* Combo Message — top-right below fact */}
          {comboMultiplierActive && comboMessage && (
            <div className="absolute top-24 right-4 pointer-events-none z-10">
              <div className="rounded-xl px-3 py-1 shadow-md text-xs font-black" style={{ background: '#FFD54F', color: '#8D6E63' }}>
                {comboMessage} 2x
              </div>
            </div>
          )}
        </>
      )}

      {/* Start Screen */}
      {status === 'start' && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(255,248,225,0.7)', backdropFilter: 'blur(4px)' }}>
          <div className="rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border" style={{ background: '#FFF8E1', borderColor: '#FFD54F' }}>
            <h1 className="text-4xl font-black mb-1 uppercase tracking-tight" style={{ color: '#4CAF50' }}>Health Hero</h1>
            <p className="text-lg font-bold mb-1" style={{ color: '#FF9800' }}>The Healthy Runner</p>
            <p className="mb-6 font-medium text-sm" style={{ color: '#8D6E63' }}>Collect healthy food, dodge junk food, and learn about nutrition!</p>

            <div className="space-y-3 mb-6 text-left rounded-2xl p-4 border" style={{ background: 'white', borderColor: '#C8E6C9' }}>
              <div className="flex items-center gap-3" style={{ color: '#4CAF50' }}>
                <kbd className="border rounded px-2 py-1 font-mono text-sm shadow-sm" style={{ background: '#E8F5E9', borderColor: '#A5D6A7' }}>A / D</kbd>
                <span className="text-sm font-medium">Move Left / Right</span>
              </div>
              <div className="flex items-center gap-3" style={{ color: '#4CAF50' }}>
                <kbd className="border rounded px-2 py-1 font-mono text-sm shadow-sm" style={{ background: '#E8F5E9', borderColor: '#A5D6A7' }}>W</kbd>
                <span className="text-sm font-medium">Jump</span>
              </div>
              <div className="flex items-center gap-3" style={{ color: '#4CAF50' }}>
                <kbd className="border rounded px-2 py-1 font-mono text-sm shadow-sm" style={{ background: '#E8F5E9', borderColor: '#A5D6A7' }}>S</kbd>
                <span className="text-sm font-medium">Roll / Slide</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-6">
              {FOOD_GROUPS.map((fg) => (
                <div key={fg} className="rounded-xl px-2 py-1.5 text-center border" style={{ background: FOOD_GROUP_COLORS[fg] + '22', borderColor: FOOD_GROUP_COLORS[fg] + '44' }}>
                  <div className="w-3 h-3 rounded-full mx-auto mb-0.5" style={{ background: FOOD_GROUP_COLORS[fg] }} />
                  <div className="text-xs font-bold" style={{ color: '#8D6E63' }}>{FOOD_GROUP_LABELS[fg]}</div>
                </div>
              ))}
            </div>

            <button
              onClick={startGame}
              className="w-full text-white rounded-2xl py-4 font-bold text-lg flex items-center justify-center gap-2 transition-colors shadow-lg"
              style={{ background: '#4CAF50', boxShadow: '0 8px 20px rgba(76,175,80,0.3)' }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#388E3C'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#4CAF50'}
            >
              <Play className="w-5 h-5 fill-current" />
              START RUNNING!
            </button>
          </div>
        </div>
      )}

      {/* Game Over / Run Summary Screen (FR-032) */}
      {status === 'gameover' && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(255,248,225,0.7)', backdropFilter: 'blur(4px)' }}>
          <div className="rounded-3xl p-6 max-w-md w-full text-center shadow-2xl border" style={{ background: '#FFF8E1', borderColor: '#FFD54F' }}>
            <h2 className="text-3xl font-black mb-1 uppercase tracking-tight" style={{ color: '#FF9800' }}>Run Summary</h2>
            <p className="mb-4 font-medium text-sm" style={{ color: '#8D6E63' }}>
              {healthMeter <= 0 ? 'Your health ran out! Eat more healthy food next time!' : 'You bumped into a wall! Try to dodge next time!'}
            </p>

            {/* Score row */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="rounded-2xl p-3 border" style={{ background: '#E8F5E9', borderColor: '#A5D6A7' }}>
                <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#4CAF50' }}>HeroPoints</div>
                <div className="text-2xl font-black" style={{ color: '#2E7D32' }}>{Math.floor(heroPoints)}</div>
              </div>
              <div className="rounded-2xl p-3 border" style={{ background: '#E3F2FD', borderColor: '#90CAF9' }}>
                <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#42A5F5' }}>Distance</div>
                <div className="text-2xl font-black" style={{ color: '#1565C0' }}>{Math.floor(distance)}m</div>
              </div>
              <div className="rounded-2xl p-3 border" style={{ background: '#FFF3E0', borderColor: '#FFB74D' }}>
                <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#FF9800' }}>Clean Run</div>
                <div className="text-2xl font-black" style={{ color: '#E65100' }}>{Math.floor(longestCleanRun)}m</div>
              </div>
            </div>

            {/* Food groups collected */}
            <div className="rounded-2xl p-3 border mb-4" style={{ background: 'white', borderColor: '#C8E6C9' }}>
              <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#4CAF50' }}>
                Food Groups Collected ({totalHealthy} items)
              </div>
              <div className="grid grid-cols-3 gap-2">
                {FOOD_GROUPS.map((fg) => {
                  const count = foodGroupCounts[fg];
                  return (
                    <div key={fg} className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: FOOD_GROUP_COLORS[fg] }} />
                      <span className="text-xs font-bold truncate" style={{ color: '#8D6E63' }}>
                        {FOOD_GROUP_LABELS[fg]}
                      </span>
                      <span className="text-xs font-black ml-auto" style={{ color: count > 0 ? '#4CAF50' : '#BDBDBD' }}>
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
              {/* Simple bar chart */}
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
            <div className="flex justify-center gap-4 mb-4 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full" style={{ background: '#EF5350' }} />
                <span className="font-bold" style={{ color: '#8D6E63' }}>Junk Food Hits: {junkContacts}</span>
              </div>
            </div>

            <button
              onClick={startGame}
              className="w-full text-white rounded-2xl py-4 font-bold text-lg flex items-center justify-center gap-2 transition-colors shadow-lg"
              style={{ background: '#4CAF50', boxShadow: '0 8px 20px rgba(76,175,80,0.3)' }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#388E3C'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#4CAF50'}
            >
              <RotateCcw className="w-5 h-5" />
              RUN AGAIN!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
