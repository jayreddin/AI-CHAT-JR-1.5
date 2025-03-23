
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { useChat } from '@/context/chat/ChatProvider';
import ModelSelector from '@/components/ModelSelector';
import { ChevronDown, UserCircle, LogOut, LogIn, Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { loadFromStorage } from '@/utils/storage';

const Header = () => {
  const { 
    isLoggedIn, 
    login, 
    logout, 
    streamingEnabled, 
    toggleStreamingMode,
    createNewChat 
  } = useChat();
  
  const isMobile = useIsMobile();
  const userAvatar = loadFromStorage('userAvatar', '');
  const userName = loadFromStorage('userName', '');

  return (
    <header className="bg-white border-b p-2 md:p-3 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo and Name */}
        <div className="flex items-center">
          <button onClick={createNewChat} className="font-bold text-lg text-primary flex items-center">
            {!isMobile && <span className="mr-1">🧠</span>}
            JR AI Chat
          </button>
        </div>

        {/* Settings and Controls */}
        <div className="flex items-center gap-3">
          {!isMobile && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Streaming</span>
              <Switch
                checked={streamingEnabled}
                onCheckedChange={toggleStreamingMode}
                aria-label="Toggle streaming mode"
              />
            </div>
          )}
          
          <ModelSelector />
          
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 hover:bg-gray-100 p-1 rounded-md">
                  {isLoggedIn ? (
                    <>
                      <Avatar className="h-8 w-8">
                        {userAvatar ? (
                          <AvatarImage src={userAvatar} alt="User avatar" />
                        ) : (
                          <AvatarFallback>
                            <UserCircle />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      {!isMobile && <ChevronDown size={16} />}
                    </>
                  ) : (
                    <>
                      <UserCircle size={isMobile ? 24 : 20} />
                      {!isMobile && <ChevronDown size={16} />}
                    </>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {isLoggedIn ? (
                  <>
                    <DropdownMenuLabel>
                      {userName || 'User Settings'}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {isMobile && (
                      <>
                        <DropdownMenuItem className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Streaming</span>
                          <Switch
                            checked={streamingEnabled}
                            onCheckedChange={toggleStreamingMode}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem onClick={logout} className="text-red-600">
                      <LogOut size={16} className="mr-2" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem onClick={login}>
                    <LogIn size={16} className="mr-2" />
                    <span>Sign In</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
