
import React, { ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface GameControlsProps {
  betAmount: number;
  onBetChange: (value: number) => void;
  mineCount: number;
  onMineCountChange: (value: number) => void;
  onStartGame: () => void;
  onCashOut: () => void;
  currentMultiplier: number;
  gameActive: boolean;
  potentialWin: number;
  isGameOver: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  betAmount,
  onBetChange,
  mineCount,
  onMineCountChange,
  onStartGame,
  onCashOut,
  currentMultiplier,
  gameActive,
  potentialWin,
  isGameOver
}) => {
  const handleBetChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      onBetChange(value);
    }
  };

  const handleMineChange = (value: string) => {
    onMineCountChange(parseInt(value));
  };

  return (
    <div className="bg-game-panel rounded-lg p-4 w-full max-w-xs flex flex-col gap-4">
      <div className="text-center mb-2">
        <h2 className="text-xl font-bold text-white">Game Controls</h2>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="bet-amount" className="text-white">Bet Amount</Label>
          <div className="text-sm text-green-400 font-medium">
            {gameActive && `x${currentMultiplier.toFixed(2)}`}
          </div>
        </div>
        <Input
          id="bet-amount"
          type="number"
          min="0"
          step="0.01"
          value={betAmount}
          onChange={handleBetChange}
          disabled={gameActive}
          className="bg-gray-800 text-white border-gray-700"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="mine-count" className="text-white">Mines</Label>
        <Select
          value={mineCount.toString()}
          onValueChange={handleMineChange}
          disabled={gameActive}
        >
          <SelectTrigger className="bg-gray-800 text-white border-gray-700">
            <SelectValue placeholder="Select mines" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="15">15</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {gameActive && (
        <div className="bg-gray-800 p-3 rounded-md">
          <div className="flex justify-between items-center mb-1">
            <span className="text-gray-400">Potential Win</span>
            <span className="text-white font-medium">${potentialWin.toFixed(2)}</span>
          </div>
        </div>
      )}
      
      {!gameActive && !isGameOver && (
        <Button 
          onClick={onStartGame}
          disabled={betAmount <= 0}
          className={cn(
            "w-full py-6 text-lg font-bold",
            betAmount > 0 ? "bg-game-button hover:bg-opacity-90 text-black" : "bg-gray-700"
          )}
        >
          Bet
        </Button>
      )}
      
      {gameActive && (
        <Button 
          onClick={onCashOut}
          className="w-full py-6 text-lg font-bold bg-yellow-500 hover:bg-yellow-600 text-black"
        >
          Cash Out (${potentialWin.toFixed(2)})
        </Button>
      )}
      
      {isGameOver && (
        <Button 
          onClick={onStartGame}
          className="w-full py-6 text-lg font-bold bg-game-button hover:bg-opacity-90 text-black"
        >
          Play Again
        </Button>
      )}
    </div>
  );
};

export default GameControls;
