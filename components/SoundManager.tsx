import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playClick: () => void;
  playHover: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

// Simple synthesized sounds to avoid external asset dependency issues in this demo
const playSynthesizedSound = (type: 'hover' | 'click', isMuted: boolean) => {
  if (isMuted) return;
  
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;

  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  if (type === 'hover') {
    // High pitched short blip
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  } else {
    // Mechanical click
    osc.type = 'square';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }
};

export const SoundProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(true);

  // Auto-mute initially to respect browser policies, user must toggle to enable
  
  const toggleMute = () => setIsMuted(prev => !prev);
  
  const playClick = () => playSynthesizedSound('click', isMuted);
  const playHover = () => playSynthesizedSound('hover', isMuted);

  return (
    <SoundContext.Provider value={{ isMuted, toggleMute, playClick, playHover }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};
