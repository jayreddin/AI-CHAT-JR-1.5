
import { useState, useEffect } from 'react';
import { loadFromStorage } from '@/utils/storage';

export const useToolbarCounts = () => {
  const [activeToolsCount, setActiveToolsCount] = useState(0);
  const [activeServersCount, setActiveServersCount] = useState(0);
  const [installedAgentsCount, setInstalledAgentsCount] = useState(0);
  
  const [activeTools, setActiveTools] = useState<string[]>([]);
  const [activeServers, setActiveServers] = useState<string[]>([]);
  const [installedAgents, setInstalledAgents] = useState<string[]>([]);
  
  const refreshCounts = () => {
    // In a real implementation, these would be fetched from an API or state management
    const tools = loadFromStorage('active-tools', [
      'Code Interpreter',
      'Web Browser'
    ]);
    
    const servers = loadFromStorage('active-servers', [
      'Local Development',
      'Test Environment'
    ]);
    
    const agents = loadFromStorage('installed-agents', [
      'Research Assistant',
      'Code Helper',
      'Data Analyst'
    ]);
    
    setActiveTools(tools);
    setActiveServers(servers);
    setInstalledAgents(agents);
    
    setActiveToolsCount(tools.length);
    setActiveServersCount(servers.length);
    setInstalledAgentsCount(agents.length);
  };
  
  // Initial load
  useEffect(() => {
    refreshCounts();
  }, []);
  
  return {
    activeToolsCount,
    activeServersCount,
    installedAgentsCount,
    activeTools,
    activeServers,
    installedAgents,
    refreshCounts
  };
};
