
import React from 'react';
import { UserCheck, User } from 'lucide-react';
import ModelSelector from './ModelSelector';
import { useChat } from '@/context/ChatContext';
import { Switch } from "@/components/ui/switch";
import { useIsMobile } from '@/hooks/use-mobile';

const Header: React.FC = () => {
  const { isLoggedIn, login, logout, streamingEnabled, toggleStreamingMode } = useChat();
  const isMobile = useIsMobile();

  return (
    <header className="p-3 border-b border-gray-200 flex items-center justify-between bg-white/80 backdrop-blur-sm sticky top-0 z-10">
      {/* Logo */}
      <div className="flex items-center">
        <div className="flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600 text-white px-3 py-1.5 rounded-xl shadow-sm">
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
    </header>
  );
};

export default Header;
