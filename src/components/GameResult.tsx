
import React from 'react';
import { cn } from '@/lib/utils';

interface GameResultProps {
  isVisible: boolean;
  isWin: boolean;
  amount: number;
}

const GameResult: React.FC<GameResultProps> = ({ isVisible, isWin, amount }) => {
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4">
      <div 
        className={cn(
          "rounded-lg p-8 max-w-md w-full text-center transform transition-all duration-300",
          isVisible ? "scale-100 opacity-100" : "scale-90 opacity-0",
          isWin ? "bg-green-900" : "bg-red-900"
        )}
      >
        <h2 className="text-3xl font-bold mb-4 text-white">
          {isWin ? "You Won!" : "Game Over!"}
        </h2>
        
        <div className="text-5xl font-bold mb-6 text-white">
          {isWin ? `+$${amount.toFixed(2)}` : `-$${amount.toFixed(2)}`}
        </div>
        
        <p className="text-lg text-gray-200">
          {isWin 
            ? "Congratulations! You successfully cashed out."
            : "You hit a mine. Better luck next time!"}
        </p>
      </div>
    </div>
  );
};

export default GameResult;
