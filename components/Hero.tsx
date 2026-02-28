import React, { useMemo } from 'react';
import { GameButton } from './ui/GameButton';
import { ArrowRight, Users, ChevronDown } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { UI_TEXT } from '../text';

export const Hero: React.FC = () => {
  const { language } = useLanguage();
  const t = UI_TEXT[language].hero;

  // Generate random particles for the "Embers" effect
  const particles = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${15 + Math.random() * 20}s`, // Slow movement (15-35s)
      animationDelay: `${Math.random() * -20}s`, // Start at different times
      opacity: 0.1 + Math.random() * 0.4,
      size: `${2 + Math.random() * 4}px`
    }));
  }, []);

  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-zinc-950 group select-none">
      
      {/* --- BACKGROUND LAYERS --- */}
      
      {/* 1. Deep Dark Base */}
      <div className="absolute inset-0 bg-radial-gradient from-zinc-900 to-black opacity-90 z-0" 
           style={{ background: 'radial-gradient(circle at center, #111113 0%, #000000 100%)' }} />

      {/* 2. Film Grain / Noise Overlay (Cinematic Texture) */}
      <div className="noise-bg" />

      {/* 3. Subtle Moving Particles (Embers) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute bg-cyber-red rounded-full blur-[1px] animate-float"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
              animationDuration: p.animationDuration,
              animationDelay: p.animationDelay,
              bottom: '-10px'
            }}
          />
        ))}
      </div>

      {/* 4. Grid Floor (Subtle perspective) */}
      <div className="absolute inset-0 opacity-[0.03]" 
           style={{ 
             backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
             backgroundSize: '50px 50px',
             maskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)'
           }} 
      />

      {/* 5. Central Breathing Glow (Slightly Animated) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vh] bg-cyber-red/5 rounded-full blur-[120px] pointer-events-none animate-pulse-fast" 
           style={{ animationDuration: '4s' }} />

      {/* 6. Bottom Vignette */}
      <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-black via-black/90 to-transparent z-10" />


      {/* --- MAIN CONTENT (UNCHANGED) --- */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 flex flex-col items-center text-center h-full justify-center pt-24">
        
        {/* Main Header Group */}
        <div className="mb-4 relative group/title">
             {/* Unified Single Line Title */}
             <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white leading-tight tracking-tighter drop-shadow-2xl flex flex-wrap justify-center gap-x-3 md:gap-x-6">
                <span>HUJAM</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-cyber-red to-red-800 relative">
                  2025
                  {/* Subtle glow behind 2025 */}
                  <span className="absolute inset-0 bg-cyber-red/20 blur-xl -z-10" />
                </span>
             </h1>
        </div>

        {/* Subtitle - Closer to title */}
        <h2 className="text-sm md:text-lg text-gray-500 font-bold uppercase tracking-[0.4em] mb-8">
            {t.subtitle}
        </h2>

        {/* Content Block: Slogan & Description Integrated */}
        <div className="max-w-3xl mx-auto mb-10 flex flex-col items-center gap-2">
            {/* Slogan - Styled to fit description flow */}
            <div className="flex items-center gap-3 text-cyber-red font-mono text-sm md:text-base font-bold tracking-widest bg-cyber-red/5 px-4 py-1 rounded border border-cyber-red/10">
                <span className="animate-pulse">///</span>
                {t.slogan}
                <span className="animate-pulse">///</span>
            </div>
            
            {/* Description - Closer to slogan */}
            <p className="text-gray-300 text-base md:text-lg font-medium leading-relaxed max-w-2xl text-center mt-2">
                {t.description_prefix}
            </p>
        </div>

        {/* Buttons - More margin bottom to avoid overlap with scroll */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center justify-center mb-16 relative z-30">
            <GameButton variant="primary" className="w-full sm:w-auto min-w-[200px] justify-center text-lg py-3 shadow-[0_0_20px_rgba(255,0,60,0.2)]">
                {t.register} <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </GameButton>
            <GameButton variant="secondary" className="w-full sm:w-auto min-w-[200px] justify-center text-lg py-3 border-white/10 hover:border-cyber-red bg-black/40 backdrop-blur-sm">
                {t.lobby} <Users className="w-5 h-5 ml-2" />
            </GameButton>
        </div>

      </div>

      {/* Scroll Indicator - Pushed to bottom edge */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20 opacity-50 hover:opacity-100 transition-opacity cursor-pointer pointer-events-auto">
        <span className="text-[10px] font-mono text-cyber-red tracking-[0.3em] uppercase">{t.scroll}</span>
        <ChevronDown className="text-cyber-red w-5 h-5 animate-bounce" />
      </div>

    </div>
  );
};