import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, Globe } from 'lucide-react';
import { useSound } from './SoundManager';
import { useLanguage } from './LanguageContext';
import { UI_TEXT } from '../text';

export const Navbar: React.FC = () => {
  const { isMuted, toggleMute } = useSound();
  const { language, toggleLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const t = UI_TEXT[language].nav;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { name: t.themes, id: 'themes' },
    { name: t.sponsors, id: 'sponsors' },
    { name: t.gallery, id: 'gallery' },
    // { name: t.portfolio, id: 'portfolio' },
    { name: t.faq, id: 'faq' },
    { name: t.contact, id: 'contact' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${scrolled ? 'bg-black/90 backdrop-blur-md border-cyber-red/30 py-4' : 'bg-transparent border-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Logo Area */}
        <div className="flex items-center gap-3">
          <img src="https://hujam.acmhacettepe.com/assets/hujamlogo.png" alt="HUJAM Logo" className="h-10 w-auto filter drop-shadow-[0_0_5px_rgba(255,0,60,0.5)]" />
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleNavClick(e, link.id)}
              className="text-sm font-sans font-bold text-gray-400 hover:text-cyber-red uppercase tracking-widest transition-colors relative group cursor-pointer"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-cyber-red transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
          
          <div className="flex items-center gap-2 border-l border-white/10 pl-6">
            <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 p-2 border border-white/20 hover:border-cyber-red hover:bg-cyber-red/10 rounded-sm transition-all text-gray-400 hover:text-white font-mono text-xs font-bold"
                aria-label="Toggle Language"
            >
                <Globe size={18} />
                <span>{language.toUpperCase()}</span>
            </button>

            <button 
                onClick={toggleMute}
                className="p-2 border border-white/20 hover:border-cyber-red hover:bg-cyber-red/10 rounded-sm transition-all text-gray-400 hover:text-white"
                aria-label="Toggle Sound"
            >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <button 
              onClick={toggleLanguage}
              className="text-gray-400 font-mono font-bold text-xs border border-white/20 px-2 py-1 rounded"
          >
              {language.toUpperCase()}
          </button>
          <button 
            onClick={toggleMute}
            className="text-gray-400"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="text-white hover:text-cyber-red transition-colors"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-black/95 z-40 flex flex-col items-center justify-center gap-8 transition-transform duration-300 md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {navLinks.map((link) => (
          <a 
            key={link.id}
            href={`#${link.id}`}
            onClick={(e) => handleNavClick(e, link.id)}
            className="text-2xl font-sans font-bold text-white hover:text-cyber-red uppercase tracking-widest"
          >
            {link.name}
          </a>
        ))}
      </div>
    </nav>
  );
};