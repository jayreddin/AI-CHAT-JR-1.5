
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { updateMemoryFromSettings } from '@/utils/memory';

export interface AppSettings {
  appearance: {
    darkMode: boolean;
    terminalCommands: boolean;
    compactMode: boolean;
    memoryEnabled: boolean;
    textSize: number;
  };
  ai: {
    streamingEnabled: boolean;
    defaultModel: string;
    imageGeneration: {
      enabled: boolean;
      testMode: boolean;
    };
    imageToText: {
      enabled: boolean;
    };
  };
  account: {
    username: string;
    avatar: string | null;
    location: string;
    dateFormat: string;
    timeFormat: string;
  };
}

const STORAGE_KEY = 'ai-chat-settings';

const defaultSettings: AppSettings = {
  appearance: {
    darkMode: false,
    terminalCommands: false,
    compactMode: false,
    memoryEnabled: false,
    textSize: 100
  },
  ai: {
    streamingEnabled: true,
    defaultModel: 'gpt-4o-mini',
    imageGeneration: {
      enabled: true,
      testMode: true
    },
    imageToText: {
      enabled: true
    }
  },
  account: {
    username: '',
    avatar: null,
    location: '',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h'
  }
};

export const useSettings = (open: boolean) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  // Load settings from localStorage when dialog opens
  useEffect(() => {
    if (open) {
      const savedSettings = localStorage.getItem(STORAGE_KEY);
      if (savedSettings) {
        try {
          const parsedSettings = JSON.parse(savedSettings);
          setSettings(parsedSettings);
        } catch (error) {
          console.error('Error parsing saved settings:', error);
        }
      }
      
      // Check if dark mode is currently applied to the document
      const isDarkMode = document.documentElement.classList.contains('dark');
      if (isDarkMode !== settings.appearance.darkMode) {
        setSettings(prev => ({
          ...prev,
          appearance: {
            ...prev.appearance,
            darkMode: isDarkMode
          }
        }));
      }
    }
  }, [open]);

  // Save settings
  const saveSettings = async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    
    // Apply some settings immediately
    document.documentElement.style.fontSize = `${settings.appearance.textSize}%`;
    
    if (settings.appearance.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Update memory if enabled
    if (settings.appearance.memoryEnabled) {
      try {
        await updateMemoryFromSettings(settings);
      } catch (error) {
        console.error('Error updating memory from settings:', error);
      }
    }
    
    toast.success('Settings saved');
  };

  return {
    settings,
    setSettings,
    saveSettings
  };
};
