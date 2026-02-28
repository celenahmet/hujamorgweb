import React, { useState } from 'react';
import { SectionFrame } from './ui/SectionFrame';
import { PORTFOLIO_PROJECTS } from '../constants';
import { ExternalLink, Code, Users, X, Download, Gamepad2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSound } from './SoundManager';
import { GameProject } from '../types';
import { useLanguage } from './LanguageContext';
import { UI_TEXT } from '../text';

export const Portfolios: React.FC = () => {
  const { playHover, playClick } = useSound();
  const { language } = useLanguage();
  const t = UI_TEXT[language].portfolio;
  const projects = PORTFOLIO_PROJECTS[language];
  
  const [selectedProject, setSelectedProject] = useState<GameProject | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const ITEMS_PER_PAGE = 2;

  const openProject = (project: GameProject) => {
    playClick();
    setSelectedProject(project);
    document.body.style.overflow = 'hidden';
  };

  const closeProject = () => {
    playClick();
    setSelectedProject(null);
    document.body.style.overflow = 'auto';
  };

  const handleNext = () => {
    playClick();
    if (currentIndex + ITEMS_PER_PAGE < projects.length) {
      setCurrentIndex(prev => prev + ITEMS_PER_PAGE);
    }
  };

  const handlePrev = () => {
    playClick();
    if (currentIndex - ITEMS_PER_PAGE >= 0) {
      setCurrentIndex(prev => prev - ITEMS_PER_PAGE);
    }
  };

  const visibleProjects = projects.slice(currentIndex, currentIndex + ITEMS_PER_PAGE);
  const isFirstPage = currentIndex === 0;
  const isLastPage = currentIndex + ITEMS_PER_PAGE >= projects.length;

  return (
    <SectionFrame id="portfolio" title={t.title}>
      
      {/* Slider Container */}
      <div className="relative">
        
        <div className="flex items-center gap-4">
            
            {/* Prev Button */}
            <button 
                onClick={handlePrev}
                disabled={isFirstPage}
                className={`
                    hidden md:flex p-4 border border-white/10 bg-zinc-900/50 
                    hover:border-cyber-red hover:bg-cyber-red/10 transition-all 
                    disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-white/10 disabled:hover:bg-zinc-900/50
                    items-center justify-center group
                `}
            >
                <ChevronLeft size={32} className="text-white group-hover:text-cyber-red transition-colors" />
            </button>

            {/* Grid Area */}
            <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[500px]">
                    {visibleProjects.map((project) => (
                    <div 
                        key={project.id} 
                        className="group bg-zinc-900 border border-zinc-800 hover:border-cyber-red hover:shadow-[0_0_20px_rgba(255,0,60,0.3)] transition-all duration-300 relative overflow-hidden flex flex-col cursor-pointer h-full animate-[fadeIn_0.5s_ease-out]"
                        onMouseEnter={playHover}
                        onClick={() => openProject(project)}
                    >
                        {/* Image container */}
                        <div className="relative h-64 overflow-hidden">
                        <img 
                            src={project.image} 
                            alt={project.gameTitle} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                        
                        {/* Team Name Badge */}
                        <div className="absolute top-0 left-0 w-full p-4 bg-gradient-to-b from-black/80 to-transparent">
                            <span className="inline-block px-2 py-1 border border-cyber-red/30 bg-black/50 backdrop-blur text-cyber-red font-mono text-xs uppercase tracking-wider">
                            {project.teamName}
                            </span>
                        </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex-grow flex flex-col relative border-t border-cyber-red/20 bg-zinc-900/95">
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyber-red transition-colors flex items-center justify-between">
                            {project.gameTitle}
                            <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h3>
                        
                        <div className="flex flex-wrap gap-4 text-xs text-gray-400 mb-6 font-mono uppercase tracking-wide">
                            <div className="flex items-center gap-1">
                            <Code size={12} /> {project.engine}
                            </div>
                            <div className="flex items-center gap-1">
                            <Users size={12} /> {project.members.length} {t.members}
                            </div>
                        </div>

                        <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                            {project.description}
                        </p>

                        <div className="mt-auto">
                            <div className="text-[10px] text-gray-500 font-mono mb-1">{t.access_url}</div>
                            <div className="text-xs text-cyber-red font-mono truncate">
                                {project.teamName.toLowerCase().replace(/\s/g, '')}.hujam.org
                            </div>
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
            </div>

             {/* Next Button */}
             <button 
                onClick={handleNext}
                disabled={isLastPage}
                className={`
                    hidden md:flex p-4 border border-white/10 bg-zinc-900/50 
                    hover:border-cyber-red hover:bg-cyber-red/10 transition-all 
                    disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-white/10 disabled:hover:bg-zinc-900/50
                    items-center justify-center group
                `}
            >
                <ChevronRight size={32} className="text-white group-hover:text-cyber-red transition-colors" />
            </button>
        </div>

        {/* Mobile Navigation Controls (Below grid) */}
        <div className="flex md:hidden justify-center gap-4 mt-6">
            <button 
                onClick={handlePrev}
                disabled={isFirstPage}
                className="p-3 border border-white/10 bg-zinc-900 disabled:opacity-30"
            >
                <ChevronLeft size={24} className="text-white" />
            </button>
            <span className="flex items-center text-xs font-mono text-gray-500">
                {t.page} {Math.floor(currentIndex / ITEMS_PER_PAGE) + 1} / {Math.ceil(projects.length / ITEMS_PER_PAGE)}
            </span>
            <button 
                onClick={handleNext}
                disabled={isLastPage}
                className="p-3 border border-white/10 bg-zinc-900 disabled:opacity-30"
            >
                <ChevronRight size={24} className="text-white" />
            </button>
        </div>

      </div>

      {/* Full Screen Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-8 bg-black/90 backdrop-blur-xl animate-[fadeIn_0.2s_ease-out]">
          <div className="w-full max-w-6xl h-full md:h-auto max-h-full bg-zinc-950 border border-cyber-red/30 shadow-2xl relative flex flex-col overflow-hidden">
            
            {/* Browser-like Header */}
            <div className="flex items-center gap-4 p-4 border-b border-white/10 bg-zinc-900">
               <div className="flex gap-2">
                 <div className="w-3 h-3 rounded-full bg-red-500/50" />
                 <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                 <div className="w-3 h-3 rounded-full bg-green-500/50" />
               </div>
               <div className="flex-1 bg-black/50 px-4 py-1.5 rounded text-xs font-mono text-gray-400 flex items-center justify-between">
                 <span>https://{selectedProject.teamName.toLowerCase().replace(/\s/g, '')}.hujam.org</span>
                 <span className="text-green-500">SECURE</span>
               </div>
               <button onClick={closeProject} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                 <X className="text-white" />
               </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-3 min-h-full">
                
                {/* Left: Media */}
                <div className="lg:col-span-2 p-6 md:p-8 border-r border-white/5 space-y-6">
                   <div className="aspect-video bg-black relative border border-white/10 group overflow-hidden">
                      <img src={selectedProject.image} alt="Cover" className="w-full h-full object-cover" />
                      <div className="absolute bottom-4 left-4">
                        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter drop-shadow-xl">
                          {selectedProject.gameTitle}
                        </h1>
                      </div>
                   </div>

                   <div className="grid grid-cols-3 gap-4">
                      {selectedProject.screenshots.map((shot, idx) => (
                        <div key={idx} className="aspect-video bg-zinc-900 border border-white/10 hover:border-cyber-red transition-colors cursor-pointer">
                           <img src={shot} alt="Screenshot" className="w-full h-full object-cover opacity-80 hover:opacity-100" />
                        </div>
                      ))}
                   </div>

                   <div className="prose prose-invert max-w-none">
                     <h3 className="text-xl font-bold text-white mb-4 border-l-4 border-cyber-red pl-3 uppercase">{t.about_project}</h3>
                     <p className="text-gray-300 leading-relaxed">
                       {selectedProject.description}
                     </p>
                   </div>
                </div>

                {/* Right: Info Panel */}
                <div className="lg:col-span-1 bg-zinc-900/50 p-6 md:p-8 space-y-8">
                   
                   <div>
                     <h4 className="text-xs font-mono text-gray-500 mb-2 uppercase tracking-widest">{t.dev_team}</h4>
                     <h2 className="text-2xl font-bold text-white mb-4">{selectedProject.teamName}</h2>
                     <ul className="space-y-2">
                       {selectedProject.members.map((member, i) => (
                         <li key={i} className="flex items-center gap-2 text-sm text-gray-300 border-b border-white/5 pb-2">
                           <div className="w-1.5 h-1.5 bg-cyber-red rounded-full" />
                           {member}
                         </li>
                       ))}
                     </ul>
                   </div>

                   <div>
                     <h4 className="text-xs font-mono text-gray-500 mb-2 uppercase tracking-widest">{t.tech_details}</h4>
                     <div className="flex items-center gap-2 text-white bg-black/40 p-3 border border-white/10">
                        <Code size={16} className="text-cyber-red" />
                        <span>{selectedProject.engine}</span>
                     </div>
                   </div>
                  
                  {selectedProject.assets && (
                    <div className="text-xs text-gray-500">
                      <span className="font-bold block text-gray-400 mb-1">{t.assets_license}</span>
                      {selectedProject.assets}
                    </div>
                  )}

                   <div className="pt-8 space-y-4">
                      <a href={selectedProject.itchUrl} target="_blank" rel="noopener noreferrer" 
                        className="flex items-center justify-center gap-2 w-full py-4 bg-cyber-red text-white font-bold uppercase tracking-widest hover:bg-white hover:text-cyber-red transition-all shadow-[0_0_20px_rgba(255,0,60,0.3)]">
                         <Gamepad2 /> {t.itch_page}
                      </a>
                      {selectedProject.downloadUrl && (
                        <a href={selectedProject.downloadUrl} className="flex items-center justify-center gap-2 w-full py-4 border border-white/20 text-white font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
                           <Download size={18} /> {t.win_build}
                        </a>
                      )}
                   </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </SectionFrame>
  );
};