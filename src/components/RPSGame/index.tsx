import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { useAuth } from '@/contexts/AuthContext';
import RPSControls from './RPSControls';
import RPSResult from './RPSResult';
import RPSHistory from './RPSHistory';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button'; // Import Button

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

const RPSGame: React.FC = () => {
  const { currentUser, updateMoney } = useAuth();
  const [balance, setBalance] = useState(currentUser?.money || 0);
  const [betAmount, setBetAmount] = useState(1);
  const [playerChoice, setPlayerChoice] = useState<Choice>(null);
  const [computerChoice, setComputerChoice] = useState<Choice>(null);
  const [outcome, setOutcome] = useState<Outcome>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [history, setHistory] = useState<GameHistoryItem[]>([]);

  // Use effect to update balance from currentUser, but only when currentUser.money changes
  useEffect(() => {
    if (currentUser?.money !== undefined) {
      setBalance(currentUser.money);
    }
  }, [currentUser?.money]); // Only update when money value changes, not on every render

  const determineWinner = (player: Choice, computer: Choice): Outcome => {
    if (player === computer) return 'draw';
    if (
      (player === 'rock' && computer === 'scissors') ||
      (player === 'paper' && computer === 'rock') ||
      (player === 'scissors' && computer === 'paper')
    ) {
      return 'win';
    }
    return 'loss';
  };

  const getRandomChoice = (): Choice => {
    const choices: Choice[] = ['rock', 'paper', 'scissors'];
    return choices[Math.floor(Math.random() * choices.length)];
  };

  const calculatePayout = (outcome: Outcome, betAmount: number): number => {
    if (outcome === 'win') return betAmount * 1.98; // 1.98x multiplier for wins
    if (outcome === 'draw') return betAmount; // Return original bet on draws
    return 0; // Loss: Player loses bet
  };

  const handleBetAmountChange = (amount: number) => {
    setBetAmount(amount);
  };

  const handlePlay = (choice: Choice) => {
    if (!currentUser) {
      toast.error("Please login to play");
      return;
    }

    if (balance < betAmount) {
      toast.error("Insufficient balance");
      return;
    }

    setIsPlaying(true);
    setPlayerChoice(choice);
    
    // Deduct bet amount immediately
    const newBalance = balance - betAmount;
    setBalance(newBalance);
    updateMoney(newBalance);

    // Random timeout for suspense (250-750ms)
    const delay = 250 + Math.random() * 500;
    
    // Simulate computer thinking and then reveal result
    setTimeout(() => {
      const computer = getRandomChoice();
      setComputerChoice(computer);
      
      const gameOutcome = determineWinner(choice, computer);
      setOutcome(gameOutcome);
      
      const payout = calculatePayout(gameOutcome, betAmount);
      
      // Add payout to balance if player won or drew
      if (payout > 0) {
        const finalBalance = newBalance + payout;
        setBalance(finalBalance);
        updateMoney(finalBalance);
      }
      
      // Add to history
      const historyItem: GameHistoryItem = {
        id: Date.now(),
        playerChoice: choice,
        computerChoice: computer,
        outcome: gameOutcome,
        betAmount: betAmount,
        payout: payout,
        timestamp: new Date()
      };
      
      setHistory(prevHistory => [historyItem, ...prevHistory].slice(0, 10)); // Keep last 10 games
      
      // Reset game state after a short delay
      setTimeout(() => {
        setIsPlaying(false);
      }, 1500);
      
    }, delay);
  };

  const handleHalfBet = () => {
    setBetAmount(Math.max(0.5, betAmount / 2));
  };

  const handleDoubleBet = () => {
    setBetAmount(betAmount * 2);
  };
  
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Link to="/">
          <Button variant="outline">
            &larr; Back to Home
          </Button>
        </Link>
      </div>
      <div className="flex flex-col space-y-6 md:flex-row md:space-y-0 md:space-x-6">
        <div className="w-full md:w-1/3">
          <RPSControls
            balance={balance}
            betAmount={betAmount}
            onBetAmountChange={handleBetAmountChange}
            onPlay={handlePlay}
            onHalfBet={handleHalfBet}
            onDoubleBet={handleDoubleBet}
            disabled={isPlaying}
          />
        </div>
        
        <div className="w-full md:w-2/3 flex flex-col space-y-6">
          <RPSResult
            playerChoice={playerChoice}
            computerChoice={computerChoice}
            outcome={outcome}
            isPlaying={isPlaying}
            betAmount={betAmount}
          />
          
          <RPSHistory history={history} />
        </div>
      </div>
    </div>
  );
};

export default RPSGame;
