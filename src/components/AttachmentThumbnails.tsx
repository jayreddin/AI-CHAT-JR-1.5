
import React from 'react';
import { X, Image as ImageIcon, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { Attachment } from '@/hooks/useAttachments';
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface AttachmentThumbnailsProps {
  attachments: Attachment[];
  onRemove: (id: string) => void;
  onPreview: (id: string) => void;
}

const AttachmentThumbnails: React.FC<AttachmentThumbnailsProps> = ({ 
  attachments, 
  onRemove, 
  onPreview 
}) => {
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [currentPreviewIndex, setCurrentPreviewIndex] = React.useState(0);
  
  if (attachments.length === 0) return null;
  
  const handleThumbnailClick = (index: number) => {
    setCurrentPreviewIndex(index);
    setPreviewOpen(true);
  };
  
  const handleNextPreview = () => {
    setCurrentPreviewIndex((currentPreviewIndex + 1) % attachments.length);
  };
  
  const handlePrevPreview = () => {
    setCurrentPreviewIndex((currentPreviewIndex - 1 + attachments.length) % attachments.length);
  };
  
  const currentAttachment = attachments[currentPreviewIndex];
  
  return (
    <div className="mb-2">
      <div className="flex flex-wrap gap-2">
        {attachments.map((attachment, index) => (
          <div 
            key={attachment.id} 
            className="relative group"
            onClick={() => handleThumbnailClick(index)}
          >
            {attachment.type === 'image' ? (
              <div className="relative h-14 w-14 rounded overflow-hidden border border-gray-200 cursor-pointer">
                <img 
                  src={attachment.content} 
                  alt={attachment.name} 
                  className="h-full w-full object-cover"
                />
                {attachment.isBase64 && (
                  <div className="absolute top-0 left-0 bg-blue-500 text-white text-[8px] px-1 py-0.5">
                    B64
                  </div>
                )}
              </div>
            ) : (
              <div className="h-14 w-14 flex items-center justify-center rounded border border-gray-200 bg-gray-50 cursor-pointer">
                <FileText className="text-gray-500" size={18} />
              </div>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(attachment.id);
              }}
              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
      
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <div className="flex-1 overflow-auto relative">
            {currentAttachment?.type === 'image' ? (
              <img 
                src={currentAttachment.content} 
                alt={currentAttachment.name} 
                className="max-h-[60vh] mx-auto object-contain"
              />
            ) : (
              <div className="p-4 bg-gray-50 rounded max-h-[60vh] overflow-auto">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b">
                  <FileText size={18} />
                  <span className="font-medium">{currentAttachment?.name}</span>
                </div>
                <pre className="whitespace-pre-wrap text-sm">{currentAttachment?.content}</pre>
              </div>
            )}
            
            {attachments.length > 1 && (
              <>
                <button 
                  onClick={handlePrevPreview}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-1 rounded-full hover:bg-black/50 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={handleNextPreview}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-1 rounded-full hover:bg-black/50 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AttachmentThumbnails;
