
import React from 'react';
import GameCell from './GameCell';

interface GameGridProps {
  grid: Array<{
    isRevealed: boolean;
    content: 'gem' | 'mine' | null;
    isSelected?: boolean;
  }>;
  onCellClick: (index: number) => void;
  disabled: boolean;
}

const GameGrid: React.FC<GameGridProps> = ({ grid, onCellClick, disabled }) => {
  return (
    <div className="w-full max-w-2xl aspect-square grid grid-cols-5 gap-2 p-4">
      {grid.map((cell, index) => (
        <GameCell
          key={index}
          index={index}
          isRevealed={cell.isRevealed}
          content={cell.content}
          isSelected={cell.isSelected}
          onClick={onCellClick}
          disabled={disabled || cell.isRevealed}
        />
      ))}
    </div>
  );
};

export default GameGrid;
