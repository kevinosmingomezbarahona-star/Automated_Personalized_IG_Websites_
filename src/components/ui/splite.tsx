import { Suspense, lazy, memo, useState, useRef, useEffect, useCallback } from 'react'

const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
    scene: string
    className?: string
}

/**
 * SplineScene — Phase 4: Spline runtime loop control.
 *
 * The WebGL render loop runs at 60fps on the main JS thread. To make the
 * page smooth on desktop we must actually STOP the loop while the user
 * scrolls, then RESUME it when scrolling ends.
 *
 * The @splinetool/react-spline component exposes an `onLoad` callback that
 * returns the Spline Application runtime. We store this ref and call:
 *   app.stop()  — completely pauses WebGL draw calls (0 main-thread usage)
 *   app.play()  — resumes rendering
 *
 * Additionally:
 * - The scene only mounts when it enters the viewport (IntersectionObserver).
 * - On load, the internal renderer pixel ratio is capped to 1.2 to prevent
 *   Retina/4K from rendering a massive buffer unnecessarily.
 * - CSS `contain: strict` + `will-change: transform` keep it isolated on
 *   its own GPU layer so the rest of the page doesn't repaint around it.
 */
export const SplineScene = memo(function SplineScene({ scene, className }: SplineSceneProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [shouldMount, setShouldMount] = useState(false)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const splineAppRef = useRef<any>(null)
    const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const isPlayingRef = useRef(true)

    // Called by Spline when the scene finishes loading
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleLoad = useCallback((splineApp: any) => {
        splineAppRef.current = splineApp

        // Aggressively cap internal render resolution — Spline defaults to devicePixelRatio
        try {
            if (splineApp.renderer) {
                splineApp.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.2))
            }
        } catch {
            // Silently ignore — renderer API may vary between Spline versions
        }
    }, [])

    const pauseLoop = useCallback(() => {
        if (splineAppRef.current && isPlayingRef.current) {
            try {
                splineAppRef.current.stop()
                isPlayingRef.current = false
            } catch { /* ignore */ }
        }
    }, [])

    const resumeLoop = useCallback(() => {
        if (splineAppRef.current && !isPlayingRef.current) {
            try {
                splineAppRef.current.play()
                isPlayingRef.current = true
            } catch { /* ignore */ }
        }
    }, [])

    const handleScroll = useCallback(() => {
        // Pause the WebGL loop immediately when scroll starts
        pauseLoop()
        // Resume 200ms after scrolling stops
        if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current)
        scrollTimerRef.current = setTimeout(resumeLoop, 200)
    }, [pauseLoop, resumeLoop])

    useEffect(() => {
        const el = containerRef.current
        if (!el) return

        // Only mount the WebGL scene when it enters the viewport
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShouldMount(true)
                    observer.disconnect()
                }
            },
            { threshold: 0.01, rootMargin: '120px' }
        )
        observer.observe(el)

        // Passive scroll listener — pauses loop during scroll, resumes after
        window.addEventListener('scroll', handleScroll, { passive: true })

        return () => {
            observer.disconnect()
            window.removeEventListener('scroll', handleScroll)
            if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current)
        }
    }, [handleScroll])

    return (
        <div
            ref={containerRef}
            className={className}
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                // Fully isolate from surrounding layout/paint
                contain: 'strict',
                willChange: 'transform',
                transform: 'translateZ(0)',
            }}
        >
            {shouldMount ? (
                <Suspense
                    fallback={
                        <div className="w-full h-full flex items-center justify-center bg-zinc-950 text-white/50">
                            <span className="animate-pulse text-sm">Loading Assistant...</span>
                        </div>
                    }
                >
                    <Spline
                        scene={scene}
                        className={className}
                        onLoad={handleLoad}
                    />
                </Suspense>
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-950">
                    <div className="flex flex-col items-center gap-4 opacity-25">
                        <div className="w-28 h-28 rounded-full bg-amber-500/20 animate-pulse" />
                        <div className="w-36 h-2 rounded-full bg-amber-500/10 animate-pulse" />
                        <div className="w-24 h-2 rounded-full bg-amber-500/10 animate-pulse" />
                    </div>
                </div>
            )}
        </div>
    )
})
