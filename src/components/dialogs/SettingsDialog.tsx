
import React, { useState, useEffect } from 'react';
import { DialogForm } from "@/components/ui/dialog-form";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Settings, 
  Moon, 
  Terminal, 
  Minimize, 
  Database, 
  ImagePlus, 
  FileText 
} from 'lucide-react';
import { toast } from 'sonner';
import { Separator } from "@/components/ui/separator";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface AppSettings {
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

export const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onOpenChange }) => {
  const [settings, setSettings] = useState<AppSettings>({
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
  });

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

  // Toggle a boolean setting
  const toggleSetting = (category: keyof AppSettings, setting: string) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [setting]: !settings[category][setting as keyof typeof settings[typeof category]]
      }
    });
  };

  // Toggle a nested boolean setting
  const toggleNestedSetting = (category: keyof AppSettings, group: string, setting: string) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [group]: {
          ...settings[category][group as keyof typeof settings[typeof category]],
          [setting]: !settings[category][group as keyof typeof settings[typeof category]][setting]
        }
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
    
    onOpenChange(false);
  };

  return (
    <DialogForm
      open={open}
      onOpenChange={onOpenChange}
      title="Settings"
      description="Customize your AI chat experience"
      footerActions={
        <Button onClick={saveSettings}>Save Settings</Button>
      }
    >
      <Tabs defaultValue="appearance" className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="ai">AI Settings</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="appearance" className="space-y-6">
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
                onCheckedChange={() => toggleSetting('appearance', 'darkMode')}
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
                onCheckedChange={() => toggleSetting('appearance', 'terminalCommands')}
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
                onCheckedChange={() => toggleSetting('appearance', 'compactMode')}
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
                onCheckedChange={() => toggleSetting('appearance', 'memoryEnabled')}
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
        </TabsContent>
        
        <TabsContent value="ai" className="space-y-6">
          <h3 className="text-lg font-medium">AI Features</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <ImagePlus className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-medium">Image Generation</h3>
                  <p className="text-sm text-muted-foreground">Enable AI image generation capabilities</p>
                </div>
              </div>
              <Switch 
                checked={settings.ai.imageGeneration.enabled} 
                onCheckedChange={() => toggleNestedSetting('ai', 'imageGeneration', 'enabled')}
              />
            </div>
            
            {settings.ai.imageGeneration.enabled && (
              <div className="ml-12 p-3 border rounded-lg bg-accent/20">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Test Mode (No API credits)</p>
                  <Switch 
                    checked={settings.ai.imageGeneration.testMode} 
                    onCheckedChange={() => toggleNestedSetting('ai', 'imageGeneration', 'testMode')}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Powered by Puter's AI txt2img API. Uses DALL·E model in test mode.
                </p>
                <div className="text-xs text-muted-foreground mt-1">
                  <code className="bg-background p-1 rounded text-xs block mt-2 overflow-x-auto">
                    puter.ai.txt2img('A picture of a cat.', true)
                  </code>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-medium">Image to Text</h3>
                  <p className="text-sm text-muted-foreground">Enable extracting text from images</p>
                </div>
              </div>
              <Switch 
                checked={settings.ai.imageToText.enabled} 
                onCheckedChange={() => toggleNestedSetting('ai', 'imageToText', 'enabled')}
              />
            </div>
            
            {settings.ai.imageToText.enabled && (
              <div className="ml-12 p-3 border rounded-lg bg-accent/20">
                <p className="text-xs text-muted-foreground mt-1">
                  Powered by Puter's AI img2txt API. Extract text from any image URL.
                </p>
                <div className="text-xs text-muted-foreground mt-1">
                  <code className="bg-background p-1 rounded text-xs block mt-2 overflow-x-auto">
                    puter.ai.img2txt('https://example.com/image.jpg')
                  </code>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-4">
          <h3 className="text-lg font-medium">Advanced Settings</h3>
          
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
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
                  }
                });
              }}
            >
              Reset All Settings
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                localStorage.removeItem('ai-chat-history');
                toast.success('Chat history cleared');
              }}
            >
              Clear Chat History
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                toast.info('Cache cleared successfully');
              }}
            >
              Clear Local Cache
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </DialogForm>
  );
};
