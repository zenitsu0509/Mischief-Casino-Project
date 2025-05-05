
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import DiceControls from './DiceControls';
import DiceSlider from './DiceSlider';
import DiceStats from './DiceStats';
import DiceResult from './DiceResult';
import { updateUserStats } from '@/services/UserService';

// Constants
const HOUSE_EDGE = 0.02; // 2% house edge

const DiceGame: React.FC = () => {
  const { currentUser, updateMoney, refreshUserState } = useAuth();
  const { toast } = useToast();
  
  // Game state
  const [betAmount, setBetAmount] = useState<number>(0);
  const [targetNumber, setTargetNumber] = useState<number>(50);
  const [isRollOver, setIsRollOver] = useState<boolean>(true);
  const [multiplier, setMultiplier] = useState<number>(2.0);
  const [winChance, setWinChance] = useState<number>(50);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [rollResult, setRollResult] = useState<number | null>(null);
  const [hasWon, setHasWon] = useState<boolean | null>(null);
  const [rollHistory, setRollHistory] = useState<Array<{
    result: number;
    target: number;
    isRollOver: boolean;
    won: boolean;
    betAmount: number;
    payout: number;
  }>>([]);
  
  // Auto bet settings
  const [isAutoBet, setIsAutoBet] = useState<boolean>(false);
  const [autoBetCount, setAutoBetCount] = useState<number>(0);
  const [maxAutoBets, setMaxAutoBets] = useState<number>(0);
  
  // Always refresh user state to ensure we have the latest balance
  useEffect(() => {
    refreshUserState();
  }, [refreshUserState]);
  
  // Recalculate multiplier when target number or roll over/under changes
  useEffect(() => {
    const probability = isRollOver ? (100 - targetNumber) / 100 : targetNumber / 100;
    const fairMultiplier = 1 / probability;
    const actualMultiplier = fairMultiplier * (1 - HOUSE_EDGE);
    
    setMultiplier(parseFloat(actualMultiplier.toFixed(4)));
    setWinChance(parseFloat((probability * 100).toFixed(4)));
  }, [targetNumber, isRollOver]);
  
  const handleTargetChange = (value: number) => {
    setTargetNumber(value);
  };
  
  const handleRollTypeToggle = () => {
    setIsRollOver(!isRollOver);
  };
  
  const handleBetAmountChange = (amount: number) => {
    setBetAmount(amount);
  };
  
  const handleRoll = async () => {
    if (!currentUser) {
      toast({
        title: "Please login",
        description: "You need to login to play the game",
        variant: "destructive"
      });
      return;
    }
    
    if (betAmount <= 0) {
      toast({
        title: "Invalid bet amount",
        description: "Bet amount must be greater than zero",
        variant: "destructive"
      });
      return;
    }
    
    if (betAmount > currentUser.money) {
      toast({
        title: "Insufficient funds",
        description: "You don't have enough balance",
        variant: "destructive"
      });
      return;
    }
    
    // Deduct bet amount from balance
    const newBalance = currentUser.money - betAmount;
    updateMoney(newBalance);
    
    // Start rolling animation
    setIsRolling(true);
    setRollResult(null);
    setHasWon(null);
    
    // Generate random number between 0 and 99.99
    setTimeout(() => {
      const result = parseFloat((Math.random() * 100).toFixed(2));
      
      // Determine if player has won
      const won = isRollOver ? result > targetNumber : result < targetNumber;
      
      // Update roll result and win status
      setRollResult(result);
      setHasWon(won);
      
      // Update player balance if won
      if (won) {
        const payout = betAmount * multiplier;
        updateMoney(newBalance + payout);
        
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
      
      // Update roll history
      const historyItem = {
        result,
        target: targetNumber,
        isRollOver,
        won,
        betAmount,
        payout: won ? betAmount * multiplier : 0
      };
      
      setRollHistory(prev => [historyItem, ...prev].slice(0, 10));
      
      // Track statistics if user is logged in
      if (currentUser?.username) {
        const winnings = won ? betAmount * multiplier : 0;
        updateUserStats(currentUser.username, winnings, betAmount);
      }
      
      // End rolling animation
      setIsRolling(false);
      
      // Continue auto bet if enabled
      if (isAutoBet && autoBetCount < maxAutoBets) {
        setAutoBetCount(prev => prev + 1);
        // Implement auto bet logic here (e.g., increase/decrease bet after win/loss)
      } else if (autoBetCount >= maxAutoBets) {
        setIsAutoBet(false);
        setAutoBetCount(0);
      }
    }, 1000);
  };
  
  const toggleAutoBet = (isAuto: boolean, maxBets: number = 0) => {
    setIsAutoBet(isAuto);
    setMaxAutoBets(maxBets);
    setAutoBetCount(0);
    
    if (!isAuto) {
      // Cancel any pending auto bets
      setAutoBetCount(0);
      setMaxAutoBets(0);
    }
  };
  
  const potentialWin = betAmount * multiplier;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {/* Left Column - Controls */}
      <div className="md:col-span-1">
        <DiceControls
          betAmount={betAmount}
          onBetAmountChange={handleBetAmountChange}
          isAutoBet={isAutoBet}
          toggleAutoBet={toggleAutoBet}
          onRoll={handleRoll}
          isRolling={isRolling}
          potentialWin={potentialWin}
          balance={currentUser?.money || 0}
        />
      </div>
      
      {/* Right Column - Game Display */}
      <div className="md:col-span-2 lg:col-span-3 flex flex-col gap-4">
        <div className="bg-game-panel p-6 rounded-lg shadow-lg">
          {/* Slider */}
          <DiceSlider
            targetNumber={targetNumber}
            onTargetChange={handleTargetChange}
            isRollOver={isRollOver}
            rollResult={rollResult}
          />
          
          {/* Stats */}
          <div className="mt-6">
            <DiceStats
              multiplier={multiplier}
              targetNumber={targetNumber}
              isRollOver={isRollOver}
              onRollTypeToggle={handleRollTypeToggle}
              winChance={winChance}
            />
          </div>
        </div>
        
        {/* Results History */}
        <div className="bg-game-panel p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold text-white mb-4">Roll History</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Current Roll Result */}
            {rollResult !== null && (
              <DiceResult 
                result={rollResult}
                target={targetNumber}
                isRollOver={isRollOver}
                hasWon={hasWon || false}
              />
            )}
            
            {/* History List */}
            <div className="bg-game-bg/30 p-4 rounded-md">
              <h4 className="text-sm font-semibold text-gray-300 mb-2">Previous Rolls</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {rollHistory.map((roll, index) => (
                  <div 
                    key={index} 
                    className={`text-sm p-2 rounded-sm flex justify-between items-center ${
                      roll.won ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                    }`}
                  >
                    <span>
                      {roll.result.toFixed(2)} {roll.isRollOver ? '>' : '<'} {roll.target}
                    </span>
                    <span className={roll.won ? 'text-green-300' : 'text-red-300'}>
                      {roll.won ? `+$${(roll.payout - roll.betAmount).toFixed(2)}` : `-$${roll.betAmount.toFixed(2)}`}
                    </span>
                  </div>
                ))}
                {rollHistory.length === 0 && (
                  <div className="text-gray-400 text-center py-4">No rolls yet</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiceGame;
