# Implementation Plan — Performance UX Refactor V1

## Overview

This plan details a CRO-focused refactor of `LandingPage.tsx`. The goal is to:
1. Dramatically improve initial page load speed for the Microlink headless-browser screenshot API.
2. Update hero copy to be fully dynamic and high-conversion.
3. Add intuitive scroll cues to direct the user toward the AI demo.
4. Insert a "15-Second Offer" mechanism text block below the hero.
5. Display a premium "Operational Intelligence Brief" card powered by the `business_profile` field already present in the Supabase `Prospect` interface.

---

## Directive 1 — Headless Browser Optimization (Lazy Loading)

**The Problem:** Microlink's headless browser has a strict timeout. Three heavy components are blocking the initial paint: `SplineSceneBasic` (3D Spline scene), `ScrollVideoCanvas`, and the `Marquee` IG gallery (loads N remote images).

**The Solution:** Introduce a `useDelayedReveal` hook that returns a boolean that becomes `true` either:
- 2.5 seconds after the initial DOM `load` event fires, OR
- Immediately upon the first user `scroll` event — whichever comes first.

### Files Affected

#### [MODIFY] [LandingPage.tsx](file:///d:/CelestIA%20Projects/Automated_Personalized_IG_Websites_/src/pages/LandingPage.tsx)
- Import and call `useDelayedReveal()` at the top of the component.
- Gate `SplineSceneBasic`, `ScrollVideoCanvas`, and the `Marquee` section behind `heavyAssetsReady`.
- While `!heavyAssetsReady`, render lightweight skeleton/placeholder divs that replicate the height of each deferred block so layout does not shift.

#### [NEW] [useDelayedReveal.ts](file:///d:/CelestIA%20Projects/Automated_Personalized_IG_Websites_/src/hooks/useDelayedReveal.ts)
```ts
// Returns true after 2.5 s OR first scroll event, whichever comes first.
import { useState, useEffect } from 'react';

export function useDelayedReveal(delayMs = 2500): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const reveal = () => {
      if (!ready) {
        setReady(true);
        clearTimeout(timer);
        window.removeEventListener('scroll', reveal);
      }
    };

    const onLoad = () => {
      window.addEventListener('scroll', reveal, { passive: true });
      timer = setTimeout(reveal, delayMs);
    };

    if (document.readyState === 'complete') {
      onLoad();
    } else {
      window.addEventListener('load', onLoad, { once: true });
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', reveal);
      window.removeEventListener('load', onLoad);
    };
  }, []);

  return ready;
}
```

**Hero Text & Background (no changes needed):** The Nav, Hero text, profile picture, and globe glows are already pure CSS/HTML — they have zero render-blocking behavior and will load in well under 500ms once the heavy assets are deferred.

---

## Directive 2 — Hero Copy Update

**Current state:** The eyebrow label reads "Private AI Demo — For X" and the h1 reads "Hey X, I've built a custom AI Receptionist…".

**Change:** Restructure into a two-part block: a proper `<h1>` main header and a `<p>` subheader with the exact approved copy, both pulling the name from `companyName` (which already uses `company_name` → `full_name` fallback).

### Files Affected

#### [MODIFY] [LandingPage.tsx](file:///d:/CelestIA%20Projects/Automated_Personalized_IG_Websites_/src/pages/LandingPage.tsx)
- **Remove** the eyebrow `<motion.p>` that currently holds "Private AI Demo — For X".
- **Replace** the `<motion.h1>` with the exact approved main header: `"Private AI Demo — For [companyName]"`.
- **Add** a new `<motion.p>` subheader with the exact approved copy referencing `companyName`.

---

## Directive 3 — Animated Scroll Cue

**Current state:** No scroll cue exists. The user may not know to scroll down.

