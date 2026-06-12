# Drift Sound — Sleep Sounds & White Noise
## Complete Build Documentation
### React Native Expo SDK 56 · TypeScript · By Gigasonet
#### Version 1.0 · June 2026

---

## REAL COMPETITOR RESEARCH — WHY THIS APP EXISTS

From live Play Store and App Store review mining (June 2026):

| Competitor Pain Point | Source | Your Opportunity |
|---|---|---|
| "App randomly turns off multiple times per night and wakes me from deep sleep" | White Noise Lite, Play Store May 2026 | Guaranteed background play via foreground service — never stops |
| "Goes to sleep when screen turns black even with timer off" | White Noise Free, Play Store 2026 | Proper Android foreground service keeps audio alive |
| "Causes phone to overheat overnight on wireless charger" | White Noise Deep Sleep, App Store 2025 | Airplane mode reminder + battery optimization guide built in |
| "Play button is too small when I'm half-awake or not wearing glasses" | White Noise Deep Sleep, App Store July 2025 | Giant 80dp tap-anywhere hero play button |
| "Can't sort free sounds from paid — have to guess which ones are locked" | Relax Melodies review | Zero hidden paywalls on sound library — all 36 sounds free |
| "Randomly stops after screen goes black" | Multiple apps, consistent complaint | Android foreground service + persistent notification player |
| "Battery drains from 75% to 20% overnight" | White Noise Lite, Play Store Feb 2025 | Low-power audio mode via `AudioFocus` + screen-off optimization |
| "Overwhelming customization options for a bedtime tool" | Sleep sounds app review 2026 | Calm, minimal UI — one tap to play, nothing in the way |

**What competitors have that you beat:**
- White Noise Free / Lite — old UI, stops when screen goes black, battery drain
- Relax Melodies — $59.99/year subscription, locks most sounds behind paywall
- WaveMix — iOS-first, Android version feels ported
- Calm / Headspace — meditation-focused, expensive subscription, overkill for white noise
- Deep Sleep Sounds — overheating complaints, small play button

**What NOBODY has that you will build:**
1. **Breathe with sound** — a visual breathing guide synced to audio volume (inhale = volume rises, exhale = volume falls). No competitor does this.
2. **Scene moods** — pre-built layered mixes with animated backgrounds (Rainy Cabin, Ocean Dock, Forest Night). Not just sound tiles.
3. **Smart fade schedule** — set a wake time, app slowly increases volume from 0% starting 30 min before, acting as a gentle audio alarm.
4. **Tap-anywhere play** — the entire bottom 40% of screen is the play/pause zone when audio is active. No tiny button at 3am.
5. **One-tap from lock screen widget** — Android 12+ widget that plays last mix without unlocking.

---

## CRITICAL RULES — NON-NEGOTIABLE

```
1. ZERO COMMENTS IN CODE — no // comment, no /* block comment */
2. NO .map() OR .filter() INSIDE JSX return — derive in useMemo before return
3. EVERY FlatList item = React.memo — zero wasted re-renders
4. EVERY CALLBACK = useCallback — every derived value = useMemo
5. NO ANONYMOUS ARROW FUNCTIONS AS PROPS — breaks React.memo
6. AUDIO MUST SURVIVE SCREEN OFF — Android foreground service is mandatory
7. ALL SOUNDS BUNDLED AS LOCAL ASSETS — zero internet required ever
8. NO INLINE STYLES WITH DYNAMIC VALUES — StyleSheet.create() only
9. DARK AND LIGHT THEME — every color from theme tokens, zero hardcoded hex
10. RESPONSIVE — test at 360dp, 412dp, 600dp, 840dp widths
```

---

## 1. APP OVERVIEW

| Field | Value |
|---|---|
| **App Name** | Drift Sound — Sleep & White Noise |
| **Package** | com.gigasonet.driftsound |
| **Platform** | Android (Expo SDK 56 managed → EAS build APK/AAB) |
| **Language** | TypeScript strict mode |
| **Target Countries** | USA, UK, Canada, Australia, Germany |
| **Monetization** | AdMob rewarded video (unlock premium scenes) + $2.99 one-time unlock all |
| **Category** | Health & Fitness |
| **Content Rating** | Everyone |
| **Backend** | ZERO — fully offline, no server, no account |
| **Company** | Gigasonet |
| **Support** | support@gigasonet.com |

**App tagline:** Fall asleep in seconds. Stay asleep all night.

---

## 2. TECH STACK

```
Expo SDK           : 56 (stable June 2026)
React Native       : 0.85.2
Language           : TypeScript (strict)
Navigation         : expo-router (file-based, SDK 56)
Audio              : expo-av (Audio.Sound — bundled assets only)
Background audio   : expo-av + Android foreground service via
                     expo-task-manager + expo-background-task (SDK 56)
Notifications      : expo-notifications (persistent player notification)
Haptics            : expo-haptics
Keep Awake         : expo-keep-awake (optional screen-on mode)
Secure Storage     : expo-secure-store (last mix, preferences)
Widgets            : react-native-android-widget (lock screen widget)
Animations         : react-native-reanimated v3
Fonts              : @expo-google-fonts/nunito + @expo-google-fonts/inter
Theme              : React Context (dark/light, auto-system)
State (global)     : zustand v5 (player state, preferences)
Ads                : react-native-google-mobile-ads
Build              : EAS Build → APK for direct install, AAB for Play Store
```

**Why Nunito:**
Nunito is rounded, soft, and calming — the same font used by sleep and wellness
apps. Inter handles data/numbers. Together they read as "calm and premium"
without being generic.

---

## 3. SOUND LIBRARY — 36 FREE BUNDLED SOUNDS

All sounds are sourced from **Freesound.org (CC0 license)** and
**Pixabay (free for commercial use)**. They are bundled as `.mp3` files inside
the app — no internet required. Each file is pre-trimmed and looped seamlessly.

### Source locations:
- **Freesound.org** → filter by CC0 → search each category below
- **Pixabay.com/sound-effects** → royalty-free, free commercial use
- **Internet Archive (archive.org/details/relaxingsounds)** — long MP3 collection, public domain

### Sound categories and files:

