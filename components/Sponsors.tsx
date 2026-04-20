import React from 'react';
import { SectionFrame } from './ui/SectionFrame';
import { SPONSORS } from '../constants';
import { Sponsor } from '../types';
import { useLanguage } from './LanguageContext';
import { useActiveEvent } from './EventContext';
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
      {/* Logo or Name */}
      <div className="relative z-10 w-full h-full p-6 flex items-center justify-center">
        {sponsor.logoUrl ? (
          <img 
            src={sponsor.logoUrl} 
            alt={sponsor.name} 
            className="max-w-full max-h-full object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300" 
          />
        ) : (
          <span className="
            font-bold text-gray-300 group-hover:text-white 
            text-lg md:text-xl uppercase tracking-widest text-center
            group-hover:scale-105 transition-transform duration-300
          ">
            {sponsor.name}
          </span>
        )}
      </div>
      
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
  const { activeEvent } = useActiveEvent();
  const t = UI_TEXT[language].sponsors;

  // Only fallback to static constants if we are on the main active event (Hujam'25) and Firestore is empty.
  // For other events (like Hujam'26), use Firestore only.
  const isHujam25 = activeEvent?.title === "HUJAM'25" || (!activeEvent && !activeEvent?.id);
  const sponsorList = isHujam25 ? SPONSORS : (activeEvent?.sponsors || []);



  return (
    <SectionFrame id="sponsors" title={t.title}>
      <div className="max-w-7xl mx-auto">
        
        {/* Standard Tiers */}
        <SponsorGroup 
          title={t.tiers.main} 
          items={sponsorList.filter((s: any) => s.tier === 'main')} 
          colorClass="text-cyber-red"
          glowClass="drop-shadow-[0_0_15px_rgba(255,0,60,0.8)]"
          gradientFrom="to-cyber-red"
        />

        <SponsorGroup 
          title={t.tiers.platinum} 
          items={sponsorList.filter((s: any) => s.tier === 'platinum')} 
          colorClass="text-blue-400"
          glowClass="drop-shadow-[0_0_15px_rgba(96,165,250,0.8)]"
          gradientFrom="to-blue-400"
        />

        <SponsorGroup 
          title={t.tiers.gold} 
          items={sponsorList.filter((s: any) => s.tier === 'gold')} 
          colorClass="text-yellow-400"
          glowClass="drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]"
          gradientFrom="to-yellow-400"
        />

        <SponsorGroup 
          title={t.tiers.clothing} 
          items={sponsorList.filter((s: any) => s.tier === 'clothing')} 
          colorClass="text-white"
          glowClass="drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]"
          gradientFrom="to-white"
        />

        <SponsorGroup 
          title={t.tiers.server} 
          items={sponsorList.filter((s: any) => s.tier === 'server')} 
          colorClass="text-green-400"
          glowClass="drop-shadow-[0_0_15px_rgba(74,222,128,0.8)]"
          gradientFrom="to-green-400"
        />
        
        <SponsorGroup 
          title={t.tiers.audio} 
          items={sponsorList.filter((s: any) => s.tier === 'audio')} 
          colorClass="text-orange-400"
          glowClass="drop-shadow-[0_0_15px_rgba(251,146,60,0.8)]"
          gradientFrom="to-orange-400"
        />
        
        <SponsorGroup 
          title={t.tiers.education} 
          items={sponsorList.filter((s: any) => s.tier === 'education')} 
          colorClass="text-purple-400"
          glowClass="drop-shadow-[0_0_15px_rgba(192,132,252,0.8)]"
          gradientFrom="to-purple-400"
        />

        {/* Custom Tiers Rendering */}
        {(() => {
          const customTiers = Array.from(new Set(
            sponsorList
              .filter((s: any) => s.tier.startsWith('custom:'))
              .map((s: any) => s.tier)
          )) as string[];

          return customTiers.map(tierKey => (
            <SponsorGroup 
              key={tierKey}
              title={tierKey.replace('custom:', '').toUpperCase()} 
              items={sponsorList.filter((s: any) => s.tier === tierKey)} 
              colorClass="text-zinc-400"
              glowClass="drop-shadow-[0_0_15px_rgba(161,161,170,0.8)]"
              gradientFrom="to-zinc-400"
            />
          ));
        })()}

        {/* Legacy 'other' Tier Support */}
        <SponsorGroup 
          title={t.tiers.other} 
          items={sponsorList.filter((s: any) => s.tier === 'other')} 
          colorClass="text-zinc-400"
          glowClass="drop-shadow-[0_0_15px_rgba(161,161,170,0.8)]"
          gradientFrom="to-zinc-400"
        />

        {sponsorList.length === 0 && (
          <div className="py-20 text-center border border-white/5 bg-zinc-900/20">
            <p className="text-zinc-600 font-extrabold uppercase tracking-[0.3em] text-sm animate-pulse">
              {language === 'tr' ? '// SPONSORLAR HENÜZ DUYURULMADI' : '// SPONSORS NOT YET ANNOUNCED'}
            </p>
          </div>
        )}

      </div>
    </SectionFrame>
  );
};