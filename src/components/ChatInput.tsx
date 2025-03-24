
import React, { useState } from 'react';
import { useChat } from '@/context/chat/ChatProvider';
import { Attachment } from '@/hooks/useAttachments';
import ChatInputBox from './chat-input/ChatInputBox';
import InputSelectors from './chat-input/InputSelectors';
import StopGenerationButton from './chat-input/StopGenerationButton';
import AttachmentArea from './chat-input/AttachmentArea';
import { useChatInput } from '@/hooks/useChatInput';

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
  const { isLoggedIn, isStreaming } = useChat();
  const {
    message,
    setMessage,
    showKnowledgeBase,
    setShowKnowledgeBase,
    showToolSelector,
    setShowToolSelector,
    showServerSelector,
    setShowServerSelector,
    cursorPosition,
    setCursorPosition,
    activeKnowledgeFiles,
    setActiveKnowledgeFiles,
    handleSendMessage,
    handleKeyDown,
    handleChange,
    handleAIAssist,
    addKnowledgeFile
  } = useChatInput(onClearAttachments);

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
        message={message}
        cursorPosition={cursorPosition}
      />
    </div>
  );
};

export default ChatInput;
