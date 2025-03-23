
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Moon, Terminal, Minimize, Database } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { AppSettings } from '@/hooks/useSettings';

interface AppearanceTabProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

export const AppearanceTab: React.FC<AppearanceTabProps> = ({ settings, setSettings }) => {
  // Toggle a boolean setting
  const toggleSetting = (setting: 'darkMode' | 'terminalCommands' | 'compactMode' | 'memoryEnabled') => {
    setSettings({
      ...settings,
      appearance: {
        ...settings.appearance,
        [setting]: !settings.appearance[setting]
      }
    });
  };

  // Update text size
  const updateTextSize = (value: number[]) => {
    setSettings({
      ...settings,
      appearance: {
        ...settings.appearance,
        textSize: value[0]
      }
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Display Options</h3>
      
      {/* Row 1: Dark Mode and Terminal Commands side by side */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2 p-3 border rounded-lg">
          <div className="p-2 bg-primary/10 rounded-full">
            <Moon className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Dark Mode</p>
          </div>
          <Switch 
            checked={settings.appearance.darkMode} 
            onCheckedChange={() => toggleSetting('darkMode')}
          />
        </div>
        
        <div className="flex items-center gap-2 p-3 border rounded-lg">
          <div className="p-2 bg-primary/10 rounded-full">
            <Terminal className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Terminal Commands</p>
          </div>
          <Switch 
            checked={settings.appearance.terminalCommands} 
            onCheckedChange={() => toggleSetting('terminalCommands')}
          />
        </div>
      </div>
      
      {/* Row 2: Compact Mode and Memory side by side */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2 p-3 border rounded-lg">
          <div className="p-2 bg-primary/10 rounded-full">
            <Minimize className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Compact Mode</p>
          </div>
          <Switch 
            checked={settings.appearance.compactMode} 
            onCheckedChange={() => toggleSetting('compactMode')}
          />
        </div>
        
        <div className="flex items-center gap-2 p-3 border rounded-lg">
          <div className="p-2 bg-primary/10 rounded-full">
            <Database className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Memory</p>
          </div>
          <Switch 
            checked={settings.appearance.memoryEnabled} 
            onCheckedChange={() => toggleSetting('memoryEnabled')}
          />
        </div>
      </div>
      
      <Separator />
      
      {/* Text Size Slider */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium">Text Size: {settings.appearance.textSize}%</label>
          <Input 
            type="number" 
            value={settings.appearance.textSize} 
            onChange={(e) => updateTextSize([parseInt(e.target.value)])}
            className="w-16 h-8 text-center"
            min="60"
            max="150"
          />
        </div>
        <Slider 
          value={[settings.appearance.textSize]} 
          onValueChange={updateTextSize}
          min={60}
          max={150}
          step={5}
          className="w-full max-w-xs"
        />
      </div>
    </div>
  );
};
