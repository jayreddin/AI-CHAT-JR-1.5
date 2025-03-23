
import React, { useState } from "react";
import { DialogForm } from "@/components/ui/dialog-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, FileText, Image, Code } from "lucide-react";

interface WebUrlDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToChat: (content: string) => void;
}

export function WebUrlDialog({ 
  open, 
  onOpenChange,
  onAddToChat
}: WebUrlDialogProps) {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [extractTab, setExtractTab] = useState<string>("text");
  const [showExtractOptions, setShowExtractOptions] = useState(false);
  
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const loadUrl = async () => {
    if (!url) return;
    
    // Ensure URL has a protocol
    let formattedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      formattedUrl = `https://${url}`;
      setUrl(formattedUrl);
    }
    
    setIsLoading(true);
    setPreview("Loading preview...");
    
    try {
      // In a real implementation, we would fetch the content of the URL here
      // For this demo, we'll just simulate loading with a timeout
      setTimeout(() => {
        setPreview(`Preview of ${formattedUrl}`);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setPreview(`Error loading ${formattedUrl}`);
      setIsLoading(false);
    }
  };

  const handleScrapeWebpage = () => {
    if (!url) return;
    onAddToChat(`Scraped content from: ${url}`);
    onOpenChange(false);
  };

  const handleAddToChat = () => {
    if (!url) return;
    onAddToChat(`URL: ${url}`);
    onOpenChange(false);
  };

  const handleExtract = () => {
    setShowExtractOptions(true);
  };

  const handleExtractType = (type: string) => {
    onAddToChat(`Extracted ${type} from: ${url}`);
    setShowExtractOptions(false);
    onOpenChange(false);
  };

  return (
    <DialogForm
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          setShowExtractOptions(false);
        }
        onOpenChange(value);
      }}
      title="Web URL"
      description="Add a web URL to your chat"
    >
      {!showExtractOptions ? (
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Enter URL"
              value={url}
              onChange={handleUrlChange}
              className="flex-1"
            />
            <Button onClick={loadUrl} disabled={!url || isLoading}>
              Load
            </Button>
          </div>
          
          {preview && (
            <div className="border rounded-md p-4 h-40 overflow-y-auto">
              <div className="flex items-center text-primary">
                <Globe className="mr-2" size={16} />
                <span>{preview}</span>
              </div>
            </div>
          )}
          
          {preview && !isLoading && (
            <div className="flex space-x-2 justify-end">
              <Button variant="outline" onClick={handleScrapeWebpage}>
                Scrape Webpage
              </Button>
              <Button variant="outline" onClick={handleAddToChat}>
                Add to Chat
              </Button>
              <Button variant="outline" onClick={handleExtract}>
                Extract
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="font-medium">Extract from {url}</h3>
          <Tabs defaultValue="text" value={extractTab} onValueChange={setExtractTab}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="text" className="flex items-center">
                <FileText className="mr-2" size={16} />
                Text
              </TabsTrigger>
              <TabsTrigger value="images" className="flex items-center">
                <Image className="mr-2" size={16} />
                Images
              </TabsTrigger>
              <TabsTrigger value="code" className="flex items-center">
                <Code className="mr-2" size={16} />
                Code
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setShowExtractOptions(false)}
            >
              Back
            </Button>
            <Button onClick={() => handleExtractType(extractTab)}>
              Extract {extractTab}
            </Button>
          </div>
        </div>
      )}
    </DialogForm>
  );
}
