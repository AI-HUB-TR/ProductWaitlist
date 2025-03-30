import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { getModelById } from "@/data/aiModels";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ChatInterface from "@/components/chat/ChatInterface";
import { ArrowLeft, HelpCircle } from "lucide-react";

// İkonu dinamik olarak seçme fonksiyonu
import { 
  MessageCircle, Image, Code, Calculator, Gamepad2, 
  Languages, Music, FileText, BookOpen
} from "lucide-react";

// İkon haritası
const iconMap = {
  "message-circle": MessageCircle,
  "image": Image,
  "code": Code,
  "calculator": Calculator,
  "gamepad-2": Gamepad2,
  "languages": Languages,
  "music": Music,
  "file-text": FileText,
  "book-open": BookOpen
};

export default function ModelDetail() {
  const [_, params] = useRoute("/models/:id");
  const modelId = params?.id;
  const model = modelId ? getModelById(modelId) : undefined;
  
  if (!model) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">Model Bulunamadı</h1>
        <p className="mb-8">İstediğiniz AI modeli bulunamadı veya henüz mevcut değil.</p>
        <Link href="/">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Ana Sayfaya Dön
          </Button>
        </Link>
      </div>
    );
  }

  // İkonu seçme
  const Icon = iconMap[model.icon as keyof typeof iconMap] || HelpCircle;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/">
        <Button variant="outline" className="mb-6 border-[#1565C0] text-[#1565C0] hover:bg-[#1565C0]/10">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Ana Sayfaya Dön
        </Button>
      </Link>
      
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="md:w-1/3">
          <Card className="p-6 border-2 border-[#e0dcd0] shadow-md bg-white">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-16 h-16 ${model.color} rounded-xl flex items-center justify-center shadow-sm`}>
                <Icon className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{model.name}</h1>
                <div className="bg-[#f0ece0] text-xs font-medium px-2 py-1 rounded-full inline-block mt-1">
                  {model.category}
                </div>
              </div>
            </div>
            
            <p className="text-base text-muted-foreground mb-6">{model.description}</p>
            
            <div className="border-t border-[#e0dcd0] pt-4">
              <h3 className="font-semibold mb-2 text-[#1565C0]">Nasıl Kullanılır?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Sağdaki arayüzü kullanarak {model.name.toLowerCase()} ile konuşabilir, sorular sorabilir veya isteklerinizi iletebilirsiniz. Basit ve kolay kullanım için tasarlanmıştır.
              </p>
              
              <div className="bg-[#f0ece0]/60 p-3 rounded-lg mb-4">
                <h4 className="font-medium text-sm mb-1">Kullanım İpuçları:</h4>
                <ul className="text-sm list-disc ml-4 text-muted-foreground">
                  <li>Kısa ve net sorular sorun</li>
                  <li>İstediğiniz detay seviyesini belirtin</li>
                  <li>Yanıtlardan memnun değilseniz, sorunuzu yeniden düzenleyin</li>
                </ul>
              </div>
            </div>
            
            <Button className="w-full mt-4 bg-[#1565C0] hover:bg-[#0D47A1] text-white">
              Tüm Özellikleri Keşfet
            </Button>
          </Card>
        </div>
        
        <div className="md:w-2/3">
          <Card className="p-6 border-2 border-[#e0dcd0] shadow-md bg-white">
            <h2 className="text-2xl font-bold mb-6 flex items-center text-[#1565C0]">
              <Icon className="mr-2 h-5 w-5" /> 
              {model.name} Arayüzü
            </h2>
            <ChatInterface fullPage />
          </Card>
        </div>
      </div>

      <Card className="p-6 border-2 border-[#e0dcd0] shadow-md bg-white mb-8">
        <h2 className="text-2xl font-bold mb-4 text-[#1565C0]">Benzer Modeller</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array(3).fill(0).map((_, i) => (
            <Card key={i} className="p-4 border border-[#e0dcd0] hover:border-[#1565C0] transition-all duration-300 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-[#1565C0] rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-medium">{`Öneri Model ${i+1}`}</h3>
                  <p className="text-xs text-muted-foreground">Benzer işlevsellik</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}