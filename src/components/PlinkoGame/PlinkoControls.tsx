
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, MinusIcon, PlusIcon, Settings } from 'lucide-react';

interface PlinkoControlsProps {
  onBet: (amount: number) => void;
  onRowsChange: (rows: number) => void;
  onRiskChange: (risk: string) => void;
  isDropping: boolean;
  balance: number;
}

const PlinkoControls: React.FC<PlinkoControlsProps> = ({ 
  onBet, 
  onRowsChange, 
  onRiskChange, 
  isDropping, 
  balance
}) => {
  const [betAmount, setBetAmount] = useState<number>(1);
  const [risk, setRisk] = useState<string>('Medium');
  const [rows, setRows] = useState<number>(16);
  
  const riskOptions = ['Low', 'Medium', 'High'];
  const rowsOptions = [8, 9, 10, 11, 12, 13, 14, 15, 16];
  
  const handleBet = () => {
    if (betAmount > balance) return;
    onBet(betAmount);
  };
  
  const adjustBet = (amount: number) => {
    const newAmount = Math.max(0.1, betAmount + amount);
    setBetAmount(parseFloat(newAmount.toFixed(2)));
  };

  const handleRiskChange = (value: string) => {
    setRisk(value);
    onRiskChange(value);
  };
  
  const handleRowsChange = (value: string) => {
    const rowsValue = parseInt(value);
    setRows(rowsValue);
    onRowsChange(rowsValue);
  };

  return (
    <div className="bg-game-panel rounded-lg p-4 space-y-4">
      <div className="space-y-2">
        <div className="text-white text-sm">Bet Amount</div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={() => adjustBet(-0.1)}
            disabled={betAmount <= 0.1 || isDropping}
            className="bg-gray-800 hover:bg-gray-700 text-white border-gray-700"
          >
            <MinusIcon size={16} />
          </Button>
          
          <Input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(parseFloat(e.target.value) || 0)}
            disabled={isDropping}
            min={0.1}
            step={0.1}
            className="text-white bg-gray-800 border-gray-700"
          />
          
          <Button 
            variant="outline"
            size="sm"
            onClick={() => adjustBet(0.1)}
            disabled={isDropping}
            className="bg-gray-800 hover:bg-gray-700 text-white border-gray-700"
          >
            <PlusIcon size={16} />
          </Button>
        </div>

        <div className="flex gap-3">
          <Button 
            variant="outline"
            size="sm"
            onClick={() => setBetAmount(Math.max(0.1, betAmount / 2))}
            disabled={isDropping}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white border-gray-700"
          >
            ½
          </Button>
          
          <Button 
            variant="outline"
            size="sm"
            onClick={() => setBetAmount(betAmount * 2)}
            disabled={isDropping}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white border-gray-700"
          >
            2×
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-white text-sm">Risk</div>
        <Select 
          value={risk}
          onValueChange={handleRiskChange}
          disabled={isDropping}
        >
          <SelectTrigger className="bg-gray-800 text-white border-gray-700">
            <SelectValue placeholder="Risk" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white border-gray-700">
            {riskOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="text-white text-sm">Rows</div>
        <Select 
          value={rows.toString()}
          onValueChange={handleRowsChange}
          disabled={isDropping}
        >
          <SelectTrigger className="bg-gray-800 text-white border-gray-700">
            <SelectValue placeholder="Rows" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white border-gray-700">
            {rowsOptions.map((option) => (
              <SelectItem key={option} value={option.toString()}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button 
        className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-2"
        onClick={handleBet}
        disabled={isDropping || betAmount > balance || betAmount <= 0}
      >
        <Play className="mr-2 h-5 w-5" />
        Bet
      </Button>
    </div>
  );
};

export default PlinkoControls;