```
NATURE (12 sounds)
├── rain_light.mp3          Heavy rain on roof
├── rain_heavy.mp3          Intense downpour on leaves
├── rain_window.mp3         Rain hitting glass window
├── thunder_distant.mp3     Distant rolling thunder with light rain
├── ocean_waves.mp3         Slow ocean waves on shore
├── ocean_deep.mp3          Deep underwater ambience
├── forest_morning.mp3      Birds + breeze through trees
├── forest_night.mp3        Crickets + frogs + gentle wind
├── river_stream.mp3        Babbling brook over rocks
├── waterfall.mp3           Continuous waterfall
├── wind_gentle.mp3         Soft wind through grass
└── campfire.mp3            Crackling fire, no music

WHITE NOISE COLORS (6 sounds)
├── white_noise.mp3         True white noise (all frequencies equal)
├── pink_noise.mp3          Pink noise (deeper, softer than white)
├── brown_noise.mp3         Brown/red noise (deep rumble, most popular)
├── blue_noise.mp3          Blue noise (higher frequency, focus aid)
├── grey_noise.mp3          Grey noise (flattened to hearing curve)
└── violet_noise.mp3        High frequency, tinnitus masking

MECHANICAL / FAN (6 sounds)
├── fan_slow.mp3            Slow oscillating fan
├── fan_medium.mp3          Medium fan speed
├── fan_fast.mp3            Fast fan, air conditioner adjacent
├── air_conditioner.mp3     Central AC hum
├── box_fan.mp3             Box fan, bassy rumble
└── vacuum_distant.mp3      Distant vacuum cleaner (baby sleep classic)

URBAN / COZY (6 sounds)
├── coffee_shop.mp3         Cafe ambience, soft chatter, cups
├── train_ride.mp3          Train carriage rhythm, no announcements
├── airplane_cabin.mp3      Cabin hum, no voice
├── library.mp3             Quiet library ambience
├── fireplace_indoor.mp3    Indoor fireplace, crackling
└── city_rain.mp3           Rainy city street, distant traffic

CELESTIAL / FOCUS (6 sounds)
├── space_hum.mp3           Low cosmic drone
├── tibetan_bowls.mp3       Long resonant bowl tones
├── brown_binaural.mp3      Brown noise + binaural beat layer
├── delta_waves.mp3         Delta brain wave audio (0.5–4Hz)
├── theta_waves.mp3         Theta waves (4–8Hz, light sleep)
└── womb_sounds.mp3         Womb-like whooshing (baby sleep)
```

### How to source each file (step by step):
1. Go to **freesound.org** → click "Search" → type "rain heavy" → filter "License: CC0"
2. Download `.wav` or `.mp3` (prefer `.mp3` if available)
3. In **Audacity** (free): trim to clean 30–60 second loop, export as `.mp3` 128kbps
4. Place in `assets/sounds/` folder
5. Total expected size: ~25MB for all 36 sounds at 128kbps

---

## 4. PRE-BUILT SCENES (unique feature — competitors don't have this)

Scenes are curated multi-sound mixes with animated backgrounds. They load
instantly with one tap. User can still edit the mix after loading a scene.

```
SCENE 1  — Rainy Cabin
  Sounds: rain_window (70%) + campfire (40%) + thunder_distant (20%)
  Background: dark cabin window animation (rain drops sliding)
  Mood: cozy, warm, isolated

SCENE 2  — Ocean Dock
  Sounds: ocean_waves (80%) + wind_gentle (30%)
  Background: dark ocean at night, moonlight on water
  Mood: open, peaceful, vast

SCENE 3  — Forest Night
  Sounds: forest_night (75%) + river_stream (35%)
  Background: dark forest, firefly particles
  Mood: earthy, alive, grounded

SCENE 4  — Deep Focus
  Sounds: brown_noise (60%) + delta_waves (40%)
  Background: minimal dark gradient, slow pulse animation
  Mood: clinical, focused, deep

SCENE 5  — Space Float
  Sounds: space_hum (70%) + violet_noise (30%)
  Background: slow star field, dark cosmos
  Mood: detached, vast, cosmic

SCENE 6  — Coffee Morning
  Sounds: coffee_shop (65%) + rain_light (35%)
  Background: warm cafe window, gentle steam animation
  Mood: productive, warm, energized
```

Scenes 1–3 are free. Scenes 4–6 unlockable via rewarded video or one-time purchase.

---

## 5. FOLDER STRUCTURE

```
Drift Sound/
├── app/
│   ├── _layout.tsx              ← Root: fonts, theme provider, navigation
│   ├── index.tsx                ← Redirects to /(tabs)/home
│   ├── (tabs)/
│   │   ├── _layout.tsx          ← Tab bar config
│   │   ├── home.tsx             ← Screen 1: Home / Now Playing
│   │   ├── sounds.tsx           ← Screen 2: Sound Library
│   │   ├── mixer.tsx            ← Screen 3: Mix Builder
│   │   └── timer.tsx            ← Screen 4: Timer & Schedule
│   └── settings.tsx             ← Screen 5: Settings (stack push)
│
├── src/
│   ├── audio/
│   │   ├── AudioEngine.ts       ← Core: load, play, pause, crossfade, loop
│   │   ├── MixPlayer.ts         ← Manages multiple simultaneous sounds
│   │   ├── FadeScheduler.ts     ← Wake-up fade + sleep fade logic
│   │   └── BackgroundTask.ts    ← Expo background task registration
│   │
│   ├── store/
│   │   ├── playerStore.ts       ← Zustand: active mix, volumes, playing state
│   │   └── preferencesStore.ts  ← Zustand: theme, last mix, timer prefs
│   │
│   ├── hooks/
│   │   ├── usePlayer.ts         ← Play/pause/volume controls
│   │   ├── useTimer.ts          ← Countdown timer logic
│   │   ├── useWakeFade.ts       ← Wake-up fade scheduler
│   │   └── useMixes.ts          ← Saved mixes CRUD (SecureStore)
│   │
│   ├── components/
│   │   ├── player/
│   │   │   ├── HeroPlayer.tsx   ← Big play button + waveform animation
│   │   │   ├── MiniPlayer.tsx   ← Bottom persistent mini player
│   │   │   ├── WaveformAnim.tsx ← Animated equalizer bars (Reanimated)
│   │   │   └── BreathingGuide.tsx← Visual breathing ring (inhale/exhale)
│   │   │
│   │   ├── sounds/
│   │   │   ├── SoundCard.tsx    ← Single sound tile
│   │   │   ├── SoundGrid.tsx    ← FlatList of SoundCard
│   │   │   ├── SceneCard.tsx    ← Scene tile with background preview
│   │   │   └── CategoryTabs.tsx ← Horizontal category filter tabs
│   │   │
│   │   ├── mixer/
│   │   │   ├── MixTrack.tsx     ← One active sound with volume slider
│   │   │   ├── VolumeSlider.tsx ← Custom slider (Reanimated gesture)
│   │   │   └── SaveMixSheet.tsx ← Bottom sheet: name and save mix
│   │   │
│   │   ├── timer/
│   │   │   ├── TimerDial.tsx    ← Circular timer selector (Reanimated)
│   │   │   ├── TimerCountdown.tsx← Live countdown display
│   │   │   └── WakeScheduler.tsx← Wake-up time picker
│   │   │
│   │   └── ui/
│   │       ├── Typography.tsx
│   │       ├── Card.tsx
│   │       ├── Badge.tsx
│   │       ├── IconButton.tsx
│   │       ├── BottomSheet.tsx  ← Reanimated draggable sheet
│   │       └── ThemeIcon.tsx    ← Sun/moon toggle
│   │
│   ├── constants/
│   │   ├── sounds.ts            ← Sound metadata array (name, file, category, emoji)
│   │   ├── scenes.ts            ← Scene definitions (sound mix + background config)
│   │   ├── colors.ts            ← Dark + light theme tokens
│   │   ├── spacing.ts           ← 4dp grid
│   │   └── typography.ts        ← Font scale
│   │
│   └── types/
│       ├── sound.ts             ← Sound, Mix, Scene TypeScript types
│       └── player.ts            ← PlayerState, TimerState types
│
├── assets/
│   ├── sounds/                  ← All 36 .mp3 files (~25MB total)
│   │   ├── rain_light.mp3
│   │   ├── rain_heavy.mp3
│   │   └── ... (all 36 files)
│   │
│   ├── fonts/
│   │   ├── Nunito-Regular.ttf
│   │   ├── Nunito-SemiBold.ttf
│   │   ├── Nunito-Bold.ttf
│   │   └── Inter-Regular.ttf
│   │
│   ├── icon.png                 ← 1024×1024 app icon
│   ├── adaptive-icon.png        ← Android adaptive foreground
│   ├── splash-icon.png          ← Splash logo
│   └── notification-icon.png    ← Monochrome 96×96
│
├── app.json
├── babel.config.js
├── tsconfig.json
├── eas.json
└── package.json
```

