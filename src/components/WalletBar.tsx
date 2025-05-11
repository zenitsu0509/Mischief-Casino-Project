
import React from 'react';
import { Button } from '@/components/ui/button';
import { Wallet as WalletIcon } from 'lucide-react';

interface WalletBarProps {
  balance: number;
  onAddFunds?: (amount: number) => void; // Made optional for backward compatibility
}

const WalletBar: React.FC<WalletBarProps> = ({ balance }) => {
  return (
    <div className="relative">
      <Button 
        className="bg-[#2563eb]/80 hover:bg-[#3b82f6] text-white transition-all duration-200"
        size="sm"
      >
        <WalletIcon className="w-4 h-4 mr-2" />
        <span className="text-yellow-400 font-bold mr-1.5">$</span>
        <span className="text-white font-bold">
          {balance !== null && balance !== undefined ? balance.toFixed(2) : '0.00'}
        </span>
      </Button>
    </div>
  );
};

export default WalletBar;
