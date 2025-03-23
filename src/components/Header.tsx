
import React from 'react';
import { UserCheck, User } from 'lucide-react';
import ModelSelector from './ModelSelector';
import { useChat } from '@/context/ChatContext';

const Header: React.FC = () => {
  const { isLoggedIn, login, logout } = useChat();

  return (
    <header className="p-3 border-b border-gray-200 flex items-center justify-between bg-white/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center">
        <h1 className="text-xl font-medium mr-2">AI Chat</h1>
        <ModelSelector />
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
    </header>
  );
};

export default Header;
