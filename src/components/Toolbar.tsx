
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useChat } from '@/context/chat/ChatProvider';
import ToolbarButton from '@/components/ToolbarButton'; 
import useToolbarDialogs from '@/components/toolbar/useToolbarDialogs';
import useToolbarCounts from '@/components/toolbar/useToolbarCounts';
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
  ImageIcon
} from 'lucide-react';

interface ToolbarProps {
  show: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({ show }) => {
  const isMobile = useIsMobile();
  const { isLoggedIn, login } = useChat();
  const { openDialog, openDialogHandler, closeDialogHandler } = useToolbarDialogs();
  const { refreshCounts, ...counts } = useToolbarCounts();

  if (!show) return null;

  const buttonSize = isMobile ? 16 : 20;
  
  const handleButtonClick = (dialogName: string) => {
    if (!isLoggedIn) {
      login();
      return;
    }
    openDialogHandler(dialogName);
  };

  return (
    <>
      <div className={`flex items-center justify-center gap-1 md:gap-2 p-1 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-full shadow-sm mx-auto w-fit ${isMobile ? 'max-w-full overflow-x-auto hide-scrollbar' : ''}`}>
        <ToolbarButton
          icon={(props) => <History {...props} size={buttonSize} />}
          label="Chat History"
          onClick={() => handleButtonClick('history')}
        />
        
        <ToolbarButton
          icon={(props) => <Image {...props} size={buttonSize} />}
          label="Upload Image"
          onClick={() => handleButtonClick('image')}
        />
        
        <ToolbarButton
          icon={(props) => <FileUp {...props} size={buttonSize} />}
          label="Upload File"
          onClick={() => handleButtonClick('file')}
        />
        
        <ToolbarButton
          icon={(props) => <Book {...props} size={buttonSize} />}
          label="Knowledge Base"
          onClick={() => handleButtonClick('knowledge')}
        />
        
        <ToolbarButton
          icon={(props) => <Link {...props} size={buttonSize} />}
          label="Add Web URL"
          onClick={() => handleButtonClick('weburl')}
        />
        
        <ToolbarButton
          icon={(props) => <Wrench {...props} size={buttonSize} />}
          label="Tools"
          onClick={() => handleButtonClick('tools')}
        />
        
        <ToolbarButton
          icon={(props) => <Server {...props} size={buttonSize} />}
          label="MCP Servers"
          onClick={() => handleButtonClick('mcp')}
        />
        
        <ToolbarButton
          icon={(props) => <Bot {...props} size={buttonSize} />}
          label="AI Agents"
          onClick={() => handleButtonClick('agents')}
        />
        
        <ToolbarButton
          icon={(props) => <Globe {...props} size={buttonSize} />}
          label="Browser Control"
          onClick={() => handleButtonClick('browser')}
        />
        
        <ToolbarButton
          icon={(props) => <ImageIcon {...props} size={buttonSize} />}
          label="Image Generation"
          onClick={() => handleButtonClick('imagegeneration')}
        />
        
        <ToolbarButton
          icon={(props) => <Settings {...props} size={buttonSize} />}
          label="Settings"
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
