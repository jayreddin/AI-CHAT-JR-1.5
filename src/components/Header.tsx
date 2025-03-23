
import React, { useState } from 'react';
import { UserCheck, User, QrCode, Server, Settings as SettingsIcon } from 'lucide-react';
import ModelSelector from './ModelSelector';
import { useChat } from '@/context/ChatContext';
import { Switch } from "@/components/ui/switch";
import { useIsMobile } from '@/hooks/use-mobile';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  const { isLoggedIn, login, logout, streamingEnabled, toggleStreamingMode } = useChat();
  const isMobile = useIsMobile();
  const [showMobileSettings, setShowMobileSettings] = useState(false);
  const [serverActive, setServerActive] = useState(false);
  const serverUrl = "https://jr-ai-chat.example.com/mobile-server";

  return (
    <header className="p-3 border-b border-gray-200 flex items-center justify-between bg-white/80 backdrop-blur-sm sticky top-0 z-10">
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
      
      {/* Model selector - larger and more prominent */}
      <div className="flex-1 flex justify-center px-4 max-w-md">
        <ModelSelector />
      </div>
      
      <div className="flex items-center gap-3">
        {!isMobile && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Streaming</span>
            <Switch 
              checked={streamingEnabled} 
              onCheckedChange={toggleStreamingMode}
            />
          </div>
        )}
        
        <button
          onClick={isLoggedIn ? logout : login}
          className="flex items-center gap-1 p-2 rounded-full hover:bg-gray-100 transition-colors"
          title={isLoggedIn ? "Signed in" : "Sign in"}
        >
          {isLoggedIn ? (
            <UserCheck size={20} className="text-green-500" />
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
                  
                  <div className="flex justify-center">
                    <div className="bg-white p-2 border rounded w-40 h-40 flex items-center justify-center">
                      <QrCode size={120} />
                    </div>
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
