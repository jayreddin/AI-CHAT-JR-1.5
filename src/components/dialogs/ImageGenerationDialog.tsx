
import React, { useState } from "react";
import { DialogForm } from "@/components/ui/dialog-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ImagePlus, Download, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from 'sonner';

interface ImageGenerationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const IMAGE_SIZES = [
  { value: "256x256", label: "Small (256x256)" },
  { value: "512x512", label: "Medium (512x512)" },
  { value: "1024x1024", label: "Large (1024x1024)" }
];

const IMAGE_COUNTS = [
  { value: "1", label: "1 image" },
  { value: "2", label: "2 images" },
  { value: "3", label: "3 images" },
  { value: "4", label: "4 images" }
];

export function ImageGenerationDialog({ 
  open, 
  onOpenChange 
}: ImageGenerationDialogProps) {
  const [prompt, setPrompt] = useState("");
  const [imageSize, setImageSize] = useState("512x512");
  const [imageCount, setImageCount] = useState("1");
  const [tileMode, setTileMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt description");
      return;
    }

    setIsGenerating(true);
    
    // Mock image generation
    setTimeout(() => {
      // In a real implementation, you would call an API here
      const mockImages = Array(parseInt(imageCount)).fill(0).map((_, i) => 
        `https://picsum.photos/${imageSize.split('x')[0]}?random=${Date.now() + i}`
      );
      setGeneratedImages(mockImages);
      setIsGenerating(false);
      toast.success(`Generated ${imageCount} image${parseInt(imageCount) > 1 ? 's' : ''}`);
    }, 2000);
  };

  const saveImage = (imageUrl: string) => {
    // In a real implementation, you would download the image
    // For now, we'll just open it in a new tab
    window.open(imageUrl, '_blank');
    toast.success("Image saved");
  };

  const clearImages = () => {
    setGeneratedImages([]);
  };

  const showImagePreview = (imageUrl: string) => {
    setPreviewImage(imageUrl);
    setShowPreview(true);
  };

  return (
    <>
      <DialogForm
        open={open}
        onOpenChange={onOpenChange}
        title="Generate Images with AI"
        description="Create images by describing what you want to see"
        footerActions={
          <>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !prompt.trim()}
            >
              {isGenerating ? "Generating..." : "Generate"}
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="prompt">Prompt Description</Label>
            <Input
              id="prompt"
              placeholder="A futuristic city with flying cars and neon lights"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="size">Image Size</Label>
              <Select value={imageSize} onValueChange={setImageSize}>
                <SelectTrigger id="size">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {IMAGE_SIZES.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="count">Number of Images</Label>
              <Select value={imageCount} onValueChange={setImageCount}>
                <SelectTrigger id="count">
                  <SelectValue placeholder="Select count" />
                </SelectTrigger>
                <SelectContent>
                  {IMAGE_COUNTS.map((count) => (
                    <SelectItem key={count.value} value={count.value}>
                      {count.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch 
                id="tile-mode" 
                checked={tileMode} 
                onCheckedChange={setTileMode} 
              />
              <Label htmlFor="tile-mode">Enable Tile Mode (seamless texture)</Label>
            </div>
          </div>

          {generatedImages.length > 0 && (
            <div className="border-t pt-4 mt-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium">Generated Images</h3>
                <Button variant="outline" size="sm" onClick={clearImages}>
                  Clear All
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {generatedImages.map((img, i) => (
                  <div key={i} className="relative group border rounded overflow-hidden">
                    <img 
                      src={img} 
                      alt={`Generated ${i+1}`} 
                      className="w-full aspect-square object-cover cursor-pointer"
                      onClick={() => showImagePreview(img)}
                    />
                    <Button
                      className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      size="icon"
                      variant="ghost"
                      onClick={() => saveImage(img)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogForm>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl p-1 overflow-hidden">
          <div className="relative">
            <img 
              src={previewImage} 
              alt="Preview" 
              className="max-h-[80vh] max-w-full mx-auto"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
              onClick={() => setShowPreview(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute bottom-2 right-2 bg-black/50 text-white hover:bg-black/70"
              onClick={() => saveImage(previewImage)}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
