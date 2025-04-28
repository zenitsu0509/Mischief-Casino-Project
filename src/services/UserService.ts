
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface UserGameData {
  walletBalance: number;
  totalWinnings: number;
  totalLosses: number;
  userId: string;
  lastPlayed: Date;
}

export async function getUserData(userId: string): Promise<UserGameData | null> {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as UserGameData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}

export async function createUserData(userId: string, initialData: Partial<UserGameData> = {}): Promise<void> {
  try {
    const userData: UserGameData = {
      walletBalance: 100,
      totalWinnings: 0,
      totalLosses: 0,
      userId,
      lastPlayed: new Date(),
      ...initialData
    };
    
    await setDoc(doc(db, "users", userId), userData);
  } catch (error) {
    console.error("Error creating user data:", error);
  }
}

export async function updateUserData(userId: string, data: Partial<UserGameData>): Promise<void> {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      ...data,
      lastPlayed: new Date()
    });
  } catch (error) {
    console.error("Error updating user data:", error);
  }
}
