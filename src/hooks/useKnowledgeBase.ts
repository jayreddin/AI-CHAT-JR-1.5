
import { useState, useEffect } from 'react';
import { loadFromStorage, saveToStorage } from '@/utils/storage';

export interface KnowledgeFile {
  name: string;
  content: string;
  timestamp: number;
}

export const useKnowledgeBase = () => {
  const [knowledgeFiles, setKnowledgeFiles] = useState<KnowledgeFile[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Load knowledge base files from localStorage
  useEffect(() => {
    const savedFiles = loadFromStorage<KnowledgeFile[]>('knowledge-base-files', []);
    
    if (savedFiles.length === 0) {
      // Add some example files for testing if no files exist
      const exampleFiles = [
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
    
    setIsLoaded(true);
  }, []);
  
  // Add a new file to the knowledge base
  const addKnowledgeFile = (name: string, content: string) => {
    const newFile = {
      name,
      content,
      timestamp: Date.now()
    };
    
    const updatedFiles = [...knowledgeFiles, newFile];
    setKnowledgeFiles(updatedFiles);
    saveToStorage('knowledge-base-files', updatedFiles);
    
    return newFile;
  };
  
  // Remove a file from the knowledge base
  const removeKnowledgeFile = (name: string) => {
    const updatedFiles = knowledgeFiles.filter(file => file.name !== name);
    setKnowledgeFiles(updatedFiles);
    saveToStorage('knowledge-base-files', updatedFiles);
  };
  
  // Update a file in the knowledge base
  const updateKnowledgeFile = (name: string, content: string) => {
    const updatedFiles = knowledgeFiles.map(file => 
      file.name === name ? { ...file, content, timestamp: Date.now() } : file
    );
    
    setKnowledgeFiles(updatedFiles);
    saveToStorage('knowledge-base-files', updatedFiles);
  };
  
  // Get a file by name
  const getKnowledgeFile = (name: string) => {
    return knowledgeFiles.find(file => file.name === name);
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
    isLoaded,
    addKnowledgeFile,
    removeKnowledgeFile,
    updateKnowledgeFile,
    getKnowledgeFile,
    searchKnowledgeFiles
  };
};