---

## 6. DESIGN SYSTEM

### 6.1 Color Tokens — Dark & Light

```typescript
// src/constants/colors.ts

const DARK = {
  bg:              '#0C0C12',
  bgSurface:       '#14141E',
  bgCard:          '#1C1C2A',
  bgCardHover:     '#222232',

  textPrimary:     '#F0EFE8',
  textSecondary:   '#8A8A9A',
  textMuted:       '#4A4A5A',

  accent:          '#6C8EFF',
  accentDim:       '#1A2348',
  accentGlow:      'rgba(108, 142, 255, 0.18)',

  green:           '#4ADE80',
  greenDim:        '#14291E',
  amber:           '#FBBF24',
  amberDim:        '#2D2208',
  red:             '#F87171',
  redDim:          '#2D0D0D',

  border:          'rgba(255,255,255,0.07)',
  borderStrong:    'rgba(255,255,255,0.13)',
  overlay:         'rgba(0,0,0,0.6)',
}

const LIGHT = {
  bg:              '#F6F5F0',
  bgSurface:       '#FFFFFF',
  bgCard:          '#EDECE7',
  bgCardHover:     '#E4E2DC',

  textPrimary:     '#1A1A22',
  textSecondary:   '#6A6A7A',
  textMuted:       '#ABABBA',

  accent:          '#4A6BDB',
  accentDim:       '#E8ECFB',
  accentGlow:      'rgba(74, 107, 219, 0.12)',

  green:           '#16A34A',
  greenDim:        '#DCFCE7',
  amber:           '#D97706',
  amberDim:        '#FEF3C7',
  red:             '#DC2626',
  redDim:          '#FEE2E2',

  border:          'rgba(0,0,0,0.07)',
  borderStrong:    'rgba(0,0,0,0.13)',
  overlay:         'rgba(255,255,255,0.7)',
}
```

### 6.2 Typography Scale

```typescript
// src/constants/typography.ts
const type = {
  hero:     { fontFamily: 'Nunito_700Bold',      fontSize: 56, lineHeight: 60 },
  display:  { fontFamily: 'Nunito_700Bold',      fontSize: 40, lineHeight: 44 },
  headingL: { fontFamily: 'Nunito_600SemiBold',  fontSize: 26, lineHeight: 32 },
  headingM: { fontFamily: 'Nunito_600SemiBold',  fontSize: 20, lineHeight: 26 },
  headingS: { fontFamily: 'Nunito_600SemiBold',  fontSize: 16, lineHeight: 22 },
  bodyL:    { fontFamily: 'Inter_400Regular',    fontSize: 16, lineHeight: 24 },
  bodyM:    { fontFamily: 'Inter_400Regular',    fontSize: 14, lineHeight: 20 },
  bodyS:    { fontFamily: 'Inter_400Regular',    fontSize: 13, lineHeight: 18 },
  label:    { fontFamily: 'Inter_500Medium',     fontSize: 12, lineHeight: 16, letterSpacing: 0.5 },
  caption:  { fontFamily: 'Inter_400Regular',    fontSize: 11, lineHeight: 14 },
  counter:  { fontFamily: 'Nunito_700Bold',      fontSize: 72, lineHeight: 76, fontVariant: ['tabular-nums'] },
}
```

### 6.3 Spacing & Responsive

```typescript
// src/constants/spacing.ts
const S = { xs:4, sm:8, md:12, lg:16, xl:20, xxl:24, xxxl:32, section:48 }

// Responsive helpers
import { Dimensions } from 'react-native'
const W = Dimensions.get('window').width
const hPad   = W < 412 ? 16 : W < 600 ? 20 : W < 840 ? 32 : 48
const cols   = W < 600 ? 2 : W < 840 ? 3 : 4       // sound grid columns
const cardW  = (W - hPad * 2 - (cols - 1) * 12) / cols
```

---

## 7. SCREEN SPECIFICATIONS (5 Screens)

---

### SCREEN 1 — Home / Now Playing (app/(tabs)/home.tsx)

**Purpose:** The screen users see every time they open the app. When nothing is
playing it shows scenes. When audio is playing it becomes a beautiful "Now
Playing" experience.

**Two states:**

---

#### State A — IDLE (nothing playing)

```
SafeAreaView (bg: colors.bg)
│
├── STATUS BAR (transparent)
│
├── HEADER ROW (hPad, paddingTop 16)
│   ├── Left: App name "Drift Sound" (headingM, textPrimary)
│   └── Right: [Moon/Sun theme toggle icon] [Settings gear icon]
│       → Moon/Sun: toggles dark/light immediately with haptic light
│       → Settings gear: pushes to /settings
│   Gap: 28
│
├── GREETING TEXT (hPad)
│   Dynamic based on time:
│   ├── 9pm–6am: "Ready to drift?" (headingL, textPrimary)
│   ├── 6am–12pm: "Good morning" (headingL, textPrimary)
│   ├── 12pm–6pm: "Focus or rest?" (headingL, textPrimary)
│   └── 6pm–9pm: "Wind down time" (headingL, textPrimary)
│   Below: "Choose a scene or pick your sounds" (bodyM, textSecondary)
│   Gap: 24
│
├── SCENES SECTION (hPad)
│   Label: "SCENES" (label, textMuted, letterSpacing 1.5)
│   Gap: 12
│   Horizontal ScrollView (showsHorizontalScrollIndicator=false):
│   └── SceneCard × 6 (each 160×200dp, borderRadius 20)
│       SceneCard layout:
│       ├── Background: gradient image (dark overlay on scene background color)
│       ├── Scene name (headingS, white)
│       ├── Sound names preview: "Rain · Campfire · Thunder" (caption, white 70%)
│       └── If locked: lock icon badge top-right (amber background)
│       Tap SceneCard:
│       → If free: immediately starts playing all scene sounds at their
│         preset volumes, navigates to State B (now playing), haptic medium
│       → If locked: shows BottomSheet with "Unlock this scene"
│         offering Rewarded Video OR one-time $2.99 unlock all
│   Gap: 32
│
├── QUICK SOUNDS SECTION (hPad)
│   Label: "QUICK PLAY" (label, textMuted)
│   Gap: 12
│   3-column grid (FlatList numColumns=3, scrollEnabled=false):
│   └── SoundCard × 9 (top 9 most popular sounds)
│       SoundCard (cardW, 80dp, borderRadius 16):
│       ├── Sound emoji (24sp, center)
│       ├── Sound name (bodyS, textPrimary, center, 2 lines max)
│       └── If actively playing: accent color border (2px) + green dot
│       Tap:
│       → If nothing playing: starts sound solo, transitions to State B
│       → If already playing: adds to current mix (goes to mixer screen)
│       → Haptic: ImpactFeedbackStyle.Light
│   Gap: 40
│
└── Bottom padding: 100 (tab bar clearance)
```

