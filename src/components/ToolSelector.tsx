
import React, { useState, useEffect, useRef } from 'react';
import { Wrench, Search } from 'lucide-react';
import { loadFromStorage } from '@/utils/storage';
import { Input } from '@/components/ui/input';

interface ToolSelectorProps {
  onSelect: (toolName: string) => void;
  onClose: () => void;
}

const ToolSelector: React.FC<ToolSelectorProps> = ({ onSelect, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tools, setTools] = useState<{ 
    name: string; 
    description: string; 
    callWord: string; 
    active: boolean;
    examples?: string[];
  }[]>([]);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    // Focus search input when component mounts
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
    
    // Load tools from localStorage
    const savedTools = loadFromStorage('ai-chat-tools', []);
    // Filter only active tools
    const activeTools = savedTools.filter((tool: any) => tool.active);
    
    if (activeTools.length === 0) {
      // If no tools are found, use some sample tools
      setTools([
        { 
          name: 'Web Search', 
          description: 'Search the web for information', 
          callWord: '!search', 
          active: true,
          examples: ['!search latest news', '!search Python tutorial']
        },
        { 
          name: 'Calculator', 
          description: 'Perform calculations', 
          callWord: '!calc', 
          active: true,
          examples: ['!calc 5 * (3 + 2)', '!calc sqrt(16) + 10'] 
        },
        { 
          name: 'Weather', 
          description: 'Check weather for a location', 
          callWord: '!weather', 
          active: true,
          examples: ['!weather New York', '!weather London, UK']
        },
        { 
          name: 'Code Interpreter', 
          description: 'Execute and explain code snippets', 
          callWord: '!code', 
          active: true,
          examples: ['!code print("Hello World")', '!code function fibonacci(n) {...}']
        },
      ]);
    } else {
      setTools(activeTools);
    }
  }, []);
  
  const filteredTools = searchQuery
    ? tools.filter(tool => 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.callWord.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : tools;

  const handleToolSelect = (tool: string) => {
    // Remove the ! prefix for function calling
    const cleanToolName = tool.startsWith('!') ? tool : `!${tool}`;
    onSelect(cleanToolName);
  };

  return (
    <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md max-h-60 overflow-y-auto w-72 z-50">
      <div className="p-2 bg-gray-100 dark:bg-gray-700 border-b dark:border-gray-600 text-xs font-medium flex justify-between items-center">
        <span className="text-gray-700 dark:text-gray-200">Available Tools (click to use)</span>
        <button 
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          onClick={onClose}
        >
          ×
        </button>
      </div>
      
      <div className="p-2 border-b dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-3 w-3 text-gray-400 dark:text-gray-500" />
          <Input
            ref={searchInputRef}
            placeholder="Search tools..."
            className="pl-7 h-8 text-sm bg-white dark:bg-gray-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {filteredTools.length === 0 ? (
        <div className="p-3 text-sm text-gray-500 dark:text-gray-400">
          No tools available. Add tools in the Tools Manager.
        </div>
      ) : (
        <div className="p-1">
          {filteredTools.map((tool, index) => (
            <button
              key={index}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center gap-2"
              onClick={() => handleToolSelect(tool.callWord)}
            >
              <div className="p-1 bg-primary/10 rounded">
                <Wrench size={14} className="text-primary" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{tool.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{tool.callWord}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ToolSelector;
