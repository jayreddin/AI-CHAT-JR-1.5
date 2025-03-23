
import React, { useState, useEffect } from 'react';
import { DialogForm } from "@/components/ui/dialog-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Bot, Download, Trash2, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { AgentList } from './agents/AgentList';
import { AgentCommandDialog } from './agents/AgentCommandDialog';
import { AddAgentDialog } from './agents/AddAgentDialog';
import { useAgents } from '@/hooks/useAgents';

interface AIAgentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AIAgentsDialog: React.FC<AIAgentsDialogProps> = ({ open, onOpenChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [source, setSource] = useState('all');
  const [showAddAgentDialog, setShowAddAgentDialog] = useState(false);
  const [showAssignCommandDialog, setShowAssignCommandDialog] = useState(false);
  const [newAgentCommand, setNewAgentCommand] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  
  const { 
    agents, 
    setAgents, 
    installedCount,
    filteredAgents,
    toggleAgentExpanded,
    expandedAgentId,
    deleteAgent,
    saveAgents
  } = useAgents(searchQuery, source);

  // Install agent
  const installAgent = (agent: any) => {
    setSelectedAgent(agent);
    setNewAgentCommand(agent.callCommand);
    setShowAssignCommandDialog(true);
  };

  // Confirm agent command and install
  const confirmAgentCommand = () => {
    if (selectedAgent) {
      if (!newAgentCommand.startsWith('/')) {
        setNewAgentCommand('/' + newAgentCommand);
      }
      
      const commandExists = agents.some(agent => 
        agent.installed && agent.callCommand === newAgentCommand && agent.id !== selectedAgent.id
      );
      
      if (commandExists) {
        toast.error(`Command ${newAgentCommand} is already in use`);
        return;
      }
      
      setAgents(agents.map(agent => 
        agent.id === selectedAgent.id 
          ? { ...agent, installed: true, callCommand: newAgentCommand } 
          : agent
      ));
      
      setShowAssignCommandDialog(false);
      toast.success(`${selectedAgent.name} installed with command ${newAgentCommand}`);
    }
  };

  const handleSaveAgents = () => {
    saveAgents();
    onOpenChange(false);
  };

  return (
    <>
      <DialogForm
        open={open}
        onOpenChange={onOpenChange}
        title="AI Agents Manager"
        description={`${installedCount} agents installed`}
        footerActions={
          <>
            <Button variant="outline" onClick={() => setShowAddAgentDialog(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Create Agent
            </Button>
            <Button onClick={handleSaveAgents}>Save Changes</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for AI agents..."
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

          <AgentList 
            filteredAgents={filteredAgents}
            expandedAgentId={expandedAgentId}
            toggleAgentExpanded={toggleAgentExpanded}
            deleteAgent={deleteAgent}
            installAgent={installAgent}
          />
        </div>
      </DialogForm>

      <AgentCommandDialog 
        open={showAssignCommandDialog}
        onOpenChange={setShowAssignCommandDialog}
        newAgentCommand={newAgentCommand}
        setNewAgentCommand={setNewAgentCommand}
        confirmAgentCommand={confirmAgentCommand}
      />

      <AddAgentDialog
        open={showAddAgentDialog}
        onOpenChange={setShowAddAgentDialog}
      />
    </>
  );
};
