
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

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
  const saveSettings = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    toast.success('Settings saved');
    
    // Apply some settings immediately
    document.documentElement.style.fontSize = `${settings.appearance.textSize}%`;
    
    if (settings.appearance.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return {
    settings,
    setSettings,
    saveSettings
  };
};
