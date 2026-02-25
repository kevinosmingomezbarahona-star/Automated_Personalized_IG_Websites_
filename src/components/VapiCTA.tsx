import { Mic, Phone } from 'lucide-react';
import { useVapi } from '../hooks/useVapi';

interface VapiCTAProps {
  companyName: string;
  publicKey: string;
  assistantId: string;
  phoneNumber?: string;
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
  phoneNumber,
  theme: _theme,
}: VapiCTAProps) {
  const { startCall, isConnecting, isCallActive } = useVapi({
    publicKey,
    assistantId,
  });

  if (!publicKey || !assistantId) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
      <button
        onClick={startCall}
        disabled={isConnecting || isCallActive}
        className="bg-amber-500 text-black px-10 py-4 text-sm tracking-widest font-bold uppercase shadow-lg shadow-amber-500/40 hover:bg-amber-400 hover:shadow-amber-400/50 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-3"
      >
        <Mic className="w-5 h-5" />
        {isConnecting ? 'Connecting…' : isCallActive ? 'Call Active' : 'Test Voice Agent in Browser'}
      </button>

      {phoneNumber && (
        <a
          href={`tel:${phoneNumber}`}
          className="border border-amber-500 text-amber-400 px-10 py-4 text-sm tracking-widest font-semibold uppercase hover:bg-amber-500/10 transition-all flex items-center gap-3"
        >
          <Phone className="w-5 h-5" />
          Call by Phone
        </a>
      )}
    </div>
  );
}
