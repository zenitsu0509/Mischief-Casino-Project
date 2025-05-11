import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { updateUserStats } from '@/services/UserService';
import { Button } from '@/components/ui/button';
import DragonTowerControls from './DragonTowerControls';
import DragonTowerGame from './DragonTowerGame';
import DragonTowerHistory from './DragonTowerHistory';

// Difficulty levels
export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'expert' | 'master';

// Game outcome types
export type GameOutcome = 'win' | 'loss' | 'cashout' | null;

// History item interface
export interface GameHistoryItem {
  id: number;
  difficulty: DifficultyLevel;
  level: number;
  outcome: GameOutcome;
  betAmount: number;
  multiplier: number;
  payout: number;
  timestamp: Date;
}

// Define multipliers for each level and difficulty
export const MULTIPLIERS: Record<DifficultyLevel, number[]> = {
  easy: [1.31, 1.74, 2.32, 3.10, 4.13, 5.51, 7.34, 9.79, 13.05],
  medium: [1.47, 2.21, 3.31, 4.96, 7.44, 11.16, 16.74, 25.11, 37.67],
  hard: [1.96, 3.92, 7.84, 15.68, 31.36, 62.72, 125.44, 250.88, 501.76],
  expert: [2.94, 8.82, 26.46, 79.38, 238.14, 714.42, 2143.26, 6429.78, 19289.34],
  master: [3.92, 15.68, 62.72, 250.88, 1003.52, 4014.08, 16056.32, 64225.28, 256901.12]
};

// Define number of tiles and eggs per difficulty level
export const TILES_PER_ROW: Record<DifficultyLevel, number> = {
  easy: 4,
  medium: 3,
  hard: 2,
  expert: 3,
  master: 4
};

export const EGGS_PER_ROW: Record<DifficultyLevel, number> = {
  easy: 3, // 3 out of 4 (75% chance)
  medium: 2, // 2 out of 3 (67% chance)
  hard: 1, // 1 out of 2 (50% chance)
  expert: 1, // 1 out of 3 (33% chance)
  master: 1 // 1 out of 4 (25% chance)
};

