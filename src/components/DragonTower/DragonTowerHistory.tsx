import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { GameHistoryItem } from './index';

interface DragonTowerHistoryProps {
  history: GameHistoryItem[];
  className?: string;
}

const DragonTowerHistory: React.FC<DragonTowerHistoryProps> = ({ history, className }) => {
  // Helper function to get the outcome icon
  const getOutcomeIcon = (outcome: 'win' | 'loss' | 'cashout' | null) => {
    switch (outcome) {
      case 'win':
        return '🏆';
      case 'cashout':
        return '💰';
      case 'loss':
        return '❌';
      default:
        return '❓';
    }
  };
  return (
    <Card className={`bg-game-panel/90 border-game-button/20 overflow-hidden ${className}`}>
      <CardContent className="p-3">
        <h3 className="text-sm font-bold text-white mb-2">Recent Games</h3>
        
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {history.length === 0 ? (
            <div className="text-center text-gray-400 py-2 text-xs">No game history yet</div>
          ) : (
            history.map((item) => (
              <div 
                key={item.id} 
                className={`text-xs p-2 rounded-sm flex justify-between items-center ${
                  item.outcome === 'win' || item.outcome === 'cashout' 
                    ? 'bg-green-500/20 border-l-2 border-green-500' 
                    : 'bg-red-500/20 border-l-2 border-red-500'
                }`}
              >                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-center">
                    <span className="text-base">{getOutcomeIcon(item.outcome)}</span>
                    <span className="text-[10px] text-gray-400">
                      {item.outcome === 'win' ? 'Win' : item.outcome === 'cashout' ? 'Cash' : 'Loss'}
                    </span>
                  </div>
                  
                  <div>
                    <div className={`font-medium text-xs ${
                      item.outcome === 'win' || item.outcome === 'cashout' 
                        ? 'text-green-400' 
                        : 'text-red-400'
                    }`}>
                      Lvl {item.level} - {item.difficulty.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-gray-400 text-[10px]">
                      ${item.betAmount.toFixed(2)} • {item.multiplier.toFixed(2)}x
                    </div>
                    <div className="text-gray-500 text-[10px]">
                      {format(new Date(item.timestamp), 'HH:mm')}
                    </div>
                  </div>
                </div>
                
                <div className={`font-medium ${
                  item.outcome === 'win' || item.outcome === 'cashout' 
                    ? 'text-green-400' 
                    : 'text-red-400'
                }`}>
                  {item.outcome === 'win' || item.outcome === 'cashout' 
                    ? `+$${(item.payout - item.betAmount).toFixed(2)}` 
                    : `-$${item.betAmount.toFixed(2)}`}
                </div>
              </div>
            ))
          )}
        </div>        {history.length > 0 && (
          <div className="mt-2 space-y-1 border-t border-game-button/20 pt-2">
            <div className="flex justify-between">
              <span className="text-gray-400 text-xs">Win Rate:</span>
              <span className="text-white text-xs">
                {((history.filter(item => item.outcome === 'win' || item.outcome === 'cashout').length / history.length) * 100).toFixed(1)}%
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400 text-xs">Wagered:</span>
              <span className="text-white text-xs">
                ${history.reduce((sum, item) => sum + item.betAmount, 0).toFixed(2)}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400 text-xs">Profit:</span>
              <span className={`font-medium text-xs ${
                history.reduce((sum, item) => sum + (item.payout - item.betAmount), 0) >= 0 
                  ? 'text-green-400' 
                  : 'text-red-400'
              }`}>
                ${history.reduce((sum, item) => sum + (item.payout - item.betAmount), 0).toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DragonTowerHistory;
