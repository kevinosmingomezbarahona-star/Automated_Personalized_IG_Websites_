import { useState, useEffect } from 'react';

/**
 * Returns `true` after the specified delay (default 2500ms) OR immediately
 * upon the first user scroll event — whichever comes first.
 *
 * Design intent: allows a headless browser (e.g. Microlink) to capture a
 * clean, lightweight screenshot of the Hero section before heavy assets
 * (Spline 3D scene, ScrollVideoCanvas, Marquee gallery) are rendered or
 * their network requests are initiated.
 */
export function useDelayedReveal(delayMs = 2500): boolean {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        let revealed = false;

        const reveal = () => {
            if (revealed) return;
            revealed = true;
            setReady(true);
            clearTimeout(timer);
            window.removeEventListener('scroll', reveal);
        };

        const onLoad = () => {
            // Listen for first scroll — passive for perf
            window.addEventListener('scroll', reveal, { passive: true });
            // Fallback: fire after delayMs regardless of scroll
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return ready;
}
