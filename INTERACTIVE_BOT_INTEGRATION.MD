# Interactive 3D Robot Assistant Integration

## Project Stack
- Vite + React + TypeScript + Tailwind (no Next.js/shadcn CLI required)

## What Was Done

### New Files — `src/components/ui/`
| File | Purpose |
|---|---|
| `splite.tsx` | Lazy-loads `@splinetool/react-spline` with Suspense fallback |
| `spotlight.tsx` | Aceternity SVG spotlight with `animate-spotlight` CSS animation |
| `card.tsx` | shadcn-style composable Card components using `cn()` |
| `SplineSceneBasic.tsx` | Demo: Card + Spotlight + SplineScene (robot Spline URL) |

### Modified Files
| File | Change |
|---|---|
| `tailwind.config.js` | Added `spotlight` keyframe + `animate-spotlight` animation |
| `src/pages/LandingPage.tsx` | Imported `SplineSceneBasic`; inserted robot card below Vapi CTA |

### NPM Packages Installed
```
@splinetool/react-spline
@splinetool/runtime
```

## Placement
The `<SplineSceneBasic />` renders inside the existing hero stagger container, directly after the Vapi CTA card block, using the same `fadeUp` animation variant (delay: 0.5).

## Checklist
- [x] Create UI component files
- [x] Install npm deps
- [x] Update tailwind.config.js with spotlight keyframe
- [x] Insert SplineSceneBasic into LandingPage.tsx below Vapi buttons
- [x] Fix pre-existing framer-motion v12 TypeScript ease-type error
- [x] Typecheck verification
