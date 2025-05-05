
import React, { useEffect, useState } from 'react';
import GemsAndMines from '@/components/GemsAndMines';
import CrashGame from '@/components/CrashGame';
import PlinkoGame from '@/components/PlinkoGame';
import WheelGame from '@/components/WheelGame';
import DiceGame from '@/components/DiceGame';
import RPSGame from '@/components/RPSGame';
import WalletBar from '@/components/WalletBar';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

type GameType = 'gems' | 'crash' | 'plinko' | 'wheel' | 'dice' | 'rps';

interface IndexProps {
  activeGame?: GameType;
}

const Index = ({ activeGame: initialActiveGame = 'gems' }: IndexProps) => {
  const { currentUser, updateMoney, refreshUserState } = useAuth();
  const [userBalance, setUserBalance] = useState<number>(currentUser?.money || 0);
  
  // Refresh user state on component mount to ensure we have the latest data
  useEffect(() => {
    refreshUserState();
    if (currentUser) {
      setUserBalance(currentUser.money);
    }
  }, [refreshUserState, currentUser]);

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const handleAddFunds = (amount: number) => {
    if (currentUser) {
      const newBalance = currentUser.money + amount;
      updateMoney(newBalance);
      setUserBalance(newBalance);
    }
  };

  const handleBalanceChange = (newBalance: number) => {
    updateMoney(newBalance);
    setUserBalance(newBalance);
  };

  return (
    <div className="min-h-screen bg-[#192a38] flex flex-col items-center p-4">
      {/* Wallet Bar */}
      <div className="w-full max-w-5xl mb-4">
        <WalletBar 
          balance={userBalance} 
          onAddFunds={handleAddFunds} 
        />
      </div>

      {/* Game Container - Conditionally render the selected game */}
      <div className="w-full max-w-5xl">
        {initialActiveGame === 'gems' && (
          <GemsAndMines 
            initialBalance={userBalance} 
            onBalanceChange={handleBalanceChange} 
          />
        )}
        {initialActiveGame === 'crash' && (
          <CrashGame 
            initialBalance={userBalance} 
            onBalanceChange={handleBalanceChange} 
          />
        )}
        {initialActiveGame === 'plinko' && (
          <div className="bg-game-panel p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">Plinko Game</h2>
            <PlinkoGame />
          </div>
        )}
        {initialActiveGame === 'wheel' && (
          <div className="bg-game-panel p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">Wheel Game</h2>
            <WheelGame />
          </div>
        )}
        {initialActiveGame === 'dice' && (
          <div className="bg-game-panel p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">Dice Game</h2>
            <DiceGame />
          </div>
        )}
        {initialActiveGame === 'rps' && (
          <div className="bg-game-panel p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">Rock Paper Scissors</h2>
            <RPSGame />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
