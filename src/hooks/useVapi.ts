import { useEffect, useRef, useState } from 'react';
import Vapi from '@vapi-ai/web';

interface UseVapiProps {
  publicKey: string;
  assistantId: string;
}

export function useVapi({ publicKey, assistantId }: UseVapiProps) {
  const vapiRef = useRef<InstanceType<typeof Vapi> | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (!publicKey) return;

    vapiRef.current = new Vapi(publicKey);

    const handleCallStart = () => {
      setIsCallActive(true);
      setIsConnecting(false);
    };

    const handleCallEnd = () => {
      setIsCallActive(false);
      setIsConnecting(false);
    };

    const handleError = (error: Error) => {
      console.error('Vapi error:', error);
      setIsConnecting(false);
    };

    vapiRef.current.on('call-start', handleCallStart);
    vapiRef.current.on('call-end', handleCallEnd);
    vapiRef.current.on('error', handleError);

    return () => {
      if (vapiRef.current) {
        vapiRef.current.off('call-start', handleCallStart);
        vapiRef.current.off('call-end', handleCallEnd);
        vapiRef.current.off('error', handleError);
      }
    };
  }, [publicKey]);

  const startCall = async () => {
    if (!vapiRef.current || !assistantId) return;

    setIsConnecting(true);
    try {
      await vapiRef.current.start(assistantId);
    } catch (error) {
      console.error('Failed to start call:', error);
      setIsConnecting(false);
    }
  };

  const endCall = () => {
    if (vapiRef.current && isCallActive) {
      vapiRef.current.stop();
    }
  };

  return {
    startCall,
    endCall,
    isCallActive,
    isConnecting,
  };
}
