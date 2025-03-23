
import React from "react";
import { Button } from "@/components/ui/button";
import { X, History } from "lucide-react";

interface HistoryItem {
  content: string;
  isBase64?: boolean;
  timestamp: number;
  name?: string;
}

interface UploadHistoryListProps {
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onBack: () => void;
  type: 'image' | 'file';
}

export function UploadHistoryList({ 
  items, 
  onSelect, 
  onBack,
  type
}: UploadHistoryListProps) {
  return (
    <div className="space-y-3">
      <Button 
        variant="outline" 
        size="sm"
        onClick={onBack}
      >
        Back to Upload
      </Button>
      
      <div className={`${type === 'image' ? 'grid grid-cols-3 gap-2' : 'space-y-2'} max-h-[300px] overflow-y-auto`}>
        {items.length === 0 ? (
          <p className="text-center text-muted-foreground p-4 col-span-3">
            No {type} history found
          </p>
        ) : (
          type === 'image' ? (
            items.map((item, i) => (
              <div 
                key={i} 
                className="relative cursor-pointer group"
                onClick={() => onSelect(item)}
              >
                <img 
                  src={item.content} 
                  alt={`History item ${i}`} 
                  className="h-24 w-full object-cover rounded border border-gray-200"
                />
                {item.isBase64 && (
                  <div className="absolute top-0 left-0 bg-blue-500 text-white text-[8px] px-1 py-0.5">
                    B64
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {new Date(item.timestamp).toLocaleDateString()}
                </div>
              </div>
            ))
          ) : (
            items.map((item, i) => (
              <div 
                key={i} 
                className="flex items-center justify-between p-2 border rounded cursor-pointer hover:bg-accent"
                onClick={() => onSelect(item)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{item.name || `File ${i + 1}`}</span>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(item.timestamp).toLocaleDateString()}
                </span>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
}
