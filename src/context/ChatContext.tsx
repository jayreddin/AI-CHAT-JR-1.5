
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Define available AI models
export type AIModel = {
  id: string;
  name: string;
  provider: string;
};

export const AVAILABLE_MODELS: AIModel[] = [
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI' },
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
  { id: 'o3-mini', name: 'O3 Mini', provider: 'OpenAI' },
  { id: 'o1-mini', name: 'O1 Mini', provider: 'OpenAI' },
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
  { id: 'claude-3-7-sonnet', name: 'Claude 3.7 Sonnet', provider: 'Anthropic' },
  { id: 'deepseek-chat', name: 'DeepSeek Chat', provider: 'High-Flyer (DeepSeek)' },
  { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner', provider: 'High-Flyer (DeepSeek)' },
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', provider: 'Google' },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'Google' },
  { id: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo', name: 'Llama 3.1 8B', provider: 'Together.ai' },
  { id: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo', name: 'Llama 3.1 70B', provider: 'Together.ai' },
  { id: 'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo', name: 'Llama 3.1 405B', provider: 'Together.ai' },
  { id: 'mistral-large-latest', name: 'Mistral Large', provider: 'Mistral AI' },
  { id: 'pixtral-large-latest', name: 'Pixtral Large', provider: 'Mistral AI' },
  { id: 'codestral-latest', name: 'Codestral', provider: 'Mistral AI' },
  { id: 'google/gemma-2-27b-it', name: 'Gemma 2 27B', provider: 'Groq' },
  { id: 'grok-beta', name: 'Grok Beta', provider: 'xAI' },
];

// Define message type
export type MessageType = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  model?: string;
  isStreaming?: boolean;
};

// Define chat type
export type ChatType = {
  id: string;
  title: string;
  messages: MessageType[];
  createdAt: Date;
  updatedAt: Date;
  model: AIModel;
};

// Define chat context type
type ChatContextType = {
  chats: ChatType[];
  currentChat: ChatType | null;
  currentModel: AIModel;
  isLoggedIn: boolean;
  isStreaming: boolean;
  isMicActive: boolean;
  showToolbar: boolean;
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
};

// Create context with default values
const ChatContext = createContext<ChatContextType>({
  chats: [],
  currentChat: null,
  currentModel: AVAILABLE_MODELS[0],
  isLoggedIn: false,
  isStreaming: false,
  isMicActive: false,
  showToolbar: false,
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

    // Simulate AI response
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

    // Simulate streaming response
    const response = `This is a simulated response from ${currentModel.name}. In a real implementation, this would call the Puter API to get a response from the selected AI model.`;
    let streamedContent = '';

    for (let i = 0; i < response.length; i++) {
      if (!isStreaming) break; // Stop generation if requested

      await new Promise((resolve) => setTimeout(resolve, 20)); // Simulate streaming delay
      streamedContent += response[i];

      const updatedMessage = {
        ...assistantMessage,
        content: streamedContent,
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

    // Finalize the message
    const finalMessage = {
      ...assistantMessage,
      content: streamedContent,
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
    setIsStreaming(false);
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
        isLoggedIn,
        isStreaming,
        isMicActive,
        showToolbar,
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
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Helper function to generate a unique ID
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Custom hook to use the chat context
export const useChat = () => useContext(ChatContext);
