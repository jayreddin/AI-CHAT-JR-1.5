
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface AIAgent {
  id: string;
  name: string;
  description: string;
  source: string;
  prompt: string;
  callCommand: string;
  installed: boolean;
}

const STORAGE_KEY = 'ai-chat-agents';

// Sample preset agents with properly escaped apostrophes
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
    prompt: 'You are a creative writing assistant. Help users develop story ideas, create compelling characters, write engaging dialogues, and overcome writer\'s block. Provide constructive feedback on their writing while being encouraging and supportive.',
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

export const useAgents = (searchQuery: string, source: string) => {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [expandedAgentId, setExpandedAgentId] = useState<string | null>(null);

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

  // Delete agent
  const deleteAgent = (id: string) => {
    setAgents(agents.filter(agent => agent.id !== id));
    toast.success('Agent removed');
  };

  // Count installed agents
  const installedCount = agents.filter(agent => agent.installed).length;

  return {
    agents,
    setAgents,
    expandedAgentId,
    filteredAgents,
    toggleAgentExpanded,
    deleteAgent,
    saveAgents,
    installedCount
  };
};
