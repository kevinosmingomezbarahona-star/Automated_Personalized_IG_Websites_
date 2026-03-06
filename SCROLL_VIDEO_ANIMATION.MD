# Scroll-Controlled Video Animation Implementation Plan

This document outlines the approach for building an interactive, scroll-scrubbing video animation for the landing page.

## 1. The Technique
We will create a new React component (e.g., `<ScrollVideoCanvas />`) that utilizes an HTML5 `<canvas>` element. Instead of an actual `<video>` file, the canvas will rapidly render a sequence of images (frames). This frame-swapping technique provides high-performance tracking linked directly to scroll position, eliminating the DOM flickering and browser playback-rate constraints associated with scrubbing native video elements.

## 2. Scroll Tracking
We will leverage `framer-motion` for smooth scroll tracking:
- **`useScroll`**: To track the scroll progress (`scrollYProgress`) within the component's tall container.
- **`useTransform`**: To map the `scrollYProgress` (from `0` to `1`) to the corresponding image index in our sequence (e.g., `0` to `Total Frames - 1`).
- The parent container will be given a significant height (e.g., `h-[300vh]`) to provide enough scrolling distance to scrub smoothly through the animation sequence over time.

## 3. Layout Strategy
- **Sticky Canvas**: The `<canvas>` element will be wrapped in a sticky container (`position: sticky`, `top-0`, `h-screen`, `w-full`). This structure pins the canvas exactly to the viewport while the user scrolls through the total height of the parent container.
- **Overlaying Content**: Text sections and other informational elements will be placed inside the tall container but absolutely positioned or layered with z-index to sit on top of the sticky canvas. We will use `framer-motion` to fade these text blocks in and out based on the same `scrollYProgress` variable to sync them with specific frames.
- **Existing UI Preservation**: Careful z-indexing and layout composition will ensure that current critical UI elements (Spline robot, Vapi buttons, Marquee, and Sticky Sidebar) remain fully functional and visible where appropriate.

## 4. Performance & Preloading
To ensure maximum performance without lag or "missing frames" during fast scrolling:
- An asset preloading mechanism will be implemented within a `useEffect` on component mount.
- It will iterate through the array of image URLs, instantiating a `new Image()` for each, and assigning its `src` to aggressively force the browser to download and cache them into memory.
- The canvas drawing logic (`ctx.drawImage`) will only pull from these preloaded Image objects. 
- A loading state will be tracked to ensure the user sees a seamless experience once a sufficient number of frames are ready in memory.

## 5. MVP & Placeholder Assets
Since the final image sequence assets are not yet available, the initial MVP component will use a fast placeholder methodology to prove the logic without external dependencies:
- We will dynamically generate a visual sequence directly on the canvas (e.g., shifting grid of colors, scaling shapes, or cycling hexadecimal background colors) driven by the mapped frame index.
- Alternatively, we will use a small array of generic placeholder URLs (e.g. from an image placeholder service) to verify the frame mapping logic.
- This phase focuses purely on perfecting the layout constraints, sticky behavior, frame-mapping math, preloading skeleton, and text fade-ins.

---
## Next Steps
Once you approve this plan, I will:
1. Create the new component.
2. Implement the `framer-motion` mapped logic and canvas drawing mechanism with MVP placeholders.
3. Integrate it seamlessly into `LandingPage.tsx` while preserving the existing UI components.
