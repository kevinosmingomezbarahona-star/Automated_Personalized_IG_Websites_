import { useEffect, useState, useCallback } from 'react';
import Vapi from '@vapi-ai/web';

// Global singleton state to prevent multiple WebRTC connections
let vapiInstance: InstanceType<typeof Vapi> | null = null;
let isCallActiveGlobal = false;
let isConnectingGlobal = false;
const subscribers = new Set<() => void>();

const notify = () => {
  subscribers.forEach((sub) => sub());
};

interface UseVapiProps {
  publicKey?: string;
  assistantId?: string;
}

export function useVapi({ publicKey, assistantId }: UseVapiProps) {
  const [isCallActive, setIsCallActive] = useState(isCallActiveGlobal);
  const [isConnecting, setIsConnecting] = useState(isConnectingGlobal);

  // Sync state with global variables
  useEffect(() => {
    const handleSync = () => {
      setIsCallActive(isCallActiveGlobal);
      setIsConnecting(isConnectingGlobal);
    };
    subscribers.add(handleSync);
    return () => {
      subscribers.delete(handleSync);
    };
  }, []);

  // Initialize Vapi instance only once
  useEffect(() => {
    if (!publicKey || vapiInstance) return;

    vapiInstance = new Vapi(publicKey);

    const handleCallStart = () => {
      isCallActiveGlobal = true;
      isConnectingGlobal = false;
      notify();
    };

    const handleCallEnd = () => {
      isCallActiveGlobal = false;
      isConnectingGlobal = false;
      notify();
    };

    const handleError = (error: Error) => {
      console.error('Vapi error:', error);
      isConnectingGlobal = false;
      notify();
    };

    vapiInstance.on('call-start', handleCallStart);
    vapiInstance.on('call-end', handleCallEnd);
    vapiInstance.on('error', handleError);

    // Note: Deliberately not destroying vapiInstance on unmount
    // so the call persists if the hook unmounts but the session is active.
  }, [publicKey]);

  const startCall = useCallback(async () => {
    if (!vapiInstance || !assistantId) return;

    if (isCallActiveGlobal) {
      vapiInstance.stop();
      return;
    }

    isConnectingGlobal = true;
    notify();
    try {
      await vapiInstance.start(assistantId);
    } catch (error) {
      console.error('Failed to start call:', error);
      isConnectingGlobal = false;
      notify();
    }
  }, [assistantId]);

  const endCall = useCallback(() => {
    if (vapiInstance && isCallActiveGlobal) {
      vapiInstance.stop();
    }
  }, []);

  const toggleCall = useCallback(() => {
    if (isCallActiveGlobal || isConnectingGlobal) {
      endCall();
    } else {
      startCall();
    }
  }, [endCall, startCall]);

  return {
    startCall,
    endCall,
    toggleCall,
    isCallActive,
    isConnecting,
  };
}
