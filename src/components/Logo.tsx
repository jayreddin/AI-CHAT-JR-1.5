
import React, { useState } from 'react';
import MobileQRDialog from './MobileQRDialog';

const Logo: React.FC = () => {
  const [showQRDialog, setShowQRDialog] = useState(false);
  
  return (
    <>
      <button 
        className="app-logo"
        onClick={() => setShowQRDialog(true)}
        title="Open Mobile QR"
      >
        <span className="app-logo-top">JR AI</span>
        <span className="app-logo-bottom">Chat</span>
      </button>
      
      <MobileQRDialog
        open={showQRDialog}
        onOpenChange={setShowQRDialog}
      />
    </>
  );
};

export default Logo;
