
import React, { useState } from "react";
import { DialogForm } from "@/components/ui/dialog-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Copy, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface KnowledgeBaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface KnowledgeItem {
  id: string;
  name: string;
  content: string;
}

export function KnowledgeBaseDialog({ 
  open, 
  onOpenChange, 
}: KnowledgeBaseDialogProps) {
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([]);
  const [callName, setCallName] = useState("");
  const [textContent, setTextContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentTab, setCurrentTab] = useState("text");

  const handleAddTextKnowledge = () => {
    if (callName && textContent) {
      const name = callName.startsWith("!") ? callName : `!${callName}`;
      setKnowledgeItems([...knowledgeItems, {
        id: Date.now().toString(),
        name,
        content: textContent
      }]);
      setCallName("");
      setTextContent("");
      setCurrentTab("list");
    }
  };

  const handleAddFileKnowledge = () => {
    if (callName && selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const name = callName.startsWith("!") ? callName : `!${callName}`;
        setKnowledgeItems([...knowledgeItems, {
          id: Date.now().toString(),
          name,
          content: e.target?.result as string
        }]);
        setCallName("");
        setSelectedFile(null);
        setCurrentTab("list");
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleDeleteItem = (id: string) => {
    setKnowledgeItems(knowledgeItems.filter(item => item.id !== id));
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <DialogForm
      open={open}
      onOpenChange={onOpenChange}
      title="Knowledge Base"
      description="Add and manage your knowledge base items"
    >
      <Tabs defaultValue="list" value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="list">Knowledge List</TabsTrigger>
          <TabsTrigger value="text">Add Text</TabsTrigger>
          <TabsTrigger value="upload">Upload File</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-4">
          {knowledgeItems.length === 0 ? (
            <p className="text-center text-muted-foreground p-4">
              No knowledge base items found
            </p>
          ) : (
            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {knowledgeItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FileText size={18} />
                    <span className="text-sm font-medium truncate">{item.name}</span>
                  </div>
                  <div className="flex items-center">
                    <button 
                      onClick={() => handleCopyToClipboard(item.name)}
                      className="p-1 text-gray-500 hover:text-gray-700"
                      title="Copy call name"
                    >
                      <Copy size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1 text-gray-500 hover:text-red-500"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="text" className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="call-name-text">Call Name</Label>
              <Input 
                id="call-name-text" 
                placeholder="knowledge_name"
                value={callName}
                onChange={(e) => setCallName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use !{callName || "knowledge_name"} in chat to reference this knowledge
              </p>
            </div>
            
            <div>
              <Label htmlFor="content-text">Content</Label>
              <Textarea 
                id="content-text" 
                placeholder="Enter your knowledge content here..."
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                className="min-h-[150px]"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentTab("list")}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleAddTextKnowledge}
                disabled={!callName || !textContent}
              >
                Add to Knowledge Base
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="upload" className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="call-name-file">Call Name</Label>
              <Input 
                id="call-name-file" 
                placeholder="knowledge_name"
                value={callName}
                onChange={(e) => setCallName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use !{callName || "knowledge_name"} in chat to reference this knowledge
              </p>
            </div>
            
            <div>
              <Label htmlFor="file-upload-kb">File</Label>
              <Input 
                id="file-upload-kb" 
                type="file"
                accept=".txt,.md,.json"
                onChange={handleFileChange}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentTab("list")}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleAddFileKnowledge}
                disabled={!callName || !selectedFile}
              >
                Add to Knowledge Base
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DialogForm>
  );
}
