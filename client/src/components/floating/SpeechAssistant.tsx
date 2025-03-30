import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  [index: number]: SpeechRecognitionResult;
  item(index: number): SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  [index: number]: SpeechRecognitionAlternative;
  item(index: number): SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: ((event: Event) => void) | null;
  onerror: ((event: Event) => void) | null;
}

// Web Speech API'nin tiplerini tanımla
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export default function SpeechAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [showTranscript, setShowTranscript] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);

  // Web Speech API desteğini kontrol et
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "tr-TR"; // Türkçe dil desteği
      setRecognition(recognition);
      setIsSpeechSupported(true);
      
      // Local storage'dan ses tercihini yükle
      const voiceEnabled = localStorage.getItem('voiceEnabled');
      if (voiceEnabled !== null) {
        setIsVoiceEnabled(voiceEnabled === 'true');
      }
      
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          }
        }
        
        if (finalTranscript) {
          setTranscript(finalTranscript);
          setShowTranscript(true);
          
          // Komut işleme
          handleCommand(finalTranscript);
          
          // 5 saniye sonra transcript'i gizle
          setTimeout(() => {
            setShowTranscript(false);
            setTranscript("");
          }, 5000);
        }
      };
      
      recognition.onend = () => {
        if (isListening) {
          recognition.start();
        }
      };
    }
    
    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  }, [isListening]);

  // Mikrofonu aç/kapa
  const toggleListening = () => {
    if (!recognition) return;
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
      setShowTranscript(true);
      
      // 2 saniye sonra boş transcript göster
      setTimeout(() => {
        if (!transcript) {
          setTranscript("Sizi dinliyorum...");
        }
      }, 2000);
    }
  };

  // Sesi aç/kapa
  const toggleVoice = () => {
    const newValue = !isVoiceEnabled;
    setIsVoiceEnabled(newValue);
    localStorage.setItem('voiceEnabled', String(newValue));
  };

  // Komut işleme fonksiyonu
  const handleCommand = (command: string) => {
    // Başlangıç komutu kontrolü
    const lowerCommand = command.toLowerCase().trim();
    
    // Sayfaya yönlendirme komutları
    if (lowerCommand.includes("anasayfa") || lowerCommand.includes("ana sayfa")) {
      window.location.href = "/";
    } else if (lowerCommand.includes("chat") || lowerCommand.includes("sohbet")) {
      window.location.href = "/chat-demo";
    } else if (lowerCommand.includes("hafıza oyunu") || lowerCommand.includes("oyun")) {
      window.location.href = "/games/memory";
    } else if (lowerCommand.includes("topluluk") || lowerCommand.includes("forum")) {
      window.location.href = "/community";
    } else if (lowerCommand.includes("yardım") || lowerCommand.includes("nasıl kullanılır")) {
      // Yardım butonuna tıkla
      const helpButton = document.querySelector('[aria-label="Yardım"]') as HTMLButtonElement;
      if (helpButton) {
        helpButton.click();
      }
    }
    
    // Zeki veya Bot kelimesi ile başlayan sorgu
    if (lowerCommand.startsWith("zeki") || lowerCommand.startsWith("bot")) {
      // Chatbot entegrasyonu burada olacak
      console.log("Yapay zeka sorgusu:", lowerCommand);
    }
  };

  if (!isSpeechSupported) return null;
  
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end space-y-2">
      {/* Ses açma/kapama butonu */}
      <Button
        variant="outline"
        size="icon"
        onClick={toggleVoice}
        className={`rounded-full w-10 h-10 ${
          isVoiceEnabled ? "bg-[#1565C0] text-white" : "bg-white text-[#1565C0]"
        }`}
        aria-label={isVoiceEnabled ? "Sesi kapat" : "Sesi aç"}
      >
        {isVoiceEnabled ? (
          <Volume2 className="h-5 w-5" />
        ) : (
          <VolumeX className="h-5 w-5" />
        )}
      </Button>
      
      {/* Mikrofon butonu */}
      <div className="relative">
        {showTranscript && transcript && (
          <div className="absolute bottom-full mb-2 p-3 bg-white rounded-lg shadow-lg min-w-[200px] max-w-[300px] text-sm right-0">
            <p>{transcript}</p>
            <div className="absolute -bottom-2 right-5 w-4 h-4 rotate-45 bg-white"></div>
          </div>
        )}
        
        <Button
          variant="outline"
          size="icon"
          onClick={toggleListening}
          className={`rounded-full w-14 h-14 ${
            isListening ? "bg-[#1565C0] text-white animate-pulse" : "bg-white text-[#1565C0]"
          }`}
          aria-label={isListening ? "Mikrofonu kapat" : "Sesli komut ver"}
        >
          {isListening ? (
            <MicOff className="h-6 w-6" />
          ) : (
            <Mic className="h-6 w-6" />
          )}
        </Button>
      </div>
    </div>
  );
}