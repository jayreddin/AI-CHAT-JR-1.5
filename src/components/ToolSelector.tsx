
import React, { useState, useEffect } from 'react';
import { Wrench, Search } from 'lucide-react';
import { loadFromStorage } from '@/utils/storage';
import { Input } from '@/components/ui/input';

interface ToolSelectorProps {
  onSelect: (toolName: string) => void;
  onClose: () => void;
}

const ToolSelector: React.FC<ToolSelectorProps> = ({ onSelect, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tools, setTools] = useState<{ name: string; description: string; callWord: string; active: boolean }[]>([]);
  
  useEffect(() => {
    // Load tools from localStorage
    const savedTools = loadFromStorage('ai-chat-tools', []);
    // Filter only active tools
    const activeTools = savedTools.filter((tool: any) => tool.active);
    
    if (activeTools.length === 0) {
      // If no tools are found, use some sample tools
      setTools([
        { name: 'Web Search', description: 'Search the web', callWord: '!search', active: true },
        { name: 'Calculator', description: 'Perform calculations', callWord: '!calc', active: true },
        { name: 'Weather', description: 'Check weather', callWord: '!weather', active: true },
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

  return (
    <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-md shadow-md max-h-60 overflow-y-auto w-72 z-50">
      <div className="p-2 bg-gray-100 border-b text-xs font-medium flex justify-between items-center">
        <span>Available Tools (click to use)</span>
        <button 
          className="text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ×
        </button>
      </div>
      
      <div className="p-2 border-b">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-3 w-3 text-gray-400" />
          <Input
            placeholder="Search tools..."
            className="pl-7 h-8 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {filteredTools.length === 0 ? (
        <div className="p-3 text-sm text-gray-500">
          No tools available. Add tools in the Tools Manager.
        </div>
      ) : (
        <div className="p-1">
          {filteredTools.map((tool, index) => (
            <button
              key={index}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center gap-2"
              onClick={() => onSelect(tool.callWord)}
            >
              <div className="p-1 bg-primary/10 rounded">
                <Wrench size={14} className="text-primary" />
              </div>
              <div>
                <div className="text-sm font-medium">{tool.name}</div>
                <div className="text-xs text-gray-500">{tool.callWord}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ToolSelector;