---

#### State B — NOW PLAYING (audio active)

When any audio starts, Home screen transitions to this view. The transition is
a crossfade animation (opacity 0→1 over 400ms via Reanimated).

```
SafeAreaView (bg: scene background color if scene, else colors.bg)
│
├── HEADER ROW (same as idle, but "Now Playing" replaces greeting)
│
├── HERO PLAY AREA (flex:1, centered)
│   This is the CENTERPIECE. Large, calm, beautiful.
│
│   ├── SCENE BACKGROUND (if scene active):
│   │   Full bleed animated background image, low opacity (0.25)
│   │   Slow pan animation (Ken Burns style, translateX 0→-20dp over 30s loop)
│
│   ├── WAVEFORM ANIMATION (center):
│   │   11 vertical bars, equal spacing, each animating height independently
│   │   Height range: 20dp–80dp, each bar has different animation speed
│   │   Color: accent (#6C8EFF dark / #4A6BDB light) with 70% opacity
│   │   When paused: bars shrink to 4dp height with gentle transition
│   │   Built with Reanimated withRepeat + withSequence
│
│   ├── SOUND NAME (below waveform):
│   │   If single sound: sound name (headingL, textPrimary, center)
│   │   If mix: "Custom Mix · X sounds" (headingL, textPrimary, center)
│   │   If scene: scene name (headingL, textPrimary, center)
│
│   └── BREATHING GUIDE (optional, toggle button in top-right corner):
│       When enabled: circular ring that expands (inhale 4s) + holds (1s)
│       + contracts (exhale 6s) in a loop
│       Ring stroke: accent color, animated via Reanimated
│       Center text: "Breathe in" / "Hold" / "Breathe out" (bodyM, textSecondary)
│       This feature does NOT exist in any competitor
│
├── TAP-ANYWHERE ZONE (entire middle section):
│   Invisible Pressable covering the waveform + name area
│   On single tap: toggle play/pause
│   Visual feedback: brief scale 0.97x of entire hero area (Reanimated spring)
│   Haptic: ImpactFeedbackStyle.Medium on play, Light on pause
│   Note: this solves the "tiny play button at 3am" complaint
│
├── CONTROL ROW (hPad, paddingBottom 24):
│   ├── [🔀 Shuffle next scene] — icon button (40dp tap area)
│   │   Tap: loads next scene randomly, 500ms crossfade, haptic light
│   ├── [⏱ Timer badge] — shows "45m" or "∞" in accent color pill
│   │   Tap: opens Timer bottom sheet inline (does not navigate away)
│   ├── [🎚 Mixer] — icon button
│   │   Tap: navigates to Mixer tab
│   └── [💾 Save Mix] — icon button
│       Tap: opens SaveMixSheet bottom sheet
│
└── MINI PLAYER (bottom, persistent even when scrolled):
    Height: 72dp, bg: bgCard, borderTop: border
    ├── Waveform mini (5 bars, 20dp, animated)
    ├── Sound/scene name (bodyM, textPrimary)
    ├── Play/Pause button (40dp, accent colored)
    └── Stop button (30dp, textMuted)
    This persists across ALL tabs — user can always pause from anywhere
```

---

### SCREEN 2 — Sound Library (app/(tabs)/sounds.tsx)

**Purpose:** Browse and play all 36 sounds. Filter by category. Search.

```
SafeAreaView
│
├── HEADER (hPad, paddingTop 16)
│   ├── "Sounds" (headingL, textPrimary)
│   └── Search icon → expands search bar (Reanimated width animation)
│   Gap: 16
│
├── SEARCH BAR (hPad, conditional)
│   When search icon is tapped:
│   ├── TextInput slides in from right (Reanimated translateX)
│   ├── Placeholder: "Rain, ocean, focus..."
│   ├── autoFocus: true — keyboard opens immediately
│   └── On text change: filter in useMemo (no debounce needed for 36 items)
│   Gap: 12
│
├── CATEGORY TABS (horizontal ScrollView, hPad):
│   Pills: [All] [Nature] [White Noise] [Fan & Mechanical] [Urban] [Focus]
│   Active pill: accent bg, white text, borderRadius 20
│   Inactive: border, textSecondary
│   On tap: animate active indicator (Reanimated layout animation)
│   Gap: 16
│
├── SOUND GRID (FlatList, numColumns=cols from responsive constant)
│   hPad, gap: 12
│   Each SoundCard (see component spec):
│   ├── Background: category-specific subtle gradient (very dark)
│   ├── Sound emoji (28sp, top-center)
│   ├── Sound name (bodyM, textPrimary, center)
│   ├── Category label (caption, textMuted)
│   └── State indicators:
│       ├── Idle: none
│       ├── Playing in current mix: pulsing green dot top-right + accent border
│       └── Playing solo: animated waveform replaces emoji
│
│   Tap SoundCard:
│   ├── If nothing playing:
│   │   → Loads and plays sound solo
│   │   → Navigates to Home tab (State B — Now Playing)
│   │   → Haptic: Medium
│   ├── If mix is playing and sound NOT in mix:
│   │   → Adds sound to mix at 60% volume
│   │   → Card animates: scale 1→1.05→1, border appears (Reanimated)
│   │   → Toast: "Added to mix" (auto-dismiss 2s)
│   │   → Haptic: Light
│   ├── If mix is playing and sound IS in mix:
│   │   → Removes sound from mix
│   │   → Card animates back to idle
│   │   → Haptic: Light
│
├── Empty state (when search returns 0 results):
│   Centered text: "No sounds match that" (bodyM, textSecondary)
│
└── Bottom: 100dp padding
```

