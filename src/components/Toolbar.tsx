
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
import { useChat } from '@/context/chat/ChatProvider';
import { useToolbarDialogs } from './toolbar/useToolbarDialogs';
import { useToolbarCounts } from './toolbar/useToolbarCounts';
import ToolbarButton from './toolbar/ToolbarButton';
import ToolbarDialogs from './toolbar/ToolbarDialogs';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ToolbarProps {
  show: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({ show }) => {
  const { createNewChat } = useChat();
  const { openDialog, openDialogHandler, closeDialogHandler } = useToolbarDialogs();
  const { activeToolsCount, activeServersCount, installedAgentsCount, activeTools, activeServers, installedAgents, refreshCounts } = useToolbarCounts();
  const isMobile = useIsMobile();

  return (
    <>
      <div 
        className={`glass-morphism py-2 px-3 rounded-full flex items-center justify-center toolbar-icons ${
          isMobile ? 'gap-1 md:gap-2' : 'gap-2 md:gap-3'
        } overflow-x-auto max-w-full mx-auto transition-all duration-300 ${
          show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <ToolbarButton icon={Plus} label={isMobile ? undefined : "New Chat"} onClick={createNewChat} />
              </div>
            </TooltipTrigger>
            <TooltipContent>New Chat</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <ToolbarButton icon={Clock} label={isMobile ? undefined : "History"} onClick={() => openDialogHandler('history')} />
              </div>
            </TooltipTrigger>
            <TooltipContent>History</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <ToolbarButton icon={Image} label={isMobile ? undefined : "Image"} onClick={() => openDialogHandler('image')} />
              </div>
            </TooltipTrigger>
            <TooltipContent>Upload Image</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <ToolbarButton icon={ImagePlus} label={isMobile ? undefined : "Generate"} onClick={() => openDialogHandler('imagegeneration')} />
              </div>
            </TooltipTrigger>
            <TooltipContent>Generate Image</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <ToolbarButton icon={FileUp} label={isMobile ? undefined : "File"} onClick={() => openDialogHandler('file')} />
              </div>
            </TooltipTrigger>
            <TooltipContent>Upload File</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <ToolbarButton icon={BookOpen} label={isMobile ? undefined : "Knowledge"} onClick={() => openDialogHandler('knowledge')} />
              </div>
            </TooltipTrigger>
            <TooltipContent>Knowledge Base</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <ToolbarButton icon={Globe} label={isMobile ? undefined : "Web URL"} onClick={() => openDialogHandler('weburl')} />
              </div>
            </TooltipTrigger>
            <TooltipContent>Web URL</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <ToolbarButton 
                  icon={Wrench} 
                  label={isMobile ? undefined : "Tools"} 
                  count={activeToolsCount > 0 ? activeToolsCount : undefined} 
                  onClick={() => openDialogHandler('tools')} 
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {activeToolsCount > 0 ? (
                <div>
                  <div className="font-semibold">Active Tools ({activeToolsCount})</div>
                  <ul className="text-xs mt-1">
                    {activeTools.map((tool, index) => (
                      <li key={index}>{tool}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                "Tools"
              )}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <ToolbarButton 
                  icon={Server} 
                  label={isMobile ? undefined : "MCP"} 
                  count={activeServersCount > 0 ? activeServersCount : undefined} 
                  onClick={() => openDialogHandler('mcp')} 
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {activeServersCount > 0 ? (
                <div>
                  <div className="font-semibold">Active Servers ({activeServersCount})</div>
                  <ul className="text-xs mt-1">
                    {activeServers.map((server, index) => (
                      <li key={index}>{server}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                "MCP Servers"
              )}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <ToolbarButton 
                  icon={Bot} 
                  label={isMobile ? undefined : "Agents"} 
                  count={installedAgentsCount > 0 ? installedAgentsCount : undefined} 
                  onClick={() => openDialogHandler('agents')} 
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {installedAgentsCount > 0 ? (
                <div>
                  <div className="font-semibold">Installed Agents ({installedAgentsCount})</div>
                  <ul className="text-xs mt-1">
                    {installedAgents.map((agent, index) => (
                      <li key={index}>{agent}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                "AI Agents"
              )}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <ToolbarButton icon={Chrome} label={isMobile ? undefined : "Browser"} onClick={() => openDialogHandler('browser')} />
              </div>
            </TooltipTrigger>
            <TooltipContent>Browser Control</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <ToolbarButton icon={Settings} label={isMobile ? undefined : "Settings"} onClick={() => openDialogHandler('settings')} />
              </div>
            </TooltipTrigger>
            <TooltipContent>Settings</TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
