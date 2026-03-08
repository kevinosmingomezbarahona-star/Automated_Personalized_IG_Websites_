# IMPLEMENTATION_PLAN_SPEED.MD

## Problem Context

The page runs smoothly on phones but is heavy and slow on desktop Chrome/Edge, primarily because of the Spline 3D robot section. Three progressive phases of fixes have been applied.

---

## Phase 1 — CSS / Canvas Hardware Acceleration ✅

| Change | File |
|---|---|
| Cap canvas DPR to 1.5 | `ScrollVideoCanvas.tsx` |
| Lower imageSmoothingQuality to 'medium' | `ScrollVideoCanvas.tsx` |
| `willChange` + `translateZ(0)` on canvas | `ScrollVideoCanvas.tsx` |
| Hardware acceleration on hero blur glows | `LandingPage.tsx` |

---

## Phase 2 — Scroll & Load Performance ✅

| Change | File |
|---|---|
| RAF dirty-flag loop — one draw per browser paint frame | `ScrollVideoCanvas.tsx` |
| Progressive 30-frame batch loading (instead of 147 concurrent) | `ScrollVideoCanvas.tsx` |
| IntersectionObserver lazy-mount for Spline | `splite.tsx` |
| Marquee repeat reduced from 4 to 2 | `LandingPage.tsx` |

---

## Phase 3 — Thread Isolation (Root Cause Fix) ✅

### Root Cause
`@splinetool/react-spline` runs a full WebGL render loop on the **main JavaScript thread**, directly sharing the 16ms frame budget with scroll events, framer-motion, and canvas drawing. This is why desktop feels slow while mobile (lower resolution = smaller canvas = less GPU work) feels fine.

### Fixes Applied

| Change | File | Impact |
|---|---|---|
| Replace `@splinetool/react-spline` with native `<iframe>` embed | `splite.tsx` | **Critical** — Spline WebGL now runs in an isolated browser rendering context (separate OS process via Chromium Site Isolation), zero main-thread impact |
| Remove framer-motion wrappers around iframe/canvas sections | `LandingPage.tsx` | Prevents duplicate compositing layers that caused stalls |
| Add `content-visibility: auto` to below-fold sections | `LandingPage.tsx` | Browser skips painting off-screen sections entirely |
| `manualChunks` in vite build (React / Framer / Supabase) | `vite.config.ts` | Separate cached bundles, faster JS parse on first visit |

> [!IMPORTANT]
> Nothing has been removed from the UI. The 3D robot still appears, the scroll animation still plays, the voice interaction still works, and the marquee still scrolls. All optimizations are purely rendering pipeline improvements.

---

## Verification Steps

1. Open `http://localhost:5173/{your-slug}` in desktop Chrome
2. **Scroll test** — scroll fast up and down past the canvas section. Should be near-60fps.
3. **Robot test** — when you scroll to the robot card, it should appear (after its brief skeleton placeholder) and be fully interactive. Clicking it should start the voice call.
4. **DevTools check (optional)** — Performance tab → Record → scroll → confirm no red "Long Task" bars
