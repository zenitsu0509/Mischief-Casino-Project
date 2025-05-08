import React, { ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { DollarSign, RefreshCw } from 'lucide-react';

type CoinSide = 'heads' | 'tails' | null;

interface FlipControlsProps {
  balance: number;
  betAmount: number;
  onBetAmountChange: (amount: number) => void;
  onFlip: () => void;
  onHalfBet: () => void;
  onDoubleBet: () => void;
  playerChoice: CoinSide;
  onCoinSelect: (side: CoinSide) => void;
  onRandomPick: () => void;
  disabled: boolean;
  doubleOrNothing: boolean;
  onDoubleOrNothingToggle: () => void;
  currentMultiplier: number;
  consecutiveWins: number;
}

const FlipControls: React.FC<FlipControlsProps> = ({
  balance,
  betAmount,
  onBetAmountChange,
  onFlip,
  onHalfBet,
  onDoubleBet,
  playerChoice,
  onCoinSelect,
  onRandomPick,
  disabled,
  doubleOrNothing,
  onDoubleOrNothingToggle,
  currentMultiplier,
  consecutiveWins
}) => {
  const handleBetAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      onBetAmountChange(value);
    } else if (e.target.value === '') {
      onBetAmountChange(0);
    }
  };

  const potentialWin = betAmount * currentMultiplier;

  return (
    <Card className="bg-game-panel/90 border-game-button/20 overflow-hidden">
      <CardContent className="p-6 space-y-6">
        {/* Balance and Bet Amount */}
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-1">
            <label className="text-gray-300 text-sm">Bet Amount</label>
            <span className="text-gray-300 text-sm">${balance.toFixed(2)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Input
                type="text"
                value={betAmount}
                onChange={handleBetAmountChange}
                className="bg-game-bg/40 text-white border-game-button/20 pr-10"
                disabled={disabled}
              />
              <DollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 text-yellow-500 h-4 w-4" />
            </div>
            <Button 
              onClick={onHalfBet}
              variant="outline" 
              size="sm"
              className="bg-game-bg/40 border-game-button/20 text-white hover:bg-game-bg/70"
              disabled={disabled}
            >
              ½
            </Button>
            <Button 
              onClick={onDoubleBet}
              variant="outline" 
              size="sm"
              className="bg-game-bg/40 border-game-button/20 text-white hover:bg-game-bg/70"
              disabled={disabled}
            >
              2×
            </Button>
          </div>
        </div>

        {/* Coin Selection */}
        <div className="space-y-4">
          <div className="text-white text-sm mb-2">Choose Side</div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => onCoinSelect('heads')}
              className={`h-16 ${playerChoice === 'heads' 
                ? 'bg-yellow-500 hover:bg-yellow-600 text-black' 
                : 'bg-game-bg/40 border-game-button/20 text-white hover:bg-game-bg/70'}`}
              disabled={disabled}
            >
              <div className="flex flex-col items-center">
                <span className="text-2xl mb-1">🪙</span>
                <span className="text-sm">Heads</span>
              </div>
            </Button>
            <Button
              onClick={() => onCoinSelect('tails')}
              className={`h-16 ${playerChoice === 'tails' 
                ? 'bg-yellow-500 hover:bg-yellow-600 text-black' 
                : 'bg-game-bg/40 border-game-button/20 text-white hover:bg-game-bg/70'}`}
              disabled={disabled}
            >
              <div className="flex flex-col items-center">
                <span className="text-2xl mb-1">💰</span>
                <span className="text-sm">Tails</span>
              </div>
            </Button>
          </div>
          <Button
            onClick={onRandomPick}
            variant="outline"
            size="sm"
            className="w-full bg-transparent border-game-button/20 text-white hover:bg-game-bg/70"
            disabled={disabled}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Pick Random Side
          </Button>
        </div>

        {/* Double or Nothing */}
        <div className="p-3 bg-game-bg/30 rounded-md space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-white text-sm">Double or Nothing</div>
            <Switch 
              checked={doubleOrNothing} 
              onCheckedChange={onDoubleOrNothingToggle} 
              disabled={disabled}
            />
          </div>
          <p className="text-gray-400 text-xs">
            {doubleOrNothing 
              ? "ON: Consecutive wins will double your multiplier" 
              : "OFF: Each bet uses the base 1.98x multiplier"}
          </p>
          {doubleOrNothing && consecutiveWins > 0 && (
            <div className="mt-2 text-center">
              <div className="text-yellow-400 text-sm">
                {consecutiveWins} consecutive win{consecutiveWins > 1 ? 's' : ''}
              </div>
              <div className="text-yellow-300 font-bold">
                Current Multiplier: {currentMultiplier.toFixed(2)}x
              </div>
            </div>
          )}
        </div>

        {/* Potential Win */}
        <div className="p-3 bg-game-bg/30 rounded-md">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Potential Win:</span>
            <span className="text-yellow-400 font-bold">${potentialWin.toFixed(2)}</span>
          </div>
        </div>

        {/* Flip Button */}
        <Button
          onClick={onFlip}
          disabled={disabled || !playerChoice || betAmount <= 0 || betAmount > balance}
          className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-4 h-auto text-lg transition-colors"
        >
          {disabled ? 'Flipping...' : 'Bet'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default FlipControls;