
import { AIModel } from '@/types/chat';

export interface MessageType {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  model?: string;
  isStreaming?: boolean;
  reasoningContext?: string;
}

export interface ChatType {
  id: string;
  title: string;
  messages: MessageType[];
  createdAt: Date;
  updatedAt: Date;
  model: AIModel;
}

export interface ChatContextType {
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
}
