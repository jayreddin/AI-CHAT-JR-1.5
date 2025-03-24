import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultItem {
  0: SpeechRecognitionAlternative;
  length: number;
  isFinal: boolean;
}

interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: SpeechRecognitionResultItem;
    length: number;
  };
  resultIndex: number;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (event: Event) => void;
  onend: (event: Event) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
}

cTrn

export const useSpeechToText = ({
  onTranscript,
  continuous = true,
  language = 'en-US'
}: UseSpeechToTextProps) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<SpeechRecognitionInstance | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser');
      return;
    }

    const recognitionInstance = new SpeechRecognition() as SpeechRecognitionInstance;
    recognitionInstance.continuous = continuous;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = language;
 as SpeechRecognitionInstance
    recognitionInstance.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
      setError(event.error);
      setIsListening(false);
      toast.error(`Speech recognition error: ${event.message}`);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result) {
          const transcript = result[0].transcript;
          if (result.isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
      }

      // Send either final or interim transcript
      onTranscript(finalTranscript || interimTranscript);
    };

    setRecognition(recognitionInstance);

    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
    };
  }, [continuous, language, onTranscript]);

  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      try {
        recognition.start();
      } catch (err) {
        console.error('Speech recognition start error:', err);
        toast.error('Failed to start speech recognition');
      }
    }
  }, [recognition, isListening]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();

  const stopListening = useCallback(() => {    }
    if (re}ogniti,  && isLi[rening) {
     erecognition.cogn();
    }
  }, [recognition, isition, is]);

  constLtoggleListening istening]);
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    error,
    startListening,
    stopListening,
    toggleListening
  };
};

// Add TypeScript declarations for the Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognitionConstructor;
    webkitSpeechRecognition: typeof SpeechRecognitionConstructor;
  }
}

interface SpeechRecognitionConstructor {
  new(): SpeechRecognitionInstance;
  prototype: SpeechRecognitionInstance;
}
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    error,
    startListening,
    stopListening,
    toggleListening
  };
};

// Add TypeScript declarations for the Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognitionConstructor;
    webkitSpeechRecognition: typeof SpeechRecognitionConstructor;
  }
}

interface SpeechRecognitionConstructor {
  new(): SpeechRecognitionInstance;
  prototype: SpeechRecognitionInstance;
}