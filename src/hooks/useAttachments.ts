
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface Attachment {
  id: string;
  type: 'image' | 'file';
  content: string;
  name: string;
  size: number;
  isBase64?: boolean;
}

export const useAttachments = () => {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(null);

  // Add attachment
  const addAttachment = (attachment: Omit<Attachment, 'id'>) => {
    const newAttachment = {
      ...attachment,
      id: `attachment-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    };
    setAttachments([...attachments, newAttachment]);
    return newAttachment.id;
  };

  // Remove attachment
  const removeAttachment = (id: string) => {
    setAttachments(attachments.filter(attachment => attachment.id !== id));
    if (previewAttachment?.id === id) {
      setPreviewAttachment(null);
    }
  };

  // Clear all attachments
  const clearAttachments = () => {
    setAttachments([]);
    setPreviewAttachment(null);
  };

  // Show preview
  const showPreview = (id: string) => {
    const attachment = attachments.find(a => a.id === id);
    if (attachment) {
      setPreviewAttachment(attachment);
    }
  };

  // Close preview
  const closePreview = () => {
    setPreviewAttachment(null);
  };

  // Next attachment in preview
  const nextPreview = () => {
    if (!previewAttachment) return;
    
    const currentIndex = attachments.findIndex(a => a.id === previewAttachment.id);
    const nextIndex = (currentIndex + 1) % attachments.length;
    setPreviewAttachment(attachments[nextIndex]);
  };

  // Previous attachment in preview
  const prevPreview = () => {
    if (!previewAttachment) return;
    
    const currentIndex = attachments.findIndex(a => a.id === previewAttachment.id);
    const prevIndex = (currentIndex - 1 + attachments.length) % attachments.length;
    setPreviewAttachment(attachments[prevIndex]);
  };

  return {
    attachments,
    previewAttachment,
    addAttachment,
    removeAttachment,
    clearAttachments,
    showPreview,
    closePreview,
    nextPreview,
    prevPreview
  };
};
