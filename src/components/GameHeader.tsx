
import React from 'react';

interface GameHeaderProps {
  safeCount: number;
  gemsFound: number;
  totalGems: number;
}

const GameHeader: React.FC<GameHeaderProps> = ({ safeCount, gemsFound, totalGems }) => {
  return (
    <div className="w-full flex justify-between items-center bg-game-panel rounded-lg p-4 mb-4">
      <div className="flex flex-col items-center">
        <span className="text-gray-400 text-sm">Safe Cells</span>
        <span className="text-white font-bold text-xl">{safeCount}</span>
      </div>
      
      <div className="text-center">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-game-gem to-green-300">
          Gems and Mines
        </h1>
      </div>
      
      <div className="flex flex-col items-center">
        <span className="text-gray-400 text-sm">Gems Found</span>
        <span className="text-white font-bold text-xl">{gemsFound}/{totalGems}</span>
      </div>
    </div>
  );
};

export default GameHeader;
