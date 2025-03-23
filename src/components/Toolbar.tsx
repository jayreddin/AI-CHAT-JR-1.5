
import React, { useState, useEffect } from 'react';
import ToolbarButton from './ToolbarButton';
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
  Settings 
} from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { HistoryDialog } from './dialogs/HistoryDialog';
import { ImageUploadDialog } from './dialogs/ImageUploadDialog';
import { FileUploadDialog } from './dialogs/FileUploadDialog';
import { KnowledgeBaseDialog } from './dialogs/KnowledgeBaseDialog';
import { WebUrlDialog } from './dialogs/WebUrlDialog';
import { ToolsDialog } from './dialogs/ToolsDialog';
import { MCPServerDialog } from './dialogs/MCPServerDialog';
import { AIAgentsDialog } from './dialogs/AIAgentsDialog';
import { BrowserControlDialog } from './dialogs/BrowserControlDialog';
import { SettingsDialog } from './dialogs/SettingsDialog';
import { toast } from 'sonner';

interface ToolbarProps {
  show: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({ show }) => {
  const { createNewChat, sendMessage } = useChat();
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  
  // Get counts of active tools, servers, and agents
  const [activeToolsCount, setActiveToolsCount] = useState(0);
  const [activeServersCount, setActiveServersCount] = useState(0);
  const [installedAgentsCount, setInstalledAgentsCount] = useState(0);
  
  // Load counts from localStorage
  useEffect(() => {
    const loadStoredCounts = () => {
      try {
        // Load tools count
        const storedTools = localStorage.getItem('ai-chat-tools');
        if (storedTools) {
          const tools = JSON.parse(storedTools);
          const activeCount = tools.filter((tool: any) => tool.installed && tool.active).length;
          setActiveToolsCount(activeCount);
        }
        
        // Load MCP servers count
        const storedServers = localStorage.getItem('ai-chat-mcp-servers');
        if (storedServers) {
          const servers = JSON.parse(storedServers);
          const activeCount = servers.filter((server: any) => server.installed && server.active).length;
          setActiveServersCount(activeCount);
        }
        
        // Load AI agents count
        const storedAgents = localStorage.getItem('ai-chat-agents');
        if (storedAgents) {
          const agents = JSON.parse(storedAgents);
          const installedCount = agents.filter((agent: any) => agent.installed).length;
          setInstalledAgentsCount(installedCount);
        }
      } catch (error) {
        console.error('Error loading stored counts:', error);
      }
    };
    
    loadStoredCounts();
    
    // Listen for storage changes to update counts
    window.addEventListener('storage', loadStoredCounts);
    
    return () => {
      window.removeEventListener('storage', loadStoredCounts);
    };
  }, []);

  // Function to open a specific dialog
  const openDialogHandler = (dialogName: string) => {
    setOpenDialog(dialogName);
  };

  // Function to close the current dialog
  const closeDialogHandler = () => {
    setOpenDialog(null);
    
    // Refresh counts after dialog closes
    try {
      // Update tools count
      const storedTools = localStorage.getItem('ai-chat-tools');
      if (storedTools) {
        const tools = JSON.parse(storedTools);
        const activeCount = tools.filter((tool: any) => tool.installed && tool.active).length;
        setActiveToolsCount(activeCount);
      }
      
      // Update MCP servers count
      const storedServers = localStorage.getItem('ai-chat-mcp-servers');
      if (storedServers) {
        const servers = JSON.parse(storedServers);
        const activeCount = servers.filter((server: any) => server.installed && server.active).length;
        setActiveServersCount(activeCount);
      }
      
      // Update AI agents count
      const storedAgents = localStorage.getItem('ai-chat-agents');
      if (storedAgents) {
        const agents = JSON.parse(storedAgents);
        const installedCount = agents.filter((agent: any) => agent.installed).length;
        setInstalledAgentsCount(installedCount);
      }
    } catch (error) {
      console.error('Error updating stored counts:', error);
    }
  };

  // Handle image upload
  const handleImageUpload = (imageData: string, isBase64: boolean) => {
    console.log('Image uploaded:', isBase64 ? 'Base64 format' : 'URL format');
    toast.success('Image added to context');
    // In a real implementation, we would store this image and attach it to the next message
  };

  // Handle file upload
  const handleFileUpload = (fileData: string, fileName: string) => {
    console.log('File uploaded:', fileName);
    toast.success('File added to context');
    // In a real implementation, we would store this file and attach it to the next message
  };

  // Handle web URL content
  const handleAddWebContent = (content: string) => {
    console.log('Web content added:', content);
    toast.success('Web content added to chat');
    // In a real implementation, we would process the web content accordingly
  };

  return (
    <>
      <div 
        className={`glass-morphism py-2 px-4 rounded-full flex items-center justify-center gap-3 max-w-fit mx-auto transition-all duration-300 ${
          show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <ToolbarButton icon={Plus} label="New Chat" onClick={createNewChat} />
        <ToolbarButton icon={Clock} label="Chat History" onClick={() => openDialogHandler('history')} />
        <ToolbarButton icon={Image} label="Image Upload" onClick={() => openDialogHandler('image')} />
        <ToolbarButton icon={FileUp} label="File Upload" onClick={() => openDialogHandler('file')} />
        <ToolbarButton icon={BookOpen} label="Knowledge Base" onClick={() => openDialogHandler('knowledge')} />
        <ToolbarButton icon={Globe} label="Web URL" onClick={() => openDialogHandler('weburl')} />
        <ToolbarButton 
          icon={Wrench} 
          label={activeToolsCount > 0 ? `Tools (${activeToolsCount})` : "Tools"} 
          onClick={() => openDialogHandler('tools')} 
        />
        <ToolbarButton 
          icon={Server} 
          label={activeServersCount > 0 ? `MCP (${activeServersCount})` : "MCP Server"} 
          onClick={() => openDialogHandler('mcp')} 
        />
        <ToolbarButton 
          icon={Bot} 
          label={installedAgentsCount > 0 ? `Agents (${installedAgentsCount})` : "AI Agents"} 
          onClick={() => openDialogHandler('agents')} 
        />
        <ToolbarButton icon={Chrome} label="Browser Control" onClick={() => openDialogHandler('browser')} />
        <ToolbarButton icon={Settings} label="Settings" onClick={() => openDialogHandler('settings')} />
      </div>

      {/* Dialogs */}
      <HistoryDialog 
        open={openDialog === 'history'} 
        onOpenChange={(open) => open ? openDialogHandler('history') : closeDialogHandler()} 
      />
      
      <ImageUploadDialog 
        open={openDialog === 'image'} 
        onOpenChange={(open) => open ? openDialogHandler('image') : closeDialogHandler()} 
        onSubmit={handleImageUpload}
      />
      
      <FileUploadDialog 
        open={openDialog === 'file'} 
        onOpenChange={(open) => open ? openDialogHandler('file') : closeDialogHandler()} 
        onSubmit={handleFileUpload}
      />
      
      <KnowledgeBaseDialog 
        open={openDialog === 'knowledge'} 
        onOpenChange={(open) => open ? openDialogHandler('knowledge') : closeDialogHandler()} 
      />
      
      <WebUrlDialog 
        open={openDialog === 'weburl'} 
        onOpenChange={(open) => open ? openDialogHandler('weburl') : closeDialogHandler()} 
        onAddToChat={handleAddWebContent}
      />

      <ToolsDialog
        open={openDialog === 'tools'}
        onOpenChange={(open) => open ? openDialogHandler('tools') : closeDialogHandler()}
      />

      <MCPServerDialog
        open={openDialog === 'mcp'}
        onOpenChange={(open) => open ? openDialogHandler('mcp') : closeDialogHandler()}
      />

      <AIAgentsDialog
        open={openDialog === 'agents'}
        onOpenChange={(open) => open ? openDialogHandler('agents') : closeDialogHandler()}
      />

      <BrowserControlDialog
        open={openDialog === 'browser'}
        onOpenChange={(open) => open ? openDialogHandler('browser') : closeDialogHandler()}
      />

      <SettingsDialog
        open={openDialog === 'settings'}
        onOpenChange={(open) => open ? openDialogHandler('settings') : closeDialogHandler()}
      />
    </>
  );
};

export default Toolbar;
