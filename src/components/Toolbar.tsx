
import React, { useState } from 'react';
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
import { toast } from 'sonner';

interface ToolbarProps {
  show: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({ show }) => {
  const { createNewChat, sendMessage } = useChat();
  const [openDialog, setOpenDialog] = useState<string | null>(null);

  // Function to open a specific dialog
  const openDialogHandler = (dialogName: string) => {
    setOpenDialog(dialogName);
  };

  // Function to close the current dialog
  const closeDialogHandler = () => {
    setOpenDialog(null);
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

  // Placeholder functions for toolbar actions that don't have dialogs yet
  const handleTools = () => {
    console.log('Tools clicked');
    toast.info('Tools feature coming soon');
  };

  const handleMcpServer = () => {
    console.log('MCP server clicked');
    toast.info('MCP Server feature coming soon');
  };

  const handleAiAgents = () => {
    console.log('AI agents clicked');
    toast.info('AI Agents feature coming soon');
  };

  const handleBrowserControl = () => {
    console.log('Browser control clicked');
    toast.info('Browser Control feature coming soon');
  };

  const handleSettings = () => {
    console.log('Settings clicked');
    toast.info('Settings feature coming soon');
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
        <ToolbarButton icon={Wrench} label="Tools" onClick={handleTools} />
        <ToolbarButton icon={Server} label="MCP Server" onClick={handleMcpServer} />
        <ToolbarButton icon={Bot} label="AI Agents" onClick={handleAiAgents} />
        <ToolbarButton icon={Chrome} label="Browser Control" onClick={handleBrowserControl} />
        <ToolbarButton icon={Settings} label="Settings" onClick={handleSettings} />
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
    </>
  );
};

export default Toolbar;
