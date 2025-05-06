// GistService.ts - Service to interact with GitHub Gist API
import axios from 'axios';

// GitHub Gist configuration from environment variables
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const GIST_ID = import.meta.env.VITE_GIST_ID;
const GIST_FILENAME = import.meta.env.VITE_GIST_FILENAME;

// User data interface
export interface UserData {
  username: string;
  password: string;
  money: number;
  createdAt?: string;
  lastLogin?: string;
}

// GistService class to handle all GitHub Gist operations
export class GistService {
  private static headers = {
    Authorization: `token ${GITHUB_TOKEN}`,
    'Content-Type': 'application/json',
  };
  
  // Store users in memory cache
  private static usersCache: UserData[] | null = null;
  private static useLocalFallback = false;

  // Get all users from the Gist
  static async getUsers(): Promise<UserData[]> {
    // Return cache if available
    if (this.usersCache !== null) {
      return this.usersCache;
    }
    
    // If we've already determined to use local fallback, don't try Gist again
    if (this.useLocalFallback) {
      return this.getLocalUsers();
    }

    try {
      // Check if Gist ID and token are configured
      if (!GIST_ID || !GITHUB_TOKEN) {
        console.warn('GitHub Gist configuration missing. Using local storage fallback.');
        this.useLocalFallback = true;
        return this.getLocalUsers();
      }
      
      const response = await axios.get(`https://api.github.com/gists/${GIST_ID}`, {
        headers: this.headers,
      });
      
      if (response.data.files && response.data.files[GIST_FILENAME]) {
        const content = response.data.files[GIST_FILENAME].content;
        try {
          const parsedData = JSON.parse(content);
          // Ensure the parsed data is an array
          if (Array.isArray(parsedData)) {
            this.usersCache = parsedData;
            this.saveLocalUsers(parsedData); // Backup to localStorage
            return parsedData;
          } else if (typeof parsedData === 'object') {
            console.warn('Gist data is not an array, but an object. Converting to array.');
            // If data is an object with users property, convert to array
            if (parsedData.users && Array.isArray(parsedData.users)) {
              this.usersCache = parsedData.users;
              this.saveLocalUsers(parsedData.users);
              return parsedData.users;
            } 
            // If it's a direct object with user data, return as single item array
            else if (parsedData.username) {
              const usersArray = [parsedData];
              this.usersCache = usersArray;
              this.saveLocalUsers(usersArray);
              return usersArray;
            }
          }
          console.warn('Unexpected data format from Gist. Using local fallback.');
          return this.getLocalUsers();
        } catch (parseError) {
          console.error('Error parsing JSON from Gist:', parseError);
          this.useLocalFallback = true;
          return this.getLocalUsers();
        }
      }
      console.warn('No valid data found in Gist. Using local fallback.');
      this.useLocalFallback = true;
      return this.getLocalUsers();
    } catch (error) {
      console.error('Error getting users from Gist:', error);
      this.useLocalFallback = true;
      return this.getLocalUsers();
    }
  }

  // Get users from local storage
  private static getLocalUsers(): UserData[] {
    try {
      const localData = localStorage.getItem('users');
      if (localData) {
        const users = JSON.parse(localData);
        this.usersCache = users;
        return users;
      }
    } catch (error) {
      console.error('Error reading from local storage:', error);
    }
    
    // Initialize with a demo user if nothing else is available
    const demoUser: UserData = {
      username: "demo",
      password: "password",
      money: 1000,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    this.usersCache = [demoUser];
    this.saveLocalUsers([demoUser]);
    return [demoUser];
  }

  // Save users to local storage
  private static saveLocalUsers(users: UserData[]): void {
    try {
      localStorage.setItem('users', JSON.stringify(users));
    } catch (error) {
      console.error('Error saving to local storage:', error);
    }
  }

  // Get a specific user by username
  static async getUserByUsername(username: string): Promise<UserData | null> {
    const users = await this.getUsers();
    return users.find((user) => user.username === username) || null;
  }

  // Add a new user
  static async addUser(userData: UserData): Promise<boolean> {
    try {
      // Get existing users
      const users = await this.getUsers();
      
      // Check if user already exists
      if (users.find(user => user.username === userData.username)) {
        return false; // User already exists
      }
      
      // Add timestamp
      userData.createdAt = new Date().toISOString();
      userData.lastLogin = new Date().toISOString();
      
      // Add new user
      users.push(userData);
      
      // Update cache
      this.usersCache = users;
      
      // Save locally
      this.saveLocalUsers(users);
      
      // If we're using local fallback only, we're done
      if (this.useLocalFallback) {
        return true;
      }
      
      // Otherwise try to update Gist
      try {
        const gistSuccess = await this.updateGist(users);
        if (!gistSuccess) {
          console.warn('Failed to update Gist. Using local storage only.');
          this.useLocalFallback = true;
        }
        return true;
      } catch (gistError) {
        console.error('Error updating Gist:', gistError);
        this.useLocalFallback = true;
        return true; // Still return true since we saved locally
      }
    } catch (error) {
      console.error('Error adding user:', error);
      return false;
    }
  }

  // Update user data
  static async updateUser(userData: UserData): Promise<boolean> {
    try {
      const users = await this.getUsers();
      const index = users.findIndex(user => user.username === userData.username);
      
      if (index === -1) {
        return false; // User not found
      }
      
      // Update the user
      userData.lastLogin = new Date().toISOString();
      users[index] = { ...users[index], ...userData };
      
      // Update cache
      this.usersCache = users;
      
      // Save locally
      this.saveLocalUsers(users);
      
      // If we're using local fallback only, we're done
      if (this.useLocalFallback) {
        return true;
      }
      
      // Otherwise try to update Gist
      try {
        const gistSuccess = await this.updateGist(users);
        if (!gistSuccess) {
          console.warn('Failed to update Gist. Using local storage only.');
          this.useLocalFallback = true;
        }
        return true;
      } catch (gistError) {
        console.error('Error updating Gist:', gistError);
        this.useLocalFallback = true;
        return true; // Still return true since we saved locally
      }
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  }

  // Update the Gist with new data
  private static async updateGist(users: UserData[]): Promise<boolean> {
    // Check if Gist ID and token are configured
    if (!GIST_ID || !GITHUB_TOKEN) {
      this.useLocalFallback = true;
      return false;
    }
    
    try {
      const response = await axios.patch(
        `https://api.github.com/gists/${GIST_ID}`,
        {
          files: {
            [GIST_FILENAME]: {
              content: JSON.stringify(users, null, 2),
            },
          },
        },
        {
          headers: this.headers,
        }
      );
      
      return response.status === 200;
    } catch (error) {
      console.error('Error updating Gist:', error);
      this.useLocalFallback = true;
      return false;
    }
  }

  // Verify user credentials
  static async verifyUser(username: string, password: string): Promise<UserData | null> {
    try {
      const user = await this.getUserByUsername(username);
      if (user && user.password === password) {
        // Update last login time
        user.lastLogin = new Date().toISOString();
        await this.updateUser(user);
        return user;
      }
      return null;
    } catch (error) {
      console.error('Error verifying user:', error);
      return null;
    }
  }
}

export default GistService;