
import React from 'react';
import { Paperclip, Image, FileUp } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useIsMobile } from '@/hooks/use-mobile';
import { Attachment } from '@/hooks/useAttachments';

interface AttachmentButtonsProps {
  onAddAttachment: (attachment: Omit<Attachment, 'id'>) => string;
  disabled?: boolean;
}

const AttachmentButtons: React.FC<AttachmentButtonsProps> = ({ 
  onAddAttachment,
  disabled = false
}) => {
  const isMobile = useIsMobile();

  const handleAddAttachment = (type: 'image' | 'file') => {
    if (type === 'image') {
      onAddAttachment({
        type: 'image',
        content: 'https://picsum.photos/200',
        name: 'example.jpg',
        size: 1024 * 10,
        isBase64: false
      });
    } else {
      onAddAttachment({
        type: 'file',
        content: 'Example file content',
        name: 'example.txt',
        size: 1024 * 2,
        isBase64: false
      });
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          title="Add attachment"
          disabled={disabled}
        >
          <Paperclip size={isMobile ? 16 : 18} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto" align="end">
        <div className="grid gap-1">
          <button 
            className="flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-md transition-colors"
            onClick={() => handleAddAttachment('image')}
          >
            <Image size={16} />
            <span>Add Image</span>
          </button>
          <button 
            className="flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-md transition-colors"
            onClick={() => handleAddAttachment('file')}
          >
            <FileUp size={16} />
            <span>Add File</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AttachmentButtons;
