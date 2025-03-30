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
    <div className="container mx-auto px-4 py-16">
      <Link href="/">
        <Button variant="outline" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Ana Sayfaya Dön
        </Button>
      </Link>
      
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="md:w-1/3">
          <Card className="p-6">
            <div className={`w-20 h-20 ${model.color} rounded-xl mb-6 flex items-center justify-center`}>
              <Icon className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-4xl font-bold mb-2">{model.name}</h1>
            <div className="bg-muted/40 text-xs font-medium px-2 py-1 rounded-full inline-block mb-4">
              {model.category}
            </div>
            <p className="text-lg text-muted-foreground mb-6">{model.description}</p>
            
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Nasıl Kullanılır?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Sağdaki arayüzü kullanarak {model.name.toLowerCase()} ile konuşabilir, sorular sorabilir veya isteklerinizi iletebilirsiniz. Basit ve kolay kullanım için tasarlanmıştır.
              </p>
            </div>
          </Card>
        </div>
        
        <div className="md:w-2/3">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">{model.name} Arayüzü</h2>
            <ChatInterface fullPage />
          </Card>
        </div>
      </div>
    </div>
  );
}