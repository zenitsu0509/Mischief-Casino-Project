import React, { useEffect } from 'react';
import GemsAndMines from '@/components/GemsAndMines';
import CrashGame from '@/components/CrashGame';
import WalletBar from '@/components/WalletBar';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

type GameType = 'gems' | 'crash';

interface IndexProps {
  activeGame?: GameType;
}

const Index = ({ activeGame: initialActiveGame = 'gems' }: IndexProps) => {
  const { currentUser, updateMoney, refreshUserState } = useAuth();
  
  // Refresh user state on component mount to ensure we have the latest data
  useEffect(() => {
    refreshUserState();
  }, [refreshUserState]);

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const handleAddFunds = (amount: number) => {
    if (currentUser) {
      const newBalance = currentUser.money + amount;
      updateMoney(newBalance);
    }
  };

  return (
    <div className="min-h-screen bg-[#192a38] flex flex-col items-center p-4">
      {/* Wallet Bar */}
      <div className="w-full max-w-5xl mb-4">
        <WalletBar 
          balance={currentUser?.money || 0} 
          onAddFunds={handleAddFunds} 
        />
      </div>

      {/* Game Container - Conditionally render the selected game */}
      <div className="w-full max-w-5xl">
        {initialActiveGame === 'gems' && (
          <GemsAndMines 
            initialBalance={currentUser?.money || 0} 
            onBalanceChange={(newBalance) => updateMoney(newBalance)} 
          />
        )}
        {initialActiveGame === 'crash' && (
          <CrashGame 
            initialBalance={currentUser?.money || 0} 
            onBalanceChange={(newBalance) => updateMoney(newBalance)} 
          />
        )}
      </div>
    </div>
  );
};

export default Index;