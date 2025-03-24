
import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Square, Sparkles } from 'lucide-react';
import { useChat } from '@/context/chat/ChatProvider';
import { Attachment } from '@/hooks/useAttachments';
import { useIsMobile } from '@/hooks/use-mobile';
import AttachmentThumbnails from './AttachmentThumbnails';
import AttachmentButtons from './AttachmentButtons';
import KnowledgeBaseSelector from './KnowledgeBaseSelector';
import ActiveKnowledgeFiles from './ActiveKnowledgeFiles';
import ToolSelector from './ToolSelector';
import ServerSelector from './ServerSelector';
import { toast } from 'sonner';

interface ChatInputProps {
  attachments?: Attachment[];
  onAddAttachment?: (attachment: Omit<Attachment, 'id'>) => string;
  onClearAttachments?: () => void;
  onRemoveAttachment?: (id: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  attachments = [], 
  onAddAttachment,
  onClearAttachments,
  onRemoveAttachment
}) => {
  const { sendMessage, isMicActive, toggleMic, isLoggedIn, login, isStreaming, stopGeneration } = useChat();
  const [message, setMessage] = useState('');
  const [showKnowledgeBase, setShowKnowledgeBase] = useState(false);
  const [showToolSelector, setShowToolSelector] = useState(false);
  const [showServerSelector, setShowServerSelector] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [activeKnowledgeFiles, setActiveKnowledgeFiles] = useState<string[]>([]);
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
  }, []);

  const handleSendMessage = () => {
    if (!message.trim() && attachments.length === 0) return;
    
    console.log('Sending message with attachments:', attachments);
    console.log('Active knowledge files:', activeKnowledgeFiles);
    
    sendMessage(message);
    setMessage('');
    setActiveKnowledgeFiles([]);
    
    if (onClearAttachments) {
      onClearAttachments();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else if (e.key === '@') {
      setShowKnowledgeBase(true);
      setCursorPosition(e.currentTarget.selectionStart + 1);
    } else if (e.key === '!') {
      setShowToolSelector(true);
      setCursorPosition(e.currentTarget.selectionStart + 1);
    } else if (e.key === '$') {
      setShowServerSelector(true);
      setCursorPosition(e.currentTarget.selectionStart + 1);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = e.target.value;
    setMessage(newMessage);
    
    if (newMessage.includes('@') && !showKnowledgeBase) {
      setShowKnowledgeBase(true);
      setCursorPosition(e.target.selectionStart);
    } else if (!newMessage.includes('@')) {
      setShowKnowledgeBase(false);
    }
    
    if (newMessage.includes('!') && !showToolSelector) {
      setShowToolSelector(true);
      setCursorPosition(e.target.selectionStart);
    } else if (!newMessage.includes('!')) {
      setShowToolSelector(false);
    }
    
    if (newMessage.includes('$') && !showServerSelector) {
      setShowServerSelector(true);
      setCursorPosition(e.target.selectionStart);
    } else if (!newMessage.includes('$')) {
      setShowServerSelector(false);
    }
  };

  const addKnowledgeFile = (fileName: string) => {
    if (!activeKnowledgeFiles.includes(fileName)) {
      setActiveKnowledgeFiles([...activeKnowledgeFiles, fileName]);
    }
    setShowKnowledgeBase(false);
  };

  const handleAIAssist = () => {
    if (!message.trim()) return;
    
    // Get AI suggestions for the current message
    try {
      toast.info("Generating suggestions...");
      // Here we would normally call an API to get suggestions
      // For now, we'll simulate it by appending text to the message
      
      const suggestions = [
        "Would you like more details on this topic?",
        "Can I help clarify anything specific?",
        "Is there a particular aspect you're interested in?"
      ];
      
      const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
      setMessage(prev => `${prev}\n\n${randomSuggestion}`);
    } catch (error) {
      toast.error("Failed to generate suggestions");
      console.error("AI Assist error:", error);
    }
  };

  return (
    <div className="relative">
      {isStreaming && (
        <button
          onClick={stopGeneration}
          className="absolute top-0 -mt-12 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 shadow-sm flex items-center gap-1 px-3 py-1 rounded-full text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Square size={14} className="text-red-500" />
          <span>Stop generating</span>
        </button>
      )}

      {activeKnowledgeFiles.length > 0 && (
        <ActiveKnowledgeFiles 
          files={activeKnowledgeFiles}
          onRemove={(file) => setActiveKnowledgeFiles(activeKnowledgeFiles.filter(f => f !== file))}
        />
      )}
      
      {attachments.length > 0 && (
        <AttachmentThumbnails 
          attachments={attachments} 
          onRemove={id => onRemoveAttachment?.(id)}
          onPreview={() => {}}
        />
      )}

      <div className="relative flex items-end bg-white border border-gray-200 rounded-lg shadow-sm">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={isLoggedIn ? "Type @ for knowledge, ! for tools, $ for MCP servers..." : "Sign in to start chatting"}
          className="min-h-[56px] max-h-[200px] w-full resize-none py-3 px-4 pr-20 bg-transparent outline-none text-gray-800 placeholder:text-gray-400"
          rows={1}
          disabled={!isLoggedIn || isStreaming}
        />
        
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
        
        <div className="absolute right-2 bottom-2 flex items-center gap-1">
          {onAddAttachment && (
            <AttachmentButtons 
              onAddAttachment={onAddAttachment} 
              disabled={!isLoggedIn || isStreaming}
            />
          )}
          
          <button
            onClick={toggleMic}
            className={`p-2 rounded-full ${
              isMicActive
                ? 'bg-red-500 text-white animate-pulse-recording'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } transition-colors`}
            disabled={!isLoggedIn || isStreaming}
          >
            <Mic size={isMobile ? 16 : 18} />
          </button>
          
          <button
            className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
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
            disabled={isLoggedIn && (!message.trim() && attachments.length === 0) || isStreaming}
          >
            <Send size={isMobile ? 16 : 18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
