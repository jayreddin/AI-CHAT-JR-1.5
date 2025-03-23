
import { useState, useEffect } from 'react';

export const useToolbarDialogs = () => {
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  
  // Function to open a specific dialog
  const openDialogHandler = (dialogName: string) => {
    setOpenDialog(dialogName);
  };

  // Function to close the current dialog
  const closeDialogHandler = () => {
    setOpenDialog(null);
  };

  // Close dialog when ESC key is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && openDialog) {
        closeDialogHandler();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openDialog]);
  
  return {
    openDialog,
    openDialogHandler,
    closeDialogHandler
  };
};

export default useToolbarDialogs;
