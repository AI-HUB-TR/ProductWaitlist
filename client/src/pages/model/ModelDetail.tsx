import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";
import { getModelById } from "@/data/aiModels";
import { ArrowLeft, Send, Sparkles, Copy, Check, MessageSquare, Loader2 } from "lucide-react";
import { useSpeech } from "@/hooks/use-speech";
import VoiceDescription from "@/components/accessibility/VoiceDescription";

type ModelResponse = {
  modelId: string;
  features: string[];
  examples: string[];
  instructions: string;
};

type ChatMessage = {
  role: "user" | "system";
  content: string;
  timestamp: Date;
};

export default function ModelDetail() {
  const { id } = useParams();
  const [inputMessage, setInputMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const { speak } = useSpeech();
  
  // Model verilerini getir
  const model = getModelById(id || "");
  
  // API'den model detaylarını getir
  const { data: modelDetails, isLoading: isLoadingDetails } = useQuery<ModelResponse>({
    queryKey: [`/api/models/${id?.replace('-ai', '')}`],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!id,
  });
  
  // Sohbet API'sine mesaj gönderme
  const chatMutation = useMutation({
    mutationFn: async (text: string) => {
      // Model ID'sine göre doğru model tipini belirle
      let modelType = "chat";
      if (model?.id === "translate-ai") modelType = "translation";
      else if (model?.id === "summary-ai") modelType = "summarization";
      else if (model?.id === "code-ai") modelType = "code";
      else if (model?.id === "image-ai") modelType = "image";
      
      const res = await apiRequest("POST", "/api/chat", {
        message: text,
        modelType: modelType
      });
      const data = await res.json();
      return data.message;
    },
    onSuccess: (response) => {
      // Yanıt içinde hata kodu olup olmadığını kontrol et
      if (typeof response === 'string' && 
          (response === "API_ERROR" || 
           response === "ERROR_GENERATING_IMAGE" || 
           response === "ERROR_PROCESSING_IMAGE" || 
           response === "ERROR_EMPTY_RESPONSE" ||
           response === "API_KEY_MISSING")) {
        // Hata mesajını kullanıcıya göster
        let errorMessage = "Üzgünüm, bir hata oluştu.";
        
        if (response === "API_KEY_MISSING") {
          errorMessage = "API anahtarı eksik. Lütfen sistem yöneticisine başvurun.";
        } else if (response === "ERROR_GENERATING_IMAGE") {
          errorMessage = "Görsel oluşturulurken bir sorun oluştu. Lütfen farklı bir açıklama deneyin.";
        } else {
          errorMessage = "Bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
        }
        
        setChatHistory(prev => [
          ...prev,
          {
            role: "system",
            content: errorMessage,
            timestamp: new Date()
          }
        ]);
        return;
      }
      
      // Yanıtı sohbet geçmişine ekle
      setChatHistory(prev => [
        ...prev,
        {
          role: "system",
          content: response,
          timestamp: new Date()
        }
      ]);
      
      // Metin kutusu içeriğini temizle
      setInputMessage("");
    }
  });
  
  // Mesaj gönderme işlemi
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    // Kullanıcı mesajını sohbet geçmişine ekle
    setChatHistory(prev => [
      ...prev,
      {
        role: "user",
        content: inputMessage,
        timestamp: new Date()
      }
    ]);
    
    // API'ye mesaj gönder
    chatMutation.mutate(inputMessage);
  };
  
  // Enter tuşu ile mesaj gönderme
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Yanıtı kopyalama
  const handleCopyResponse = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };
  
  // Eğer model bulunamadıysa
  if (!model) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Model Bulunamadı</h1>
        </div>
        <p>İstediğiniz yapay zeka modeli bulunamadı. Lütfen ana sayfaya dönüp tekrar deneyin.</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link href="/">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{model.name}</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sol panel - Model bilgileri */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className={`${model.color} text-white rounded-t-lg`}>
              <CardTitle className="flex items-center text-xl">
                <Sparkles className="h-5 w-5 mr-2" />
                {model.name}
              </CardTitle>
              <CardDescription className="text-white/90">
                {model.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {isLoadingDetails ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  <h3 className="font-medium text-base mb-3">Özellikler</h3>
                  <ul className="space-y-2 mb-6">
                    {modelDetails?.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-[#1565C0] mr-2">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <VoiceDescription
                    description={modelDetails?.instructions || model.description}
                    buttonPosition="top-right"
                  >
                    <div className="rounded-lg border p-4 bg-muted/30">
                      <h3 className="font-medium text-base mb-2">Nasıl Kullanılır?</h3>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {modelDetails?.instructions || "Yükleniyor..."}
                      </p>
                    </div>
                  </VoiceDescription>
                </>
              )}
            </CardContent>
          </Card>
          
          {/* Örnek sorular/komutlar */}
          {modelDetails?.examples && modelDetails.examples.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Örnek Kullanımlar</CardTitle>
                <CardDescription>
                  Denemek için bir örneğe tıklayın
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {modelDetails.examples.map((example, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start text-left overflow-hidden h-auto whitespace-normal py-3"
                      onClick={() => {
                        setInputMessage(example);
                        // Örneği seslendir
                        speak(example);
                      }}
                    >
                      <MessageSquare className="h-4 w-4 mr-2 shrink-0" />
                      <span>{example}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Sağ panel - Sohbet */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="flex flex-col h-[70vh]">
            <CardHeader className="pt-5 pb-4">
              <CardTitle className="text-lg">
                <MessageSquare className="h-5 w-5 mr-2 inline-block" />
                ZekiBot ile Sohbet
              </CardTitle>
              <CardDescription>
                {model.id === "chat-ai" && "Herhangi bir konuda sorularınızı sorun"}
                {model.id === "image-ai" && "Oluşturmak istediğiniz görseli tanımlayın"}
                {model.id === "code-ai" && "Yazılması gereken kodu açıklayın"}
                {model.id === "calculator-ai" && "Çözmek istediğiniz problemini girin"}
                {model.id === "game-ai" && "Oynamak istediğiniz oyunu seçin"}
                {model.id === "translate-ai" && "Çevirmek istediğiniz metni girin"}
                {model.id === "audio-ai" && "Ses ile ilgili işleminizi belirtin"}
                {model.id === "summary-ai" && "Özetlemek istediğiniz metni yapıştırın"}
                {model.id === "education-ai" && "Öğrenmek istediğiniz konuyu sorun"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow overflow-auto px-4 py-0">
              <div className="space-y-4">
                {chatHistory.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <Sparkles className="h-12 w-12 text-muted mb-4" />
                    <h3 className="font-medium text-lg">Sohbete Başlayın</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mt-2">
                      Metin kutusuna yazarak veya örnek kullanımlardan seçerek {model.name.toLowerCase()} ile iletişim kurabilirsiniz.
                    </p>
                  </div>
                )}
                
                {chatHistory.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`
                        rounded-lg px-4 py-2 max-w-[80%] whitespace-pre-wrap
                        ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground ml-12"
                            : "bg-muted mr-12 relative"
                        }
                      `}
                    >
                      {model.id === "image-ai" && message.role === "system" && message.content.startsWith("data:image") ? (
                        <div className="w-full">
                          <div className="relative aspect-square w-full max-w-md mx-auto">
                            <img 
                              src={message.content} 
                              alt="Oluşturulan görsel" 
                              className="rounded-md object-cover shadow-md border border-gray-200"
                            />
                            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-md">
                              Stable Diffusion XL
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p>{message.content}</p>
                      )}
                      
                      {message.role === "system" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 absolute top-2 right-2 opacity-50 hover:opacity-100"
                          onClick={() => handleCopyResponse(message.content)}
                        >
                          {copySuccess ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                {chatMutation.isPending && (
                  <div className="flex">
                    <div className="bg-muted rounded-lg px-4 py-2 max-w-[80%] mr-12">
                      <div className="flex space-x-2 items-center">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Yanıt oluşturuluyor...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="p-4 border-t">
              <div className="flex w-full space-x-2">
                {model.id !== "image-ai" ? (
                  <Textarea
                    className="flex-1 min-h-10 max-h-32"
                    placeholder={`${model.name} ile konuşmak için bir mesaj yazın...`}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                  />
                ) : (
                  <Input
                    className="flex-1"
                    placeholder="Oluşturmak istediğiniz görseli tanımlayın..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                  />
                )}
                <Button
                  type="submit"
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || chatMutation.isPending}
                >
                  {chatMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  <span className="sr-only">Gönder</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}