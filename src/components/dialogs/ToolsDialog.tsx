
import React, { useState, useEffect } from 'react';
import { DialogForm } from "@/components/ui/dialog-form";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import ToolSearch from './tools/ToolSearch';
import ToolsList from './tools/ToolsList';
import { Tool } from './tools/ToolItem';
import { makeMemoryDir, saveToMemory } from '@/utils/memory';

interface ToolsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STORAGE_KEY = 'ai-chat-tools';

// Sample preset tools
const presetTools: Tool[] = [
  {
    id: '1',
    name: 'Weather Lookup',
    description: 'Look up weather for any location',
    source: 'github',
    callWord: '!weather',
    installed: false,
    active: false,
    examples: ['!weather New York', '!weather London, UK'],
    details: 'This tool allows the AI to check current weather conditions and forecasts for any location. The AI can provide temperature, conditions, and forecasts.'
  },
  {
    id: '2',
    name: 'Web Search',
    description: 'Search the web for information',
    source: 'github',
    callWord: '!search',
    installed: false,
    active: false,
    examples: ['!search latest news', '!search Python tutorials'],
    details: 'This tool enables the AI to search the web for current information not in its training data. Results are summarized and relevant links provided.'
  },
  {
    id: '3',
    name: 'Code Interpreter',
    description: 'Execute and explain code snippets',
    source: 'reddit',
    callWord: '!code',
    installed: false,
    active: false,
    examples: ['!code print("Hello World")', '!code for i in range(5): print(i)'],
    details: 'The Code Interpreter tool allows the AI to execute Python code safely and display the results. It can also explain how the code works step by step.'
  },
  {
    id: '4',
    name: 'Calculator',
    description: 'Perform complex calculations',
    source: 'github',
    callWord: '!calc',
    installed: false,
    active: false,
    examples: ['!calc 5 * (3 + 2)', '!calc sqrt(16) + 10'],
    details: 'The Calculator tool handles mathematical operations from basic arithmetic to complex equations. It supports functions like sqrt(), sin(), cos(), log(), etc.'
  },
  {
    id: '5',
    name: 'Image Analysis',
    description: 'Analyze and describe images in detail',
    source: 'github',
    callWord: '!analyze',
    installed: false,
    active: false,
    examples: ['!analyze [image]', '!analyze what\'s in this picture?'],
    details: 'This tool allows the AI to perform detailed analysis of images, identifying objects, text, people, scenes, and other elements within the image.'
  }
];

export const ToolsDialog: React.FC<ToolsDialogProps> = ({ open, onOpenChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tools, setTools] = useState<Tool[]>([]);
  const [expandedToolId, setExpandedToolId] = useState<string | null>(null);
  const [source, setSource] = useState('all');
  
  // Load installed tools from localStorage
  useEffect(() => {
    const savedTools = localStorage.getItem(STORAGE_KEY);
    if (savedTools) {
      try {
        const parsedTools = JSON.parse(savedTools);
        setTools(parsedTools);
      } catch (error) {
        console.error('Error parsing saved tools:', error);
        setTools([...presetTools]);
      }
    } else {
      setTools([...presetTools]);
    }
  }, []);

  // Save tools to localStorage and memory if enabled
  const saveTools = async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tools));
    
    try {
      // Save to memory folder if memory is enabled
      const memoryEnabled = localStorage.getItem('ai-chat-settings');
      if (memoryEnabled) {
        const settings = JSON.parse(memoryEnabled);
        if (settings.appearance.memoryEnabled) {
          await makeMemoryDir('/tools');
          await saveToMemory('/tools/installed-tools.json', JSON.stringify(tools));
        }
      }
    } catch (err) {
      console.error('Error saving tools to memory:', err);
    }
    
    toast.success('Tools settings saved');
    onOpenChange(false);
  };

  // Toggle tool expanded view
  const toggleToolExpanded = (id: string) => {
    setExpandedToolId(expandedToolId === id ? null : id);
  };

  // Toggle tool installation
  const toggleToolInstalled = (id: string) => {
    setTools(tools.map(tool => 
      tool.id === id ? { ...tool, installed: !tool.installed, active: !tool.installed ? true : tool.active } : tool
    ));
  };

  // Toggle tool active state
  const toggleToolActive = (id: string) => {
    setTools(tools.map(tool => 
      tool.id === id ? { ...tool, active: !tool.active } : tool
    ));
  };

  // Count installed tools
  const installedCount = tools.filter(tool => tool.installed).length;
  const activeCount = tools.filter(tool => tool.installed && tool.active).length;

  return (
    <DialogForm
      open={open}
      onOpenChange={onOpenChange}
      title="Tools Manager"
      description={`${installedCount} tools installed, ${activeCount} active`}
      footerActions={
        <Button onClick={saveTools}>Save Changes</Button>
      }
    >
      <div className="space-y-4">
        <ToolSearch 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          source={source}
          setSource={setSource}
        />

        <div className="max-h-[350px] overflow-y-auto pr-1 scrollable-dialog-content">
          <ToolsList 
            tools={tools}
            expandedToolId={expandedToolId}
            toggleToolExpanded={toggleToolExpanded}
            toggleToolInstalled={toggleToolInstalled}
            toggleToolActive={toggleToolActive}
            searchQuery={searchQuery}
            source={source}
          />
        </div>
      </div>
    </DialogForm>
  );
};
