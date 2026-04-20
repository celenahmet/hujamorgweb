import React from 'react';
import { X, MessageSquare, Gamepad2, Clock } from 'lucide-react';
import { GameButton } from './GameButton';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'warning' | 'info' | 'error';
}

export const AlertModal: React.FC<AlertModalProps> = ({ isOpen, onClose, title, message, type = 'info' }) => {
  if (!isOpen) return null;

  const isWarning = type === 'warning' || type === 'error';
  const themeColor = isWarning ? 'cyber-red' : 'blue-500';
  const themeBg = isWarning ? 'bg-cyber-red/5' : 'bg-blue-500/5';
  const themeBorder = isWarning ? 'border-cyber-red/20' : 'border-blue-500/20';

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className={`bg-zinc-950 border ${themeBorder} p-8 max-w-md w-full relative overflow-hidden shadow-[0_0_80px_rgba(59,130,246,0.05)]`}>
        
        {/* Top Glitch Line */}
        <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-${themeColor} to-transparent opacity-50`} />
        
        {/* Corners */}
        <div className={`absolute top-0 left-0 w-4 h-4 border-t border-l ${isWarning ? 'border-cyber-red/40' : 'border-blue-500/40'}`} />
        <div className={`absolute top-0 right-0 w-4 h-4 border-t border-r ${isWarning ? 'border-cyber-red/40' : 'border-blue-500/40'}`} />

        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-zinc-700 hover:text-white transition-colors p-1"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center text-center space-y-6 pt-4">
          <div className="relative">
            <div className={`w-20 h-20 ${themeBg} border ${themeBorder} rounded-xl flex items-center justify-center relative z-10`}>
              {isWarning ? (
                <MessageSquare size={36} className="text-cyber-red animate-pulse" />
              ) : (
                <div className="relative">
                  <Gamepad2 size={36} className="text-blue-400" />
                  <Clock size={16} className="absolute -bottom-1 -right-1 text-white bg-blue-600 rounded-full" />
                </div>
              )}
            </div>
            {/* Background aura */}
            <div className={`absolute inset-0 ${isWarning ? 'bg-cyber-red/10' : 'bg-blue-500/10'} blur-2xl -z-0 rounded-full scale-150`} />
          </div>
          
          <div className="space-y-3">
            <div className={`flex items-center justify-center gap-2 ${isWarning ? 'text-cyber-red' : 'text-blue-400'} font-mono text-[10px] uppercase tracking-[0.3em] font-black`}>
              {!isWarning && <span className="w-2 h-2 bg-blue-400 rounded-full opacity-50" />}
              {isWarning ? 'SİSTEM BİLDİRİMİ' : 'DUYURU // BİLGİ'}
            </div>
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">{title}</h3>
            <p className="text-zinc-500 text-sm font-sans leading-relaxed px-4">
              {message}
            </p>
          </div>

          <div className="w-full pt-6">
             <button 
                onClick={onClose} 
                className={`w-full py-4 text-xs font-black tracking-[0.2em] relative overflow-hidden group border ${isWarning ? 'border-cyber-red/30 text-cyber-red hover:bg-cyber-red hover:text-white' : 'border-blue-500/30 text-blue-400 hover:bg-blue-500 hover:text-white'} transition-all uppercase`}
             >
                ANLADIM
             </button>
          </div>
        </div>

        {/* Technical Stamp */}
        <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center opacity-20 font-mono text-[8px] uppercase tracking-widest text-zinc-500">
          <span>HUJAM_NETWORKING</span>
          <span>STATUS: {isWarning ? 'OFFLINE' : 'PENDING'}</span>
        </div>
      </div>
    </div>
  );
};
