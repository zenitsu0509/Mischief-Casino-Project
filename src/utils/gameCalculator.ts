
/**
 * Calculates the game multiplier based on probability formulas
 */

const HOUSE_EDGE = 0.99; // 99% payout (1% house edge)

/**
 * Calculate the multiplier for a specific number of revealed gems
 * 
 * @param totalTiles - Total number of tiles in the grid
 * @param totalMines - Number of mines placed in the grid
 * @param gemsRevealed - Number of gems successfully revealed
 * @returns The current multiplier
 */
export const calculateMultiplier = (
  totalTiles: number,
  totalMines: number,
  gemsRevealed: number
): number => {
  if (gemsRevealed === 0) return 1.0;
  
  // Calculate probability product
  let probabilityProduct = 1.0;
  
  for (let i = 0; i < gemsRevealed; i++) {
    const safeTilesRemaining = (totalTiles - totalMines - i);
    const tilesRemaining = (totalTiles - i);
    probabilityProduct *= safeTilesRemaining / tilesRemaining;
  }
  
  // Calculate multiplier with house edge adjustment
  const multiplier = HOUSE_EDGE / probabilityProduct;
  
  // Round to 2 decimal places for display
  return parseFloat(multiplier.toFixed(2));
};

/**
 * Calculate potential multiplier for the next gem
 * 
 * @param totalTiles - Total number of tiles in the grid
 * @param totalMines - Number of mines placed in the grid
 * @param gemsRevealed - Number of gems successfully revealed
 * @returns The potential next multiplier
 */
export const calculateNextMultiplier = (
  totalTiles: number,
  totalMines: number,
  gemsRevealed: number
): number => {
  return calculateMultiplier(totalTiles, totalMines, gemsRevealed + 1);
};

/**
 * Calculate potential win amount based on bet and current multiplier
 * 
 * @param betAmount - The initial bet amount
 * @param multiplier - The current multiplier
 * @returns The potential win amount
 */
export const calculatePotentialWin = (
  betAmount: number,
  multiplier: number
): number => {
  return betAmount * multiplier;
};

