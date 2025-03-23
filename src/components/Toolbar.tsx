
import React from 'react';
import { 
  Plus, 
  Clock, 
  Image, 
  FileUp, 
  BookOpen, 
  Globe, 
  Wrench, 
  Server, 
  Bot, 
  Chrome, 
  Settings,
  ImagePlus
} from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { useToolbarDialogs } from './toolbar/useToolbarDialogs';
import { useToolbarCounts } from './toolbar/useToolbarCounts';
import ToolbarButton from './toolbar/ToolbarButton';
import ToolbarDialogs from './toolbar/ToolbarDialogs';
import { useIsMobile } from '@/hooks/use-mobile';

interface ToolbarProps {
  show: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({ show }) => {
  const { createNewChat } = useChat();
  const { openDialog, openDialogHandler, closeDialogHandler } = useToolbarDialogs();
  const { activeToolsCount, activeServersCount, installedAgentsCount, refreshCounts } = useToolbarCounts();
  const isMobile = useIsMobile();

  return (
    <>
      <div 
        className={`glass-morphism py-2 px-3 rounded-full flex items-center justify-center gap-2 md:gap-3 overflow-x-auto max-w-full mx-auto transition-all duration-300 ${
          show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <ToolbarButton icon={Plus} label={isMobile ? undefined : "New Chat"} onClick={createNewChat} />
        <ToolbarButton icon={Clock} label={isMobile ? undefined : "History"} onClick={() => openDialogHandler('history')} />
        <ToolbarButton icon={Image} label={isMobile ? undefined : "Image"} onClick={() => openDialogHandler('image')} />
        <ToolbarButton icon={ImagePlus} label={isMobile ? undefined : "Generate"} onClick={() => openDialogHandler('imagegeneration')} />
        <ToolbarButton icon={FileUp} label={isMobile ? undefined : "File"} onClick={() => openDialogHandler('file')} />
        <ToolbarButton icon={BookOpen} label={isMobile ? undefined : "Knowledge"} onClick={() => openDialogHandler('knowledge')} />
        <ToolbarButton icon={Globe} label={isMobile ? undefined : "Web URL"} onClick={() => openDialogHandler('weburl')} />
        <ToolbarButton 
          icon={Wrench} 
          label={isMobile ? undefined : "Tools"} 
          count={activeToolsCount > 0 ? activeToolsCount : undefined} 
          onClick={() => openDialogHandler('tools')} 
        />
        <ToolbarButton 
          icon={Server} 
          label={isMobile ? undefined : "MCP"} 
          count={activeServersCount > 0 ? activeServersCount : undefined} 
          onClick={() => openDialogHandler('mcp')} 
        />
        <ToolbarButton 
          icon={Bot} 
          label={isMobile ? undefined : "Agents"} 
          count={installedAgentsCount > 0 ? installedAgentsCount : undefined} 
          onClick={() => openDialogHandler('agents')} 
        />
        <ToolbarButton icon={Chrome} label={isMobile ? undefined : "Browser"} onClick={() => openDialogHandler('browser')} />
        <ToolbarButton icon={Settings} label={isMobile ? undefined : "Settings"} onClick={() => openDialogHandler('settings')} />
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