---

### SCREEN 3 — Mix Builder (app/(tabs)/mixer.tsx)

**Purpose:** Fine-tune volumes of active sounds. Save and load mixes.

**Two sub-states: ACTIVE MIX and NO ACTIVE MIX**

#### State A — NO ACTIVE MIX

```
Centered empty state (full screen):
├── Large waveform icon (60dp, textMuted)
├── "No mix active" (headingM, textSecondary)
├── "Start playing sounds to mix them here" (bodyM, textMuted)
└── "Browse Sounds →" button → navigates to Sounds tab
```

#### State B — ACTIVE MIX

```
SafeAreaView
│
├── HEADER (hPad, paddingTop 16)
│   ├── "Mixer" (headingL, textPrimary)
│   └── Row of action buttons (right):
│       [+ Add Sound] → navigates to Sounds tab
│       [💾 Save] → opens SaveMixSheet
│   Gap: 16
│
├── MIX TOTAL VOLUME (hPad):
│   Label: "MASTER VOLUME" (label, textMuted)
│   Large horizontal slider (full width, height 40dp touch area)
│   Visual track: 4dp, borderRadius 2, accent fill
│   Custom thumb: 20dp circle, white, shadow
│   Current value shown right of slider: "80%" (bodyM, accent)
│   Gap: 28
│
├── ACTIVE SOUNDS LIST (ScrollView):
│   Each MixTrack (one per active sound):
│   ├── Card (bgCard, borderRadius 16, padding 16, margin hPad bottom 10)
│   │
│   ├── Top row:
│   │   ├── Left: Sound emoji (24) + Sound name (bodyM, textPrimary)
│   │   └── Right: Remove button (ti-x, 20dp, textMuted)
│   │       On tap: removes from mix with swipe-out animation (Reanimated)
│   │                if last sound: stops all audio, returns to State A
│   │
│   ├── Gap 12
│   │
│   ├── VOLUME SLIDER ROW:
│   │   ├── Volume icon: ti-volume-3 (dim) → ti-volume (loud), changes live
│   │   ├── Slider (flex:1, same style as master)
│   │   │   On slide: updates this sound's volume in real time
│   │   │             Audio.Sound.setVolumeAsync() called on slide end
│   │   │             NOT on every frame — only on gesture end (performance)
│   │   └── Percentage: "65%" (bodyS, textSecondary)
│   │
│   └── WAVEFORM MINI (5 animated bars under the slider):
│       Shows this specific sound's contribution to the mix
│       Height varies with volume * random factor
│
├── SAVED MIXES SECTION (hPad):
│   Label: "YOUR MIXES" (label, textMuted)
│   Gap: 8
│   FlatList horizontal:
│   └── SavedMixCard (120×80dp):
│       ├── Mix name (bodyS, textPrimary)
│       ├── Sound count: "3 sounds" (caption, textMuted)
│       └── Long press: shows Delete option
│       Tap: loads mix (replaces current mix after confirmation if active)
│   Empty state: "Save your first mix above"
│
└── Bottom: 100dp
```

---

### SCREEN 4 — Timer & Schedule (app/(tabs)/timer.tsx)

**Purpose:** Set sleep timer, wake-up fade, and bedtime routine.

```
SafeAreaView
│
├── HEADER (hPad, paddingTop 16)
│   "Timer" (headingL, textPrimary)
│   Gap: 24
│
├── SLEEP TIMER SECTION (hPad):
│   Label: "SLEEP TIMER" (label, textMuted)
│   Sub: "Audio stops after" (bodyS, textSecondary)
│   Gap: 16
│
│   CIRCULAR TIMER DIAL (center, 240dp diameter):
│   This is the hero element of this screen.
│   Visual: A circular track (gray) with colored arc that represents selected time
│   Center: Shows selected time large "45 min" (counter/2 size, textPrimary)
│           Below: "then fade out" (caption, textMuted)
│   Interaction: Rotate thumb around circle (pan gesture, Reanimated)
│                Snaps to: 5, 10, 15, 20, 25, 30, 45, 60, 90, 120 minutes
│                On snap: haptic selection feedback
│                Infinite (∞) position at 12 o'clock = no timer
│   Gap: 24
│
│   QUICK PRESET PILLS (center row):
│   [15m] [30m] [45m] [1h] [∞]
│   Tap: snaps dial to that value + haptic light
│   Active pill: accent bg, white text
│   Gap: 12
│
│   FADE OUT TOGGLE ROW (hPad):
│   └── Toggle: "Fade out over last 60 seconds"
│       Default: ON
│       When ON: audio smoothly fades from 100% → 0% over final 60s
│       When OFF: audio cuts abruptly at timer end
│   Gap: 32
│
├── DIVIDER (1px, border color, hPad)
│   Gap: 32
│
├── WAKE-UP FADE SECTION (hPad):
│   [THIS IS THE UNIQUE FEATURE — no competitor has this]
│   Label: "WAKE-UP FADE" (label, textMuted)
│   Sub: "Slowly raises volume before your alarm" (bodyS, textSecondary)
│   Gap: 16
│
│   TOGGLE: "Enable wake-up fade" (default OFF)
│   When toggled ON: the section below expands (Reanimated height animation)
│
│   WAKE TIME PICKER:
│   └── Platform time picker (expo-datetime-picker or Expo UI picker)
│       Shows selected time: "7:00 AM" (headingM, accent)
│   Gap: 16
│
│   FADE START PICKER:
│   └── "Start fading" + pills: [10 min before] [20 min] [30 min] [45 min]
│       Example: "Audio starts at 6% volume at 6:15 AM, reaches 100% at 7:00 AM"
│   Preview text: "Sounds begin at [time] and reach full volume by [wake time]"
│   (bodyS, textSecondary, italic)
│   Gap: 16
│
│   INFO CARD (bgCard, borderRadius 16, padding 14):
│   "⚠️ Your alarm still needs to be set in your Clock app.
│    This feature only controls Drift Sound volume — it does not ring an alarm."
│   (bodyS, amber color, amber background dim)
│   Gap: 32
│
├── DIVIDER
│   Gap: 32
│
├── ACTIVE TIMER STATUS (only shows when timer is running):
│   Card (bgCard, accent border 1.5px, padding 16):
│   ├── "Timer active" badge (green, top)
│   ├── "Stops in 38:42" — live countdown (headingM, accent)
│   │   Updated every second via setInterval (cleared on unmount)
│   └── [Cancel timer] button (ghost, red text)
│
└── Bottom: 100dp
```

---

### SCREEN 5 — Settings (app/settings.tsx)

**Purpose:** App preferences, purchase, about Gigasonet.

