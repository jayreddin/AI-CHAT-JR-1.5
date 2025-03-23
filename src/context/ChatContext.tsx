import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { AIModel, ChatType, MessageType } from '@/types/chat';
import { AVAILABLE_MODELS } from '@/constants/models';
import { generateId } from '@/utils/helpers';
import { aiService } from '@/services/aiService';
import { toast } from 'sonner';

// Define chat context type
type ChatContextType = {
  chats: ChatType[];
  currentChat: ChatType | null;
  currentModel: AIModel;
  AVAILABLE_MODELS: AIModel[];
  isLoggedIn: boolean;
  isStreaming: boolean;
  isMicActive: boolean;
  showToolbar: boolean;
  streamingEnabled: boolean;
  createNewChat: () => void;
  setCurrentChat: (chatId: string) => void;
  sendMessage: (content: string) => Promise<void>;
  updateMessage: (messageId: string, content: string) => void;
  deleteMessage: (messageId: string) => void;
  resendMessage: (messageId: string) => void;
  retryMessage: (messageId: string) => void;
  setModel: (model: AIModel) => void;
  login: () => Promise<void>;
  logout: () => void;
  stopGeneration: () => void;
  toggleMic: () => void;
  toggleToolbar: () => void;
  toggleStreamingMode: () => void;
};

// Create context with default values
const ChatContext = createContext<ChatContextType>({
  chats: [],
  currentChat: null,
  currentModel: AVAILABLE_MODELS[0],
  AVAILABLE_MODELS: AVAILABLE_MODELS,
  isLoggedIn: false,
  isStreaming: false,
  isMicActive: false,
  showToolbar: false,
  streamingEnabled: false,
  createNewChat: () => {},
  setCurrentChat: () => {},
  sendMessage: async () => {},
  updateMessage: () => {},
  deleteMessage: () => {},
  resendMessage: () => {},
  retryMessage: () => {},
  setModel: () => {},
  login: async () => {},
  logout: () => {},
  stopGeneration: () => {},
  toggleMic: () => {},
  toggleToolbar: () => {},
  toggleStreamingMode: () => {},
});

