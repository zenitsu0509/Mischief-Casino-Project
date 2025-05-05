
import React, { useState } from 'react';
import PlinkoBoard from './PlinkoBoard';
import PlinkoControls from './PlinkoControls';
import PlinkoResult from './PlinkoResult';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { updateUserStats } from '@/services/UserService';

const PlinkoGame: React.FC = () => {
  const { currentUser, updateMoney, refreshUserState } = useAuth();
  const { toast } = useToast();
  
  const [rows, setRows] = useState<number>(16);
  const [risk, setRisk] = useState<string>('Medium');
  const [isDropping, setIsDropping] = useState<boolean>(false);
  const [betAmount, setBetAmount] = useState<number>(0);
  const [lastMultiplier, setLastMultiplier] = useState<number | null>(null);

  // Always refresh user state to ensure we have the latest balance
  React.useEffect(() => {
    refreshUserState();
  }, [refreshUserState]);

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
    
    // Update balance in the context and database
    const newBalance = currentUser.money - amount;
    updateMoney(newBalance);
    
    setIsDropping(true);
    setLastMultiplier(null);
  };

  const handleBallLand = (multiplier: number) => {
    const winnings = betAmount * multiplier;
    setLastMultiplier(multiplier);

    // Update user balance with winnings
    if (currentUser) {
      const newBalance = currentUser.money + winnings;
      updateMoney(newBalance);
      
      // Track statistics
      if (currentUser.username) {
        updateUserStats(currentUser.username, winnings, betAmount);
      }

      // Show toast with result
      if (multiplier >= 1) {
        toast({
          title: "You won!",
          description: `You won $${winnings.toFixed(2)}`,
        });
      } else {
        toast({
          title: "Better luck next time",
          description: `You lost $${(betAmount - winnings).toFixed(2)}`,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {/* Controls */}
      <div className="md:col-span-1">
        <PlinkoControls
          onBet={handleBet}
          onRowsChange={setRows}
          onRiskChange={setRisk}
          isDropping={isDropping}
          balance={currentUser?.money || 0}
        />
      </div>
      
      {/* Game Board */}
      <div className="md:col-span-2 lg:col-span-3 relative">
        <PlinkoBoard
          rows={rows}
          risk={risk}
          onBallLand={handleBallLand}
          isDropping={isDropping}
          setIsDropping={setIsDropping}
        />
        
        <PlinkoResult
          multiplier={lastMultiplier}
          betAmount={betAmount}
        />
      </div>
    </div>
  );
};

export default PlinkoGame;
