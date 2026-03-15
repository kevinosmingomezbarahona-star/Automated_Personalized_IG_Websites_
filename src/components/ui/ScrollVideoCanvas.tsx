import { useEffect, useRef, useState, useCallback } from 'react';
import { useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

interface ScrollVideoCanvasProps {
    companyName?: string;
}

const TOTAL_FRAMES = 147;
// Load frames in batches: first batch is large enough to start scrolling immediately
const BATCH_SIZE = 30;

export const ScrollVideoCanvas = ({}: ScrollVideoCanvasProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>(new Array(TOTAL_FRAMES));
    const [imagesLoaded, setImagesLoaded] = useState(false);

    // RAF dirty-flag refs — prevents multiple canvas draws per paint frame
    const rafIdRef = useRef<number | null>(null);
    const dirtyFrameRef = useRef<number>(0);
    const isDirtyRef = useRef<boolean>(false);

    // Render Frame Logic (Object-Fit: Cover scaling) — called only from the RAF loop
    const renderFrame = useCallback((frameIndex: number) => {
        if (!canvasRef.current || !imagesRef.current.length) return;

        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        const img = imagesRef.current[frameIndex];

        if (img && img.complete && img.naturalHeight !== 0) {
            // Cap DPR at 1.5 to prevent 4K/Retina from blowing up canvas buffer size
            const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            const rect = canvasRef.current.getBoundingClientRect();

            canvasRef.current.width = rect.width * dpr;
            canvasRef.current.height = rect.height * dpr;

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'medium';

            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

            const imgAspect = img.naturalWidth / img.naturalHeight;
            const canvasAspect = (rect.width * dpr) / (rect.height * dpr);

            let renderWidth, renderHeight, xOffset, yOffset;

            if (canvasAspect > imgAspect) {
                renderWidth = rect.width * dpr;
                renderHeight = (rect.width * dpr) / imgAspect;
                xOffset = 0;
                yOffset = (rect.height * dpr - renderHeight) / 2;
            } else {
                renderHeight = rect.height * dpr;
                renderWidth = (rect.height * dpr) * imgAspect;
                yOffset = 0;
                xOffset = (rect.width * dpr - renderWidth) / 2;
            }

            ctx.drawImage(img, xOffset, yOffset, renderWidth, renderHeight);
        }
    }, []);

    // RAF loop — only draws once per browser paint frame even if scroll fires many times
    const rafLoop = useCallback(() => {
        if (isDirtyRef.current) {
            isDirtyRef.current = false;
            renderFrame(dirtyFrameRef.current);
        }
        rafIdRef.current = requestAnimationFrame(rafLoop);
    }, [renderFrame]);

    // Scroll tracker
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    // Map absolute scroll [0, 1] -> frame index [0, 146]
    const renderFrameIndex = useTransform(scrollYProgress, [0, 1], [0, TOTAL_FRAMES - 1]);

    // Progressive frame loader — loads in batches to avoid 147 concurrent requests
    const loadBatch = useCallback((batchStart: number, batchEnd: number, onBatchLoaded?: () => void) => {
        if (batchStart >= TOTAL_FRAMES) return;
        const end = Math.min(batchEnd, TOTAL_FRAMES);
        let batchLoaded = 0;
        const batchSize = end - batchStart;

        for (let i = batchStart; i < end; i++) {
            // Skip if already loading or loaded
            if (imagesRef.current[i] && imagesRef.current[i].src) continue;

            const img = new Image();
            img.src = `/assets/video-assets/ezgif-frame-${(i + 1).toString().padStart(3, '0')}.jpg`;
            imagesRef.current[i] = img;

            img.onload = () => {
                batchLoaded++;
                if (batchLoaded >= batchSize && onBatchLoaded) {
                    onBatchLoaded();
                }
            };
            img.onerror = () => {
                batchLoaded++;
                if (batchLoaded >= batchSize && onBatchLoaded) {
                    onBatchLoaded();
                }
            };
        }
    }, []);

    // Progressive loading: batch 1 first (frames 0-29), then cascade remaining batches
    useEffect(() => {
        // Start the RAF loop
        rafIdRef.current = requestAnimationFrame(rafLoop);

        // Load first batch immediately — renders frame 0 as soon as it's ready
        loadBatch(0, BATCH_SIZE, () => {
            // Draw first frame as soon as it's ready
            renderFrame(0);
            setImagesLoaded(true);

            // Then load subsequent batches sequentially to avoid network saturation
            loadBatch(BATCH_SIZE, BATCH_SIZE * 2, () => {
                loadBatch(BATCH_SIZE * 2, BATCH_SIZE * 3, () => {
                    loadBatch(BATCH_SIZE * 3, BATCH_SIZE * 4, () => {
                        loadBatch(BATCH_SIZE * 4, TOTAL_FRAMES, () => {
                            console.log(`Mansion Assets Ready: All ${TOTAL_FRAMES} frames loaded.`);
                        });
                    });
                });
            });
        });

        // Resize: just mark dirty
        const handleResize = () => {
            isDirtyRef.current = true;
        };
        window.addEventListener('resize', handleResize);

        return () => {
            // Cleanup RAF loop
            if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
            window.removeEventListener('resize', handleResize);
        };
    }, [loadBatch, rafLoop, renderFrame]);

    // On scroll: just set the dirty flag — the RAF loop handles the actual draw
    useMotionValueEvent(renderFrameIndex, 'change', (latest) => {
        if (!imagesLoaded) return;
        dirtyFrameRef.current = Math.round(latest);
        isDirtyRef.current = true;
    });



    return (
        <div ref={containerRef} className="relative w-full h-[300vh] bg-[#07091A]">
            <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
                {/* The HTML5 Canvas scrubber */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full"
                    style={{
                        width: '100%',
                        height: '100%',
                        zIndex: 1,
                        opacity: 1,
                        willChange: 'transform, opacity',
                        transform: 'translateZ(0)'
                    }}
                />

                {/* Gradient shadow to blend canvas bottom into page flow */}
                <div className="absolute inset-0 -bottom-2 bg-gradient-to-t from-[#0B132B] via-transparent to-transparent pointer-events-none" />
                <div className="absolute inset-0 -top-2 bg-gradient-to-b from-[#0B132B] via-transparent to-transparent pointer-events-none" />


            </div>
        </div>
    );
};
