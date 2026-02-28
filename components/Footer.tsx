import React from 'react';
import { Twitter, Instagram, Linkedin, Youtube, ExternalLink, Gamepad2 } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { UI_TEXT } from '../text';

export const Footer: React.FC = () => {
  const { language } = useLanguage();
  const t = UI_TEXT[language].footer;
  const navT = UI_TEXT[language].nav;

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-black pt-20 pb-10 border-t border-white/5 font-sans relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyber-red/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 mb-16">

          {/* Left Column - Info (5 cols) */}
          <div className="md:col-span-5 space-y-6">
            <div className="mb-6">
               <img 
                 src="https://acsdays.com/assets/acmhacettepe.png" 
                 alt="ACM Hacettepe" 
                 className="h-16 w-auto opacity-90 hover:opacity-100 transition-opacity" 
               />
            </div>

            <h3 className="text-[15px] font-bold text-white font-[Arial,sans-serif] tracking-tight whitespace-nowrap overflow-hidden text-ellipsis uppercase">
              {t.title}
            </h3>

            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              {t.desc}
            </p>
          </div>

          {/* Center Column - Quick Links (3 cols) */}
          <div className="md:col-span-3 md:pl-8">
            <h4 className="text-white font-bold mb-8 text-lg relative inline-block">
              {t.quick_links}
              <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-cyber-red"></span>
            </h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li>
                <a 
                  href="#location" 
                  onClick={(e) => handleScroll(e, 'location')}
                  className="hover:text-cyber-red hover:pl-2 transition-all duration-200 block"
                >
                  {UI_TEXT[language].location.title}
                </a>
              </li>
              <li>
                <a 
                  href="#themes" 
                  onClick={(e) => handleScroll(e, 'themes')}
                  className="hover:text-cyber-red hover:pl-2 transition-all duration-200 block"
                >
                  {navT.themes}
                </a>
              </li>
              <li>
                <a 
                  href="#sponsors" 
                  onClick={(e) => handleScroll(e, 'sponsors')}
                  className="hover:text-cyber-red hover:pl-2 transition-all duration-200 block"
                >
                  {navT.sponsors}
                </a>
              </li>
              <li>
                <a 
                  href="#gallery" 
                  onClick={(e) => handleScroll(e, 'gallery')}
                  className="hover:text-cyber-red hover:pl-2 transition-all duration-200 block"
                >
                  {navT.gallery}
                </a>
              </li>
              {/* <li>
                <a 
                  href="#portfolio" 
                  onClick={(e) => handleScroll(e, 'portfolio')}
                  className="hover:text-cyber-red hover:pl-2 transition-all duration-200 block"
                >
                  {navT.portfolio}
                </a>
              </li> */}
              <li>
                <a 
                  href="#faq" 
                  onClick={(e) => handleScroll(e, 'faq')}
                  className="hover:text-cyber-red hover:pl-2 transition-all duration-200 block"
                >
                  {navT.faq}
                </a>
              </li>
            </ul>
          </div>

          {/* Right Column - Socials/Community (4 cols) */}
          <div className="md:col-span-4">
             <h4 className="text-white font-bold mb-8 text-lg relative inline-block">
               {t.join_community}
               <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-cyber-red"></span>
             </h4>
             
             <div className="space-y-4">
               <a href="https://discord.gg/acmhacettepe" target="_blank" rel="noopener noreferrer" 
                  className="group flex items-center justify-between p-4 bg-zinc-900/50 border border-white/5 hover:border-cyber-red/50 hover:bg-zinc-800 transition-all rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#5865F2]/10 p-2 rounded text-[#5865F2] group-hover:bg-[#5865F2] group-hover:text-white transition-colors">
                      <Gamepad2 size={24} />
                    </div>
                    <div className="text-left">
                      <div className="text-white font-bold text-sm group-hover:text-cyber-red transition-colors">{t.socials.discord_title}</div>
                      <div className="text-xs text-gray-500 group-hover:text-gray-400">{t.socials.discord_desc}</div>
                    </div>
                  </div>
                  <ExternalLink size={16} className="text-gray-600 group-hover:text-white transition-colors" />
               </a>

               <a href="https://youtube.com/@acmhacettepe" target="_blank" rel="noopener noreferrer" 
                  className="group flex items-center justify-between p-4 bg-zinc-900/50 border border-white/5 hover:border-cyber-red/50 hover:bg-zinc-800 transition-all rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#FF0000]/10 p-2 rounded text-[#FF0000] group-hover:bg-[#FF0000] group-hover:text-white transition-colors">
                      <Youtube size={24} />
                    </div>
                    <div className="text-left">
                      <div className="text-white font-bold text-sm group-hover:text-cyber-red transition-colors">{t.socials.youtube_title}</div>
                      <div className="text-xs text-gray-500 group-hover:text-gray-400">{t.socials.youtube_desc}</div>
                    </div>
                  </div>
                  <ExternalLink size={16} className="text-gray-600 group-hover:text-white transition-colors" />
               </a>

               <a href="https://linkedin.com/company/acm-hacettepe" target="_blank" rel="noopener noreferrer" 
                  className="group flex items-center justify-between p-4 bg-zinc-900/50 border border-white/5 hover:border-cyber-red/50 hover:bg-zinc-800 transition-all rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#0077B5]/10 p-2 rounded text-[#0077B5] group-hover:bg-[#0077B5] group-hover:text-white transition-colors">
                      <Linkedin size={24} />
                    </div>
                    <div className="text-left">
                      <div className="text-white font-bold text-sm group-hover:text-cyber-red transition-colors">{t.socials.linkedin_title}</div>
                      <div className="text-xs text-gray-500 group-hover:text-gray-400">{t.socials.linkedin_desc}</div>
                    </div>
                  </div>
                  <ExternalLink size={16} className="text-gray-600 group-hover:text-white transition-colors" />
               </a>
             </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 text-center text-xs text-gray-500 font-mono">
          &copy; 2025 HUJAM - ACM Hacettepe. {t.rights}
        </div>
      </div>
    </footer>
  );
};