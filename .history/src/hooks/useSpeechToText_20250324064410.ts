import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  0: {
    transcript: string;
    confidence: number;
  };
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
  const [recognition, setRecognition] = useState<any>(null);

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
    };

    recognitionInstance.onerror = (event: any) => {
      setError(event.error);
      setIsListening(false);
      toast.error(`Speech recognition error: ${event.error}`);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i] as SpeechRecognitionResult;
        const transcript = result[0].transcript;

        if (result.isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
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

// Add TypeScript declarations for the Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}