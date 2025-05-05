
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DollarSign, HandRock, HandPaper, HandScissors } from 'lucide-react';

type Choice = 'rock' | 'paper' | 'scissors' | null;

interface RPSControlsProps {
  balance: number;
  betAmount: number;
  onBetAmountChange: (amount: number) => void;
  onPlay: (choice: Choice) => void;
  onHalfBet: () => void;
  onDoubleBet: () => void;
  disabled: boolean;
}

const RPSControls: React.FC<RPSControlsProps> = ({
  balance,
  betAmount,
  onBetAmountChange,
  onPlay,
  onHalfBet,
  onDoubleBet,
  disabled
}) => {
  const handleBetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      onBetAmountChange(value);
    } else if (e.target.value === '') {
      onBetAmountChange(0);
    }
  };

  return (
    <div className="bg-game-panel p-6 rounded-lg shadow-lg space-y-4">
      {/* Bet Amount */}
      <div>
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

      <div>
        <div className="mb-2 text-gray-300 text-sm">Make your choice</div>
        <div className="grid grid-cols-3 gap-2">
          <Button
            onClick={() => onPlay('rock')}
            disabled={disabled}
            className="bg-game-panel hover:bg-game-button/20 text-white border border-game-button/20 flex flex-col items-center py-6"
            variant="outline"
          >
            <HandRock className="h-8 w-8 mb-2" />
            <span>Rock</span>
          </Button>
          
          <Button
            onClick={() => onPlay('paper')}
            disabled={disabled}
            className="bg-game-panel hover:bg-game-button/20 text-white border border-game-button/20 flex flex-col items-center py-6"
            variant="outline"
          >
            <HandPaper className="h-8 w-8 mb-2" />
            <span>Paper</span>
          </Button>
          
          <Button
            onClick={() => onPlay('scissors')}
            disabled={disabled}
            className="bg-game-panel hover:bg-game-button/20 text-white border border-game-button/20 flex flex-col items-center py-6"
            variant="outline"
          >
            <HandScissors className="h-8 w-8 mb-2" />
            <span>Scissors</span>
          </Button>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-game-button/20">
        <div className="text-center text-sm text-gray-300">
          <div className="mb-1">Win: 1.98x</div>
          <div className="mb-1">Draw: 1.00x (Money back)</div>
          <div>Loss: 0.00x</div>
        </div>
      </div>
    </div>
  );
};

export default RPSControls;
