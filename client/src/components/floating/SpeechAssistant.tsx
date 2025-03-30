import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, X, Volume2, MessageCircle } from "lucide-react";
import { useSpeech } from "@/hooks/use-speech";
import { sendChatMessage } from "@/lib/api";

export default function SpeechAssistant() {
  const speech = useSpeech();
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
        className={`fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg z-50 ${
          isOpen ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-primary/90"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </Button>

      {/* Asistan paneli */}
      <div
        className={`fixed bottom-24 right-6 transition-all duration-300 transform ${
          isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        } z-40`}
      >
        <Card className="w-80 md:w-96 shadow-lg border-2">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Sesli Asistan</h3>
            </div>

            <div className="bg-muted/30 rounded-lg p-3 min-h-24 mb-4 text-sm">
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
              <div className="bg-primary/10 rounded-lg p-3 mb-4">
                <p className="font-semibold mb-1">Siz:</p>
                <p className="text-sm">{message}</p>
              </div>
            )}

            <div className="flex justify-between space-x-2">
              <Button
                variant="outline"
                className={`flex-1 ${isLocalListening ? "bg-red-50 text-red-500 border-red-200" : ""}`}
                onClick={toggleListening}
              >
                <Mic className={`mr-2 h-4 w-4 ${isLocalListening ? "animate-pulse text-red-500" : ""}`} />
                {isLocalListening ? "Kaydı Durdur" : "Ses Kaydet"}
              </Button>

              {message && (
                <Button 
                  className="flex-1" 
                  onClick={handleSendMessage}
                  disabled={isLoading}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Gönder
                </Button>
              )}
              
              {response && (
                <Button
                  variant="outline"
                  className={`flex-none ${speech.isSpeaking ? "bg-primary/20" : ""}`}
                  onClick={() => speech.speak(response)}
                  disabled={isLoading || speech.isSpeaking}
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}