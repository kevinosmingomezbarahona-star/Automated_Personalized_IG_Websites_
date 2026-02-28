import { memo } from 'react';
import { SplineScene } from './splite';
import { Card } from './card';
import { Spotlight } from './spotlight';
import { AIVoiceInput } from './ai-voice-input';
import { useVapi } from '../../hooks/useVapi';

interface SplineSceneBasicProps {
    publicKey?: string;
    assistantId?: string;
}

export const SplineSceneBasic = memo(function SplineSceneBasic({
    publicKey,
    assistantId
}: SplineSceneBasicProps) {
    const { isCallActive, isConnecting, toggleCall } = useVapi({ publicKey, assistantId });

    return (
        <div className="w-full flex flex-col items-center justify-center py-8 gap-4">
            <Card className="w-full max-w-md h-[500px] bg-zinc-950 relative overflow-hidden flex items-center justify-center border-neutral-800">
                <Spotlight
                    className="-top-40 left-0 md:left-20 md:-top-20"
                    fill="white"
                />

                {/* 3D Robot Assistant */}
                <div className="w-full h-full relative z-10 cursor-pointer pointer-events-auto">
                    <SplineScene
                        scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                        className="w-full h-full"
                    />
                </div>
            </Card>

            {/* Voice Input Control */}
            {publicKey && assistantId && (
                <div className="w-full max-w-md">
                    <AIVoiceInput
                        isActive={isCallActive}
                        isConnecting={isConnecting}
                        onToggle={toggleCall}
                    />
                </div>
            )}
        </div>
    );
});
