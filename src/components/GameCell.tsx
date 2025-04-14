
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface GameCellProps {
  index: number;
  isRevealed: boolean;
  content: 'gem' | 'mine' | null;
  onClick: (index: number) => void;
  disabled: boolean;
}

const GameCell: React.FC<GameCellProps> = ({ 
  index, 
  isRevealed, 
  content, 
  onClick,
  disabled 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (!isRevealed && !disabled) {
      onClick(index);
    }
  };

  return (
    <div 
      className={cn(
        "relative w-full aspect-square bg-game-cell rounded-md cursor-pointer transition-all duration-200 overflow-hidden",
        isRevealed ? "transform rotate-0" : "",
        !isRevealed && !disabled && isHovered ? "shadow-lg scale-[1.03]" : "",
        disabled && !isRevealed ? "opacity-70 cursor-not-allowed" : ""
      )}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isRevealed && content === 'gem' && (
        <div className="absolute inset-0 flex items-center justify-center animate-reveal">
          <div className="gem w-2/3 h-2/3 bg-game-gem animate-pulse-glow shadow-[0_0_15px_rgba(11,252,3,0.7)]"></div>
        </div>
      )}
      
      {isRevealed && content === 'mine' && (
        <div className="absolute inset-0 flex items-center justify-center animate-reveal">
          <div className="mine w-2/3 h-2/3 bg-game-mine animate-explosion flex items-center justify-center">
            <svg className="w-2/3 h-2/3 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C12 22 20 18 20 12V6L12 2L4 6V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 22V2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 6L20 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      )}
      
      {!isRevealed && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2/3 h-2/3 rounded-md bg-opacity-20 bg-white"></div>
        </div>
      )}
    </div>
  );
};

export default GameCell;
