
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import GameGrid from './GameGrid';
import GameControls from './GameControls';
import GameHeader from './GameHeader';
import GameResult from './GameResult';
import WalletPanel from './WalletPanel';

interface Cell {
  isRevealed: boolean;
  content: 'gem' | 'mine' | null;
}

const GRID_SIZE = 25; // 5x5 grid
const DEFAULT_BET = 10;
const DEFAULT_MINES = 3;

const GemsAndMines: React.FC = () => {
  const { toast } = useToast();
  
  // Game state
  const [grid, setGrid] = useState<Cell[]>(initializeGrid());
  const [betAmount, setBetAmount] = useState<number>(DEFAULT_BET);
  const [mineCount, setMineCount] = useState<number>(DEFAULT_MINES);
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [gemsFound, setGemsFound] = useState<number>(0);
  const [currentMultiplier, setCurrentMultiplier] = useState<number>(1);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [isWin, setIsWin] = useState<boolean>(false);
  const [resultAmount, setResultAmount] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  
  // Wallet state
  const [walletBalance, setWalletBalance] = useState<number>(100); // Start with $100
  const [totalWinnings, setTotalWinnings] = useState<number>(0);
  const [totalLosses, setTotalLosses] = useState<number>(0);
  
  // Derived state
  const totalGems = GRID_SIZE - mineCount;
  const safeCount = totalGems - gemsFound;
  const potentialWin = betAmount * currentMultiplier;
  
  function initializeGrid(): Cell[] {
    return Array(GRID_SIZE).fill(null).map(() => ({
      isRevealed: false,
      content: null,
    }));
  }
  
  function generateGame() {
    const newGrid = initializeGrid();
    const minePositions = generateMinePositions();
    
    // Place mines in the grid
    minePositions.forEach(pos => {
      newGrid[pos].content = 'mine';
    });
    
    // Place gems in remaining positions
    for (let i = 0; i < GRID_SIZE; i++) {
      if (!newGrid[i].content) {
        newGrid[i].content = 'gem';
      }
    }
    
    return newGrid;
  }
  
  function generateMinePositions(): number[] {
    const positions = new Set<number>();
    
    while (positions.size < mineCount) {
      const position = Math.floor(Math.random() * GRID_SIZE);
      positions.add(position);
    }
    
    return Array.from(positions);
  }
  
  function startGame() {
    // Check if player has enough balance
    if (walletBalance < betAmount) {
      toast({
        title: "Insufficient Balance",
        description: "Please add more funds to your wallet",
        variant: "destructive",
      });
      return;
    }
    
    // Deduct bet amount from wallet
    setWalletBalance(prev => prev - betAmount);
    
    setGrid(generateGame());
    setGemsFound(0);
    setCurrentMultiplier(1);
    setGameActive(true);
    setIsGameOver(false);
    setShowResult(false);
  }
  
  function handleCellClick(index: number) {
    if (!gameActive || grid[index].isRevealed) return;
    
    const newGrid = [...grid];
    newGrid[index].isRevealed = true;
    
    if (newGrid[index].content === 'mine') {
      // Game over - hit a mine
      setGrid(newGrid);
      // Track losses
      setTotalLosses(prev => prev + betAmount);
      endGame(false);
    } else {
      // Revealed a gem
      const newGemsFound = gemsFound + 1;
      setGemsFound(newGemsFound);
      
      // Calculate new multiplier: totalGems / (totalGems - gemsFound)
      const newMultiplier = totalGems / (totalGems - newGemsFound);
      setCurrentMultiplier(newMultiplier);
      
      // Check if all gems are found
      if (newGemsFound === totalGems) {
        setGrid(newGrid);
        toast({
          title: "Amazing!",
          description: "You found all the gems!",
        });
        cashOut();
      } else {
        setGrid(newGrid);
        
        // Show toast for milestone achievements
        if (newMultiplier >= 2 && Math.floor(newMultiplier) === newMultiplier) {
          toast({
            title: `${newMultiplier}x Multiplier!`,
            description: "Keep going or cash out!",
          });
        }
      }
    }
  }
  
  function cashOut() {
    if (!gameActive) return;
    
    const winAmount = betAmount * currentMultiplier;
    
    // Update wallet and track winnings
    setWalletBalance(prev => prev + winAmount);
    setTotalWinnings(prev => prev + (winAmount - betAmount));
    
    setResultAmount(winAmount);
    setIsWin(true);
    setShowResult(true);
    endGame(true);
  }
  
  function endGame(success: boolean) {
    // Reveal all cells if game is over
    const revealedGrid = grid.map(cell => ({
      ...cell,
      isRevealed: true
    }));
    
    setGrid(revealedGrid);
    setGameActive(false);
    setIsGameOver(true);
    
    if (!success) {
      setResultAmount(betAmount);
      setIsWin(false);
      setShowResult(true);
    }
  }
  
  function handleCloseResult() {
    setShowResult(false);
  }
  
  function handleAddFunds(amount: number) {
    setWalletBalance(prev => prev + amount);
  }
  
  // Reset result modal when starting a new game
  useEffect(() => {
    if (gameActive) {
      setShowResult(false);
    }
  }, [gameActive]);

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <GameHeader 
        safeCount={safeCount} 
        gemsFound={gemsFound} 
        totalGems={totalGems} 
      />
      
      <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-start">
        <div className="w-full lg:flex-1 space-y-4">
          <WalletPanel balance={walletBalance} onAddFunds={handleAddFunds} />
          <GameGrid 
            grid={grid} 
            onCellClick={handleCellClick} 
            disabled={!gameActive || isGameOver} 
          />
        </div>
        
        <div className="w-full lg:w-auto space-y-4">
          <GameControls 
            betAmount={betAmount}
            onBetChange={setBetAmount}
            mineCount={mineCount}
            onMineCountChange={setMineCount}
            onStartGame={startGame}
            onCashOut={cashOut}
            currentMultiplier={currentMultiplier}
            gameActive={gameActive}
            potentialWin={potentialWin}
            isGameOver={isGameOver}
          />
          
          <div className="bg-game-panel rounded-lg p-4 w-full max-w-xs">
            <h2 className="text-xl font-bold text-white mb-4 text-center">Stats</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Winnings</span>
                <span className="text-green-400 font-medium">${totalWinnings.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Losses</span>
                <span className="text-red-400 font-medium">${totalLosses.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <GameResult 
        isVisible={showResult} 
        isWin={isWin} 
        amount={resultAmount} 
        onClose={handleCloseResult}
      />
    </div>
  );
};

export default GemsAndMines;
