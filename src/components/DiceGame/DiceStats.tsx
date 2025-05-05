
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface DiceStatsProps {
  multiplier: number;
  targetNumber: number;
  isRollOver: boolean;
  onRollTypeToggle: () => void;
  winChance: number;
}

const DiceStats: React.FC<DiceStatsProps> = ({
  multiplier,
  targetNumber,
  isRollOver,
  onRollTypeToggle,
  winChance
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Multiplier */}
      <div className="bg-game-bg/30 p-4 rounded-md">
        <div className="text-gray-300 text-sm mb-1">Multiplier</div>
        <div className="flex items-center">
          <div className="text-white font-bold text-xl flex-1">
            {multiplier.toFixed(4)}
          </div>
          <div className="text-gray-400">
            x
          </div>
        </div>
      </div>
      
      {/* Roll Type */}
      <div className="bg-game-bg/30 p-4 rounded-md">
        <div className="text-gray-300 text-sm mb-1">Roll Type</div>
        <div className="flex items-center">
          <div className="text-white font-bold text-xl flex-1">
            {isRollOver ? 'Roll Over' : 'Roll Under'} {targetNumber.toFixed(2)}
          </div>
          <Button 
            onClick={onRollTypeToggle}
            size="sm"
            variant="outline"
            className="bg-transparent border-game-button/30 hover:bg-game-button/10"
          >
            <RefreshCw className="h-4 w-4 text-gray-300" />
          </Button>
        </div>
      </div>
      
      {/* Win Chance */}
      <div className="bg-game-bg/30 p-4 rounded-md">
        <div className="text-gray-300 text-sm mb-1">Win Chance</div>
        <div className="flex items-center">
          <div className="text-white font-bold text-xl flex-1">
            {winChance.toFixed(4)}
          </div>
          <div className="text-gray-400">
            %
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiceStats;
