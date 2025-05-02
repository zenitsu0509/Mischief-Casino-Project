import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { updateUserData } from '@/services/UserService'; // Assuming similar stats tracking
import { Button } from '@/components/ui/button'; // Assuming Button component exists
import { Input } from '@/components/ui/input'; // Assuming Input component exists

interface CrashGameProps {
  initialBalance: number;
  onBalanceChange: (newBalance: number) => void;
}

type GameStatus = 'idle' | 'betting' | 'running' | 'crashed' | 'cashed_out';

const CrashGame: React.FC<CrashGameProps> = ({ initialBalance, onBalanceChange }) => {
  const { toast } = useToast();
  const { currentUser } = useAuth();

  // Game State
  const [betAmount, setBetAmount] = useState<number>(10); // Default bet
  const [multiplier, setMultiplier] = useState<number>(1.00);
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [crashPoint, setCrashPoint] = useState<number | null>(null);
  const [resultMessage, setResultMessage] = useState<string>('');

  // Refs for intervals
  const gameIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // TODO: Add stats state similar to GemsAndMines if needed
  // const [totalWinnings, setTotalWinnings] = useState<number>(0);
  // const [totalLosses, setTotalLosses] = useState<number>(0);

  // TODO: Implement useEffect for saving user stats if needed

  const calculateCrashPoint = (): number => {
    // Simple example: crash point between 1.1x and 10x (adjust as needed)
    // More sophisticated randomness can be added here
    const random = Math.random();
    // Skew towards lower multipliers for more frequent crashes
    const skewedRandom = Math.pow(random, 2.5); // Adjust exponent for desired distribution
    return 1.1 + skewedRandom * 8.9; // Scale to 1.1 - 10.0 range
  };

  const startGame = () => {
    if (initialBalance < betAmount) {
      toast({
        title: "Insufficient Balance",
        description: "Not enough funds to place this bet.",
        variant: "destructive",
      });
      return;
    }
    if (betAmount <= 0) {
        toast({
            title: "Invalid Bet",
            description: "Bet amount must be positive.",
            variant: "destructive",
        });
        return;
    }


    onBalanceChange(initialBalance - betAmount);
    setGameStatus('running');
    setMultiplier(1.00);
    setCrashPoint(calculateCrashPoint());
    setResultMessage('');

    // Start multiplier increase
    gameIntervalRef.current = setInterval(() => {
      setMultiplier(prevMultiplier => {
        // Increase multiplier (adjust rate as needed)
        const nextMultiplier = parseFloat((prevMultiplier + 0.01).toFixed(2));

        // Check for crash
        if (crashPoint && nextMultiplier >= crashPoint) {
          clearInterval(gameIntervalRef.current!);
          setGameStatus('crashed');
          setResultMessage(`Crashed at ${crashPoint.toFixed(2)}x! You lost $${betAmount.toFixed(2)}.`);
          // TODO: Update totalLosses if tracking stats
          return crashPoint; // Stop at crash point
        }
        return nextMultiplier;
      });
    }, 100); // Update interval (e.g., every 100ms)
  };

  const cashOut = () => {
    if (gameStatus !== 'running' || !gameIntervalRef.current) return;

    clearInterval(gameIntervalRef.current);
    const winAmount = betAmount * multiplier;
    onBalanceChange(initialBalance + winAmount); // Add winnings (already deducted bet)
    setGameStatus('cashed_out');
    setResultMessage(`Cashed out at ${multiplier.toFixed(2)}x! You won $${winAmount.toFixed(2)}.`);
    // TODO: Update totalWinnings if tracking stats
  };

  // Cleanup interval on component unmount or game end
  useEffect(() => {
    return () => {
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
      }
    };
  }, []);

   // Reset game state for next round
   useEffect(() => {
    if (gameStatus === 'crashed' || gameStatus === 'cashed_out') {
      // Optionally add a delay before resetting
      const timer = setTimeout(() => {
        setGameStatus('idle');
        setCrashPoint(null);
        // Keep result message until next game starts
      }, 3000); // Reset after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [gameStatus]);


  return (
    <div className="bg-[#192a38] rounded-lg p-6 w-full max-w-md mx-auto text-white">
      <h2 className="text-2xl font-bold text-center mb-6">Crash Game</h2>

      {/* Multiplier Display */}
      <div className="text-center mb-6">
        <p className={`text-5xl font-bold ${gameStatus === 'crashed' ? 'text-red-500' : 'text-green-400'}`}>
          {multiplier.toFixed(2)}x
        </p>
        {gameStatus === 'running' && <p className="text-sm text-gray-400 mt-1">Increasing...</p>}
        {gameStatus === 'crashed' && <p className="text-lg text-red-500 mt-1">Crashed!</p>}
        {gameStatus === 'cashed_out' && <p className="text-lg text-green-500 mt-1">Cashed Out!</p>}
      </div>

      {/* Bet Controls */}
      <div className="flex items-center gap-4 mb-6">
        <Input
          type="number"
          value={betAmount}
          onChange={(e) => setBetAmount(Math.max(0, parseFloat(e.target.value) || 0))}
          placeholder="Bet Amount"
          className="bg-[#0f172a] border-gray-600 text-white flex-grow"
          disabled={gameStatus === 'running'}
        />
        {gameStatus === 'idle' && (
          <Button onClick={startGame} className="bg-blue-600 hover:bg-blue-700">
            Place Bet
          </Button>
        )}
      </div>

      {/* Action Button */}
      {gameStatus === 'running' && (() => {
        const potentialWin = betAmount * multiplier; // Define potentialWin here
        return (
          <Button onClick={cashOut} className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3">
            Cash Out {potentialWin > 0 ? `(${(potentialWin).toFixed(2)})` : ''}
          </Button>
        );
      })()}

      {/* Result Message */}
      {resultMessage && (
        <p className={`text-center mt-4 font-medium ${gameStatus === 'crashed' ? 'text-red-400' : 'text-green-400'}`}>
          {resultMessage}
        </p>
      )}

      {/* TODO: Add Stats Display if needed */}

    </div>
  );
};

export default CrashGame;
