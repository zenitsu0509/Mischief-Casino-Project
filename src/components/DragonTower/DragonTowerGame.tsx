import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DifficultyLevel, GameOutcome } from './index';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface DragonTowerGameProps {
  towerState: Array<Array<{ revealed: boolean, hasEgg: boolean, selected: boolean }>>;
  difficulty: DifficultyLevel;
  currentLevel: number;
  onTileSelect: (rowIndex: number, tileIndex: number) => void;
  isPlaying: boolean;
  gameOutcome: GameOutcome;
  multipliers: number[];
  betAmount: number;
  lastPayout?: number; // Add payout amount for displaying accurate cashout info
}

const DragonTowerGame: React.FC<DragonTowerGameProps> = ({
  towerState,
  difficulty,
  currentLevel,
  onTileSelect,
  isPlaying,
  gameOutcome,
  multipliers,
  betAmount,
  lastPayout = 0
}) => {  
  // Effect to handle animations when game ends and tiles are revealed
  useEffect(() => {
    if (gameOutcome && !isPlaying) {
      // Add staggered animations to the tiles after game ends
      const tiles = document.querySelectorAll('.dragon-tile');
      tiles.forEach((tile, index) => {
        setTimeout(() => {
          tile.classList.add('animate-reveal');
        }, index * 50); // Staggered animation
      });
    }
  }, [gameOutcome, isPlaying]);

  // Helper to determine tile state classes  
  const getTileClasses = (tile: { revealed: boolean, hasEgg: boolean, selected: boolean }, rowIndex: number) => {
    const isCurrentLevel = rowIndex === currentLevel - 1;
    
    // Base classes - wider and shorter rectangular tiles
    let classes = "relative flex items-center justify-center p-2 w-20 h-10 rounded-md transition-all duration-300 ";
    
    if (tile.revealed) {
      // Revealed tile styling
      if (tile.hasEgg) {
        // Dragon egg found
        classes += "bg-green-500/20 border-2 border-green-500 text-white ";
      } else {
        // No egg (trap/fail)
        classes += "bg-red-500/20 border-2 border-red-500 text-white ";
      }
    } else {
      // Unrevealed tile styling
      if (isCurrentLevel) {
        // Clickable current level tile
        classes += "bg-blue-500/10 border-2 border-blue-400/50 hover:bg-blue-500/20 cursor-pointer ";
      } else if (rowIndex < currentLevel - 1) {
        // Passed level, unrevealed tiles
        classes += "bg-gray-500/10 border-2 border-gray-500/50 ";
      } else {
        // Future level, locked tiles
        classes += "bg-game-bg/40 border-2 border-gray-700/30 ";
      }
    }
    
    // Selected state
    if (tile.selected) {
      classes += "ring-2 ring-white ring-opacity-60 ";
    }
    
    return classes;
  };  
  
  // Render a dragon tile
  const renderDragonTile = (tile: { revealed: boolean, hasEgg: boolean, selected: boolean }, rowIndex: number, tileIndex: number) => {
    const isCurrentLevel = rowIndex === currentLevel - 1;
    const isClickable = isPlaying && isCurrentLevel && !tile.revealed;
    
    return (
      <div
        key={`tile-${rowIndex}-${tileIndex}`}
        className={`dragon-tile ${getTileClasses(tile, rowIndex)}`}
        onClick={() => isClickable && onTileSelect(rowIndex, tileIndex)}
      >        {tile.revealed ? (
          // Revealed tile content
          <div className="flex flex-col items-center justify-center w-full h-full">
            {tile.hasEgg ? (
              // Dragon egg found
              <span className="text-2xl animate-egg-glow transition-transform duration-300 transform hover:scale-110">🥚</span>
            ) : (
              // Trap/fail - fire
              <span className="text-2xl animate-pulse transition-all duration-300 hover:text-red-500">🔥</span>
            )}
          </div>
        ) : (
          // Unrevealed tile content
          <div className="flex flex-col items-center justify-center w-full h-full">
            {isCurrentLevel ? (
              <div className={`text-sm font-bold ${isClickable ? "animate-tile-hover text-blue-400" : ""}`}>?</div>
            ) : (
              <span className="text-xs text-gray-400">▲</span>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="bg-game-panel/90 border-game-button/20 overflow-hidden h-full">
      <CardContent className="p-3 pb-4">
        <div className="mb-2 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Dragon Tower</h2>
          <div>
            <Badge variant="outline" className="bg-game-bg/40 text-white border-blue-500/50 text-xs">
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Mode
            </Badge>
          </div>
        </div>        
        {/* Game over message */}
        {gameOutcome && (
          <div className={`mb-2 p-2 rounded-md ${
            gameOutcome === 'win' || gameOutcome === 'cashout' 
              ? 'bg-green-500/20 border border-green-500/50' 
              : 'bg-red-500/20 border border-red-500/50'
          }`}>            <p className="text-center font-bold text-sm">              {gameOutcome === 'win' 
                ? (() => {
                    // Use the payout provided from the parent, or calculate it as a fallback
                    const totalPayout = lastPayout || parseFloat((betAmount * (multipliers[8] || 0)).toFixed(2));
                    const profit = parseFloat((totalPayout - betAmount).toFixed(2));
                    return `You won $${profit.toFixed(2)} (${totalPayout.toFixed(2)} total)!`;
                  })()
                : gameOutcome === 'cashout' 
                  ? (() => {
                      // Use the payout provided from the parent, which is accurately calculated
                      const totalPayout = lastPayout || 0;
                      const profit = parseFloat((totalPayout - betAmount).toFixed(2));
                      return `Cashed out: $${profit.toFixed(2)} (${totalPayout.toFixed(2)} total)!`;
                    })()
                  : 'Game Over! Try again.'}
            </p>
          </div>
        )}
        {/* Dragon tower game board */}
        <div className="relative dragon-tower-container">            {/* Starting point at top (now shows dragon) */}
          <div className="flex justify-center mb-3">
            <div className={`w-12 h-12 rounded-full bg-game-bg/60 border-2 border-red-500/50 flex items-center justify-center ${isPlaying ? 'animate-pulse' : 'hover:scale-110 transition-transform duration-300'}`}>
              <span className="text-3xl drop-shadow-[0_0_8px_rgba(255,0,0,0.5)]">🐉</span>
            </div>
          </div>
          
          {/* Dragon tower visual - reversed to start from bottom */}
          <div className="flex flex-col-reverse space-y-reverse space-y-1.5">
            {towerState.map((row, rowIndex) => (
              <div key={`row-${rowIndex}`} className="flex justify-center items-center relative">
                {/* Level indicator */}
                <div className="absolute -left-8 flex items-center justify-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    rowIndex === currentLevel - 1 
                      ? 'bg-blue-500 text-white font-bold' 
                      : rowIndex < currentLevel - 1 
                        ? 'bg-green-500/20 text-green-400 border border-green-500' 
                        : 'bg-game-bg/40 text-gray-400 border border-gray-600'
                  }`}>
                    {9 - rowIndex}
                  </div>
                </div>
                
                {/* Level multiplier */}
                <div className="absolute -right-12 flex items-center justify-center">
                  <div className={`px-2 py-0.5 rounded-md text-xs ${
                    rowIndex === currentLevel - 1 
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500' 
                      : 'bg-game-bg/30 text-gray-300 border border-gray-600/50'
                  }`}>
                    {multipliers[8 - rowIndex].toFixed(2)}x
                  </div>
                </div>
                
                {/* Tiles in the row */}
                <div className="flex space-x-2 items-center">
                  {row.map((tile, tileIndex) => renderDragonTile(tile, 8 - rowIndex, tileIndex))}
                </div>
              </div>
            ))}
          </div>

          {/* Player starting point at bottom */}
          <div className="flex justify-center mt-3">
            <div className="w-10 h-10 rounded-full bg-game-bg/60 border-2 border-blue-500/50 flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-blue-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 15l7 7m0 0l7-7m-7 7V5" 
                />
              </svg>
            </div>
          </div>          
          {/* Game instructions */}
          {!isPlaying && !gameOutcome && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="text-center p-3 rounded-lg">
                <h3 className="text-base font-bold text-white mb-1">Dragon Tower</h3>
                <p className="text-gray-300 text-xs mb-3">
                  Find dragon eggs to climb the tower.<br />
                  Reach the dragon for big rewards!
                </p>
                <Button 
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm py-1 px-3 h-auto"
                >
                  Set Bet & Start
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DragonTowerGame;
