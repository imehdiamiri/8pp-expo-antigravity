# 8PartyPlay — Development Log

> Port of the native iOS (SwiftUI) party game app to React Native (Expo).
> Goal: 1:1 UI/UX and functional parity across iOS + Web.

---

## 📋 Project Overview

| Field | Value |
|-------|-------|
| **App Name** | 8PartyPlay |
| **Framework** | Expo SDK 54, React Native 0.81 |
| **Router** | expo-router v6 (file-based routing) |
| **State** | Zustand v5 |
| **Backend** | Firebase (Auth, Realtime Database, Cloud Functions) |
| **Payments** | RevenueCat (`react-native-purchases`) |
| **Language** | TypeScript 5.9 |
| **Platforms** | iOS (primary), Web (static SSR) |

---

## 🗂️ Repository Structure

```
8pp-expo-antigravity/
├── expo-app/               ← Main Expo project
│   ├── app/                ← File-based routes (expo-router)
│   │   ├── (tabs)/         ← Bottom tab navigator
│   │   │   ├── index.tsx / .web.tsx      — Games home grid
│   │   │   ├── tools.tsx / .web.tsx      — Party tools list
│   │   │   ├── friends.tsx / .web.tsx    — Friends & online users
│   │   │   ├── factory.tsx / .web.tsx    — AI card generator
│   │   │   └── game/[id].tsx / .web.tsx  — Game detail & setup
│   │   ├── (tools)/        ← Party tool modals
│   │   │   ├── bottle.tsx / .web.tsx     — Spin the Bottle
│   │   │   ├── coin.tsx / .web.tsx       — Coin Flip
│   │   │   ├── dice.tsx / .web.tsx       — Dice Roll
│   │   │   ├── hourglass.tsx / .web.tsx  — Sand Timer
│   │   │   └── teams.tsx / .web.tsx      — Random Team Maker
│   │   ├── auth/           ← Sign-in (anonymous + Apple)
│   │   ├── cards/          ← Card deck browser
│   │   ├── game/[id]/      ← Game setup → session flow
│   │   │   ├── setup.tsx               — Player count, teams, settings
│   │   │   ├── session.tsx / .web.tsx   — Active game session
│   │   │   └── lobby/create.web.tsx    — Multi-device lobby (web)
│   │   ├── lobby/          ← Multiplayer lobby
│   │   │   ├── join.tsx / .web.tsx     — Join by room code
│   │   │   └── [roomCode].tsx / .web.tsx — Lobby waiting room
│   │   ├── _layout.tsx     ← Root Stack navigator
│   │   ├── onboarding.tsx / .web.tsx
│   │   ├── profile.tsx / .web.tsx
│   │   ├── paywall.tsx / .web.tsx
│   │   ├── purchase-detail.tsx / .web.tsx
│   │   ├── team-setup.tsx / .web.tsx
│   │   └── invite.tsx
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── games/      ← 11 game session components
│   │   │   ├── tools/      ← Card deck renderer, party tools
│   │   │   ├── ui/         ← GlowView, WebButton, WebPress
│   │   │   ├── AppBackgroundView.tsx
│   │   │   ├── GameCardView.tsx
│   │   │   └── ToastOverlay.tsx
│   │   ├── models/
│   │   │   ├── AppModels.ts       ← Game definitions, modes, enums
│   │   │   ├── CardModels.ts      ← Full card deck data (138 KB)
│   │   │   └── PartyGameTutorial.ts
│   │   ├── store/           ← Zustand stores
│   │   │   ├── useAuthStore.ts
│   │   │   ├── useSettingsStore.ts
│   │   │   ├── useGameStore.ts
│   │   │   ├── useFriendsStore.ts
│   │   │   ├── useMultiplayerStore.ts
│   │   │   ├── useEconomyStore.ts
│   │   │   └── usePaywallStore.ts
│   │   ├── services/        ← Business logic
│   │   │   ├── AudioManager.ts
│   │   │   ├── SoundManager.ts
│   │   │   ├── GameSyncService.ts
│   │   │   ├── MultiplayerService.ts
│   │   │   ├── MultiplayerTelemetry.ts
│   │   │   ├── SessionResilienceService.ts
│   │   │   ├── InviteService.ts
│   │   │   ├── NotificationService.ts
│   │   │   ├── LLMService.ts
│   │   │   ├── AICardGenerator.ts
│   │   │   └── SharedResultBuilder.ts
│   │   ├── lib/
│   │   │   ├── firebase.ts   ← Firebase init + RTDB helpers
│   │   │   └── supabase.ts   ← Supabase client (placeholder)
│   │   ├── hooks/
│   │   │   ├── useAudioPreload.ts
│   │   │   └── useGameSync.ts
│   │   ├── theme/
│   │   │   └── Colors.ts     ← Centralized color palette
│   │   └── utils/
│   │       ├── DeviceIdentity.ts
│   │       └── safeHaptics.ts
│   │
│   ├── components/          ← Expo default shared components
│   ├── functions/           ← Firebase Cloud Functions
│   ├── assets/              ← Images, fonts, sounds
│   ├── app.json             ← Expo config
│   ├── firebase.json        ← Firebase hosting/functions config
│   ├── firestore.rules      ← Firestore security rules
│   └── firestore.indexes.json
│
├── ios/                     ← Original SwiftUI app (reference)
├── rebuilt/                 ← Porting documentation (32 spec files)
├── website/                 ← Landing page (Next.js + Tailwind)
├── database.rules.json      ← Firebase RTDB security rules
├── firebase.json            ← Root Firebase config
└── .firebaserc              ← Firebase project alias
```

