
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useChat } from '@/context/chat/ChatProvider';
import { AIModel } from '@/types/chat';

const ModelSelector: React.FC = () => {
  const { currentModel, setModel, AVAILABLE_MODELS } = useChat();

  return (
    <div className="w-auto mx-auto">
      <Select
        value={currentModel.id}
        onValueChange={(id) => {
          const model = AVAILABLE_MODELS.find((m) => m.id === id);
          if (model) setModel(model);
        }}
      >
        <SelectTrigger
          className="h-9 border-none bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-0 text-center model-selector-trigger text-base md:text-lg font-medium"
        >
          <SelectValue placeholder="Select Model" className="select-value-center" />
        </SelectTrigger>
        <SelectContent className="model-selector-content">
          {AVAILABLE_MODELS.map((model) => (
            <SelectItem
              key={model.id}
              value={model.id || "default-model"} // Ensure value is never empty
              className="model-selector-item"
            >
              {model.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ModelSelector;
