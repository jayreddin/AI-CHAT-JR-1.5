
import React from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AVAILABLE_MODELS } from '@/constants/models';
import { useChat } from '@/context/chat/ChatProvider';
import { useIsMobile } from '@/hooks/use-mobile';

const ModelSelector: React.FC = () => {
  const { currentModel, setModel } = useChat();
  const isMobile = useIsMobile();

  // Filter models if needed
  const filteredModels = AVAILABLE_MODELS;

  return (
    <div className="w-full max-w-xs mx-auto">
      <Select value={currentModel.id} onValueChange={(value) => {
        const model = AVAILABLE_MODELS.find(m => m.id === value);
        if (model) setModel(model);
      }}>
        <SelectTrigger 
          className={`
            model-selector-trigger text-center h-auto py-1.5 px-3
            ${isMobile ? 'text-base' : 'text-xl font-semibold'}
            bg-transparent
          `}
        >
          <SelectValue placeholder="Select a model" className="mx-auto w-full text-center" />
        </SelectTrigger>
        <SelectContent className="model-selector-content">
          <SelectGroup>
            {filteredModels.map((model) => (
              <SelectItem key={model.id} value={model.id} className="py-2 model-selector-item">
                <div className="flex flex-col items-center text-center w-full">
                  <span className="font-medium">{model.name}</span>
                  <span className="text-xs text-muted-foreground">{model.provider}</span>
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
