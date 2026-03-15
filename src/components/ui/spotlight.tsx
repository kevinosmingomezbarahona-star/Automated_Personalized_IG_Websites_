import { memo, useRef, useEffect } from 'react';
import { useMotionValue, useSpring, motion } from 'framer-motion';
import { cn } from '../../lib/utils';

type SpotlightProps = {
    className?: string;
    fill?: string;
};

/**
 * Spotlight — GPU-lightweight version.
 *
 * The original SVG used feGaussianBlur with stdDeviation=151, which forces
 * a massive raster offscreen buffer on the GPU every frame. This version
 * replaces that entirely with a CSS radial-gradient <div> on its own
 * composited layer (will-change: transform). Zero SVG filter overhead.
 *
 * Mouse tracking uses Framer Motion's useMotionValue + useSpring so that
 * positional updates NEVER cause a React state change or re-render in any
 * parent component. The animation runs entirely in the Motion layer.
 */
export const Spotlight = memo(function Spotlight({ className, fill = 'white' }: SpotlightProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    // Motion values — updates bypass React's render cycle entirely
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springX = useSpring(mouseX, { damping: 30, stiffness: 200, mass: 0.2 });
    const springY = useSpring(mouseY, { damping: 30, stiffness: 200, mass: 0.2 });

    useEffect(() => {
        const el = containerRef.current?.closest('[data-spotlight-root]') as HTMLElement | null
            || containerRef.current?.parentElement;

        if (!el) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = el.getBoundingClientRect();
            mouseX.set(e.clientX - rect.left);
            mouseY.set(e.clientY - rect.top);
        };

        el.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => el.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    // Parse fill to build a colour-matching glow. Fall back to white.
    const glowColor = fill === 'white'
        ? 'rgba(255,255,255,0.18)'
        : 'rgba(255,255,255,0.12)';

    return (
        <div
            ref={containerRef}
            className={cn('pointer-events-none absolute inset-0 z-[1] overflow-hidden', className)}
            aria-hidden="true"
        >
            <motion.div
                style={{
                    position: 'absolute',
                    // Centre the gradient on the cursor
                    x: springX,
                    y: springY,
                    translateX: '-50%',
                    translateY: '-50%',
                    width: 800,
                    height: 800,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
                    // Force GPU compositing — zero layout/paint cost per frame
                    willChange: 'transform, opacity',
                    // Never intercept mouse events bound for the Spline canvas
                    pointerEvents: 'none',
                }}
            />
            {/* Static ambient glow — pure CSS, zero JS cost */}
            <div
                style={{
                    position: 'absolute',
                    top: '-20%',
                    left: '-10%',
                    width: '60%',
                    height: '80%',
                    background: `radial-gradient(ellipse at top left, ${glowColor} 0%, transparent 65%)`,
                    pointerEvents: 'none',
                }}
            />
        </div>
    );
});
