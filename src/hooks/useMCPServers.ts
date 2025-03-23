
import { useState, useEffect } from 'react';
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

export const useMCPServers = (searchQuery: string, source: string) => {
  const [servers, setServers] = useState<MCPServer[]>([]);
  const [expandedServerId, setExpandedServerId] = useState<string | null>(null);
  
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

  return {
    servers,
    setServers,
    filteredServers,
    expandedServerId,
    toggleServerExpanded,
    toggleServerInstalled,
    toggleServerActive,
    saveServers,
    installedCount,
    activeCount
  };
};
