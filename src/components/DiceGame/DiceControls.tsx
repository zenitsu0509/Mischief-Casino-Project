
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DollarSign } from 'lucide-react';

interface DiceControlsProps {
  betAmount: number;
  onBetAmountChange: (amount: number) => void;
  onRoll: () => void;
  isRolling: boolean;
  potentialWin: number;
  balance: number;
}

const DiceControls: React.FC<DiceControlsProps> = ({
  betAmount,
  onBetAmountChange,
  onRoll,
  isRolling,
  potentialWin,
  balance
}) => {
  const handleBetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      onBetAmountChange(value);
    } else if (e.target.value === '') {
      onBetAmountChange(0);
    }
  };

  const handleHalfBet = () => {
    onBetAmountChange(betAmount / 2);
  };

  const handleDoubleBet = () => {
    onBetAmountChange(betAmount * 2);
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
            />
            <DollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 text-yellow-500 h-4 w-4" />
          </div>
          <Button 
            onClick={handleHalfBet}
            variant="outline" 
            size="sm"
            className="bg-game-bg/40 border-game-button/20 text-white hover:bg-game-bg/70"
          >
            ½
          </Button>
          <Button 
            onClick={handleDoubleBet}
            variant="outline" 
            size="sm"
            className="bg-game-bg/40 border-game-button/20 text-white hover:bg-game-bg/70"
          >
            2×
          </Button>
        </div>
      </div>

      {/* Profit on Win */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-gray-300 text-sm">Profit on Win</label>
          <span className="text-gray-300 text-sm">${(potentialWin - betAmount).toFixed(2)}</span>
        </div>
        <div className="relative">
          <Input
            type="text"
            value={(potentialWin - betAmount).toFixed(2)}
            readOnly
            className="bg-game-bg/40 text-white border-game-button/20 pr-10"
          />
          <DollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 text-yellow-500 h-4 w-4" />
        </div>
      </div>

      {/* Roll Button */}
      <Button
        onClick={onRoll}
        disabled={isRolling || betAmount <= 0}
        className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-4 h-auto text-lg transition-colors"
      >
        {isRolling ? 'Rolling...' : 'Bet'}
      </Button>
    </div>
  );
};

export default DiceControls;
