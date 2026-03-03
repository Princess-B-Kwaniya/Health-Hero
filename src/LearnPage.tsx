import { useGameStore } from './store';
import { HEALTHY_ITEMS, JUNK_ITEMS, FOOD_GROUP_COLORS, FOOD_GROUP_LABELS } from './foodData';
import { ArrowLeft, Play } from 'lucide-react';
import type { FoodGroup } from './store';

/* ── Picture for every food item ── */
const FOOD_PICS: Record<string, string> = {
  // Healthy – Hydration
  'Water Bottle':    '\u{1F4A7}',
  'Coconut Water':   '\u{1F965}',
  'Herbal Tea':      '\u{1F375}',
  // Healthy – Fruits
  'Red Apple':       '\u{1F34E}',
  'Banana':          '\u{1F34C}',
  'Orange':          '\u{1F34A}',
  'Strawberry':      '\u{1F353}',
  'Watermelon':      '\u{1F349}',
  'Grapes':          '\u{1F347}',
  'Mango':           '\u{1F96D}',
  // Healthy – Vegetables
  'Carrot':          '\u{1F955}',
  'Broccoli':        '\u{1F966}',
  'Spinach':         '\u{1F96C}',
  'Bell Pepper':     '\u{1FAD1}',
  'Tomato':          '\u{1F345}',
  'Peas':            '\u{1FAD8}',
  'Sweet Potato':    '\u{1F360}',
  'Cucumber':        '\u{1F952}',
  // Healthy – Proteins
  'Grilled Chicken': '\u{1F357}',
  'Boiled Egg':      '\u{1F95A}',
  'Fish Fillet':     '\u{1F41F}',
  'Bean Bowl':       '\u{1FAD8}',
  'Almonds':         '\u{1F95C}',
  'Lentil Soup':     '\u{1F372}',
  // Healthy – Grains
  'Brown Bread':     '\u{1F35E}',
  'Oatmeal':         '\u{1F963}',
  'Brown Rice':      '\u{1F35A}',
  'Wheat Pasta':     '\u{1F35D}',
  // Healthy – Dairy
  'Milk Carton':     '\u{1F95B}',
  'Yoghurt Cup':     '\u{1F966}',
  // Junk – Sugary Drinks
  'Cola Can':        '\u{1F964}',
  'Energy Drink':    '\u{1F964}',
  'Milkshake':       '\u{1F964}',
  // Junk – Candy & Sweets
  'Lollipop':        '\u{1F36D}',
  'Gummy Bears':     '\u{1F36C}',
  'Chocolate Bar':   '\u{1F36B}',
  'Cotton Candy':    '\u{1F36C}',
  // Junk – Fried Foods
  'French Fries':    '\u{1F35F}',
  'Fried Chicken':   '\u{1F357}',
  'Doughnut':        '\u{1F369}',
  // Junk – Processed Snacks
  'Potato Chips':    '\u{1F35F}',
  'Cheese Puffs':    '\u{1F9C0}',
  'Instant Noodles': '\u{1F35C}',
  // Junk – Excessive Sugar
  'Cake Slice':      '\u{1F370}',
  'Ice Cream Sundae':'\u{1F368}',
};

const pic = (name: string) => FOOD_PICS[name] ?? '\u{1F34F}';

const FOOD_GROUPS: FoodGroup[] = ['fruits', 'vegetables', 'proteins', 'grains', 'dairy', 'hydration'];

