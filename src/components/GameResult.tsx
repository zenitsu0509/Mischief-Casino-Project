
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface GameResultProps {
  isVisible: boolean;
  isWin: boolean;
  amount: number;
  onClose?: () => void;
}

const GameResult: React.FC<GameResultProps> = ({ isVisible, isWin, amount, onClose }) => {
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4">
      <div 
        className={cn(
          "rounded-lg p-8 max-w-md w-full text-center transform transition-all duration-300 relative",
          isVisible ? "scale-100 opacity-100" : "scale-90 opacity-0",
          isWin ? "bg-green-900" : "bg-red-900"
        )}
      >
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 text-white hover:text-gray-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        )}
        
        <h2 className="text-3xl font-bold mb-4 text-white">
          {isWin ? "You Won!" : "Game Over!"}
        </h2>
        
        <div className="text-5xl font-bold mb-6 text-white">
          {isWin ? `+$${amount.toFixed(2)}` : `-$${amount.toFixed(2)}`}
        </div>
        
        <p className="text-lg text-gray-200 mb-6">
          {isWin 
            ? "Congratulations! You successfully cashed out."
            : "You hit a mine. Better luck next time!"}
        </p>
        
        {onClose && (
          <Button 
            onClick={onClose}
            className="bg-white hover:bg-gray-200 text-gray-900 font-bold"
          >
            Continue
          </Button>
        )}
      </div>
    </div>
  );
};

export default GameResult;
