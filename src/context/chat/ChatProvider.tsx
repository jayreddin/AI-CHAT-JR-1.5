
import React, { createContext, useContext, useReducer, useEffect, useState, ReactNode } from 'react';
import { ChatContextType, ChatType } from './types';
import { AVAILABLE_MODELS } from '@/constants/models';
import { aiService } from '@/services/aiService';
import { generateId } from '@/utils/helpers';
import { toast } from 'sonner';
import { chatReducer } from './chatReducer';
import { loadFromStorage, saveToStorage } from '@/utils/storage';

// Create context
const ChatContext = createContext<ChatContextType>({
  chats: [],
  currentChat: null,
  currentModel: AVAILABLE_MODELS[0],
  AVAILABLE_MODELS: AVAILABLE_MODELS,
  isLoggedIn: false,
  isStreaming: false,
  isMicActive: false,
  showToolbar: false,
  streamingEnabled: false,
  createNewChat: () => {},
  setCurrentChat: () => {},
  sendMessage: async () => {},
  updateMessage: () => {},
  deleteMessage: () => {},
  resendMessage: () => {},
  retryMessage: () => {},
  setModel: () => {},
  login: async () => {},
  logout: () => {},
  stopGeneration: () => {},
  toggleMic: () => {},
  toggleToolbar: () => {},
  toggleStreamingMode: () => {},
});

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Use reducer for complex state management
  const [state, dispatch] = useReducer(chatReducer, {
    chats: loadFromStorage('chats', []),
    currentChat: null,
    currentModel: loadFromStorage('currentModel', AVAILABLE_MODELS[0]),
  });

  // UI state that doesn't need to be in the reducer
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [isMicActive, setIsMicActive] = useState<boolean>(false);
  const [showToolbar, setShowToolbar] = useState<boolean>(false);
  const [streamingEnabled, setStreamingEnabled] = useState<boolean>(
    loadFromStorage('streamingEnabled', false)
  );

  // Save state to localStorage when it changes
  useEffect(() => {
    saveToStorage('chats', state.chats);
  }, [state.chats]);

  useEffect(() => {
    saveToStorage('currentModel', state.currentModel);
  }, [state.currentModel]);

  useEffect(() => {
    saveToStorage('streamingEnabled', streamingEnabled);
  }, [streamingEnabled]);

  // Check if Puter is available and if user is logged in
  useEffect(() => {
    const checkLoginStatus = async () => {
      if (typeof window !== 'undefined' && (window as any).puter) {
        try {
          const user = await (window as any).puter.auth.getUser();
          setIsLoggedIn(!!user);
        } catch (error) {
          console.error('Error checking login status:', error);
          setIsLoggedIn(false);
        }
      }
    };

    checkLoginStatus();
  }, []);

  // Create a new chat
  const createNewChat = () => {
    dispatch({ type: 'CREATE_CHAT', payload: state.currentModel });
  };

  // Set current chat
  const setCurrentChat = (chatId: string) => {
    dispatch({ type: 'SET_CURRENT_CHAT', payload: chatId });
  };

  // Send a message
  const sendMessage = async (content: string) => {
    if (!state.currentChat) {
      createNewChat();
    }

    // Add user message
    dispatch({ 
      type: 'ADD_USER_MESSAGE', 
      payload: { 
        content, 
        chatId: state.currentChat?.id || '' 
      } 
    });

    // Generate AI response
    setIsStreaming(true);
    const messageId = generateId();

    // Add empty assistant message
    dispatch({ 
      type: 'ADD_ASSISTANT_MESSAGE', 
      payload: { 
        messageId, 
        chatId: state.currentChat?.id || '',
        model: state.currentModel
      } 
    });

    try {
      console.log(`Requesting ${state.currentModel.id} with streaming: ${streamingEnabled}`);
      const { message, stream } = await aiService.sendMessage(content, state.currentModel.id, streamingEnabled);
      
      if (streamingEnabled && stream) {
        // Handle streaming response
        let streamedContent = '';
        let reasoningContext = '';
        const isDeepSeekReasoner = state.currentModel.id === 'deepseek-reasoner';
        
        try {
          for await (const part of stream) {
            if (!isStreaming) break; // Stop generation if requested
            
            console.log("Stream part:", part);
            
            if (part === null || part === undefined) continue;
            
            let textContent = '';
            
            // Handle different streaming formats
            if (typeof part === 'string') {
              textContent = part;
            } else if (part.text) {
              textContent = typeof part.text === 'string' ? part.text : '';
            } else if (part.content) {
              textContent = part.content;
            } else if (part.message?.content) {
              textContent = part.message.content;
            }
            
            // Handle DeepSeek Reasoner specific format
            if (isDeepSeekReasoner && part.type === 'thinking') {
              reasoningContext += textContent;
            } else {
              streamedContent += textContent;
            }

            dispatch({
              type: 'UPDATE_ASSISTANT_MESSAGE',
              payload: {
                messageId,
                chatId: state.currentChat?.id || '',
                content: streamedContent,
                reasoningContext: isDeepSeekReasoner ? reasoningContext : undefined
              }
            });
          }
        } catch (streamError) {
          console.error("Streaming error:", streamError);
          toast.error(`Streaming error: ${streamError.message || 'Unknown error'}`);
          
          dispatch({
            type: 'UPDATE_ASSISTANT_MESSAGE',
            payload: {
              messageId,
              chatId: state.currentChat?.id || '',
              content: streamedContent || 'Sorry, there was an error while streaming the response.'
            }
          });
          
          setIsStreaming(false);
          return;
        }
      } else {
        // Handle non-streaming response
        dispatch({
          type: 'UPDATE_ASSISTANT_MESSAGE',
          payload: {
            messageId,
            chatId: state.currentChat?.id || '',
            content: message.content || 'No response received.'
          }
        });
      }
    } catch (error) {
      console.error('Error in AI response:', error);
      toast.error(`AI error: ${error.message || 'Unknown error'}`);
      
      dispatch({
        type: 'UPDATE_ASSISTANT_MESSAGE',
        payload: {
          messageId,
          chatId: state.currentChat?.id || '',
          content: 'Sorry, there was an error processing your request. Please try again.'
        }
      });
    } finally {
      setIsStreaming(false);
      dispatch({
        type: 'STOP_STREAMING',
        payload: {
          chatId: state.currentChat?.id || '',
          messageId
        }
      });
    }
  };

  // Update a message
  const updateMessage = (messageId: string, content: string) => {
    if (!state.currentChat) return;
    
    dispatch({
      type: 'UPDATE_MESSAGE',
      payload: {
        messageId,
        chatId: state.currentChat.id,
        content
      }
    });
  };

  // Delete a message
  const deleteMessage = (messageId: string) => {
    if (!state.currentChat) return;
    
    dispatch({
      type: 'DELETE_MESSAGE',
      payload: {
        messageId,
        chatId: state.currentChat.id
      }
    });
  };

  // Resend a message
  const resendMessage = (messageId: string) => {
    if (!state.currentChat) return;

    const message = state.currentChat.messages.find((m) => m.id === messageId);
    if (message && message.role === 'user') {
      sendMessage(message.content);
    }
  };

  // Retry an AI message
  const retryMessage = (messageId: string) => {
    if (!state.currentChat) return;

    const index = state.currentChat.messages.findIndex((m) => m.id === messageId);
    if (index >= 0 && state.currentChat.messages[index].role === 'assistant') {
      // Find the user message that prompted this response
      for (let i = index + 1; i < state.currentChat.messages.length; i++) {
        if (state.currentChat.messages[i].role === 'user') {
          sendMessage(state.currentChat.messages[i].content);
          break;
        }
      }
    }
  };

  // Set the current model
  const setModel = (model: typeof AVAILABLE_MODELS[number]) => {
    dispatch({ type: 'SET_MODEL', payload: model });
  };

  // Login to Puter
  const login = async () => {
    if (typeof window !== 'undefined' && (window as any).puter) {
      try {
        await (window as any).puter.auth.signIn();
        setIsLoggedIn(true);
        // Create a new chat if none exists
        if (state.chats.length === 0) {
          createNewChat();
        }
      } catch (error) {
        console.error('Error logging in:', error);
      }
    }
  };

  // Logout from Puter
  const logout = () => {
    if (typeof window !== 'undefined' && (window as any).puter) {
      (window as any).puter.auth.signOut();
      setIsLoggedIn(false);
    }
  };

  // Stop generation
  const stopGeneration = () => {
    setIsStreaming(false);
  };

  // Toggle microphone
  const toggleMic = () => {
    if (!isMicActive) {
      activateSpeechToText();
    } else {
      deactivateSpeechToText();
    }
  };

  // Speech to text functionality
  const [recognition, setRecognition] = useState<any>(null);
  const [transcript, setTranscript] = useState('');

  // Declare SpeechRecognition interface for TypeScript
  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number;
    error?: any;
  }

  interface SpeechRecognitionResultList {
    length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
  }

  interface SpeechRecognitionResult {
    length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
    isFinal: boolean;
  }

  interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
  }
  
  interface SpeechRecognitionInterface extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start: () => void;
    stop: () => void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: Event) => void;
    onend: () => void;
    onstart: () => void;
  }

  interface SpeechRecognitionConstructor {
    new (): SpeechRecognitionInterface;
  }

  const activateSpeechToText = () => {
    try {
      // Request microphone access
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          // Check if SpeechRecognition is available
          const SpeechRecognition = window.SpeechRecognition || 
            (window as any).webkitSpeechRecognition as SpeechRecognitionConstructor;
          
          if (SpeechRecognition) {
            const recognitionInstance = new SpeechRecognition();
            recognitionInstance.continuous = true;
            recognitionInstance.interimResults = true;
            recognitionInstance.lang = 'en-US';
            
            recognitionInstance.onstart = () => {
              setIsMicActive(true);
              console.log('Speech recognition started');
            };
            
            recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
              let interimTranscript = '';
              let finalTranscript = '';
              
              for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                  finalTranscript += transcript + ' ';
                } else {
                  interimTranscript += transcript;
                }
              }
              
              // Update transcript in state
              setTranscript(finalTranscript || interimTranscript);
              
              // Dispatch a custom event that the ChatInput component can listen for
              const transcriptEvent = new CustomEvent('speech-transcript', { 
                detail: { transcript: finalTranscript || interimTranscript } 
              });
              document.dispatchEvent(transcriptEvent);
            };
            
            recognitionInstance.onerror = (event) => {
              console.error('Speech recognition error', event.error);
              setIsMicActive(false);
            };
            
            recognitionInstance.onend = () => {
              setIsMicActive(false);
              console.log('Speech recognition ended');
            };
            
            // Start recognition
            recognitionInstance.start();
            setRecognition(recognitionInstance);
          } else {
            toast.error('Speech recognition is not supported in this browser');
          }
        })
        .catch((err) => {
          console.error('Error accessing microphone:', err);
          toast.error('Could not access microphone');
        });
    } catch (error) {
      console.error('Error setting up speech recognition:', error);
      toast.error('Error setting up speech recognition');
    }
  };

  const deactivateSpeechToText = () => {
    if (recognition) {
      recognition.stop();
      setRecognition(null);
    }
    setIsMicActive(false);
  };

  // Toggle toolbar
  const toggleToolbar = () => {
    setShowToolbar(!showToolbar);
  };

  // Toggle streaming mode
  const toggleStreamingMode = () => {
    setStreamingEnabled(!streamingEnabled);
  };

  // Initialize with a default chat
  useEffect(() => {
    if (state.chats.length === 0) {
      createNewChat();
    } else if (state.chats.length > 0 && !state.currentChat) {
      setCurrentChat(state.chats[0].id);
    }
  }, []);

  return (
    <ChatContext.Provider
      value={{
        chats: state.chats,
        currentChat: state.currentChat,
        currentModel: state.currentModel,
        AVAILABLE_MODELS,
        isLoggedIn,
        isStreaming,
        isMicActive,
        showToolbar,
        streamingEnabled,
        createNewChat,
        setCurrentChat,
        sendMessage,
        updateMessage,
        deleteMessage,
        resendMessage,
        retryMessage,
        setModel,
        login,
        logout,
        stopGeneration,
        toggleMic,
        toggleToolbar,
        toggleStreamingMode,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to use the chat context
export const useChat = () => useContext(ChatContext);
