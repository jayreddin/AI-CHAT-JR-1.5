
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useChat } from '@/context/chat/ChatProvider';
import ToolbarButton from '@/components/ToolbarButton'; 
import { useToolbarDialogs } from '@/components/toolbar/useToolbarDialogs';
import { useToolbarCounts } from '@/components/toolbar/useToolbarCounts';
import ToolbarDialogs from '@/components/toolbar/ToolbarDialogs';
import { 
  History, 
  Image, 
  FileUp, 
  Book, 
  Link, 
  Wrench, 
  Server, 
  Bot, 
  Globe, 
  Settings,
  ImageIcon,
  Plus
} from 'lucide-react';

interface ToolbarProps {
  show: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({ show }) => {
  const isMobile = useIsMobile();
  const { isLoggedIn, login, createNewChat } = useChat();
  const { openDialog, openDialogHandler, closeDialogHandler } = useToolbarDialogs();
  const { refreshCounts, ...counts } = useToolbarCounts();

  if (!show) return null;

  const buttonSize = isMobile ? 14 : 18;
  
  const handleButtonClick = (dialogName: string) => {
    if (!isLoggedIn) {
      login();
      return;
    }
    openDialogHandler(dialogName);
  };

  return (
    <>
      <div className={`flex items-center justify-center gap-1 md:gap-2 p-1 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-full shadow-sm mx-auto w-fit max-w-[calc(100vw-16px)] overflow-x-auto hide-scrollbar`}>
        <ToolbarButton
          icon={Plus}
          label="New Chat"
          size={buttonSize}
          onClick={createNewChat}
        />
        
        <ToolbarButton
          icon={History}
          label="History"
          size={buttonSize}
          onClick={() => handleButtonClick('history')}
        />
        
        <ToolbarButton
          icon={Image}
          label="Image"
          size={buttonSize}
          onClick={() => handleButtonClick('image')}
        />
        
        <ToolbarButton
          icon={FileUp}
          label="File"
          size={buttonSize}
          onClick={() => handleButtonClick('file')}
        />
        
        <ToolbarButton
          icon={Book}
          label="Knowledge"
          size={buttonSize}
          onClick={() => handleButtonClick('knowledge')}
        />
        
        <ToolbarButton
          icon={Link}
          label="Web URL"
          size={buttonSize}
          onClick={() => handleButtonClick('weburl')}
        />
        
        <ToolbarButton
          icon={Wrench}
          label="Tools"
          size={buttonSize}
          onClick={() => handleButtonClick('tools')}
        />
        
        <ToolbarButton
          icon={Server}
          label="MCP"
          size={buttonSize}
          onClick={() => handleButtonClick('mcp')}
        />
        
        <ToolbarButton
          icon={Bot}
          label="Agents"
          size={buttonSize}
          onClick={() => handleButtonClick('agents')}
        />
        
        <ToolbarButton
          icon={Globe}
          label="Browser"
          size={buttonSize}
          onClick={() => handleButtonClick('browser')}
        />
        
        <ToolbarButton
          icon={ImageIcon}
          label="Images"
          size={buttonSize}
          onClick={() => handleButtonClick('imagegeneration')}
        />
        
        <ToolbarButton
          icon={Settings}
          label="Settings"
          size={buttonSize}
          onClick={() => handleButtonClick('settings')}
        />
      </div>
      
      <ToolbarDialogs 
        openDialog={openDialog} 
        closeDialogHandler={closeDialogHandler}
        refreshCounts={refreshCounts}
      />
    </>
  );
};

export default Toolbar;
