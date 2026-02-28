import React, { useState, useEffect } from 'react';
import { SectionFrame } from './ui/SectionFrame';
import { X, ChevronLeft, ChevronRight, ScanEye } from 'lucide-react';
import { useSound } from './SoundManager';
import { useLanguage } from './LanguageContext';
import { UI_TEXT } from '../text';

export const Gallery: React.FC = () => {
  const { playHover, playClick } = useSound();
  const { language } = useLanguage();
  const t = UI_TEXT[language].gallery;
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const baseUrl = "https://acsdays.com/hujam/";

  // Listeden 5. (hujam-4) ve 8. (hujam-12) görseller çıkarıldı
  const images = [
    `${baseUrl}hujam1.jpeg`,
    `${baseUrl}hujam-1.jpeg`, 
    `${baseUrl}hujam-17.jpeg`,
    `${baseUrl}hujam-16.jpeg`,
    // hujam-4 çıkarıldı
    `${baseUrl}hujam-15.jpeg`,
    `${baseUrl}hujam-13.jpeg`,
    // hujam-12 çıkarıldı
    `${baseUrl}hujam-6.jpeg`,
    `${baseUrl}hujam-11.jpeg`,
    `${baseUrl}hujam-2.jpeg`,
    `${baseUrl}hujam-3.jpeg`,
    `${baseUrl}hujam-5.jpeg`,
    `${baseUrl}hujam-8.jpeg`,
    `${baseUrl}hujam-9.jpeg`,
  ];

  const openLightbox = (index: number) => {
    playClick();
    setSelectedImageIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    playClick();
    setSelectedImageIndex(null);
    document.body.style.overflow = 'auto';
  };

  const navigateImage = (direction: 'next' | 'prev', e: React.MouseEvent) => {
    e.stopPropagation();
    playClick();
    if (selectedImageIndex === null) return;

    if (direction === 'next') {
      setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev! + 1));
    } else {
      setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev! - 1));
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev! + 1));
      if (e.key === 'ArrowLeft') setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev! - 1));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex]);

  return (
    <SectionFrame id="gallery" title={t.title}>
      
      {/* Masonry Layout Container */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {images.map((src, i) => (
          <div 
            key={i} 
            className="break-inside-avoid relative group cursor-pointer"
            onMouseEnter={playHover}
            onClick={() => openLightbox(i)}
          >
            {/* Cyber Frame Container */}
            <div className="bg-zinc-900 p-1 border border-white/10 group-hover:border-cyber-red/50 transition-colors duration-300">
              
              <div className="relative overflow-hidden">
                {/* Image itself */}
                <img 
                  src={src} 
                  alt={`Archive Data ${i}`}
                  loading="lazy"
                  className="w-full h-auto object-cover 
                    filter sepia-[.5] hue-rotate-180 contrast-125 grayscale-[0.3]
                    group-hover:filter-none group-hover:scale-105 
                    transition-all duration-500 ease-out"
                />

                {/* Hover Scanline */}
                <div className="absolute top-0 left-0 w-full h-1 bg-cyber-red/50 shadow-[0_0_15px_rgba(255,0,60,0.8)] opacity-0 group-hover:opacity-100 group-hover:animate-scan" />
                
                {/* Viewfinder Corners */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-white/50 group-hover:border-cyber-red transition-colors" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-white/50 group-hover:border-cyber-red transition-colors" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-white/50 group-hover:border-cyber-red transition-colors" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-white/50 group-hover:border-cyber-red transition-colors" />

                {/* Center Focus Reticle on Hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <ScanEye className="text-cyber-red w-12 h-12 drop-shadow-[0_0_10px_black]" />
                </div>
              </div>

              {/* Data Label Below Image */}
              <div className="flex justify-between items-center mt-2 px-1">
                <span className="text-[10px] font-mono text-gray-500 group-hover:text-cyber-red transition-colors">
                  IMG_SRC_0{i + 1}.DAT
                </span>
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-cyber-red" />
                  <div className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-cyber-red delay-75" />
                  <div className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-cyber-red delay-150" />
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center animate-[fadeIn_0.2s_ease-out]"
          onClick={closeLightbox}
        >
          
          {/* Navigation Buttons */}
          <button 
            onClick={(e) => navigateImage('prev', e)}
            className="absolute left-4 md:left-8 p-4 text-white hover:text-cyber-red hover:scale-110 transition-all z-20 bg-black/20 hover:bg-black/50 rounded-full backdrop-blur-sm"
          >
            <ChevronLeft size={40} />
          </button>

          <button 
            onClick={(e) => navigateImage('next', e)}
            className="absolute right-4 md:right-8 p-4 text-white hover:text-cyber-red hover:scale-110 transition-all z-20 bg-black/20 hover:bg-black/50 rounded-full backdrop-blur-sm"
          >
            <ChevronRight size={40} />
          </button>

          {/* Image Container */}
          <div className="relative max-w-7xl max-h-[90vh] p-2 md:p-4 w-full flex items-center justify-center pointer-events-none">
             {/* Note: pointer-events-none on wrapper to let clicks pass through to background/nav, 
                 but we need pointer-events-auto on the image/button wrapper to support interaction.
              */}
            <div 
              className="relative border-y-2 border-cyber-red bg-black/50 shadow-2xl group pointer-events-auto inline-block"
              onClick={(e) => e.stopPropagation()} // Prevent clicking image from closing lightbox
            >
              
              {/* Close Button - Moved INSIDE image container */}
              <button 
                onClick={closeLightbox}
                className="absolute top-2 right-2 md:top-4 md:right-4 z-[200] p-2 bg-black/80 border border-cyber-red/50 text-cyber-red hover:bg-cyber-red hover:text-white rounded transition-all duration-300 shadow-[0_0_15px_rgba(255,0,60,0.3)]"
                aria-label="Close"
              >
                <X size={32} strokeWidth={2.5} />
              </button>

              <img 
                src={images[selectedImageIndex]} 
                alt="Full view" 
                className="max-h-[85vh] w-auto object-contain"
              />
              {/* Scanline overlay for lightbox */}
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-20" />
            </div>
          </div>
        </div>
      )}
    </SectionFrame>
  );
};
