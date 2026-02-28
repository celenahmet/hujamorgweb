import React from 'react';
import { SectionFrame } from './ui/SectionFrame';
import { useLanguage } from './LanguageContext';
import { UI_TEXT } from '../text';

export const About: React.FC = () => {
  const { language } = useLanguage();
  const t = UI_TEXT[language].about;

  return (
    <SectionFrame id="about" className="bg-zinc-900/30">
      <div className="max-w-4xl mx-auto text-center relative p-8 md:p-12 border border-cyber-red/20 box-glow">
        
        <h3 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider relative inline-block">
          {t.title}
          <div className="absolute -bottom-2 left-0 w-full h-[1px] bg-cyber-red shadow-[0_0_10px_#ff003c]" />
        </h3>

        <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-sans mb-6">
          {t.description}
        </p>

        <p className="text-cyber-red font-mono text-sm tracking-widest">
          {t.culture}
        </p>

        {/* Scanlines Overlay for this box specifically */}
        <div className="absolute inset-0 pointer-events-none opacity-5 scanline" />
      </div>
    </SectionFrame>
  );
};