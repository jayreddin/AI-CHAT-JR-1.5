
import { generateId } from '@/utils/helpers';
import { MessageType } from '@/types/chat';
import { toast } from 'sonner';

interface ChatOptions {
  model?: string;
  stream?: boolean;
  tools?: any[];
}

// Service for handling AI API calls
export const aiService = {
  // Send a message to an AI model
  async sendMessage(
    content: string,
    model: string = 'gpt-4o-mini',
    isStreaming: boolean = false
  ): Promise<{message: MessageType, stream?: AsyncIterable<any>}> {
    try {
      // Create a message object
      const message: MessageType = {
        id: generateId(),
        content: '',
        role: 'assistant',
        timestamp: new Date(),
        model: model,
        isStreaming: isStreaming
      };

      const options: ChatOptions = {
        model: model,
        stream: isStreaming
      };

      console.log(`Sending message to model: ${model}, streaming: ${isStreaming}`);

      // Check if Puter is available
      if (typeof window !== 'undefined' && window.puter) {
        if (isStreaming) {
          // Handle streaming response
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
          // Handle non-streaming response
          try {
            const response = await window.puter.ai.chat(content, options);
            console.log('Got response:', response);
            
            // Handle different response formats
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
      } else {
        // Fallback for when Puter is not available
        console.warn('Puter is not available, using mock response');
        
        // Mock response
        message.content = `This is a simulated response from ${model}. In a real implementation, this would call the Puter API.`;
        message.isStreaming = false;
        
        return { message };
      }
    } catch (error) {
      console.error('Error sending message to AI:', error);
      toast.error(`AI Error: ${error.message || 'Unknown error'}`);
      throw error;
    }
  },

  // Generate an image from text
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

  // Extract text from an image
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

  // Convert text to speech
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
