
import React from "react";
import { FileText, X } from "lucide-react";

interface UploadPreviewProps {
  type: 'image' | 'file';
  content: string;
  name?: string;
  onClear: () => void;
  isBase64?: boolean;
}

export function UploadPreview({ 
  type, 
  content, 
  name, 
  onClear,
  isBase64
}: UploadPreviewProps) {
  if (type === 'image') {
    return (
      <div className="relative">
        <button 
          onClick={onClear}
          className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
          aria-label="Clear selection"
        >
          <X size={16} />
        </button>
        {isBase64 && (
          <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-sm">
            B64
          </div>
        )}
        <img 
          src={content} 
          alt="Selected" 
          className="max-h-[200px] rounded-md mx-auto"
        />
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-between p-2 border rounded">
      <div className="flex items-center gap-2">
        <FileText size={18} />
        <span className="text-sm font-medium">{name || "Selected file"}</span>
      </div>
      <button 
        onClick={onClear}
        className="text-gray-500 hover:text-gray-700"
        aria-label="Clear selection"
      >
        <X size={16} />
      </button>
    </div>
  );
}
