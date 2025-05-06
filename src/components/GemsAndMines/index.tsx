import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { updateUserData } from '@/services/UserService';
import { calculateMultiplier, calculatePotentialWin } from '@/utils/gameCalculator';
import GameGrid from '../GameGrid'; // Corrected path
import GameControls from '../GameControls'; // Corrected path
import GameHeader from '../GameHeader'; // Corrected path
import GameResult from '../GameResult'; // Corrected path
import { Button } from '@/components/ui/button'; // Import Button

interface GemsAndMinesProps {
  initialBalance: number;
  onBalanceChange: (newBalance: number) => void;
}

interface Cell {
  isRevealed: boolean;
  content: 'gem' | 'mine' | null;
  isSelected?: boolean;
}

const GRID_SIZE = 25; // 5x5 grid
const DEFAULT_BET = 10;
const DEFAULT_MINES = 3;

const GemsAndMines: React.FC<GemsAndMinesProps> = ({ initialBalance, onBalanceChange }) => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  
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
  const [multiSelectMode, setMultiSelectMode] = useState<boolean>(false);
  const [selectedCells, setSelectedCells] = useState<number[]>([]);
  
  // Stats state
  const [totalWinnings, setTotalWinnings] = useState<number>(0);
  const [totalLosses, setTotalLosses] = useState<number>(0);
  
  // Derived state
  const totalGems = GRID_SIZE - mineCount;
  const safeCount = totalGems - gemsFound;
  const potentialWin = calculatePotentialWin(betAmount, currentMultiplier);
  
  // Save user stats
  useEffect(() => {
    async function saveUserData() {
      if (!currentUser) return;
      
      await updateUserData(currentUser.username, {
        totalWinnings,
        totalLosses,
        walletBalance: initialBalance
      });
    }
    
    saveUserData();
  }, [totalWinnings, totalLosses, initialBalance, currentUser]);
  
  function initializeGrid(): Cell[] {
    return Array(GRID_SIZE).fill(null).map(() => ({
      isRevealed: false,
      content: null,
      isSelected: false,
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
    if (initialBalance < betAmount) {
      toast({
        title: "Insufficient Balance",
        description: "Please add more funds to your wallet",
        variant: "destructive",
      });
      return;
    }
    
    // Deduct bet amount from wallet
    onBalanceChange(initialBalance - betAmount);
    
    setGrid(generateGame());
    setGemsFound(0);
    setCurrentMultiplier(1);
    setGameActive(true);
    setIsGameOver(false);
    setShowResult(false);
    setMultiSelectMode(false);
    setSelectedCells([]);
  }
  
  function handleCellClick(index: number) {
    if (!gameActive || grid[index].isRevealed) return;
    
    if (multiSelectMode) {
      // In multi-select mode, toggle cell selection
      const newGrid = [...grid];
      const isCurrentlySelected = selectedCells.includes(index);
      
      if (isCurrentlySelected) {
        setSelectedCells(selectedCells.filter(cellIndex => cellIndex !== index));
        newGrid[index].isSelected = false;
      } else {
        setSelectedCells([...selectedCells, index]);
        newGrid[index].isSelected = true;
      }
      
      setGrid(newGrid);
    } else {
      // Normal reveal mode
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
        
        // Calculate new multiplier using the mathematical formula
        const newMultiplier = calculateMultiplier(GRID_SIZE, mineCount, newGemsFound);
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
  }
  
  function cashOut() {
    if (!gameActive) return;
    
    if (multiSelectMode && selectedCells.length > 0) {
      // Reveal all selected cells at once
      let allSafe = true;
      let gemsFoundCount = gemsFound;
      const newGrid = [...grid];
      
      // First check if all selected cells are safe
      for (const cellIndex of selectedCells) {
        if (newGrid[cellIndex].content === 'mine') {
          allSafe = false;
          break;
        }
      }
      
      // Process the cells based on whether they're all safe
      for (const cellIndex of selectedCells) {
        newGrid[cellIndex].isRevealed = true;
        newGrid[cellIndex].isSelected = false;
        
        if (newGrid[cellIndex].content === 'gem' && allSafe) {
          gemsFoundCount++;
        }
      }
      
      setGrid(newGrid);
      setSelectedCells([]);
      setMultiSelectMode(false);
      
      if (!allSafe) {
        // Game over - hit a mine
        setTotalLosses(prev => prev + betAmount);
        endGame(false);
        return;
      }
      
      // All cells were safe, update gem count and multiplier
      setGemsFound(gemsFoundCount);
      
      // Calculate new multiplier
      const newMultiplier = calculateMultiplier(GRID_SIZE, mineCount, gemsFoundCount);
      setCurrentMultiplier(newMultiplier);
      
      // Check if all gems are found
      if (gemsFoundCount === totalGems) {
        toast({
          title: "Amazing!",
          description: "You found all the gems!",
        });
      }
      
      // Since it was a multi-select cash out, we continue the game
      return;
    }
    
    // Regular cash out
    const winAmount = calculatePotentialWin(betAmount, currentMultiplier);
    
    // Update wallet and track winnings
    onBalanceChange(initialBalance + (winAmount - betAmount));
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
      isRevealed: true,
      isSelected: false, // Clear selections
    }));
    
    setGrid(revealedGrid);
    setGameActive(false);
    setIsGameOver(true);
    setMultiSelectMode(false);
    setSelectedCells([]);
    
    if (!success) {
      setResultAmount(betAmount);
      setIsWin(false);
      setShowResult(true);
    }
  }
  
  function handleCloseResult() {
    setShowResult(false);
  }
  
  function toggleMultiSelectMode() {
    if (!gameActive || isGameOver) return;
    
    // Toggle multi-select mode
    setMultiSelectMode(!multiSelectMode);
    
    // If turning off multi-select, clear selections
    if (multiSelectMode) {
      const newGrid = grid.map(cell => ({
        ...cell,
        isSelected: false,
      }));
      setGrid(newGrid);
      setSelectedCells([]);
    }
  }
  
  // Reset result modal when starting a new game
  useEffect(() => {
    if (gameActive) {
      setShowResult(false);
    }
  }, [gameActive]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Link to="/">
          <Button variant="outline">
            &larr; Back to Home
          </Button>
        </Link>
      </div>
      <div className="w-full"> 
        <GameHeader 
          safeCount={safeCount} 
          gemsFound={gemsFound} 
          totalGems={totalGems} 
        />
        
        <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-start">
          <div className="w-full lg:flex-1 space-y-4">
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
              multiSelectMode={multiSelectMode}
              selectedCount={selectedCells.length}
              onToggleMultiSelect={toggleMultiSelectMode}
            />
            
            <div className="bg-[#192a38] rounded-lg p-4 w-full max-w-xs">
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
    </div>
  );
};

export default GemsAndMines;