---

## 🎮 Games Implemented (11 total)

| # | Game | Component | Players | Mode |
|---|------|-----------|---------|------|
| 1 | Reverse Singing | `ReverseSingingSession.tsx` | 2–2 | 1 Phone |
| 2 | Guess the Seconds | `GuessTheSecondsSession.tsx` | 2–30 | Multi Phone |
| 3 | Imposter | `ImposterSession.tsx` | 3+ | 1 Phone |
| 4 | Memory Grid | `MemoryGridSession.tsx` | 1–30 | Multi Phone |
| 5 | Ten Tangle | `TenTangleSession.tsx` | 2+ | 1 Phone |
| 6 | Memory Path | `MemoryPathSession.tsx` | 2–30 | Multi Phone |
| 7 | Pass & Guess | `PassGuessSession.tsx` | 2–30 | 1 Phone |
| 8 | Tap in Order | `TapInOrderSession.tsx` | 1–30 | Multi Phone |
| 9 | Color Trap | `ColorTrapSession.tsx` | 1–30 | 1 Phone |
| 10 | Draw & Rush | `DrawRushSession.tsx` + `DrawRushMultiDeviceSession.tsx` | 2–12 | Both |
| 11 | Spin the Bottle | `SpinBottleSession.tsx` | 2+ | 1 Phone |

### Supporting Game Components
- `GameSessionRenderer.tsx` — Routes game ID to the correct session component
- `UnifiedSetupComponents.tsx` — Shared player count / team setup UI
- `SharedGameComponents.tsx` — Timer bars, score displays, phase overlays
- `PhaseTransition.tsx` — Animated phase transition overlay
- `FirstTimeHintOverlay.tsx` — First-play tutorial hint
- `OtherFunListView.tsx` — "Ideas" tab content (Truth & Dare, etc.)

---

## 🛠️ Party Tools (5 total)

| Tool | File | Description |
|------|------|-------------|
| Spin the Bottle | `(tools)/bottle.tsx` | Animated spinning bottle |
| Coin Flip | `(tools)/coin.tsx` | 3D coin flip animation |
| Dice Roll | `(tools)/dice.tsx` | 1–6 dice with shake |
| Sand Timer | `(tools)/hourglass.tsx` | Configurable countdown |
| Random Teams | `(tools)/teams.tsx` | Split players into random teams |

---

## 🏗️ Architecture & Patterns

### Platform-Specific Rendering
Every screen that uses iOS-specific APIs (Reanimated, BlurView, Haptics, etc.) has a `.web.tsx` counterpart that provides a simplified web-compatible version:
```
screen.tsx       → iOS/Android (full animations, native APIs)
screen.web.tsx   → Web (simplified, CSS-based, pointer-friendly)
```

### State Management (Zustand)
| Store | Purpose |
|-------|---------|
| `useAuthStore` | Firebase Auth state, anonymous sign-in, Apple Sign-In |
| `useSettingsStore` | Player name, onboarding status, preferences |
| `useGameStore` | Current game session state |
| `useFriendsStore` | Friend list, online presence via RTDB |
| `useMultiplayerStore` | Room state, player sync, lobby management |
| `useEconomyStore` | Coins, gems, wallet balance |
| `usePaywallStore` | RevenueCat subscription status, offerings |

### Backend Services
| Service | Purpose |
|---------|---------|
| `firebase.ts` | Firebase app init, RTDB presence, user online/offline |
| `GameSyncService.ts` | Real-time game state sync via RTDB |
| `MultiplayerService.ts` | Room create/join, player management |
| `MultiplayerTelemetry.ts` | Latency tracking, connection quality |
| `SessionResilienceService.ts` | Reconnect handling, state recovery |
| `InviteService.ts` | Deep-link invite generation |
| `NotificationService.ts` | Push notification registration |
| `AudioManager.ts` | expo-av audio playback |
| `SoundManager.ts` | Sound effect preloading |
| `LLMService.ts` | OpenAI API integration |
| `AICardGenerator.ts` | AI-powered custom card deck generation |

