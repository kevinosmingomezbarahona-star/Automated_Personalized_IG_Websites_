import { Mic, Phone } from 'lucide-react';
import { useVapi } from '../hooks/useVapi';

interface VapiCTAProps {
  companyName: string;
  publicKey: string;
  assistantId: string;
  phoneNumber: string;
  theme: {
    buttonBg: string;
    textColorClass: string;
    accentColorClass: string;
  };
}

export default function VapiCTA({
  companyName,
  publicKey,
  assistantId,
  phoneNumber,
  theme,
}: VapiCTAProps) {
  const { startCall, isConnecting, isCallActive } = useVapi({
    publicKey,
    assistantId,
  });

  if (!publicKey || !assistantId) return null;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-200 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1a1a2e] mb-4">
            Hey <span className="text-[#16213e]">{companyName}</span>, I've built a tool that answers customer calls for you.
          </h3>
          <p className="text-[#1a1a2e]/70 text-lg max-w-2xl mx-auto">
            Experience the future of customer service. Try our AI assistant for free today.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={startCall}
            disabled={isConnecting || isCallActive}
            className={`bg-gradient-to-r ${theme.buttonBg} text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
          >
            <Mic className="w-5 h-5" />
            {isConnecting ? 'Connecting...' : isCallActive ? 'Call Active' : 'Test in Browser'}
          </button>

          {phoneNumber && (
            <a
              href={`tel:${phoneNumber}`}
              className={`bg-gradient-to-r ${theme.buttonBg} text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 flex items-center gap-2`}
            >
              <Phone className="w-5 h-5" />
              Call by Phone
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
