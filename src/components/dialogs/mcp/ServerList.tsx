
import React from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Server, Download, ExternalLink } from 'lucide-react';

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

interface ServerListProps {
  filteredServers: MCPServer[];
  expandedServerId: string | null;
  toggleServerExpanded: (id: string) => void;
  toggleServerInstalled: (id: string) => void;
  toggleServerActive: (id: string) => void;
}

export const ServerList: React.FC<ServerListProps> = ({
  filteredServers,
  expandedServerId,
  toggleServerExpanded,
  toggleServerInstalled,
  toggleServerActive
}) => {
  if (filteredServers.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No MCP servers found matching your search criteria
      </div>
    );
  }

  return (
    <div className="max-h-[350px] overflow-y-auto space-y-2">
      {filteredServers.map((server) => (
        <ServerCard
          key={server.id}
          server={server}
          expandedServerId={expandedServerId}
          toggleServerExpanded={toggleServerExpanded}
          toggleServerInstalled={toggleServerInstalled}
          toggleServerActive={toggleServerActive}
        />
      ))}
    </div>
  );
};

interface ServerCardProps {
  server: MCPServer;
  expandedServerId: string | null;
  toggleServerExpanded: (id: string) => void;
  toggleServerInstalled: (id: string) => void;
  toggleServerActive: (id: string) => void;
}

const ServerCard: React.FC<ServerCardProps> = ({
  server,
  expandedServerId,
  toggleServerExpanded,
  toggleServerInstalled,
  toggleServerActive
}) => {
  return (
    <div className="border rounded-lg overflow-hidden">
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
  );
};
