
import React, { useState, useEffect } from 'react';
import { Server, Search } from 'lucide-react';
import { loadFromStorage } from '@/utils/storage';
import { Input } from '@/components/ui/input';

interface ServerSelectorProps {
  onSelect: (serverName: string) => void;
  onClose: () => void;
}

const ServerSelector: React.FC<ServerSelectorProps> = ({ onSelect, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [servers, setServers] = useState<{ name: string; description: string; callWord: string; active: boolean }[]>([]);
  
  useEffect(() => {
    // Load servers from localStorage
    const savedServers = loadFromStorage('active-servers', []);
    
    if (savedServers.length === 0 || !Array.isArray(savedServers)) {
      // If no servers are found, use some sample servers
      setServers([
        { name: 'Local Development', description: 'Local dev server', callWord: '$local', active: true },
        { name: 'Test Environment', description: 'Testing server', callWord: '$test', active: true },
        { name: 'Production', description: 'Production server', callWord: '$prod', active: true },
      ]);
    } else {
      // Transform the server data to add callWords if not present
      const serversWithCallWords = savedServers.map((server: string | any) => {
        if (typeof server === 'string') {
          return {
            name: server,
            description: `MCP Server ${server}`,
            callWord: `$${server.toLowerCase().replace(/\s+/g, '-')}`,
            active: true
          };
        }
        return {
          ...server,
          callWord: server.callWord || `$${server.name.toLowerCase().replace(/\s+/g, '-')}`,
          active: server.active !== undefined ? server.active : true
        };
      });
      setServers(serversWithCallWords);
    }
  }, []);
  
  const filteredServers = searchQuery
    ? servers.filter(server => 
        server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        server.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        server.callWord.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : servers;

  return (
    <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-md shadow-md max-h-60 overflow-y-auto w-72 z-50">
      <div className="p-2 bg-gray-100 border-b text-xs font-medium flex justify-between items-center">
        <span>MCP Servers (click to use)</span>
        <button 
          className="text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ×
        </button>
      </div>
      
      <div className="p-2 border-b">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-3 w-3 text-gray-400" />
          <Input
            placeholder="Search servers..."
            className="pl-7 h-8 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {filteredServers.length === 0 ? (
        <div className="p-3 text-sm text-gray-500">
          No MCP servers available. Add servers in the MCP Server Manager.
        </div>
      ) : (
        <div className="p-1">
          {filteredServers.map((server, index) => (
            <button
              key={index}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center gap-2"
              onClick={() => onSelect(server.callWord)}
            >
              <div className="p-1 bg-primary/10 rounded">
                <Server size={14} className="text-primary" />
              </div>
              <div>
                <div className="text-sm font-medium">{server.name}</div>
                <div className="text-xs text-gray-500">{server.callWord}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServerSelector;
