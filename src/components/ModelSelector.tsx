
import React from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { availableModels } from '@/constants/models';
import { useChat } from '@/context/ChatContext';
import { useIsMobile } from '@/hooks/use-mobile';

const ModelSelector: React.FC = () => {
  const { selectedModel, changeModel } = useChat();
  const isMobile = useIsMobile();

  // Filter models if needed, e.g. by API key restriction, etc.
  const filteredModels = availableModels;

  return (
    <div className="w-full max-w-xs mx-auto">
      <Select value={selectedModel} onValueChange={changeModel}>
        <SelectTrigger 
          className={`
            text-center h-auto py-1.5 px-3 font-medium
            ${isMobile ? 'text-xs' : 'text-sm'}
            bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200
            dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-blue-800
          `}
        >
          <SelectValue placeholder="Select a model" className="text-center" />
        </SelectTrigger>
        <SelectContent className="max-h-80 overflow-y-auto">
          <SelectGroup>
            {filteredModels.map((model) => (
              <SelectItem key={model.id} value={model.id} className="py-2">
                <div className="flex flex-col">
                  <span className="font-medium">{model.name}</span>
                  <span className="text-xs text-muted-foreground">{model.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ModelSelector;
