import { useState, useCallback, useEffect } from "react";

export function useSpeech() {
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSpeechSynthesis(window.speechSynthesis);
    }
  }, []);
  
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
    toggleVoice
  };
}
