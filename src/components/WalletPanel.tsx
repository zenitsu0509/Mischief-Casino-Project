
import React from 'react';
import { Wallet } from 'lucide-react';

interface WalletPanelProps {
  balance: number;
  onAddFunds?: (amount: number) => void; // Made optional for backward compatibility
}

const WalletPanel: React.FC<WalletPanelProps> = ({ balance }) => {
  return (
    <div className="bg-game-panel rounded-lg p-4 mb-4">
      <div className="flex items-center mb-2">
        <div className="flex items-center gap-2">
          <Wallet className="text-game-gem h-4 w-4" />
          <h2 className="text-white font-bold text-sm">Wallet</h2>
        </div>
      </div>

      <div className="text-xl font-bold text-white text-center">${balance.toFixed(2)}</div>
    </div>
  );
};

export default WalletPanel;