---

## 📊 Development Timeline

### Phase 1: Foundation ✅
- Expo project init with expo-router
- File-based routing structure
- Tab navigation (Games, Tools, Friends, Factory)
- Design system: `Colors.ts`, `AppBackgroundView`, `GlowView`
- Firebase integration (Auth, RTDB)
- Zustand stores setup

### Phase 2: Core Tabs UI ✅
- Home screen game grid with responsive columns
- Game card design with gradients and player count badges
- Mode filter chips (All, 1 Phone, Multi Phone, Team Mode)
- Games / Ideas tab switcher
- Profile screen with wallet and settings
- Friends tab with online presence

### Phase 3: Game Sessions ✅
- Unified game setup flow (player count → team config → session)
- All 11 game session UIs implemented
- Game-specific logic (timers, scoring, rounds, phases)
- Phase transition animations
- First-time hint overlays
- Shared result builder

### Phase 4: Party Tools ✅
- Spin the Bottle with physics animation
- Coin Flip with 3D rotation
- Dice Roll with spring animation
- Sand Timer with configurable duration
- Random Team generator

### Phase 5: Multiplayer ✅
- Room creation with unique codes
- Join room by code flow
- Real-time player sync via RTDB
- onDisconnect presence handling
- Multi-device Draw Rush support
- Session resilience & reconnect

### Phase 6: Economy & Paywall ✅
- RevenueCat integration
- Coin/Gem economy model
- Paywall screen with offerings
- Purchase detail modal
- Wallet display in profile

### Phase 7: Web Platform ✅
- `.web.tsx` counterparts for all screens
- Simplified animations for web
- CSS-based blur/gradient fallbacks
- Responsive grid layouts (2/3/4 columns)
- Web-compatible tab bar and navigation

### Phase 8: Polish ✅
- Centralized color palette standardization
- Apple HIG font size scale (11–34pt)
- Unified header buttons and navigation
- Audio manager with preloading
- Invite & referral system with deep links
- Firebase Cloud Functions for audio processing

---

## 🔧 Tech Stack Detail

| Category | Technology |
|----------|-----------|
| Framework | Expo SDK 54 |
| Runtime | React Native 0.81.5, React 19.1 |
| Router | expo-router 6 |
| State | Zustand 5 |
| Auth | Firebase Auth (Anonymous + Apple) |
| Database | Firebase Realtime Database |
| Functions | Firebase Cloud Functions |
| Payments | RevenueCat (react-native-purchases) |
| Animation | react-native-reanimated 4.1 |
| Gestures | react-native-gesture-handler 2.28 |
| Blur | expo-blur |
| Gradients | expo-linear-gradient |
| Audio | expo-av |
| Haptics | expo-haptics |
| SVG | react-native-svg |
| Images | expo-image |
| Fonts | expo-font (Viral family) |
| Web | react-native-web 0.21 |
| AI | OpenAI API via LLMService |

---

## 📝 Known Issues & Notes

1. **Web SSR Hydration**: `output: "static"` in `app.json` enables SSR. Combined with `reactCompiler: true`, this can cause hydration mismatches on web. If web interactivity breaks, disable `reactCompiler` or switch to `output: "single"`.

2. **Web Click Events**: React Native Web uses a custom Responder system. `TouchableOpacity` works on web but CDP synthetic clicks (from testing tools) may not trigger the internal pointer event chain.

3. **Onboarding on Web**: The native onboarding uses `Animated.ScrollView` pager with Reanimated which doesn't work on web. A separate `onboarding.web.tsx` provides a simplified version.

4. **RevenueCat on Web**: Falls back to "Browser Mode" — no actual purchases on web, only UI display.

5. **Haptics**: `expo-haptics` is iOS-only. All haptic calls are wrapped in Platform checks or `safeHaptics.ts`.

6. **Supabase**: Client is initialized (`src/lib/supabase.ts`) but the app currently uses Firebase RTDB for all real-time features. Supabase integration is planned for future phases.

---

## 📁 Key Configuration Files

| File | Purpose |
|------|---------|
| `app.json` | Expo config (plugins, schemes, web output) |
| `firebase.json` | Firebase Hosting + Functions config |
| `firestore.rules` | Firestore security rules |
| `firestore.indexes.json` | Firestore composite indexes |
| `firebase-rtdb-rules.json` | Realtime Database security rules |
| `database.rules.json` | Root-level RTDB rules |
| `.env` | Firebase API keys (gitignored) |

---

*Last updated: 2026-05-03*
