import React, { useState } from 'react';
import GemsAndMines from '@/components/GemsAndMines';
import CrashGame from '@/components/CrashGame';
import WalletBar from '@/components/WalletBar';
import { Button } from '@/components/ui/button';

type GameType = 'gems' | 'crash';

const Index = () => {
  const [walletBalance, setWalletBalance] = useState(100);
  const [activeGame, setActiveGame] = useState<GameType>('gems');

  const handleAddFunds = (amount: number) => {
    setWalletBalance(prevBalance => prevBalance + amount);
  };

  return (
    <div className="min-h-screen bg-[#192a38] flex flex-col items-center p-4">
      {/* Wallet Bar */}
      <div className="w-full max-w-5xl mb-4">
        <WalletBar balance={walletBalance} onAddFunds={handleAddFunds} />
      </div>

      {/* Game Selection Buttons */}
      <div className="flex gap-4 mb-8">
        <Button
          onClick={() => setActiveGame('gems')}
          variant={activeGame === 'gems' ? 'default' : 'outline'}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Gems & Mines
        </Button>
        <Button
          onClick={() => setActiveGame('crash')}
          variant={activeGame === 'crash' ? 'default' : 'outline'}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Crash Game
        </Button>
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