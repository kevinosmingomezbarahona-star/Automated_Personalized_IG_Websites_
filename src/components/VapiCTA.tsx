import { Mic } from 'lucide-react';
import { useVapi } from '../hooks/useVapi';

interface VapiCTAProps {
  companyName: string;
  publicKey: string;
  assistantId: string;
  phoneNumber?: string; // Keeping interface intact in case other components pass it
  theme: {
    buttonBg: string;
    textColorClass: string;
    accentColorClass: string;
  };
}

export default function VapiCTA({
  companyName: _companyName,
  publicKey,
  assistantId,
  theme: _theme,
}: VapiCTAProps) {
  const { startCall, isConnecting, isCallActive } = useVapi({ publicKey, assistantId });

  const label = isConnecting ? 'Connecting…' : isCallActive ? 'Call Active' : 'Tap Here to Speak with the Concierge';

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto">
      {/* Primary CTA — 21st.dev Interactive Hover Button (hover fix) */}
      <button
        onClick={startCall}
        disabled={isConnecting || isCallActive}
        className="group relative w-full cursor-pointer overflow-hidden rounded-full border border-amber-500 bg-transparent text-center font-semibold flex items-center justify-center px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          fontSize: '1.0625rem',
          letterSpacing: '0.4px',
          boxShadow: '0 4px 14px rgba(245, 158, 11, 0.25)',
        }}
      >
        {/* Layer 1 — Expanding amber fill on hover (z-0 so layers 2 & 3 sit above) */}
        <div className="absolute left-[20%] top-[40%] z-0 h-2 w-2 scale-[1] rounded-lg bg-amber-500 opacity-0 transition-all duration-300 group-hover:left-[0%] group-hover:top-[0%] group-hover:h-full group-hover:w-full group-hover:scale-[1.8] group-hover:opacity-100" />

        {/* Layer 2 — Default resting text (slides out on hover) */}
        <span className="relative z-10 inline-flex items-center gap-3 text-amber-500 translate-x-0 transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
          <Mic className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
          {label}
        </span>

        {/* Layer 3 — Hover text + icon slides in, dark contrast against amber fill */}
        <div className="absolute top-0 z-20 flex h-full w-full translate-x-12 items-center justify-center gap-3 text-slate-900 font-bold opacity-0 transition-all duration-300 group-hover:-translate-x-0 group-hover:opacity-100 px-6">
          <span className="whitespace-nowrap">{label}</span>
          <Mic className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
        </div>
      </button>
    </div>
  );
}
