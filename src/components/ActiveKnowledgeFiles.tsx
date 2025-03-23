
import React from 'react';
import { FileText } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';

interface ActiveKnowledgeFilesProps {
  files: string[];
  onRemove: (file: string) => void;
}

const ActiveKnowledgeFiles: React.FC<ActiveKnowledgeFilesProps> = ({ files, onRemove }) => {
  return (
    <div className="mb-2 flex flex-wrap gap-1">
      {files.map((file, index) => (
        <div key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
          <FileText size={12} className="mr-1" />
          <span>{file}</span>
          <button 
            className="ml-1 text-blue-500 hover:text-blue-700"
            onClick={() => onRemove(file)}
            aria-label="Remove knowledge file"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default ActiveKnowledgeFiles;
