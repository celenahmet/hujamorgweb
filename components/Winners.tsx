import React, { useState, useEffect } from 'react';
import { SectionFrame } from './ui/SectionFrame';
import { useActiveEvent } from './EventContext';
import { useLanguage } from './LanguageContext';
import { Trophy, Star, X } from 'lucide-react';

import odul1 from '../assets/hujam-odul1.jpg';
import odul2 from '../assets/hujam-odul2.JPG';
import odul3 from '../assets/hujam-odul3.JPG';

export const Winners: React.FC = () => {
  const { language } = useLanguage();
  const { activeEvent, currentEventId } = useActiveEvent();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const isHujam25 = activeEvent?.title === "HUJAM'25" || (!activeEvent && !currentEventId);
  
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedImage(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);
  
  if (!isHujam25) return null;
  
  const title = language === 'tr' ? "HUJAM'25 FİNALİSTLERİ" : "HUJAM'25 FINALISTS";

  return (
    <SectionFrame id="winners" title={title} centeredTitle className="bg-zinc-950/20">
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center gap-16 pb-12">
        
        {/* 1st Place */}
        <div className="relative group w-full max-w-2xl cursor-pointer" onClick={() => setSelectedImage(odul1)}>
          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-lg blur opacity-25 group-hover:opacity-60 transition duration-1000" />
          <div className="relative bg-zinc-950 border-2 border-amber-500/50 p-2 rounded-lg overflow-hidden transition-transform duration-500 group-hover:scale-[1.01]">
             <div className="absolute -top-1 left-1/2 -translate-x-1/2 bg-amber-500 text-black font-black px-6 py-2 text-sm flex items-center gap-2 shadow-[0_0_30px_rgba(245,158,11,0.6)] z-30 tracking-[0.2em]">
               <Trophy size={18} /> 1ST PLACE
             </div>
             
             {/* Decorative Corners */}
             <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-500/50 z-20" />
             <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-500/50 z-20" />

             <img 
               src={odul1} 
               alt="1st Place Winner" 
               className="w-full aspect-video object-cover rounded opacity-90 group-hover:opacity-100 transition-opacity duration-500" 
             />
             
             <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black to-transparent">
                <div className="flex items-center gap-3">
                  <div className="h-[1px] bg-amber-500/50 flex-1" />
                  <Star className="text-amber-500 animate-pulse" size={12} />
                  <div className="h-[1px] bg-amber-500/50 flex-1" />
                </div>
             </div>
          </div>
        </div>

        {/* 2nd & 3rd Place */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full">
           {/* 2nd Place */}
           <div className="relative group cursor-pointer" onClick={() => setSelectedImage(odul2)}>
              <div className="absolute -inset-1 bg-gradient-to-r from-zinc-400 to-zinc-500 rounded-lg blur opacity-10 group-hover:opacity-40 transition duration-700" />
              <div className="relative bg-zinc-950 border border-zinc-500/30 p-1.5 rounded-lg overflow-hidden transition-transform duration-500 group-hover:scale-[1.01]">
                <div className="absolute top-0 left-4 bg-zinc-500 text-black font-black px-4 py-1 text-[10px] z-20 tracking-widest shadow-lg">2ND PLACE</div>
                
                <img 
                  src={odul2} 
                  alt="2nd Place Winner" 
                  className="w-full aspect-[4/3] object-cover rounded opacity-80 group-hover:opacity-100 transition-all duration-500 grayscale-[30%] group-hover:grayscale-0" 
                />
              </div>
           </div>

           {/* 3rd Place */}
           <div className="relative group cursor-pointer" onClick={() => setSelectedImage(odul3)}>
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-800 to-amber-900 rounded-lg blur opacity-10 group-hover:opacity-40 transition duration-700" />
              <div className="relative bg-zinc-950 border border-orange-900/30 p-1.5 rounded-lg overflow-hidden transition-transform duration-500 group-hover:scale-[1.01]">
                <div className="absolute top-0 left-4 bg-orange-900 text-white font-black px-4 py-1 text-[10px] z-20 tracking-widest shadow-lg">3RD PLACE</div>
                
                <img 
                  src={odul3} 
                  alt="3rd Place Winner" 
                  className="w-full aspect-[4/3] object-cover rounded opacity-80 group-hover:opacity-100 transition-all duration-500 grayscale-[30%] group-hover:grayscale-0" 
                />
              </div>
           </div>
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white transition-all rounded-full z-[110]"
            onClick={() => setSelectedImage(null)}
          >
            <X size={24} />
          </button>
          
          <div className="relative max-w-7xl max-h-[90vh] flex items-center justify-center">
            <img 
              src={selectedImage} 
              alt="Winner Enlarged" 
              className="max-h-[85vh] w-auto object-contain border-2 border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </SectionFrame>
  );
};
