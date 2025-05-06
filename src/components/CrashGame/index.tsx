import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { updateUserData } from '@/services/UserService'; // Assuming similar stats tracking
import { Button } from '@/components/ui/button'; // Assuming Button component exists
import { Input } from '@/components/ui/input'; // Assuming Input component exists

interface CrashGameProps {
  initialBalance: number;
  onBalanceChange: (newBalance: number) => void;
}

type GameStatus = 'idle' | 'betting' | 'running' | 'running_after_cashout' | 'crashed' | 'cashed_out';

const CrashGame: React.FC<CrashGameProps> = ({ initialBalance, onBalanceChange }) => {
  const { toast } = useToast();
  const { currentUser } = useAuth();

  // Game State
  const [betAmount, setBetAmount] = useState<number>(10); // Default bet
  const [multiplier, setMultiplier] = useState<number>(1.00);
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [crashPoint, setCrashPoint] = useState<number | null>(null);
  const [resultMessage, setResultMessage] = useState<string>('');
  const [targetMultiplier, setTargetMultiplier] = useState<number>(2); // Default target multiplier of 2
  const [autoMode, setAutoMode] = useState<boolean>(true); // Auto mode enabled by default
  const [cashedOutAt, setCashedOutAt] = useState<number | null>(null);
  const [gameTime, setGameTime] = useState<number>(0); // Time elapsed in game (seconds)
  const [gameCounter, setGameCounter] = useState<number>(0); // Counter to track games played
  const [currentBalance, setCurrentBalance] = useState<number>(initialBalance); // Track balance internally
  const [crashHistory, setCrashHistory] = useState<number[]>([]); // Store last 10 crash points

  const MAX_MULTIPLIER = 25; // Maximum multiplier limit
  const GROWTH_RATE = 0.05; // k value in the formula - controls speed of multiplier growth
  const UPDATE_INTERVAL = 50; // Update interval in milliseconds (50ms = 20 updates per second)
  const MAX_HISTORY = 10; // Number of crash points to keep in history

  // Games pattern constants
  const CYCLE_LENGTH = 10; // Pattern repeats every 10 games
  const LOW_CRASH_COUNT = 8; // 8 out of 10 games crash below 5x

  // Ref for interval only
  const gameIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update local balance when initialBalance changes
  useEffect(() => {
    setCurrentBalance(initialBalance);
  }, [initialBalance]);

  // Calculate crash point with controlled distribution pattern
  const calculateCrashPoint = (): number => {
    const cyclePosition = gameCounter % CYCLE_LENGTH;
    let calculatedCrashPoint: number;

    if (cyclePosition < LOW_CRASH_COUNT) {
      calculatedCrashPoint = 1.01 + Math.random() * 3.98;
    } else if (cyclePosition === LOW_CRASH_COUNT) {
      calculatedCrashPoint = 8 + Math.random() * 7;
    } else {
      calculatedCrashPoint = 15 + Math.random() * (MAX_MULTIPLIER - 15);
    }

    const variation = (Math.random() * 0.5) - 0.25;
    calculatedCrashPoint = Math.max(1.01, calculatedCrashPoint + variation);
    return Math.min(calculatedCrashPoint, MAX_MULTIPLIER);
  };

  const addCrashToHistory = React.useCallback((point: number) => {
    setCrashHistory(prev => {
      const formattedPoint = parseFloat(point.toFixed(2));
      const newHistory = [formattedPoint, ...prev].slice(0, MAX_HISTORY);
      return newHistory;
    });
  }, [MAX_HISTORY]);

  const startGame = () => {
    if (currentBalance < betAmount) {
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
    if (autoMode && (!targetMultiplier || targetMultiplier <= 1)) {
      toast({
        title: "Invalid Target Multiplier",
        description: "Target multiplier must be greater than 1 for Auto mode.",
        variant: "destructive",
      });
      return;
    }

    setGameCounter(prevCounter => prevCounter + 1);
    const newBalance = currentBalance - betAmount;
    setCurrentBalance(newBalance);
    onBalanceChange(newBalance);

    setMultiplier(1.00);
    const newCrashPoint = calculateCrashPoint();
    setCrashPoint(newCrashPoint);
    setResultMessage('');
    setCashedOutAt(null);
    setGameTime(0);
    setGameStatus('running');

    console.log(`Game started. Crash point set to: ${newCrashPoint.toFixed(2)}`);
  };

  const performCashOut = React.useCallback((cashoutMultiplier: number) => {
    if (gameStatus !== 'running') return;

    const winAmount = betAmount * cashoutMultiplier;
    const newBalance = currentBalance + winAmount;

    setCurrentBalance(newBalance);
    onBalanceChange(newBalance);

    setCashedOutAt(cashoutMultiplier);
    setGameStatus('running_after_cashout');

    const method = autoMode ? 'Auto cashed' : 'Cashed';
    setResultMessage(`${method} out at ${cashoutMultiplier.toFixed(2)}x! You won $${winAmount.toFixed(2)}.`);

    console.log(`${method} out successful at ${cashoutMultiplier.toFixed(2)}x. New balance: ${newBalance.toFixed(2)}`);
  }, [gameStatus, betAmount, currentBalance, onBalanceChange, autoMode]);

  const cashOut = () => {
    if (gameStatus !== 'running') return;
    performCashOut(multiplier);
  };

  // Define the missing toggleAutoMode function
  const toggleAutoMode = () => {
    if (gameStatus === 'idle') { // Only allow toggling when idle
      setAutoMode(prev => !prev);
    }
  };

  const forceCrash = () => {
    if (gameStatus === 'running' && crashPoint) {
      setMultiplier(crashPoint);
    }
  };

  useEffect(() => {
    if (gameStatus === 'running' || gameStatus === 'running_after_cashout') {
      gameIntervalRef.current = setInterval(() => {
        setGameTime(prevTime => {
          const newTime = prevTime + UPDATE_INTERVAL / 1000;
          const newMultiplier = parseFloat(Math.exp(GROWTH_RATE * newTime).toFixed(2));
          setMultiplier(prevMultiplier => Math.min(newMultiplier, MAX_MULTIPLIER));
          return newTime;
        });
      }, UPDATE_INTERVAL);
    } else {
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
        gameIntervalRef.current = null;
      }
    }

    return () => {
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
        gameIntervalRef.current = null;
      }
    };
  }, [gameStatus, GROWTH_RATE, MAX_MULTIPLIER, UPDATE_INTERVAL]);

  useEffect(() => {
    if (!crashPoint || gameStatus === 'idle' || gameStatus === 'betting' || gameStatus === 'crashed') return;

    const currentCrashPoint = crashPoint;

    if (gameStatus === 'running' && multiplier >= currentCrashPoint) {
      console.log(`Crash Check: Multiplier ${multiplier.toFixed(2)} >= Crash Point ${currentCrashPoint.toFixed(2)}`);
      addCrashToHistory(currentCrashPoint);
      setResultMessage(`Crashed at ${currentCrashPoint.toFixed(2)}x! You lost $${betAmount.toFixed(2)}.`);
      setGameStatus('crashed');
      return;
    }

    if (gameStatus === 'running' && multiplier >= MAX_MULTIPLIER) {
      console.log(`Max Multiplier Check: Multiplier ${multiplier.toFixed(2)} >= Max ${MAX_MULTIPLIER}`);
      const effectiveCrashPoint = Math.min(currentCrashPoint, MAX_MULTIPLIER);
      addCrashToHistory(effectiveCrashPoint);
      setResultMessage(`Game reached max multiplier of ${MAX_MULTIPLIER.toFixed(2)}x!`);
      setGameStatus('crashed');
      return;
    }

    if (gameStatus === 'running' && autoMode && targetMultiplier && multiplier >= targetMultiplier) {
      console.log(`Auto Cashout Check: Multiplier ${multiplier.toFixed(2)} >= Target ${targetMultiplier.toFixed(2)}`);
      performCashOut(targetMultiplier);
      return;
    }

    if (gameStatus === 'running_after_cashout' && (multiplier >= currentCrashPoint || multiplier >= MAX_MULTIPLIER)) {
      console.log(`Post-Cashout Stop Check: Multiplier ${multiplier.toFixed(2)}, Crash Point ${currentCrashPoint.toFixed(2)}, Max ${MAX_MULTIPLIER}`);
      setGameStatus('idle');
    }
  }, [multiplier, gameStatus, crashPoint, autoMode, targetMultiplier, betAmount, MAX_MULTIPLIER, addCrashToHistory, performCashOut]);

  useEffect(() => {
    if (gameStatus === 'crashed') {
      const timer = setTimeout(() => {
        setGameStatus('idle');
        setCrashPoint(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [gameStatus]);

  useEffect(() => {
    if (crashHistory.length === 0) {
      const sampleHistory = Array.from({ length: MAX_HISTORY }, () => {
        const random = Math.random();
        let point: number;
        if (random < 0.8) {
          point = 1.01 + Math.random() * 3.98;
        } else if (random < 0.9) {
          point = 8 + Math.random() * 7;
        } else {
          point = 15 + Math.random() * (MAX_MULTIPLIER - 15);
        }
        return parseFloat(Math.min(Math.max(1.01, point), MAX_MULTIPLIER).toFixed(2));
      });
      setCrashHistory(sampleHistory.reverse());
    }
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Link to="/">
          <Button variant="outline">
            &larr; Back to Home
          </Button>
        </Link>
      </div>
      <div className="bg-[#10212e] rounded-lg p-6 w-full max-w-md mx-auto text-white shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-4">Crash Game</h2>

        <div className="bg-[#192a38] rounded-lg p-2 mb-4 overflow-x-auto">
          <p className="text-xs text-gray-400 mb-1">Last {crashHistory.length} crashes (newest first):</p>
          <div className="flex gap-2 flex-nowrap">
            {crashHistory.map((point, index) => (
              <div
                key={`${point}-${index}`}
                className={`flex-shrink-0 text-xs px-2 py-1 rounded font-mono ${
                  point < 5 ? 'bg-red-900/50 text-red-300' :
                  point < 15 ? 'bg-yellow-900/50 text-yellow-300' :
                  'bg-green-900/50 text-green-300'
                }`}
              >
                {point.toFixed(2)}x
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mb-6">
          <p className={`text-5xl font-bold transition-colors duration-200 ${
            gameStatus === 'crashed' ? 'text-red-500' :
            (gameStatus === 'running_after_cashout' && cashedOutAt) ? 'text-gray-400' :
            gameStatus === 'running' ? 'text-green-400' :
            'text-white'
          }`}>
            {multiplier.toFixed(2)}x
          </p>
          {(gameStatus === 'running' || gameStatus === 'running_after_cashout') && (
            <p className="text-sm text-gray-400 mt-1">Increasing...</p>
          )}
          {gameStatus === 'running' && autoMode && targetMultiplier && targetMultiplier > 1 && (
            <p className="text-xs text-yellow-400 mt-1">Auto cashout at {targetMultiplier.toFixed(2)}x</p>
          )}
          {gameStatus === 'running_after_cashout' && cashedOutAt && (
            <p className="text-sm text-green-500 mt-1">You cashed out at {cashedOutAt.toFixed(2)}x</p>
          )}
          {gameStatus === 'crashed' && crashPoint && (
            <p className="text-lg text-red-500 mt-1">Crashed at {crashPoint.toFixed(2)}x!</p>
          )}
          {resultMessage && gameStatus !== 'running' && (
            <p className={`text-center mt-2 font-medium ${
              gameStatus === 'crashed' ? 'text-red-400' :
              gameStatus === 'running_after_cashout' || gameStatus === 'idle' ? 'text-green-400' :
              'text-gray-400'
            }`}>
              {resultMessage}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4 mb-6">
          <Input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(Math.max(0, parseFloat(e.target.value) || 0))}
            placeholder="Bet Amount"
            className="bg-[#0f172a] border-gray-600 text-white flex-grow"
            disabled={gameStatus !== 'idle'}
          />
          {gameStatus === 'idle' && (
            <Button onClick={startGame} className="bg-blue-600 hover:bg-blue-700">
              Place Bet
            </Button>
          )}
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-white font-medium">Auto Cashout</label>
            <div className="flex items-center gap-2">
              {autoMode && (
                <span className={`text-xs ${targetMultiplier > 1 ? 'text-green-400' : 'text-yellow-500'}`}>
                  {targetMultiplier > 1 ? `Target: ${targetMultiplier.toFixed(2)}x` : 'Target > 1'}
                </span>
              )}
              <Button
                onClick={toggleAutoMode}
                size="sm"
                variant={autoMode ? "default" : "outline"}
                className={`text-xs ${autoMode ? 'bg-green-600 hover:bg-green-700' : 'text-gray-400 hover:bg-gray-700'}`}
                disabled={gameStatus !== 'idle'}
              >
                {autoMode ? 'Auto: ON' : 'Auto: OFF'}
              </Button>
            </div>
          </div>
          {autoMode && (
            <div className="flex items-center gap-4">
              <Input
                type="number"
                value={targetMultiplier || ''}
                onChange={(e) => setTargetMultiplier(Math.max(1.01, parseFloat(e.target.value) || 1.01))}
                placeholder="Target Multiplier (e.g. 2.0)"
                className="bg-[#0f172a] border-gray-600 text-white flex-grow"
                disabled={gameStatus !== 'idle'}
                min="1.01"
                step="0.01"
              />
            </div>
          )}
        </div>

        {gameStatus === 'running' && (
          <Button onClick={cashOut} className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3">
            Cash Out ({multiplier.toFixed(2)}x = ${(betAmount * multiplier).toFixed(2)})
          </Button>
        )}

        <div className="text-center mt-4">
          <p className="text-gray-300">Balance: ${currentBalance.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default CrashGame;