// Create provider component
export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<ChatType[]>([]);
  const [currentChat, setCurrentChatState] = useState<ChatType | null>(null);
  const [currentModel, setCurrentModel] = useState<AIModel>(AVAILABLE_MODELS[0]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [isMicActive, setIsMicActive] = useState<boolean>(false);
  const [showToolbar, setShowToolbar] = useState<boolean>(false);
  const [streamingEnabled, setStreamingEnabled] = useState<boolean>(false);

  // Check if Puter is available and if user is logged in
  useEffect(() => {
    const checkLoginStatus = async () => {
      if (typeof window !== 'undefined' && (window as any).puter) {
        try {
          const user = await (window as any).puter.auth.getUser();
          setIsLoggedIn(!!user);
        } catch (error) {
          console.error('Error checking login status:', error);
          setIsLoggedIn(false);
        }
      }
    };

    checkLoginStatus();
  }, []);

  // Create a new chat
  const createNewChat = () => {
    const newChat: ChatType = {
      id: generateId(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      model: currentModel,
    };

    setChats([newChat, ...chats]);
    setCurrentChatState(newChat);
  };

  // Set current chat
  const setCurrentChat = (chatId: string) => {
    const chat = chats.find((c) => c.id === chatId);
    if (chat) {
      setCurrentChatState(chat);
    }
  };

  // Toggle streaming mode
  const toggleStreamingMode = () => {
    setStreamingEnabled(!streamingEnabled);
  };

  // Send a message
  const sendMessage = async (content: string) => {
    if (!currentChat) {
      createNewChat();
    }

    const userMessage: MessageType = {
      id: generateId(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    const newChat = {
      ...(currentChat as ChatType),
      messages: [userMessage, ...(currentChat?.messages || [])],
      updatedAt: new Date(),
    };

    // Update the title if this is the first message
    if (newChat.messages.length === 1) {
      newChat.title = content.substring(0, 30) + (content.length > 30 ? '...' : '');
    }

    setCurrentChatState(newChat);
    setChats(chats.map((c) => (c.id === newChat.id ? newChat : c)));

    // Send to AI service
    setIsStreaming(true);

    const assistantMessage: MessageType = {
      id: generateId(),
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      model: currentModel.name,
      isStreaming: true,
    };

    const updatedChat = {
      ...newChat,
      messages: [assistantMessage, ...newChat.messages],
      updatedAt: new Date(),
    };

    setCurrentChatState(updatedChat);
    setChats(chats.map((c) => (c.id === updatedChat.id ? updatedChat : c)));

    try {
      console.log(`Requesting ${currentModel.id} with streaming: ${streamingEnabled}`);
      const { message, stream } = await aiService.sendMessage(content, currentModel.id, streamingEnabled);
      
      if (streamingEnabled && stream) {
        // Handle streaming response
        let streamedContent = '';
        let reasoningContext = '';
        const isDeepSeekReasoner = currentModel.id === 'deepseek-reasoner';
        
        try {
          for await (const part of stream) {
            if (!isStreaming) break; // Stop generation if requested
            
            console.log("Stream part:", part);
            
            if (part === null || part === undefined) continue;
            
            let textContent = '';
            
            // Handle different streaming formats
            if (typeof part === 'string') {
              textContent = part;
            } else if (part.text) {
              textContent = typeof part.text === 'string' ? part.text : '';
            } else if (part.content) {
              textContent = part.content;
            } else if (part.message?.content) {
              textContent = part.message.content;
            }
            
            // Handle DeepSeek Reasoner specific format
            if (isDeepSeekReasoner && part.type === 'thinking') {
              reasoningContext += textContent;
              
              const updatedMessage = {
                ...assistantMessage,
                content: streamedContent,
                reasoningContext: reasoningContext,
              };
  
              const updatedChatWithResponse = {
                ...updatedChat,
                messages: updatedChat.messages.map((m) =>
                  m.id === assistantMessage.id ? updatedMessage : m
                ),
              };
  
              setCurrentChatState(updatedChatWithResponse);
              setChats(chats.map((c) => (c.id === updatedChatWithResponse.id ? updatedChatWithResponse : c)));
            } else {
              streamedContent += textContent;
              
              const updatedMessage = {
                ...assistantMessage,
                content: streamedContent,
                reasoningContext: isDeepSeekReasoner ? reasoningContext : undefined,
              };
  
              const updatedChatWithResponse = {
                ...updatedChat,
                messages: updatedChat.messages.map((m) =>
                  m.id === assistantMessage.id ? updatedMessage : m
                ),
              };
  
              setCurrentChatState(updatedChatWithResponse);
              setChats(chats.map((c) => (c.id === updatedChatWithResponse.id ? updatedChatWithResponse : c)));
            }
          }
        } catch (streamError) {
          console.error("Streaming error:", streamError);
          toast.error(`Streaming error: ${streamError.message || 'Unknown error'}`);
          
          // Update with error message
          const errorMessage = {
            ...assistantMessage,
            content: streamedContent || 'Sorry, there was an error while streaming the response.',
            isStreaming: false,
          };
  
          const errorChat = {
            ...updatedChat,
            messages: updatedChat.messages.map((m) =>
              m.id === assistantMessage.id ? errorMessage : m
            ),
          };
  
          setCurrentChatState(errorChat);
          setChats(chats.map((c) => (c.id === errorChat.id ? errorChat : c)));
          
          setIsStreaming(false);
          return;
        }
        
        // Finalize streaming message
        const finalMessage = {
          ...assistantMessage,
          content: streamedContent || 'No response received.',
          reasoningContext: isDeepSeekReasoner ? reasoningContext : undefined,
          isStreaming: false,
        };

        const finalChat = {
          ...updatedChat,
          messages: updatedChat.messages.map((m) =>
            m.id === assistantMessage.id ? finalMessage : m
          ),
        };

        setCurrentChatState(finalChat);
        setChats(chats.map((c) => (c.id === finalChat.id ? finalChat : c)));
      } else {
        // Handle non-streaming response
        const finalMessage = {
          ...assistantMessage,
          content: message.content || 'No response received.',
          isStreaming: false,
        };

        const finalChat = {
          ...updatedChat,
          messages: updatedChat.messages.map((m) =>
            m.id === assistantMessage.id ? finalMessage : m
          ),
        };

        setCurrentChatState(finalChat);
        setChats(chats.map((c) => (c.id === finalChat.id ? finalChat : c)));
      }
    } catch (error) {
      console.error('Error in AI response:', error);
      toast.error(`AI error: ${error.message || 'Unknown error'}`);
      
      // Update with error message
      const errorMessage = {
        ...assistantMessage,
        content: 'Sorry, there was an error processing your request. Please try again.',
        isStreaming: false,
      };

      const errorChat = {
        ...updatedChat,
        messages: updatedChat.messages.map((m) =>
          m.id === assistantMessage.id ? errorMessage : m
        ),
      };

      setCurrentChatState(errorChat);
      setChats(chats.map((c) => (c.id === errorChat.id ? errorChat : c)));
    } finally {
      setIsStreaming(false);
    }
  };

  // Update a message
  const updateMessage = (messageId: string, content: string) => {
    if (!currentChat) return;

    const updatedChat = {
      ...currentChat,
      messages: currentChat.messages.map((m) =>
        m.id === messageId ? { ...m, content } : m
      ),
      updatedAt: new Date(),
    };

    setCurrentChatState(updatedChat);
    setChats(chats.map((c) => (c.id === updatedChat.id ? updatedChat : c)));
  };

  // Delete a message
  const deleteMessage = (messageId: string) => {
    if (!currentChat) return;

    const updatedChat = {
      ...currentChat,
      messages: currentChat.messages.filter((m) => m.id !== messageId),
      updatedAt: new Date(),
    };

    setCurrentChatState(updatedChat);
    setChats(chats.map((c) => (c.id === updatedChat.id ? updatedChat : c)));
  };

  // Resend a message
  const resendMessage = (messageId: string) => {
    if (!currentChat) return;

    const message = currentChat.messages.find((m) => m.id === messageId);
    if (message && message.role === 'user') {
      sendMessage(message.content);
    }
  };

  // Retry an AI message
  const retryMessage = (messageId: string) => {
    if (!currentChat) return;

    const index = currentChat.messages.findIndex((m) => m.id === messageId);
    if (index >= 0 && currentChat.messages[index].role === 'assistant') {
      // Find the user message that prompted this response
      for (let i = index + 1; i < currentChat.messages.length; i++) {
        if (currentChat.messages[i].role === 'user') {
          sendMessage(currentChat.messages[i].content);
          break;
        }
      }
    }
  };

  // Set the current model
  const setModel = (model: AIModel) => {
    setCurrentModel(model);
  };

  // Login to Puter
  const login = async () => {
    if (typeof window !== 'undefined' && (window as any).puter) {
      try {
        await (window as any).puter.auth.signIn();
        setIsLoggedIn(true);
        // Create a new chat if none exists
        if (chats.length === 0) {
          createNewChat();
        }
      } catch (error) {
        console.error('Error logging in:', error);
      }
    }
  };

  // Logout from Puter
  const logout = () => {
    if (typeof window !== 'undefined' && (window as any).puter) {
      (window as any).puter.auth.signOut();
      setIsLoggedIn(false);
    }
  };

  // Stop generation
  const stopGeneration = () => {
    setIsStreaming(false);
  };

  // Toggle microphone
  const toggleMic = () => {
    if (!isMicActive) {
      // Request microphone access
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          setIsMicActive(true);
          // In a real implementation, we would start recording here
          // For this demo, we'll just toggle the state
        })
        .catch((err) => {
          console.error('Error accessing microphone:', err);
        });
    } else {
      setIsMicActive(false);
      // In a real implementation, we would stop recording here
    }
  };

  // Toggle toolbar
  const toggleToolbar = () => {
    setShowToolbar(!showToolbar);
  };

  // Initialize with a default chat
  useEffect(() => {
    if (chats.length === 0) {
      createNewChat();
    }
  }, []);

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChat,
        currentModel,
        AVAILABLE_MODELS,
        isLoggedIn,
        isStreaming,
        isMicActive,
        showToolbar,
        streamingEnabled,
        createNewChat,
        setCurrentChat,
        sendMessage,
        updateMessage,
        deleteMessage,
        resendMessage,
        retryMessage,
        setModel,
        login,
        logout,
        stopGeneration,
        toggleMic,
        toggleToolbar,
        toggleStreamingMode,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to use the chat context
export const useChat = () => useContext(ChatContext);

// Export types
export type { ChatContextType, ChatType, MessageType, AIModel };
