import { Mic, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
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
  const { startCall, isConnecting, isCallActive } = useVapi({ publicKey, assistantId });

  if (!publicKey || !assistantId) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

      {/* Primary — gold bg with breathing pulse glow */}
      <div className="relative">
        {/* Breathing ambient glow behind button */}
        <motion.div
          className="absolute -inset-2 rounded-sm bg-amber-500/40 blur-lg"
          animate={{ opacity: [0.4, 0.85, 0.4], scale: [0.96, 1.04, 0.96] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.button
          onClick={startCall}
          disabled={isConnecting || isCallActive}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="relative bg-amber-500 text-black px-9 py-4 text-[11px] tracking-[0.25em] font-bold uppercase shadow-lg shadow-amber-500/30 hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
        >
          <Mic className="w-4 h-4" />
          {isConnecting ? 'Connecting…' : isCallActive ? 'Call Active' : 'Test Voice Agent in Browser'}
        </motion.button>
      </div>

      {/* Secondary — transparent with gold border */}
      {phoneNumber && (
        <motion.a
          href={`tel:${phoneNumber}`}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="border border-amber-500/70 text-amber-400 px-9 py-4 text-[11px] tracking-[0.25em] font-semibold uppercase hover:bg-amber-500/10 transition-colors flex items-center gap-3"
        >
          <Phone className="w-4 h-4" />
          Call by Phone
        </motion.a>
      )}
    </div>
  );
}
