
import React, { useState, useEffect } from 'react';
import { DialogForm } from "@/components/ui/dialog-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Search, Server, Download, ExternalLink } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';

interface MCPServer {
  id: string;
  name: string;
  description: string;
  url: string;
  source: string;
  installed: boolean;
  active: boolean;
  callWord: string;
  examples: string[];
  details: string;
}

interface MCPServerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STORAGE_KEY = 'ai-chat-mcp-servers';

// Sample preset MCP servers
const presetServers: MCPServer[] = [
  {
    id: '1',
    name: 'Assistant API',
    description: 'General purpose assistant API',
    url: 'https://assistant-api.example.com',
    source: 'github',
    callWord: '@assistant',
    installed: false,
    active: false,
    examples: ['@assistant what are the latest trends in AI?', '@assistant summarize this article'],
    details: 'This general purpose assistant API can handle a wide range of tasks including summarization, question answering, and creative writing. It uses a fine-tuned GPT model with optimizations for real-time responses.'
  },
  {
    id: '2',
    name: 'Code Helper',
    description: 'Programming assistant and code generator',
    url: 'https://code-helper.example.com',
    source: 'mcp.so',
    callWord: '@code',
    installed: false,
    active: false,
    examples: ['@code generate a React component for a todo list', '@code explain this JavaScript snippet'],
    details: 'The Code Helper MCP server specializes in programming tasks across multiple languages including JavaScript, Python, Java, C++, and more. It can generate code, debug existing code, and explain code behavior.'
  },
  {
    id: '3',
    name: 'Research Helper',
    description: 'Academic research and paper assistant',
    url: 'https://research-helper.example.com',
    source: 'github',
    callWord: '@research',
    installed: false,
    active: false,
    examples: ['@research find papers on quantum computing', '@research summarize this scientific paper'],
    details: 'Research Helper is designed for academic tasks, with capabilities to search for relevant papers, summarize scientific literature, explain complex concepts, and assist with structuring research documents.'
  },
  {
    id: '4',
    name: 'Content Creator',
    description: 'Creates marketing and social media content',
    url: 'https://content-creator.example.com',
    source: 'reddit',
    callWord: '@content',
    installed: false,
    active: false,
    examples: ['@content write a tweet about our new product', '@content create an Instagram caption'],
    details: 'This MCP server specializes in creating marketing and social media content including tweets, Instagram captions, blog posts, ad copy, and email campaigns. It can adapt to different brand voices and target audiences.'
  },
  {
    id: '5',
    name: 'Data Analyzer',
    description: 'Analyzes data and generates insights',
    url: 'https://data-analyzer.example.com',
    source: 'google',
    callWord: '@data',
    installed: false,
    active: false,
    examples: ['@data analyze this CSV file', '@data generate a visualization for this dataset'],
    details: 'Data Analyzer helps with data analysis tasks such as cleaning datasets, generating visualizations, performing statistical analysis, and extracting insights from structured data.'
  }
];

export const MCPServerDialog: React.FC<MCPServerDialogProps> = ({ open, onOpenChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [servers, setServers] = useState<MCPServer[]>([]);
  const [expandedServerId, setExpandedServerId] = useState<string | null>(null);
  const [source, setSource] = useState('all');
  
  // Load installed servers from localStorage
  useEffect(() => {
    const savedServers = localStorage.getItem(STORAGE_KEY);
    if (savedServers) {
      try {
        const parsedServers = JSON.parse(savedServers);
        setServers(parsedServers);
      } catch (error) {
        console.error('Error parsing saved servers:', error);
        setServers([...presetServers]);
      }
    } else {
      setServers([...presetServers]);
    }
  }, []);

  // Save servers to localStorage
  const saveServers = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(servers));
    toast.success('MCP server settings saved');
    onOpenChange(false);
  };

  // Filter servers based on search query and source
  const filteredServers = servers.filter(server => {
    const matchesQuery = server.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        server.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSource = source === 'all' || server.source === source;
    return matchesQuery && matchesSource;
  });

  // Toggle server expanded view
  const toggleServerExpanded = (id: string) => {
    setExpandedServerId(expandedServerId === id ? null : id);
  };

  // Toggle server installation
  const toggleServerInstalled = (id: string) => {
    setServers(servers.map(server => 
      server.id === id ? { ...server, installed: !server.installed, active: !server.installed ? true : server.active } : server
    ));
  };

  // Toggle server active state
  const toggleServerActive = (id: string) => {
    setServers(servers.map(server => 
      server.id === id ? { ...server, active: !server.active } : server
    ));
  };

  // Count installed and active servers
  const installedCount = servers.filter(server => server.installed).length;
  const activeCount = servers.filter(server => server.installed && server.active).length;

  return (
    <DialogForm
      open={open}
      onOpenChange={onOpenChange}
      title="MCP Server Manager"
      description={`${installedCount} servers installed, ${activeCount} active`}
      footerActions={
        <Button onClick={saveServers}>Save Changes</Button>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for MCP servers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <Tabs defaultValue="all" onValueChange={setSource}>
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="github">GitHub</TabsTrigger>
            <TabsTrigger value="mcp.so">MCP.so</TabsTrigger>
            <TabsTrigger value="reddit">Reddit</TabsTrigger>
            <TabsTrigger value="google">Google</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="max-h-[350px] overflow-y-auto space-y-2">
          {filteredServers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No MCP servers found matching your search criteria
            </div>
          ) : (
            filteredServers.map((server) => (
              <div key={server.id} className="border rounded-lg overflow-hidden">
                <div 
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-accent"
                  onClick={() => toggleServerExpanded(server.id)}
                >
                  <div className="flex items-center space-x-3">
                    <Server className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <div className="font-medium">{server.name}</div>
                      <div className="text-sm text-muted-foreground">{server.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {server.installed ? (
                      <Switch 
                        checked={server.active} 
                        onCheckedChange={() => toggleServerActive(server.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleServerInstalled(server.id);
                        }}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Install
                      </Button>
                    )}
                  </div>
                </div>
                
                {expandedServerId === server.id && (
                  <div className="p-3 bg-accent/50 border-t">
                    <div className="text-sm space-y-2">
                      <div>
                        <span className="font-medium">Call with:</span> <code className="bg-background px-1 py-0.5 rounded">{server.callWord}</code>
                      </div>
                      <div>
                        <span className="font-medium">Source:</span> <span className="capitalize">{server.source}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="font-medium">URL:</span> 
                        <a href={server.url} target="_blank" rel="noopener noreferrer" className="text-primary inline-flex items-center">
                          {server.url} <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                      <div>
                        <span className="font-medium">Details:</span> 
                        <p className="mt-1">{server.details}</p>
                      </div>
                      <div>
                        <span className="font-medium">Examples:</span>
                        <ul className="list-disc list-inside mt-1">
                          {server.examples.map((example, index) => (
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