```
SafeAreaView (stack screen, back button in header)
│
├── HEADER (native back arrow via expo-router + "Settings" title)
│
├── SCROLL VIEW (hPad):
│
│   APPEARANCE SECTION:
│   ├── Theme: [Light] [Dark] [System] — segmented control
│   │   On tap: updates theme immediately, saves to preferencesStore
│   └── Reduce motion: toggle
│       When ON: disables all Reanimated animations (all values snap instead)
│
│   PLAYBACK SECTION:
│   ├── Default volume: slider 0–100%, default 70%
│   ├── Crossfade between sounds: toggle (default ON, 500ms crossfade)
│   ├── Fade out duration: [30s] [60s] [90s] pills (for sleep timer end)
│   └── Keep screen on while playing: toggle
│       When ON: calls expo-keep-awake keepAwakeAsync()
│       When OFF: deactivateKeepAwakeAsync()
│
│   NOTIFICATIONS SECTION:
│   ├── Show player in notification bar: toggle (default ON, required for
│   │   background audio foreground service — explains why it's recommended)
│   └── Timer reminder: toggle
│       When ON: sends local notification 5 min before timer ends
│
│   AUDIO QUALITY SECTION:
│   ├── Info text: "All sounds are bundled at 128kbps. No downloads needed."
│   └── "Re-initialize audio engine" — button (troubleshooting)
│       Tap: calls AudioEngine.reinitialize(), shows "Done" toast
│
│   PURCHASE SECTION:
│   ├── Current status: "Free plan" or "All unlocked ✓" (bodyM, green)
│   ├── [Unlock all scenes — $2.99] — gold button (if not purchased)
│   │   Tap: triggers in-app purchase flow via RevenueCat
│   │         On success: saves purchase to SecureStore, updates store
│   └── [Restore purchase] — text button
│       Tap: calls RevenueCat restorePurchases(), updates state
│
│   ABOUT SECTION (bgCard card):
│   ├── App icon (48dp, borderRadius 12) + "Drift Sound" (headingS)
│   ├── "Version 1.0.0" (caption, textMuted)
│   ├── "Made by Gigasonet" (bodyS, accent) → opens gigasonet.com
│   ├── "Privacy Policy" → in-app WebView
│   ├── "Terms of Use" → in-app WebView
│   ├── "Rate app" → opens Play Store listing
│   └── "Share app" → opens Share.share()
│
└── Bottom: 48dp
```

---

## 8. AUDIO ENGINE ARCHITECTURE

```typescript
// src/audio/AudioEngine.ts
// Manages up to 6 simultaneous Audio.Sound instances

class AudioEngine {
  private sounds: Map<string, Audio.Sound> = new Map()

  async loadSound(id: string, file: number) {
    // require('../assets/sounds/rain_light.mp3') — static require
    const { sound } = await Audio.Sound.createAsync(file, {
      isLooping: true,
      shouldPlay: false,
      volume: 0,
    })
    this.sounds.set(id, sound)
  }

  async playSound(id: string, volume: number) {
    const sound = this.sounds.get(id)
    if (!sound) return
    await sound.setVolumeAsync(0)
    await sound.playAsync()
    // Fade in over 500ms
    await this.fadeVolume(sound, 0, volume, 500)
  }

  async stopSound(id: string, fade = true) {
    const sound = this.sounds.get(id)
    if (!sound) return
    if (fade) await this.fadeVolume(sound, await this.getVolume(sound), 0, 500)
    await sound.stopAsync()
  }

  async setVolume(id: string, volume: number) {
    // Called on gesture END only — not on every frame
    await this.sounds.get(id)?.setVolumeAsync(volume)
  }

  private async fadeVolume(sound: Audio.Sound, from: number, to: number, ms: number) {
    const steps = 20
    const interval = ms / steps
    const delta = (to - from) / steps
    for (let i = 0; i <= steps; i++) {
      await sound.setVolumeAsync(from + delta * i)
      await new Promise(r => setTimeout(r, interval))
    }
  }
}

export const audioEngine = new AudioEngine()
```

**Android foreground service (prevents audio stopping on screen off):**

In `app.json`, the expo-av plugin config enables the foreground service.
The persistent notification shows:
- App icon (monochrome)
- "Drift Sound is playing"
- Play/Pause action button
- Stop action button

This is what solves the #1 competitor complaint ("stops when screen turns black").

---

## 9. ZUSTAND STORE

```typescript
// src/store/playerStore.ts
interface ActiveSound {
  id:     string
  name:   string
  volume: number
  file:   number
}

interface PlayerState {
  isPlaying:    boolean
  activeSounds: ActiveSound[]
  activeScene:  string | null
  masterVolume: number
  timerEndTime: number | null
  wakeTime:     string | null

  play:         (sounds: ActiveSound[]) => void
  pause:        () => void
  resume:       () => void
  stop:         () => void
  addSound:     (sound: ActiveSound) => void
  removeSound:  (id: string) => void
  setVolume:    (id: string, v: number) => void
  setMaster:    (v: number) => void
  setTimer:     (ms: number | null) => void
}
```

---

## 10. WAVEFORM ANIMATION COMPONENT

```typescript
// src/components/player/WaveformAnim.tsx
// 11 bars, each with independent height animation

const BAR_COUNT = 11
const BAR_SPEEDS = [1200, 900, 1500, 800, 1100, 700, 1300, 950, 1600, 850, 1000]

function WaveformAnim({ isPlaying }: { isPlaying: boolean }) {
  const heights = Array.from({ length: BAR_COUNT }, (_, i) => {
    const h = useSharedValue(8)
    useEffect(() => {
      if (isPlaying) {
        h.value = withRepeat(
          withSequence(
            withTiming(8 + Math.random() * 56, { duration: BAR_SPEEDS[i] / 2 }),
            withTiming(8, { duration: BAR_SPEEDS[i] / 2 }),
          ),
          -1,
          false
        )
      } else {
        h.value = withTiming(4, { duration: 400 })
      }
    }, [isPlaying])
    return h
  })

  return (
    <View style={styles.container}>
      {heights.map((h, i) => {
        const animStyle = useAnimatedStyle(() => ({
          height: h.value,
        }))
        return <Animated.View key={i} style={[styles.bar, animStyle]} />
      })}
    </View>
  )
}
```

---

## 11. SETUP COMMANDS — IN ORDER

```bash
# Step 1 — Create project
npx create-expo-app@latest Drift-Sound --template default@sdk-56

cd Drift-Sound

# Step 2 — Install all packages
npx expo install \
  expo-av \
  expo-task-manager \
  expo-background-task \
  expo-notifications \
  expo-haptics \
  expo-keep-awake \
  expo-secure-store \
  expo-font \
  expo-build-properties \
  react-native-reanimated \
  react-native-gesture-handler \
  react-native-google-mobile-ads \
  react-native-purchases \
  zustand \
  @expo-google-fonts/nunito \
  @expo-google-fonts/inter

# Step 3 — Run on Android device
npx expo run:android

# Step 4 — Production build
eas build --platform android --profile production
```

---

## 12. app.json CONFIGURATION

