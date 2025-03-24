
import React from 'react';
import { Square } from 'lucide-react';
import { useChat } from '@/context/chat/ChatProvider';

const StopGenerationButton: React.FC = () => {
  const { isStreaming, stopGeneration } = useChat();

  if (!isStreaming) return null;

  return (
    <button
      onClick={stopGeneration}
      className="absolute top-0 -mt-12 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      aria-label="Stop generating"
    >
      <Square size={14} className="text-red-500" />
      <span>Stop generating</span>
    </button>
  );
};

export default StopGenerationButton;
