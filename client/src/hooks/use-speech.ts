import { useState, useCallback, useEffect } from "react";

export function useSpeech() {
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [recognition, setRecognition] = useState<any>(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSpeechSynthesis(window.speechSynthesis);
      
      // Set up speech recognition
      const SpeechRecognition = (window as any).SpeechRecognition || 
                              (window as any).webkitSpeechRecognition;
                              
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = 'tr-TR';
        
        recognitionInstance.onresult = (event: any) => {
          const result = event.results[0];
          if (result.isFinal) {
            setTranscript(result[0].transcript);
          }
        };
        
        recognitionInstance.onend = () => {
          setIsListening(false);
        };
        
        recognitionInstance.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };
        
        setRecognition(recognitionInstance);
      }
    }
  }, []);
  
  const startListening = useCallback(() => {
    if (!recognition) return;
    
    try {
      recognition.start();
      setIsListening(true);
      setTranscript("");
    } catch (error) {
      console.error("Error starting speech recognition:", error);
    }
  }, [recognition]);
  
  const stopListening = useCallback(() => {
    if (!recognition) return;
    
    try {
      recognition.stop();
      setIsListening(false);
    } catch (error) {
      console.error("Error stopping speech recognition:", error);
    }
  }, [recognition]);
  
  const toggleVoice = useCallback(() => {
    setIsVoiceEnabled(prev => !prev);
    
    // If disabling voice, stop any ongoing speech
    if (isVoiceEnabled && speechSynthesis) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isVoiceEnabled, speechSynthesis]);
  
  const speak = useCallback((text: string) => {
    if (!isVoiceEnabled || !speechSynthesis) return;
    
    // Cancel any ongoing speech
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to find a Turkish voice
    const voices = speechSynthesis.getVoices();
    const turkishVoice = voices.find(voice => voice.lang === 'tr-TR');
    
    if (turkishVoice) {
      utterance.voice = turkishVoice;
    }
    
    utterance.lang = 'tr-TR';
    utterance.rate = 0.9; // Slightly slower for better comprehension
    utterance.pitch = 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    speechSynthesis.speak(utterance);
  }, [isVoiceEnabled, speechSynthesis]);
  
  return {
    speak,
    isSpeaking,
    isVoiceEnabled,
    toggleVoice,
    startListening,
    stopListening,
    isListening,
    transcript
  };
}