/* ── Simple Roblox character avatar (CSS) ── */
function HeroAvatar({ size = 64 }: { size?: number }) {
  const s = size;
  const headH = s * 0.38;
  const bodyH = s * 0.35;
  const legH  = s * 0.22;
  return (
    <div className="flex-shrink-0" style={{ width: s, height: s }}>
      {/* Head – yellow */}
      <div style={{ width: headH, height: headH, background: '#FFD93D', borderRadius: 4, margin: '0 auto', border: '2px solid #C8A600', position: 'relative' }}>
        {/* Eyes */}
        <div style={{ position: 'absolute', top: '38%', left: '22%', width: 5, height: 5, borderRadius: '50%', background: '#222' }} />
        <div style={{ position: 'absolute', top: '38%', right: '22%', width: 5, height: 5, borderRadius: '50%', background: '#222' }} />
        {/* Smile */}
        <div style={{ position: 'absolute', bottom: '22%', left: '50%', transform: 'translateX(-50%)', width: 10, height: 5, borderBottom: '2px solid #222', borderRadius: '0 0 8px 8px' }} />
        {/* Beanie */}
        <div style={{ position: 'absolute', top: -5, left: -2, right: -2, height: 8, background: '#00B82E', borderRadius: '4px 4px 0 0' }} />
      </div>
      {/* Body – blue */}
      <div style={{ width: bodyH, height: bodyH, background: '#42A5F5', margin: '0 auto', borderRadius: 2, border: '2px solid #1976D2' }} />
      {/* Legs – green */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <div style={{ width: bodyH / 2 - 2, height: legH, background: '#66BB6A', borderRadius: '0 0 3px 3px', border: '2px solid #388E3C' }} />
        <div style={{ width: bodyH / 2 - 2, height: legH, background: '#66BB6A', borderRadius: '0 0 3px 3px', border: '2px solid #388E3C' }} />
      </div>
    </div>
  );
}

/* ── Speech bubble ── */
function SpeechBubble({ children, color = '#2A2A3E' }: { children: React.ReactNode; color?: string }) {
  return (
    <div className="relative rounded-2xl px-5 py-4 border-2" style={{ background: color, borderColor: '#3D3D5C' }}>
      {/* Triangle pointer */}
      <div style={{ position: 'absolute', left: -12, top: 18, width: 0, height: 0, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderRight: `12px solid ${color}` }} />
      {children}
    </div>
  );
}

/* ── Child-friendly effect descriptions ── */
const EFFECT_DESC: Record<string, string> = {
  blur:   'Makes your screen all blurry so you can not see!',
  tilt:   'Tilts your screen sideways, making it hard to move!',
  slow:   'Slows you down so you can not dodge the next one!',
  invert: 'Flips all the colours and confuses your eyes!',
};

/* ── Category child-friendly explanations ── */
const CATEGORY_INFO: Record<string, { danger: string; color: string; why: string }> = {
  'Candy & Sweets':    { danger: 'Watch Out',   color: '#FFD000', why: 'Candy is mostly just sugar. It gives you a tiny burst of energy, then makes you feel tired. It also hurts your teeth!' },
  'Processed Snacks':  { danger: 'Watch Out',   color: '#FFD000', why: 'Chips and puffs have loads of salt. Too much salt makes your heart work extra hard and makes you thirsty!' },
  'Sugary Drinks':     { danger: 'Dangerous',   color: '#FF8F00', why: 'One can of soda has about 10 spoons of sugar! That is more sugar than you should have in a whole day!' },
  'Fried Foods':       { danger: 'Dangerous',   color: '#FF8F00', why: 'Frying food soaks it in oil. That oil is really hard for your body to use. Grilled or baked food is way better!' },
  'Excessive Sugar':   { danger: 'Super Bad',   color: '#FF4444', why: 'Cake and ice cream have so much sugar it would take 3 or 4 healthy foods just to undo the damage. Your body crashes hard after eating these!' },
};

/* ── Food group child-friendly descriptions ── */
const GROUP_INFO: Record<FoodGroup, { why: string; power: string }> = {
  hydration:  { why: 'Water is the best drink ever! Your body is mostly water and it needs more every day to keep working.', power: 'Gives you the MOST health back!' },
  fruits:     { why: 'Fruits are nature\'s candy! They taste sweet but they are full of vitamins that keep you from getting sick.', power: 'Good energy boost!' },
  vegetables: { why: 'Veggies make you strong! They are packed with vitamins and minerals that help you grow tall and think fast.', power: 'Really good health boost!' },
  proteins:   { why: 'Protein builds your muscles! Things like chicken, eggs, fish, and beans help your body repair and grow.', power: 'Strong health boost!' },
  grains:     { why: 'Grains give you energy that lasts a long time! Brown bread and oatmeal keep you going all day.', power: 'Steady energy!' },
  dairy:      { why: 'Dairy makes your bones super strong! Milk and yoghurt have calcium that builds healthy teeth and bones.', power: 'Good health boost!' },
};

export function LearnPage() {
  const goToStart = useGameStore((state) => state.goToStart);
  const startGame = useGameStore((state) => state.startGame);

  return (
    <div
      className="absolute inset-0 z-50 overflow-y-auto"
      style={{ background: '#1A1A2E', fontFamily: "'Fredoka One', 'Nunito', sans-serif" }}
    >
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Back button */}
        <button
          onClick={goToStart}
          className="flex items-center gap-2 mb-6 px-4 py-2 rounded-lg font-bold text-base transition-all"
          style={{ background: '#2A2A3E', color: '#A0A0C0', border: '1px solid #3D3D5C' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#3D3D5C'; e.currentTarget.style.color = '#FFFFFF'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#2A2A3E'; e.currentTarget.style.color = '#A0A0C0'; }}
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        {/* ─── Hero Introduction ─── */}
        <div className="flex items-start gap-4 mb-8">
          <HeroAvatar size={80} />
          <SpeechBubble>
            <h1 className="text-3xl font-black uppercase tracking-tight mb-1" style={{ color: '#00E639' }}>
              Hey there! I am Health Hero!
            </h1>
            <p className="text-lg" style={{ color: '#C0C0E0' }}>
              Let me teach you about food! Some food gives you power, and some food takes it away.
              Ready to learn? Let's go!
            </p>
          </SpeechBubble>
        </div>

        {/* ─── How Food Works ─── */}
        <div className="flex items-start gap-4 mb-8">
          <HeroAvatar size={60} />
          <SpeechBubble>
            <h2 className="text-2xl font-black uppercase mb-2" style={{ color: '#FFD000' }}>
              How Does Food Work?
            </h2>
            <p className="text-lg mb-3" style={{ color: '#C0C0E0' }}>
              Think of your body like a car. Food is the fuel!
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl p-4 border-2" style={{ background: '#0D2B0D', borderColor: '#00E639' }}>
                <div className="text-xl font-black mb-2" style={{ color: '#00E639' }}>Good Food = Power UP!</div>
                <p className="text-base" style={{ color: '#C0C0E0' }}>
                  Healthy food is like super fuel. It gives you energy to run, jump, think,
                  and play! The more you eat, the stronger you get!
                </p>
              </div>
              <div className="rounded-xl p-4 border-2" style={{ background: '#2B0D0D', borderColor: '#FF4444' }}>
                <div className="text-xl font-black mb-2" style={{ color: '#FF4444' }}>Junk Food = Power DOWN!</div>
                <p className="text-base" style={{ color: '#C0C0E0' }}>
                  Junk food tastes yummy, but it takes away your power! It makes you feel
                  tired and slow. Eat too much and... game over!
                </p>
              </div>
            </div>
          </SpeechBubble>
        </div>

        {/* ─── The Healthy Foods ─── */}
        <div className="flex items-start gap-4 mb-4">
          <HeroAvatar size={60} />
          <SpeechBubble>
            <h2 className="text-2xl font-black uppercase mb-1" style={{ color: '#00E639' }}>
              The Good Stuff - Healthy Food!
            </h2>
            <p className="text-lg" style={{ color: '#C0C0E0' }}>
              There are 6 types of healthy food. Try to eat from ALL of them every day!
              In the game, if you collect 5 of the same type, you get double points!
            </p>
          </SpeechBubble>
        </div>

        <div className="space-y-5 mb-8 ml-2">
          {FOOD_GROUPS.map((fg) => {
            const items = HEALTHY_ITEMS.filter((h) => h.foodGroup === fg);
            const info = GROUP_INFO[fg];
            return (
              <div
                key={fg}
                className="rounded-2xl p-5 border-2"
                style={{ background: '#2A2A3E', borderColor: FOOD_GROUP_COLORS[fg] + '88' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-6 h-6 rounded-lg" style={{ background: FOOD_GROUP_COLORS[fg] }} />
                  <h3 className="text-2xl font-black uppercase" style={{ color: FOOD_GROUP_COLORS[fg] }}>
                    {FOOD_GROUP_LABELS[fg]}
                  </h3>
                  <span className="ml-auto text-sm font-bold px-3 py-1 rounded-full" style={{ background: '#00E639', color: '#000' }}>
                    {info.power}
                  </span>
                </div>
                <p className="text-base mb-4" style={{ color: '#C0C0E0' }}>{info.why}</p>
                {/* Food items with pictures */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl p-3 border flex items-center gap-3"
                      style={{ background: '#1A1A2E', borderColor: item.color + '44' }}
                    >
                      <span className="text-3xl flex-shrink-0">{pic(item.name)}</span>
                      <div>
                        <div className="text-base font-bold" style={{ color: '#FFFFFF' }}>{item.name}</div>
                        <div className="text-sm" style={{ color: '#A0A0C0' }}>+{item.points} points</div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Fun fact */}
                <div className="mt-3 rounded-lg px-4 py-2 border" style={{ background: '#1A1A2E', borderColor: FOOD_GROUP_COLORS[fg] + '44' }}>
                  <span className="text-sm font-bold" style={{ color: FOOD_GROUP_COLORS[fg] }}>Did you know? </span>
                  <span className="text-sm" style={{ color: '#C0C0E0' }}>{items[0]?.fact}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── The Junk Food ─── */}
        <div className="flex items-start gap-4 mb-4">
          <HeroAvatar size={60} />
          <SpeechBubble color="#2B1A1A">
            <h2 className="text-2xl font-black uppercase mb-1" style={{ color: '#FF4444' }}>
              Watch Out - Junk Food!
            </h2>
            <p className="text-lg" style={{ color: '#C0C0E0' }}>
              Junk food is tricky! It tastes really nice, but it takes away your power.
              And some junk food is WAY worse than others. Let me show you!
            </p>
          </SpeechBubble>
        </div>

        <div className="flex items-start gap-4 mb-4 ml-6">
          <SpeechBubble color="#2A2A3E">
            <p className="text-lg" style={{ color: '#C0C0E0' }}>
              <span className="font-black" style={{ color: '#FFD000' }}>Why does junk food taste so good?</span>
              <br />
              Companies add LOTS of sugar, salt, and fat to make you want more and more.
              But your body does not need all that stuff. It is like putting the wrong
              fuel in a car - it might smell nice, but it breaks the engine!
            </p>
          </SpeechBubble>
        </div>

        <div className="space-y-5 mb-8 ml-2">
          {(['Candy & Sweets', 'Processed Snacks', 'Sugary Drinks', 'Fried Foods', 'Excessive Sugar'] as const).map((category) => {
            const items = JUNK_ITEMS.filter((j) => j.category === category);
            const info = CATEGORY_INFO[category];

            return (
              <div
                key={category}
                className="rounded-2xl p-5 border-2"
                style={{ background: '#2A2A3E', borderColor: info.color + '66' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-2xl font-black uppercase" style={{ color: '#FFFFFF' }}>
                    {category}
                  </h3>
                  <span
                    className="ml-auto text-sm font-bold px-3 py-1 rounded-full"
                    style={{ background: info.color, color: '#000' }}
                  >
                    {info.danger}
                  </span>
                </div>
                <p className="text-base mb-3" style={{ color: '#C0C0E0' }}>{info.why}</p>

                {/* Junk items with pictures */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl p-3 border flex items-center gap-3"
                      style={{ background: '#1A1A2E', borderColor: info.color + '33' }}
                    >
                      <span className="text-3xl flex-shrink-0">{pic(item.name)}</span>
                      <div className="flex-1">
                        <div className="text-base font-bold" style={{ color: '#FFFFFF' }}>{item.name}</div>
                        <div className="text-sm font-bold" style={{ color: '#FF4444' }}>
                          Costs you {item.penalty} points and {Math.round(item.penalty * 1.5)} health!
                        </div>
                        <div className="text-sm" style={{ color: '#A0A0C0' }}>
                          {EFFECT_DESC[item.effect]}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Fun fact */}
                <div className="rounded-lg px-4 py-2 border" style={{ background: '#1A1A2E', borderColor: info.color + '33' }}>
                  <span className="text-sm font-bold" style={{ color: info.color }}>Did you know? </span>
                  <span className="text-sm" style={{ color: '#C0C0E0' }}>{items[0]?.fact}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── The Cost Explained Simply ─── */}
        <div className="flex items-start gap-4 mb-4">
          <HeroAvatar size={60} />
          <SpeechBubble>
            <h2 className="text-2xl font-black uppercase mb-1" style={{ color: '#FFD000' }}>
              How Bad Is It Really?
            </h2>
            <p className="text-lg" style={{ color: '#C0C0E0' }}>
              Look at this! If you eat one piece of junk food, you need to eat a LOT
              of healthy food just to get your power back!
            </p>
          </SpeechBubble>
        </div>

        <div className="rounded-2xl p-5 border-2 mb-8 ml-2" style={{ background: '#2A2A3E', borderColor: '#3D3D5C' }}>
          <div className="space-y-3">
            {[...JUNK_ITEMS].sort((a, b) => b.penalty - a.penalty).map((item) => {
              const recovery = Math.ceil(item.penalty * 1.5 / 5);
              return (
                <div
                  key={item.id}
                  className="rounded-xl p-4 border flex items-center gap-4"
                  style={{ background: '#1A1A2E', borderColor: '#3D3D5C' }}
                >
                  <span className="text-4xl flex-shrink-0">{pic(item.name)}</span>
                  <div className="flex-1">
                    <div className="text-lg font-black" style={{ color: '#FFFFFF' }}>{item.name}</div>
                    <div className="text-base" style={{ color: '#FF4444' }}>
                      Takes away {Math.round(item.penalty * 1.5)} health
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-2xl font-black" style={{ color: '#00A2FF' }}>{recovery}</div>
                    <div className="text-sm" style={{ color: '#A0A0C0' }}>healthy foods<br/>to recover</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── Tips ─── */}
        <div className="flex items-start gap-4 mb-4">
          <HeroAvatar size={60} />
          <SpeechBubble>
            <h2 className="text-2xl font-black uppercase mb-1" style={{ color: '#00E639' }}>
              My Top Tips!
            </h2>
            <p className="text-lg" style={{ color: '#C0C0E0' }}>
              Follow these tips and you will be a Health Hero in the game AND in real life!
            </p>
          </SpeechBubble>
        </div>

        <div className="rounded-2xl p-5 border-2 mb-8 ml-2" style={{ background: '#2A2A3E', borderColor: '#00E63966' }}>
          <div className="space-y-4">
            {[
              { num: 1, text: 'Drink lots of water! It gives you the most health back in the game AND in real life.' },
              { num: 2, text: 'Eat your veggies! They are super powerful and help you stay strong.' },
              { num: 3, text: 'Try to eat from ALL 6 food groups. Collect 5 of the same type for double points!' },
              { num: 4, text: 'Stay away from junk food! Every hit resets your combo and makes it harder to play.' },
              { num: 5, text: 'Look at the names floating above obstacles so you know what to dodge!' },
              { num: 6, text: 'If you DO hit junk food, quickly grab healthy food to recover before the next one!' },
              { num: 7, text: 'In real life, if you eat something unhealthy, balance it out with healthy choices at your next meal!' },
            ].map((tip) => (
              <div key={tip.num} className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-black flex-shrink-0"
                  style={{ background: '#00E639', color: '#000' }}
                >
                  {tip.num}
                </div>
                <p className="text-lg pt-1" style={{ color: '#C0C0E0' }}>{tip.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Bottom CTA ─── */}
        <div className="flex items-start gap-4 mb-6">
          <HeroAvatar size={60} />
          <SpeechBubble>
            <p className="text-lg font-bold" style={{ color: '#FFD000' }}>
              Now you know everything! Ready to put it to the test? Let's go!
            </p>
          </SpeechBubble>
        </div>

        <div className="flex gap-3 pb-8 ml-2">
          <button
            onClick={startGame}
            className="flex-1 text-white rounded-xl py-5 font-bold text-xl flex items-center justify-center gap-3 transition-all shadow-lg uppercase tracking-wide"
            style={{ background: 'linear-gradient(180deg, #00E639 0%, #00B82E 100%)', boxShadow: '0 6px 20px rgba(0,230,57,0.35)' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(180deg, #00FF41 0%, #00CC33 100%)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(180deg, #00E639 0%, #00B82E 100%)'}
          >
            <Play className="w-6 h-6 fill-current" />
            Play Now!
          </button>
          <button
            onClick={goToStart}
            className="rounded-xl px-6 py-5 font-bold text-xl flex items-center justify-center gap-2 transition-all uppercase tracking-wide border-2"
            style={{ background: 'transparent', color: '#A0A0C0', borderColor: '#3D3D5C' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#2A2A3E'; e.currentTarget.style.color = '#FFFFFF'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#A0A0C0'; }}
          >
            <ArrowLeft className="w-6 h-6" />
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
