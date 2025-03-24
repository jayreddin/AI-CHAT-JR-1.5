
import React, { useState } from 'react';
import { useChat } from '@/context/chat/ChatProvider';
import { RefreshCw, Trash2, FileText, Copy, Edit } from 'lucide-react';
import Markdown from 'react-markdown';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { toast } from 'sonner';

interface ChatBubbleProps {
  message: {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
    model?: string;
    isStreaming?: boolean;
    reasoningContext?: string;
  };
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const { deleteMessage, resendMessage, retryMessage } = useChat();
  const isMobile = useIsMobile();
  const isUser = message.role === 'user';
  
  // Process the message content to ensure it's a string
  const content = typeof message.content === 'string' ? message.content : 
                 (message.content ? JSON.stringify(message.content) : '');

  // Format timestamp
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const copyMessageToClipboard = () => {
    navigator.clipboard.writeText(content);
    toast.success("Message copied to clipboard");
  };

  return (
    <div className={`flex mb-8 ${isUser ? 'justify-end' : 'justify-start'} chat-message-container`}>
      <div
        className={`relative max-w-[85%] p-3 rounded-lg ${
          isUser
            ? 'bg-primary text-white rounded-tr-none'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none'
        }`}
      >
        {isUser ? (
          <div className="whitespace-pre-wrap break-words text-sm">{content}</div>
        ) : (
          <div className="markdown-wrapper text-sm">
            {message.isStreaming && message.content === '' ? (
              <div className="flex items-center">
                <div className="animate-pulse">AI is thinking...</div>
              </div>
            ) : (
              <Markdown>{content}</Markdown>
            )}
            
            {message.reasoningContext && (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="ghost" size="sm" className="mt-2 text-xs">
                    <FileText size={14} className="mr-1" />
                    View Reasoning
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                  <div className="font-mono whitespace-pre-wrap">{message.reasoningContext}</div>
                </HoverCardContent>
              </HoverCard>
            )}
          </div>
        )}
        
        <div className="text-xs opacity-70 mt-1 text-right">
          {message.model ? `${message.model} · ` : ''}
          {formattedTime}
        </div>
      </div>

      {/* Message action buttons - positioned below the bubble */}
      <div className={isUser ? 'user-message-actions' : 'ai-message-actions'}>
        {isUser ? (
          <>
            <button
              onClick={() => {/* Handle edit (placeholder) */}}
              className="message-action-button"
              title="Edit message"
            >
              <Edit size={14} />
            </button>
            <button
              onClick={() => resendMessage(message.id)}
              className="message-action-button"
              title="Resend message"
            >
              <RefreshCw size={14} />
            </button>
            <button
              onClick={copyMessageToClipboard}
              className="message-action-button"
              title="Copy message"
            >
              <Copy size={14} />
            </button>
            <button
              onClick={() => deleteMessage(message.id)}
              className="message-action-button"
              title="Delete message"
            >
              <Trash2 size={14} />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => retryMessage(message.id)}
              className="message-action-button"
              title="Regenerate response"
            >
              <RefreshCw size={14} />
            </button>
            <button
              onClick={copyMessageToClipboard}
              className="message-action-button"
              title="Copy to clipboard"
            >
              <Copy size={14} />
            </button>
            <button
              onClick={() => deleteMessage(message.id)}
              className="message-action-button"
              title="Delete message"
            >
              <Trash2 size={14} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