```json
{
  "expo": {
    "name": "Drift Sound",
    "slug": "driftsound",
    "version": "1.0.0",
    "orientation": "portrait",
    "userInterfaceStyle": "automatic",
    "icon": "./assets/icon.png",
    "scheme": "driftsound",
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#0C0C12"
    },
    "android": {
      "package": "com.gigasonet.driftsound",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#0C0C12"
      },
      "permissions": [
        "android.permission.FOREGROUND_SERVICE",
        "android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK",
        "android.permission.VIBRATE",
        "android.permission.RECEIVE_BOOT_COMPLETED",
        "android.permission.SCHEDULE_EXACT_ALARM"
      ]
    },
    "plugins": [
      "expo-router",
      "expo-font",
      ["expo-av", { "microphonePermission": false }],
      ["expo-notifications", {
        "icon": "./assets/notification-icon.png",
        "color": "#6C8EFF"
      }],
      ["expo-build-properties", {
        "android": {
          "compileSdkVersion": 35,
          "targetSdkVersion": 35,
          "minSdkVersion": 24
        }
      }]
    ]
  }
}
```

---

## 13. PLAY STORE ASO — COPY-PASTE READY

### App Title (30 chars)
```
Drift Sound: Sleep & White Noise
```
Count: 31 — trim to:
```
Drift Sound – Sleep White Noise
```
Count: 30 ✓

---

### Short Description (80 chars)
```
Sleep sounds, white noise & mixer. Stays on all night. No account needed. 🌙
```
Count: 76/80 ✓

---

### Long Description (~3,900 chars, paste full block)

```
🌙 FALL ASLEEP FASTER. STAY ASLEEP ALL NIGHT. 🌙

Drift Sound is the sleep sounds app that actually works — plays all night without stopping, sounds beautiful, and needs zero internet connection or account.

━━━━━━━━━━━━━━━━━━━━━━━━
😴 WHY Drift Sound?
━━━━━━━━━━━━━━━━━━━━━━━━

Most sleep apps stop playing when your screen turns off. Drift Sound runs as a background audio service — guaranteed all-night playback, no interruptions, no waking up at 3am to a silent room.

━━━━━━━━━━━━━━━━━━━━━━━━
🎵 36 HIGH-QUALITY SOUNDS
━━━━━━━━━━━━━━━━━━━━━━━━

▶ Nature — Rain, thunder, ocean waves, forest, river, waterfall
▶ White noise colors — White, pink, brown, blue, grey, violet noise
▶ Fan & mechanical — Slow fan, box fan, air conditioner
▶ Urban cozy — Coffee shop, train ride, airplane cabin, fireplace
▶ Focus & deep sleep — Delta waves, theta waves, tibetan bowls

All 36 sounds are bundled. No downloads. Works in airplane mode.

━━━━━━━━━━━━━━━━━━━━━━━━
🎨 SCENES — ONE TAP TO SLEEP
━━━━━━━━━━━━━━━━━━━━━━━━

Hand-crafted sound scenes for every mood:
▶ Rainy Cabin — rain + fireplace + distant thunder
▶ Ocean Dock — waves + gentle wind
▶ Forest Night — crickets + river + rustling trees
▶ Deep Focus — brown noise + delta waves
▶ Space Float — cosmic hum + violet noise
▶ Coffee Morning — café sounds + light rain

━━━━━━━━━━━━━━━━━━━━━━━━
🎚 CUSTOM SOUND MIXER
━━━━━━━━━━━━━━━━━━━━━━━━

Layer up to 6 sounds simultaneously. Adjust each volume independently. Save your perfect mix and load it with one tap. Create sounds like "rain + fan + distant thunder" tailored exactly to you.

━━━━━━━━━━━━━━━━━━━━━━━━
⏰ SMART TIMER + WAKE-UP FADE
━━━━━━━━━━━━━━━━━━━━━━━━

Set a sleep timer and sounds gently fade out — no abrupt cut. The unique Wake-Up Fade feature slowly raises volume before your alarm time, replacing a jarring alarm with a gentle audio sunrise.

━━━━━━━━━━━━━━━━━━━━━━━━
🫁 BREATHING GUIDE
━━━━━━━━━━━━━━━━━━━━━━━━

An optional breathing circle syncs to the audio — volume rises as you inhale, falls as you exhale. A calm 4-1-6 breath cycle that helps you fall asleep faster. No other sleep app has this.

━━━━━━━━━━━━━━━━━━━━━━━━
✅ BUILT FOR REAL SLEEP
━━━━━━━━━━━━━━━━━━━━━━━━

▶ Plays all night — never stops when screen turns off
▶ Tap anywhere to pause — no tiny buttons in the dark
▶ Dark & light mode — adapts to your preference
▶ Lock screen controls — pause without unlocking
▶ No account, no login, no internet needed
▶ No data collected — ever
▶ All 36 sounds free — no paywall on the library
▶ Works on phones and tablets

━━━━━━━━━━━━━━━━━━━━━━━━
📌 MADE BY GIGASONET
━━━━━━━━━━━━━━━━━━━━━━━━

Drift Sound is built by Gigasonet — made with care for people who actually need it to work. Download free and sleep better tonight.
```

**Category:** Health & Fitness
**Tags:** Sleep, White noise, Relaxation, Meditation, Focus

---

### Target Countries
1. USA — highest eCPM
2. UK
3. Canada
4. Australia
5. Germany

---

### Content Rating
- No violence, no user content, no sexual content
- Result: **Everyone** — maximum organic reach

---

### Pricing
- Free to download
- AdMob rewarded video: watch ad → unlock premium scene
- One-time in-app purchase: "Unlock all scenes" — $2.99
- No subscription — one-time is the correct model here based on review research

---

## 14. APP ICON & FEATURE GRAPHIC PROMPTS

### App Icon (1024×1024px)

**Midjourney / DALL-E 3 / Ideogram prompt:**
```
Minimalist Android app icon, 1024x1024 pixels. Deep dark background, almost
black (#0C0C12). Center: a soft glowing crescent moon shape, thin outline
style, in a warm deep blue-indigo (#6C8EFF) with a very faint inner glow
halo. Below the moon: three thin horizontal wavy lines representing sound
waves, spaced gently apart, same blue-indigo color at lower opacity.
Clean, calming, premium. No text. No gradients on the background itself.
The moon and waves should feel like they are softly lit from within.
Style: ultra-minimal, dark luxury, flat with subtle luminosity.
Works at 48px and 512px. --ar 1:1 --style raw --no text, letters, words
```

**Canva AI / Firefly alternative:**
```
Dark square Android app icon, background near-black. Soft glowing crescent
moon, thin line style, blue-purple color, gentle glow. Below it three
small wavy sound wave lines in same color at lower opacity. No text.
Minimal, premium, calm. Sleep app aesthetic.
```

---

### Feature Graphic (1024×500px)

