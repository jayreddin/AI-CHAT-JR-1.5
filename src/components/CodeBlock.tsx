import React, { useState, useRef } from 'react';
import { Copy, Check, Edit, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CodeBlockProps {
  code: string;
  language?: string;
  isStreaming?: boolean;
  onUpdate?: (newCode: string) => void;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = '',
  isStreaming = false,
  onUpdate
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCode, setEditedCode] = useState(code);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Code copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedCode(code);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
      }
    }, 0);
  };

  const handleSave = () => {
    setIsEditing(false);
    if (onUpdate) {
      onUpdate(editedCode);
    }
  };

  // Auto-adjust textarea height
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    setEditedCode(textarea.value);
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  // Handle tab key in textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newCode = editedCode.substring(0, start) + '  ' + editedCode.substring(end);
      setEditedCode(newCode);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  return (
    <div className="relative group rounded-md overflow-hidden">
      <div className="absolute right-2 top-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {!isStreaming && onUpdate && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-background/90 hover:bg-background/50"
            onClick={isEditing ? handleSave : handleEdit}
          >
            {isEditing ? <Save size={16} /> : <Edit size={16} />}
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 bg-background/90 hover:bg-background/50"
          onClick={copyToClipboard}
          disabled={isStreaming}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </Button>
      </div>

      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={editedCode}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          className="w-full p-4 bg-gray-900 text-gray-100 font-mono text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary"
          spellCheck={false}
        />
      ) : (
        <pre className={`!mt-0 overflow-x-auto p-4 ${language ? `language-${language}` : ''}`}>
          <code className={`${language ? `language-${language}` : ''} text-sm`}>
            {isStreaming ? code + '█' : code}
          </code>
        </pre>
      )}

      {language && (
        <div className="absolute right-2 bottom-2 text-xs text-gray-500 bg-background/90 px-2 py-1 rounded">
          {language}
        </div>
      )}
    </div>
  );
};

export default CodeBlock;