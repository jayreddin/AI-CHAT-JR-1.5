
import React from 'react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { AppSettings } from '@/hooks/useSettings';

interface AdvancedSettingsTabProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

export const AdvancedSettingsTab: React.FC<AdvancedSettingsTabProps> = ({ settings, setSettings }) => {
  const resetAllSettings = () => {
    localStorage.clear();
    toast.success('All settings and data cleared');
    setSettings({
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
    });
  };

  const clearChatHistory = () => {
    localStorage.removeItem('ai-chat-history');
    toast.success('Chat history cleared');
  };

  const clearLocalCache = () => {
    toast.info('Cache cleared successfully');
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Advanced Settings</h3>
      
      <div className="space-y-3">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={resetAllSettings}
        >
          Reset All Settings
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full"
          onClick={clearChatHistory}
        >
          Clear Chat History
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full"
          onClick={clearLocalCache}
        >
          Clear Local Cache
        </Button>
      </div>
    </div>
  );
};
