
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export interface Tool {
  id: string;
  name: string;
  description: string;
  source: string;
  callWord: string;
  installed: boolean;
  active: boolean;
  examples: string[];
  details: string;
}

interface ToolItemProps {
  tool: Tool;
  expandedToolId: string | null;
  toggleToolExpanded: (id: string) => void;
  toggleToolInstalled: (id: string) => void;
  toggleToolActive: (id: string) => void;
}

const ToolItem: React.FC<ToolItemProps> = ({
  tool,
  expandedToolId,
  toggleToolExpanded,
  toggleToolInstalled,
  toggleToolActive
}) => {
  return (
    <div key={tool.id} className="border rounded-lg overflow-hidden">
      <div 
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-accent"
        onClick={() => toggleToolExpanded(tool.id)}
      >
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <div className="font-medium">{tool.name}</div>
            <div className="text-sm text-muted-foreground">{tool.description}</div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {tool.installed ? (
            <Switch 
              checked={tool.active} 
              onCheckedChange={() => toggleToolActive(tool.id)}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                toggleToolInstalled(tool.id);
              }}
            >
              <Download className="h-4 w-4 mr-1" />
              Install
            </Button>
          )}
        </div>
      </div>
      
      {expandedToolId === tool.id && (
        <div className="p-3 bg-accent/50 border-t">
          <div className="text-sm space-y-2">
            <div>
              <span className="font-medium">Call with:</span> <code className="bg-background px-1 py-0.5 rounded">{tool.callWord}</code>
            </div>
            <div>
              <span className="font-medium">Source:</span> <span className="capitalize">{tool.source}</span>
            </div>
            <div>
              <span className="font-medium">Details:</span> 
              <p className="mt-1">{tool.details}</p>
            </div>
            <div>
              <span className="font-medium">Examples:</span>
              <ul className="list-disc list-inside mt-1">
                {tool.examples.map((example, index) => (
                  <li key={index}><code className="bg-background px-1 py-0.5 rounded">{example}</code></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolItem;
