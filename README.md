# Health Hero: The Healthy Runner

An endless runner game that teaches children (ages 5+) about healthy eating through fun, interactive gameplay. Built with React, Three.js, and TypeScript.

## About

Health Hero transforms screen time into an opportunity for nutritional education. Players sprint through vibrant, health-themed 3D environments collecting nutritious food items (fruits, vegetables, grains, proteins, dairy, water) while dodging junk food obstacles like soda, candy, and fried foods.

- **Collect healthy items** to earn HeroPoints and fill your Health Meter
- **Dodge junk food** that causes visual effects (blur, tilt, invert) and point penalties
- **Build combos** by collecting items from the same food group for score multipliers
- **Learn nutrition facts** via NutriFact pop-ups that appear during gameplay
- **Track progress** across 6 food group categories

## Tech Stack

- **Frontend:** React 19, TypeScript
- **3D Engine:** Three.js via React Three Fiber + Drei
- **State Management:** Zustand
- **Styling:** Tailwind CSS
- **Build Tool:** Vite
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

```bash
git clone https://github.com/Princess-B-Kwaniya/Health-Hero.git
cd Health-Hero
npm install
```

### Running Locally

```bash
npm run dev
```

The game will be available at `http://localhost:3000`.

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── App.tsx           # Main UI, HUD, menus, and game overlays
├── Game.tsx          # 3D scene setup (camera, lighting, sky)
├── GameManager.tsx   # Core game loop and state updates
├── Player.tsx        # Player character controller
├── Obstacles.tsx     # Junk food obstacle spawning and collision
├── Coins.tsx         # Healthy food item spawning and collection
├── Ground.tsx        # Scrolling ground plane
├── CityBackground.tsx# Parallax city background
├── foodData.ts       # Food item definitions and nutrition facts
├── store.ts          # Zustand game state store
├── main.tsx          # App entry point
└── index.css         # Global styles
```

## Game Mechanics

| Mechanic | Description |
|----------|-------------|
| **HeroPoints** | Primary score earned by collecting healthy food items |
| **Health Meter** | Visual bar showing player vitality — healthy items restore it, junk food drains it |
| **Food Group Combos** | Collect multiple items from the same food group for bonus multipliers |
| **Junk Food Effects** | Blur, tilt, screen inversion, or slowdown when hitting obstacles |
| **NutriFact Pop-ups** | Brief educational overlays with real nutrition information |
| **Progressive Difficulty** | Game speed increases over distance |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Type-check with TypeScript |
| `npm run clean` | Remove dist folder |

## Documentation

See [Health_Hero_SRS.md](Health_Hero_SRS.md) for the full Software Requirements Specification.

## License

This project is developed for academic coursework.
