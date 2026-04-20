import React from 'react';
import { SectionFrame } from './ui/SectionFrame';
import { useActiveEvent } from './EventContext';
import { Users } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { HUJAM_ORGANIZERS } from '../constants';

export const Organizers: React.FC = () => {
  const { activeEvent, currentEventId } = useActiveEvent();
  const { language } = useLanguage();
  
  const isHujam25 = activeEvent?.title === "HUJAM'25" || (!activeEvent && !currentEventId);
  const organizers = isHujam25 ? HUJAM_ORGANIZERS : (activeEvent?.organizers || []);

  const title = language === 'tr' ? 'ETKİNLİK SORUMLULARI' : 'EVENT ORGANIZERS';

  return (
    <SectionFrame id="organizers" title={title} centeredTitle>
      {organizers.length === 0 ? (
        <div className="py-20 text-center border border-white/5 bg-zinc-900/10 max-w-7xl mx-auto">
           <p className="text-zinc-600 font-black uppercase tracking-widest text-xs italic">
             {language === 'tr' ? '// ETKİNLİK SORUMLULARI HENÜZ DUYURULMADI' : '// EVENT ORGANIZERS NOT YET ANNOUNCED'}
           </p>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-6 max-w-7xl mx-auto px-4">
          {organizers.map((o: any) => (
            <div key={o.id} className="min-w-[280px] bg-zinc-950/50 backdrop-blur-sm border border-white/5 p-6 relative overflow-hidden group hover:border-cyber-red/30 transition-all text-center">
              <div className="absolute top-0 left-0 w-[2px] h-full bg-cyber-red opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {/* Corners */}
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/10 group-hover:border-cyber-red/40 transition-colors" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/10 group-hover:border-cyber-red/40 transition-colors" />

              <div className="flex flex-col gap-1 relative z-10">
                <span className="text-white font-black text-lg uppercase tracking-tight group-hover:text-cyber-red transition-colors leading-none">{o.name}</span>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <div className="w-8 h-[1px] bg-cyber-red/30" />
                  <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.2em]">{o.role || 'ORGANIZER'}</span>
                  <div className="w-8 h-[1px] bg-cyber-red/30" />
                </div>
              </div>

              {/* Background Decorative Icon */}
              <Users className="absolute -bottom-6 -right-6 text-white/[0.02] w-24 h-24 rotate-12 group-hover:rotate-0 group-hover:text-cyber-red/[0.03] transition-all duration-700" />
            </div>
          ))}
        </div>
      )}
    </SectionFrame>
  );
};
