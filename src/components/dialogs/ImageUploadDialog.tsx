
import React, { useState } from "react";
import { DialogForm } from "@/components/ui/dialog-form";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, X } from "lucide-react";

interface ImageUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (image: string, isBase64: boolean) => void;
}

export function ImageUploadDialog({ 
  open, 
  onOpenChange, 
  onSubmit 
}: ImageUploadDialogProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isBase64, setIsBase64] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (selectedImage) {
      onSubmit(selectedImage, isBase64);
      onOpenChange(false);
      setSelectedImage(null);
    }
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
            Submit
          </Button>
        </>
      }
    >
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
        
        <div className="flex items-center space-x-2">
          <Switch 
            id="convert-base64" 
            checked={isBase64} 
            onCheckedChange={setIsBase64} 
          />
          <Label htmlFor="convert-base64">Convert to Base64</Label>
        </div>
        
        {selectedImage && (
          <div className="relative">
            <button 
              onClick={clearSelection}
              className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full"
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
    </DialogForm>
  );
}
