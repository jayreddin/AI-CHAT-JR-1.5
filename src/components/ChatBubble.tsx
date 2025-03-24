
import React, { useState } from 'react';
import { useChat } from '@/context/chat/ChatProvider';
import { RefreshCw, Trash2, FileText, Copy } from 'lucide-react';
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
  const [showControls, setShowControls] = useState(false);
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
    <div
      className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div
        className={`relative max-w-[85%] p-3 rounded-lg ${
          isUser
            ? 'bg-primary text-white rounded-tr-none'
            : 'bg-gray-100 text-gray-800 rounded-tl-none'
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
                <HoverCardContent className="w-80 text-xs bg-gray-50 border border-gray-200">
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
        
        {(showControls || isMobile) && (
          <div 
            className={`absolute ${
              isUser ? 'left-0 -translate-x-full -ml-2' : 'right-0 translate-x-full mr-2'
            } top-1/2 -translate-y-1/2 flex flex-col gap-1`}
          >
            {isUser ? (
              <>
                <button
                  onClick={() => resendMessage(message.id)}
                  className="p-1.5 bg-gray-100 rounded-full shadow hover:bg-gray-200 text-gray-700"
                  title="Resend message"
                >
                  <RefreshCw size={14} />
                </button>
                <button
                  onClick={() => deleteMessage(message.id)}
                  className="p-1.5 bg-gray-100 rounded-full shadow hover:bg-gray-200 text-red-500"
                  title="Delete message"
                >
                  <Trash2 size={14} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => retryMessage(message.id)}
                  className="p-1.5 bg-gray-100 rounded-full shadow hover:bg-gray-200 text-gray-700"
                  title="Regenerate response"
                >
                  <RefreshCw size={14} />
                </button>
                <button
                  onClick={copyMessageToClipboard}
                  className="p-1.5 bg-gray-100 rounded-full shadow hover:bg-gray-200 text-gray-700"
                  title="Copy to clipboard"
                >
                  <Copy size={14} />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
