import { generateId } from '@/utils/helpers';
import { MessageType } from '@/types/chat';
import { toast } from 'sonner';

interface ChatOptions {
  model?: string;
  stream?: boolean;
  tools?: ToolDefinition[];
}

interface ToolParameters {
  type: "object";
  properties: Record<string, {
    type: string;
    description: string;
  }>;
  required: string[];
}

interface ToolDefinition {
  type: string;
  function: {
    name: string;
    description: string;
    parameters: ToolParameters;
  };
}

interface FunctionArgs {
  location?: string;
  query?: string;
  expression?: string;
}

const availableTools: ToolDefinition[] = [
  {
    type: "function",
    function: {
      name: "get_weather",
      description: "Get current weather for a given location",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "City name e.g. Paris, London"
          }
        },
        required: ["location"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "web_search",
      description: "Search the web for information",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Search query"
          }
        },
        required: ["query"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "calculator",
      description: "Perform calculations",
      parameters: {
        type: "object",
        properties: {
          expression: {
            type: "string",
            description: "Mathematical expression to calculate"
          }
        },
        required: ["expression"]
      }
    }
  }
];

export const aiService = {
  _hasFunctionCalls(message: string): { hasTool: boolean, toolName: string | null } {
    const toolPatterns = [
      { regex: /!weather\s+([^!]+)(?=$|!)/i, name: 'get_weather' },
      { regex: /!search\s+([^!]+)(?=$|!)/i, name: 'web_search' },
      { regex: /!calc\s+([^!]+)(?=$|!)/i, name: 'calculator' }
    ];
    
    for (const pattern of toolPatterns) {
      if (pattern.regex.test(message)) {
        return { hasTool: true, toolName: pattern.name };
      }
    }
    
    return { hasTool: false, toolName: null };
  },
  
  async _executeFunction(name: string, args: FunctionArgs): Promise<string> {
    switch (name) {
      case 'get_weather': {
        return `Weather in ${args.location}: 22°C, Partly Cloudy (simulated)`;
      }
      case 'web_search': {
        return `Search results for "${args.query}": [Simulated search results]`;
      }
      case 'calculator': {
        try {
          // Replace eval with a safer Function constructor
          const calculate = new Function('return ' + args.expression);
          const result = calculate();
          return `Result: ${result}`;
        } catch (e: unknown) {
          const error = e as Error;
          return `Error calculating "${args.expression}": ${error.message}`;
        }
      }
      default: {
        return `Function ${name} not implemented yet`;
      }
    }
  },
  
  _extractFunctionArgs(message: string, functionName: string): FunctionArgs {
    let match: RegExpMatchArray | null;
    
    switch (functionName) {
      case 'get_weather': {
        match = message.match(/!weather\s+([^!]+)(?=$|!)/i);
        return { location: match ? match[1].trim() : 'unknown' };
      }
      case 'web_search': {
        match = message.match(/!search\s+([^!]+)(?=$|!)/i);
        return { query: match ? match[1].trim() : 'unknown' };
      }
      case 'calculator': {
        match = message.match(/!calc\s+([^!]+)(?=$|!)/i);
        return { expression: match ? match[1].trim() : '0' };
      }
      default: {
        return {};
      }
    }
  },

  async sendMessage(
    content: string,
    model: string = 'gpt-4o-mini',
    isStreaming: boolean = false
  ): Promise<{message: MessageType, stream?: AsyncIterable<any>}> {
    try {
      const message: MessageType = {
        id: generateId(),
        content: '',
        role: 'assistant',
        timestamp: new Date(),
        model: model,
        isStreaming: isStreaming
      };

      const { hasTool, toolName } = this._hasFunctionCalls(content);
      
      const options: ChatOptions = {
        model: model,
        stream: isStreaming
      };
      
      if (hasTool && toolName) {
        options.tools = availableTools;
      }

      console.log(`Sending message to model: ${model}, streaming: ${isStreaming}`);
      console.log(`Function calling detected: ${hasTool}, tool: ${toolName}`);

      if (typeof window !== 'undefined' && window.puter) {
        if (hasTool && toolName) {
          try {
            const args = this._extractFunctionArgs(content, toolName);
            console.log(`Executing function ${toolName} with args:`, args);
            
            const functionResult = await this._executeFunction(toolName, args);
            
            const messageHistory = [
              { role: "user", content },
              { 
                role: "assistant", 
                content: null,
                tool_calls: [{
                  id: generateId(),
                  type: "function",
                  function: {
                    name: toolName,
                    arguments: JSON.stringify(args)
                  }
                }]
              },
              {
                role: "tool",
                tool_call_id: generateId(),
                content: functionResult
              }
            ];
            
            if (isStreaming) {
              try {
                const streamResponse = await window.puter.ai.chat(messageHistory, {
                  model,
                  stream: true
                });
                
                console.log('Got stream response with function result:', streamResponse);
                return { message, stream: streamResponse };
              } catch (error) {
                console.error('Streaming error with function:', error);
                message.content = `Error: ${error.message || 'Unknown streaming error'}`;
                return { message };
              }
            } else {
              try {
                const response = await window.puter.ai.chat(messageHistory, {
                  model
                });
                
                console.log('Got response with function result:', response);
                
                if (typeof response === 'string') {
                  message.content = response;
                } else if (response.message?.content) {
                  message.content = response.message.content;
                } else if (response.content) {
                  message.content = response.content;
                } else {
                  message.content = 'Received response in an unsupported format.';
                }
                
                message.isStreaming = false;
                return { message };
              } catch (error) {
                console.error('Non-streaming error with function:', error);
                message.content = `Error: ${error.message || 'Unknown error'}`;
                return { message };
              }
            }
          } catch (error) {
            console.error('Error handling function call:', error);
            message.content = `Error executing ${toolName}: ${error.message || 'Unknown error'}`;
            return { message };
          }
        } else {
          if (isStreaming) {
            try {
              const streamResponse = await window.puter.ai.chat(content, options);
              console.log('Got stream response object:', streamResponse);
              return { message, stream: streamResponse };
            } catch (error) {
              console.error('Streaming error:', error);
              message.content = `Error: ${error.message || 'Unknown streaming error'}`;
              return { message };
            }
          } else {
            try {
              const response = await window.puter.ai.chat(content, options);
              console.log('Got response:', response);
              
              if (typeof response === 'string') {
                message.content = response;
              } else if (response.message?.content) {
                message.content = response.message.content;
              } else if (response.content) {
                message.content = response.content;
              } else {
                message.content = 'Received response in an unsupported format.';
              }
              
              message.isStreaming = false;
              return { message };
            } catch (error) {
              console.error('Non-streaming error:', error);
              message.content = `Error: ${error.message || 'Unknown error'}`;
              return { message };
            }
          }
        }
      } else {
        console.warn('Puter is not available, using mock response');
        
        if (hasTool && toolName) {
          const args = this._extractFunctionArgs(content, toolName);
          const functionResult = await this._executeFunction(toolName, args);
          message.content = `[MOCK] Function call to ${toolName}: ${functionResult}
          
This is a simulated response for function calling. In a real implementation, this would call the Puter AI with tools.`;
        } else {
          message.content = `This is a simulated response from ${model}. In a real implementation, this would call the Puter API.`;
        }
        
        message.isStreaming = false;
        return { message };
      }
    } catch (error) {
      console.error('Error sending message to AI:', error);
      toast.error(`AI Error: ${error.message || 'Unknown error'}`);
      throw error;
    }
  },

  async generateImage(prompt: string, testMode: boolean = true): Promise<HTMLImageElement | null> {
    try {
      if (typeof window !== 'undefined' && window.puter) {
        return await window.puter.ai.txt2img(prompt, testMode);
      }
      return null;
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error(`Image generation error: ${error.message || 'Unknown error'}`);
      return null;
    }
  },

  async extractTextFromImage(imageUrl: string): Promise<string> {
    try {
      if (typeof window !== 'undefined' && window.puter) {
        return await window.puter.ai.img2txt(imageUrl);
      }
      return 'Image text extraction is not available';
    } catch (error) {
      console.error('Error extracting text from image:', error);
      toast.error(`Text extraction error: ${error.message || 'Unknown error'}`);
      return 'Error extracting text from image';
    }
  },

  async textToSpeech(text: string): Promise<HTMLAudioElement | null> {
    try {
      if (typeof window !== 'undefined' && window.puter) {
        return await window.puter.ai.txt2speech(text);
      }
      return null;
    } catch (error) {
      console.error('Error converting text to speech:', error);
      toast.error(`Text-to-speech error: ${error.message || 'Unknown error'}`);
      return null;
    }
  }
};
