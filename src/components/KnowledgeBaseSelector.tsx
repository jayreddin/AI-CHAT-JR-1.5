
import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Button } from '@/components/ui/button';

interface KnowledgeBaseSelectorProps {
  onSelect: (fileName: string) => void;
  onClose: () => void;
}

const KnowledgeBaseSelector: React.FC<KnowledgeBaseSelectorProps> = ({ onSelect, onClose }) => {
  const { knowledgeFiles } = useKnowledgeBase();
  const [loaded, setLoaded] = useState(false);

  // Force a re-render to ensure knowledgeFiles are loaded
  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-md shadow-md max-h-40 overflow-y-auto w-64 z-50">
      <div className="p-2 bg-gray-100 border-b text-xs font-medium flex justify-between items-center">
        <span>Knowledge base files (click to add)</span>
        <button 
          className="text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ×
        </button>
      </div>
      {knowledgeFiles.length === 0 ? (
        <div className="p-3 text-sm text-gray-500">
          No knowledge files available
        </div>
      ) : (
        knowledgeFiles.map((file, index) => (
          <button
            key={index}
            className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2"
            onClick={() => onSelect(file.name)}
          >
            <FileText size={14} />
            <span className="text-sm truncate">{file.name}</span>
          </button>
        ))
      )}
    </div>
  );
};

export default KnowledgeBaseSelector;
