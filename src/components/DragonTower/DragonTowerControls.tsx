import React, { ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DollarSign, ChevronRight } from 'lucide-react';
import { DifficultyLevel, MULTIPLIERS } from './index';

interface DragonTowerControlsProps {
  balance: number;
  betAmount: number;
  onBetAmountChange: (amount: number) => void;
  difficulty: DifficultyLevel;
  onDifficultyChange: (difficulty: DifficultyLevel) => void;
  onStartGame: () => void;
  onCashOut: () => void;
  onHalfBet: () => void;
  onDoubleBet: () => void;
  isPlaying: boolean;
  currentLevel: number;
  currentMultiplier: number;
  className?: string;
}

const DragonTowerControls: React.FC<DragonTowerControlsProps> = ({
  balance,
  betAmount,
  onBetAmountChange,
  difficulty,
  onDifficultyChange,
  onStartGame,
  onCashOut,
  onHalfBet,
  onDoubleBet,
  isPlaying,
  currentLevel,
  currentMultiplier,
  className
}) => {
  const handleBetAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      onBetAmountChange(value);
    } else if (e.target.value === '') {
      onBetAmountChange(0);
    }
  };

  // Calculate potential win with validation to prevent NaN
  const getPotentialMultiplier = () => {
    if (currentLevel > 0 && !isNaN(currentMultiplier)) {
      return currentMultiplier;
    }
    return MULTIPLIERS[difficulty][0];
  };
  
  const potentialWin = betAmount * getPotentialMultiplier();
  return (
    <Card className={`bg-game-panel/90 border-game-button/20 overflow-hidden ${className}`}>
      <CardContent className="p-3 space-y-3">
        {/* Balance and Bet Amount */}
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-1">
            <label className="text-gray-300 text-xs">Bet Amount</label>
            <span className="text-gray-300 text-xs">${balance.toFixed(2)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="relative flex-1">
              <Input
                type="text"
                value={betAmount}
                onChange={handleBetAmountChange}
                className="bg-game-bg/40 text-white border-game-button/20 pr-8 h-8 text-sm"
                disabled={isPlaying}
              />
              <DollarSign className="absolute right-2 top-1/2 transform -translate-y-1/2 text-yellow-500 h-3 w-3" />
            </div>
            <Button 
              onClick={onHalfBet}
              variant="outline" 
              size="sm"
              className="bg-game-bg/40 border-game-button/20 text-white hover:bg-game-bg/70 h-8 w-8 p-0"
              disabled={isPlaying}
            >
              ½
            </Button>
            <Button 
              onClick={onDoubleBet}
              variant="outline" 
              size="sm"
              className="bg-game-bg/40 border-game-button/20 text-white hover:bg-game-bg/70 h-8 w-8 p-0"
              disabled={isPlaying}
            >
              2×
            </Button>
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="space-y-1">
          <label className="text-gray-300 text-xs">Difficulty</label>
          <Select
            value={difficulty} 
            onValueChange={(value: DifficultyLevel) => onDifficultyChange(value)} 
            disabled={isPlaying}          >
            <SelectTrigger className="bg-game-bg/40 text-white border-game-button/20 h-8 text-xs">
              <SelectValue placeholder="Select Difficulty" />
            </SelectTrigger>
            <SelectContent className="bg-game-panel border-game-button/20">              <SelectItem value="easy" className="text-white hover:bg-game-bg/40 text-xs">Easy (3/4 Eggs)</SelectItem>
              <SelectItem value="medium" className="text-white hover:bg-game-bg/40 text-xs">Medium (2/3 Eggs)</SelectItem>
              <SelectItem value="hard" className="text-white hover:bg-game-bg/40 text-xs">Hard (1/2 Eggs)</SelectItem>
              <SelectItem value="expert" className="text-white hover:bg-game-bg/40 text-xs">Expert (1/3 Eggs)</SelectItem>
              <SelectItem value="master" className="text-white hover:bg-game-bg/40 text-xs">Master (1/4 Eggs)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Game Information and Potential Win */}
        <div className="p-2 bg-game-bg/30 rounded-md space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-gray-300 text-xs">Potential Win:</span>
            <span className="text-yellow-400 font-bold text-xs">${potentialWin.toFixed(2)}</span>
          </div>
          
          {isPlaying && currentLevel > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-xs">Level:</span>
              <span className="text-blue-400 font-bold text-xs">{currentLevel}/9</span>
            </div>
          )}
            {isPlaying && currentLevel > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-xs">Multiplier:</span>
              <span className="text-green-400 font-bold text-xs">
                {!isNaN(currentMultiplier) ? currentMultiplier.toFixed(2) : "0.00"}x
              </span>
            </div>
          )}
        </div>        {/* Action Buttons */}
        {!isPlaying ? (
          <Button
            onClick={onStartGame}
            disabled={betAmount <= 0 || betAmount > balance}
            className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-2 h-auto text-sm transition-colors"
          >
            Start Game
          </Button>
        ) : (
          <Button
            onClick={onCashOut}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 h-auto text-sm transition-colors flex items-center justify-center"
          >
            Cash Out <ChevronRight className="ml-1" size={14} />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default DragonTowerControls;
