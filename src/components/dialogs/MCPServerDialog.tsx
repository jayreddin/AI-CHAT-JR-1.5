
import React, { useState } from 'react';
import { DialogForm } from "@/components/ui/dialog-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServerList } from './mcp/ServerList';
import { useMCPServers } from '@/hooks/useMCPServers';

interface MCPServerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MCPServerDialog: React.FC<MCPServerDialogProps> = ({ open, onOpenChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [source, setSource] = useState('all');
  
  const { 
    servers, 
    filteredServers,
    installedCount,
    activeCount,
    toggleServerExpanded,
    expandedServerId,
    toggleServerInstalled,
    toggleServerActive,
    saveServers
  } = useMCPServers(searchQuery, source);

  const handleSave = () => {
    saveServers();
    onOpenChange(false);
  };

  return (
    <DialogForm
      open={open}
      onOpenChange={onOpenChange}
      title="MCP Server Manager"
      description={`${installedCount} servers installed, ${activeCount} active`}
      footerActions={
        <Button onClick={handleSave}>Save Changes</Button>
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

        <ServerList 
          filteredServers={filteredServers}
          expandedServerId={expandedServerId}
          toggleServerExpanded={toggleServerExpanded}
          toggleServerInstalled={toggleServerInstalled}
          toggleServerActive={toggleServerActive}
        />
      </div>
    </DialogForm>
  );
};
