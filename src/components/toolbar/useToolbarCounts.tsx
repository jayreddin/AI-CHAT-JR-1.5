
import { useState, useEffect } from 'react';

export const useToolbarCounts = () => {
  // Get counts of active tools, servers, and agents
  const [activeToolsCount, setActiveToolsCount] = useState(0);
  const [activeServersCount, setActiveServersCount] = useState(0);
  const [installedAgentsCount, setInstalledAgentsCount] = useState(0);
  
  // Load counts from localStorage
  useEffect(() => {
    const loadStoredCounts = () => {
      try {
        // Load tools count
        const storedTools = localStorage.getItem('ai-chat-tools');
        if (storedTools) {
          const tools = JSON.parse(storedTools);
          const activeCount = tools.filter((tool: any) => tool.installed && tool.active).length;
          setActiveToolsCount(activeCount);
        }
        
        // Load MCP servers count
        const storedServers = localStorage.getItem('ai-chat-mcp-servers');
        if (storedServers) {
          const servers = JSON.parse(storedServers);
          const activeCount = servers.filter((server: any) => server.installed && server.active).length;
          setActiveServersCount(activeCount);
        }
        
        // Load AI agents count
        const storedAgents = localStorage.getItem('ai-chat-agents');
        if (storedAgents) {
          const agents = JSON.parse(storedAgents);
          const installedCount = agents.filter((agent: any) => agent.installed).length;
          setInstalledAgentsCount(installedCount);
        }
      } catch (error) {
        console.error('Error loading stored counts:', error);
      }
    };
    
    loadStoredCounts();
    
    // Listen for storage changes to update counts
    window.addEventListener('storage', loadStoredCounts);
    
    return () => {
      window.removeEventListener('storage', loadStoredCounts);
    };
  }, []);

  const refreshCounts = () => {
    try {
      // Update tools count
      const storedTools = localStorage.getItem('ai-chat-tools');
      if (storedTools) {
        const tools = JSON.parse(storedTools);
        const activeCount = tools.filter((tool: any) => tool.installed && tool.active).length;
        setActiveToolsCount(activeCount);
      }
      
      // Update MCP servers count
      const storedServers = localStorage.getItem('ai-chat-mcp-servers');
      if (storedServers) {
        const servers = JSON.parse(storedServers);
        const activeCount = servers.filter((server: any) => server.installed && server.active).length;
        setActiveServersCount(activeCount);
      }
      
      // Update AI agents count
      const storedAgents = localStorage.getItem('ai-chat-agents');
      if (storedAgents) {
        const agents = JSON.parse(storedAgents);
        const installedCount = agents.filter((agent: any) => agent.installed).length;
        setInstalledAgentsCount(installedCount);
      }
    } catch (error) {
      console.error('Error updating stored counts:', error);
    }
  };
  
  return {
    activeToolsCount,
    activeServersCount,
    installedAgentsCount,
    refreshCounts
  };
};