const DragonTower: React.FC = () => {
  const { currentUser, updateMoney, refreshUserState } = useAuth();
  const { toast } = useToast();

  // Game state
  const [balance, setBalance] = useState(currentUser?.money || 0);
  const [betAmount, setBetAmount] = useState(1);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('easy');
  const [currentLevel, setCurrentLevel] = useState(0); // 0 means game not started, 1-9 are actual levels
  const [isPlaying, setIsPlaying] = useState(false);  const [gameOutcome, setGameOutcome] = useState<GameOutcome>(null);
  const [history, setHistory] = useState<GameHistoryItem[]>([]);
  const [towerState, setTowerState] = useState<Array<Array<{ revealed: boolean, hasEgg: boolean, selected: boolean }>>>([]);
  const [lastPayout, setLastPayout] = useState<number>(0);
  
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

  // Initialize or reset the tower state when difficulty changes or game starts
  useEffect(() => {
    if (!isPlaying) {
      const newTower = generateTower(difficulty);
      setTowerState(newTower);
    }
  }, [difficulty, isPlaying]);
  // Generate a new tower based on difficulty
  const generateTower = (diff: DifficultyLevel): Array<Array<{ revealed: boolean, hasEgg: boolean, selected: boolean }>> => {
    const tower = [];
    const rows = 9;
    const tilesPerRow = TILES_PER_ROW[diff];
    const eggsPerRow = EGGS_PER_ROW[diff];
    
    for (let i = 0; i < rows; i++) {
      const row = [];
      const eggPositions = new Set();
      
      // Determine egg positions - ensure at least one egg in each row
      while (eggPositions.size < eggsPerRow) {
        eggPositions.add(Math.floor(Math.random() * tilesPerRow));
      }
      
      // Create tiles for the row
      for (let j = 0; j < tilesPerRow; j++) {
        row.push({
          revealed: false,
          hasEgg: eggPositions.has(j),
          selected: false
        });
      }
      
      // Double-check that we have at least one egg in this row
      if (!row.some(tile => tile.hasEgg)) {
        // Force an egg in a random position if somehow no eggs were added
        const randomPosition = Math.floor(Math.random() * tilesPerRow);
        row[randomPosition].hasEgg = true;
      }
      
      tower.push(row);
    }
    
    return tower;
  };

  // Handle bet amount change
  const handleBetAmountChange = (amount: number) => {
    if (!isPlaying) {
      setBetAmount(amount);
    }
  };

  // Handle difficulty level change
  const handleDifficultyChange = (level: DifficultyLevel) => {
    if (!isPlaying) {
      setDifficulty(level);
    }
  };
  // Start a new game
  const handleStartGame = () => {
    if (isPlaying) return;
    
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

    // Deduct bet amount
    const newBalance = balance - betAmount;
    setBalance(newBalance);
    updateMoney(newBalance);
      // Reset game state and start from level 1 (bottom of the tower)
    setCurrentLevel(1);
    setIsPlaying(true);
    setGameOutcome(null);
    setLastPayout(0);
    
    // Generate a new tower
    const newTower = generateTower(difficulty);
    setTowerState(newTower);
      toast({
      title: "Game Started",
      description: `Select tiles to climb the tower from the bottom. Starting at Level 1. Current multiplier: ${MULTIPLIERS[difficulty][0]}x`,
    });
  };  // Handle tile selection
  const handleTileSelect = (rowIndex: number, tileIndex: number) => {
    if (!isPlaying || rowIndex !== currentLevel - 1) return;
    
    // Find the actual row in our data (we display in reverse but data is stored from top to bottom)
    const actualRowIndex = 8 - (rowIndex); // 8 is the index of the last row (9 rows total, 0-indexed)
    
    const newTowerState = [...towerState];
    const selectedTile = newTowerState[actualRowIndex][tileIndex];
    
    // Mark the tile as selected and revealed
    selectedTile.selected = true;
    selectedTile.revealed = true;
    
    setTowerState(newTowerState);
    
    // Check if the tile has an egg
    if (selectedTile.hasEgg) {
      // Success - move to next level or win if at the top
      if (currentLevel === 9) {
        // Player reached the top, they win the final multiplier
        handleGameEnd('win', 9);
      } else {
        // Move to next level
        setCurrentLevel(currentLevel + 1);
        toast({
          title: "Success!",
          description: `You found a dragon egg! Move to level ${currentLevel + 1}. Current multiplier: ${MULTIPLIERS[difficulty][currentLevel]}x`,
        });
      }
    } else {
      // Failure - game over
      handleGameEnd('loss', currentLevel);
    }
  };
  // Handle cash out
  const handleCashOut = () => {
    // Prevent cashing out if game hasn't started or if no tiles have been revealed
    if (!isPlaying || currentLevel <= 1 || !towerState.some(row => row.some(tile => tile.revealed))) {
      // If they try to cash out at level 1 without selecting any tiles, show a message
      if (isPlaying && currentLevel === 1) {
        toast({
          title: "Cannot Cash Out",
          description: "You must select at least one tile before cashing out.",
          variant: "destructive"
        });
      }
      return;
    }
    handleGameEnd('cashout', currentLevel);
  };

  // Handle game end (win, loss, or cashout)
  const handleGameEnd = (outcome: GameOutcome, level: number) => {
    setIsPlaying(false);
    setGameOutcome(outcome);
    
    let payout = 0;    if (outcome === 'win' || outcome === 'cashout') {      
      let levelIndex;
      
      if (outcome === 'win') {
        // Win means reaching the top (level 9)
        levelIndex = 8; // Index for top level multiplier (level 9)
      } else { // cashout
        // For cashout, we need to use the previous level's multiplier 
        // Since the player is currently at "level", but has completed "level-1"
        levelIndex = Math.max(0, Math.min(level - 2, MULTIPLIERS[difficulty].length - 1));
      }
        const multiplier = MULTIPLIERS[difficulty][levelIndex];
      payout = parseFloat((betAmount * multiplier).toFixed(2));
      setLastPayout(payout);
      
      // Log calculation values for debugging
      console.log('Win calculation:', { 
        difficulty, 
        level,
        levelIndex,
        betAmount, 
        multiplier,
        payout,
        balance
      });
      
      // Update player balance
      const newBalance = balance + payout;
      setBalance(newBalance);
      updateMoney(newBalance);
        // Calculate winnings (profit) and ensure it's a valid number
      const winnings = payout - betAmount;
      const displayWinnings = !isNaN(winnings) && winnings > 0 ? winnings.toFixed(2) : "0.00";
      const totalAmount = !isNaN(payout) ? payout.toFixed(2) : "0.00";
      
      toast({
        title: outcome === 'win' ? "You won!" : "Cash Out Successful",
        description: `Profit: $${displayWinnings} (Total: $${totalAmount})`,
      });
    } else {
      // Player lost
      toast({
        title: "Game Over",
        description: `You lost $${betAmount.toFixed(2)}. Better luck next time!`,
        variant: "destructive"
      });
    }    // Add to game history
    const historyItem: GameHistoryItem = {
      id: Date.now(),
      difficulty,
      level,
      outcome,
      betAmount,
      multiplier: outcome === 'loss' ? 0 : 
                  outcome === 'win' ? MULTIPLIERS[difficulty][8] :
                  (level <= 1) ? MULTIPLIERS[difficulty][0] : 
                  MULTIPLIERS[difficulty][level - 2],
      payout,
      timestamp: new Date()
    };
    
    setHistory(prevHistory => [historyItem, ...prevHistory].slice(0, 10)); // Keep last 10 games
    
    // Track statistics if user is logged in
    if (currentUser?.username) {
      updateUserStats(currentUser.username, payout, betAmount);
    }    // Reveal all tiles on game end with a slight delay for visual effect
    setTimeout(() => {
      const revealedTower = towerState.map(row => 
        row.map(tile => ({ ...tile, revealed: true }))
      );
      setTowerState(revealedTower);
      
      // Notify user about revealed tiles
      toast({
        title: "Tower Revealed",
        description: "All egg and trap locations have been revealed!",
        variant: "default"
      });
    }, 800); // Short delay for better visual effect
    
    // Reset current level
    setCurrentLevel(0);
  };

  // Handle half bet
  const handleHalfBet = () => {
    if (!isPlaying) {
      setBetAmount(Math.max(0.5, betAmount / 2));
    }
  };

  // Handle double bet
  const handleDoubleBet = () => {
    if (!isPlaying) {
      setBetAmount(betAmount * 2);
    }
  };
  return (
    <div className="flex flex-col gap-2">
      <div>
        <Link to="/">
          <Button variant="outline" size="sm">
            &larr; Back
          </Button>
        </Link>
      </div>
      <div className="flex flex-col space-y-3 lg:flex-row lg:space-y-0 lg:space-x-3">
        <div className="w-full lg:w-1/4">
          <DragonTowerControls
            balance={balance}
            betAmount={betAmount}
            onBetAmountChange={handleBetAmountChange}
            difficulty={difficulty}
            onDifficultyChange={handleDifficultyChange}
            onStartGame={handleStartGame}
            onCashOut={handleCashOut}
            onHalfBet={handleHalfBet}
            onDoubleBet={handleDoubleBet}
            isPlaying={isPlaying}            currentLevel={currentLevel}
            currentMultiplier={
              currentLevel > 0 && currentLevel <= MULTIPLIERS[difficulty].length
                ? MULTIPLIERS[difficulty][currentLevel - 1] 
                : 0
            }
          />
          
          <DragonTowerHistory 
            history={history} 
            className="mt-2"
          />
        </div>
        
        <div className="w-full lg:w-3/4">
          <DragonTowerGame
            towerState={towerState}
            difficulty={difficulty}
            currentLevel={currentLevel}
            onTileSelect={handleTileSelect}
            isPlaying={isPlaying}            gameOutcome={gameOutcome}
            multipliers={MULTIPLIERS[difficulty]}
            betAmount={betAmount}
            lastPayout={lastPayout}
          />
        </div>
      </div>
    </div>
  );
};

export default DragonTower;