**Change:** Add an absolutely-positioned element at the very _bottom_ of the hero section (z-10, centered) that renders a bouncing chevron-down arrow with the label "Scroll to Test AI Concierge". It should:
- Use a CSS `@keyframes bounce` (tailwind's built-in `animate-bounce`) applied to a chevron icon.
- Auto-hide once `heavyAssetsReady` is true (i.e., the user has scrolled) using a fade-out transition.

### Files Affected

#### [MODIFY] [LandingPage.tsx](file:///d:/CelestIA%20Projects/Automated_Personalized_IG_Websites_/src/pages/LandingPage.tsx)
- Inside `<section id="hero">`, add a `position: absolute; bottom: 2rem; left: 50%` div containing:
  - Small uppercase tracking text: `"Scroll to Test AI Concierge"`
  - A `ChevronDown` icon (already available via `lucide-react`) with `animate-bounce`
  - Framer-motion `AnimatePresence` + `exit={{ opacity: 0 }}` to fade it out after scroll.

---

## Directive 4 — "15-Second Offer" Text Block

**Placement:** A new `<section>` inserted in `LandingPage.tsx` **directly after** `</section>` (end of the hero) and **before** the `#scroll-video-canvas` section.

**Design:** Clean, high-status, slightly indented text block using the existing amber accent system. No card border — let it breathe as a pure typographic element with an amber left-border accent rule.

**Exact Copy:**
> "We help elite real estate teams capture high-intent buyers without losing deals to slow response times. We do this through a zero-latency automated qualification layer, and it works because we completely remove human speed and manual follow-ups as a failure point. The next step is calling the demo below to test the latency for yourself."

### Files Affected

#### [MODIFY] [LandingPage.tsx](file:///d:/CelestIA%20Projects/Automated_Personalized_IG_Websites_/src/pages/LandingPage.tsx)
- Add `<section id="offer-mechanism">` with `max-w-3xl mx-auto`, `py-20 px-6`, `border-l-2 border-amber-500/60`, and the exact copy rendered in `text-slate-300 text-lg leading-relaxed`.
- Animate in with `whileInView` + `fadeUp` reusing existing animation variants.

---

## Directive 5 — "Operational Intelligence Brief" Card

**Data Source:** `prospect.business_profile` — already present in the `Prospect` interface as a required `string` field.

**Placement:** A new `<section>` inserted **directly after** the 15-Second Offer block, **directly before** the 3D bot widget (`SplineSceneBasic`).

**Design:** A premium glassmorphic card that looks like a private intelligence dossier:
- `bg-white/[0.03] backdrop-blur-md border border-amber-500/20 rounded-2xl p-8`
- Top label: small amber caps `"OPERATIONAL INTELLIGENCE BRIEF"` with a pulsing dot to signal "live data."
- A `|` separator line.
- The `business_profile` text rendered below in `text-slate-300 text-base leading-relaxed` with preserved line breaks using `whitespace-pre-wrap`.
- Bottom right: a subtle `"Prepared for [companyName]"` watermark in `text-amber-500/40 text-xs`.

### Files Affected

#### [MODIFY] [LandingPage.tsx](file:///d:/CelestIA%20Projects/Automated_Personalized_IG_Websites_/src/pages/LandingPage.tsx)
- Add the `OperationalBrief` JSX block between the Offer section and the SplineSceneBasic.
- Gate it: only render if `prospect.business_profile` is a non-empty string.

---

## Revised Page Layout (Top → Bottom)

```
[Nav]
[Hero] ← loads instantly (pure CSS/text)
  → Profile Picture
  → Main Header: "Private AI Demo — For [Name]"
  → Subheader (approved copy)
  → Vapi CTA Buttons
  → Bouncing Scroll Cue arrow (fades on scroll)
[15-Second Offer Block]          ← NEW (Directive 4)
[Operational Intelligence Brief] ← NEW (Directive 5)
[3D Bot (SplineSceneBasic)]      ← LAZY (appears after 2.5s/scroll)
[ScrollVideoCanvas]              ← LAZY (appears after 2.5s/scroll)
[Marquee IG Gallery]             ← LAZY (appears after 2.5s/scroll)
[Footer]
[VapiFAB]
```

---

## Files Summary

| File | Action | Reason |
|------|--------|--------|
| `src/hooks/useDelayedReveal.ts` | **NEW** | 2.5s / scroll reveal hook |
| `src/pages/LandingPage.tsx` | **MODIFY** | All 5 directives |

> No other files need modification. All additions live in `LandingPage.tsx` and the new hook.

---

## Verification Plan

### Automated — TypeScript Build Check
```powershell
cd "d:\CelestIA Projects\Automated_Personalized_IG_Websites_"
npx tsc --noEmit 2>&1
```
✅ Expected: zero type errors.

### Manual Browser Verification (Dev Server — already running on `npm run dev`)

1. **Load Speed / Headless Optimization**
   - Open the dev server URL (e.g., `http://localhost:5173/your-slug`).
   - Open DevTools → Network tab → throttle to "Slow 3G".
   - Reload. Confirm the hero text and nav appear **immediately** (sub-500ms).
   - Confirm that the Spline 3D card, ScrollVideoCanvas, and Marquee are **not rendered** in the DOM for the first 2–3 seconds.
   - After 2.5 seconds (or scroll), confirm all three lazy sections appear with a fade-in.

2. **Hero Copy**
   - Confirm `<h1>` reads "Private AI Demo — For [Name]" with the prospect's company/full name.
   - Confirm the subheader paragraph shows the exact approved copy with `[Name]` replaced dynamically.

3. **Scroll Cue**
   - On fresh load, confirm the bouncing arrow + "Scroll to Test AI Concierge" text is visible at the bottom of the hero viewport.
   - Scroll down. Confirm the arrow fades out smoothly.

4. **15-Second Offer Block**
   - Scroll past the hero. Confirm the offer text block appears with the amber left border and the exact approved copy.

5. **Operational Intelligence Brief Card**
   - Confirm the card appears below the Offer block and above the 3D bot.
   - Confirm `business_profile` text is correctly rendered inside the card.
   - Confirm the pulsing amber dot and "Prepared for [Name]" watermark are visible.
   - If `business_profile` is empty/null for a test prospect, confirm the card is **not rendered** (conditional rendering).
