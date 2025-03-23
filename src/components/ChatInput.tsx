
import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Square, Paperclip, Image, FileUp, FileText } from 'lucide-react';
import { useChat } from '@/context/chat/ChatProvider';
import { Attachment } from '@/hooks/useAttachments';
import { useIsMobile } from '@/hooks/use-mobile';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useKnowledgeBase, KnowledgeFile } from '@/hooks/useKnowledgeBase';
import AttachmentThumbnails from './AttachmentThumbnails';

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
  const [cursorPosition, setCursorPosition] = useState(0);
  const [activeKnowledgeFiles, setActiveKnowledgeFiles] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();
  const { knowledgeFiles } = useKnowledgeBase();

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  // Listen to speech recognition events
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
    
    // In a real implementation, you would include the attachments with the message
    console.log('Sending message with attachments:', attachments);
    console.log('Active knowledge files:', activeKnowledgeFiles);
    
    sendMessage(message);
    setMessage('');
    setActiveKnowledgeFiles([]);
    
    // Clear attachments after sending
    if (onClearAttachments) {
      onClearAttachments();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else if (e.key === '!') {
      setShowKnowledgeBase(true);
      setCursorPosition(e.currentTarget.selectionStart);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = e.target.value;
    setMessage(newMessage);
    
    // Check for "!" trigger
    if (newMessage.includes('!') && !showKnowledgeBase) {
      setShowKnowledgeBase(true);
      setCursorPosition(e.target.selectionStart);
    } else if (!newMessage.includes('!')) {
      setShowKnowledgeBase(false);
    }
  };

  const handleAddAttachment = (type: 'image' | 'file') => {
    if (onAddAttachment) {
      if (type === 'image') {
        onAddAttachment({
          type: 'image',
          content: 'https://picsum.photos/200',
          name: 'example.jpg',
          size: 1024 * 10,
          isBase64: false
        });
      } else {
        onAddAttachment({
          type: 'file',
          content: 'Example file content',
          name: 'example.txt',
          size: 1024 * 2,
          isBase64: false
        });
      }
    }
  };

  const addKnowledgeFile = (fileName: string) => {
    if (!activeKnowledgeFiles.includes(fileName)) {
      setActiveKnowledgeFiles([...activeKnowledgeFiles, fileName]);
    }
    setShowKnowledgeBase(false);
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

      {/* Display active knowledge base files */}
      {activeKnowledgeFiles.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {activeKnowledgeFiles.map((file, index) => (
            <div key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
              <FileText size={12} className="mr-1" />
              <span>{file}</span>
              <button 
                className="ml-1 text-blue-500 hover:text-blue-700"
                onClick={() => setActiveKnowledgeFiles(activeKnowledgeFiles.filter(f => f !== file))}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Display attachment thumbnails */}
      {attachments.length > 0 && (
        <AttachmentThumbnails 
          attachments={attachments} 
          onRemove={id => onRemoveAttachment?.(id)}
          onPreview={() => {}} // Preview is handled within the component
        />
      )}

      <div className="relative flex items-end bg-white border border-gray-200 rounded-lg shadow-sm">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={isLoggedIn ? "Type a message..." : "Sign in to start chatting"}
          className="min-h-[56px] max-h-[200px] w-full resize-none py-3 px-4 pr-20 bg-transparent outline-none text-gray-800 placeholder:text-gray-400"
          rows={1}
          disabled={!isLoggedIn || isStreaming}
        />
        
        {showKnowledgeBase && knowledgeFiles.length > 0 && (
          <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-md shadow-md max-h-40 overflow-y-auto w-64 z-50">
            <div className="p-2 bg-gray-100 border-b text-xs font-medium">
              Knowledge base files (click to add)
            </div>
            {knowledgeFiles.map((file, index) => (
              <button
                key={index}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2"
                onClick={() => addKnowledgeFile(file.name)}
              >
                <FileText size={14} />
                <span className="text-sm truncate">{file.name}</span>
              </button>
            ))}
          </div>
        )}
        
        <div className="absolute right-2 bottom-2 flex items-center gap-1">
          {onAddAttachment && (
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  title="Add attachment"
                  disabled={!isLoggedIn || isStreaming}
                >
                  <Paperclip size={isMobile ? 16 : 18} />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto" align="end">
                <div className="grid gap-1">
                  <button 
                    className="flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-md transition-colors"
                    onClick={() => handleAddAttachment('image')}
                  >
                    <Image size={16} />
                    <span>Add Image</span>
                  </button>
                  <button 
                    className="flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-md transition-colors"
                    onClick={() => handleAddAttachment('file')}
                  >
                    <FileUp size={16} />
                    <span>Add File</span>
                  </button>
                </div>
              </PopoverContent>
            </Popover>
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
}

export default ChatInput;
