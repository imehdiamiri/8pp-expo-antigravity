# 8PartyPlay - React Native Port Devlog

This document tracks the progress of porting the 8PartyPlay native iOS (SwiftUI) application to React Native (Expo).
The goal is to achieve 1:1 UI/UX and functional parity, completing the frontend entirely before integrating the backend (Supabase).

## 🛠 Status Overview
- **Phase 1: Architecture & Tools** -> Completed
- **Phase 2: Main Navigation & Core Tabs UI** -> In Progress
- **Phase 3: Game Setup & Game Session UI** -> Pending
- **Phase 4: Backend & Multiplayer (Supabase)** -> Pending

---

## 📁 File Porting Tracker

### **Party Tools** (✅ Completed)
- [x] `PartyToolsViews.swift` -> Ported to `app/(tools)` modals and `PartyToolsSection.tsx`
- [x] `CoinFlipAndTeamsToolViews.swift` -> Ported to `coin.tsx` and `teams.tsx`
- [x] `CardsView.swift` -> Ported to `app/(tabs)/tools.tsx`

### **Main Navigation & Tabs** (✅ Completed)
- [x] `MainTabView.swift` -> `app/(tabs)/_layout.tsx`, `app/(tabs)/index.tsx`, `app/(tabs)/friends.tsx`, `app/(tabs)/factory.tsx`
- [x] `HomeRootView` / `HomeView` -> `app/(tabs)/index.tsx`
- [x] `SocialRootView` / `FriendsView` -> `app/(tabs)/friends.tsx`
- [x] `GeneratorView.swift` / `AICardGeneratorView.swift` -> `app/(tabs)/factory.tsx`
- [x] `ProfileView` -> `app/profile.tsx`
- [x] `OtherFunView.swift` -> Embedded in `index.tsx` library

### **Games & Sessions** (⏳ Pending)
- [ ] `CasualRoomViews.swift` / `WaitingRoomView`
- [ ] `GameViews.swift` / `GameDetailView`
- [ ] `SharedGameComponents.swift`
- [ ] `UnifiedSetupComponents.swift`
- [ ] **Specific Games:**
  - [ ] `SpinBottleSessionView.swift` & `SpinBottleSetupView.swift`
  - [ ] `ColorTrapSessionView.swift` & `ColorTrapSetupView.swift`
  - [ ] `DrawRushSessionView.swift`, `DrawRushMultiDeviceSessionView.swift`, `DrawRushSetupView.swift`
  - [ ] `MemoryGridSessionView.swift` & `MemoryGridSetupView.swift`
  - [ ] `MemoryPathSessionView.swift` & `MemoryPathSetupView.swift`
  - [ ] `PassGuessSessionView.swift` & `PassGuessSetupView.swift`
  - [ ] `ReverseSingingSessionView.swift`
  - [ ] `TapInOrderSessionView.swift` & `TapInOrderSetupView.swift`
  - [ ] `TenTangleSessionView.swift`
  - [ ] `GuessTheSecondsSessionView.swift`
  - [ ] `ImposterGameDetailView.swift`, `ImposterSessionView.swift`, `ImposterStyleSelectionView.swift`, `ImposterSingleDeviceSetupView.swift`

### **Authentication & Monetization** (✅ Completed)
- [x] `AuthView.swift` -> Ported to a modal/screen (`app/auth`)
- [x] `PaywallView.swift` & `PurchaseDetailView.swift` -> Ported to `app/paywall.tsx` with `src/store/usePaywallStore.ts`
- [x] Supabase to Firebase Migration (Auth, DB, RTDB)

### **Onboarding & Common Components** (⏳ Pending)
- [x] `OnboardingView.swift` -> `app/onboarding.tsx`
- [ ] `InviteView.swift`
- [ ] `ToastOverlay.swift` & `FirstTimeHintOverlay.swift`
- [x] `DesignSystem.swift` -> Tokens and styles configured
- [x] `AnimationModifiers.swift` -> Reanimated hooks and styles

---

## 📝 Next Steps
1. Begin Phase 3: Game Setup & Game Session UI.
2. Port `CasualRoomViews.swift` / `WaitingRoomView`.
3. Port `GameViews.swift` / `GameDetailView` (the screen users see before joining a specific game).
4. Port `SharedGameComponents.swift` and `UnifiedSetupComponents.swift` which will be used across all mini-games.