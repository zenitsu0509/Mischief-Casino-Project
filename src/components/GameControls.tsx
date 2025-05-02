
import React, { ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Diamond } from 'lucide-react';

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
  multiSelectMode?: boolean;
  selectedCount?: number;
  onToggleMultiSelect?: () => void;
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
  isGameOver,
  multiSelectMode = false,
  selectedCount = 0,
  onToggleMultiSelect
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
  
  const handleHalfBet = () => {
    onBetChange(betAmount / 2);
  };
  
  const handleDoubleBet = () => {
    onBetChange(betAmount * 2);
  };

  return (
    <div className="bg-[#192a38] rounded-lg p-4 w-full max-w-xs flex flex-col gap-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label htmlFor="bet-amount" className="text-white text-base">Bet Amount</Label>
          <div className="text-white text-sm font-medium">
            ${betAmount.toFixed(2)}
          </div>
        </div>
        
        <div className="relative">
          <Input
            id="bet-amount"
            type="number"
            min="0"
            step="0.01"
            value={betAmount}
            onChange={handleBetChange}
            disabled={gameActive}
            className="bg-[#1a323f] text-white border-[#2c4257] pr-12"
          />
          <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center">
            <span className="text-yellow-500 mr-2">$</span>
          </div>
        </div>
        
        <div className="flex gap-2 mt-2">
          <Button 
            onClick={handleHalfBet}
            disabled={gameActive}
            className="flex-1 bg-[#1a323f] hover:bg-[#234155] text-white border border-[#2c4257] h-8"
            size="sm"
          >
            ½
          </Button>
          <Button 
            onClick={handleDoubleBet}
            disabled={gameActive}
            className="flex-1 bg-[#1a323f] hover:bg-[#234155] text-white border border-[#2c4257] h-8"
            size="sm"
          >
            2×
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="mine-count" className="text-white">Mines</Label>
        <Select
          value={mineCount.toString()}
          onValueChange={handleMineChange}
          disabled={gameActive}
        >
          <SelectTrigger className="bg-[#1a323f] text-white border-[#2c4257]">
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
        <>
          <div className="bg-[#1a323f] p-3 rounded-md">
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-400">Potential Win</span>
              <span className="text-white font-medium">${potentialWin.toFixed(2)}</span>
            </div>
          </div>
          
          {onToggleMultiSelect && (
            <Button
              onClick={onToggleMultiSelect}
              className={cn(
                "w-full py-2 font-medium flex items-center justify-center",
                multiSelectMode 
                  ? "bg-purple-600 hover:bg-purple-700 text-white" 
                  : "bg-[#1a323f] hover:bg-[#234155] text-white border border-purple-500"
              )}
            >
              <Diamond className="mr-2 h-5 w-5" />
              {multiSelectMode 
                ? `Select Mode (${selectedCount} selected)` 
                : "Multi-Select Mode"}
            </Button>
          )}
        </>
      )}
      
      {!gameActive && !isGameOver && (
        <Button 
          onClick={onStartGame}
          disabled={betAmount <= 0}
          className={cn(
            "w-full py-6 text-lg font-bold",
            betAmount > 0 ? "bg-[#00ff00] hover:bg-opacity-90 text-black" : "bg-gray-700"
          )}
        >
          Bet
        </Button>
      )}
      
      {gameActive && (
        <Button 
          onClick={onCashOut}
          className={cn(
            "w-full py-6 text-lg font-bold",
            multiSelectMode && selectedCount > 0
              ? "bg-purple-500 hover:bg-purple-600 text-white"
              : "bg-yellow-500 hover:bg-yellow-600 text-black"
          )}
        >
          {multiSelectMode && selectedCount > 0 
            ? `Reveal ${selectedCount} Tiles` 
            : `Cash Out (${potentialWin.toFixed(2)})`}
        </Button>
      )}
      
      {isGameOver && (
        <Button 
          onClick={onStartGame}
          className="w-full py-6 text-lg font-bold bg-[#00ff00] hover:bg-opacity-90 text-black"
        >
          Play Again
        </Button>
      )}
    </div>
  );
};

export default GameControls;
