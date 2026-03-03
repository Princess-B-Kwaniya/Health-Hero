import { create } from 'zustand';

export type GameStatus = 'start' | 'playing' | 'gameover' | 'learn';

export type FoodGroup = 'fruits' | 'vegetables' | 'proteins' | 'grains' | 'dairy' | 'hydration';

export interface NutriFact {
  item: string;
  fact: string;
  isHealthy: boolean;
  foodGroup?: FoodGroup;
}

export interface FoodGroupCounts {
  fruits: number;
  vegetables: number;
  proteins: number;
  grains: number;
  dairy: number;
  hydration: number;
}

interface GameState {
  status: GameStatus;
  heroPoints: number;
  healthMeter: number; // 0-100
  distance: number;
  speed: number;
  playerLane: number;
  playerY: number;
  playerHeight: number;
  foodGroupCounts: FoodGroupCounts;
  junkContacts: number;
  recentJunkHits: number;
  comboGroup: FoodGroup | null;
  comboCount: number;
  comboMultiplierActive: boolean;
  comboMultiplierEnd: number;
  comboMessage: string;
  activeFact: NutriFact | null;
  factExpiry: number;
  cleanRunDistance: number;
  longestCleanRun: number;
  activeEffect: 'none' | 'blur' | 'slow' | 'tilt' | 'invert';
  effectExpiry: number;
  setPlayerState: (lane: number, y: number, height: number) => void;
  startGame: () => void;
  endGame: () => void;
  addHeroPoints: (points: number) => void;
  collectHealthyItem: (foodGroup: FoodGroup, points: number, fact: NutriFact) => void;
  hitJunkFood: (penalty: number, effect: GameState['activeEffect'], duration: number, fact: NutriFact) => void;
  addDistance: (d: number) => void;
  drainHealth: (amount: number) => void;
  clearFact: () => void;
  clearEffect: () => void;
  tick: (time: number) => void;
  goToLearn: () => void;
  goToStart: () => void;
}

const INITIAL_FOOD_COUNTS: FoodGroupCounts = {
  fruits: 0, vegetables: 0, proteins: 0, grains: 0, dairy: 0, hydration: 0,
};

const COMBO_NAMES: Record<FoodGroup, string> = {
  fruits: 'Fruit Frenzy!',
  vegetables: 'Veggie Champion!',
  proteins: 'Protein Power!',
  grains: 'Grain Guardian!',
  dairy: 'Dairy Delight!',
  hydration: 'Hydration Hero!',
};

