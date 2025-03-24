
import React from 'react';
import KnowledgeBaseSelector from '@/components/KnowledgeBaseSelector';
import ToolSelector from '@/components/ToolSelector';
import ServerSelector from '@/components/ServerSelector';

interface InputSelectorsProps {
  showKnowledgeBase: boolean;
  showToolSelector: boolean;
  showServerSelector: boolean;
  addKnowledgeFile: (fileName: string) => void;
  setShowKnowledgeBase: (show: boolean) => void;
  setShowToolSelector: (show: boolean) => void;
  setShowServerSelector: (show: boolean) => void;
  setMessage: (message: string) => void;
}

const InputSelectors: React.FC<InputSelectorsProps> = ({
  showKnowledgeBase,
  showToolSelector,
  showServerSelector,
  addKnowledgeFile,
  setShowKnowledgeBase,
  setShowToolSelector,
  setShowServerSelector,
  setMessage
}) => {
  return (
    <>
      {showKnowledgeBase && (
        <KnowledgeBaseSelector 
          onSelect={addKnowledgeFile}
          onClose={() => setShowKnowledgeBase(false)}
        />
      )}
      
      {showToolSelector && (
        <ToolSelector 
          onSelect={(tool) => {
            setMessage((prev) => prev + tool + ' ');
            setShowToolSelector(false);
          }}
          onClose={() => setShowToolSelector(false)}
        />
      )}
      
      {showServerSelector && (
        <ServerSelector 
          onSelect={(server) => {
            setMessage((prev) => prev + server + ' ');
            setShowServerSelector(false);
          }}
          onClose={() => setShowServerSelector(false)}
        />
      )}
    </>
  );
};

export default InputSelectors;