**Midjourney / DALL-E 3 prompt:**
```
Google Play feature graphic, 1024x500 landscape. Dark background #0C0C12.
Left third: dark phone mockup showing a beautiful dark app UI — animated
waveform bars in blue-indigo, large sound name text below in white, circular
breathing ring animation in faint blue. Right two-thirds: large white serif
text "Drift Sound" on left of right section, below it "Sleep Sounds & White
Noise" in blue-indigo smaller text. Four feature badges below in a row:
"36 Sounds" "Live Mixer" "All Night Play" "No Account". Very subtle blue
stars/particles in background at low opacity. Premium, calm, dark aesthetic.
--ar 2:1 --style raw
```

---

## 15. SPLASH SCREEN

Dark background `#0C0C12`. Center: crescent moon SVG (same as app icon style)
draws itself with stroke animation (400ms) then fills gently (150ms).
Below: "Drift Sound" text fades + slides up (Nunito Bold 28sp, white).
Below: "sleep sounds" fades in (Inter Regular 13sp, blue-indigo).
Duration: 1.6 seconds total. Particle dots optional.
Use the SplashAnimation.tsx pattern from previous app documentation.

---

## 16. ABOUT / LEGAL — GIGASONET

```
Drift Sound v1.0.0
Made by Gigasonet

A Gigasonet application. Built for people who need their sleep sounds to
actually work — all night, every night.

Website: gigasonet.com
Support: support@gigasonet.com

© 2026 Gigasonet. All rights reserved.
```

**Privacy Policy key points:**
```
- Drift Sound does not collect any personal data
- No account, no email, no cloud sync — all data stays on device
- AdMob by Google serves ads — Google may use your advertising ID
  to show relevant ads. You can opt out in your device settings.
- RevenueCat processes your Play Store purchase ID to validate unlock
- No analytics SDK is included
- Contact: support@gigasonet.com
```

---

## 17. BUILD TIMELINE (7 days solo dev)

| Day | Tasks |
|---|---|
| Day 1 | Project setup, theme system, fonts, navigation, all screens empty shells |
| Day 2 | AudioEngine + MixPlayer + bundled sound assets, foreground service config |
| Day 3 | Home screen State A + State B, WaveformAnim, SceneCard, SoundCard |
| Day 4 | Sounds screen + category tabs + search + add-to-mix logic |
| Day 5 | Mixer screen + volume sliders + save/load mixes |
| Day 6 | Timer screen + circular dial + wake-up fade + BreathingGuide component |
| Day 7 | Settings, AdMob, RevenueCat purchase, splash screen, test on device, submit |

---

## 18. QUICK REFERENCE: SCREEN → FILE MAPPING

```
app/(tabs)/home.tsx     → Screen 1: Home / Now Playing
app/(tabs)/sounds.tsx   → Screen 2: Sound Library (36 sounds)
app/(tabs)/mixer.tsx    → Screen 3: Mix Builder
app/(tabs)/timer.tsx    → Screen 4: Timer & Wake Scheduler
app/settings.tsx        → Screen 5: Settings
```

---

1. Soundscape DNA (Shareable Mix Codes)
Serene introduces the idea of generating short, shareable strings like RAIN60-WIND30-FIRE10 that can be sent via SMS, social media, or QR codes. When clicked, it opens the app via a deep link and instantly recreates that exact mix.

Why it fits Drift Sound: You don't need a database, servers, or user accounts. Since Drift Sound uses expo-router, you can easily implement this by adding a dynamic route.

Implementation Hook:
Create a file at app/mix/[code].tsx. When a user hits this route, your code splits the string, validates the sound IDs against your 36 free sounds, updates your Zustand playerStore, and redirects the user to the player view.

TypeScript
// app/mix/[code].tsx
const { code } = useLocalSearchParams<{ code: string }>();
// code example: "sound1_60-sound4_40"

useEffect(() => {
  if (code) {
    const layers = code.split('-').map(item => {
      const [soundId, volume] = item.split('_');
      return { soundId, volume: parseInt(volume) / 100 };
    });
    // Call your Zustand store action to override the current active mix
    loadSharedMix(layers);
    router.replace('/(tabs)/home');
  }
}, [code]);
2. OLED "Night Shield" Mode (True Black Screen)
Serene suggests a dedicated "Night Shield" view: a pure #000000 screen with a giant, heavily dimmed clock that activates expo-keep-awake.

Why it fits Drift Sound: Sleep app users frequently place their phones on a nightstand. A standard dark mode theme (usually dark grays or deep blues) still emits light and drains battery. A true #000000 pitch-black screen turns off pixels entirely on OLED/AMOLED displays, keeping the phone cool and dark.

Implementation Hook:
Add a button on the active player layout that triggers a full-screen modal. Use expo-keep-awake inside this modal's lifecycle:

TypeScript
import { useKeepAwake } from 'expo-keep-awake';

export default function NightShieldScreen() {
  useKeepAwake(); // Keeps screen on only while this component is mounted
  return (
    <View style={{ flex: 1, backgroundColor: '#000000', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: '#333', fontSize: 64, fontWeight: 'bold' }}>11:45</Text>
      {/* Ultra dim controls */}
    </View>
  );
}
3. "Pet Mode" Preset Scene
Serene notes a highly underserved niche: pet owners looking to soothe dogs or cats during thunderstorms or fireworks.

Why it fits Drift Sound: It costs you exactly zero extra lines of code. Drift Sound already features pre-configured "Scenes" or mixes. By simply adding a default preset titled "Thunderbuddy" or "Calm Pet"—consisting of a heavy brown noise base (which masks external sudden thuds) mixed with soft rain—you instantly gain a unique marketing angle for the Play Store description.

4. Smart Exponential Fade-Out (Timer Feature)
Instead of a simple linear volume drop or an abrupt audio cut when the sleep timer ends, Serene highlights a "Smart Fade-out."

Why it fits Drift Sound: Human hearing is logarithmic, not linear. If a mix goes from 100% volume to 0% linearly over 5 minutes, the brain often notices the drop midway through and wakes up. Implementing an exponential volume decay curves the sound down beautifully, ensuring the silence isn't jarring.

Implementation Hook:
In your singleton AudioEngine master fade function, use a timing interval that decreases the volume exponentially over the last 3 to 5 minutes of the countdown.

Summary of What to Add to Drift Sound:
If you merge these into your current plan, your app's core architecture doesn't change, but your feature list gets a powerful upgrade:

Drift Sound Architecture (Zustand, Foreground Services, Low-power audio config).

+ Dynamic Deep Links (app/mix/[code].tsx) for viral, backend-free sharing.

+ True OLED Night Shield screen with temporary keep-awake logic.

+ "Pet Relief" Preset added to your default JSON scene array.

*Drift Sound — Full Build Documentation*
*Version 1.0 · June 2026*
*By Gigasonet · support@gigasonet.com*
*Built with Expo SDK 56 · React Native 0.85 · TypeScript*
