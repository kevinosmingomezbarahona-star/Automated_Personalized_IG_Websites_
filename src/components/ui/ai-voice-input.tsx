import { Mic } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';

interface AIVoiceInputProps {
    isActive?: boolean;
    isConnecting?: boolean;
    onToggle?: () => void;
    visualizerBars?: number;
    className?: string;
}

export function AIVoiceInput({
    isActive = false,
    isConnecting = false,
    onToggle,
    visualizerBars = 48,
    className
}: AIVoiceInputProps) {
    const [time, setTime] = useState(0);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Sync Timer with isActive
    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (isActive) {
            intervalId = setInterval(() => {
                setTime((t) => t + 1);
            }, 1000);
        } else {
            setTime(0);
        }

        return () => clearInterval(intervalId);
    }, [isActive]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')} `;
    };

    return (
        <div className={cn('w-full py-4', className)}>
            <div className="relative max-w-xl w-full mx-auto flex items-center flex-col gap-2">
                <button
                    className={cn(
                        'group w-16 h-16 rounded-xl flex items-center justify-center transition-colors z-20',
                        (isActive || isConnecting)
                            ? 'bg-none'
                            : 'bg-none hover:bg-black/10 dark:hover:bg-white/10'
                    )}
                    type="button"
                    onClick={onToggle}
                    disabled={isConnecting}
                >
                    {isConnecting ? (
                        <div
                            className="w-6 h-6 rounded-sm animate-spin bg-amber-500 cursor-pointer pointer-events-auto"
                            style={{ animationDuration: '3s' }}
                        />
                    ) : isActive ? (
                        <div
                            className="w-6 h-6 rounded-sm bg-amber-500 cursor-pointer pointer-events-auto shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                        />
                    ) : (
                        <Mic className="w-6 h-6 text-white/70 group-hover:text-amber-400 transition-colors" />
                    )}
                </button>

                <span
                    className={cn(
                        'font-mono text-sm transition-opacity duration-300 z-20',
                        isActive ? 'text-amber-400 font-bold' : 'text-white/30'
                    )}
                >
                    {formatTime(time)}
                </span>

                <div className="h-4 w-64 flex items-center justify-center gap-0.5 z-20">
                    {[...Array(visualizerBars)].map((_, i) => (
                        <div
                            key={i}
                            className={cn(
                                'w-0.5 rounded-full transition-all duration-300',
                                isActive
                                    ? 'bg-amber-400 animate-pulse'
                                    : 'bg-white/10 h-1'
                            )}
                            style={
                                isActive && isClient
                                    ? {
                                        height: `${20 + Math.random() * 80}% `,
                                        animationDelay: `${i * 0.05} s`,
                                    }
                                    : undefined
                            }
                        />
                    ))}
                </div>

                <p className="h-4 text-xs z-20 transition-colors duration-300 text-white/70">
                    {isConnecting ? 'Connecting to Agent...' : isActive ? 'Listening...' : 'Click to speak'}
                </p>
            </div>
        </div>
    );
}
