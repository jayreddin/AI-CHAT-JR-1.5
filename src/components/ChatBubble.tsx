
import React, { useState } from 'react';
import { Copy, Edit, RefreshCw, Trash, Send } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { formatDistanceToNow } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { MessageType } from '@/types/chat';
import { toast } from 'sonner';

interface ChatBubbleProps {
  message: MessageType;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const { updateMessage, deleteMessage, resendMessage, retryMessage, isStreaming } = useChat();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    toast.success('Copied to clipboard');
  };

  const handleEdit = () => {
    if (isUser) {
      setIsEditing(true);
    }
  };

  const handleSaveEdit = () => {
    updateMessage(message.id, editContent);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(message.content);
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteMessage(message.id);
  };

  const handleResend = () => {
    if (isUser) {
      resendMessage(message.id);
    }
  };

  const handleRetry = () => {
    if (!isUser) {
      retryMessage(message.id);
    }
  };

  // Format the timestamp
  const timeAgo = formatDistanceToNow(message.timestamp, { addSuffix: true });

  return (
    <div
      className={`relative mb-4 px-4 py-3 rounded-xl border message-in ${
        isUser
          ? 'bg-user border-user-border ml-8 mr-2'
          : 'bg-ai border-ai-border ml-2 mr-8'
      } shadow-message`}
    >
      {/* Message header */}
      <div className="flex justify-between items-center mb-1">
        <div className="font-semibold text-sm text-gray-700">
          {isUser ? 'You' : message.model || 'AI'}
        </div>
        <div className="text-xs text-gray-500">{timeAgo}</div>
      </div>

      {/* Message content */}
      {isEditing ? (
        <div className="mb-2">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            rows={3}
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={handleCancelEdit}
              className="px-2 py-1 text-xs bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className="px-2 py-1 text-xs bg-primary text-white rounded-md hover:bg-primary/80 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="text-sm whitespace-pre-wrap break-words prose prose-sm max-w-none">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
          
          {/* Show reasoning context for DeepSeek Reasoner if available */}
          {message.reasoningContext && (
            <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-600 italic">
              <div className="text-xs font-semibold mb-1">Reasoning:</div>
              <ReactMarkdown>{message.reasoningContext}</ReactMarkdown>
            </div>
          )}
        </>
      )}

      {/* Message actions */}
      {!isEditing && !isStreaming && (
        <div
          className={`flex gap-2 mt-2 justify-end transition-opacity opacity-0 group-hover:opacity-100 ${
            isUser ? 'justify-start' : 'justify-end'
          }`}
        >
          {isUser ? (
            <>
              <button
                onClick={handleCopy}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                title="Copy"
              >
                <Copy size={14} />
              </button>
              <button
                onClick={handleEdit}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                title="Edit"
              >
                <Edit size={14} />
              </button>
              <button
                onClick={handleResend}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                title="Resend"
              >
                <Send size={14} />
              </button>
              <button
                onClick={handleDelete}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                title="Delete"
              >
                <Trash size={14} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleRetry}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                title="Retry"
              >
                <RefreshCw size={14} />
              </button>
              <button
                onClick={handleCopy}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                title="Copy"
              >
                <Copy size={14} />
              </button>
              <button
                onClick={handleDelete}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                title="Delete"
              >
                <Trash size={14} />
              </button>
            </>
          )}
        </div>
      )}

      {/* Streaming indicator */}
      {message.isStreaming && (
        <div className="mt-2 text-sm text-gray-500">
          <div className="flex space-x-1 justify-center">
            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-100"></div>
            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBubble;