export const useGameStore = create<GameState>((set, get) => ({
  status: 'start',
  heroPoints: 0,
  healthMeter: 100,
  distance: 0,
  speed: 30,
  playerLane: 0,
  playerY: 0.5,
  playerHeight: 1,
  foodGroupCounts: { ...INITIAL_FOOD_COUNTS },
  junkContacts: 0,
  recentJunkHits: 0,
  comboGroup: null,
  comboCount: 0,
  comboMultiplierActive: false,
  comboMultiplierEnd: 0,
  comboMessage: '',
  activeFact: null,
  factExpiry: 0,
  cleanRunDistance: 0,
  longestCleanRun: 0,
  activeEffect: 'none',
  effectExpiry: 0,

  setPlayerState: (lane, y, height) => set({ playerLane: lane, playerY: y, playerHeight: height }),

  startGame: () => set({
    status: 'playing',
    heroPoints: 0,
    healthMeter: 100,
    distance: 0,
    speed: 30,
    playerLane: 0,
    foodGroupCounts: { ...INITIAL_FOOD_COUNTS },
    junkContacts: 0,
    recentJunkHits: 0,
    comboGroup: null,
    comboCount: 0,
    comboMultiplierActive: false,
    comboMultiplierEnd: 0,
    comboMessage: '',
    activeFact: null,
    factExpiry: 0,
    cleanRunDistance: 0,
    longestCleanRun: 0,
    activeEffect: 'none',
    effectExpiry: 0,
  }),

  endGame: () => set((state) => ({
    status: 'gameover',
    longestCleanRun: Math.max(state.longestCleanRun, state.cleanRunDistance),
  })),

  addHeroPoints: (points) => set((state) => {
    const mult = state.comboMultiplierActive ? 2 : 1;
    return { heroPoints: state.heroPoints + points * mult };
  }),

  collectHealthyItem: (foodGroup, points, fact) => set((state) => {
    const mult = state.comboMultiplierActive ? 2 : 1;
    const newCounts = { ...state.foodGroupCounts };
    newCounts[foodGroup] += 1;

    let comboGroup = state.comboGroup;
    let comboCount = state.comboCount;
    let comboMultiplierActive = state.comboMultiplierActive;
    let comboMultiplierEnd = state.comboMultiplierEnd;
    let comboMessage = state.comboMessage;

    if (foodGroup === state.comboGroup) {
      comboCount += 1;
    } else {
      comboGroup = foodGroup;
      comboCount = 1;
    }

    if (comboCount >= 5 && !comboMultiplierActive) {
      comboMultiplierActive = true;
      comboMultiplierEnd = Date.now() + 10000;
      comboMessage = COMBO_NAMES[foodGroup];
      comboCount = 0;
    }

    let healthBoost = 0;
    if (foodGroup === 'hydration') healthBoost = 10;
    else if (foodGroup === 'vegetables') healthBoost = 6;
    else if (foodGroup === 'proteins') healthBoost = 5;
    else healthBoost = 4;

    return {
      heroPoints: state.heroPoints + points * mult,
      healthMeter: Math.min(100, state.healthMeter + healthBoost),
      foodGroupCounts: newCounts,
      comboGroup, comboCount, comboMultiplierActive, comboMultiplierEnd, comboMessage,
      activeFact: fact,
      factExpiry: Date.now() + 2500,
    };
  }),

  hitJunkFood: (penalty, effect, duration, fact) => set((state) => {
    const newJunkContacts = state.junkContacts + 1;
    const newRecentJunk = state.recentJunkHits + 1;
    const healthLoss = Math.abs(penalty) * 1.5;
    const newHealth = Math.max(0, state.healthMeter - healthLoss);

    let actualEffect = effect;
    let actualDuration = duration;
    if (newRecentJunk >= 3) {
      actualEffect = 'slow';
      actualDuration = 5000;
    }

    const result: Partial<GameState> = {
      heroPoints: Math.max(0, state.heroPoints - Math.abs(penalty)),
      healthMeter: newHealth,
      junkContacts: newJunkContacts,
      recentJunkHits: newRecentJunk,
      activeEffect: actualEffect,
      effectExpiry: Date.now() + actualDuration,
      activeFact: fact,
      factExpiry: Date.now() + 2000,
      cleanRunDistance: 0,
      comboGroup: null,
      comboCount: 0,
    };

    if (newHealth <= 0) {
      result.status = 'gameover';
      result.longestCleanRun = Math.max(state.longestCleanRun, state.cleanRunDistance);
    }

    return result;
  }),

  addDistance: (d) => set((state) => ({
    distance: state.distance + d,
    cleanRunDistance: state.cleanRunDistance + d,
  })),

  drainHealth: (amount) => set((state) => {
    const newHealth = Math.max(0, state.healthMeter - amount);
    if (newHealth <= 0) {
      return { healthMeter: 0, status: 'gameover', longestCleanRun: Math.max(state.longestCleanRun, state.cleanRunDistance) };
    }
    return { healthMeter: newHealth };
  }),

  clearFact: () => set({ activeFact: null }),
  clearEffect: () => set({ activeEffect: 'none', effectExpiry: 0 }),
  goToLearn: () => set({ status: 'learn' }),
  goToStart: () => set({ status: 'start' }),

  tick: (time) => {
    const state = get();
    if (state.comboMultiplierActive && time > state.comboMultiplierEnd) {
      set({ comboMultiplierActive: false, comboMessage: '' });
    }
    if (state.activeFact && time > state.factExpiry) {
      set({ activeFact: null });
    }
    if (state.activeEffect !== 'none' && time > state.effectExpiry) {
      set({ activeEffect: 'none', effectExpiry: 0 });
    }
    if (state.recentJunkHits > 0 && time % 5000 < 50) {
      set({ recentJunkHits: Math.max(0, state.recentJunkHits - 1) });
    }
  },
}));
