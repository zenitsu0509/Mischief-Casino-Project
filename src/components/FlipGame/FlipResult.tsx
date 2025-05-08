import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

type CoinSide = 'heads' | 'tails' | null;
type Outcome = 'win' | 'loss' | null;

interface FlipResultProps {
  playerChoice: CoinSide;
  result: CoinSide;
  outcome: Outcome;
  isFlipping: boolean;
  betAmount: number;
  multiplier: number;
}

const FlipResult: React.FC<FlipResultProps> = ({
  playerChoice,
  result,
  outcome,
  isFlipping,
  betAmount,
  multiplier
}) => {
  const getOutcomeText = () => {
    if (outcome === 'win') return "You Win!";
    if (outcome === 'loss') return "You Lose";
    return "Flip the Coin";
  };

  const getOutcomeClass = () => {
    if (outcome === 'win') return "text-green-400 text-2xl font-bold";
    if (outcome === 'loss') return "text-red-400 text-2xl font-bold";
    return "text-gray-300 text-2xl font-bold";
  };

  const getPayout = () => {
    if (outcome === 'win') return betAmount * multiplier;
    return 0;
  };

  const getCoinIcon = (side: CoinSide) => {
    return side === 'heads' ? '🪙' : '💰';
  };

  return (
    <Card className="bg-game-panel/90 border-game-button/20 overflow-hidden">
      <CardContent className="p-6">
        <div className="text-center mb-4">
          <div className={getOutcomeClass()}>{getOutcomeText()}</div>
          {outcome && (
            <div className="text-gray-300 mt-1">
              {outcome === 'win' && `Payout: $${getPayout().toFixed(2)}`}
              {outcome === 'loss' && 'Better luck next time!'}
            </div>
          )}
        </div>

        <div className="flex justify-center space-x-12 items-center">
          <div className="text-center">
            <div className="text-gray-300 mb-2">You Picked</div>
            <div className={`bg-game-bg/40 w-24 h-24 rounded-full flex items-center justify-center border-2 ${
              playerChoice === result && outcome === 'win' ? 'border-green-500' : 'border-game-button/30'
            }`}>
              {playerChoice ? (
                <div className={`text-white transition-all duration-300 text-5xl ${isFlipping ? 'animate-pulse' : ''}`}>
                  {getCoinIcon(playerChoice)}
                </div>
              ) : (
                <div className="text-gray-500 text-lg">Choose Side</div>
              )}
            </div>
            <div className="mt-2 text-gray-300">
              {playerChoice && playerChoice.charAt(0).toUpperCase() + playerChoice.slice(1)}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-gray-300 mb-2">Result</div>
            <div className={`bg-game-bg/40 w-24 h-24 rounded-full flex items-center justify-center border-2 ${
              outcome === 'win' ? 'border-green-500' : 
              outcome === 'loss' ? 'border-red-500' : 
              'border-game-button/30'
            }`}>
              {result ? (
                <div className="text-white text-5xl">
                  {getCoinIcon(result)}
                </div>
              ) : (
                <div className={`text-gray-300 text-5xl ${isFlipping ? 'animate-flip' : ''}`}>
                  {isFlipping ? '🪙' : '?'}
                </div>
              )}
            </div>
            <div className="mt-2 text-gray-300">
              {result && result.charAt(0).toUpperCase() + result.slice(1)}
            </div>
          </div>
        </div>

        {/* Multiplier display */}
        <div className="mt-6 text-center">
          <div className="text-gray-400 text-sm">Current Multiplier</div>
          <div className="text-yellow-400 font-bold text-2xl">{multiplier.toFixed(2)}x</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FlipResult;