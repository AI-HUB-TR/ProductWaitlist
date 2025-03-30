import { Link } from "wouter";
import { AIModel } from "@/data/aiModels";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MessageCircle, Image, Code, Calculator, Gamepad2, 
  Languages, Music, FileText, BookOpen, HelpCircle, ArrowRight
} from "lucide-react";

interface ModelCardProps {
  model: AIModel;
}

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

export default function ModelCard({ model }: ModelCardProps) {
  // İkonu seçme
  const Icon = iconMap[model.icon as keyof typeof iconMap] || HelpCircle;

  return (
    <Link href={model.url} className="block h-full">
      <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg border-2 border-[#e0dcd0] hover:border-[#1565C0] hover:scale-[1.02] cursor-pointer bg-white">
        <CardContent className="flex-grow p-6 pb-2">
          <div className={`w-14 h-14 ${model.color} rounded-xl mb-4 flex items-center justify-center shadow-sm`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="text-2xl font-bold mb-2">{model.name}</h3>
          <div className="bg-[#f0ece0] text-xs font-medium px-2 py-1 rounded-full inline-block mb-3">
            {model.category}
          </div>
          <p className="text-muted-foreground text-sm">{model.description}</p>
        </CardContent>
        
        <CardFooter className="p-6 pt-2">
          <Button className="w-full bg-[#1565C0] hover:bg-[#0D47A1] text-white">
            Keşfet
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}