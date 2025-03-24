
import React from 'react';
import { Attachment } from '@/hooks/useAttachments';
import AttachmentThumbnails from '@/components/AttachmentThumbnails';
import AttachmentButtons from '@/components/AttachmentButtons';
import ActiveKnowledgeFiles from '@/components/ActiveKnowledgeFiles';

interface AttachmentAreaProps {
  attachments: Attachment[];
  activeKnowledgeFiles: string[];
  onRemoveAttachment: (id: string) => void;
  onAddAttachment: (attachment: Omit<Attachment, 'id'>) => string;
  onRemoveKnowledgeFile: (file: string) => void;
  isLoggedIn: boolean;
  isStreaming: boolean;
}

const AttachmentArea: React.FC<AttachmentAreaProps> = ({
  attachments,
  activeKnowledgeFiles,
  onRemoveAttachment,
  onAddAttachment,
  onRemoveKnowledgeFile,
  isLoggedIn,
  isStreaming
}) => {
  return (
    <>
      {activeKnowledgeFiles.length > 0 && (
        <ActiveKnowledgeFiles 
          files={activeKnowledgeFiles}
          onRemove={onRemoveKnowledgeFile}
        />
      )}
      
      {attachments.length > 0 && (
        <AttachmentThumbnails 
          attachments={attachments} 
          onRemove={onRemoveAttachment}
          onPreview={() => {}}
        />
      )}
      
      {isLoggedIn && onAddAttachment && (
        <div className="absolute right-[100px] bottom-2 flex items-center">
          <AttachmentButtons 
            onAddAttachment={onAddAttachment} 
            disabled={!isLoggedIn || isStreaming}
          />
        </div>
      )}
    </>
  );
};

export default AttachmentArea;
