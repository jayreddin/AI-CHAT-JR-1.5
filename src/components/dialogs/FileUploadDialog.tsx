
import React, { useState } from "react";
import { DialogForm } from "@/components/ui/dialog-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FileText, History, X } from "lucide-react";

interface FileUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (file: string, fileName: string) => void;
}

export function FileUploadDialog({ 
  open, 
  onOpenChange, 
  onSubmit 
}: FileUploadDialogProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [showHistory, setShowHistory] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{name: string, content: string}[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onSubmit(selectedFile, fileName);
      // Save to history
      setUploadedFiles([...uploadedFiles, {name: fileName, content: selectedFile}]);
      onOpenChange(false);
      setSelectedFile(null);
      setFileName("");
    }
  };

  const selectFromHistory = (content: string, name: string) => {
    setSelectedFile(content);
    setFileName(name);
    setShowHistory(false);
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
            disabled={!selectedFile}
          >
            Submit
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
            <div className="flex items-center justify-between p-2 border rounded">
              <div className="flex items-center gap-2">
                <FileText size={18} />
                <span className="text-sm font-medium">{fileName}</span>
              </div>
              <button 
                onClick={() => { setSelectedFile(null); setFileName(""); }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowHistory(false)}
          >
            Back to Upload
          </Button>
          
          <div className="max-h-[300px] overflow-y-auto space-y-2">
            {uploadedFiles.length === 0 ? (
              <p className="text-center text-muted-foreground p-4">
                No upload history found
              </p>
            ) : (
              uploadedFiles.map((file, i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-between p-2 border rounded cursor-pointer hover:bg-accent"
                  onClick={() => selectFromHistory(file.content, file.name)}
                >
                  <div className="flex items-center gap-2">
                    <FileText size={18} />
                    <span className="text-sm font-medium">{file.name}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </DialogForm>
  );
}
