
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ChatBubble from '@/components/ChatBubble';
import ChatInput from '@/components/ChatInput';
import Toolbar from '@/components/Toolbar';
import Footer from '@/components/Footer';
import AttachmentPreview from '@/components/AttachmentPreview';
import { useChat } from '@/context/ChatContext';
import { useAttachments } from '@/hooks/useAttachments';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const { currentChat, showToolbar, toggleToolbar } = useChat();
  const [initialized, setInitialized] = useState(false);
  const isMobile = useIsMobile();
  const {
    attachments,
    previewAttachment,
    addAttachment,
    removeAttachment,
    clearAttachments,
    showPreview,
    closePreview,
    nextPreview,
    prevPreview
  } = useAttachments();

  // Check if Puter.js is loaded
  useEffect(() => {
    const checkPuter = () => {
      if (window.puter) {
        setInitialized(true);
      } else {
        setTimeout(checkPuter, 100);
      }
    };

    checkPuter();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />
      
      <div 
        className="flex-1 overflow-hidden flex flex-col p-2 md:p-4"
        onClick={() => !showToolbar && toggleToolbar()}
      >
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto hide-scrollbar p-2 flex flex-col-reverse">
          {currentChat?.messages.map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))}
          
          {currentChat?.messages.length === 0 && (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center max-w-md">
                <h2 className="text-xl font-semibold mb-2">Welcome to AI Chat</h2>
                <p className="text-sm text-gray-600">
                  Start a conversation with your selected AI model. You can ask questions, get help with tasks, or just chat.
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Toolbar */}
        <div className="my-2 md:my-4 relative z-10">
          <Toolbar show={showToolbar} />
        </div>
        
        {/* Attachment preview */}
        <AttachmentPreview 
          attachments={attachments}
          previewAttachment={previewAttachment}
          onRemove={removeAttachment}
          onPreview={showPreview}
          onClosePreview={closePreview}
          onNextPreview={nextPreview}
          onPrevPreview={prevPreview}
        />
        
        {/* Chat input */}
        <div className="mt-auto">
          <ChatInput 
            attachments={attachments}
            onAddAttachment={addAttachment}
            onClearAttachments={clearAttachments}
          />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
