
import React, { useState, useEffect } from 'react';
import { DialogForm } from "@/components/ui/dialog-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Search, Github, Download } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from 'sonner';

interface Tool {
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

interface ToolsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STORAGE_KEY = 'ai-chat-tools';

// Sample preset tools
const presetTools: Tool[] = [
  {
    id: '1',
    name: 'Weather Lookup',
    description: 'Look up weather for any location',
    source: 'github',
    callWord: '!weather',
    installed: false,
    active: false,
    examples: ['!weather New York', '!weather London, UK'],
    details: 'This tool allows the AI to check current weather conditions and forecasts for any location. The AI can provide temperature, conditions, and forecasts.'
  },
  {
    id: '2',
    name: 'Web Search',
    description: 'Search the web for information',
    source: 'github',
    callWord: '!search',
    installed: false,
    active: false,
    examples: ['!search latest news', '!search Python tutorials'],
    details: 'This tool enables the AI to search the web for current information not in its training data. Results are summarized and relevant links provided.'
  },
  {
    id: '3',
    name: 'Code Interpreter',
    description: 'Execute and explain code snippets',
    source: 'reddit',
    callWord: '!code',
    installed: false,
    active: false,
    examples: ['!code print("Hello World")', '!code for i in range(5): print(i)'],
    details: 'The Code Interpreter tool allows the AI to execute Python code safely and display the results. It can also explain how the code works step by step.'
  },
  {
    id: '4',
    name: 'Calculator',
    description: 'Perform complex calculations',
    source: 'github',
    callWord: '!calc',
    installed: false,
    active: false,
    examples: ['!calc 5 * (3 + 2)', '!calc sqrt(16) + 10'],
    details: 'The Calculator tool handles mathematical operations from basic arithmetic to complex equations. It supports functions like sqrt(), sin(), cos(), log(), etc.'
  },
  {
    id: '5',
    name: 'Image Analysis',
    description: 'Analyze and describe images in detail',
    source: 'github',
    callWord: '!analyze',
    installed: false,
    active: false,
    examples: ['!analyze [image]', '!analyze what\'s in this picture?'],
    details: 'This tool allows the AI to perform detailed analysis of images, identifying objects, text, people, scenes, and other elements within the image.'
  }
];

export const ToolsDialog: React.FC<ToolsDialogProps> = ({ open, onOpenChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tools, setTools] = useState<Tool[]>([]);
  const [expandedToolId, setExpandedToolId] = useState<string | null>(null);
  const [source, setSource] = useState('all');
  
  // Load installed tools from localStorage
  useEffect(() => {
    const savedTools = localStorage.getItem(STORAGE_KEY);
    if (savedTools) {
      try {
        const parsedTools = JSON.parse(savedTools);
        setTools(parsedTools);
      } catch (error) {
        console.error('Error parsing saved tools:', error);
        setTools([...presetTools]);
      }
    } else {
      setTools([...presetTools]);
    }
  }, []);

  // Save tools to localStorage
  const saveTools = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tools));
    toast.success('Tools settings saved');
    onOpenChange(false);
  };

  // Filter tools based on search query and source
  const filteredTools = tools.filter(tool => {
    const matchesQuery = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSource = source === 'all' || tool.source === source;
    return matchesQuery && matchesSource;
  });

  // Toggle tool expanded view
  const toggleToolExpanded = (id: string) => {
    setExpandedToolId(expandedToolId === id ? null : id);
  };

  // Toggle tool installation
  const toggleToolInstalled = (id: string) => {
    setTools(tools.map(tool => 
      tool.id === id ? { ...tool, installed: !tool.installed, active: !tool.installed ? true : tool.active } : tool
    ));
  };

  // Toggle tool active state
  const toggleToolActive = (id: string) => {
    setTools(tools.map(tool => 
      tool.id === id ? { ...tool, active: !tool.active } : tool
    ));
  };

  // Count installed tools
  const installedCount = tools.filter(tool => tool.installed).length;
  const activeCount = tools.filter(tool => tool.installed && tool.active).length;

  return (
    <DialogForm
      open={open}
      onOpenChange={onOpenChange}
      title="Tools Manager"
      description={`${installedCount} tools installed, ${activeCount} active`}
      footerActions={
        <Button onClick={saveTools}>Save Changes</Button>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <Tabs defaultValue="all" onValueChange={setSource}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="github">GitHub</TabsTrigger>
            <TabsTrigger value="reddit">Reddit</TabsTrigger>
            <TabsTrigger value="google">Google</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="max-h-[350px] overflow-y-auto space-y-2">
          {filteredTools.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No tools found matching your search criteria
            </div>
          ) : (
            filteredTools.map((tool) => (
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
            ))
          )}
        </div>
      </div>
    </DialogForm>
  );
};
