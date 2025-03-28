import React, { useState, useEffect } from 'react';
import { DialogForm } from "@/components/ui/dialog-form";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { AlertTriangle, Info, Camera, Mouse, Keyboard, Globe, Database, Loader2 } from 'lucide-react';
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
  permissionInProgress?: boolean;
}

const STORAGE_KEY = 'ai-chat-browser-control';

export const BrowserControlDialog: React.FC<BrowserControlDialogProps> = ({ open, onOpenChange }) => {
  const [activeTab, setActiveTab] = useState('controls');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
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
  useEffect(() => {
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
  const toggleControl = async (id: string) => {
    // Find the control
    const control = controlOptions.find(option => option.id === id);
    
    if (!control) return;
    
    // If permission is required but not granted, request it
    if (control.requiresPermission && !control.permissionGranted) {
      await requestPermission(id);
      return;
    }
    
    // Otherwise toggle the enabled state
    setControlOptions(controlOptions.map(option => {
      if (option.id === id) {
        return { ...option, enabled: !option.enabled };
      }
      return option;
    }));
  };

  // Request permission for a control
  const requestPermission = async (id: string) => {
    const controlName = controlOptions.find(option => option.id === id)?.name || 'this feature';
    
    // Mark this control as having permission in progress
    setControlOptions(controlOptions.map(option => {
      if (option.id === id) {
        return { ...option, permissionInProgress: true };
      }
      return option;
    }));
    
    toast.info(`Requesting permission for ${controlName}`);
    
    try {
      let granted = false;
      
      // Handle different permission types
      switch (id) {
        case 'screenshots':
          if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
            try {
              const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
              
              // Take a test screenshot to make sure it works
              const video = document.createElement('video');
              video.srcObject = stream;
              await video.play();
              
              const canvas = document.createElement('canvas');
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              const ctx = canvas.getContext('2d');
              ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
              
              // Show preview image
              setPreviewImage(canvas.toDataURL('image/png'));
              
              // Stop all tracks to release the screen capture
              stream.getTracks().forEach(track => track.stop());
              
              granted = true;
            } catch (err) {
              console.error('Error getting screen capture permission:', err);
              toast.error('Screen capture permission denied');
            }
          } else {
            toast.error('Screen capture is not supported in this browser');
          }
          break;
          
        case 'mouse':
        case 'keyboard':
          // Simulate permission process
          await new Promise(resolve => setTimeout(resolve, 1500));
          granted = true;
          toast.success(`${controlName} permission granted`);
          break;
          
        default:
          granted = true;
      }
      
      // Update the control status
      setControlOptions(controlOptions.map(option => {
        if (option.id === id) {
          return { 
            ...option, 
            permissionGranted: granted, 
            enabled: granted, 
            permissionInProgress: false 
          };
        }
        return option;
      }));
      
    } catch (error) {
      console.error(`Error requesting permission for ${id}:`, error);
      toast.error(`Failed to get permission for ${controlName}`);
      
      setControlOptions(controlOptions.map(option => {
        if (option.id === id) {
          return { ...option, permissionInProgress: false };
        }
        return option;
      }));
    }
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
                    {option.id === 'screenshots' && previewImage && option.permissionGranted && (
                      <div className="mt-2 border rounded overflow-hidden w-24 h-16">
                        <img 
                          src={previewImage} 
                          alt="Screenshot preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
                {option.permissionInProgress ? (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                ) : (
                  <Switch 
                    checked={option.enabled} 
                    onCheckedChange={() => toggleControl(option.id)}
                    disabled={option.requiresPermission && !option.permissionGranted && !option.enabled}
                  />
                )}
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
