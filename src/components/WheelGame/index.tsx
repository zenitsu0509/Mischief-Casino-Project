import React, { useState } from 'react';
import WheelBoard from './WheelBoard';
import WheelControls from './WheelControls';
import WheelResult from './WheelResult';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const WheelGame: React.FC = () => {
  const { currentUser, updateMoney } = useAuth();
  const { toast } = useToast();
  
  // Game state
  const [betAmount, setBetAmount] = useState<number>(1);
  const [segments, setSegments] = useState<number>(30);
  const [risk, setRisk] = useState<string>('Medium');
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [lastMultiplier, setLastMultiplier] = useState<number | null>(null);
  const [multipliers, setMultipliers] = useState<number[]>([]);

  const handleBet = (amount: number) => {
    if (!currentUser) {
      toast({
        title: "Please login",
        description: "You need to login to play the game",
        variant: "destructive"
      });
      return;
    }

    if (amount > currentUser.money) {
      toast({
        title: "Insufficient funds",
        description: "You don't have enough balance",
        variant: "destructive"
      });
      return;
    }

    if (amount <= 0) {
      toast({
        title: "Invalid bet amount",
        description: "Bet amount must be greater than zero",
        variant: "destructive"
      });
      return;
    }

    // Set betting amount and deduct from balance
    setBetAmount(amount);
    updateMoney(currentUser.money - amount); // Deduct bet amount immediately
    setIsSpinning(true);
  };

  const handleWheelStop = (multiplier: number) => {
    const winnings = betAmount * multiplier;
    setLastMultiplier(multiplier);

    // Update user balance with winnings
    if (currentUser) {
      // Balance was already reduced by betAmount in handleBet
      // So, only add the winnings here.
      const newBalance = currentUser.money + winnings; 
      updateMoney(newBalance);

      // Show toast with result
      if (multiplier > 0) {
        toast({
          title: "You won!",
          description: `You won $${winnings.toFixed(2)}`,
        });
      } else {
        toast({
          title: "Better luck next time",
          description: `You lost $${betAmount.toFixed(2)}`,
          variant: "destructive",
        });
      }
    }
  };

  // Handle updates to segment count or risk level
  const handleSegmentsChange = (count: number) => {
    setSegments(count);
  };

  const handleRiskChange = (level: string) => {
    setRisk(level);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {/* Controls */}
      <div className="md:col-span-1">
        <WheelControls
          onBet={handleBet}
          onSegmentsChange={handleSegmentsChange}
          onRiskChange={handleRiskChange}
          isSpinning={isSpinning}
          balance={currentUser?.money || 0}
        />
      </div>
      
      {/* Game Board */}
      <div className="md:col-span-2 lg:col-span-3 relative">
        <WheelBoard
          segments={segments}
          risk={risk}
          onWheelStop={handleWheelStop}
          isSpinning={isSpinning}
          setIsSpinning={setIsSpinning}
          setMultipliers={setMultipliers}
        />
        
        <WheelResult
          multiplier={lastMultiplier}
          betAmount={betAmount}
        />
      </div>
    </div>
  );
};

export default WheelGame;