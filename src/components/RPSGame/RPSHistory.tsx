
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Choice = 'rock' | 'paper' | 'scissors' | null;
type Outcome = 'win' | 'loss' | 'draw' | null;

interface GameHistoryItem {
  id: number;
  playerChoice: Choice;
  computerChoice: Choice;
  outcome: Outcome;
  betAmount: number;
  payout: number;
  timestamp: Date;
}

interface RPSHistoryProps {
  history: GameHistoryItem[];
}

const RPSHistory: React.FC<RPSHistoryProps> = ({ history }) => {
  const getChoiceIcon = (choice: Choice) => {
    if (choice === 'rock') return "✊";
    if (choice === 'paper') return "✋";
    if (choice === 'scissors') return "✌️";
    return null;
  };

  const getOutcomeColor = (outcome: Outcome) => {
    if (outcome === 'win') return "text-green-400";
    if (outcome === 'loss') return "text-red-400";
    if (outcome === 'draw') return "text-yellow-400";
    return "text-gray-300";
  };

  if (history.length === 0) {
    return (
      <Card className="bg-game-panel/90 border-game-button/20">
        <CardHeader>
          <CardTitle className="text-lg text-white">Game History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-400 text-center py-4">
            No games played yet. Make your first choice!
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-game-panel/90 border-game-button/20">
      <CardHeader>
        <CardTitle className="text-lg text-white">Game History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs uppercase bg-game-bg/40">
              <tr>
                <th className="py-3 px-4">Game</th>
                <th className="py-3 px-4">You</th>
                <th className="py-3 px-4">Computer</th>
                <th className="py-3 px-4">Bet</th>
                <th className="py-3 px-4">Outcome</th>
                <th className="py-3 px-4">Payout</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, index) => (
                <tr key={item.id} className="border-b border-game-button/10">
                  <td className="py-2 px-4">{history.length - index}</td>
                  <td className="py-2 px-4 flex items-center">
                    <span className="mr-2">{getChoiceIcon(item.playerChoice)}</span>
                    <span className="capitalize">{item.playerChoice}</span>
                  </td>
                  <td className="py-2 px-4 flex items-center">
                    <span className="mr-2">{getChoiceIcon(item.computerChoice)}</span>
                    <span className="capitalize">{item.computerChoice}</span>
                  </td>
                  <td className="py-2 px-4">${item.betAmount.toFixed(2)}</td>
                  <td className={`py-2 px-4 font-medium ${getOutcomeColor(item.outcome)}`}>
                    {item.outcome && item.outcome.charAt(0).toUpperCase() + item.outcome.slice(1)}
                  </td>
                  <td className="py-2 px-4">${item.payout.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RPSHistory;
