
import React, { useState, useEffect } from 'react';
import { DialogForm } from "@/components/ui/dialog-form";
import { QRCodeSVG } from 'qrcode.react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Phone, Copy, Share } from 'lucide-react';
import { toast } from 'sonner';

interface MobileQRDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MobileQRDialog: React.FC<MobileQRDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const [currentUrl, setCurrentUrl] = useState('');
  const [settings, setSettings] = useState({
    streamingEnabled: true,
    notificationsEnabled: false,
    darkMode: false,
    compactMode: false
  });

  useEffect(() => {
    if (open) {
      // Get the current URL to generate QR code
      setCurrentUrl(window.location.href);
      
      // Load settings from localStorage
      try {
        const savedSettings = localStorage.getItem('ai-chat-settings');
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings);
          setSettings({
            streamingEnabled: parsedSettings.ai?.streamingEnabled ?? true,
            notificationsEnabled: false,
            darkMode: parsedSettings.appearance?.darkMode ?? false,
            compactMode: parsedSettings.appearance?.compactMode ?? false
          });
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, [open]);

  const copyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    toast.success('Link copied to clipboard');
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'JR AI Chat',
          text: 'Check out this AI chat app!',
          url: currentUrl,
        });
        toast.success('Link shared successfully');
      } catch (error) {
        console.error('Error sharing:', error);
        toast.error('Failed to share link');
      }
    } else {
      copyLink();
    }
  };

  const toggleSetting = (setting: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    
    // Update localStorage for relevant settings
    try {
      const savedSettings = localStorage.getItem('ai-chat-settings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        
        if (setting === 'darkMode') {
          parsedSettings.appearance = parsedSettings.appearance || {};
          parsedSettings.appearance.darkMode = !settings.darkMode;
          document.documentElement.classList.toggle('dark', !settings.darkMode);
        } else if (setting === 'compactMode') {
          parsedSettings.appearance = parsedSettings.appearance || {};
          parsedSettings.appearance.compactMode = !settings.compactMode;
        } else if (setting === 'streamingEnabled') {
          parsedSettings.ai = parsedSettings.ai || {};
          parsedSettings.ai.streamingEnabled = !settings.streamingEnabled;
        }
        
        localStorage.setItem('ai-chat-settings', JSON.stringify(parsedSettings));
      }
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  return (
    <DialogForm
      open={open}
      onOpenChange={onOpenChange}
      title="Mobile Access"
      description="Scan this QR code to use the app on your mobile device"
      footerActions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={copyLink}>
            <Copy className="w-4 h-4 mr-2" />
            Copy Link
          </Button>
          <Button onClick={shareLink}>
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      }
    >
      <div className="flex flex-col space-y-4">
        <div className="qr-code-container mx-auto">
          <QRCodeSVG 
            value={currentUrl} 
            size={200}
            level="H" 
          />
        </div>
        
        <p className="text-center text-sm text-muted-foreground">
          Scan with your phone's camera to open this chat on your mobile device
        </p>
        
        <Separator />
        
        <div className="space-y-3">
          <h3 className="text-md font-medium">Mobile Settings</h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-primary" />
              <Label htmlFor="streaming-toggle">Streaming Responses</Label>
            </div>
            <Switch 
              id="streaming-toggle" 
              checked={settings.streamingEnabled}
              onCheckedChange={() => toggleSetting('streamingEnabled')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-primary" />
              <Label htmlFor="dark-toggle">Dark Mode</Label>
            </div>
            <Switch 
              id="dark-toggle" 
              checked={settings.darkMode}
              onCheckedChange={() => toggleSetting('darkMode')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-primary" />
              <Label htmlFor="compact-toggle">Compact Mode</Label>
            </div>
            <Switch 
              id="compact-toggle" 
              checked={settings.compactMode}
              onCheckedChange={() => toggleSetting('compactMode')}
            />
          </div>
        </div>
      </div>
    </DialogForm>
  );
};

export default MobileQRDialog;
