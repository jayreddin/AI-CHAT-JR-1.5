
import React, { useState, useEffect } from "react";
import { DialogForm } from "@/components/ui/dialog-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FileText, History } from "lucide-react";
import { UploadHistoryList } from "./uploads/UploadHistoryList";
import { UploadPreview } from "./uploads/UploadPreview";
import { loadFromStorage, saveToStorage } from "@/utils/storage";

interface FileUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (file: string, fileName: string) => void;
}

interface FileHistoryItem {
  content: string;
  name: string;
  timestamp: number;
}

const STORAGE_KEY = 'file-upload-history';

export function FileUploadDialog({ 
  open, 
  onOpenChange, 
  onSubmit 
}: FileUploadDialogProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [showHistory, setShowHistory] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load history from localStorage
  useEffect(() => {
    if (open) {
      const history = loadFromStorage<FileHistoryItem[]>(STORAGE_KEY, []);
      setUploadedFiles(history);
    }
  }, [open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoading(true);
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedFile(reader.result as string);
        setIsLoading(false);
      };
      reader.onerror = () => {
        console.error("Error reading file");
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onSubmit(selectedFile, fileName);
      
      // Save to history
      const historyItem: FileHistoryItem = {
        content: selectedFile, 
        name: fileName,
        timestamp: Date.now()
      };
      
      const updatedHistory = [historyItem, ...uploadedFiles.filter(file => file.name !== fileName)].slice(0, 30);
      setUploadedFiles(updatedHistory);
      
      // Save to localStorage
      saveToStorage(STORAGE_KEY, updatedHistory);
      
      // Reset and close
      onOpenChange(false);
      setSelectedFile(null);
      setFileName("");
    }
  };

  const selectFromHistory = (item: FileHistoryItem) => {
    setSelectedFile(item.content);
    setFileName(item.name);
    setShowHistory(false);
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setFileName("");
  };

  return (
    <DialogForm
      open={open}
      onOpenChange={onOpenChange}
      title="Upload File"
      description="Upload a file to include in your chat"
      footerActions={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedFile || isLoading}
          >
            {isLoading ? "Loading..." : "Submit"}
          </Button>
        </>
      }
    >
      {!showHistory ? (
        <div className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="file-upload">File</Label>
            <Input 
              id="file-upload" 
              type="file"
              onChange={handleFileChange} 
            />
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex gap-1 items-center"
            onClick={() => setShowHistory(true)}
          >
            <History size={16} /> View History
          </Button>
          
          {selectedFile && (
            <UploadPreview 
              type="file"
              content={selectedFile}
              name={fileName}
              onClear={clearSelection}
            />
          )}
        </div>
      ) : (
        <UploadHistoryList 
          items={uploadedFiles}
          onSelect={(item) => selectFromHistory(item as FileHistoryItem)}
          onBack={() => setShowHistory(false)}
          type="file"
        />
      )}
    </DialogForm>
  );
}
