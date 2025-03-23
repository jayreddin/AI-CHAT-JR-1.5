
/**
 * Enhanced storage utility functions for persistent data management
 */

// Type for user settings
export interface UserSettings {
  username?: string;
  avatar?: string;
  location?: string;
  dateFormat?: string;
  timeFormat?: string;
  theme?: 'light' | 'dark' | 'system';
  language?: string;
}

// Function to save data to localStorage
export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

// Function to load data from localStorage
export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const savedData = localStorage.getItem(key);
    return savedData ? JSON.parse(savedData) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
}

// Function to remove data from localStorage
export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
}

// Get user settings from storage
export function getUserSettings(): UserSettings {
  return loadFromStorage<UserSettings>('userSettings', {});
}

// Save user settings to storage
export function saveUserSettings(settings: UserSettings): void {
  const currentSettings = getUserSettings();
  saveToStorage('userSettings', { ...currentSettings, ...settings });
}

// Clear all application data
export function clearAllData(): void {
  try {
    // List of keys to preserve (if any)
    const keysToPreserve: string[] = [];
    
    // Get all keys in localStorage
    const allKeys = Object.keys(localStorage);
    
    // Remove all keys except those to preserve
    allKeys.forEach(key => {
      if (!keysToPreserve.includes(key)) {
        localStorage.removeItem(key);
      }
    });
    
    console.log('All application data cleared');
  } catch (error) {
    console.error('Error clearing application data:', error);
  }
}

// Function to get total storage usage
export function getStorageUsage(): { used: number, total: number, percentage: number } {
  try {
    let totalSize = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key) || '';
        totalSize += key.length + value.length;
      }
    }
    
    // Convert to MB (approximate)
    const usedMB = totalSize / (1024 * 1024);
    const totalMB = 5; // Most browsers limit localStorage to 5-10MB
    const percentage = (usedMB / totalMB) * 100;
    
    return {
      used: usedMB,
      total: totalMB,
      percentage: percentage
    };
  } catch (error) {
    console.error('Error calculating storage usage:', error);
    return { used: 0, total: 5, percentage: 0 };
  }
}
