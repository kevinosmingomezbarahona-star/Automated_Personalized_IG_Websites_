# Implementation Plan — Refactor V2

## Overview
This plan details a surgical cleanup and refactor of `LandingPage.tsx`, `SplineSceneBasic.tsx`, and `ScrollVideoCanvas.tsx` to unify the hero section, fix broken data mappings and image parsing, and remove boilerplate text, all while preserving our headless browser performance optimizations.

---

## Directives

### Directive 1 — Unified, High-Impact Hero Copy
**Problem:** The hero section text is fragmented and uses placeholder/generic structures.
**Solution:** Delete existing `<h1>` and sub-paragraph blocks. Replace with one unified, high-status block.
- **File: `src/pages/LandingPage.tsx`**
  - Delete `motion.h1` ("Private AI Demo...") and `motion.p` ("Hey [Name]...").
  - Add new massive bold `motion.h1` (e.g., `text-4xl sm:text-6xl lg:text-7xl font-bold uppercase tracking-tight`): `"HEY {companyName}. I HAVE BUILT AN AI SALES AGENT THAT HELPS ELITE REAL ESTATE TEAMS LIKE YOURS 24/7."`
  - Add new sleek `<p>` subheader (e.g., `text-slate-300 text-lg sm:text-x1 leading-relaxed`): `"It will capture high-intent buyers without losing deals to slow response times. We do this through a zero-latency automated qualification layer that seamlessly syncs with your CRM, completely removing human speed and manual follow-ups as a failure point. The next step is calling the demo below to test the latency for yourself."`
  - Re-order components to ensure `<VapiCTA>` is placed **directly beneath** this new sub-paragraph.

### Directive 2 — Fix Supabase Data Mapping for the Intelligence Brief
**Problem:** The Intelligence Brief card pulls the `business_profile` column.
**Solution:** Change mapping to fetch `business_summary`.
- **File: `src/pages/LandingPage.tsx`**
  - Locate `<section id="operational-brief">`.
  - Update the conditional render from `prospect.business_profile?.trim()` to `prospect.business_summary?.trim()`.
  - Update the mapped value inside the card to `{prospect.business_summary}`.

### Directive 3 — Wire Up the 3D Bot Button
**Problem:** The interactive button down below/inside the 3D Spline interactive robot widget must actively start the AI call.
**Solution:** Provide the `startCall` function directly to the bot widget.
- **File: `src/components/ui/SplineSceneBasic.tsx`**
  - Desctructure `startCall` from `useVapi({ publicKey, assistantId })`.
  - Pass `onToggle={startCall}` instead of `onToggle={toggleCall}` to `<AIVoiceInput>`.
  - Add `onClick={startCall}` to the `<div className="w-full h-full relative z-10 cursor-pointer">` wrapping the `<SplineScene>` so the 3D robot itself actively starts the call if clicked.

### Directive 4 — Purge Boilerplate Placeholder Text
**Problem:** The `ScrollVideoCanvas` contains boilerplate text ("Seamless Scrubbing...", "Maximum Performance...").
**Solution:** Remove all dummy text elements.
- **File: `src/components/ui/ScrollVideoCanvas.tsx`**
  - Remove all inner `<p>` and `<h2>` elements inside the three `<motion.div>` overlays.
  - The `motion.div` containers can be kept empty just to preserve any structure, or removed entirely if they solely held text, enabling the video canvas visual elements to "shine without dummy text". 

### Directive 5 — Fix Black Squares in IG Image Gallery
**Problem:** The `post_images` logic assumes strings, but Supabase might be passing JSON stringified arrays of objects (e.g., `{ image_url: string; ... }`).
**Solution:** Robust parsing logic to extract actual URL paths.
- **File: `src/pages/LandingPage.tsx`**
  - Update mapping logic for `imagesArray`:
    ```tsx
    const raw: any[] = typeof prospect.post_images === 'string' 
      ? JSON.parse(prospect.post_images)
      : prospect.post_images || [];
    imagesArray = raw.map((item: any) => {
      if (typeof item === 'string') return cleanUrl(item);
      if (item && item.image_url) return cleanUrl(item.image_url);
      return '';
    }).filter(Boolean);
    ```
  - Pre-existing `<img src={url} className="w-full h-full object-cover ...">` tags will correctly display the posts.

### Directive 6 — Retain Headless Browser Optimization
**Problem:** Changes might break the Microlink snapshot timeout.
**Solution:** Preserve gating logic unchanged.
- Ensure `useDelayedReveal(2500)` remains imported and active at the top of `LandingPage.tsx`.
- Ensure `heavyAssetsReady` correctly gates `<SplineSceneBasic>`, `<ScrollVideoCanvas>`, and `<Marquee>` just as it did in V1.

---

## Verification Plan

### Automated Checks
1. Run `npx tsc --noEmit` to ensure no Typescript errors after mapping type changes.

### Manual Verification
1. Open the page locally (e.g., `http://localhost:5173`).
2. **Hero Copy**: Verify the unified H1 and sub-paragraph render correctly and are centered with `VapiCTA` directly beneath.
3. **Data Mapping**: Validate that `#operational-brief` renders content from `business_summary`, not `business_profile`.
4. **3D Bot**: Click the 3D model and the Voice Input widget. Both must trigger the Vapi connection state immediately (the main "Test in Browser" button will sync to "Connecting...").
5. **IG Images**: Scroll down to the gallery; verify parsed URLs render valid images, not black squares.
6. **Headless SEO / Lazy Load**: Confirm heavy assets wait 2.5s to appear, satisfying Directive 6.
