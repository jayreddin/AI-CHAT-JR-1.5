
import React, { useState, useEffect } from "react";
import { DialogForm } from "@/components/ui/dialog-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, FileText, Image, Code, Search, Download } from "lucide-react";
import { toast } from 'sonner';

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
  const [siteInfo, setSiteInfo] = useState<{icon?: string, title?: string, description?: string} | null>(null);
  const [extractedContent, setExtractedContent] = useState<string | null>(null);
  const [extractedImages, setExtractedImages] = useState<string[]>([]);
  const [extractedCode, setExtractedCode] = useState<{language: string, content: string}[]>([]);
  
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      loadUrl();
    }
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
    setSiteInfo(null);
    
    try {
      // In a real implementation, we would fetch the content of the URL here
      // For this demo, we'll simulate loading with timeout and fake data
      setTimeout(() => {
        // Simulate getting website metadata
        const domain = new URL(formattedUrl).hostname;
        setSiteInfo({
          icon: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
          title: domain.charAt(0).toUpperCase() + domain.slice(1).split('.')[0] + " Website",
          description: `This is a preview of ${domain}. Website content would be displayed here.`
        });
        
        setPreview(`Preview of ${formattedUrl}`);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setPreview(`Error loading ${formattedUrl}`);
      setIsLoading(false);
      toast.error("Failed to load URL");
    }
  };

  const handleScrapeWebpage = () => {
    if (!url) return;
    
    // Show a toast since this is just a demo
    toast.success(`Webpage scraped: ${url}`);
    
    // In a real implementation, we would show the scraped content
    // For this demo, we'll just close the dialog
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
    setIsLoading(true);
    
    // Simulate extraction process
    setTimeout(() => {
      if (type === 'text') {
        // Simulate extracted text
        setExtractedContent(`
# Extracted Content from ${url}

## Main Heading
This is the main content of the webpage. The extraction process has removed all unnecessary elements like navigation menus, advertisements, and other distractions.

## Secondary Heading
* List item 1
* List item 2
* List item 3

## Footer Content
Copyright information and other footer text would appear here.
        `);
      } else if (type === 'images') {
        // Simulate extracted images
        setExtractedImages([
          'https://picsum.photos/id/1/400/300',
          'https://picsum.photos/id/2/400/300',
          'https://picsum.photos/id/3/400/300',
          'https://picsum.photos/id/4/400/300',
          'https://picsum.photos/id/5/400/300',
        ]);
      } else if (type === 'code') {
        // Simulate extracted code
        setExtractedCode([
          {
            language: 'html',
            content: '<!DOCTYPE html>\n<html>\n<head>\n  <title>Example Page</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>'
          },
          {
            language: 'css',
            content: 'body {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 20px;\n}'
          },
          {
            language: 'javascript',
            content: 'document.addEventListener("DOMContentLoaded", function() {\n  console.log("Page loaded");\n});'
          }
        ]);
      }
      
      setIsLoading(false);
    }, 1500);
  };

  const saveExtractedImage = (imageUrl: string) => {
    // In a real implementation, we would download the image
    // For this demo, just show a toast
    toast.success("Image saved successfully");
  };

  const saveExtractedCode = (code: string, language: string) => {
    // In a real implementation, we would download the code file
    // For this demo, just show a toast
    toast.success(`${language.toUpperCase()} code saved successfully`);
  };

  useEffect(() => {
    if (showExtractOptions) {
      handleExtractType(extractTab);
    }
  }, [extractTab]);

  return (
    <DialogForm
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          setShowExtractOptions(false);
          setExtractedContent(null);
          setExtractedImages([]);
          setExtractedCode([]);
        }
        onOpenChange(value);
      }}
      title="Web URL"
      description="Add a web URL to your chat"
    >
      {!showExtractOptions ? (
        <div className="space-y-4">
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Enter URL"
                value={url}
                onChange={handleUrlChange}
                onKeyDown={handleKeyDown}
                className="pl-8"
              />
            </div>
            <Button onClick={loadUrl} disabled={!url || isLoading}>
              {isLoading ? "Loading..." : "Load"}
            </Button>
          </div>
          
          {preview && (
            <div className="border rounded-md p-4 h-40 overflow-y-auto">
              {siteInfo ? (
                <div className="flex items-start">
                  {siteInfo.icon && (
                    <img src={siteInfo.icon} alt="Site icon" className="w-10 h-10 mr-3" />
                  )}
                  <div>
                    <h3 className="font-medium text-primary">{siteInfo.title}</h3>
                    <p className="text-sm text-muted-foreground">{siteInfo.description}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center text-primary">
                  <Globe className="mr-2" size={16} />
                  <span>{preview}</span>
                </div>
              )}
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
            
            <TabsContent value="text" className="min-h-[300px]">
              {isLoading ? (
                <div className="flex justify-center items-center h-[300px]">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : extractedContent ? (
                <div className="border rounded p-4 max-h-[300px] overflow-y-auto">
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-sm">{extractedContent}</pre>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(extractedContent);
                        toast.success("Content copied to clipboard");
                      }}
                    >
                      Copy to Clipboard
                    </Button>
                  </div>
                </div>
              ) : null}
            </TabsContent>
            
            <TabsContent value="images" className="min-h-[300px]">
              {isLoading ? (
                <div className="flex justify-center items-center h-[300px]">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : extractedImages.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 max-h-[300px] overflow-y-auto p-2">
                  {extractedImages.map((img, idx) => (
                    <div key={idx} className="relative group overflow-hidden rounded-md">
                      <img src={img} alt={`Extracted ${idx}`} className="w-full h-auto rounded-md" />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Button size="sm" onClick={() => saveExtractedImage(img)}>
                          <Download size={16} className="mr-1" /> Save
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </TabsContent>
            
            <TabsContent value="code" className="min-h-[300px]">
              {isLoading ? (
                <div className="flex justify-center items-center h-[300px]">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : extractedCode.length > 0 ? (
                <div className="space-y-4 max-h-[300px] overflow-y-auto">
                  {extractedCode.map((code, idx) => (
                    <div key={idx} className="border rounded">
                      <div className="flex justify-between items-center px-3 py-2 bg-muted">
                        <span className="font-mono text-sm font-medium">{code.language}</span>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => saveExtractedCode(code.content, code.language)}
                        >
                          <Download size={16} className="mr-1" /> Save
                        </Button>
                      </div>
                      <pre className="p-3 overflow-x-auto text-sm max-h-[200px]">
                        <code>{code.content}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              ) : null}
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setShowExtractOptions(false)}
            >
              Back
            </Button>
            <Button onClick={() => {
              if (extractTab === 'text' && extractedContent) {
                onAddToChat(extractedContent);
                onOpenChange(false);
              } else {
                toast.info(`${extractTab} content added to context`);
                onOpenChange(false);
              }
            }}>
              Add to Chat
            </Button>
          </div>
        </div>
      )}
    </DialogForm>
  );
}
