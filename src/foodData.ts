import { FoodGroup, NutriFact } from './store';

// ── Healthy food items ──
export interface HealthyItemDef {
  id: string;
  name: string;
  foodGroup: FoodGroup;
  points: number;
  color: string;       // primary color for the 3D shape
  glowColor: string;   // particle/glow color
  shape: 'sphere' | 'cylinder' | 'box';
  fact: string;
}

export const HEALTHY_ITEMS: HealthyItemDef[] = [
  // Hydration
  { id: 'HC-001', name: 'Water Bottle', foodGroup: 'hydration', points: 15, color: '#81D4FA', glowColor: '#29B6F6', shape: 'cylinder', fact: 'Water helps your brain work better. Your brain is about 75% water!' },
  { id: 'HC-002', name: 'Coconut Water', foodGroup: 'hydration', points: 15, color: '#A5D6A7', glowColor: '#66BB6A', shape: 'cylinder', fact: 'Coconut water is full of minerals that keep your body refreshed!' },
  { id: 'HC-003', name: 'Herbal Tea', foodGroup: 'hydration', points: 14, color: '#C8E6C9', glowColor: '#81C784', shape: 'cylinder', fact: 'Herbal tea can help you relax and feel calm!' },

  // Fruits
  { id: 'HC-004', name: 'Red Apple', foodGroup: 'fruits', points: 10, color: '#EF5350', glowColor: '#E53935', shape: 'sphere', fact: 'An apple a day keeps the doctor away! Apples are full of fibre!' },
  { id: 'HC-005', name: 'Banana', foodGroup: 'fruits', points: 10, color: '#FFD54F', glowColor: '#FFC107', shape: 'cylinder', fact: 'Bananas give you quick energy with natural sugars and potassium!' },
  { id: 'HC-006', name: 'Orange', foodGroup: 'fruits', points: 10, color: '#FF9800', glowColor: '#FB8C00', shape: 'sphere', fact: 'Oranges are packed with Vitamin C to keep you from getting sick!' },
  { id: 'HC-007', name: 'Strawberry', foodGroup: 'fruits', points: 11, color: '#E91E63', glowColor: '#D81B60', shape: 'sphere', fact: 'Strawberries have more Vitamin C than oranges and taste amazing!' },
  { id: 'HC-008', name: 'Watermelon', foodGroup: 'fruits', points: 10, color: '#66BB6A', glowColor: '#EF5350', shape: 'sphere', fact: 'Watermelon is 92% water - it helps keep you hydrated!' },
  { id: 'HC-009', name: 'Grapes', foodGroup: 'fruits', points: 10, color: '#9C27B0', glowColor: '#AB47BC', shape: 'sphere', fact: 'Grapes are full of antioxidants that protect your body!' },
  { id: 'HC-010', name: 'Mango', foodGroup: 'fruits', points: 11, color: '#FF9800', glowColor: '#FFB74D', shape: 'sphere', fact: 'Mangoes are called the king of fruits and are rich in Vitamin A!' },

  // Vegetables
  { id: 'HC-011', name: 'Carrot', foodGroup: 'vegetables', points: 12, color: '#FF7043', glowColor: '#FF5722', shape: 'cylinder', fact: 'Carrots are packed with beta-carotene, which helps your eyes stay sharp!' },
  { id: 'HC-012', name: 'Broccoli', foodGroup: 'vegetables', points: 12, color: '#4CAF50', glowColor: '#388E3C', shape: 'sphere', fact: 'Broccoli has more Vitamin C than an orange, plus it helps build strong bones!' },
  { id: 'HC-013', name: 'Spinach', foodGroup: 'vegetables', points: 13, color: '#2E7D32', glowColor: '#1B5E20', shape: 'sphere', fact: 'Spinach is loaded with iron that makes your blood strong and healthy!' },
  { id: 'HC-014', name: 'Bell Pepper', foodGroup: 'vegetables', points: 12, color: '#F44336', glowColor: '#FFD54F', shape: 'sphere', fact: 'Bell peppers come in many colours and are full of vitamins!' },
  { id: 'HC-015', name: 'Tomato', foodGroup: 'vegetables', points: 11, color: '#E53935', glowColor: '#C62828', shape: 'sphere', fact: 'Tomatoes have lycopene which is great for your heart!' },
  { id: 'HC-016', name: 'Peas', foodGroup: 'vegetables', points: 12, color: '#66BB6A', glowColor: '#43A047', shape: 'sphere', fact: 'Peas are tiny but mighty - packed with protein and fibre!' },
  { id: 'HC-017', name: 'Sweet Potato', foodGroup: 'vegetables', points: 12, color: '#E65100', glowColor: '#BF360C', shape: 'box', fact: 'Sweet potatoes give you energy and are loaded with Vitamin A!' },
  { id: 'HC-018', name: 'Cucumber', foodGroup: 'vegetables', points: 11, color: '#4CAF50', glowColor: '#81C784', shape: 'cylinder', fact: 'Cucumbers are 95% water and keep you cool and hydrated!' },

  // Proteins
  { id: 'HC-019', name: 'Grilled Chicken', foodGroup: 'proteins', points: 14, color: '#BCAAA4', glowColor: '#8D6E63', shape: 'box', fact: 'Grilled chicken is a lean protein that helps your muscles grow!' },
  { id: 'HC-020', name: 'Boiled Egg', foodGroup: 'proteins', points: 13, color: '#FFF9C4', glowColor: '#FFD54F', shape: 'sphere', fact: 'Eggs are one of the best sources of protein - they help your muscles grow!' },
  { id: 'HC-021', name: 'Fish Fillet', foodGroup: 'proteins', points: 14, color: '#90CAF9', glowColor: '#42A5F5', shape: 'box', fact: 'Fish has omega-3 fatty acids that make your brain super smart!' },
  { id: 'HC-022', name: 'Bean Bowl', foodGroup: 'proteins', points: 13, color: '#8D6E63', glowColor: '#6D4C41', shape: 'box', fact: 'Beans are full of protein and fibre - great for energy!' },
  { id: 'HC-023', name: 'Almonds', foodGroup: 'proteins', points: 14, color: '#D7CCC8', glowColor: '#A1887F', shape: 'sphere', fact: 'Almonds are a great snack full of healthy fats and protein!' },
  { id: 'HC-024', name: 'Lentil Soup', foodGroup: 'proteins', points: 13, color: '#FFB74D', glowColor: '#FF9800', shape: 'cylinder', fact: 'Lentils are tiny powerhouses packed with protein and iron!' },

  // Grains
  { id: 'HC-025', name: 'Brown Bread', foodGroup: 'grains', points: 11, color: '#8D6E63', glowColor: '#6D4C41', shape: 'box', fact: 'Whole grain bread gives you lasting energy to run and play!' },
  { id: 'HC-026', name: 'Oatmeal', foodGroup: 'grains', points: 11, color: '#D7CCC8', glowColor: '#BCAAA4', shape: 'cylinder', fact: 'Oatmeal keeps you feeling full longer because it has lots of fibre!' },
  { id: 'HC-027', name: 'Brown Rice', foodGroup: 'grains', points: 11, color: '#A1887F', glowColor: '#8D6E63', shape: 'sphere', fact: 'Brown rice has more nutrients than white rice - it keeps your energy up!' },
  { id: 'HC-028', name: 'Wheat Pasta', foodGroup: 'grains', points: 11, color: '#FFE082', glowColor: '#FFD54F', shape: 'cylinder', fact: 'Whole wheat pasta gives you energy for running and playing all day!' },

  // Dairy
  { id: 'HC-029', name: 'Milk Carton', foodGroup: 'dairy', points: 10, color: '#FFFFFF', glowColor: '#E0E0E0', shape: 'box', fact: 'Milk has calcium that makes your bones and teeth super strong!' },
  { id: 'HC-030', name: 'Yoghurt Cup', foodGroup: 'dairy', points: 10, color: '#F8BBD0', glowColor: '#F48FB1', shape: 'cylinder', fact: 'Yoghurt has friendly bacteria called probiotics that keep your tummy happy!' },
];

