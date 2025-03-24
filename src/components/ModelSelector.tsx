
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
    <div className="w-44 md:w-56">
      <Select
        value={currentModel.id}
        onValueChange={(id) => {
          const model = AVAILABLE_MODELS.find((m) => m.id === id);
          if (model) setModel(model);
        }}
      >
        <SelectTrigger 
          className="h-9 border-none bg-transparent hover:bg-gray-100 focus:ring-0 text-center"
        >
          <SelectValue placeholder="Select Model" />
        </SelectTrigger>
        <SelectContent>
          {AVAILABLE_MODELS.map((model) => (
            <SelectItem
              key={model.id}
              value={model.id}
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
