
import { AIModel } from "@/types/chat";

// List of available models
export const AVAILABLE_MODELS: AIModel[] = [
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI' },
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
  { id: 'o3-mini', name: 'O3 Mini', provider: 'OpenAI' },
  { id: 'o1-mini', name: 'O1 Mini', provider: 'OpenAI' },
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
  { id: 'claude-3-7-sonnet', name: 'Claude 3.7 Sonnet', provider: 'Anthropic' },
  { id: 'deepseek-chat', name: 'DeepSeek Chat', provider: 'High-Flyer (DeepSeek)' },
  { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner', provider: 'High-Flyer (DeepSeek)' },
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', provider: 'Google' },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'Google' },
  { id: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo', name: 'Llama 3.1 8B', provider: 'Together.ai' },
  { id: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo', name: 'Llama 3.1 70B', provider: 'Together.ai' },
  { id: 'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo', name: 'Llama 3.1 405B', provider: 'Together.ai' },
  { id: 'mistral-large-latest', name: 'Mistral Large', provider: 'Mistral AI' },
  { id: 'pixtral-large-latest', name: 'Pixtral Large', provider: 'Mistral AI' },
  { id: 'codestral-latest', name: 'Codestral', provider: 'Mistral AI' },
  { id: 'google/gemma-2-27b-it', name: 'Gemma 2 27B', provider: 'Groq' },
  { id: 'grok-beta', name: 'Grok Beta', provider: 'xAI' },
];
