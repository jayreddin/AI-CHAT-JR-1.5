
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { ImagePlus, FileText } from 'lucide-react';
import { AppSettings } from '@/hooks/useSettings';

interface AISettingsTabProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

export const AISettingsTab: React.FC<AISettingsTabProps> = ({ settings, setSettings }) => {
  // Toggle a nested boolean setting
  const toggleNestedSetting = (group: 'imageGeneration' | 'imageToText', setting: string) => {
    setSettings({
      ...settings,
      ai: {
        ...settings.ai,
        [group]: {
          ...settings.ai[group],
          [setting]: !settings.ai[group][setting as keyof typeof settings.ai[typeof group]]
        }
      }
    });
  };

  return (
    <div className="space-y-6">
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
            onCheckedChange={() => toggleNestedSetting('imageGeneration', 'enabled')}
          />
        </div>
        
        {settings.ai.imageGeneration.enabled && (
          <div className="ml-12 p-3 border rounded-lg bg-accent/20">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Test Mode (No API credits)</p>
              <Switch 
                checked={settings.ai.imageGeneration.testMode} 
                onCheckedChange={() => toggleNestedSetting('imageGeneration', 'testMode')}
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
            onCheckedChange={() => toggleNestedSetting('imageToText', 'enabled')}
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
    </div>
  );
};
