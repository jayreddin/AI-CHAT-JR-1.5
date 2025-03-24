
import { useState } from 'react';
import { useChat } from '@/context/chat/ChatProvider';
import { toast } from 'sonner';

export const useChatInput = (onClearAttachments?: () => void) => {
  const { sendMessage } = useChat();
  const [message, setMessage] = useState('');
  const [showKnowledgeBase, setShowKnowledgeBase] = useState(false);
  const [showToolSelector, setShowToolSelector] = useState(false);
  const [showServerSelector, setShowServerSelector] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [activeKnowledgeFiles, setActiveKnowledgeFiles] = useState<string[]>([]);

  const handleSendMessage = () => {
    if (!message.trim() && activeKnowledgeFiles.length === 0) return;
    
    console.log('Sending message with active knowledge files:', activeKnowledgeFiles);
    
    // For tools, we'll handle function calling in the sendMessage method in ChatProvider
    // The function calling is handled by the AI service
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

  return {
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
  };
};
