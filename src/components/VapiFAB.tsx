import { Zap } from 'lucide-react';
import { useVapi } from '../hooks/useVapi';

interface VapiFABProps {
  publicKey: string;
  assistantId: string;
}

export default function VapiFAB({ publicKey, assistantId }: VapiFABProps) {
  const { startCall, isConnecting, isCallActive } = useVapi({
    publicKey,
    assistantId,
  });

  if (!publicKey || !assistantId) return null;

  return (
    <button
      onClick={startCall}
      disabled={isConnecting || isCallActive}
      className="fixed bottom-8 right-8 bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-[#050505] w-16 h-16 rounded-full shadow-2xl hover:shadow-[#D4AF37]/50 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group z-50"
      aria-label="Start AI call"
      title={isCallActive ? 'Call in progress' : 'Start AI call'}
    >
      <Zap className="w-7 h-7" />
      <div className="absolute -top-12 right-0 bg-[#1a1a1a] text-[#F5F5F5] px-4 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl border border-[#D4AF37]/20">
        {isCallActive ? 'Call Active' : isConnecting ? 'Connecting...' : 'Try AI Voice'}
      </div>
    </button>
  );
}
