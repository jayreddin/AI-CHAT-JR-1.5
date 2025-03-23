
import React from 'react';
import { X, ChevronLeft, ChevronRight, File } from 'lucide-react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Attachment } from '@/hooks/useAttachments';
import { useIsMobile } from '@/hooks/use-mobile';

interface AttachmentThumbnailProps {
  attachment: Attachment;
  onRemove: (id: string) => void;
  onPreview: (id: string) => void;
}

export const AttachmentThumbnail: React.FC<AttachmentThumbnailProps> = ({ 
  attachment, 
  onRemove, 
  onPreview 
}) => {
  const isMobile = useIsMobile();
  const size = isMobile ? "h-12 w-12" : "h-16 w-16";
  
  const handleClick = () => {
    onPreview(attachment.id);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(attachment.id);
  };

  return (
    <div 
      className={`relative ${size} rounded overflow-hidden border border-gray-200 cursor-pointer group`}
      onClick={handleClick}
    >
      {attachment.type === 'image' ? (
        <img 
          src={attachment.content} 
          alt={attachment.name} 
          className="h-full w-full object-cover" 
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center bg-gray-100">
          <File className={isMobile ? "h-6 w-6" : "h-8 w-8"} />
          <span className="absolute bottom-0 left-0 right-0 text-center text-xs truncate bg-white/80 p-0.5">
            {attachment.name.split('.').pop()}
          </span>
        </div>
      )}
      
      {attachment.isBase64 && (
        <div className="absolute top-0 left-0 bg-blue-500 text-white text-[8px] px-1 py-0.5">
          B64
        </div>
      )}
      
      <button 
        className="absolute top-0 right-0 p-0.5 bg-red-500 text-white rounded-bl-sm opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleRemove}
      >
        <X size={12} />
      </button>
    </div>
  );
};

interface AttachmentPreviewDialogProps {
  attachment: Attachment | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  hasMultiple: boolean;
}

export const AttachmentPreviewDialog: React.FC<AttachmentPreviewDialogProps> = ({
  attachment,
  onClose,
  onNext,
  onPrev,
  hasMultiple
}) => {
  const isMobile = useIsMobile();
  
  if (!attachment) return null;

  return (
    <Dialog open={!!attachment} onOpenChange={() => onClose()}>
      <DialogContent className={`${isMobile ? 'max-w-[95vw]' : 'max-w-3xl'}`}>
        <div className="relative">
          {attachment.type === 'image' ? (
            <img 
              src={attachment.content} 
              alt={attachment.name} 
              className="max-h-[70vh] max-w-full mx-auto"
            />
          ) : (
            <div className="bg-gray-100 p-4 rounded max-h-[70vh] overflow-y-auto">
              <pre className="whitespace-pre-wrap break-words text-sm">
                {attachment.content}
              </pre>
            </div>
          )}
          
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm font-medium truncate">{attachment.name}</span>
            <span className="text-sm text-gray-500">
              {(attachment.size / 1024).toFixed(2)} KB
              {attachment.isBase64 && " (Base64)"}
            </span>
          </div>

          {hasMultiple && (
            <>
              <button 
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70"
                onClick={onPrev}
              >
                <ChevronLeft size={isMobile ? 20 : 24} />
              </button>
              <button 
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70"
                onClick={onNext}
              >
                <ChevronRight size={isMobile ? 20 : 24} />
              </button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface AttachmentPreviewProps {
  attachments: Attachment[];
  previewAttachment: Attachment | null;
  onRemove: (id: string) => void;
  onPreview: (id: string) => void;
  onClosePreview: () => void;
  onNextPreview: () => void;
  onPrevPreview: () => void;
}

const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({
  attachments,
  previewAttachment,
  onRemove,
  onPreview,
  onClosePreview,
  onNextPreview,
  onPrevPreview
}) => {
  if (attachments.length === 0) return null;

  return (
    <div className="mt-2 mb-4">
      <div className="flex flex-wrap gap-2">
        {attachments.map((attachment) => (
          <AttachmentThumbnail 
            key={attachment.id}
            attachment={attachment}
            onRemove={onRemove}
            onPreview={onPreview}
          />
        ))}
      </div>
      
      <AttachmentPreviewDialog 
        attachment={previewAttachment}
        onClose={onClosePreview}
        onNext={onNextPreview}
        onPrev={onPrevPreview}
        hasMultiple={attachments.length > 1}
      />
    </div>
  );
};

export default AttachmentPreview;
