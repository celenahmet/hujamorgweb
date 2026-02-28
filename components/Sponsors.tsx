import React from 'react';
import { SectionFrame } from './ui/SectionFrame';
import { SPONSORS } from '../constants';
import { Sponsor } from '../types';
import { useLanguage } from './LanguageContext';
import { UI_TEXT } from '../text';

// Tek tip Sponsor Kartı Tasarımı
const UniformSponsorCard: React.FC<{ sponsor: Sponsor }> = ({ sponsor }) => {
  return (
    <div className="
      relative group h-24 w-full flex items-center justify-center 
      bg-zinc-900/40 backdrop-blur-sm border border-white/10 
      hover:border-cyber-red hover:bg-zinc-900/80 hover:shadow-[0_0_15px_rgba(255,0,60,0.2)]
      transition-all duration-300 overflow-hidden cursor-default
    ">
      {/* Köşe Süslemeleri (Tech Corners) */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white/20 group-hover:border-cyber-red transition-colors" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white/20 group-hover:border-cyber-red transition-colors" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white/20 group-hover:border-cyber-red transition-colors" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white/20 group-hover:border-cyber-red transition-colors" />

      {/* Yan Çizgiler */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-[2px] bg-white/5 group-hover:bg-cyber-red transition-colors" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-[2px] bg-white/5 group-hover:bg-cyber-red transition-colors" />

      {/* İsim */}
      <span className="
        relative z-10 font-bold text-gray-300 group-hover:text-white 
        text-lg md:text-xl uppercase tracking-widest text-center px-4
        group-hover:scale-105 transition-transform duration-300
      ">
        {sponsor.name}
      </span>
      
      {/* Arka Plan Efekti */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,0,60,0.05)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%] opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
    </div>
  );
};

// Kategori Grubu Bileşeni
interface SponsorGroupProps {
  title: string;
  items: Sponsor[];
  colorClass: string;
  glowClass: string;
  gradientFrom: string;
}

const SponsorGroup: React.FC<SponsorGroupProps> = ({ title, items, colorClass, glowClass, gradientFrom }) => {
  if (items.length === 0) return null;
  return (
    <div className="mb-16 last:mb-0 w-full">
      <div className="flex items-center justify-center gap-6 mb-10">
        <div className={`h-[2px] w-12 md:w-32 bg-gradient-to-r from-transparent ${gradientFrom} opacity-70`} />
        
        <h3 className={`
          ${colorClass} ${glowClass}
          font-mono font-black uppercase tracking-widest 
          text-2xl md:text-3xl whitespace-nowrap
          scale-y-110
        `}>
          {title}
        </h3>
        
        <div className={`h-[2px] w-12 md:w-32 bg-gradient-to-l from-transparent ${gradientFrom} opacity-70`} />
      </div>
      
      <div className="flex flex-wrap justify-center gap-6">
        {items.map((s, i) => (
          <div key={i} className="w-full sm:w-72 md:w-80 lg:w-96">
            <UniformSponsorCard sponsor={s} />
          </div>
        ))}
      </div>
    </div>
  );
};

export const Sponsors: React.FC = () => {
  const { language } = useLanguage();
  const t = UI_TEXT[language].sponsors;

  const main = SPONSORS.filter(s => s.tier === 'main');
  const clothing = SPONSORS.filter(s => s.tier === 'clothing');
  const platinum = SPONSORS.filter(s => s.tier === 'platinum');
  const gold = SPONSORS.filter(s => s.tier === 'gold');
  const server = SPONSORS.filter(s => s.tier === 'server');
  const education = SPONSORS.filter(s => s.tier === 'education');
  const audio = SPONSORS.filter(s => s.tier === 'audio');

  return (
    <SectionFrame id="sponsors" title={t.title}>
      <div className="max-w-7xl mx-auto">
        
        <SponsorGroup 
          title={t.tiers.main} 
          items={main} 
          colorClass="text-cyber-red"
          glowClass="drop-shadow-[0_0_15px_rgba(255,0,60,0.8)]"
          gradientFrom="to-cyber-red"
        />

        <SponsorGroup 
          title={t.tiers.clothing} 
          items={clothing} 
          colorClass="text-white"
          glowClass="drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]"
          gradientFrom="to-white"
        />

        <SponsorGroup 
          title={t.tiers.platinum} 
          items={platinum} 
          colorClass="text-blue-400"
          glowClass="drop-shadow-[0_0_15px_rgba(96,165,250,0.8)]"
          gradientFrom="to-blue-400"
        />

        <SponsorGroup 
          title={t.tiers.gold} 
          items={gold} 
          colorClass="text-yellow-400"
          glowClass="drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]"
          gradientFrom="to-yellow-400"
        />

        <SponsorGroup 
          title={t.tiers.server} 
          items={server} 
          colorClass="text-green-400"
          glowClass="drop-shadow-[0_0_15px_rgba(74,222,128,0.8)]"
          gradientFrom="to-green-400"
        />
        
        <SponsorGroup 
          title={t.tiers.audio} 
          items={audio} 
          colorClass="text-orange-400"
          glowClass="drop-shadow-[0_0_15px_rgba(251,146,60,0.8)]"
          gradientFrom="to-orange-400"
        />
        
        <SponsorGroup 
          title={t.tiers.education} 
          items={education} 
          colorClass="text-purple-400"
          glowClass="drop-shadow-[0_0_15px_rgba(192,132,252,0.8)]"
          gradientFrom="to-purple-400"
        />

      </div>
    </SectionFrame>
  );
};