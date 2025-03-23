
import React from 'react';
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

interface ToolbarProps {
  show: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({ show }) => {
  const { createNewChat } = useChat();

  // Placeholder functions for toolbar actions
  const handleHistoryClick = () => {
    console.log('History clicked');
  };

  const handleImageUpload = () => {
    console.log('Image upload clicked');
  };

  const handleFileUpload = () => {
    console.log('File upload clicked');
  };

  const handleKnowledgeBase = () => {
    console.log('Knowledge base clicked');
  };

  const handleWebUrl = () => {
    console.log('Web URL clicked');
  };

  const handleTools = () => {
    console.log('Tools clicked');
  };

  const handleMcpServer = () => {
    console.log('MCP server clicked');
  };

  const handleAiAgents = () => {
    console.log('AI agents clicked');
  };

  const handleBrowserControl = () => {
    console.log('Browser control clicked');
  };

  const handleSettings = () => {
    console.log('Settings clicked');
  };

  return (
    <div 
      className={`glass-morphism py-2 px-4 rounded-full flex items-center justify-center gap-3 max-w-fit mx-auto transition-all duration-300 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <ToolbarButton icon={Plus} label="New Chat" onClick={createNewChat} />
      <ToolbarButton icon={Clock} label="Chat History" onClick={handleHistoryClick} />
      <ToolbarButton icon={Image} label="Image Upload" onClick={handleImageUpload} />
      <ToolbarButton icon={FileUp} label="File Upload" onClick={handleFileUpload} />
      <ToolbarButton icon={BookOpen} label="Knowledge Base" onClick={handleKnowledgeBase} />
      <ToolbarButton icon={Globe} label="Web URL" onClick={handleWebUrl} />
      <ToolbarButton icon={Wrench} label="Tools" onClick={handleTools} />
      <ToolbarButton icon={Server} label="MCP Server" onClick={handleMcpServer} />
      <ToolbarButton icon={Bot} label="AI Agents" onClick={handleAiAgents} />
      <ToolbarButton icon={Chrome} label="Browser Control" onClick={handleBrowserControl} />
      <ToolbarButton icon={Settings} label="Settings" onClick={handleSettings} />
    </div>
  );
};

export default Toolbar;
