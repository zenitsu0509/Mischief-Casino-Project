import React, { useState } from 'react';
import GemsAndMines from '@/components/GemsAndMines';
import CrashGame from '@/components/CrashGame';
import WalletBar from '@/components/WalletBar';
// Button import removed as it's no longer needed

type GameType = 'gems' | 'crash';

interface IndexProps {
  activeGame?: GameType;
}

const Index = ({ activeGame: initialActiveGame = 'gems' }: IndexProps) => {
  const [walletBalance, setWalletBalance] = useState(100);
  const [activeGame] = useState<GameType>(initialActiveGame); // Remove setActiveGame as it's no longer needed

  const handleAddFunds = (amount: number) => {
    setWalletBalance(prevBalance => prevBalance + amount);
  };

  return (
    <div className="min-h-screen bg-[#192a38] flex flex-col items-center p-4">
      {/* Wallet Bar */}
      <div className="w-full max-w-5xl mb-4">
        <WalletBar balance={walletBalance} onAddFunds={handleAddFunds} />
      </div>

      {/* Game Container - Conditionally render the selected game */}
      <div className="w-full max-w-5xl">
        {activeGame === 'gems' && (
          <GemsAndMines initialBalance={walletBalance} onBalanceChange={setWalletBalance} />
        )}
        {activeGame === 'crash' && (
          <CrashGame initialBalance={walletBalance} onBalanceChange={setWalletBalance} />
        )}
      </div>
    </div>
  );
};

export default Index;