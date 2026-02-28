import React from 'react';

interface SectionFrameProps {
  children: React.ReactNode;
  title?: string;
  id?: string;
  className?: string;
}

export const SectionFrame: React.FC<SectionFrameProps> = ({ children, title, id, className = '' }) => {
  return (
    <section id={id} className={`relative py-20 px-4 md:px-8 border-b border-white/5 ${className}`}>
      <div className="max-w-7xl mx-auto relative">
        {/* HUD Elements */}
        <div className="absolute -top-10 left-0 text-cyber-red/40 font-mono text-xs hidden md:block">
          SYS.ID: {id?.toUpperCase() || 'UNKNOWN'}
        </div>
        <div className="absolute top-0 right-0 w-32 h-[1px] bg-gradient-to-l from-cyber-red to-transparent opacity-50" />
        
        {title && (
          <div className="mb-12 relative">
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter text-white inline-block relative z-10">
              {title}
              <span className="text-cyber-red">.</span>
            </h2>
            <div className="absolute -bottom-2 left-0 w-12 h-1 bg-cyber-red" />
            <div className="absolute -bottom-2 left-14 w-full h-[1px] bg-cyber-gray" />
            <div className="text-6xl md:text-8xl font-bold absolute -top-6 -left-6 text-white/5 select-none pointer-events-none uppercase">
              {title}
            </div>
          </div>
        )}

        <div className="relative z-10">
          {children}
        </div>
      </div>
    </section>
  );
};
