
import React from 'react';
import { HistoryDialog } from '@/components/dialogs/HistoryDialog';
import { ImageUploadDialog } from '@/components/dialogs/ImageUploadDialog';
import { FileUploadDialog } from '@/components/dialogs/FileUploadDialog';
import { KnowledgeBaseDialog } from '@/components/dialogs/KnowledgeBaseDialog';
import { WebUrlDialog } from '@/components/dialogs/WebUrlDialog';
import { ToolsDialog } from '@/components/dialogs/ToolsDialog';
import { MCPServerDialog } from '@/components/dialogs/MCPServerDialog';
import { AIAgentsDialog } from '@/components/dialogs/AIAgentsDialog';
import { BrowserControlDialog } from '@/components/dialogs/BrowserControlDialog';
import { SettingsDialog } from '@/components/dialogs/SettingsDialog';
import { ImageGenerationDialog } from '@/components/dialogs/ImageGenerationDialog';
import { toast } from 'sonner';

interface ToolbarDialogsProps {
  openDialog: string | null;
  closeDialogHandler: () => void;
  refreshCounts: () => void;
}

const ToolbarDialogs: React.FC<ToolbarDialogsProps> = ({ 
  openDialog, 
  closeDialogHandler,
  refreshCounts
}) => {
  // Handle image upload
  const handleImageUpload = (imageData: string, isBase64: boolean) => {
    console.log('Image uploaded:', isBase64 ? 'Base64 format' : 'URL format');
    toast.success('Image added to context');
    // In a real implementation, we would store this image and attach it to the next message
  };

  // Handle file upload
  const handleFileUpload = (fileData: string, fileName: string) => {
    console.log('File uploaded:', fileName);
    toast.success('File added to context');
    // In a real implementation, we would store this file and attach it to the next message
  };

  // Handle web URL content
  const handleAddWebContent = (content: string) => {
    console.log('Web content added:', content);
    toast.success('Web content added to chat');
    // In a real implementation, we would process the web content accordingly
  };

  const handleDialogClose = () => {
    closeDialogHandler();
    refreshCounts();
  };

  return (
    <>
      <HistoryDialog 
        open={openDialog === 'history'} 
        onOpenChange={(open) => open ? null : handleDialogClose()} 
      />
      
      <ImageUploadDialog 
        open={openDialog === 'image'} 
        onOpenChange={(open) => open ? null : handleDialogClose()} 
        onSubmit={handleImageUpload}
      />
      
      <FileUploadDialog 
        open={openDialog === 'file'} 
        onOpenChange={(open) => open ? null : handleDialogClose()} 
        onSubmit={handleFileUpload}
      />
      
      <KnowledgeBaseDialog 
        open={openDialog === 'knowledge'} 
        onOpenChange={(open) => open ? null : handleDialogClose()} 
      />
      
      <WebUrlDialog 
        open={openDialog === 'weburl'} 
        onOpenChange={(open) => open ? null : handleDialogClose()} 
        onAddToChat={handleAddWebContent}
      />

      <ToolsDialog
        open={openDialog === 'tools'}
        onOpenChange={(open) => open ? null : handleDialogClose()}
      />

      <MCPServerDialog
        open={openDialog === 'mcp'}
        onOpenChange={(open) => open ? null : handleDialogClose()}
      />

      <AIAgentsDialog
        open={openDialog === 'agents'}
        onOpenChange={(open) => open ? null : handleDialogClose()}
      />

      <BrowserControlDialog
        open={openDialog === 'browser'}
        onOpenChange={(open) => open ? null : handleDialogClose()}
      />

      <SettingsDialog
        open={openDialog === 'settings'}
        onOpenChange={(open) => open ? null : handleDialogClose()}
      />

      <ImageGenerationDialog
        open={openDialog === 'imagegeneration'}
        onOpenChange={(open) => open ? null : handleDialogClose()}
      />
    </>
  );
};

export default ToolbarDialogs;
