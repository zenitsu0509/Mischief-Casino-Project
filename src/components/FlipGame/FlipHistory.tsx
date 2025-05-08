import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';

type CoinSide = 'heads' | 'tails' | null;
type Outcome = 'win' | 'loss' | null;

interface GameHistoryItem {
  id: number;
  playerChoice: CoinSide;
  result: CoinSide;
  outcome: Outcome;
  betAmount: number;
  multiplier: number;
  payout: number;
  timestamp: Date;
}

interface FlipHistoryProps {
  history: GameHistoryItem[];
}

const FlipHistory: React.FC<FlipHistoryProps> = ({ history }) => {
  const getCoinIcon = (side: CoinSide) => {
    return side === 'heads' ? '🪙' : '💰';
  };

  return (
    <Card className="bg-game-panel/90 border-game-button/20 overflow-hidden">
      <CardContent className="p-6">
        <h3 className="text-lg font-bold text-white mb-4">Recent Flips</h3>
        
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {history.length === 0 ? (
            <div className="text-center text-gray-400 py-4">No flip history yet</div>
          ) : (
            history.map((item) => (
              <div 
                key={item.id} 
                className={`text-sm p-3 rounded-sm flex justify-between items-center ${
                  item.outcome === 'win' ? 'bg-green-500/20 border-l-4 border-green-500' : 
                  'bg-red-500/20 border-l-4 border-red-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <span className="text-2xl">{getCoinIcon(item.result)}</span>
                    <span className="text-xs text-gray-400 mt-1">{item.result}</span>
                  </div>
                  
                  <div>
                    <div className={item.outcome === 'win' ? 'text-green-400' : 'text-red-400'}>
                      {item.outcome === 'win' ? 'Win' : 'Loss'}
                    </div>
                    <div className="text-gray-400 text-xs">
                      Bet: ${item.betAmount.toFixed(2)} • {item.multiplier.toFixed(2)}x
                    </div>
                    <div className="text-gray-500 text-xs">
                      {format(new Date(item.timestamp), 'HH:mm:ss')}
                    </div>
                  </div>
                </div>
                
                <div className={`font-medium ${item.outcome === 'win' ? 'text-green-400' : 'text-red-400'}`}>
                  {item.outcome === 'win' ? `+$${(item.payout - item.betAmount).toFixed(2)}` : `-$${item.betAmount.toFixed(2)}`}
                </div>
              </div>
            ))
          )}
        </div>

        {history.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Win Rate:</span>
              <span className="text-white">
                {((history.filter(item => item.outcome === 'win').length / history.length) * 100).toFixed(1)}%
              </span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total Wagered:</span>
              <span className="text-white">
                ${history.reduce((sum, item) => sum + item.betAmount, 0).toFixed(2)}
              </span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Profit/Loss:</span>
              <span className={`font-medium ${
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

export default FlipHistory;