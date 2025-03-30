import { useState, useEffect, useCallback, useRef } from 'react';

// Konuşma sentezleyici için hook
export function useSpeech() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Tarayıcı desteğini kontrol et ve sentezleyiciyi başlat
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;
      
      // Mevcut sesleri al
      const loadVoices = () => {
        const availableVoices = synthRef.current?.getVoices() || [];
        setVoices(availableVoices);
      };
      
      // Chrome ve diğer tarayıcılar için farklı olay dinleyicileri
      if (synthRef.current.onvoiceschanged !== undefined) {
        synthRef.current.onvoiceschanged = loadVoices;
      }
      
      loadVoices();
      
      // Temizleme fonksiyonu
      return () => {
        if (synthRef.current && utteranceRef.current) {
          synthRef.current.cancel();
        }
      };
    }
  }, []);
  
  // Konuşmayı başlat
  const speak = useCallback((text: string, options: { rate?: number; pitch?: number; voice?: SpeechSynthesisVoice } = {}) => {
    if (!synthRef.current) return;
    
    // Mevcut konuşmayı durdur
    if (utteranceRef.current && synthRef.current.speaking) {
      synthRef.current.cancel();
    }
    
    // Yeni bir konuşma oluştur
    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    
    // Türkçe ses için en uygun sesi bul
    const turkishVoice = voices.find(voice => 
      voice.lang.includes('tr') || voice.lang.includes('TR')
    );
    
    // Opsiyonları ayarla
    utterance.voice = options.voice || turkishVoice || voices[0];
    utterance.rate = options.rate || 1;
    utterance.pitch = options.pitch || 1;
    
    // Olayları dinle
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onpause = () => setIsPaused(true);
    utterance.onresume = () => setIsPaused(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    
    // Konuşmayı başlat
    synthRef.current.speak(utterance);
  }, [voices]);
  
  // Konuşmayı duraklat
  const pauseSpeech = useCallback(() => {
    if (synthRef.current && isSpeaking && !isPaused) {
      synthRef.current.pause();
      setIsPaused(true);
    }
  }, [isSpeaking, isPaused]);
  
  // Konuşmayı devam ettir
  const resumeSpeech = useCallback(() => {
    if (synthRef.current && isPaused) {
      synthRef.current.resume();
      setIsPaused(false);
    }
  }, [isPaused]);
  
  // Konuşmayı iptal et
  const cancelSpeech = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  }, []);
  
  // Ses asistanını aç/kapat
  const toggleVoice = useCallback(() => {
    setIsVoiceEnabled(prev => !prev);
  }, []);
  
  return {
    speak,
    pauseSpeech,
    resumeSpeech,
    cancelSpeech,
    isSpeaking,
    isPaused,
    voices,
    isVoiceEnabled,
    toggleVoice,
    supported: typeof window !== 'undefined' && !!window.speechSynthesis
  };
}