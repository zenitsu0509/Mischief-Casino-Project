
import { AuthService } from './AuthService';

export interface UserGameData {
  walletBalance: number;
  totalWinnings: number;
  totalLosses: number;
  userId: string;
  lastPlayed: Date;
}

export async function getUserData(userId: string): Promise<UserGameData | null> {
  try {
    // For our simplified implementation, we'll just get user data from AuthService
    const user = AuthService.getLoggedInUser();
    
    if (user) {
      return {
        walletBalance: user.money,
        totalWinnings: 0, // Default values
        totalLosses: 0,   // Default values
        userId: user.username,
        lastPlayed: new Date()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}

export async function createUserData(userId: string, initialData: Partial<UserGameData> = {}): Promise<void> {
  // Since we're using a simplified JSON approach, this function is mostly a placeholder
  // All user data is handled by AuthService now
  console.log("Creating user data for", userId);
}

export async function updateUserData(userId: string, data: Partial<UserGameData>): Promise<void> {
  try {
    // Update user's money in AuthService
    if (data.walletBalance !== undefined) {
      AuthService.updateMoney(userId, data.walletBalance);
    }
  } catch (error) {
    console.error("Error updating user data:", error);
  }
}
