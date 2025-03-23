
import React, { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { AIModel } from '@/types/chat';

const ModelSelector: React.FC = () => {
  const { currentModel, setModel, AVAILABLE_MODELS } = useChat();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectModel = (model: AIModel) => {
    setModel(model);
    setIsOpen(false);
  };

  // Safe access to AVAILABLE_MODELS
  const models = AVAILABLE_MODELS || [];

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm max-w-xs"
      >
        <span className="font-medium truncate">{currentModel?.name || 'Select Model'}</span>
        <span className="text-xs text-gray-500 truncate">{currentModel?.provider}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 w-64 py-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-80 overflow-y-auto animation-fade-in">
          {models.map((model) => (
            <div
              key={model.id}
              onClick={() => selectModel(model)}
              className={`flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer ${
                currentModel?.id === model.id ? 'bg-blue-50 text-blue-600' : ''
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{model.name}</div>
                <div className="text-xs text-gray-500 truncate">{model.provider}</div>
              </div>
              {currentModel?.id === model.id && <Check size={16} className="text-blue-600 ml-2 flex-shrink-0" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModelSelector;
