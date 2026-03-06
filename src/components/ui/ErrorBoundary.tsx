import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Spline/WebGL Error caught by ErrorBoundary:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex-1 relative w-full h-full min-h-[400px] flex items-center justify-center bg-zinc-950/80 backdrop-blur-md border border-amber-500/40 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.1)]">
                    <div className="text-center px-4">
                        <p className="text-amber-400 text-sm tracking-[0.2em] uppercase font-semibold">
                            AI Voice Agent Ready
                        </p>
                        <span className="text-slate-400 text-[10px] tracking-widest mt-2 block uppercase">
                            [Audio Only Mode]
                        </span>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
