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
    <Card className={`max-w-3xl mx-auto ${fullPage ? "min-h-[500px]" : ""} border-0 shadow-none`}>
      <CardContent className="p-4">
        <div className="bg-[#f7f5f0] p-4 rounded-lg mb-6 border border-[#e0dcd0]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg md:text-xl font-semibold text-[#1565C0] flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C6.5 2 2 6.5 2 12c0 1.4.3 2.8.8 4 .1.3.2.6.3.9l-1 3c-.2.7.5 1.4 1.2 1.2l3-1c.3.1.6.2.9.3 1.2.5 2.6.8 4 .8 5.5 0 10-4.5 10-10S17.5 2 12 2z"/>
                <path d="M8 9h8M8 13h6"/>
              </svg>
              AI Asistanı
            </h3>
            <Button 
              variant="ghost" 
              onClick={toggleVoice}
              className="flex items-center text-[#1565C0]"
              size="sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {isVoiceEnabled ? (
                  <>
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                  </>
                ) : (
                  <>
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <line x1="23" y1="9" x2="17" y2="15"></line>
                    <line x1="17" y1="9" x2="23" y2="15"></line>
                  </>
                )}
              </svg>
              <span className="text-sm">{isVoiceEnabled ? "Sesli Yanıt Açık" : "Sesli Yanıt Kapalı"}</span>
            </Button>
          </div>
          
          <div 
            className="space-y-3 mb-4 overflow-y-auto rounded-lg bg-white border border-[#e0dcd0] p-3" 
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
                  className={`p-3 rounded-lg shadow-sm max-w-[80%] ${
                    message.sender === "user"
                      ? "bg-[#1565C0] text-white"
                      : "bg-[#f7f5f0]"
                  }`}
                >
                  <p className="text-sm md:text-base">{message.content}</p>
                </div>
              </div>
            ))}
            
            {chatMutation.isPending && (
              <div className="flex justify-start">
                <div className="bg-[#f7f5f0] rounded-lg p-3 shadow-sm max-w-[80%]">
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <p className="text-sm md:text-base">Yanıt hazırlanıyor...</p>
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
              className="h-10 md:h-12 text-sm md:text-base border border-[#e0dcd0] rounded-l-lg rounded-r-none"
            />
            <Button
              type="submit"
              className="bg-[#1565C0] hover:bg-[#0D47A1] text-white px-3 md:px-4 h-10 md:h-12 rounded-r-lg rounded-l-none flex items-center"
              disabled={chatMutation.isPending}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </Button>
          </form>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <Button
            variant="outline"
            onClick={() => askSampleQuestion("Bugün hava nasıl olacak?")}
            className="bg-[#f7f5f0] hover:bg-[#e0dcd0] px-2 py-1 h-auto text-sm border border-[#e0dcd0]"
            size="sm"
          >
            Bugün hava nasıl olacak?
          </Button>
          <Button
            variant="outline"
            onClick={() => askSampleQuestion("Tansiyon için ne yapmalıyım?")}
            className="bg-[#f7f5f0] hover:bg-[#e0dcd0] px-2 py-1 h-auto text-sm border border-[#e0dcd0]"
            size="sm"
          >
            Tansiyon için ne yapmalıyım?
          </Button>
          <Button
            variant="outline"
            onClick={() => askSampleQuestion("Akşam yemeği için tarif öner")}
            className="bg-[#f7f5f0] hover:bg-[#e0dcd0] px-2 py-1 h-auto text-sm border border-[#e0dcd0]"
            size="sm"
          >
            Akşam yemeği için tarif öner
          </Button>
        </div>

        {!fullPage && (
          <div className="text-center">
            <p className="text-sm mb-4">Bu sadece bir demadır. Gerçek uygulama daha fazla özellik sunacaktır.</p>
            <Button 
              className="bg-[#1565C0] hover:bg-[#0D47A1] text-white text-base py-2 px-6 h-auto font-semibold rounded-lg"
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
