
import React, { useState, useEffect } from "react";
import { DialogForm } from "@/components/ui/dialog-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Copy, Trash2, FolderPlus, Folder, ChevronRight, ChevronDown, Edit } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useKnowledgeBase, KnowledgeFile, KnowledgeFolder } from "@/hooks/useKnowledgeBase";

interface KnowledgeBaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function KnowledgeBaseDialog({ 
  open, 
  onOpenChange, 
}: KnowledgeBaseDialogProps) {
  const {
    knowledgeFiles,
    folders,
    addKnowledgeFile,
    addFolder,
    removeKnowledgeFile,
    removeFolder,
    updateKnowledgeFile,
    getFilesInFolder
  } = useKnowledgeBase();
  
  const [currentTab, setCurrentTab] = useState("list");
  const [callName, setCallName] = useState("");
  const [textContent, setTextContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>(undefined);
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [editingFile, setEditingFile] = useState<KnowledgeFile | null>(null);

  const handleAddTextKnowledge = () => {
    if (callName && textContent) {
      const name = callName.startsWith("@") ? callName : `@${callName}`;
      
      if (editingFile) {
        // Update existing file
        updateKnowledgeFile(editingFile.name, textContent, selectedFolderId);
        toast.success(`Updated knowledge file: ${name}`);
      } else {
        // Add new file
        addKnowledgeFile(name, textContent, selectedFolderId);
        toast.success(`Added new knowledge file: ${name}`);
      }
      
      // Reset form
      setCallName("");
      setTextContent("");
      setSelectedFolderId(undefined);
      setEditingFile(null);
      setCurrentTab("list");
    }
  };

  const handleAddFileKnowledge = () => {
    if (callName && selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const name = callName.startsWith("@") ? callName : `@${callName}`;
        addKnowledgeFile(name, e.target?.result as string, selectedFolderId);
        toast.success(`Added new knowledge file: ${name}`);
        
        // Reset form
        setCallName("");
        setSelectedFile(null);
        setSelectedFolderId(undefined);
        setCurrentTab("list");
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      addFolder(newFolderName);
      toast.success(`Created folder: ${newFolderName}`);
      setNewFolderName("");
    }
  };

  const handleDeleteItem = (id: string) => {
    removeKnowledgeFile(id);
    toast.success(`Removed knowledge file: ${id}`);
  };

  const handleDeleteFolder = (id: string) => {
    removeFolder(id);
    toast.success("Folder removed. Files moved to root.");
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const toggleFolderExpanded = (folderId: string) => {
    setExpandedFolders(prev => 
      prev.includes(folderId) 
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };

  const handleEditFile = (file: KnowledgeFile) => {
    setEditingFile(file);
    setCallName(file.name.startsWith("@") ? file.name.slice(1) : file.name);
    setTextContent(file.content);
    setSelectedFolderId(file.folderId);
    setCurrentTab("text");
  };

  // Render files and folders in a tree structure
  const renderFileList = () => {
    // Render root level files first (no folder)
    const rootFiles = getFilesInFolder(undefined);
    
    return (
      <div className="max-h-[300px] overflow-y-auto space-y-2">
        {/* Folders first */}
        {folders.map((folder) => {
          const isExpanded = expandedFolders.includes(folder.id);
          const folderFiles = getFilesInFolder(folder.id);
          
          return (
            <div key={folder.id} className="border rounded">
              <div 
                className="flex items-center justify-between p-2 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleFolderExpanded(folder.id)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </span>
                  <Folder size={16} className="text-blue-500" />
                  <span className="text-sm font-medium">{folder.name}</span>
                  <span className="text-xs text-gray-500">({folderFiles.length})</span>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFolder(folder.id);
                  }}
                  className="p-1 text-gray-500 hover:text-red-500"
                  title="Delete folder"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              
              {isExpanded && folderFiles.length > 0 && (
                <div className="pl-8 pr-2 pb-2 space-y-1 border-t pt-1">
                  {folderFiles.map((file) => (
                    <div key={file.name} className="flex items-center justify-between p-1 border-b border-gray-100">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <FileText size={14} className="text-gray-600" />
                        <span className="text-sm truncate">{file.name}</span>
                      </div>
                      <div className="flex items-center">
                        <button 
                          onClick={() => handleEditFile(file)}
                          className="p-1 text-gray-500 hover:text-blue-500"
                          title="Edit file"
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          onClick={() => handleCopyToClipboard(file.name)}
                          className="p-1 text-gray-500 hover:text-gray-700"
                          title="Copy call name"
                        >
                          <Copy size={14} />
                        </button>
                        <button 
                          onClick={() => handleDeleteItem(file.name)}
                          className="p-1 text-gray-500 hover:text-red-500"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        
        {/* Root files */}
        {rootFiles.length > 0 && (
          <div className="border rounded p-2">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={16} className="text-gray-500" />
              <span className="text-sm font-medium">Files</span>
            </div>
            <div className="space-y-1">
              {rootFiles.map((file) => (
                <div key={file.name} className="flex items-center justify-between p-1 border-b border-gray-100">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FileText size={14} className="text-gray-600" />
                    <span className="text-sm truncate">{file.name}</span>
                  </div>
                  <div className="flex items-center">
                    <button 
                      onClick={() => handleEditFile(file)}
                      className="p-1 text-gray-500 hover:text-blue-500"
                      title="Edit file"
                    >
                      <Edit size={14} />
                    </button>
                    <button 
                      onClick={() => handleCopyToClipboard(file.name)}
                      className="p-1 text-gray-500 hover:text-gray-700"
                      title="Copy call name"
                    >
                      <Copy size={14} />
                    </button>
                    <button 
                      onClick={() => handleDeleteItem(file.name)}
                      className="p-1 text-gray-500 hover:text-red-500"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {folders.length === 0 && rootFiles.length === 0 && (
          <p className="text-center text-muted-foreground p-4">
            No knowledge base items found
          </p>
        )}
        
        {/* Add folder button */}
        <div className="flex items-center gap-2 mt-2">
          <Input
            placeholder="New folder name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            className="text-sm"
          />
          <Button 
            size="sm" 
            onClick={handleAddFolder} 
            disabled={!newFolderName.trim()}
            className="whitespace-nowrap"
          >
            <FolderPlus size={16} className="mr-1" />
            Add Folder
          </Button>
        </div>
      </div>
    );
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
          {renderFileList()}
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
                Use @{callName || "knowledge_name"} in chat to reference this knowledge
              </p>
            </div>
            
            <div>
              <Label htmlFor="folder-select">Folder (Optional)</Label>
              <Select 
                value={selectedFolderId} 
                onValueChange={setSelectedFolderId}
              >
                <SelectTrigger id="folder-select">
                  <SelectValue placeholder="Select a folder" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Root (No folder)</SelectItem>
                  {folders.map(folder => (
                    <SelectItem key={folder.id} value={folder.id}>{folder.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                onClick={() => {
                  setCurrentTab("list"); 
                  setEditingFile(null);
                  setCallName("");
                  setTextContent("");
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleAddTextKnowledge}
                disabled={!callName || !textContent}
              >
                {editingFile ? "Update Knowledge" : "Save to Knowledge Base"}
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
                Use @{callName || "knowledge_name"} in chat to reference this knowledge
              </p>
            </div>
            
            <div>
              <Label htmlFor="folder-select-file">Folder (Optional)</Label>
              <Select 
                value={selectedFolderId} 
                onValueChange={setSelectedFolderId}
              >
                <SelectTrigger id="folder-select-file">
                  <SelectValue placeholder="Select a folder" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Root (No folder)</SelectItem>
                  {folders.map(folder => (
                    <SelectItem key={folder.id} value={folder.id}>{folder.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                Save to Knowledge Base
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DialogForm>
  );
}
