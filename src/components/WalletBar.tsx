import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Wallet as WalletIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WalletBarProps {
  balance: number;
  onAddFunds: (amount: number) => void;
}

const WalletBar: React.FC<WalletBarProps> = ({ balance, onAddFunds }) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [amount, setAmount] = useState(10);
  const [customAmount, setCustomAmount] = useState("");
  const { toast } = useToast();

  const handleAddFunds = () => {
    const finalAmount = customAmount ? parseFloat(customAmount) : amount;
    
    if (finalAmount <= 0 || isNaN(finalAmount)) {
      toast({
        title: "Invalid amount",
        description: "Please enter a positive amount",
        variant: "destructive"
      });
      return;
    }
    
    onAddFunds(finalAmount);
    setShowAddDialog(false);
    setCustomAmount("");
    
    toast({
      title: "Funds added",
      description: `$${finalAmount.toFixed(2)} has been added to your wallet`
    });
  };

  return (
    <div className="w-full bg-[#192a38] py-3 px-4 flex justify-between items-center rounded-lg">
      <div className="flex items-center gap-2">
        <span className="text-yellow-400 font-bold">$</span>
        <span className="text-white font-bold">{balance.toFixed(2)}</span>
      </div>
      
      <Button 
        onClick={() => setShowAddDialog(!showAddDialog)}
        className="bg-[#2563eb] hover:bg-[#3b82f6] text-white"
        size="sm"
      >
        <WalletIcon className="w-4 h-4 mr-2" />
        Wallet
      </Button>
      
      {showAddDialog && (
        <div className="absolute right-4 top-16 bg-[#1a1f2c] p-3 rounded-lg shadow-xl border border-blue-900/30 z-10 w-64">
          <div className="text-white font-medium mb-2">Add funds</div>
          <div className="flex gap-2 mb-2">
            {[10, 50, 100].map((value) => (
              <Button
                key={value}
                size="sm"
                variant={amount === value && !customAmount ? "default" : "outline"}
                className={amount === value && !customAmount ? "bg-[#2563eb] text-white" : "bg-[#1a323f] text-white border-[#2c4257]"}
                onClick={() => {
                  setAmount(value);
                  setCustomAmount("");
                }}
              >
                ${value}
              </Button>
            ))}
          </div>
          <div className="mb-2">
            <Input
              type="number"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                if (e.target.value) setAmount(0);
              }}
              placeholder="Enter custom amount"
              className="bg-[#1a323f] text-white border-[#2c4257] h-9 mb-1"
            />
          </div>
          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 bg-[#1a323f] hover:bg-[#234155] text-white border-[#2c4257]"
              onClick={() => setShowAddDialog(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-[#2563eb] hover:bg-[#3b82f6] text-white"
              onClick={handleAddFunds}
            >
              Add
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletBar;
