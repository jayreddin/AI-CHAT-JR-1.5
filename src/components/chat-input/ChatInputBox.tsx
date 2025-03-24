
import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Square, Sparkles } from 'lucide-react';
import { useChat } from '@/context/chat/ChatProvider';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';

interface ChatInputBoxProps {
  message: string;
  setMessage: (message: string) => void;
  handleSendMessage: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleAIAssist: () => void;
  setShowKnowledgeBase: (show: boolean) => void;
  setShowToolSelector: (show: boolean) => void;
  setShowServerSelector: (show: boolean) => void;
  setCursorPosition: (position: number) => void;
}

const ChatInputBox: React.FC<ChatInputBoxProps> = ({
  message,
  setMessage,
  handleSendMessage,
  handleKeyDown,
  handleChange,
  handleAIAssist,
  setShowKnowledgeBase,
  setShowToolSelector,
  setShowServerSelector,
  setCursorPosition,
}) => {
  const { isMicActive, toggleMic, isLoggedIn, login, isStreaming, stopGeneration } = useChat();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  useEffect(() => {
    const handleSpeechTranscript = (event: Event) => {
      const customEvent = event as CustomEvent<{ transcript: string }>;
      setMessage(customEvent.detail.transcript);
    };
    
    document.addEventListener('speech-transcript', handleSpeechTranscript);
    
    return () => {
      document.removeEventListener('speech-transcript', handleSpeechTranscript);
    };
  }, [setMessage]);

  return (
    <div className="relative flex items-end bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
      <textarea
        ref={textareaRef}
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={isLoggedIn ? "Type @ for knowledge, ! for tools, $ for MCP servers..." : "Sign in to start chatting"}
        className="min-h-[56px] max-h-[200px] w-full resize-none py-3 px-4 pr-20 bg-transparent outline-none text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
        rows={1}
        disabled={!isLoggedIn || isStreaming}
      />
      
      <div className="absolute right-2 bottom-2 flex items-center gap-1">
        <button
          onClick={toggleMic}
          className={`p-2 rounded-full ${
            isMicActive
              ? 'bg-red-500 text-white animate-pulse-recording'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          } transition-colors`}
          disabled={!isLoggedIn || isStreaming}
        >
          <Mic size={isMobile ? 16 : 18} />
        </button>
        
        <button
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          disabled={!isLoggedIn || isStreaming || !message.trim()}
          title="AI Assist"
          onClick={handleAIAssist}
        >
          <Sparkles size={isMobile ? 16 : 18} />
        </button>
        
        <button
          onClick={isLoggedIn ? handleSendMessage : login}
          className={`p-2 rounded-full ${
            isLoggedIn
              ? 'bg-primary text-white hover:bg-primary/80'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          } transition-colors`}
          disabled={isLoggedIn && !message.trim() || isStreaming}
        >
          <Send size={isMobile ? 16 : 18} />
        </button>
      </div>
    </div>
  );
};

export default ChatInputBox;
