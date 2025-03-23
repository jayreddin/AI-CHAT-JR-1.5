
import React, { useState, useEffect } from 'react';
import { UserCheck, User, QrCode, Server, Settings as SettingsIcon } from 'lucide-react';
import ModelSelector from './ModelSelector';
import { useChat } from '@/context/chat/ChatProvider';
import { Switch } from "@/components/ui/switch";
import { useIsMobile } from '@/hooks/use-mobile';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { loadFromStorage } from '@/utils/storage';

const Header: React.FC = () => {
  const { isLoggedIn, login, logout, streamingEnabled, toggleStreamingMode } = useChat();
  const isMobile = useIsMobile();
  const [showMobileSettings, setShowMobileSettings] = useState(false);
  const [serverActive, setServerActive] = useState(false);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [serverQrCode, setServerQrCode] = useState<string>('');
  const serverUrl = window.location.href;
  
  // Generate QR code
  useEffect(() => {
    if (showMobileSettings && serverActive) {
      // Generate QR code - in a real implementation, use a QR code library
      // For now, we'll just use a placeholder
      setServerQrCode(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(serverUrl)}`);
    }
  }, [showMobileSettings, serverActive, serverUrl]);
  
  // Load user avatar from settings
  useEffect(() => {
    const settings = loadFromStorage('ai-chat-settings', null);
    if (settings?.account?.avatar) {
      setUserAvatar(settings.account.avatar);
    }
  }, []);

  return (
    <header className={`p-3 border-b border-gray-200 flex items-center justify-between bg-white/80 backdrop-blur-sm sticky top-0 z-10 ${isMobile ? 'header-compact' : ''}`}>
      {/* Logo */}
      <div className="flex items-center">
        <div 
          className="flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600 text-white px-3 py-1.5 rounded-xl shadow-sm cursor-pointer"
          onClick={() => setShowMobileSettings(true)}
        >
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold tracking-tight leading-none">JR</span>
            <div className="flex flex-col items-center leading-none mt-0.5">
              <span className="text-xs font-medium">AI CHAT</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Model selector */}
      <div className="flex-1 flex justify-center px-4 max-w-md">
        <ModelSelector />
      </div>
      
      <div className="flex items-center gap-3">
        {/* Streaming toggle - hidden on mobile in normal view */}
        <div className={`items-center gap-2 ${isMobile ? 'hidden' : 'flex'}`}>
          <span className="text-sm text-gray-600">Streaming</span>
          <Switch 
            checked={streamingEnabled} 
            onCheckedChange={toggleStreamingMode}
          />
        </div>
        
        <button
          onClick={isLoggedIn ? logout : login}
          className="flex items-center gap-1 p-2 rounded-full hover:bg-gray-100 transition-colors"
          title={isLoggedIn ? "Signed in" : "Sign in"}
        >
          {isLoggedIn ? (
            userAvatar ? (
              <Avatar className="h-6 w-6">
                <AvatarImage src={userAvatar} alt="User avatar" />
                <AvatarFallback>
                  <UserCheck size={20} className="text-green-500" />
                </AvatarFallback>
              </Avatar>
            ) : (
              <UserCheck size={20} className="text-green-500" />
            )
          ) : (
            <User size={20} className="text-gray-500" />
          )}
        </button>
      </div>

      {/* Mobile Settings Dialog */}
      <Dialog open={showMobileSettings} onOpenChange={setShowMobileSettings}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Mobile Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex flex-col gap-4">
              {/* Streaming toggle in mobile dialog */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Streaming Mode</span>
                <Switch 
                  checked={streamingEnabled} 
                  onCheckedChange={toggleStreamingMode} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Public Server</span>
                <Switch 
                  checked={serverActive} 
                  onCheckedChange={(checked) => setServerActive(checked)} 
                />
              </div>
              
              {serverActive && (
                <div className="space-y-4">
                  <div className="bg-gray-100 p-3 rounded text-center">
                    <div className="text-xs text-gray-500 mb-1">Server URL</div>
                    <div className="text-sm font-medium truncate">{serverUrl}</div>
                  </div>
                  
                  <div className="qr-code-container">
                    {serverQrCode && <img src={serverQrCode} alt="QR Code" className="w-full h-auto" />}
                  </div>
                  
                  <div className="flex justify-center">
                    <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(serverUrl)}>
                      Copy URL
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="pt-2">
                <h3 className="text-sm font-medium mb-2">Mobile App Settings</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Dark Mode</span>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Compact UI</span>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Notifications</span>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
