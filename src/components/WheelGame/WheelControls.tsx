import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MinusIcon, PlusIcon, Play } from 'lucide-react';

interface WheelControlsProps {
  onBet: (amount: number) => void;
  onSegmentsChange: (segments: number) => void;
  onRiskChange: (risk: string) => void;
  isSpinning: boolean;
  balance: number;
}

const WheelControls: React.FC<WheelControlsProps> = ({
  onBet,
  onSegmentsChange,
  onRiskChange,
  isSpinning,
  balance
}) => {
  const [betAmount, setBetAmount] = useState<number>(1);
  const [risk, setRisk] = useState<string>('Medium');
  const [segments, setSegments] = useState<number>(30);
  
  const riskOptions = ['Low', 'Medium', 'High'];
  const segmentOptions = [10, 20, 30, 40, 50];
  
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
  
  const handleSegmentsChange = (value: string) => {
    const segmentValue = parseInt(value);
    setSegments(segmentValue);
    onSegmentsChange(segmentValue);
  };

  return (
    <div className="bg-game-panel rounded-lg p-4 space-y-4">
      {/* Bet Amount Controls */}
      <div className="space-y-2">
        <div className="text-white text-sm">Bet Amount</div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={() => adjustBet(-0.1)}
            disabled={betAmount <= 0.1 || isSpinning}
            className="bg-gray-800 hover:bg-gray-700 text-white border-gray-700"
          >
            <MinusIcon size={16} />
          </Button>
          
          <Input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(parseFloat(e.target.value) || 0)}
            disabled={isSpinning}
            min={0.1}
            step={0.1}
            className="text-white bg-gray-800 border-gray-700"
          />
          
          <Button 
            variant="outline"
            size="sm"
            onClick={() => adjustBet(0.1)}
            disabled={isSpinning}
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
            disabled={isSpinning}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white border-gray-700"
          >
            ½
          </Button>
          
          <Button 
            variant="outline"
            size="sm"
            onClick={() => setBetAmount(betAmount * 2)}
            disabled={isSpinning}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white border-gray-700"
          >
            2×
          </Button>
        </div>
      </div>

      {/* Risk Selection */}
      <div className="space-y-2">
        <div className="text-white text-sm">Risk</div>
        <Select 
          value={risk}
          onValueChange={handleRiskChange}
          disabled={isSpinning}
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

      {/* Segments Selection */}
      <div className="space-y-2">
        <div className="text-white text-sm">Segments</div>
        <Select 
          value={segments.toString()}
          onValueChange={handleSegmentsChange}
          disabled={isSpinning}
        >
          <SelectTrigger className="bg-gray-800 text-white border-gray-700">
            <SelectValue placeholder="Segments" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white border-gray-700">
            {segmentOptions.map((option) => (
              <SelectItem key={option} value={option.toString()}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Bet Button */}
      <Button 
        className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-2"
        onClick={handleBet}
        disabled={isSpinning || betAmount > balance || betAmount <= 0}
      >
        <Play className="mr-2 h-5 w-5" />
        Spin
      </Button>

      <div className="pt-2 text-sm text-center text-gray-400">
        Balance: ${balance.toFixed(2)}
      </div>
    </div>
  );
};

export default WheelControls;