
import { useState } from 'react';

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
  
  return {
    openDialog,
    openDialogHandler,
    closeDialogHandler
  };
};
