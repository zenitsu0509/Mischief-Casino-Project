
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
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Wallet className="text-game-gem h-5 w-5" />
          <h2 className="text-white font-bold">Wallet</h2>
        </div>
        <div className="text-xl font-bold text-white">${balance.toFixed(2)}</div>
      </div>

      {!showAddFunds ? (
        <Button 
          onClick={() => setShowAddFunds(true)}
          className="mt-3 w-full flex items-center justify-center py-2 bg-game-button hover:bg-opacity-90 text-black"
        >
          <Plus className="mr-1 h-4 w-4" /> Add Funds
        </Button>
      ) : (
        <div className="mt-3 space-y-2">
          <Input
            type="number"
            min="1"
            step="1"
            value={fundAmount}
            onChange={(e) => setFundAmount(parseFloat(e.target.value) || 0)}
            className="bg-gray-800 text-white border-gray-700"
          />
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowAddFunds(false)}
              variant="outline" 
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddFunds}
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
