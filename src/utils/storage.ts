
/**
 * Storage utilities for persisting data in localStorage
 */

// Function to load data from localStorage with proper typing
export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    if (typeof window === 'undefined') {
      return defaultValue;
    }
    
    const item = localStorage.getItem(`jr-ai-chat-${key}`);
    
    if (item === null) {
      return defaultValue;
    }
    
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error loading "${key}" from storage:`, error);
    return defaultValue;
  }
}

// Function to save data to localStorage
export function saveToStorage<T>(key: string, value: T): void {
  try {
    if (typeof window === 'undefined') {
      return;
    }
    
    localStorage.setItem(`jr-ai-chat-${key}`, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving "${key}" to storage:`, error);
  }
}

// Function to remove data from localStorage
export function removeFromStorage(key: string): void {
  try {
    if (typeof window === 'undefined') {
      return;
    }
    
    localStorage.removeItem(`jr-ai-chat-${key}`);
  } catch (error) {
    console.error(`Error removing "${key}" from storage:`, error);
  }
}

// Function to clear all app-related data from localStorage
export function clearAllStorage(): void {
  try {
    if (typeof window === 'undefined') {
      return;
    }
    
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('jr-ai-chat-')) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.error('Error clearing all storage:', error);
  }
}

// Helper to save user settings
export function saveUserSettings(settings: Record<string, any>): void {
  saveToStorage('userSettings', settings);
}

// Helper to load user settings
export function loadUserSettings<T>(defaultSettings: T): T {
  return loadFromStorage<T>('userSettings', defaultSettings);
}
