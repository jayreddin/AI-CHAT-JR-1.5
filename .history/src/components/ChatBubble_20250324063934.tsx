import React, { useState } from 'react';
import { useChat } from '@/context/chat/ChatProvider';
import { RefreshCw, Trash2, FileText, Copy, Edit } from 'lucide-react';
import Markdown from 'react-markdown';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { toast } from 'sonner';
import CodeBlock from './CodeBlock';

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
  const [editedContent, setEditedContent] = useState(message.content);

  // Process the message content to ensure it's a string
  const content = typeof editedContent === 'string' ? editedContent : 
                 (editedContent ? JSON.stringify(editedContent) : '');

  // Format timestamp
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const copyMessageToClipboard = () => {
    navigator.clipboard.writeText(content);
    toast.success("Message copied to clipboard");
  };

  const updateCodeBlock = (newCode: string) => {
    const updatedContent = content.replace(/```[\s\S]*?```/, `\`\`\`\n${newCode}\n\`\`\``);
    setEditedContent(updatedContent);
  };

  // Custom components for markdown rendering
  const markdownComponents = {
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';

      return !inline ? (
        <CodeBlock
          code={String(children).replace(/\n$/, '')}
          language={language}
          isStreaming={message.isStreaming}
          onUpdate={isUser ? undefined : updateCodeBlock}
        />
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
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
            {message.isStreaming && content === '' ? (
              <div className="flex items-center">
                <div className="animate-pulse">AI is thinking...</div>
              </div>
            ) : (
              <Markdown components={markdownComponents}>{content}</Markdown>
            )}
            
            {message.reasoningContext && (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="ghost" size="sm" className="mt-2 text-xs">
                    <FileText size={14} className="mr-1" />
                    View Reasoning
                  </Button>
                </HoverCardTrigger>