// ── Junk food items ──
export interface JunkItemDef {
  id: string;
  name: string;
  category: string;
  penalty: number;
  effect: 'blur' | 'slow' | 'tilt' | 'invert';
  effectDuration: number; // ms
  color: string;
  shape: 'box' | 'cylinder' | 'sphere';
  fact: string;
}

export const JUNK_ITEMS: JunkItemDef[] = [
  // Sugary Drinks
  { id: 'JF-001', name: 'Cola Can', category: 'Sugary Drinks', penalty: 10, effect: 'blur', effectDuration: 4000, color: '#B71C1C', shape: 'cylinder', fact: 'Soda has up to 10 teaspoons of sugar - that is more than your whole day!' },
  { id: 'JF-002', name: 'Energy Drink', category: 'Sugary Drinks', penalty: 12, effect: 'blur', effectDuration: 4000, color: '#1B5E20', shape: 'cylinder', fact: 'Energy drinks have too much caffeine and sugar - water is better!' },
  { id: 'JF-003', name: 'Milkshake', category: 'Sugary Drinks', penalty: 10, effect: 'blur', effectDuration: 4000, color: '#F48FB1', shape: 'cylinder', fact: 'Milkshakes can have as much sugar as 5 chocolate bars!' },

  // Candy & Sweets
  { id: 'JF-004', name: 'Lollipop', category: 'Candy & Sweets', penalty: 8, effect: 'tilt', effectDuration: 5000, color: '#E91E63', shape: 'sphere', fact: 'Lollipops are pure sugar and can cause cavities in your teeth!' },
  { id: 'JF-005', name: 'Gummy Bears', category: 'Candy & Sweets', penalty: 8, effect: 'tilt', effectDuration: 5000, color: '#FF5722', shape: 'sphere', fact: 'Gummy bears are mostly sugar with artificial colours - not real fruit!' },
  { id: 'JF-006', name: 'Chocolate Bar', category: 'Candy & Sweets', penalty: 9, effect: 'tilt', effectDuration: 5000, color: '#4E342E', shape: 'box', fact: 'Chocolate bars have lots of added sugar - a banana is sweeter and healthier!' },
  { id: 'JF-007', name: 'Cotton Candy', category: 'Candy & Sweets', penalty: 8, effect: 'tilt', effectDuration: 5000, color: '#CE93D8', shape: 'sphere', fact: 'Cotton candy is 100% sugar with zero nutrition!' },

  // Fried Foods
  { id: 'JF-008', name: 'French Fries', category: 'Fried Foods', penalty: 12, effect: 'slow', effectDuration: 6000, color: '#FFB300', shape: 'box', fact: 'French fries are deep fried in oil - baked potato wedges are healthier!' },
  { id: 'JF-009', name: 'Fried Chicken', category: 'Fried Foods', penalty: 12, effect: 'slow', effectDuration: 6000, color: '#D84315', shape: 'box', fact: 'Fried chicken absorbs lots of oil - grilled chicken is much healthier!' },
  { id: 'JF-010', name: 'Doughnut', category: 'Fried Foods', penalty: 11, effect: 'slow', effectDuration: 6000, color: '#F48FB1', shape: 'cylinder', fact: 'Doughnuts are fried and covered in sugar - a double unhealthy combo!' },

  // Processed Snacks
  { id: 'JF-011', name: 'Potato Chips', category: 'Processed Snacks', penalty: 9, effect: 'tilt', effectDuration: 4000, color: '#FDD835', shape: 'box', fact: 'Chips have lots of salt which can make your heart work too hard!' },
  { id: 'JF-012', name: 'Cheese Puffs', category: 'Processed Snacks', penalty: 9, effect: 'tilt', effectDuration: 4000, color: '#FF8F00', shape: 'sphere', fact: 'Cheese puffs are mostly air, starch, and artificial flavour - not real cheese!' },
  { id: 'JF-013', name: 'Instant Noodles', category: 'Processed Snacks', penalty: 9, effect: 'tilt', effectDuration: 4000, color: '#FFE082', shape: 'box', fact: 'Instant noodles are very high in salt - real pasta is much healthier!' },

  // Excessive Sugar
  { id: 'JF-014', name: 'Cake Slice', category: 'Excessive Sugar', penalty: 15, effect: 'invert', effectDuration: 3000, color: '#EC407A', shape: 'box', fact: 'A slice of cake can have 30 grams of sugar! That is a LOT!' },
  { id: 'JF-015', name: 'Ice Cream Sundae', category: 'Excessive Sugar', penalty: 15, effect: 'invert', effectDuration: 3000, color: '#F8BBD0', shape: 'sphere', fact: 'Too much sugar can make you feel tired and grumpy after a short energy burst!' },
];

// Food group color map per SRS
export const FOOD_GROUP_COLORS: Record<FoodGroup, string> = {
  fruits: '#EF5350',
  vegetables: '#4CAF50',
  proteins: '#FF9800',
  grains: '#8D6E63',
  dairy: '#FFFFFF',
  hydration: '#81D4FA',
};

export const FOOD_GROUP_LABELS: Record<FoodGroup, string> = {
  fruits: 'Fruits',
  vegetables: 'Vegetables',
  proteins: 'Proteins',
  grains: 'Grains',
  dairy: 'Dairy',
  hydration: 'Water',
};

export function getRandomHealthyItem(): HealthyItemDef {
  return HEALTHY_ITEMS[Math.floor(Math.random() * HEALTHY_ITEMS.length)];
}

export function getRandomJunkItem(): JunkItemDef {
  return JUNK_ITEMS[Math.floor(Math.random() * JUNK_ITEMS.length)];
}

/* ── Emoji for every food item (used as floating labels in-game) ── */
export const FOOD_EMOJI: Record<string, string> = {
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
