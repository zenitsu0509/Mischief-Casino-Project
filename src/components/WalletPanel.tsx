
import React, { useState } from 'react';
import { Plus, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface WalletPanelProps {
  balance: number;
  onAddFunds: (amount: number) => void;
}

const WalletPanel: React.FC<WalletPanelProps> = ({ balance, onAddFunds }) => {
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [fundAmount, setFundAmount] = useState<number>(10);
  const { toast } = useToast();

  const handleAddFunds = () => {
    if (fundAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a positive amount",
        variant: "destructive"
      });
      return;
    }

    onAddFunds(fundAmount);
    setShowAddFunds(false);
    setFundAmount(10);
    
    toast({
      title: "Funds Added",
      description: `$${fundAmount.toFixed(2)} has been added to your wallet`,
    });
  };

  return (
    <div className="bg-game-panel rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Wallet className="text-game-gem h-4 w-4" />
          <h2 className="text-white font-bold text-sm">Wallet</h2>
        </div>
        <Button 
          onClick={() => setShowAddFunds(true)}
          size="sm"  // Changed from "xs" to valid "sm" size
          variant="outline"
          className="flex items-center justify-center bg-transparent hover:bg-game-button/10 text-white border-game-button/30 text-xs px-2 py-1"
        >
          <Plus className="mr-1 h-3 w-3" /> Add
        </Button>
      </div>

      <div className="text-xl font-bold text-white text-center">${balance.toFixed(2)}</div>

      {showAddFunds && (
        <div className="mt-2 space-y-2">
          <Input
            type="number"
            min="1"
            step="1"
            value={fundAmount}
            onChange={(e) => setFundAmount(parseFloat(e.target.value) || 0)}
            className="bg-gray-800 text-white border-gray-700 h-8"
          />
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowAddFunds(false)}
              variant="outline" 
              size="sm"
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddFunds}
              size="sm"
              className="flex-1 bg-game-button hover:bg-opacity-90 text-black"
            >
              Confirm
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletPanel;

