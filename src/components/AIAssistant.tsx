import { useState } from 'react';
import { Bot, X } from 'lucide-react';

interface AIAssistantProps {
  name: string;
  aiPrompt?: string;
}

export default function AIAssistant({ name, aiPrompt }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const defaultPrompt = `Hi! I am ${name}'s AI Assistant. ${aiPrompt || 'How can I help you book a session?'}`;

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-[#050505] w-16 h-16 rounded-full shadow-2xl hover:shadow-[#D4AF37]/50 transition-all duration-300 hover:scale-110 flex items-center justify-center group z-50"
          aria-label="Open AI Assistant"
        >
          <Bot className="w-7 h-7" />
          <div className="absolute -top-12 right-0 bg-[#1a1a1a] text-[#F5F5F5] px-4 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl border border-[#D4AF37]/20">
            Try AI Assistant
          </div>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-8 right-8 w-96 bg-[#1a1a1a] border border-[#D4AF37]/30 rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div className="bg-gradient-to-r from-[#D4AF37] to-[#C5A028] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-[#050505] w-10 h-10 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <h3 className="text-[#050505] font-semibold">AI Assistant</h3>
                <p className="text-[#050505]/70 text-xs">Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#050505] hover:bg-[#050505]/10 rounded-full p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div className="bg-[#050505] border border-[#D4AF37]/20 rounded-2xl p-4 rounded-tl-none">
              <p className="text-[#F5F5F5] leading-relaxed">
                {defaultPrompt}
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-[#F5F5F5]/50">
              <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse"></div>
              <span>Ready to assist you</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
