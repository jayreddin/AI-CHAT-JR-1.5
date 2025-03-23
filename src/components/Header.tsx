
import React from 'react';
import { UserCheck, User } from 'lucide-react';
import ModelSelector from './ModelSelector';
import { useChat } from '@/context/ChatContext';
import { Switch } from "@/components/ui/switch";

const Header: React.FC = () => {
  const { isLoggedIn, login, logout, streamingEnabled, toggleStreamingMode } = useChat();

  return (
    <header className="p-3 border-b border-gray-200 flex items-center justify-between bg-white/80 backdrop-blur-sm sticky top-0 z-10">
      {/* Logo */}
      <div className="flex items-center">
        <div className="flex flex-col items-center justify-center bg-gradient-to-r from-blue-600 to-blue-400 text-white px-3 py-1.5 rounded-xl shadow-sm">
          <div className="flex items-center">
            <span className="text-xl font-bold tracking-tight">JR</span>
            <div className="flex flex-col ml-1.5 leading-none">
              <span className="text-sm font-medium">AI</span>
              <span className="text-xs">Chat</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Model selector - larger and more prominent */}
      <div className="flex-1 flex justify-center max-w-sm px-4">
        <ModelSelector />
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
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
