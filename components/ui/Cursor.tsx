import React, { useEffect, useState } from 'react';

export const Cursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a') || 
        target.closest('.group') ||
        target.closest('[role="button"]')
      ) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    const handleMouseDown = () => setClicking(true);
    const handleMouseUp = () => setClicking(false);
    
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      <style>{`
        body { cursor: none; }
        @media (max-width: 768px) { body { cursor: auto; } .custom-cursor { display: none; } }
      `}</style>
      
      {/* 1. Ambient Red Glow (Flashlight) */}
      <div 
        className="custom-cursor fixed top-0 left-0 pointer-events-none z-[9990] blur-[80px] transition-transform duration-100 ease-out will-change-transform mix-blend-screen"
        style={{ 
          transform: `translate(${position.x - 150}px, ${position.y - 150}px)`,
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(255, 0, 60, 0.15) 0%, rgba(0,0,0,0) 70%)'
        }}
      />

      {/* 2. FPS/MMO Crosshair - Compact Version */}
      <div 
        className="custom-cursor fixed top-0 left-0 z-[9999] pointer-events-none flex items-center justify-center transition-transform duration-75 ease-out will-change-transform"
        style={{ 
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
      >
        {/* Center Dot - Smaller */}
        <div className={`absolute bg-white rounded-full shadow-[0_0_4px_#fff] z-10 transition-all duration-200 ${clicking ? 'w-0.5 h-0.5 bg-cyber-red' : 'w-1 h-1'}`} />

        {/* Reticle Lines Container */}
        <div 
            className={`
                relative flex items-center justify-center transition-all duration-300 ease-out
                ${hovered ? 'rotate-90 scale-110' : 'rotate-0 scale-100'}
                ${clicking ? 'scale-75' : ''}
            `}
        >
             {/* Top Line */}
             <div className={`absolute w-[2px] bg-cyber-red shadow-[0_0_2px_#ff003c] transition-all duration-300 ${hovered ? 'h-3 -top-5' : 'h-2 -top-3'}`} />
             
             {/* Bottom Line */}
             <div className={`absolute w-[2px] bg-cyber-red shadow-[0_0_2px_#ff003c] transition-all duration-300 ${hovered ? 'h-3 -bottom-5' : 'h-2 -bottom-3'}`} />
             
             {/* Left Line */}
             <div className={`absolute h-[2px] bg-cyber-red shadow-[0_0_2px_#ff003c] transition-all duration-300 ${hovered ? 'w-3 -left-5' : 'w-2 -left-3'}`} />
             
             {/* Right Line */}
             <div className={`absolute h-[2px] bg-cyber-red shadow-[0_0_2px_#ff003c] transition-all duration-300 ${hovered ? 'w-3 -right-5' : 'w-2 -right-3'}`} />
        </div>
      </div>
    </>
  );
};