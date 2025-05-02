// File: src/pages/Index.tsx
// Adjust layout for centering and apply max-width
import React, { useState } from 'react';
import GemsAndMines from '@/components/GemsAndMines';
import WalletBar from '@/components/WalletBar';

const Index = () => {
  const [walletBalance, setWalletBalance] = useState(100);

  const handleAddFunds = (amount: number) => {
    setWalletBalance(prevBalance => prevBalance + amount);
  };

  return (
    <div className="min-h-screen bg-[#192a38] flex flex-col items-center justify-center p-4">
      {/* Apply consistent width to WalletBar */}
      <div className="w-full max-w-5xl"> 
        <WalletBar balance={walletBalance} onAddFunds={handleAddFunds} />
      </div>
      {/* Apply consistent width to the game container */}
      <div className="mt-6 w-full max-w-5xl"> 
        <GemsAndMines initialBalance={walletBalance} onBalanceChange={setWalletBalance} />
      </div>
    </div>
  );
};

export default Index;