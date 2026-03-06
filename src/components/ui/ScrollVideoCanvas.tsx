import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

interface ScrollVideoCanvasProps {
    companyName?: string;
}

const TOTAL_FRAMES = 147;

export const ScrollVideoCanvas = ({ companyName = 'Exquisite Properties' }: ScrollVideoCanvasProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    // Render Frame Logic (Object-Fit: Cover scaling)
    const renderFrame = useCallback((frameIndex: number, currentImages: HTMLImageElement[]) => {
        if (!canvasRef.current || !currentImages.length) return;

        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        const img = currentImages[frameIndex];

        if (img && img.complete && img.naturalHeight !== 0) {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvasRef.current.getBoundingClientRect();

            // Set actual internal dimensions strictly to device pixel ratio
            canvasRef.current.width = rect.width * dpr;
            canvasRef.current.height = rect.height * dpr;

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

            const imgAspect = img.naturalWidth / img.naturalHeight;
            const canvasAspect = (rect.width * dpr) / (rect.height * dpr);

            let renderWidth, renderHeight, xOffset, yOffset;

            // Algorithm for 'object-fit: cover' centered rendering
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

    // Scroll tracker
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    // Map absolute scroll [0, 1] -> frame index [0, 146]
    const renderFrameIndex = useTransform(scrollYProgress, [0, 1], [0, TOTAL_FRAMES - 1]);

    // Preload frames logic
    useEffect(() => {
        let loadedCount = 0;
        const loadedImages: HTMLImageElement[] = new Array(TOTAL_FRAMES);

        for (let i = 1; i <= TOTAL_FRAMES; i++) {
            const img = new Image();
            img.src = `/assets/video-assets/ezgif-frame-${i.toString().padStart(3, '0')}.jpg`;

            img.onload = () => {
                loadedCount++;

                // Force an initial draw as soon as the first frame lands so the screen isn't black
                if (i === 1) {
                    renderFrame(0, loadedImages);
                }

                if (loadedCount === TOTAL_FRAMES) {
                    console.log(`Mansion Assets Ready: ${TOTAL_FRAMES} frames`);
                    setImages(loadedImages);
                    setImagesLoaded(true);
                }
            };

            img.onerror = () => {
                console.error("FAILED TO LOAD FRAME:", `/assets/video-assets/frame-${i.toString().padStart(3, '0')}.jpg`);
                loadedCount++;
                if (loadedCount === TOTAL_FRAMES) {
                    setImages(loadedImages);
                    setImagesLoaded(true);
                }
            };

            loadedImages[i - 1] = img;
        }

        // Store active images directly
        setImages(loadedImages);

        // Bind resize listener to dynamically redraw active frame for Object-Fit: Cover recalculations
        const handleResize = () => {
            renderFrame(Math.round(renderFrameIndex.get()), loadedImages);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [renderFrame]);

    // Frame Swap Render Cycle
    useMotionValueEvent(renderFrameIndex, 'change', (latest) => {
        if (!imagesLoaded) return;
        renderFrame(Math.round(latest), images);
    });

    // Overlay Animations (Opacity 0 until frame 135, fade deeply by 140)
    // Frame 135/147 ~ 0.918... Frame 140/147 ~ 0.952
    const startFade = 135 / TOTAL_FRAMES;
    const endFade = 140 / TOTAL_FRAMES;

    const overlayOpacity = useTransform(
        scrollYProgress,
        [startFade, endFade],
        [0, 1]
    );
    const overlayScale = useTransform(
        scrollYProgress,
        [startFade, endFade],
        [1.05, 1]
    );
    const overlayX = useTransform(
        scrollYProgress,
        [startFade, endFade],
        [100, 0]
    );
    const overlayY = useTransform(
        scrollYProgress,
        [startFade, endFade],
        [-100, 0]
    );

    return (
        <div ref={containerRef} className="relative w-full h-[300vh] bg-[#07091A]">
            <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
                {/* The HTML5 Canvas scrubber */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full"
                    style={{ width: '100%', height: '100%', zIndex: 1, opacity: 1 }}
                />

                {/* Gradient shadow to blend canvas bottom into page flow */}
                <div className="absolute inset-0 -bottom-2 bg-gradient-to-t from-[#0B132B] via-transparent to-transparent pointer-events-none" />
                <div className="absolute inset-0 -top-2 bg-gradient-to-b from-[#0B132B] via-transparent to-transparent pointer-events-none" />

                {/* Lead Qualified Sticky Overlay */}
                <motion.div
                    className="relative z-10 w-full max-w-4xl mx-auto px-4 text-center pointer-events-none"
                    style={{
                        opacity: overlayOpacity,
                        scale: overlayScale,
                        x: overlayX,
                        y: overlayY,
                    }}
                >
                    <div className="bg-[#0B132B]/60 backdrop-blur-xl border border-amber-500/30 rounded-3xl p-8 sm:p-12 shadow-[0_0_50px_rgba(245,158,11,0.15)] inline-block">
                        <h2
                            className="text-2xl sm:text-3xl md:text-5xl font-serif font-medium text-white tracking-tight"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            LEAD QUALIFIED:{' '}
                            <span className="text-amber-500 italic block sm:inline mt-2 sm:mt-0">
                                {companyName}
                            </span>
                        </h2>
                        <p className="mt-4 sm:mt-6 text-sm sm:text-base tracking-[0.3em] uppercase text-slate-300 font-semibold font-sans">
                            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-3 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                            AI Appointment Booked
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
