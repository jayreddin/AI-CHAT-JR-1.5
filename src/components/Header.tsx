
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
import { UserCircle, LogOut, LogIn } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { loadFromStorage } from '@/utils/storage';
import Logo from '@/components/Logo';

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
    <header className="bg-white dark:bg-background border-b p-2 md:p-3 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Model Selector - Centered */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <ModelSelector />
        </div>

        {/* Settings and Controls */}
        <div className="flex items-center gap-3">
          {!isMobile && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">Streaming</span>
              <Switch
                checked={streamingEnabled}
                onCheckedChange={toggleStreamingMode}
                aria-label="Toggle streaming mode"
              />
            </div>
          )}
          
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 hover:bg-gray-100 hover:dark:bg-gray-800 p-1 rounded-md">
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
                      {!isMobile && <span className="text-sm">{userName || 'User'}</span>}
                    </>
                  ) : (
                    <>
                      <UserCircle size={isMobile ? 24 : 20} />
                      {!isMobile && <span className="text-sm">Sign In</span>}
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
                        <DropdownMenuItem className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-300">Streaming</span>
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
