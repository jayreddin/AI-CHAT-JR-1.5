
import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Square, Paperclip, Image, FileUp } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { Attachment } from '@/hooks/useAttachments';
import { useIsMobile } from '@/hooks/use-mobile';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface ChatInputProps {
  attachments?: Attachment[];
  onAddAttachment?: (attachment: Omit<Attachment, 'id'>) => string;
  onClearAttachments?: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  attachments = [], 
  onAddAttachment,
  onClearAttachments
}) => {
  const { sendMessage, isMicActive, toggleMic, isLoggedIn, login, isStreaming, stopGeneration } = useChat();
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSendMessage = () => {
    if (!message.trim() && attachments.length === 0) return;
    
    // In a real implementation, you would include the attachments with the message
    console.log('Sending message with attachments:', attachments);
    
    sendMessage(message);
    setMessage('');
    
    // Clear attachments after sending
    if (onClearAttachments) {
      onClearAttachments();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleAddAttachment = () => {
    if (onAddAttachment) {
      onAddAttachment({
        type: 'image',
        content: 'https://picsum.photos/200',
        name: 'example.jpg',
        size: 1024 * 10,
        isBase64: false
      });
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
                    onClick={handleAddAttachment}
                  >
                    <Image size={16} />
                    <span>Add Image</span>
                  </button>
                  <button 
                    className="flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-md transition-colors"
                    onClick={handleAddAttachment}
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
