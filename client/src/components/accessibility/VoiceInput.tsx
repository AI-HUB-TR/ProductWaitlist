import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Mic, StopCircle, Volume2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSpeech } from "@/hooks/use-speech";
import { cn } from "@/lib/utils";

// WebSpeechAPI için tip tanımları
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

// Global SpeechRecognition nesnesi için tip
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

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface VoiceInputProps {
  onResult: (transcript: string) => void;
  onPartialResult?: (transcript: string) => void;
  placeholder?: string;
  lang?: string;
  className?: string;
  buttonVariant?: "icon" | "text" | "combined" | "simple";
  autoStop?: boolean;
  autoStopTime?: number; // Milisaniye cinsinden
  speakPlaceholder?: boolean;
}

export default function VoiceInput({
  onResult,
  onPartialResult,
  placeholder = "Konuşarak giriş yapın...",
  lang = "tr-TR",
  className,
  buttonVariant = "icon",
  autoStop = true,
  autoStopTime = 2000, // 2 saniye
  speakPlaceholder = false
}: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isFirstMount, setIsFirstMount] = useState(true);
  const { speak } = useSpeech();

  // Web Speech API desteği kontrolü
  useEffect(() => {
    const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (speechRecognition) {
      setIsSpeechSupported(true);
      const recognitionInstance = new speechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = lang;
      setRecognition(recognitionInstance);
    } else {
      setIsSpeechSupported(false);
      console.warn("Tarayıcınız ses tanıma özelliğini desteklemiyor.");
    }
  }, [lang]);

  // Konuşma sonuçlarını işle
  const handleResult = useCallback((event: SpeechRecognitionEvent) => {
    const { results } = event;
    const result = results[results.length - 1];
    const { transcript } = result[0];
    
    setTranscript(transcript);
    
    if (result.isFinal) {
      onResult(transcript);
      setIsListening(false);
      recognition?.stop();
    } else if (onPartialResult) {
      onPartialResult(transcript);
    }
  }, [onResult, onPartialResult, recognition]);

  // Dinlemeyi bitir
  const handleEnd = useCallback(() => {
    setIsListening(false);
  }, []);

  // Hata işleme
  const handleError = useCallback((event: any) => {
    console.error("Ses tanıma hatası:", event.error);
    setIsListening(false);
  }, []);

  // Olay dinleyicilerinin ayarlanması
  useEffect(() => {
    if (!recognition) return;
    
    recognition.onresult = handleResult;
    recognition.onend = handleEnd;
    recognition.onerror = handleError;
    
    return () => {
      recognition.onresult = null;
      recognition.onend = null;
      recognition.onerror = null;
    };
  }, [recognition, handleResult, handleEnd, handleError]);

  // Otomatik durdurma
  useEffect(() => {
    let silenceTimer: NodeJS.Timeout | null = null;
    
    if (isListening && autoStop) {
      silenceTimer = setTimeout(() => {
        recognition?.stop();
        setIsListening(false);
      }, autoStopTime);
    }
    
    return () => {
      if (silenceTimer) clearTimeout(silenceTimer);
    };
  }, [isListening, autoStop, autoStopTime, recognition]);

  // Komponentin ilk yüklenmesinde yer tutucu metni seslendir
  useEffect(() => {
    if (isFirstMount && speakPlaceholder) {
      speak(placeholder);
      setIsFirstMount(false);
    }
  }, [isFirstMount, speak, placeholder, speakPlaceholder]);

  // Dinlemeyi başlat
  const startListening = () => {
    if (!recognition) return;
    
    setTranscript("");
    setIsListening(true);
    recognition.start();
  };

  // Dinlemeyi durdur
  const stopListening = () => {
    if (!recognition) return;
    
    setIsListening(false);
    recognition.stop();
  };

  // Yardım metnini seslendir
  const speakHelp = () => {
    speak("Sesli giriş. " + placeholder);
  };

  if (!isSpeechSupported) {
    return (
      <div className={cn("text-sm text-muted-foreground", className)}>
        Tarayıcınız ses tanıma özelliğini desteklemiyor.
      </div>
    );
  }

  return (
    <div className={cn("flex items-center", className)}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {buttonVariant === "icon" && (
              <Button
                type="button"
                size="icon"
                variant={isListening ? "destructive" : "outline"}
                onClick={isListening ? stopListening : startListening}
                className={isListening ? "animate-pulse" : ""}
                aria-label={isListening ? "Dinlemeyi durdur" : "Sesli giriş yap"}
              >
                {isListening ? (
                  <StopCircle className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
            )}

            {buttonVariant === "text" && (
              <Button
                type="button"
                variant={isListening ? "destructive" : "outline"}
                onClick={isListening ? stopListening : startListening}
                className={isListening ? "animate-pulse" : ""}
              >
                {isListening ? "Dinlemeyi Durdur" : "Sesli Giriş"}
              </Button>
            )}

            {buttonVariant === "combined" && (
              <Button
                type="button"
                variant={isListening ? "destructive" : "outline"}
                onClick={isListening ? stopListening : startListening}
                className={isListening ? "animate-pulse" : ""}
              >
                {isListening ? (
                  <>
                    <StopCircle className="h-4 w-4 mr-2" />
                    Dinlemeyi Durdur
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4 mr-2" />
                    Sesli Giriş
                  </>
                )}
              </Button>
            )}

            {buttonVariant === "simple" && (
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={cn(
                  "p-2 rounded-full flex items-center justify-center",
                  isListening 
                    ? "bg-red-500 text-white animate-pulse" 
                    : "bg-blue-500 text-white"
                )}
                aria-label={isListening ? "Dinlemeyi durdur" : "Sesli giriş yap"}
              >
                {isListening ? (
                  <StopCircle className="h-5 w-5" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </button>
            )}
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <div className="space-y-1">
              <p>{isListening ? "Dinlemeyi durdur" : "Sesli giriş yap"}</p>
              <p className="text-xs text-muted-foreground">{placeholder}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {transcript && (
        <div className="ml-2 text-sm italic text-muted-foreground">
          "{transcript}"
        </div>
      )}

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={speakHelp}
        className="ml-1"
        aria-label="Sesli yardım"
      >
        <Volume2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

// Bileşeni ses girişini desteklemeyen tarayıcılarda güvenli bir şekilde kullanmak için bir kontrol bileşeni
export function VoiceInputIfSupported(props: VoiceInputProps) {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!speechRecognition);
  }, []);

  if (!isSupported) {
    return null;
  }

  return <VoiceInput {...props} />;
}