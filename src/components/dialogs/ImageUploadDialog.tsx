
import React, { useState, useEffect } from "react";
import { DialogForm } from "@/components/ui/dialog-form";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, X, History } from "lucide-react";
import { toast } from 'sonner';

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
      try {
        const history = localStorage.getItem('image-upload-history');
        if (history) {
          setImageHistory(JSON.parse(history));
        }
      } catch (error) {
        console.error("Error loading image history:", error);
      }
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
        toast.error("Error reading image file");
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
      
      const updatedHistory = [...imageHistory, newHistoryItem];
      setImageHistory(updatedHistory);
      
      // Save to localStorage
      localStorage.setItem('image-upload-history', JSON.stringify(updatedHistory));
      
      // Reset and close
      onOpenChange(false);
      setSelectedImage(null);
      toast.success(`Image added${isBase64 ? ' as Base64' : ''}`);
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
            <div className="relative">
              <button 
                onClick={clearSelection}
                className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
              >
                <X size={16} />
              </button>
              <img 
                src={selectedImage} 
                alt="Selected" 
                className="max-h-[200px] rounded-md mx-auto"
              />
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
          
          <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto">
            {imageHistory.length === 0 ? (
              <p className="text-center text-muted-foreground p-4 col-span-3">
                No image history found
              </p>
            ) : (
              imageHistory.map((item, i) => (
                <div 
                  key={i} 
                  className="relative cursor-pointer group"
                  onClick={() => selectFromHistory(item)}
                >
                  <img 
                    src={item.content} 
                    alt={`History item ${i}`} 
                    className="h-24 w-full object-cover rounded border border-gray-200"
                  />
                  {item.isBase64 && (
                    <div className="absolute top-0 left-0 bg-blue-500 text-white text-[8px] px-1 py-0.5">
                      B64
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {new Date(item.timestamp).toLocaleDateString()}
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
