
// Define available AI models
export type AIModel = {
  id: string;
  name: string;
  provider: string;
};

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
