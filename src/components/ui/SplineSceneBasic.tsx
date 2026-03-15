import { memo } from 'react';
import { SplineScene } from './splite';
import { Card } from './card';
import { Spotlight } from './spotlight';
import { AIVoiceInput } from './ai-voice-input';
import { useVapi } from '../../hooks/useVapi';
import { ErrorBoundary } from './ErrorBoundary';

interface SplineSceneBasicProps {
    publicKey?: string;
    assistantId?: string;
    businessSummary?: string;
}

export const SplineSceneBasic = memo(function SplineSceneBasic({
    publicKey,
    assistantId,
    businessSummary
}: SplineSceneBasicProps) {
    const { isCallActive, isConnecting, startCall } = useVapi({ publicKey, assistantId });

    return (
        <Card className="w-full h-[500px] bg-zinc-950 relative overflow-hidden flex flex-col md:flex-row items-center border-neutral-800" data-spotlight-root>
            <Spotlight
                className="-top-40 left-0 md:left-20 md:-top-20"
                fill="white"
            />

            {/* Left Content Column (Directive 2) */}
            <div className="flex-1 p-8 flex flex-col justify-center relative z-10 hidden md:flex">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-amber-200 to-amber-500">
                    Operational Intelligence Brief
                </h2>
                {businessSummary && (
                    <p className="mt-4 text-neutral-300 leading-relaxed max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                        {businessSummary}
                    </p>
                )}

                {/* Voice Input Control moved under text for better desktop layout */}
                {publicKey && assistantId && (
                    <div className="w-full mt-8">
                        <AIVoiceInput
                            isActive={isCallActive}
                            isConnecting={isConnecting}
                            onToggle={startCall}
                        />
                    </div>
                )}
            </div>

            {/* Right 3D Robot Column */}
            <div
                className="flex-1 relative w-full h-full min-h-[400px] z-10 cursor-pointer pointer-events-auto"
                onClick={startCall}
            >
                <ErrorBoundary>
                    <SplineScene
                        scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                        className="w-full h-full"
                    />
                </ErrorBoundary>
            </div>

            {/* Mobile-only Voice Input Control */}
            {publicKey && assistantId && (
                <div className="w-full absolute bottom-4 px-4 md:hidden z-20 pointer-events-auto">
                    <AIVoiceInput
                        isActive={isCallActive}
                        isConnecting={isConnecting}
                        onToggle={startCall}
                    />
                </div>
            )}
        </Card>
    );
});
