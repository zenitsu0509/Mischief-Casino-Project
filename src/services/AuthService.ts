// Simple user authentication service using JSON file
// This is a simplified implementation for educational purposes only

interface User {
  username: string;
  password: string;
  money: number;
}

export class AuthService {
  private static users: User[] = [];
  private static isInitialized: boolean = false;
  
  // Load users from JSON file
  public static async loadUsers(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      // Updated path with proper base URL handling
      const response = await fetch('./data/users.json');
      if (!response.ok) {
        console.warn("users.json not found or empty. Starting with an empty user list.");
        this.users = [];
        return;
      }
      
      const text = await response.text();
      if (!text) {
        console.warn("users.json is empty. Starting with an empty user list.");
        this.users = [];
        return;
      }
      
      this.users = JSON.parse(text);
      this.isInitialized = true;
      console.log("User data loaded:", this.users.length, "users");
    } catch (error) {
      console.error("Could not load or parse users.json:", error);
      this.users = [];
    }
  }
  
  // Save users to localStorage as we can't write to the JSON file directly from the browser
  // This is a workaround since we can't modify server files directly from client-side JavaScript
  private static saveUsers(): void {
    localStorage.setItem('users', JSON.stringify(this.users));
    console.log("User data saved to localStorage");
  }
  
  // Check if localStorage has users and load them
  public static checkLocalStorage(): void {
    const usersJson = localStorage.getItem('users');
    if (usersJson) {
      try {
        this.users = JSON.parse(usersJson);
        this.isInitialized = true;
        console.log("User data loaded from localStorage:", this.users.length, "users");
      } catch (error) {
        console.error("Could not parse users from localStorage:", error);
      }
    }
  }
  
  // Login user
  public static async login(username: string, password: string): Promise<User | null> {
    // Make sure users are loaded
    if (!this.isInitialized) {
      await this.loadUsers();
      this.checkLocalStorage();
    }
    
    const user = this.users.find(u => u.username === username);
    
    if (!user) {
      alert("Username not found. Please check the username or create an account.");
      return null;
    }
    
    if (user.password === password) {
      // Store logged in user in local storage AND session storage (omitting the password)
      const userInfo = { username: user.username, money: user.money };
      localStorage.setItem('loggedInUser', JSON.stringify(userInfo));
      sessionStorage.setItem('loggedInUser', JSON.stringify(userInfo));
      return user;
    } else {
      alert("Incorrect password. Please try again.");
      return null;
    }
  }
  
  // Signup user
  public static async signup(username: string, password: string): Promise<User | null> {
    // Make sure users are loaded
    if (!this.isInitialized) {
      await this.loadUsers();
      this.checkLocalStorage();
    }
    
    if (!username || !password) {
      alert("Username and password cannot be empty.");
      return null;
    }
    
    if (this.users.find(u => u.username === username)) {
      alert("Username already exists. Please choose a different username or try logging in.");
      return null;
    }
    
    const newUser: User = {
      username,
      password,
      money: 1000 // Starting money
    };
    
    this.users.push(newUser);
    this.saveUsers();
    
    // Store logged in user in both localStorage and sessionStorage (omitting the password)
    const userInfo = { username: newUser.username, money: newUser.money };
    localStorage.setItem('loggedInUser', JSON.stringify(userInfo));
    sessionStorage.setItem('loggedInUser', JSON.stringify(userInfo));
    
    return newUser;
  }
  
  // Change password
  public static async changePassword(username: string, oldPassword: string, newPassword: string): Promise<boolean> {
    // Make sure users are loaded
    if (!this.isInitialized) {
      await this.loadUsers();
      this.checkLocalStorage();
    }
    
    const userIndex = this.users.findIndex(u => u.username === username);
    
    if (userIndex === -1) {
      alert("Username not found.");
      return false;
    }
    
    if (this.users[userIndex].password === oldPassword) {
      if (!newPassword) {
        alert("New password cannot be empty.");
        return false;
      }
      
      this.users[userIndex].password = newPassword;
      this.saveUsers();
      return true;
    } else {
      alert("Incorrect old password.");
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
  public static updateMoney(username: string, amount: number): void {
    const userIndex = this.users.findIndex(u => u.username === username);
    
    if (userIndex !== -1) {
      this.users[userIndex].money = amount;
      this.saveUsers();
      
      // Update both localStorage and sessionStorage
      const userInfo = { username, money: amount };
      localStorage.setItem('loggedInUser', JSON.stringify(userInfo));
      sessionStorage.setItem('loggedInUser', JSON.stringify(userInfo));
    }
  }
}