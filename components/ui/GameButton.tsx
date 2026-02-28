import React from 'react';
import { useSound } from '../SoundManager';

interface GameButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  children: React.ReactNode;
}

export const GameButton: React.FC<GameButtonProps> = ({ 
  variant = 'primary', 
  children, 
  className = '',
  onClick,
  onMouseEnter,
  ...props 
}) => {
  const { playClick, playHover } = useSound();

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    playHover();
    if (onMouseEnter) onMouseEnter(e);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playClick();
    if (onClick) onClick(e);
  };

  const baseStyles = "relative px-8 py-3 font-mono font-bold uppercase tracking-widest transition-all duration-200 clip-path-polygon group overflow-hidden";
  
  const variants = {
    primary: "bg-cyber-red text-white hover:bg-white hover:text-cyber-red border border-cyber-red shadow-[0_0_15px_rgba(255,0,60,0.4)] hover:shadow-[0_0_25px_rgba(255,0,60,0.8)]",
    secondary: "bg-transparent text-white border border-cyber-gray hover:border-cyber-red hover:text-cyber-red hover:bg-cyber-red/10",
    outline: "border border-cyber-red/50 text-cyber-red hover:bg-cyber-red hover:text-white"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
      
      {/* Decorative corner accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
};
