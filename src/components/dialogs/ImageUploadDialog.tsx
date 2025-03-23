
import React, { useState, useEffect } from "react";
import { DialogForm } from "@/components/ui/dialog-form";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, History } from "lucide-react";
import { UploadHistoryList } from "./uploads/UploadHistoryList";
import { UploadPreview } from "./uploads/UploadPreview";
import { loadFromStorage, saveToStorage } from "@/utils/storage";

interface ImageUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (image: string, isBase64: boolean) => void;
}

interface ImageHistoryItem {
  content: string;
  isBase64: boolean;
  timestamp: number;
}

const STORAGE_KEY = 'image-upload-history';

export function ImageUploadDialog({ 
  open, 
  onOpenChange, 
  onSubmit 
}: ImageUploadDialogProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isBase64, setIsBase64] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [imageHistory, setImageHistory] = useState<ImageHistoryItem[]>([]);

  // Load image history from localStorage
  useEffect(() => {
    if (open) {
      const history = loadFromStorage<ImageHistoryItem[]>(STORAGE_KEY, []);
      setImageHistory(history);
    }
  }, [open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setIsLoading(false);
      };
      reader.onerror = () => {
        console.error("Error reading image file");
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (selectedImage) {
      onSubmit(selectedImage, isBase64);
      
      // Save to history
      const newHistoryItem: ImageHistoryItem = { 
        content: selectedImage, 
        isBase64, 
        timestamp: Date.now() 
      };
      
      const updatedHistory = [newHistoryItem, ...imageHistory].slice(0, 30); // Limit history to 30 items
      setImageHistory(updatedHistory);
      
      // Save to localStorage
      saveToStorage(STORAGE_KEY, updatedHistory);
      
      // Reset and close
      onOpenChange(false);
      setSelectedImage(null);
    }
  };

  const selectFromHistory = (item: ImageHistoryItem) => {
    setSelectedImage(item.content);
    setIsBase64(item.isBase64);
    setShowHistory(false);
  };

  const clearSelection = () => {
    setSelectedImage(null);
  };

  return (
    <DialogForm
      open={open}
      onOpenChange={onOpenChange}
      title="Upload Image"
      description="Upload an image to include in your chat"
      footerActions={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedImage || isLoading}
          >
            {isLoading ? "Loading..." : "Submit"}
          </Button>
        </>
      }
    >
      {!showHistory ? (
        <div className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="image-upload">Image</Label>
            <Input 
              id="image-upload" 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch 
                id="convert-base64" 
                checked={isBase64} 
                onCheckedChange={setIsBase64} 
              />
              <Label htmlFor="convert-base64">Convert to Base64</Label>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="flex gap-1 items-center"
              onClick={() => setShowHistory(true)}
            >
              <History size={16} /> View History
            </Button>
          </div>
          
          {selectedImage && (
            <UploadPreview 
              type="image"
              content={selectedImage}
              onClear={clearSelection}
              isBase64={isBase64}
            />
          )}
        </div>
      ) : (
        <UploadHistoryList 
          items={imageHistory}
          onSelect={(item) => selectFromHistory(item as ImageHistoryItem)}
          onBack={() => setShowHistory(false)}
          type="image"
        />
      )}
    </DialogForm>
  );
}
