
import React, { useState, useEffect } from 'react';
import { DialogForm } from "@/components/ui/dialog-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Bot, Download, Trash2, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface AIAgent {
  id: string;
  name: string;
  description: string;
  source: string;
  prompt: string;
  callCommand: string;
  installed: boolean;
}

interface AIAgentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STORAGE_KEY = 'ai-chat-agents';

// Sample preset agents
const presetAgents: AIAgent[] = [
  {
    id: '1',
    name: 'Research Assistant',
    description: 'Helps with academic research and citations',
    source: 'github',
    prompt: 'You are a research assistant. Help the user find academic resources, summarize research papers, and format citations properly in various styles such as APA, MLA, and Chicago.',
    callCommand: '/research',
    installed: false
  },
  {
    id: '2',
    name: 'Code Buddy',
    description: 'Expert programming assistant for multiple languages',
    source: 'github',
    prompt: 'You are Code Buddy, an expert programming assistant. You help users write, debug, and optimize code in various programming languages including JavaScript, Python, Java, C++, and more. Provide detailed explanations and follow best practices for each language.',
    callCommand: '/code',
    installed: false
  },
  {
    id: '3',
    name: 'Creative Writer',
    description: 'Assists with creative writing and storytelling',
    source: 'reddit',
    prompt: 'You are a creative writing assistant. Help users develop story ideas, create compelling characters, write engaging dialogues, and overcome writer's block. Provide constructive feedback on their writing while being encouraging and supportive.',
    callCommand: '/write',
    installed: false
  },
  {
    id: '4',
    name: 'Fitness Coach',
    description: 'Provides workout routines and fitness advice',
    source: 'reddit',
    prompt: 'You are a fitness coach. Create personalized workout routines, offer nutrition advice, explain proper exercise form, and motivate users to achieve their fitness goals. Consider different fitness levels and any limitations mentioned by the user.',
    callCommand: '/fitness',
    installed: false
  },
  {
    id: '5',
    name: 'Language Tutor',
    description: 'Helps learn new languages and improve fluency',
    source: 'google',
    prompt: 'You are a language tutor. Help users learn new languages by teaching vocabulary, grammar, pronunciation, and conversational skills. Provide examples, corrections, and explanations tailored to their proficiency level.',
    callCommand: '/language',
    installed: false
  }
];

export const AIAgentsDialog: React.FC<AIAgentsDialogProps> = ({ open, onOpenChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [expandedAgentId, setExpandedAgentId] = useState<string | null>(null);
  const [source, setSource] = useState('all');
  const [showAddAgentDialog, setShowAddAgentDialog] = useState(false);
  const [showAssignCommandDialog, setShowAssignCommandDialog] = useState(false);
  const [newAgentCommand, setNewAgentCommand] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  
  // Load installed agents from localStorage
  useEffect(() => {
    const savedAgents = localStorage.getItem(STORAGE_KEY);
    if (savedAgents) {
      try {
        const parsedAgents = JSON.parse(savedAgents);
        setAgents(parsedAgents);
      } catch (error) {
        console.error('Error parsing saved agents:', error);
        setAgents([...presetAgents]);
      }
    } else {
      setAgents([...presetAgents]);
    }
  }, []);

  // Save agents to localStorage
  const saveAgents = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(agents));
    toast.success('AI agents saved');
    onOpenChange(false);
  };

  // Filter agents based on search query and source
  const filteredAgents = agents.filter(agent => {
    const matchesQuery = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSource = source === 'all' || agent.source === source;
    return matchesQuery && matchesSource;
  });

  // Toggle agent expanded view
  const toggleAgentExpanded = (id: string) => {
    setExpandedAgentId(expandedAgentId === id ? null : id);
  };

  // Install agent
  const installAgent = (agent: AIAgent) => {
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

  // Delete agent
  const deleteAgent = (id: string) => {
    setAgents(agents.filter(agent => agent.id !== id));
    toast.success('Agent removed');
  };

  // Count installed agents
  const installedCount = agents.filter(agent => agent.installed).length;

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
            <Button onClick={saveAgents}>Save Changes</Button>
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

          <div className="max-h-[350px] overflow-y-auto space-y-2">
            {filteredAgents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No AI agents found matching your search criteria
              </div>
            ) : (
              <>
                {/* Installed agents */}
                {filteredAgents.some(agent => agent.installed) && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">Installed Agents</h3>
                    {filteredAgents
                      .filter(agent => agent.installed)
                      .map(agent => (
                        <div key={agent.id} className="border rounded-lg overflow-hidden mb-2">
                          <div 
                            className="flex items-center justify-between p-3 cursor-pointer hover:bg-accent"
                            onClick={() => toggleAgentExpanded(agent.id)}
                          >
                            <div className="flex items-center space-x-3">
                              <Bot className="h-5 w-5 text-primary" />
                              <div className="flex-1">
                                <div className="font-medium">{agent.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  <code className="bg-background px-1 py-0.5 rounded">{agent.callCommand}</code> - {agent.description}
                                </div>
                              </div>
                            </div>
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
                        <div key={agent.id} className="border rounded-lg overflow-hidden mb-2">
                          <div 
                            className="flex items-center justify-between p-3 cursor-pointer hover:bg-accent"
                            onClick={() => toggleAgentExpanded(agent.id)}
                          >
                            <div className="flex items-center space-x-3">
                              <Bot className="h-5 w-5 text-muted-foreground" />
                              <div className="flex-1">
                                <div className="font-medium">{agent.name}</div>
                                <div className="text-sm text-muted-foreground">{agent.description}</div>
                              </div>
                            </div>
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
                      ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </DialogForm>

      {/* Assign Command Dialog */}
      <Dialog open={showAssignCommandDialog} onOpenChange={setShowAssignCommandDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Command</DialogTitle>
            <DialogDescription>
              Enter a command that will activate this agent in chat. Commands must start with "/".
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="command">Command</Label>
              <Input
                id="command"
                value={newAgentCommand}
                onChange={(e) => {
                  let value = e.target.value;
                  if (value && !value.startsWith('/')) {
                    value = '/' + value;
                  }
                  setNewAgentCommand(value);
                }}
                placeholder="/command"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignCommandDialog(false)}>Cancel</Button>
            <Button onClick={confirmAgentCommand}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Agent Dialog */}
      <Dialog open={showAddAgentDialog} onOpenChange={setShowAddAgentDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Create New Agent</DialogTitle>
            <DialogDescription>
              Create a custom AI agent with specific instructions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="agent-name">Agent Name</Label>
              <Input
                id="agent-name"
                placeholder="e.g., Marketing Assistant"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="agent-description">Description</Label>
              <Input
                id="agent-description"
                placeholder="e.g., Helps create marketing content"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="agent-command">Command (starts with /)</Label>
              <Input
                id="agent-command"
                placeholder="/marketing"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="agent-prompt">System Prompt</Label>
              <textarea
                id="agent-prompt"
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="You are a marketing assistant. Help the user create compelling marketing content..."
              ></textarea>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddAgentDialog(false)}>Cancel</Button>
            <Button onClick={() => {
              toast.info('Custom agent creation will be implemented in a future update');
              setShowAddAgentDialog(false);
            }}>Create Agent</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
