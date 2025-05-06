// Simple user authentication service using GitHub Gist for storage
import GistService, { UserData } from './GistService';

interface User {
  username: string;
  password: string;
  money: number;
}

export class AuthService {
  private static users: User[] = [];
  private static isInitialized: boolean = false;
  
  // Load users from Gist
  public static async loadUsers(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      // Load users from GitHub Gist
      const gistUsers = await GistService.getUsers();
      
      if (!gistUsers || gistUsers.length === 0) {
        console.warn("No users found in Gist. Adding demo user.");
        // Create a hardcoded fallback user
        const fallbackUser: User = {
          username: "demo",
          password: "password",
          money: 1000
        };
        
        await GistService.addUser(fallbackUser);
        this.users = [fallbackUser];
      } else {
        this.users = gistUsers;
      }
      
      this.isInitialized = true;
      console.log("User data loaded from Gist:", this.users.length, "users");
    } catch (error) {
      console.error("Error loading users from Gist:", error);
      
      // Create a demo user if Gist fails
      this.users = [{
        username: "demo",
        password: "password",
        money: 1000
      }];
      
      // Save locally as fallback
      localStorage.setItem('users', JSON.stringify(this.users));
    }
  }
  
  // Check if localStorage has users and load them as backup
  public static checkLocalStorage(): void {
    const usersJson = localStorage.getItem('users');
    if (usersJson && !this.isInitialized) {
      try {
        this.users = JSON.parse(usersJson);
        this.isInitialized = true;
        console.log("User data loaded from localStorage as backup:", this.users.length, "users");
      } catch (error) {
        console.error("Could not parse users from localStorage:", error);
      }
    }
  }
  
  // Login user
  public static async login(username: string, password: string): Promise<User | null> {
    try {
      // Verify user with Gist service
      const user = await GistService.verifyUser(username, password);
      
      if (!user) {
        alert("Invalid username or password. Please try again.");
        return null;
      }
      
      // Store logged in user in local storage (omitting the password)
      const userInfo = { username: user.username, money: user.money };
      localStorage.setItem('loggedInUser', JSON.stringify(userInfo));
      sessionStorage.setItem('loggedInUser', JSON.stringify(userInfo));
      
      return user;
    } catch (error) {
      console.error("Login error:", error);
      alert("Error during login. Please try again later.");
      return null;
    }
  }
  
  // Signup user
  public static async signup(username: string, password: string): Promise<User | null> {
    try {
      if (!username || !password) {
        alert("Username and password cannot be empty.");
        return null;
      }
      
      // Check if user already exists
      const existingUser = await GistService.getUserByUsername(username);
      if (existingUser) {
        alert("Username already exists. Please choose a different username or try logging in.");
        return null;
      }
      
      // Create new user
      const newUser: UserData = {
        username,
        password,
        money: 100 // Starting money - 100 coins for free on new account
      };
      
      // Add user to Gist
      const success = await GistService.addUser(newUser);
      
      if (!success) {
        alert("Error creating account. Please try again.");
        return null;
      }
      
      // Store logged in user in both localStorage and sessionStorage (omitting the password)
      const userInfo = { username: newUser.username, money: newUser.money };
      localStorage.setItem('loggedInUser', JSON.stringify(userInfo));
      sessionStorage.setItem('loggedInUser', JSON.stringify(userInfo));
      
      return newUser;
    } catch (error) {
      console.error("Signup error:", error);
      alert("Error during signup. Please try again later.");
      return null;
    }
  }
  
  // Change password
  public static async changePassword(username: string, oldPassword: string, newPassword: string): Promise<boolean> {
    try {
      // Verify old password first
      const user = await GistService.verifyUser(username, oldPassword);
      
      if (!user) {
        alert("Current password is incorrect.");
        return false;
      }
      
      if (!newPassword) {
        alert("New password cannot be empty.");
        return false;
      }
      
      // Update user with new password
      user.password = newPassword;
      const success = await GistService.updateUser(user);
      
      if (!success) {
        alert("Error updating password. Please try again.");
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Change password error:", error);
      alert("Error changing password. Please try again later.");
      return false;
    }
  }
  
  // Check login status
  public static isLoggedIn(): boolean {
    return localStorage.getItem('loggedInUser') !== null || 
           sessionStorage.getItem('loggedInUser') !== null;
  }
  
  // Get logged in user
  public static getLoggedInUser(): { username: string, money: number } | null {
    // Try to get from local storage first (more persistent) then session storage
    const localData = localStorage.getItem('loggedInUser');
    const sessionData = sessionStorage.getItem('loggedInUser');
    
    // If data is in both places but different, use the local storage version (more authoritative)
    if (localData && sessionData && localData !== sessionData) {
      sessionStorage.setItem('loggedInUser', localData);
      return JSON.parse(localData);
    }
    
    return localData ? JSON.parse(localData) : (sessionData ? JSON.parse(sessionData) : null);
  }
  
  // Logout user
  public static logout(): void {
    localStorage.removeItem('loggedInUser');
    sessionStorage.removeItem('loggedInUser');
  }
  
  // Update user's money
  public static async updateMoney(username: string, amount: number): Promise<void> {
    try {
      // Get current user
      const user = await GistService.getUserByUsername(username);
      
      if (!user) {
        console.error(`Could not update money: User ${username} not found`);
        return;
      }
      
      // Update the money amount
      user.money = amount;
      
      // Save to Gist
      await GistService.updateUser(user);
      
      // Update both localStorage and sessionStorage with the updated user data
      const userInfo = { username, money: amount };
      localStorage.setItem('loggedInUser', JSON.stringify(userInfo));
      sessionStorage.setItem('loggedInUser', JSON.stringify(userInfo));
      
      console.log(`User balance updated: ${username} now has $${amount.toFixed(2)}`);
    } catch (error) {
      console.error("Error updating user money:", error);
    }
  }
}
