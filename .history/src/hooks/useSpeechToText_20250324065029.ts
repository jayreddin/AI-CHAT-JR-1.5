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

interface SpeechRecognitionStatic {
  new(): SpeechRecognitionInstance;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionStatic;
    webkitSpeechRecognition?: SpeechRecognitionStatic;
  }
}

interface UseSpeechToTextProps {
  onTranscript: (text: string) => void;
  continuous?: boolean;
  language?: string;
}

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

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = continuous;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = language;

    recognitionInstance.onstart = () => {
      setIsListening(true);
      setError(null);
      toast.success('Listening...');
    };

    recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
      setError(event.error);
      setIsListening(false);
      toast.error(`Speech recognition error: ${event.message}`);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
      if (!error) {
        toast.info('Stopped listening');
      }
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
  }, [continuous, language, onTranscript, error]);

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
    }
  }, [recognition, isListening]);

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
