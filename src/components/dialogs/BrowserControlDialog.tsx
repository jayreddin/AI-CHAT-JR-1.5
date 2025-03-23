
import React, { useState } from 'react';
import { DialogForm } from "@/components/ui/dialog-form";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { AlertTriangle, Info, Camera, Mouse, Keyboard, Globe, Database } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BrowserControlDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ControlOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  requiresPermission: boolean;
  permissionGranted?: boolean;
}

const STORAGE_KEY = 'ai-chat-browser-control';

export const BrowserControlDialog: React.FC<BrowserControlDialogProps> = ({ open, onOpenChange }) => {
  const [activeTab, setActiveTab] = useState('controls');
  
  const [controlOptions, setControlOptions] = useState<ControlOption[]>([
    {
      id: 'screenshots',
      name: 'Take Screenshots',
      description: 'Allow the AI to capture the current screen state',
      icon: <Camera className="h-5 w-5" />,
      enabled: false,
      requiresPermission: true,
      permissionGranted: false
    },
    {
      id: 'mouse',
      name: 'Mouse Control',
      description: 'Allow the AI to control the mouse cursor',
      icon: <Mouse className="h-5 w-5" />,
      enabled: false,
      requiresPermission: true,
      permissionGranted: false
    },
    {
      id: 'keyboard',
      name: 'Keyboard Input',
      description: 'Allow the AI to input text and keyboard commands',
      icon: <Keyboard className="h-5 w-5" />,
      enabled: false,
      requiresPermission: true,
      permissionGranted: false
    },
    {
      id: 'navigation',
      name: 'Web Navigation',
      description: 'Allow the AI to navigate to websites and pages',
      icon: <Globe className="h-5 w-5" />,
      enabled: false,
      requiresPermission: false
    },
    {
      id: 'storage',
      name: 'Local Storage Access',
      description: 'Allow the AI to access browser storage',
      icon: <Database className="h-5 w-5" />,
      enabled: false,
      requiresPermission: false
    }
  ]);

  // Load settings from localStorage when dialog opens
  React.useEffect(() => {
    if (open) {
      const savedSettings = localStorage.getItem(STORAGE_KEY);
      if (savedSettings) {
        try {
          const parsedSettings = JSON.parse(savedSettings);
          setControlOptions(parsedSettings);
        } catch (error) {
          console.error('Error parsing saved browser control settings:', error);
        }
      }
    }
  }, [open]);

  // Toggle control option
  const toggleControl = (id: string) => {
    setControlOptions(controlOptions.map(option => {
      if (option.id === id) {
        if (option.requiresPermission && !option.permissionGranted) {
          requestPermission(id);
          return option;
        }
        return { ...option, enabled: !option.enabled };
      }
      return option;
    }));
  };

  // Request permission for a control
  const requestPermission = (id: string) => {
    toast.info(`Requesting permission for ${controlOptions.find(option => option.id === id)?.name}`);
    
    // Simulate a permission request
    setTimeout(() => {
      setControlOptions(controlOptions.map(option => {
        if (option.id === id) {
          return { ...option, permissionGranted: true, enabled: true };
        }
        return option;
      }));
      toast.success('Permission granted');
    }, 1500);
  };

  // Save settings
  const saveSettings = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(controlOptions));
    toast.success('Browser control settings saved');
    onOpenChange(false);
  };

  // Count enabled controls
  const enabledCount = controlOptions.filter(option => option.enabled).length;

  return (
    <DialogForm
      open={open}
      onOpenChange={onOpenChange}
      title="Browser Control Settings"
      description={`${enabledCount} controls enabled`}
      footerActions={
        <Button onClick={saveSettings}>Save Settings</Button>
      }
    >
      <div className="space-y-4">
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/20">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Enabling browser controls gives the AI access to control aspects of your browser.
            Only enable features you're comfortable with.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="controls" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="controls">Control Options</TabsTrigger>
            <TabsTrigger value="about">About & Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="controls" className="space-y-4 pt-4">
            {controlOptions.map((option) => (
              <div key={option.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    {option.icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{option.name}</h3>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                </div>
                <Switch 
                  checked={option.enabled} 
                  onCheckedChange={() => toggleControl(option.id)}
                  disabled={option.requiresPermission && !option.permissionGranted && !option.enabled}
                />
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="about" className="space-y-4 pt-4">
            <div className="bg-accent/50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium mb-2">About Browser Control</h3>
                  <p className="text-sm">
                    Browser control allows the AI to interact with your browser to automate tasks and provide more interactive assistance.
                  </p>
                  <h4 className="font-medium mt-4 mb-1">Available Features:</h4>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>Screenshot capture for visual context</li>
                    <li>Mouse and keyboard automation</li>
                    <li>Web navigation assistance</li>
                    <li>Form filling and data entry</li>
                    <li>Browser memory for AI context</li>
                  </ul>
                  <h4 className="font-medium mt-4 mb-1">Security Notes:</h4>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>All actions are executed in your browser only</li>
                    <li>No data is sent to external servers without your permission</li>
                    <li>You can revoke permissions at any time</li>
                    <li>Browser control is isolated to this application's context</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DialogForm>
  );
};
