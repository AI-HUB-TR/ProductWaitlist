import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, X, Volume2, Bot } from "lucide-react";
import { useSpeech } from "@/hooks/use-speech";
import { sendChatMessage } from "@/lib/api";
import { useIsMobile } from "@/hooks/use-mobile";

export default function SpeechAssistant() {
  const speech = useSpeech();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [isLocalListening, setIsLocalListening] = useState(false);
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Ses tanıma işlemi
  useEffect(() => {
    if (speech.transcript) {
      setMessage(speech.transcript);
    }
  }, [speech.transcript]);

  // Konuşma başlatma ve durdurma
  const toggleListening = () => {
    if (isLocalListening) {
      speech.stopListening();
      setIsLocalListening(false);
    } else {
      speech.startListening();
      setIsLocalListening(true);
      setMessage("");
    }
  };

  // Mesajı gönderme
  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    setIsLoading(true);
    try {
      const result = await sendChatMessage(message);
      setResponse(result.message);
      
      // Yanıtı sesli olarak oku
      speech.speak(result.message);
    } catch (error) {
      console.error("Error sending message:", error);
      setResponse("Üzgünüm, bir hata oluştu. Lütfen tekrar deneyiniz.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Sabit pozisyonlu buton */}
      <Button
        className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 rounded-full w-12 h-12 md:w-14 md:h-14 shadow-lg z-50 ${
          isOpen ? "bg-red-500 hover:bg-red-600" : "bg-[#1565C0] hover:bg-[#1565C0]/90"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={isMobile ? 20 : 24} /> : <Bot size={isMobile ? 20 : 24} />}
      </Button>

      {/* Asistan paneli */}
      <div
        className={`fixed bottom-20 md:bottom-24 right-2 md:right-6 transition-all duration-300 transform ${
          isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        } z-40`}
      >
        <Card className="w-[calc(100vw-20px)] max-w-[350px] md:w-96 shadow-lg border-2 border-[#e6e0d4]">
          <div className="p-3 md:p-4">
            <div className="flex justify-between items-center mb-3 md:mb-4">
              <h3 className="text-base md:text-lg font-semibold text-[#1565C0] flex items-center">
                <Bot className="mr-2 h-4 w-4" /> 
                Sesli Asistan
              </h3>
            </div>

            <div className="bg-[#f9f8f5] rounded-lg p-3 min-h-20 md:min-h-24 mb-3 md:mb-4 text-sm">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p>Yanıt bekleniyor...</p>
                </div>
              ) : response ? (
                <div>
                  <p className="font-semibold mb-1">Asistan:</p>
                  <p>{response}</p>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p>Sesinizi kaydetmek için mikrofon düğmesine basın</p>
                </div>
              )}
            </div>

            {message && (
              <div className="bg-[#1565C0]/10 rounded-lg p-3 mb-3 md:mb-4">
                <p className="font-semibold mb-1">Siz:</p>
                <p className="text-sm">{message}</p>
              </div>
            )}

            <div className="flex justify-between space-x-2">
              <Button
                variant="outline"
                className={`flex-1 ${isLocalListening ? "bg-red-50 text-red-500 border-red-200" : ""}`}
                onClick={toggleListening}
                size={isMobile ? "sm" : "default"}
              >
                <Mic className={`mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4 ${isLocalListening ? "animate-pulse text-red-500" : ""}`} />
                {isLocalListening ? "Kaydı Durdur" : "Ses Kaydet"}
              </Button>

              {message && (
                <Button 
                  className="flex-1 bg-[#1565C0] hover:bg-[#1565C0]/90" 
                  onClick={handleSendMessage}
                  disabled={isLoading}
                  size={isMobile ? "sm" : "default"}
                >
                  <Bot className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                  Gönder
                </Button>
              )}
              
              {response && (
                <Button
                  variant="outline"
                  className={`flex-none ${speech.isSpeaking ? "bg-[#1565C0]/20" : ""}`}
                  onClick={() => speech.speak(response)}
                  disabled={isLoading || speech.isSpeaking}
                  size={isMobile ? "sm" : "default"}
                >
                  <Volume2 className="h-3 w-3 md:h-4 md:w-4" />
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}