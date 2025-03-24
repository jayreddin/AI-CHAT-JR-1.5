
import React, { useState } from 'react';
import { useChat } from '@/context/chat/ChatProvider';
import { Attachment } from '@/hooks/useAttachments';
import ChatInputBox from './chat-input/ChatInputBox';
import InputSelectors from './chat-input/InputSelectors';
import StopGenerationButton from './chat-input/StopGenerationButton';
import AttachmentArea from './chat-input/AttachmentArea';
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
  const { sendMessage, isLoggedIn, isStreaming } = useChat();
  const [message, setMessage] = useState('');
  const [showKnowledgeBase, setShowKnowledgeBase] = useState(false);
  const [showToolSelector, setShowToolSelector] = useState(false);
  const [showServerSelector, setShowServerSelector] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [activeKnowledgeFiles, setActiveKnowledgeFiles] = useState<string[]>([]);

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
    
    try {
      toast.info("Generating suggestions...");
      
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
      <StopGenerationButton />

      <AttachmentArea 
        attachments={attachments}
        activeKnowledgeFiles={activeKnowledgeFiles}
        onRemoveAttachment={(id) => onRemoveAttachment?.(id)}
        onAddAttachment={(attachment) => onAddAttachment?.(attachment) || ''}
        onRemoveKnowledgeFile={(file) => setActiveKnowledgeFiles(activeKnowledgeFiles.filter(f => f !== file))}
        isLoggedIn={isLoggedIn}
        isStreaming={isStreaming}
      />

      <ChatInputBox 
        message={message}
        setMessage={setMessage}
        handleSendMessage={handleSendMessage}
        handleKeyDown={handleKeyDown}
        handleChange={handleChange}
        handleAIAssist={handleAIAssist}
        setShowKnowledgeBase={setShowKnowledgeBase}
        setShowToolSelector={setShowToolSelector}
        setShowServerSelector={setShowServerSelector}
        setCursorPosition={setCursorPosition}
      />
      
      <InputSelectors 
        showKnowledgeBase={showKnowledgeBase}
        showToolSelector={showToolSelector}
        showServerSelector={showServerSelector}
        addKnowledgeFile={addKnowledgeFile}
        setShowKnowledgeBase={setShowKnowledgeBase}
        setShowToolSelector={setShowToolSelector}
        setShowServerSelector={setShowServerSelector}
        setMessage={setMessage}
      />
    </div>
  );
};

export default ChatInput;
