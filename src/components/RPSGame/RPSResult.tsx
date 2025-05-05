
import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

type Choice = 'rock' | 'paper' | 'scissors' | null;
type Outcome = 'win' | 'loss' | 'draw' | null;

interface RPSResultProps {
  playerChoice: Choice;
  computerChoice: Choice;
  outcome: Outcome;
  isPlaying: boolean;
  betAmount: number;
}

const RPSResult: React.FC<RPSResultProps> = ({
  playerChoice,
  computerChoice,
  outcome,
  isPlaying,
  betAmount
}) => {
  const getChoiceIcon = (choice: Choice) => {
    if (choice === 'rock') return "✊";
    if (choice === 'paper') return "✋";
    if (choice === 'scissors') return "✌️";
    return <HelpCircle className="h-12 w-12 text-gray-500" />;
  };

  const getOutcomeText = () => {
    if (isPlaying && !outcome) return "Waiting...";
    if (outcome === 'win') return "You Win!";
    if (outcome === 'loss') return "You Lose";
    if (outcome === 'draw') return "Draw";
    return "Make Your Choice";
  };

  const getOutcomeClass = () => {
    if (outcome === 'win') return "text-green-400 text-2xl font-bold";
    if (outcome === 'loss') return "text-red-400 text-2xl font-bold";
    if (outcome === 'draw') return "text-yellow-400 text-2xl font-bold";
    return "text-gray-300 text-2xl font-bold";
  };

  const getPayout = () => {
    if (outcome === 'win') return betAmount * 1.98;
    if (outcome === 'draw') return betAmount;
    return 0;
  };

  return (
    <Card className="bg-game-panel/90 border-game-button/20 overflow-hidden">
      <CardContent className="p-6">
        <div className="text-center mb-4">
          <div className={getOutcomeClass()}>{getOutcomeText()}</div>
          {outcome && (
            <div className="text-gray-300 mt-1">
              {outcome === 'win' && `Payout: $${getPayout().toFixed(2)}`}
              {outcome === 'draw' && 'Your bet has been returned'}
              {outcome === 'loss' && 'Better luck next time!'}
            </div>
          )}
        </div>

        <div className="flex justify-center space-x-12 items-center">
          <div className="text-center">
            <div className="text-gray-300 mb-2">You</div>
            <div className="bg-game-bg/40 w-24 h-24 rounded-full flex items-center justify-center border-2 border-game-button/30">
              {playerChoice ? (
                <div className={`text-white transition-all duration-300 text-4xl ${isPlaying && !outcome ? 'animate-pulse' : ''}`}>
                  {getChoiceIcon(playerChoice)}
                </div>
              ) : (
                <div className="text-gray-500">?</div>
              )}
            </div>
          </div>

          <div className="text-xl font-bold text-white">VS</div>

          <div className="text-center">
            <div className="text-gray-300 mb-2">Computer</div>
            <div className="bg-game-bg/40 w-24 h-24 rounded-full flex items-center justify-center border-2 border-game-button/30">
              {computerChoice ? (
                <div className="text-white text-4xl">
                  {getChoiceIcon(computerChoice)}
                </div>
              ) : (
                <div className={`text-gray-500 ${isPlaying ? 'animate-pulse' : ''}`}>?</div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RPSResult;
