
import React, { useState, useEffect } from 'react';
import { FileText, Search } from 'lucide-react';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import { Input } from '@/components/ui/input';

interface KnowledgeBaseSelectorProps {
  onSelect: (fileName: string) => void;
  onClose: () => void;
}

const KnowledgeBaseSelector: React.FC<KnowledgeBaseSelectorProps> = ({ onSelect, onClose }) => {
  const { knowledgeFiles, isLoaded } = useKnowledgeBase();
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredFiles = searchQuery.trim()
    ? knowledgeFiles.filter(file => 
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : knowledgeFiles;

  return (
    <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-md shadow-md max-h-60 overflow-y-auto w-72 z-50">
      <div className="p-2 bg-gray-100 border-b text-xs font-medium flex justify-between items-center">
        <span>Knowledge Files (click to use)</span>
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
            placeholder="Search knowledge files..."
            className="pl-7 h-8 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {!isLoaded ? (
        <div className="p-3 text-sm text-gray-500">
          Loading knowledge files...
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="p-3 text-sm text-gray-500">
          No knowledge files available. Add files in the Knowledge Base Manager.
        </div>
      ) : (
        <div className="p-1">
          {filteredFiles.map((file, index) => (
            <button
              key={index}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center gap-2"
              onClick={() => onSelect(`@${file.name}`)}
            >
              <FileText size={14} className="text-primary" />
              <span className="text-sm truncate">{file.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default KnowledgeBaseSelector;
