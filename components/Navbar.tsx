import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import logo from '../assets/logo/hujamlogo.png';
import { Volume2, VolumeX, Menu, X, Globe, ChevronDown } from 'lucide-react';
import { useSound } from './SoundManager';
import { useLanguage } from './LanguageContext';
import { useActiveEvent } from './EventContext';
import { UI_TEXT } from '../text';

export const Navbar: React.FC = () => {
  const { isMuted, toggleMute, playHover, playClick } = useSound();
  const { language, toggleLanguage } = useLanguage();
  const { allEvents, setCurrentEventId, activeEvent } = useActiveEvent();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isHome = location.pathname === '/';
  const isApply = location.pathname === '/apply';
  const isLobby = location.pathname === '/lobby';
  const isAdmin = location.pathname === '/admin';
  const isSubPage = isApply || isLobby || isAdmin;

  const t = UI_TEXT[language].nav;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsOpen(false);
    setDropdownOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };



  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${scrolled ? 'bg-black/90 backdrop-blur-md border-cyber-red/30 py-4' : 'bg-transparent border-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Logo Area */}
        <div className="flex items-center gap-3">
          <Link to="/" onClick={() => setIsOpen(false)}>
            <img src={logo} alt="HUJAM Logo" className="h-10 w-auto filter drop-shadow-[0_0_5px_rgba(255,0,60,0.5)] cursor-pointer" />
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          
          {isHome ? (
            <>
              {/* Themes Link */}
              <a 
                href="#themes"
                onClick={(e) => handleNavClick(e, 'themes')}
                onMouseEnter={playHover}
                className="text-sm font-sans font-bold text-gray-400 hover:text-cyber-red uppercase tracking-widest transition-colors relative group cursor-pointer"
              >
                {t.themes}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-cyber-red transition-all duration-300 group-hover:w-full" />
              </a>

              {/* Sponsors Link */}
              <a 
                href="#sponsors"
                onClick={(e) => handleNavClick(e, 'sponsors')}
                onMouseEnter={playHover}
                className="text-sm font-sans font-bold text-gray-400 hover:text-cyber-red uppercase tracking-widest transition-colors relative group cursor-pointer"
              >
                {t.sponsors}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-cyber-red transition-all duration-300 group-hover:w-full" />
              </a>

              {/* Dropdown for Events */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  onMouseEnter={() => { playHover(); setDropdownOpen(true); }}
                  onClick={() => { playClick(); setDropdownOpen(!dropdownOpen); }}
                  className={`flex items-center gap-1 text-sm font-sans font-bold uppercase tracking-widest transition-colors cursor-pointer ${dropdownOpen ? 'text-cyber-red' : 'text-gray-400 hover:text-cyber-red'}`}
                >
                  {t.events} <ChevronDown size={14} className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                <div 
                  onMouseLeave={() => setDropdownOpen(false)}
                  className={`absolute top-full left-1/2 -translate-x-1/2 mt-4 w-48 bg-zinc-950 border border-cyber-red/30 shadow-2xl transition-all duration-300 origin-top ${dropdownOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'}`}
                >
                  <div className="p-1">
                    <a href="#hero" onClick={(e) => { e.preventDefault(); setDropdownOpen(false); setCurrentEventId('hujam25'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className={`block px-4 py-3 text-xs font-black transition-colors border-b border-white/5 ${activeEvent?.id === 'hujam25' ? 'text-cyber-red bg-cyber-red/5' : 'text-zinc-500 hover:text-white'}`}>HUJAM'25</a>
                    {allEvents.filter(e => e.id !== "hujam25").map((event) => (
                      <a key={event.id} href="#hero" onClick={(e) => { e.preventDefault(); setDropdownOpen(false); setCurrentEventId(event.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className={`block px-4 py-3 text-xs font-bold transition-colors border-b border-white/5 last:border-0 ${activeEvent?.id === event.id ? 'text-cyber-red bg-cyber-red/5' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>{event.title}</a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Gallery Link */}
              <a 
                href="#gallery"
                onClick={(e) => handleNavClick(e, 'gallery')}
                onMouseEnter={playHover}
                className="text-sm font-sans font-bold text-gray-400 hover:text-cyber-red uppercase tracking-widest transition-colors relative group cursor-pointer"
              >
                {t.gallery}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-cyber-red transition-all duration-300 group-hover:w-full" />
              </a>

              {/* Contact Link */}
              <a 
                href="#contact"
                onClick={(e) => handleNavClick(e, 'contact')}
                onMouseEnter={playHover}
                className="text-sm font-sans font-bold text-gray-400 hover:text-cyber-red uppercase tracking-widest transition-colors relative group cursor-pointer"
              >
                {t.contact}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-cyber-red transition-all duration-300 group-hover:w-full" />
              </a>
            </>
          ) : (
            <Link 
              to="/"
              onMouseEnter={playHover}
              className="text-sm font-sans font-bold text-gray-400 hover:text-cyber-red uppercase tracking-widest transition-colors relative group cursor-pointer"
            >
              {language === 'tr' ? 'ANA SAYFA' : 'HOME'}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-cyber-red transition-all duration-300 group-hover:w-full" />
            </Link>
          )}
          
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
      <div className={`fixed inset-0 bg-black/98 z-[200] flex flex-col items-center justify-center gap-6 transition-transform duration-500 md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Close Button Inside Overlay */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-cyber-red transition-colors border border-white/10 rounded-full"
        >
          <X size={32} />
        </button>

        {/* Branding in Menu */}
        <div className="absolute top-6 left-6 opacity-30">
          <img src={logo} alt="HUJAM Logo" className="h-8 w-auto" />
        </div>

        {isHome ? (
          <>
            {/* Themes Mobile */}
            <a 
              href="#themes"
              onClick={(e) => handleNavClick(e, 'themes')}
              className="text-3xl font-sans font-black text-white hover:text-cyber-red uppercase tracking-[0.2em] transition-all"
            >
              {t.themes}
            </a>

            {/* Sponsors Mobile */}
            <a 
              href="#sponsors"
              onClick={(e) => handleNavClick(e, 'sponsors')}
              className="text-3xl font-sans font-black text-white hover:text-cyber-red uppercase tracking-[0.2em] transition-all"
            >
              {t.sponsors}
            </a>

            {/* Events Mobile (HUJAM'25) */}
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="text-cyber-red font-mono text-xs tracking-[0.3em] font-bold uppercase opacity-70">-- {t.events} --</div>
              <a 
                href="#hero" 
                onClick={(e) => { e.preventDefault(); setIsOpen(false); setCurrentEventId(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="text-4xl font-sans font-black text-white hover:text-cyber-red transition-all scale-110 mb-2"
              >
                HUJAM'25
              </a>
              
              <div className="h-[1px] w-20 bg-white/5 my-2" />
              
              {allEvents.filter(e => e.title !== "HUJAM'25").map(event => (
                <a 
                  key={event.id}
                  href="#hero" 
                  onClick={(e) => { e.preventDefault(); setIsOpen(false); setCurrentEventId(event.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`text-2xl font-sans font-black transition-all ${event.isActive ? 'text-cyber-red scale-110' : 'text-white/60 hover:text-white'}`}
                >
                  {event.title}
                </a>
              ))}
            </div>

            {/* Gallery Mobile */}
            <a 
              href="#gallery"
              onClick={(e) => handleNavClick(e, 'gallery')}
              className="text-3xl font-sans font-black text-white hover:text-cyber-red uppercase tracking-[0.2em] transition-all"
            >
              {t.gallery}
            </a>

            {/* Contact Mobile */}
            <a 
              href="#contact"
              onClick={(e) => handleNavClick(e, 'contact')}
              className="text-3xl font-sans font-black text-white hover:text-cyber-red uppercase tracking-[0.2em] transition-all"
            >
              {t.contact}
            </a>
          </>
        ) : (
          <Link 
            to="/"
            onClick={() => setIsOpen(false)}
            className="text-4xl font-sans font-black text-white hover:text-cyber-red uppercase tracking-[0.2em] transition-all"
          >
            {language === 'tr' ? 'ANA SAYFA' : 'HOME'}
          </Link>
        )}

        {/* Language & Sound Toggle in Mobile Menu */}
        <div className="flex gap-6 mt-12 pt-8 border-t border-white/10 w-64 justify-center">
            <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 p-3 border border-white/20 text-gray-400 font-mono text-sm font-bold uppercase"
            >
                <Globe size={20} />
                <span>{language}</span>
            </button>

            <button 
                onClick={toggleMute}
                className="p-3 border border-white/20 text-gray-400"
            >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
        </div>
      </div>


    </nav>
  );
};