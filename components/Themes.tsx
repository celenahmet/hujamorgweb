import React from 'react';
import { SectionFrame } from './ui/SectionFrame';
import { HUJAM_THEMES } from '../constants';
import { useSound } from './SoundManager';
import { useLanguage } from './LanguageContext';
import { UI_TEXT } from '../text';

export const Themes: React.FC = () => {
  const { playHover } = useSound();
  const { language } = useLanguage();
  const t = UI_TEXT[language].themes;
  const themes = HUJAM_THEMES[language];

  return (
    <SectionFrame id="themes" title={t.title}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {themes.map((theme, index) => (
          <div 
            key={theme.year}
            onMouseEnter={playHover}
            className="group relative h-80 perspective-1000"
          >
            <div className={`
              absolute inset-0 bg-zinc-900 border-2 border-white/10 p-8 flex flex-col justify-between
              transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2
              hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] z-10
              ${theme.year === "2025" ? 'border-cyber-red/50 shadow-[0_0_20px_rgba(255,0,60,0.1)]' : ''}
            `}>
              
              {/* Year - Huge */}
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                <span className={`text-8xl font-black ${theme.color.split(' ')[0]}`}>
                  {theme.year.slice(2)}
                </span>
              </div>

              {/* Header */}
              <div className="relative z-10">
                <div className={`w-12 h-1 mb-6 transition-all duration-300 group-hover:w-24 ${theme.color.includes('red') ? 'bg-cyber-red' : theme.color.includes('cyan') ? 'bg-cyan-400' : theme.color.includes('purple') ? 'bg-purple-400' : 'bg-green-400'}`} />
                <h3 className={`text-3xl font-bold text-white mb-2 uppercase tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white ${theme.color.includes('red') ? 'group-hover:to-cyber-red' : 'group-hover:to-white'}`}>
                  {theme.title}
                </h3>
              </div>
              
              {/* Concept */}
              <div className="relative z-10">
                <p className="text-sm text-gray-400 leading-relaxed border-l-2 border-white/10 pl-4 group-hover:border-white/50 transition-colors">
                  {theme.concept}
                </p>
              </div>

              {/* Bottom Glow */}
              <div className={`absolute bottom-0 left-0 w-full h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${theme.color.includes('red') ? 'bg-cyber-red' : theme.color.includes('cyan') ? 'bg-cyan-400' : theme.color.includes('purple') ? 'bg-purple-400' : 'bg-green-400'}`} />
            </div>
            
            {/* Background blurred glow */}
            <div className={`absolute inset-0 blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10 ${theme.color.includes('red') ? 'bg-cyber-red' : theme.color.includes('cyan') ? 'bg-cyan-400' : theme.color.includes('purple') ? 'bg-purple-400' : 'bg-green-400'}`} />
          </div>
        ))}
      </div>
    </SectionFrame>
  );
};