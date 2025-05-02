
import React, { useState } from 'react';
import GemsAndMines from '@/components/GemsAndMines';
import WalletBar from '@/components/WalletBar';
import { useAuth } from '@/contexts/AuthContext';
import { getUserData, updateUserData } from '@/services/UserService';

const Index = () => {
  const { currentUser } = useAuth();
  const [walletBalance, setWalletBalance] = useState(100);

  const handleAddFunds = async (amount: number) => {
    const newBalance = walletBalance + amount;
    setWalletBalance(newBalance);
    
    if (currentUser) {
      await updateUserData(currentUser.uid, {
        walletBalance: newBalance
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#192a38] flex flex-col">
      <WalletBar balance={walletBalance} onAddFunds={handleAddFunds} />
      <div className="flex-1 py-8">
        <GemsAndMines initialBalance={walletBalance} onBalanceChange={setWalletBalance} />
      </div>
    </div>
  );
};

export default Index;
