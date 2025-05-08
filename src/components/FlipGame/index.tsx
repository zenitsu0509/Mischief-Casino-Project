import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { updateUserStats } from '@/services/UserService';
import { Button } from '@/components/ui/button';
import FlipControls from './FlipControls';
import FlipResult from './FlipResult';
import FlipHistory from './FlipHistory';

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

const FlipGame: React.FC = () => {
  const { currentUser, updateMoney, refreshUserState } = useAuth();
  const { toast } = useToast();

  // Game state
  const [balance, setBalance] = useState(currentUser?.money || 0);
  const [betAmount, setBetAmount] = useState(1);
  const [playerChoice, setPlayerChoice] = useState<CoinSide>(null);
  const [result, setResult] = useState<CoinSide>(null);
  const [outcome, setOutcome] = useState<Outcome>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [history, setHistory] = useState<GameHistoryItem[]>([]);
  const [doubleOrNothing, setDoubleOrNothing] = useState(false);
  const [currentMultiplier, setCurrentMultiplier] = useState(1.98);
  const [consecutiveWins, setConsecutiveWins] = useState(0);
  const [maxMultiplier] = useState(1000); // Cap for multiplier

  // Use effect to update balance from currentUser
  useEffect(() => {
    if (currentUser?.money !== undefined) {
      setBalance(currentUser.money);
    }
  }, [currentUser?.money]);

  // Always refresh user state to ensure we have the latest data
  useEffect(() => {
    refreshUserState();
  }, [refreshUserState]);

  // Calculate the multiplier based on consecutive wins
  useEffect(() => {
    if (consecutiveWins === 0) {
      setCurrentMultiplier(1.98); // Base multiplier (with 1% house edge)
    } else {
      // Each consecutive win doubles the previous multiplier
      const newMultiplier = 1.98 * Math.pow(2, consecutiveWins);
      // Cap at maximum multiplier
      setCurrentMultiplier(Math.min(newMultiplier, maxMultiplier));
    }
  }, [consecutiveWins, maxMultiplier]);

  const calculatePayout = (outcome: Outcome, betAmount: number, multiplier: number): number => {
    if (outcome === 'win') return betAmount * multiplier;
    return 0; // Loss: Player loses bet
  };

  const handleBetAmountChange = (amount: number) => {
    setBetAmount(amount);
  };

  const handleDoubleOrNothingToggle = () => {
    setDoubleOrNothing(!doubleOrNothing);
  };

  const handleRandomPick = () => {
    const choices: CoinSide[] = ['heads', 'tails'];
    setPlayerChoice(choices[Math.floor(Math.random() * choices.length)]);
  };

  const handleCoinSelect = (side: CoinSide) => {
    setPlayerChoice(side);
  };

  const handleFlip = () => {
    if (!currentUser) {
      toast({
        title: "Please login",
        description: "You need to login to play",
        variant: "destructive"
      });
      return;
    }

    if (balance < betAmount) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough funds to place this bet",
        variant: "destructive"
      });
      return;
    }

    if (!playerChoice) {
      toast({
        title: "Choose a side",
        description: "Please select Heads or Tails first",
        variant: "destructive"
      });
      return;
    }

    setIsFlipping(true);
    setResult(null);
    setOutcome(null);

    // Deduct bet amount immediately
    const newBalance = balance - betAmount;
    setBalance(newBalance);
    updateMoney(newBalance);

    // Random timeout for suspense (1-2 seconds)
    const delay = 1000 + Math.random() * 1000;
    
    setTimeout(() => {
      // Determine the result
      const coinResult: CoinSide = Math.random() < 0.5 ? 'heads' : 'tails';
      setResult(coinResult);
      
      // Determine the outcome
      const gameOutcome: Outcome = playerChoice === coinResult ? 'win' : 'loss';
      setOutcome(gameOutcome);
      
      // Calculate payout
      const payout = calculatePayout(gameOutcome, betAmount, currentMultiplier);
      
      // Update consecutive wins counter
      if (gameOutcome === 'win') {
        if (doubleOrNothing) {
          // In double or nothing mode, consecutive wins increase
          setConsecutiveWins(prev => prev + 1);
        } else {
          // Reset consecutive wins if not playing double or nothing
          setConsecutiveWins(0);
        }
      } else {
        // Reset consecutive wins on loss
        setConsecutiveWins(0);
      }

      // Add to balance if player won
      if (payout > 0) {
        const finalBalance = newBalance + payout;
        setBalance(finalBalance);
        updateMoney(finalBalance);
      }
      
      // Add to history
      const historyItem: GameHistoryItem = {
        id: Date.now(),
        playerChoice: playerChoice,
        result: coinResult,
        outcome: gameOutcome,
        betAmount: betAmount,
        multiplier: currentMultiplier,
        payout: payout,
        timestamp: new Date()
      };
      
      setHistory(prevHistory => [historyItem, ...prevHistory].slice(0, 10)); // Keep last 10 flips
      
      // Track statistics if the user is logged in
      if (currentUser?.username) {
        updateUserStats(currentUser.username, payout, betAmount);
      }

      // Show toast with result
      if (gameOutcome === 'win') {
        toast({
          title: "You won!",
          description: `You won $${(payout - betAmount).toFixed(2)}`,
        });
      } else {
        toast({
          title: "Better luck next time",
          description: `You lost $${betAmount.toFixed(2)}`,
          variant: "destructive"
        });
      }
      
      // End flipping animation
      setIsFlipping(false);
      
      // Reset player choice if not playing double or nothing
      if (!doubleOrNothing) {
        setPlayerChoice(null);
      } else {
        // If playing double or nothing and lost, reset player choice
        if (gameOutcome === 'loss') {
          setPlayerChoice(null);
          setDoubleOrNothing(false); // Also turn off double or nothing mode
        }
      }
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
          <FlipControls
            balance={balance}
            betAmount={betAmount}
            onBetAmountChange={handleBetAmountChange}
            onFlip={handleFlip}
            onHalfBet={handleHalfBet}
            onDoubleBet={handleDoubleBet}
            playerChoice={playerChoice}
            onCoinSelect={handleCoinSelect}
            onRandomPick={handleRandomPick}
            disabled={isFlipping}
            doubleOrNothing={doubleOrNothing}
            onDoubleOrNothingToggle={handleDoubleOrNothingToggle}
            currentMultiplier={currentMultiplier}
            consecutiveWins={consecutiveWins}
          />
        </div>
        
        <div className="w-full md:w-2/3 flex flex-col space-y-6">
          <FlipResult
            playerChoice={playerChoice}
            result={result}
            outcome={outcome}
            isFlipping={isFlipping}
            betAmount={betAmount}
            multiplier={currentMultiplier}
          />
          
          <FlipHistory history={history} />
        </div>
      </div>
    </div>
  );
};

export default FlipGame;