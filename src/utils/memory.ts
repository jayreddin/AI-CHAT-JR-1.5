
import { loadFromStorage, saveToStorage } from './storage';

// Base path for memory storage
const MEMORY_BASE_PATH = 'jr-ai-chat-memory';

// Structure for the memory system
const MEMORY_STRUCTURE = {
  knowledgeBase: '/knowledge',
  tools: '/tools',
  mcpServers: '/mcp-servers',
  agents: '/agents',
  settings: '/settings',
  history: '/history',
};

// Check if memory is enabled
export const isMemoryEnabled = (): boolean => {
  try {
    const settings = loadFromStorage('ai-chat-settings', null);
    return settings?.appearance?.memoryEnabled || false;
  } catch (error) {
    console.error('Error checking if memory is enabled:', error);
    return false;
  }
};

// Create a directory in memory
export const makeMemoryDir = async (path: string): Promise<boolean> => {
  if (!isMemoryEnabled()) return false;
  
  try {
    const fullPath = `${MEMORY_BASE_PATH}${path}`;
    
    // Check if directory exists
    const existing = localStorage.getItem(`${fullPath}/.metadata`);
    if (existing) return true;
    
    // Create directory metadata
    const metadata = {
      type: 'directory',
      created: new Date().toISOString(),
      path: fullPath,
    };
    
    localStorage.setItem(`${fullPath}/.metadata`, JSON.stringify(metadata));
    return true;
  } catch (error) {
    console.error(`Error creating memory directory ${path}:`, error);
    return false;
  }
};

// Save data to memory
export const saveToMemory = async (path: string, data: string): Promise<boolean> => {
  if (!isMemoryEnabled()) return false;
  
  try {
    const fullPath = `${MEMORY_BASE_PATH}${path}`;
    
    // Ensure parent directory exists
    const dirPath = fullPath.substring(0, fullPath.lastIndexOf('/'));
    await makeMemoryDir(dirPath);
    
    // Save file data
    localStorage.setItem(fullPath, data);
    
    // Save file metadata
    const metadata = {
      type: 'file',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      path: fullPath,
      size: data.length,
    };
    
    localStorage.setItem(`${fullPath}.metadata`, JSON.stringify(metadata));
    return true;
  } catch (error) {
    console.error(`Error saving to memory ${path}:`, error);
    return false;
  }
};

// Load data from memory
export const loadFromMemory = (path: string): string | null => {
  if (!isMemoryEnabled()) return null;
  
  try {
    const fullPath = `${MEMORY_BASE_PATH}${path}`;
    return localStorage.getItem(fullPath);
  } catch (error) {
    console.error(`Error loading from memory ${path}:`, error);
    return null;
  }
};

// List items in a directory
export const listMemoryDir = (path: string): string[] => {
  if (!isMemoryEnabled()) return [];
  
  try {
    const fullPath = `${MEMORY_BASE_PATH}${path}`;
    const files: string[] = [];
    
    // Scan localStorage for items with matching prefix
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(fullPath) && !key.endsWith('.metadata') && key !== `${fullPath}/.metadata`) {
        files.push(key.replace(fullPath, ''));
      }
    }
    
    return files;
  } catch (error) {
    console.error(`Error listing memory directory ${path}:`, error);
    return [];
  }
};

// Initialize memory structure
export const initMemoryStructure = async (): Promise<void> => {
  if (!isMemoryEnabled()) return;
  
  try {
    // Create base directories
    await makeMemoryDir('/');
    
    for (const [key, path] of Object.entries(MEMORY_STRUCTURE)) {
      await makeMemoryDir(path);
    }
    
    console.log('Memory structure initialized');
  } catch (error) {
    console.error('Error initializing memory structure:', error);
  }
};

// Save user profile to memory
export const saveUserProfile = async (profile: any): Promise<boolean> => {
  if (!isMemoryEnabled()) return false;
  
  try {
    return await saveToMemory('/settings/user-profile.json', JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving user profile to memory:', error);
    return false;
  }
};

// Update memory when settings are saved
export const updateMemoryFromSettings = async (settings: any): Promise<void> => {
  try {
    // If memory was just enabled, initialize the structure
    if (settings.appearance.memoryEnabled) {
      await initMemoryStructure();
      
      // Save the current settings
      await saveToMemory('/settings/app-settings.json', JSON.stringify(settings));
      
      // Save user profile if it exists
      if (settings.account) {
        await saveUserProfile(settings.account);
      }
    }
  } catch (error) {
    console.error('Error updating memory from settings:', error);
  }
};
