import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useSpeech } from "@/hooks/use-speech";
import { Loader2 } from "lucide-react";

interface ChatMessage {
  sender: "user" | "bot";
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  fullPage?: boolean;
}

export default function ChatInterface({ fullPage = false }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "bot",
      content: "Merhaba! Size nasıl yardımcı olabilirim? Sağlık, günlük yaşam, haberler veya başka bir konuda bilgi almak istediğiniz bir şey var mı?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { speak, isSpeaking, isVoiceEnabled, toggleVoice } = useSpeech();
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // When a new bot message is added, speak it if voice is enabled
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.sender === "bot" && isVoiceEnabled) {
      speak(lastMessage.content);
    }
  }, [messages, isVoiceEnabled, speak]);
  
  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/chat", { message });
      return response.json();
    },
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          content: data.message,
          timestamp: new Date(),
        },
      ]);
    },
    onError: (error) => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          content: "Üzgünüm, bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.",
          timestamp: new Date(),
        },
      ]);
    },
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inputValue.trim() === "") return;
    
    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        content: inputValue,
        timestamp: new Date(),
      },
    ]);
    
    // Send to API
    chatMutation.mutate(inputValue);
    
    // Clear input
    setInputValue("");
  };
  
  const askSampleQuestion = (question: string) => {
    setInputValue(question);
    
    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        content: question,
        timestamp: new Date(),
      },
    ]);
    
    // Send to API
    chatMutation.mutate(question);
  };
  
  return (
    <Card className={`max-w-3xl mx-auto ${fullPage ? "min-h-[500px]" : ""}`}>
      <CardContent className="p-4">
        <div className="bg-[#F5F5F5] p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">AI Asistanı</h3>
            <Button 
              variant="ghost" 
              onClick={toggleVoice}
              className="flex items-center text-[#1565C0]"
            >
              <span className="material-icons mr-1">
                {isVoiceEnabled ? "volume_up" : "volume_off"}
              </span>
              <span className="text-lg">{isVoiceEnabled ? "Sesli Yanıt Açık" : "Sesli Yanıt Kapalı"}</span>
            </Button>
          </div>
          
          <div 
            className="space-y-4 mb-6 overflow-y-auto" 
            style={{ 
              minHeight: fullPage ? "400px" : "200px", 
              maxHeight: fullPage ? "60vh" : "300px" 
            }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`p-3 rounded-lg shadow max-w-[80%] ${
                    message.sender === "user"
                      ? "bg-[#1565C0] text-white"
                      : "bg-white"
                  }`}
                >
                  <p className="text-lg">{message.content}</p>
                </div>
              </div>
            ))}
            
            {chatMutation.isPending && (
              <div className="flex justify-start">
                <div className="bg-white rounded-lg p-3 shadow max-w-[80%]">
                  <div className="flex items-center">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    <p className="text-lg">Yanıt hazırlanıyor...</p>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSubmit} className="flex">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Sorunuzu buraya yazınız..."
              className="h-12 text-lg border-2 border-[#E0E0E0] rounded-l-lg rounded-r-none"
            />
            <Button
              type="submit"
              className="bg-[#1565C0] text-white px-4 h-12 rounded-r-lg rounded-l-none flex items-center"
              disabled={chatMutation.isPending}
            >
              <span className="material-icons">send</span>
            </Button>
          </form>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => askSampleQuestion("Bugün hava nasıl olacak?")}
            className="bg-[#F5F5F5] hover:bg-[#E0E0E0] px-4 py-2 h-auto text-lg font-normal"
          >
            Bugün hava nasıl olacak?
          </Button>
          <Button
            variant="outline"
            onClick={() => askSampleQuestion("Tansiyon için ne yapmalıyım?")}
            className="bg-[#F5F5F5] hover:bg-[#E0E0E0] px-4 py-2 h-auto text-lg font-normal"
          >
            Tansiyon için ne yapmalıyım?
          </Button>
          <Button
            variant="outline"
            onClick={() => askSampleQuestion("Akşam yemeği için tarif öner")}
            className="bg-[#F5F5F5] hover:bg-[#E0E0E0] px-4 py-2 h-auto text-lg font-normal"
          >
            Akşam yemeği için tarif öner
          </Button>
        </div>

        {!fullPage && (
          <div className="text-center">
            <p className="text-lg mb-4">Bu sadece bir demadır. Gerçek uygulama daha fazla özellik sunacaktır.</p>
            <Button 
              className="bg-[#1565C0] hover:bg-[#0D47A1] text-white text-xl py-4 px-8 h-auto font-semibold rounded-lg"
              onClick={() => {
                const waitlistSection = document.getElementById("waitlist");
                if (waitlistSection) {
                  waitlistSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              Bekleme Listesine Katıl
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
