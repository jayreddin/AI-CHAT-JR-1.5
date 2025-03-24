
import { useState, useEffect } from 'react';
import { loadFromStorage, saveToStorage } from '@/utils/storage';

export interface KnowledgeFile {
  name: string;
  content: string;
  timestamp: number;
  folderId?: string;
}

export interface KnowledgeFolder {
  id: string;
  name: string;
  timestamp: number;
}

export const useKnowledgeBase = () => {
  const [knowledgeFiles, setKnowledgeFiles] = useState<KnowledgeFile[]>([]);
  const [folders, setFolders] = useState<KnowledgeFolder[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Load knowledge base files and folders from localStorage
  useEffect(() => {
    const savedFiles = loadFromStorage<KnowledgeFile[]>('knowledge-base-files', []);
    const savedFolders = loadFromStorage<KnowledgeFolder[]>('knowledge-base-folders', []);
    
    if (savedFiles.length === 0) {
      // Add some example files for testing if no files exist
      const exampleFiles: KnowledgeFile[] = [
        { 
          name: 'example1.txt', 
          content: 'This is example 1 content',
          timestamp: Date.now() 
        },
        { 
          name: 'example2.txt', 
          content: 'This is example 2 content', 
          timestamp: Date.now() - 1000 * 60 * 60  // 1 hour ago
        },
        { 
          name: 'notes.txt', 
          content: 'These are some important notes', 
          timestamp: Date.now() - 1000 * 60 * 60 * 24  // 1 day ago
        }
      ];
      setKnowledgeFiles(exampleFiles);
      saveToStorage('knowledge-base-files', exampleFiles);
    } else {
      setKnowledgeFiles(savedFiles);
    }
    
    if (savedFolders.length === 0) {
      // Add some example folders for testing if no folders exist
      const exampleFolders: KnowledgeFolder[] = [
        {
          id: 'folder-1',
          name: 'General',
          timestamp: Date.now()
        },
        {
          id: 'folder-2',
          name: 'Research',
          timestamp: Date.now() - 1000 * 60 * 30 // 30 minutes ago
        }
      ];
      setFolders(exampleFolders);
      saveToStorage('knowledge-base-folders', exampleFolders);
    } else {
      setFolders(savedFolders);
    }
    
    setIsLoaded(true);
  }, []);
  
  // Add a new file to the knowledge base
  const addKnowledgeFile = (name: string, content: string, folderId?: string) => {
    const newFile = {
      name,
      content,
      timestamp: Date.now(),
      folderId
    };
    
    const updatedFiles = [...knowledgeFiles, newFile];
    setKnowledgeFiles(updatedFiles);
    saveToStorage('knowledge-base-files', updatedFiles);
    
    return newFile;
  };
  
  // Add a new folder to the knowledge base
  const addFolder = (name: string) => {
    const newFolder = {
      id: `folder-${Date.now()}`,
      name,
      timestamp: Date.now()
    };
    
    const updatedFolders = [...folders, newFolder];
    setFolders(updatedFolders);
    saveToStorage('knowledge-base-folders', updatedFolders);
    
    return newFolder;
  };
  
  // Remove a file from the knowledge base
  const removeKnowledgeFile = (name: string) => {
    const updatedFiles = knowledgeFiles.filter(file => file.name !== name);
    setKnowledgeFiles(updatedFiles);
    saveToStorage('knowledge-base-files', updatedFiles);
  };
  
  // Remove a folder from the knowledge base
  const removeFolder = (id: string) => {
    // Remove the folder
    const updatedFolders = folders.filter(folder => folder.id !== id);
    setFolders(updatedFolders);
    saveToStorage('knowledge-base-folders', updatedFolders);
    
    // Move files from this folder to no folder (root)
    const updatedFiles = knowledgeFiles.map(file => 
      file.folderId === id ? { ...file, folderId: undefined } : file
    );
    setKnowledgeFiles(updatedFiles);
    saveToStorage('knowledge-base-files', updatedFiles);
  };
  
  // Update a file in the knowledge base
  const updateKnowledgeFile = (name: string, content: string, folderId?: string) => {
    const updatedFiles = knowledgeFiles.map(file => 
      file.name === name ? { ...file, content, timestamp: Date.now(), folderId } : file
    );
    
    setKnowledgeFiles(updatedFiles);
    saveToStorage('knowledge-base-files', updatedFiles);
  };
  
  // Update a folder in the knowledge base
  const updateFolder = (id: string, name: string) => {
    const updatedFolders = folders.map(folder => 
      folder.id === id ? { ...folder, name, timestamp: Date.now() } : folder
    );
    
    setFolders(updatedFolders);
    saveToStorage('knowledge-base-folders', updatedFolders);
  };
  
  // Move a file to a folder
  const moveFileToFolder = (fileName: string, folderId?: string) => {
    const updatedFiles = knowledgeFiles.map(file => 
      file.name === fileName ? { ...file, folderId } : file
    );
    
    setKnowledgeFiles(updatedFiles);
    saveToStorage('knowledge-base-files', updatedFiles);
  };
  
  // Get a file by name
  const getKnowledgeFile = (name: string) => {
    return knowledgeFiles.find(file => file.name === name);
  };
  
  // Get all files in a folder
  const getFilesInFolder = (folderId?: string) => {
    return knowledgeFiles.filter(file => file.folderId === folderId);
  };
  
  // Search files by partial name
  const searchKnowledgeFiles = (query: string) => {
    if (!query || query.trim() === '') return knowledgeFiles;
    
    const normalizedQuery = query.toLowerCase().trim();
    return knowledgeFiles.filter(file => 
      file.name.toLowerCase().includes(normalizedQuery)
    );
  };
  
  return {
    knowledgeFiles,
    folders,
    isLoaded,
    addKnowledgeFile,
    addFolder,
    removeKnowledgeFile,
    removeFolder,
    updateKnowledgeFile,
    updateFolder,
    moveFileToFolder,
    getKnowledgeFile,
    getFilesInFolder,
    searchKnowledgeFiles
  };
};
