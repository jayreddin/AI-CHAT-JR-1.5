
import { ChatType, MessageType } from './types';
import { AIModel } from '@/types/chat';
import { generateId } from '@/utils/helpers';

// Action types
export type ChatAction =
  | { type: 'CREATE_CHAT'; payload: AIModel }
  | { type: 'SET_CURRENT_CHAT'; payload: string }
  | { type: 'ADD_USER_MESSAGE'; payload: { content: string; chatId: string } }
  | { type: 'ADD_ASSISTANT_MESSAGE'; payload: { messageId: string; chatId: string; model: AIModel } }
  | { type: 'UPDATE_ASSISTANT_MESSAGE'; payload: { messageId: string; chatId: string; content: string; reasoningContext?: string } }
  | { type: 'UPDATE_MESSAGE'; payload: { messageId: string; chatId: string; content: string } }
  | { type: 'DELETE_MESSAGE'; payload: { messageId: string; chatId: string } }
  | { type: 'STOP_STREAMING'; payload: { chatId: string; messageId: string } }
  | { type: 'SET_MODEL'; payload: AIModel };

// Reducer function
export const chatReducer = (state: { chats: ChatType[]; currentChat: ChatType | null; currentModel: AIModel }, action: ChatAction): { chats: ChatType[]; currentChat: ChatType | null; currentModel: AIModel } => {
  switch (action.type) {
    case 'CREATE_CHAT': {
      const newChat: ChatType = {
        id: generateId(),
        title: 'New Chat',
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        model: action.payload,
      };

      return {
        ...state,
        chats: [newChat, ...state.chats],
        currentChat: newChat,
      };
    }

    case 'SET_CURRENT_CHAT': {
      const chat = state.chats.find((c) => c.id === action.payload);
      return {
        ...state,
        currentChat: chat || state.currentChat,
      };
    }

    case 'ADD_USER_MESSAGE': {
      if (!state.currentChat) return state;

      const userMessage: MessageType = {
        id: generateId(),
        content: action.payload.content,
        role: 'user',
        timestamp: new Date(),
      };

      const updatedChat = {
        ...state.currentChat,
        messages: [userMessage, ...state.currentChat.messages],
        updatedAt: new Date(),
        // Update title if this is the first message
        title: state.currentChat.messages.length === 0 
          ? (action.payload.content.substring(0, 30) + (action.payload.content.length > 30 ? '...' : '')) 
          : state.currentChat.title
      };

      return {
        ...state,
        currentChat: updatedChat,
        chats: state.chats.map((c) => (c.id === updatedChat.id ? updatedChat : c)),
      };
    }

    case 'ADD_ASSISTANT_MESSAGE': {
      if (!state.currentChat) return state;

      const assistantMessage: MessageType = {
        id: action.payload.messageId,
        content: '',
        role: 'assistant',
        timestamp: new Date(),
        model: action.payload.model.name,
        isStreaming: true,
      };

      const updatedChat = {
        ...state.currentChat,
        messages: [assistantMessage, ...state.currentChat.messages],
        updatedAt: new Date(),
      };

      return {
        ...state,
        currentChat: updatedChat,
        chats: state.chats.map((c) => (c.id === updatedChat.id ? updatedChat : c)),
      };
    }

    case 'UPDATE_ASSISTANT_MESSAGE': {
      if (!state.currentChat) return state;

      const updatedChat = {
        ...state.currentChat,
        messages: state.currentChat.messages.map((m) =>
          m.id === action.payload.messageId
            ? { 
                ...m, 
                content: action.payload.content,
                reasoningContext: action.payload.reasoningContext
              }
            : m
        ),
        updatedAt: new Date(),
      };

      return {
        ...state,
        currentChat: updatedChat,
        chats: state.chats.map((c) => (c.id === updatedChat.id ? updatedChat : c)),
      };
    }

    case 'UPDATE_MESSAGE': {
      if (!state.currentChat) return state;

      const updatedChat = {
        ...state.currentChat,
        messages: state.currentChat.messages.map((m) =>
          m.id === action.payload.messageId ? { ...m, content: action.payload.content } : m
        ),
        updatedAt: new Date(),
      };

      return {
        ...state,
        currentChat: updatedChat,
        chats: state.chats.map((c) => (c.id === updatedChat.id ? updatedChat : c)),
      };
    }

    case 'DELETE_MESSAGE': {
      if (!state.currentChat) return state;

      const updatedChat = {
        ...state.currentChat,
        messages: state.currentChat.messages.filter((m) => m.id !== action.payload.messageId),
        updatedAt: new Date(),
      };

      return {
        ...state,
        currentChat: updatedChat,
        chats: state.chats.map((c) => (c.id === updatedChat.id ? updatedChat : c)),
      };
    }

    case 'STOP_STREAMING': {
      if (!state.currentChat) return state;

      const updatedChat = {
        ...state.currentChat,
        messages: state.currentChat.messages.map((m) =>
          m.id === action.payload.messageId ? { ...m, isStreaming: false } : m
        ),
      };

      return {
        ...state,
        currentChat: updatedChat,
        chats: state.chats.map((c) => (c.id === updatedChat.id ? updatedChat : c)),
      };
    }

    case 'SET_MODEL': {
      return {
        ...state,
        currentModel: action.payload,
      };
    }

    default:
      return state;
  }
};
