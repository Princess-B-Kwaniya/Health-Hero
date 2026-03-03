import { useGameStore } from './store';
import { HEALTHY_ITEMS, JUNK_ITEMS, FOOD_GROUP_COLORS, FOOD_GROUP_LABELS } from './foodData';
import { ArrowLeft } from 'lucide-react';
import type { FoodGroup } from './store';

const FOOD_GROUPS: FoodGroup[] = ['fruits', 'vegetables', 'proteins', 'grains', 'dairy', 'hydration'];

export function LearnPage() {
  const goToStart = useGameStore((state) => state.goToStart);

  return (
    <div
      className="absolute inset-0 z-50 overflow-y-auto"
      style={{ background: '#1A1A2E', fontFamily: "'Fredoka One', 'Nunito', sans-serif" }}
    >
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Back button */}
        <button
          onClick={goToStart}
          className="flex items-center gap-2 mb-6 px-4 py-2 rounded-lg font-bold text-sm transition-all"
          style={{ background: '#2A2A3E', color: '#A0A0C0', border: '1px solid #3D3D5C' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#3D3D5C'; e.currentTarget.style.color = '#FFFFFF'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#2A2A3E'; e.currentTarget.style.color = '#A0A0C0'; }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Menu
        </button>

        {/* Title */}
        <h1 className="text-3xl font-black uppercase tracking-tight mb-2" style={{ color: '#00E639' }}>
          Nutrition Guide
        </h1>
        <p className="text-sm mb-8" style={{ color: '#A0A0C0' }}>
          Understanding what you eat matters. In Health Hero, your food choices directly affect
          your power. This guide explains why some foods help you and why others drain your energy,
          even when they taste good.
        </p>

        {/* --- Section: How Food Affects Your Power --- */}
        <div className="rounded-xl p-5 mb-6 border" style={{ background: '#2A2A3E', borderColor: '#3D3D5C' }}>
          <h2 className="text-xl font-black uppercase mb-3" style={{ color: '#FFD000' }}>
            How Food Affects Your Power
          </h2>
          <p className="text-sm mb-3" style={{ color: '#C0C0E0' }}>
            Every food you eat in the game changes your Health Meter. Healthy foods restore it.
            Junk food drains it. When your Health Meter reaches zero, the run is over.
          </p>
          <p className="text-sm mb-3" style={{ color: '#C0C0E0' }}>
            This works the same way in real life. Healthy food gives your body the fuel it needs
            to run, think, and grow. Junk food might taste nice in the moment, but it gives you a
            short burst of energy followed by a crash. Eat too much of it and your body slows down,
            your focus drops, and you feel tired.
          </p>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="rounded-lg p-3 border" style={{ background: '#1A1A2E', borderColor: '#00E639' }}>
              <div className="text-xs font-bold uppercase mb-1" style={{ color: '#00E639' }}>Healthy Food</div>
              <div className="text-sm" style={{ color: '#C0C0E0' }}>
                Restores +4 to +10 health per item. Water and vegetables give the most. Collecting
                5 of the same food group triggers a 2x score multiplier.
              </div>
            </div>
            <div className="rounded-lg p-3 border" style={{ background: '#1A1A2E', borderColor: '#FF4444' }}>
              <div className="text-xs font-bold uppercase mb-1" style={{ color: '#FF4444' }}>Junk Food</div>
              <div className="text-sm" style={{ color: '#C0C0E0' }}>
                Drains 12 to 22 health per hit. Also causes screen effects like blur, tilt,
                or slowdown that make it harder to dodge the next obstacle.
              </div>
            </div>
          </div>
        </div>

        {/* --- Section: Healthy Food Groups --- */}
        <div className="rounded-xl p-5 mb-6 border" style={{ background: '#2A2A3E', borderColor: '#3D3D5C' }}>
          <h2 className="text-xl font-black uppercase mb-3" style={{ color: '#00E639' }}>
            The 6 Healthy Food Groups
          </h2>
          <p className="text-sm mb-4" style={{ color: '#C0C0E0' }}>
            Each food group provides different nutrients your body needs. A balanced diet includes
            all of them. In the game, collecting items from the same group builds combos for bonus
            points.
          </p>
          <div className="space-y-3">
            {FOOD_GROUPS.map((fg) => {
              const items = HEALTHY_ITEMS.filter((h) => h.foodGroup === fg);
              const healthBoost = fg === 'hydration' ? 10 : fg === 'vegetables' ? 6 : fg === 'proteins' ? 5 : 4;
              return (
                <div key={fg} className="rounded-lg p-3 border" style={{ background: '#1A1A2E', borderColor: FOOD_GROUP_COLORS[fg] + '66' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 rounded" style={{ background: FOOD_GROUP_COLORS[fg] }} />
                    <span className="text-sm font-black uppercase" style={{ color: FOOD_GROUP_COLORS[fg] }}>
                      {FOOD_GROUP_LABELS[fg]}
                    </span>
                    <span className="text-xs font-bold ml-auto px-2 py-0.5 rounded" style={{ background: '#00E639', color: '#000' }}>
                      +{healthBoost} health
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="text-xs px-2 py-1 rounded font-bold"
                        style={{ background: item.color + '22', color: '#C0C0E0', border: `1px solid ${item.color}44` }}
                        title={item.fact}
                      >
                        {item.name} (+{item.points} pts)
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* --- Section: Why Junk Food Is Dangerous --- */}
        <div className="rounded-xl p-5 mb-6 border" style={{ background: '#2A2A3E', borderColor: '#3D3D5C' }}>
          <h2 className="text-xl font-black uppercase mb-3" style={{ color: '#FF4444' }}>
            Why Junk Food Hurts Your Run
          </h2>
          <p className="text-sm mb-3" style={{ color: '#C0C0E0' }}>
            Junk food is designed to taste good. Companies add sugar, salt, and fat to make you
            want more. But that great taste comes at a cost. These foods have very little nutrition
            and a lot of empty calories that your body cannot use properly.
          </p>
          <p className="text-sm mb-3" style={{ color: '#C0C0E0' }}>
            In the game, hitting junk food does not just cost you points. It also triggers
            negative screen effects that make it harder to play. This represents how junk food
            affects your real body: blurred focus, sluggish movement, and poor decision-making.
          </p>
          <p className="text-sm mb-4" style={{ color: '#C0C0E0' }}>
            Not all junk food is equally bad. Some items have higher penalties than
            others. Here is a breakdown from least damaging to most damaging:
          </p>

          {/* Junk food ranked by penalty */}
          {(['Candy & Sweets', 'Processed Snacks', 'Sugary Drinks', 'Fried Foods', 'Excessive Sugar'] as const).map((category) => {
            const items = JUNK_ITEMS.filter((j) => j.category === category);
            const avgPenalty = Math.round(items.reduce((sum, j) => sum + j.penalty, 0) / items.length);
            const effectDesc: Record<string, string> = {
              'blur': 'Blurs your vision, making it hard to see obstacles ahead',
              'tilt': 'Tilts the screen, throwing off your sense of direction',
              'slow': 'Slows your character down, making it harder to react',
              'invert': 'Inverts screen colours, creating visual confusion',
            };
            const mainEffect = items[0]?.effect || 'tilt';
            const dangerLevel = avgPenalty <= 9 ? 'Moderate' : avgPenalty <= 11 ? 'High' : 'Severe';
            const dangerColor = avgPenalty <= 9 ? '#FFD000' : avgPenalty <= 11 ? '#FF8F00' : '#FF4444';

            return (
              <div key={category} className="rounded-lg p-3 mb-3 border" style={{ background: '#1A1A2E', borderColor: '#3D3D5C' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-black uppercase" style={{ color: '#C0C0E0' }}>
                    {category}
                  </span>
                  <span
                    className="text-xs font-bold ml-auto px-2 py-0.5 rounded"
                    style={{ background: dangerColor, color: '#000' }}
                  >
                    {dangerLevel} ({avgPenalty} avg penalty)
                  </span>
                </div>
                <p className="text-xs mb-2" style={{ color: '#888' }}>
                  Effect: {effectDesc[mainEffect]}
                </p>
                <div className="flex flex-wrap gap-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="text-xs px-2 py-1 rounded font-bold"
                      style={{ background: item.color + '22', color: '#C0C0E0', border: `1px solid ${item.color}44` }}
                      title={item.fact}
                    >
                      {item.name} (-{item.penalty} pts, -{Math.round(item.penalty * 1.5)} health)
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* --- Section: The Real Cost --- */}
        <div className="rounded-xl p-5 mb-6 border" style={{ background: '#2A2A3E', borderColor: '#3D3D5C' }}>
          <h2 className="text-xl font-black uppercase mb-3" style={{ color: '#FFD000' }}>
            The Real Cost of "Tastes Good"
          </h2>

          <div className="space-y-4 text-sm" style={{ color: '#C0C0E0' }}>
            <p>
              A single Cola Can costs you 10 points and 15 health. That means you need to collect
              at least 2 healthy food items just to undo the damage from one soda. A Cake Slice
              or Ice Cream Sundae is even worse at 15 points and over 22 health lost. You would
              need 3 to 4 healthy items to recover from that.
            </p>
            <p>
              In real life, the math is similar. A can of soda contains about 10 teaspoons of
              sugar. Your body only needs about 6 teaspoons of added sugar in an entire day.
              One soda already puts you over the limit. A doughnut adds fried oil on top of that
              sugar. French fries soak up oil during frying, turning a simple potato into
              something your body struggles to process.
            </p>
            <p>
              The worst part is the chain reaction. In the game, hitting 3 junk food items in
              a row triggers a "slow" penalty that lasts 5 seconds. This makes it much more
              likely you will hit the next obstacle too. The same thing happens with real eating
              habits. One bad choice makes the next bad choice easier because your energy and
              focus are already compromised.
            </p>

            {/* Comparison table */}
            <div className="rounded-lg overflow-hidden mt-4 border" style={{ borderColor: '#3D3D5C' }}>
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ background: '#2A2A3E' }}>
                    <th className="text-left px-3 py-2 font-bold uppercase" style={{ color: '#FFD000' }}>Junk Item</th>
                    <th className="text-center px-3 py-2 font-bold uppercase" style={{ color: '#FF4444' }}>Points Lost</th>
                    <th className="text-center px-3 py-2 font-bold uppercase" style={{ color: '#FF4444' }}>Health Lost</th>
                    <th className="text-center px-3 py-2 font-bold uppercase" style={{ color: '#00A2FF' }}>Items to Recover</th>
                  </tr>
                </thead>
                <tbody>
                  {JUNK_ITEMS.sort((a, b) => a.penalty - b.penalty).map((item) => (
                    <tr key={item.id} style={{ background: '#1A1A2E', borderTop: '1px solid #2A2A3E' }}>
                      <td className="px-3 py-1.5 font-bold" style={{ color: '#C0C0E0' }}>{item.name}</td>
                      <td className="text-center px-3 py-1.5" style={{ color: '#FF4444' }}>-{item.penalty}</td>
                      <td className="text-center px-3 py-1.5" style={{ color: '#FF4444' }}>-{Math.round(item.penalty * 1.5)}</td>
                      <td className="text-center px-3 py-1.5" style={{ color: '#00A2FF' }}>{Math.ceil(item.penalty * 1.5 / 5)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* --- Section: Tips --- */}
        <div className="rounded-xl p-5 mb-6 border" style={{ background: '#2A2A3E', borderColor: '#3D3D5C' }}>
          <h2 className="text-xl font-black uppercase mb-3" style={{ color: '#00E639' }}>
            Tips for a Better Run (and a Better Diet)
          </h2>
          <div className="space-y-2 text-sm" style={{ color: '#C0C0E0' }}>
            <div className="flex gap-2">
              <span className="font-black" style={{ color: '#00E639' }}>1.</span>
              <span>Prioritise water and vegetables. They give the most health back (+10 and +6).</span>
            </div>
            <div className="flex gap-2">
              <span className="font-black" style={{ color: '#00E639' }}>2.</span>
              <span>Collect 5 items from the same food group to trigger a 2x score multiplier for 10 seconds.</span>
            </div>
            <div className="flex gap-2">
              <span className="font-black" style={{ color: '#00E639' }}>3.</span>
              <span>Avoid junk food completely if possible. Every hit resets your combo progress.</span>
            </div>
            <div className="flex gap-2">
              <span className="font-black" style={{ color: '#00E639' }}>4.</span>
              <span>Watch for the item names floating above obstacles. Learn which ones cost the most.</span>
            </div>
            <div className="flex gap-2">
              <span className="font-black" style={{ color: '#00E639' }}>5.</span>
              <span>If you do hit junk food, immediately try to collect healthy items to recover before the next obstacle.</span>
            </div>
            <div className="flex gap-2">
              <span className="font-black" style={{ color: '#00E639' }}>6.</span>
              <span>In real life, the same rule applies: if you eat something unhealthy, balance it with healthier choices at your next meal.</span>
            </div>
          </div>
        </div>

        {/* Back to menu button at bottom */}
        <div className="flex gap-3 pb-8">
          <button
            onClick={goToStart}
            className="flex-1 text-white rounded-lg py-4 font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg uppercase tracking-wide"
            style={{ background: 'linear-gradient(180deg, #00E639 0%, #00B82E 100%)', boxShadow: '0 6px 20px rgba(0,230,57,0.35)' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(180deg, #00FF41 0%, #00CC33 100%)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(180deg, #00E639 0%, #00B82E 100%)'}
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
}
