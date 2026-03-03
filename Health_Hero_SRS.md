# Health Hero: The Healthy Runner

## Software Requirements Specification

**Version 1.0**
**Date: March 2026**
**Classification: Confidential**
**Prepared for: Academic Coursework & Stakeholder Review**

---

## Revision History

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | March 2026 | Development Team | Initial SRS document creation with full functional and non-functional requirements, UI/UX design specifications, and game mechanics documentation. |

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [Specific Requirements](#3-specific-requirements)
4. [User Interface and Visual Design Specification](#4-user-interface-and-visual-design-specification)
5. [Game Economy and Progression System](#5-game-economy-and-progression-system)
6. [Educational Framework and Learning Outcomes](#6-educational-framework-and-learning-outcomes)
7. [Technical Architecture Overview](#7-technical-architecture-overview)
8. [Testing and Quality Assurance Strategy](#8-testing-and-quality-assurance-strategy)
9. [Project Timeline and Milestones](#9-project-timeline-and-milestones)
10. [Appendices](#10-appendices)

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) document provides a comprehensive description of **Health Hero: The Healthy Runner**, an endless runner mobile game designed to educate children aged 5 to 12 about healthy eating habits, nutrition, and active living. The document defines all functional and non-functional requirements, user interface design guidelines, game mechanics, and educational frameworks that will govern the development of this application.

Health Hero transforms the proven, addictive gameplay model of endless runner games into a powerful educational tool. Rather than collecting generic coins or tokens, players collect healthy food items such as water bottles, carrots, apples, broccoli, and whole grains to earn points and power-ups. Simultaneously, players must dodge unhealthy items like sugary sodas, candy bars, deep-fried foods, and processed snacks that deduct points, blur vision, slow movement, or cause disorienting screen effects that disrupt progress.

### 1.2 Project Vision

> *"In a world where children spend an average of 3 to 4 hours daily on screens and mobile games, Health Hero reimagines that screen time as an opportunity for nutritional education. Every coin collected is a lesson learned. Every obstacle dodged is a healthy choice reinforced. Health Hero does not fight screen time — it transforms it into a force for lifelong wellness."*

### 1.3 Scope

Health Hero is a free-to-play, cross-platform mobile game targeting iOS and Android devices. The game is an endless runner where a child-friendly character sprints through vibrant, health-themed environments while collecting nutritious food items and avoiding junk food obstacles. The core educational objective is to build subconscious associations between healthy food choices and positive rewards, reinforcing nutritional literacy through repetitive, enjoyable gameplay.

The scope encompasses the following major components:

- **Core endless runner gameplay engine** with progressive difficulty scaling
- **Health-themed collectible system** with 50+ unique food items across nutritional categories
- **Negative consequence system** for unhealthy food interactions including visual distortion, speed reduction, and point penalties
- **Educational overlay system** with pop-up nutrition facts, food group identification, and daily health tips
- **Character customisation and progression system** rewarding healthy knowledge
- **Parent dashboard** for monitoring gameplay statistics and learning outcomes
- **Offline-capable gameplay** with optional cloud synchronisation for progress
- **Accessibility features** including colourblind modes, adjustable text sizes, and simplified control schemes

### 1.4 Definitions, Acronyms, and Abbreviations

| Term | Definition |
|------|-----------|
| Health Hero | The working title of the endless runner health education game described in this document. |
| Endless Runner | A game genre where the player character runs continuously through a procedurally generated environment, with no definitive endpoint. |
| Healthy Collectible | Any in-game item representing a nutritious food or beverage (water, fruits, vegetables, whole grains) that grants positive effects when collected. |
| Junk Obstacle | Any in-game item representing an unhealthy food or beverage (soda, candy, chips, fried food) that causes negative effects on contact. |
| HeroPoints (HP) | The primary scoring currency earned by collecting healthy items. |
| Health Meter | A visual bar representing the player character's in-game vitality, affected by food choices during gameplay. |
| NutriFact Pop-up | A brief educational overlay that appears when collecting or hitting certain items, displaying nutritional information. |
| Power Dash | A temporary speed boost and invincibility state triggered by collecting specific combinations of healthy items. |
| SRS | Software Requirements Specification. |
| UI/UX | User Interface / User Experience. |
| FPS | Frames Per Second. |

### 1.5 Target Audience

The primary users of Health Hero are children between the ages of 5 and 12. The secondary audience includes parents, guardians, teachers, and health educators who may use the game as a supplementary teaching tool. The game is designed with age-appropriate content, bright and inviting visuals, simple swipe-based controls, and a non-violent, entirely positive reinforcement approach to learning.

### 1.6 References

- IEEE 830-1998: Recommended Practice for Software Requirements Specifications
- WHO Guidelines on Physical Activity, Sedentary Behaviour and Sleep for Children Under 5 Years of Age
- USDA MyPlate Nutritional Guidelines for Children
- COPPA (Children's Online Privacy Protection Act) Compliance Framework
- Google Play Families Policy and Apple App Store Kids Category Guidelines

---

## 2. Overall Description

### 2.1 Product Perspective

Health Hero exists at the intersection of mobile gaming and health education. While countless endless runner games dominate mobile app stores, none effectively leverage the genre's addictive loop mechanics to teach children about nutrition. Health Hero fills this gap by replacing abstract collectibles with real-world healthy food items and introducing tangible negative consequences for "collecting" unhealthy options.

The game operates as a standalone mobile application with no dependency on external systems for core gameplay. Optional features such as cloud save synchronisation, leaderboard participation, and parental dashboard access require internet connectivity. The application integrates with device-level accessibility settings and respects platform-specific parental controls.

### 2.2 Product Features Summary

| Feature Category | Description |
|-----------------|-------------|
| **Endless Runner Core** | Continuous, procedurally generated running environment with three-lane swipe mechanics, jumping, rolling, and lane-switching controls. |
| **Healthy Collectible System** | 50+ nutritious food items organised into food groups (fruits, vegetables, proteins, grains, dairy, water) each with unique point values, visual effects, and educational content. |
| **Junk Food Obstacle System** | 30+ unhealthy food items that impose penalties: point deduction, screen blur/distortion, character slowdown, inverted controls, and health meter drain. |
| **Progressive Difficulty** | Game speed, obstacle density, and complexity increase over time, introducing new food items and harder dodge patterns as the player advances. |
| **NutriFact Education Engine** | Context-sensitive nutritional facts displayed as brief, animated pop-ups during gameplay and detailed cards in the post-run summary. |
| **Character Progression** | Unlockable characters, outfits, and accessories earned through gameplay milestones and nutritional knowledge quizzes. |
| **Parent Dashboard** | Secure, PIN-protected section showing gameplay statistics, nutritional topics covered, time played, and learning progress reports. |
| **Daily Health Challenges** | Rotating daily objectives such as "Collect 10 vegetables in one run" or "Avoid all sugary drinks for 3 runs" that reward bonus HeroPoints. |
| **Offline Mode** | Full gameplay available without internet; progress syncs when connectivity is restored. |

### 2.3 User Classes and Characteristics

#### 2.3.1 Primary User: Children (Ages 5–12)

Children are the core players. They interact with the game through simple touch gestures: swiping left, right, up, and down. The interface uses large, colourful icons with minimal text. Younger children (5–7) benefit from the simplified "Kiddie Mode" with slower speeds and larger collectibles, while older children (8–12) engage with the standard difficulty and more complex nutritional content.

#### 2.3.2 Secondary User: Parents and Guardians

Parents access the protected dashboard to review their child's gameplay data, set daily time limits, approve or restrict certain features, and view educational progress reports. The parent interface uses a clean, minimal design with data visualisations showing food groups collected, nutritional facts learned, and playtime trends over weeks and months.

#### 2.3.3 Tertiary User: Teachers and Health Educators

Educators can use Health Hero as a classroom tool. A dedicated "Classroom Mode" allows teachers to set specific nutritional learning objectives, track multiple students' progress, and generate reports aligning gameplay outcomes with health education curriculum standards.

### 2.4 Operating Environment

- iOS 14.0 or later (iPhone, iPad, iPod Touch)
- Android 8.0 (API Level 26) or later
- Minimum 2 GB RAM, 500 MB available storage
- Touchscreen input required; no external controller support initially
- Optional internet for cloud sync, leaderboards, and parental dashboard remote access

### 2.5 Design and Implementation Constraints

- Full COPPA compliance: No collection of personal data from children under 13 without verifiable parental consent
- No real-money microtransactions or loot boxes; all content unlockable through gameplay
- No advertisements displayed to child users; optional non-intrusive ads in parent dashboard only
- All nutritional information vetted by a certified nutritionist or paediatric dietician
- Game must maintain 60 FPS on devices released within the last 4 years
- Maximum application size of 150 MB for initial download, with optional asset packs for additional environments
- All text content must support localisation for a minimum of 10 languages at launch

### 2.6 Assumptions and Dependencies

- Children will use the game on devices owned or supervised by a parent or guardian
- The target devices have functioning touchscreens and accelerometers
- Nutritional guidelines referenced are based on internationally recognised standards (WHO, USDA) and may require regional adaptation
- The Unity game engine (or equivalent cross-platform framework) will be used for development
- Sound effects and music will be original compositions or properly licenced assets

---

## 3. Specific Requirements

### 3.1 Functional Requirements

#### 3.1.1 Core Gameplay Mechanics

**FR-001:** The system shall generate a continuous, infinite running path consisting of three parallel lanes on a scrolling environment.

**FR-002:** The player character shall automatically run forward at a base speed that increases by 5% every 30 seconds of gameplay, capped at 2.5 times the initial speed.

**FR-003:** The system shall support the following player control inputs:

- **Swipe Left:** Move one lane to the left
- **Swipe Right:** Move one lane to the right
- **Swipe Up:** Jump over ground-level obstacles
- **Swipe Down:** Slide or duck under overhead obstacles
- **Tap (optional):** Activate stored power-up

**FR-004:** The system shall procedurally generate obstacles and collectibles using a weighted randomisation algorithm that adjusts based on current difficulty level and educational objectives.

**FR-005:** A gameplay session shall end when the player's Health Meter reaches zero or when the character collides with a solid environmental obstacle (e.g., a wall, barrier, or gap).

#### 3.1.2 Healthy Collectible System

**FR-010:** The system shall include a minimum of 50 unique healthy food collectible items distributed across the following nutritional categories:

| Food Group | Example Items | Base HeroPoints | Special Effect |
|-----------|--------------|----------------|----------------|
| **Water & Hydration** | Water bottle, coconut water, herbal tea | +15 HP | Restores 10% Health Meter; brief blue shimmer trail |
| **Fruits** | Apple, banana, orange, strawberry, watermelon, grapes | +10 HP | Temporary rainbow trail; +5% speed boost for 3 seconds |
| **Vegetables** | Carrot, broccoli, spinach, bell pepper, tomato, peas | +12 HP | Green shield bubble for 2 seconds; blocks one junk hit |
| **Proteins** | Grilled chicken, boiled egg, fish fillet, beans, nuts | +14 HP | Strength glow; character grows slightly larger for 3 seconds |
| **Whole Grains** | Brown bread, oatmeal, brown rice, whole wheat pasta | +11 HP | Stamina boost; Health Meter decay paused for 5 seconds |
| **Dairy** | Milk carton, yoghurt cup, cheese slice | +10 HP | Bone-strength sparkle; jump height increased for 4 seconds |

**FR-011:** Each healthy collectible shall display a brief animated collection effect (sparkle, glow, or particle burst) in the corresponding food group colour when collected.

**FR-012:** Upon collecting any healthy item, the system shall increment the HeroPoints counter and update the Health Meter according to the item's properties.

**FR-013:** Collecting 5 items from the same food group within a single run shall trigger a "Food Group Combo" bonus, awarding 2x HeroPoints for the next 10 seconds and displaying an encouraging message such as "Vegetable Champion!" or "Hydration Hero!".

#### 3.1.3 Junk Food Obstacle System

**FR-020:** The system shall include a minimum of 30 unique unhealthy food obstacle items that impose negative effects upon contact:

| Junk Category | Example Items | Point Penalty | Gameplay Disruption Effect |
|--------------|--------------|--------------|---------------------------|
| **Sugary Drinks** | Cola, energy drink, milkshake, fruit punch with added sugar | -10 HP | Screen edges blur progressively for 4 seconds, simulating a "sugar rush" dizziness |
| **Candy & Sweets** | Lollipop, gummy bears, chocolate bar, cotton candy | -8 HP | Controls become "sticky" — 0.3-second delay on swipe response for 5 seconds |
| **Fried Foods** | French fries, fried chicken, doughnut, onion rings | -12 HP | Character slows down by 20% for 6 seconds; greasy screen overlay effect |
| **Processed Snacks** | Potato chips, cheese puffs, instant noodles, hot dogs | -9 HP | Screen tilts slightly left/right in oscillation for 4 seconds, simulating disorientation |
| **Excessive Sugar** | Cake slice, ice cream sundae, syrup bottle | -15 HP | Full-screen colour saturation spike then desaturation; inverted left/right controls for 3 seconds |

**FR-021:** Each junk food obstacle shall display a distinct negative visual effect upon contact: a red flash around the item, a downward-pointing arrow animation, and a low-tone sound effect.

**FR-022:** If the player contacts 3 junk food items within 10 seconds, the system shall trigger a "Sugar Crash" event: the screen briefly goes grey-scale, the character stumbles, and all movement speed is reduced by 40% for 5 seconds. A motivational recovery message such as "Shake it off! Grab some water!" shall appear.

**FR-023:** The Health Meter shall decrease by 5% to 15% per junk food contact depending on the severity category, as defined in the table above.

#### 3.1.4 Educational Overlay System

**FR-030:** Upon collecting a healthy item, the system shall display a "NutriFact Pop-up" — a small, animated card appearing at the top of the screen for 2.5 seconds showing one nutritional fact about the item (e.g., "Carrots are packed with Vitamin A, which helps your eyes stay sharp!").

**FR-031:** Upon contacting a junk food item, the system shall display a "Watch Out!" pop-up for 2 seconds explaining why the item is unhealthy (e.g., "Soda has up to 10 teaspoons of sugar — that's more than your whole day's worth!").

**FR-032:** At the end of each gameplay session, the system shall display a "Run Summary" screen showing: total HeroPoints earned, food groups collected (with percentages), junk food contacts, longest streak without junk food, and 3 new nutritional facts presented as collectible "NutriCards."

**FR-033:** The system shall maintain a "NutriDex" — a collectible encyclopedia of all food items encountered, with detailed nutritional information, fun facts, and a completion progress tracker. Completing sections of the NutriDex shall unlock character cosmetics.

#### 3.1.5 Character System

**FR-040:** The game shall launch with a default character and provide a minimum of 12 unlockable characters, each themed around health and nutrition (e.g., "Chef Carrot," "Captain Hydro," "Berry Blitz," "Grain Guardian").

**FR-041:** Each character shall have unique idle animations, running animations, and collection celebration animations, but no gameplay stat differences to ensure fairness.

**FR-042:** Characters shall be unlockable through HeroPoints accumulation, NutriDex completion milestones, and completing daily health challenge streaks.

#### 3.1.6 Daily Health Challenges

**FR-050:** The system shall present 3 rotating daily challenges refreshed every 24 hours at midnight local time. Example challenges include:

- **"Veggie Sprint":** Collect 20 vegetables in a single run
- **"Clean Run":** Complete a run of at least 500 metres without touching any junk food
- **"Rainbow Plate":** Collect at least one item from every food group in a single run
- **"Hydration Station":** Collect 10 water items across all runs today
- **"Protein Power":** Collect 15 protein items in total today

**FR-051:** Completing a daily challenge shall award bonus HeroPoints (50–200 HP based on difficulty) and contribute to a weekly streak tracker. Completing 7 consecutive days of challenges shall unlock an exclusive character outfit.

#### 3.1.7 Parent Dashboard

**FR-060:** The system shall include a PIN-protected (4–6 digit) Parent Dashboard accessible from the main menu.

**FR-061:** The Parent Dashboard shall display the following information:

- Total playtime (daily, weekly, monthly)
- HeroPoints earned over time (graphical trend)
- Food groups most frequently collected and avoided
- Junk food contact frequency and trends
- NutriDex completion percentage
- Daily challenge completion history
- Top 5 nutritional facts the child has encountered most frequently

**FR-062:** Parents shall be able to set daily playtime limits (in 15-minute increments) and configure a gentle "Time's Up!" notification that allows the child to finish their current run before the game pauses.

**FR-063:** The dashboard shall offer an option to export a weekly PDF learning report summarising the child's nutritional education progress.

---

### 3.2 Non-Functional Requirements

#### 3.2.1 Performance

**NFR-001:** The game shall maintain a minimum of 60 frames per second on all supported devices under normal gameplay conditions.

**NFR-002:** Initial application launch time shall not exceed 4 seconds on devices with 3 GB or more RAM.

**NFR-003:** Level loading and environment transitions shall complete within 1 second with no visible frame drops.

**NFR-004:** Touch input latency shall not exceed 50 milliseconds from swipe initiation to on-screen response.

#### 3.2.2 Reliability and Availability

**NFR-005:** The game shall be fully functional offline; all core gameplay, educational content, and character progression shall operate without internet connectivity.

**NFR-006:** The application shall gracefully handle unexpected interruptions (phone calls, notifications, low battery) by auto-pausing gameplay and preserving current session state.

**NFR-007:** Cloud synchronisation failures shall not corrupt local save data; the system shall implement conflict resolution using a "latest-timestamp-wins" strategy with user confirmation for discrepancies.

#### 3.2.3 Security and Privacy

**NFR-008:** The application shall be fully COPPA-compliant. No personal data shall be collected from child users. Any data collection from parent accounts shall require explicit, informed consent.

**NFR-009:** The Parent Dashboard PIN shall be stored using salted SHA-256 hashing on-device. No plaintext PINs shall exist in memory or storage.

**NFR-010:** All network communications shall use TLS 1.3 encryption. API endpoints shall enforce certificate pinning.

**NFR-011:** The application shall not include any third-party analytics SDKs that track individual child behaviour. Aggregated, anonymised usage statistics may be collected with parental opt-in consent.

#### 3.2.4 Usability and Accessibility

**NFR-012:** The game shall be playable with one hand using only swipe gestures. No multi-touch interactions shall be required during active gameplay.

**NFR-013:** The application shall include a colourblind accessibility mode that replaces colour-coded cues with shape and pattern differentiation (e.g., healthy items have star-shaped glows, junk items have spiky outlines).

**NFR-014:** All text displayed during gameplay shall use a minimum font size equivalent to 14sp on Android and 14pt on iOS, with an option to increase to 18sp/18pt in accessibility settings.

**NFR-015:** Sound effects shall be supplemented with haptic feedback on supported devices so that auditory-impaired players receive tactile cues for collections and collisions.

**NFR-016:** The game shall include a "Kiddie Mode" toggle (accessible from parental settings) that reduces game speed by 40%, increases collectible size by 30%, and simplifies the HUD for younger players aged 5–7.

#### 3.2.5 Scalability

**NFR-017:** The content management system shall allow the addition of new food items, environments, characters, and educational content without requiring a full application update (server-side content delivery for non-core assets).

**NFR-018:** The backend shall support up to 500,000 concurrent cloud-sync users at launch, scaling horizontally to 5 million within 12 months.

---

## 4. User Interface and Visual Design Specification

> *The visual identity of Health Hero is designed to evoke warmth, joy, and approachability. Every colour, shape, and animation is carefully chosen to create a world that feels like a sun-drenched garden adventure — a place where healthy choices are exciting and rewarding, not boring or restrictive. The design language prioritises rounded shapes, soft gradients, and a palette inspired by nature.*

### 4.1 Art Direction and Visual Identity

#### 4.1.1 Colour Palette

The core colour palette draws from the warm, inviting tones of a farmer's market at golden hour. The dominant hues are:

| Colour Role | Hex Code | Usage | Emotional Association |
|------------|----------|-------|----------------------|
| **Primary Green** | `#4CAF50` | Healthy items, positive UI elements, success states, background foliage | Growth, health, freshness, nature |
| **Warm Sunshine Yellow** | `#FFD54F` | Coin glows, HeroPoints counter, achievement badges, loading screens | Happiness, energy, optimism, warmth |
| **Soft Sky Blue** | `#81D4FA` | Water items, hydration indicators, sky backgrounds, calming UI panels | Trust, calm, refreshment, clarity |
| **Harvest Orange** | `#FF9800` | Protein items, streak counters, call-to-action buttons, excitement cues | Enthusiasm, vitality, appetite, warmth |
| **Berry Purple** | `#CE93D8` | Special power-ups, rare items, NutriDex highlights, magical effects | Wonder, creativity, imagination, specialness |
| **Earth Brown** | `#8D6E63` | Grain items, ground/path textures, wooden UI frames, menu backgrounds | Stability, nourishment, earthiness, comfort |
| **Alert Red** | `#EF5350` | Junk food warning flashes, health meter low state, negative effects only | Caution (used sparingly, never fear-inducing) |
| **Cream White** | `#FFF8E1` | UI panel backgrounds, text containers, breathing space, card backgrounds | Purity, softness, gentleness, space |

The colour palette intentionally avoids harsh neons, dark blacks, and cold greys. Even the "Alert Red" is a warm, muted tone rather than a stark, aggressive red. The goal is a world that feels like an illustrated children's storybook — rich, saturated, but always gentle.

#### 4.1.2 Typography

All in-game text uses a rounded, child-friendly sans-serif typeface such as "Nunito" or "Quicksand." Headlines use a playful, slightly bouncy weight, while body text uses a clean regular weight for readability. Numbers in the HeroPoints counter use a custom, slightly rounded monospace style for easy tracking of score changes. No serif, script, or decorative fonts are used during active gameplay to maintain clarity at speed.

#### 4.1.3 Character Design

Characters are designed in a "chibi"-inspired style: slightly oversized heads (approximately 1/3 of total body height), large expressive eyes, short limbs, and exaggerated expressions. This proportion creates an inherently endearing, non-threatening appearance that resonates with children across cultures. Characters have soft, rounded silhouettes with no sharp edges or angular features.

The default character, **"Sunny,"** is a gender-neutral child with warm brown skin, bright green eyes, a sunshine-yellow headband, and a wide, perpetual smile. Sunny wears a simple white t-shirt with a small carrot emblem and comfortable green shorts. Every unlockable character maintains the same approachable, rounded design language while introducing unique themes: Chef Carrot wears a tiny chef's hat and apron, Captain Hydro sports a blue cape made of flowing water, and Berry Blitz is adorned in a crown of mixed berries.

#### 4.1.4 Environment Design

The running environment uses a 2.5D perspective (3D models rendered on a fixed-angle path) with parallax scrolling backgrounds that create depth without complexity. Environments rotate through health-themed worlds:

- **Sunshine Farm:** Rolling green hills with wheat fields, wooden fences, scarecrows, and a golden-hour sky. Chickens and cows animate gently in the background. The path is a warm dirt trail lined with wildflowers.

- **Ocean Breeze Market:** A vibrant seaside fish market with colourful stalls, seagulls, crashing waves in the background, and a boardwalk path. Fish and seafood collectibles are more common here.

- **Rainbow Garden:** A lush vegetable garden with oversized carrots, tomato plants as tall as the character, sprinklers creating little rainbows, and butterflies fluttering. The path is soft mulch between garden beds.

- **Harvest Festival:** An autumn-themed county fair with hay bales, apple bobbing stations, corn mazes in the background, and warm amber lighting. Grain and fruit collectibles appear more frequently.

- **Cloud Kitchen:** A whimsical kitchen floating in the clouds, with giant mixing bowls, floating spoons, and ingredient waterfalls. This is the "boss environment" that appears every 5th stage and features the highest density of both healthy and junk food items.

Each environment transitions seamlessly through animated gateways (a farm gate, a market archway, a garden trellis) so the player never experiences a loading break. The transition itself is a gameplay moment: gates are lined with bonus collectibles.

### 4.2 Heads-Up Display (HUD) Design

The in-game HUD is designed to be minimal, informative, and completely non-obstructive. All elements are positioned at screen edges with generous padding from the active gameplay area:

- **Top-Left:** HeroPoints counter displayed as a rounded green badge with a small sparkle animation on each increment. The number uses the custom monospace font for crisp readability.

- **Top-Right:** Health Meter displayed as a horizontal bar with a gradient fill from green (full health) through yellow (medium) to warm red (low). The bar has a subtle pulse animation when below 30%. A small heart icon sits at the left end of the bar.

- **Top-Centre:** Current distance in metres, displayed subtly in cream-white text with a running shoe icon.

- **Bottom-Left:** Active power-up indicator showing the collected power-up icon with a circular countdown timer ring.

- **Bottom-Right:** Pause button displayed as a soft, rounded icon that doesn't compete with gameplay visuals.

The HUD elements use a frosted-glass (glassmorphism) background treatment with 15% opacity, allowing the game environment to show through while maintaining text readability. When the player is in the "zone" (20+ seconds without junk food contact), the HUD gently fades to near-transparency to maximise immersion, snapping back to full visibility on any HUD-relevant event.

### 4.3 Menu and Navigation Design

All menus use large, tactile buttons (minimum 48dp touch target) with satisfying press animations (a gentle "squish" scale-down on touch, a bounce-back on release). Navigation follows a flat hierarchy to minimise taps to reach any feature:

- **Home Screen:** Central play button (large, animated, pulsing gently), flanked by Character Select (left) and NutriDex (right). Settings gear icon in top-right, Parent Dashboard lock icon in top-left.

- **Post-Run Summary:** Automatically appears after each run. Shows score, distance, food groups collected as a colourful pie chart, and three NutriFact cards to swipe through. A large "Play Again" button and a "Home" button are prominently placed.

- **Character Select:** A horizontal scrollable carousel with 3D character previews that rotate slowly. Locked characters show as friendly silhouettes with unlock conditions clearly stated below.

- **NutriDex:** A bookshelf-style grid of food item cards. Discovered items display in full colour with a tap-to-expand detail view. Undiscovered items appear as question-mark silhouettes with hints about where to find them.

### 4.4 Animation and Feedback Design

Animation is central to the game's warm, engaging feel. Every interaction produces visual and auditory feedback:

- **Collecting healthy items:** A satisfying "pop" sound effect paired with a coloured particle burst matching the food group. The HeroPoints counter briefly scales up and glows. The character does a micro-celebration (fist pump, little hop, or thumbs-up) without breaking running stride.

- **Hitting junk food:** A soft "boing" or "splat" sound (never harsh or alarming). The screen edge gets a momentary warm-red vignette. The character winces briefly but recovers with a determined expression — reinforcing resilience, not punishment.

- **Power Dash activation:** The background blurs slightly, a golden trail appears behind the character, and an uplifting musical sting plays. The character's running animation becomes more dynamic and confident.

- **Sugar Crash event:** The screen momentarily desaturates with a gentle wobble effect. Playful cartoon stars circle the character's head. The recovery is accompanied by a "shaking it off" animation and an encouraging sound cue, framing it as a learning moment, not a punishment.

All negative effects are designed to be disruptive to progress but never frightening, startling, or discouraging. The emotional tone is always "oops, let's try again!" rather than "you failed." Sound effects use warm timbres (marimbas, ukuleles, soft chimes) and avoid any harsh electronic tones, alarms, or buzzer sounds.

### 4.5 Sound and Music Design

The soundtrack is a gentle, upbeat acoustic loop featuring ukulele, light percussion, marimba, and whistling. The tempo dynamically adjusts to match gameplay speed: a relaxed strum at low speeds, building to an energetic but still warm rhythm at higher speeds. Each environment has a unique musical variation built on the core melody, ensuring variety without jarring transitions.

Ambient sound effects include soft birdsong, gentle breezes, distant ocean waves (in the market environment), and kitchen clatter (in the Cloud Kitchen). These environmental sounds are mixed at 30% volume relative to gameplay sound effects, providing atmosphere without distraction.

---

## 5. Game Economy and Progression System

### 5.1 HeroPoints Economy

HeroPoints (HP) are the sole in-game currency. They are earned exclusively through gameplay and educational achievements, never through real-money purchases. This design ensures every point represents genuine engagement with health content.

| Earning Method | HP Amount | Notes |
|---------------|-----------|-------|
| Collecting healthy items | 8–15 HP per item | Varies by food group as specified in FR-010 |
| Food Group Combo bonus | 2x multiplier for 10 sec | Triggered by 5 same-group items in one run |
| Daily Challenge completion | 50–200 HP per challenge | Difficulty-scaled rewards |
| Weekly Streak (7-day) | 500 HP bonus | Plus exclusive outfit unlock |
| NutriDex completion milestone | 100 HP per 10% completed | Cumulative; 1000 HP total for full completion |
| Nutrition Quiz (post-run) | 25 HP per correct answer | Optional; 3 questions after each run |
| Clean Run bonus (0 junk) | Distance × 0.5 HP | Rewards long, healthy runs |

### 5.2 Progression Milestones

Player progression is tracked through a "Hero Level" system ranging from Level 1 ("Seed Sprout") to Level 50 ("Nutrition Champion"). Each level requires incrementally more HeroPoints, and level-ups unlock new content:

- **Levels 1–10 (Seed Sprout to Sapling):** Tutorial progression, basic characters unlocked, first 2 environments available.
- **Levels 11–20 (Growing Green to Bloom):** Advanced power-ups introduced, 3rd environment unlocked, daily challenges become available.
- **Levels 21–30 (Harvest Helper to Garden Guide):** All environments unlocked, NutriDex bonus challenges appear, complex food combos introduced.
- **Levels 31–40 (Nutrition Navigator to Health Hero):** Rare character outfits, advanced daily challenges, classroom mode eligibility.
- **Levels 41–50 (Wellness Warrior to Nutrition Champion):** Prestige cosmetics, golden food variants, leaderboard eligibility, mentor badge for helping newer players.

---

## 6. Educational Framework and Learning Outcomes

### 6.1 Learning Objectives

Health Hero is designed to achieve the following measurable educational outcomes through gameplay:

1. **Food Group Identification:** After 20 gameplay sessions, the child should be able to categorise common foods into the correct food group (fruits, vegetables, grains, proteins, dairy, water) with 80% or greater accuracy.

2. **Healthy vs. Unhealthy Differentiation:** After 10 sessions, the child should be able to identify whether a given food is "healthy" or "unhealthy" with 85% or greater accuracy.

3. **Nutritional Benefit Awareness:** After 30 sessions, the child should be able to state at least one health benefit for 10 different healthy foods (e.g., "Carrots help your eyes").

4. **Hydration Importance:** After 15 sessions, the child should understand that water is the healthiest drink choice and be able to identify sugary drinks as unhealthy.

5. **Balanced Diet Concept:** After 40 sessions, the child should understand the concept of eating from multiple food groups daily and be able to describe a "balanced plate."

### 6.2 Pedagogical Approach

Health Hero employs a spaced repetition and positive reinforcement learning model. Healthy food items appear frequently and consistently reward the player, creating strong positive associations through repetition. Nutritional facts are delivered in small, digestible bites (2–3 seconds of display) during high-engagement moments, leveraging the psychological principle that information encountered during elevated emotional states (excitement of gameplay) is retained more effectively.

The game avoids fear-based messaging about unhealthy food. Junk food items are framed as obstacles to progress rather than as "bad" or "evil." The language used in pop-ups is always constructive: "Water gives you energy!" rather than "Soda is terrible for you." This approach aligns with child psychology best practices that recommend positive framing over negative messaging for lasting behavioural change in young children.

### 6.3 Curriculum Alignment

The game's educational content aligns with the following established nutrition education standards:

- USDA MyPlate guidelines for children's daily nutritional intake
- WHO recommendations on reducing free sugar intake in children
- National Health Education Standards (NHES) for grades K–6
- The UK's Eatwell Guide principles for balanced nutrition

Content can be regionally adapted through the server-side content management system to align with local dietary guidelines, cultural food preferences, and language requirements.

---

## 7. Technical Architecture Overview

### 7.1 Technology Stack

| Component | Technology | Justification |
|-----------|-----------|---------------|
| **Game Engine** | Unity 2023 LTS (or Godot 4.x) | Cross-platform deployment (iOS, Android) from single codebase; extensive 2D/3D rendering capabilities; large asset store ecosystem. |
| **Programming Language** | C# (Unity) or GDScript (Godot) | Native engine language; strong typing; extensive documentation and community support. |
| **Backend Services** | Firebase (Authentication, Firestore, Cloud Functions) | Scalable, serverless architecture; built-in COPPA compliance tools; real-time sync capabilities. |
| **Content Delivery** | Firebase Remote Config + Cloud Storage | Dynamic content updates without app store review; A/B testing for educational content effectiveness. |
| **Analytics** | Custom anonymised event logging | COPPA-compliant; no third-party tracking SDKs; aggregated usage patterns only. |
| **CI/CD Pipeline** | GitHub Actions + Fastlane | Automated builds, testing, and deployment to both app stores. |

### 7.2 System Architecture Diagram Description

The system follows a client-heavy architecture where all gameplay logic, educational content, and progression data reside on-device. The cloud layer is optional and provides synchronisation, leaderboards, and the parent remote dashboard. The architecture comprises three tiers:

- **Client Tier:** The mobile application containing the game engine, local SQLite database for progression data, encrypted local storage for preferences and parent PIN, and a cached content library for offline play.

- **API Gateway Tier:** A Firebase Cloud Functions layer that handles authentication, data validation, rate limiting, and request routing. All communication is stateless and RESTful.

- **Cloud Data Tier:** Firestore for user progression sync, Cloud Storage for downloadable content packs (new environments, seasonal food items), and Firebase Remote Config for feature flags and A/B testing.

### 7.3 Data Model Summary

| Entity | Key Attributes | Storage |
|--------|---------------|---------|
| **Player Profile** | hero_level, total_hp, characters_unlocked[], current_character, settings{} | Local SQLite + Cloud Firestore |
| **Run Session** | session_id, distance, hp_earned, items_collected[], junk_contacts[], duration, timestamp | Local SQLite; batch-synced to cloud |
| **NutriDex Entry** | food_id, food_group, is_discovered, discovery_date, times_collected, nutri_facts[] | Local SQLite + Cloud Firestore |
| **Daily Challenge** | challenge_id, type, target, progress, is_completed, reward_hp | Local SQLite; validated server-side |
| **Parent Config** | pin_hash, daily_limit_minutes, kiddie_mode_enabled, export_preferences | Local encrypted storage only |

---

## 8. Testing and Quality Assurance Strategy

### 8.1 Testing Levels

| Testing Level | Scope | Tools/Methods |
|--------------|-------|---------------|
| **Unit Testing** | Individual game mechanics (collision detection, score calculation, power-up timers, health meter logic) | Unity Test Framework / Godot GUT; automated CI execution on every commit |
| **Integration Testing** | Interaction between systems (collectible system + education overlay, junk food + visual effects, cloud sync + local save) | Automated integration suites; mock server testing |
| **System Testing** | Complete end-to-end gameplay sessions across all environments and difficulty levels | Manual QA playtesting; automated regression suites for critical paths |
| **Performance Testing** | Frame rate stability, memory usage, battery consumption, load times across 20+ device models | Unity Profiler; Firebase Performance Monitoring; device farm testing (AWS Device Farm) |
| **Usability Testing** | Child user testing with target age groups (5–7, 8–10, 11–12) to validate control responsiveness, educational comprehension, and emotional responses | Moderated play sessions with 30+ children; parent feedback surveys; A/B testing of UI variants |
| **Accessibility Testing** | Colourblind mode verification, text size scaling, haptic feedback accuracy, one-handed playability | Automated colour contrast checks; manual testing with accessibility tools; user testing with children who have disabilities |
| **Security Testing** | COPPA compliance audit, PIN security, network encryption, data leak prevention | Third-party security audit; OWASP Mobile Security Verification Standard checklist |

### 8.2 Acceptance Criteria

The following criteria must be met before release:

- 100% of functional requirements pass automated and manual testing with zero critical or high-severity defects
- 60 FPS maintained on the 20 most popular iOS and Android devices (by market share)
- 95% or higher crash-free sessions rate over a 7-day beta period with 1,000+ testers
- Positive educational outcome validation: 75% of child testers demonstrate improved food group identification after 10 test sessions
- Full COPPA compliance certification from an accredited third-party auditor
- Parent dashboard accuracy validated: all displayed statistics match actual gameplay data within 1% margin

---

## 9. Project Timeline and Milestones

| Phase | Duration | Key Deliverables |
|-------|----------|-----------------|
| **Phase 1: Concept & Design** | Weeks 1–4 | Game design document, art style guide, character concept art, educational content plan, wireframes for all screens |
| **Phase 2: Core Prototype** | Weeks 5–10 | Playable single-environment prototype with basic collectible and obstacle system, 3-lane running mechanics, and placeholder art |
| **Phase 3: Content Production** | Weeks 11–18 | All 50+ food items modelled and animated, 5 environments built, 12 characters completed, NutriFact database populated, sound design finalised |
| **Phase 4: Feature Complete** | Weeks 19–24 | Parent dashboard, daily challenges, NutriDex, character progression, cloud sync, and all UI screens fully implemented |
| **Phase 5: Testing & Polish** | Weeks 25–30 | Full QA cycle, child usability testing, performance optimisation, accessibility audit, COPPA compliance audit |
| **Phase 6: Soft Launch** | Weeks 31–34 | Limited regional release (2–3 countries), live metrics monitoring, feedback collection, critical bug fixes |
| **Phase 7: Global Launch** | Week 35 | Worldwide release on iOS App Store and Google Play Store; marketing campaign activation; educator outreach program launch |

---

## 10. Appendices

### 10.1 Appendix A: Complete Healthy Collectible Item List

The following is the initial roster of healthy collectible items. Additional items will be added through content updates.

| ID | Item Name | Food Group | HP Value |
|----|----------|-----------|----------|
| HC-001 | Water Bottle | Hydration | 15 |
| HC-002 | Coconut Water | Hydration | 15 |
| HC-003 | Herbal Tea Cup | Hydration | 14 |
| HC-004 | Red Apple | Fruits | 10 |
| HC-005 | Banana | Fruits | 10 |
| HC-006 | Orange | Fruits | 10 |
| HC-007 | Strawberry Bunch | Fruits | 11 |
| HC-008 | Watermelon Slice | Fruits | 10 |
| HC-009 | Grapes Cluster | Fruits | 10 |
| HC-010 | Mango | Fruits | 11 |
| HC-011 | Carrot | Vegetables | 12 |
| HC-012 | Broccoli Floret | Vegetables | 12 |
| HC-013 | Spinach Bunch | Vegetables | 13 |
| HC-014 | Red Bell Pepper | Vegetables | 12 |
| HC-015 | Tomato | Vegetables | 11 |
| HC-016 | Green Peas Pod | Vegetables | 12 |
| HC-017 | Sweet Potato | Vegetables | 12 |
| HC-018 | Cucumber | Vegetables | 11 |
| HC-019 | Grilled Chicken Leg | Proteins | 14 |
| HC-020 | Boiled Egg | Proteins | 13 |
| HC-021 | Fish Fillet | Proteins | 14 |
| HC-022 | Bean Bowl | Proteins | 13 |
| HC-023 | Handful of Almonds | Proteins | 14 |
| HC-024 | Lentil Soup Cup | Proteins | 13 |
| HC-025 | Brown Bread Slice | Grains | 11 |
| HC-026 | Oatmeal Bowl | Grains | 11 |
| HC-027 | Brown Rice Ball | Grains | 11 |
| HC-028 | Whole Wheat Pasta | Grains | 11 |
| HC-029 | Milk Carton | Dairy | 10 |
| HC-030 | Yoghurt Cup | Dairy | 10 |

### 10.2 Appendix B: Junk Food Obstacle Item List

| ID | Item Name | Junk Category | HP Penalty |
|----|----------|--------------|------------|
| JF-001 | Cola Can | Sugary Drinks | -10 |
| JF-002 | Energy Drink | Sugary Drinks | -12 |
| JF-003 | Strawberry Milkshake | Sugary Drinks | -10 |
| JF-004 | Lollipop | Candy & Sweets | -8 |
| JF-005 | Gummy Bear Pack | Candy & Sweets | -8 |
| JF-006 | Chocolate Bar | Candy & Sweets | -9 |
| JF-007 | Cotton Candy | Candy & Sweets | -8 |
| JF-008 | French Fries Box | Fried Foods | -12 |
| JF-009 | Fried Chicken Bucket | Fried Foods | -12 |
| JF-010 | Glazed Doughnut | Fried Foods | -11 |
| JF-011 | Potato Chips Bag | Processed Snacks | -9 |
| JF-012 | Cheese Puffs | Processed Snacks | -9 |
| JF-013 | Instant Noodle Cup | Processed Snacks | -9 |
| JF-014 | Cake Slice | Excessive Sugar | -15 |
| JF-015 | Ice Cream Sundae | Excessive Sugar | -15 |

### 10.3 Appendix C: Glossary of NutriFact Examples

The following are sample NutriFact messages that appear during gameplay. The full database will contain 200+ unique facts at launch.

- "Carrots are loaded with beta-carotene, which your body turns into Vitamin A to keep your eyes healthy!"
- "Drinking water helps your brain work better. Your brain is about 75% water!"
- "Broccoli has more Vitamin C than an orange, plus it helps build strong bones!"
- "Bananas give you quick energy because they are packed with natural sugars and potassium!"
- "Oatmeal keeps you feeling full longer because it is a whole grain with lots of fibre!"
- "Eggs are one of the best sources of protein. Protein helps your muscles grow!"
- "Yoghurt has friendly bacteria called probiotics that help keep your tummy happy!"
- "Too much sugar can make you feel tired and grumpy after a short energy burst. That is called a sugar crash!"
- "A balanced plate has foods from at least 3 different food groups. Can you collect them all?"

---

*End of Document*

**Health Hero: The Healthy Runner — Software Requirements Specification v1.0**
**Prepared March 2026 | Confidential**
