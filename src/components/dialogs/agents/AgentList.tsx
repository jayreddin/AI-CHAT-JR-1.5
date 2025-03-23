
import React from 'react';
import { Button } from "@/components/ui/button";
import { Bot, Download, Trash2 } from 'lucide-react';

interface AIAgent {
  id: string;
  name: string;
  description: string;
  source: string;
  prompt: string;
  callCommand: string;
  installed: boolean;
}

interface AgentListProps {
  filteredAgents: AIAgent[];
  expandedAgentId: string | null;
  toggleAgentExpanded: (id: string) => void;
  deleteAgent: (id: string) => void;
  installAgent: (agent: AIAgent) => void;
}

export const AgentList: React.FC<AgentListProps> = ({
  filteredAgents,
  expandedAgentId,
  toggleAgentExpanded,
  deleteAgent,
  installAgent
}) => {
  if (filteredAgents.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No AI agents found matching your search criteria
      </div>
    );
  }

  return (
    <div className="max-h-[350px] overflow-y-auto space-y-2">
      {/* Installed agents */}
      {filteredAgents.some(agent => agent.installed) && (
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">Installed Agents</h3>
          {filteredAgents
            .filter(agent => agent.installed)
            .map(agent => (
              <AgentCard
                key={agent.id}
                agent={agent}
                isInstalled={true}
                expandedAgentId={expandedAgentId}
                toggleAgentExpanded={toggleAgentExpanded}
                deleteAgent={deleteAgent}
                installAgent={installAgent}
              />
            ))}
        </div>
      )}

      {/* Available agents */}
      {filteredAgents.some(agent => !agent.installed) && (
        <div>
          <h3 className="text-sm font-medium mb-2">Available Agents</h3>
          {filteredAgents
            .filter(agent => !agent.installed)
            .map(agent => (
              <AgentCard
                key={agent.id}
                agent={agent}
                isInstalled={false}
                expandedAgentId={expandedAgentId}
                toggleAgentExpanded={toggleAgentExpanded}
                deleteAgent={deleteAgent}
                installAgent={installAgent}
              />
            ))}
        </div>
      )}
    </div>
  );
};

interface AgentCardProps {
  agent: AIAgent;
  isInstalled: boolean;
  expandedAgentId: string | null;
  toggleAgentExpanded: (id: string) => void;
  deleteAgent: (id: string) => void;
  installAgent: (agent: AIAgent) => void;
}

const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  isInstalled,
  expandedAgentId,
  toggleAgentExpanded,
  deleteAgent,
  installAgent
}) => {
  return (
    <div className="border rounded-lg overflow-hidden mb-2">
      <div 
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-accent"
        onClick={() => toggleAgentExpanded(agent.id)}
      >
        <div className="flex items-center space-x-3">
          <Bot className={`h-5 w-5 ${isInstalled ? 'text-primary' : 'text-muted-foreground'}`} />
          <div className="flex-1">
            <div className="font-medium">{agent.name}</div>
            <div className="text-sm text-muted-foreground">
              {isInstalled && <code className="bg-background px-1 py-0.5 rounded">{agent.callCommand}</code>}
              {isInstalled && ' - '}
              {agent.description}
            </div>
          </div>
        </div>
        {isInstalled ? (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              deleteAgent(agent.id);
            }}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              installAgent(agent);
            }}
          >
            <Download className="h-4 w-4 mr-1" />
            Install
          </Button>
        )}
      </div>
      
      {expandedAgentId === agent.id && (
        <div className="p-3 bg-accent/50 border-t">
          <div className="text-sm">
            <span className="font-medium">Prompt:</span> 
            <p className="mt-1 whitespace-pre-wrap">{agent.prompt}</p>
          </div>
        </div>
      )}
    </div>
  );
};
