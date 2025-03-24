
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
  setMessage: (message: string | ((prev: string) => string)) => void;
  message: string;
  cursorPosition: number;
}

const InputSelectors: React.FC<InputSelectorsProps> = ({
  showKnowledgeBase,
  showToolSelector,
  showServerSelector,
  addKnowledgeFile,
  setShowKnowledgeBase,
  setShowToolSelector,
  setShowServerSelector,
  setMessage,
  message,
  cursorPosition
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
            // Replace the ! character with the selected tool
            const beforeTrigger = message.substring(0, message.lastIndexOf('!'));
            const afterTrigger = message.substring(message.lastIndexOf('!') + 1);
            setMessage(beforeTrigger + tool + ' ' + afterTrigger);
            setShowToolSelector(false);
          }}
          onClose={() => setShowToolSelector(false)}
        />
      )}
      
      {showServerSelector && (
        <ServerSelector 
          onSelect={(server) => {
            // Replace the $ character with the selected server
            const beforeTrigger = message.substring(0, message.lastIndexOf('$'));
            const afterTrigger = message.substring(message.lastIndexOf('$') + 1);
            setMessage(beforeTrigger + server + ' ' + afterTrigger);
            setShowServerSelector(false);
          }}
          onClose={() => setShowServerSelector(false)}
        />
      )}
    </>
  );
};

export default InputSelectors;
