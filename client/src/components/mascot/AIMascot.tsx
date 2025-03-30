import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Bot, X, MessageCircle, ArrowRight } from "lucide-react";
import { useSpeech } from "@/hooks/use-speech";

enum MascotExpression {
  NEUTRAL = "neutral",
  HAPPY = "happy",
  THINKING = "thinking",
  CONFUSED = "confused",
  EXCITED = "excited"
}

interface MascotPosition {
  bottom: string;
  right: string;
}

interface AIMascotProps {
  initialExpression?: MascotExpression;
  initialPosition?: MascotPosition;
  showCloseButton?: boolean;
  welcomeMessage?: string;
  tipMessages?: string[];
  tipInterval?: number; // Milisaniye cinsinden ipucu mesajları arasındaki süre
  className?: string;
}

export default function AIMascot({
  initialExpression = MascotExpression.NEUTRAL,
  initialPosition = { bottom: "5rem", right: "1.5rem" },
  showCloseButton = true,
  welcomeMessage = "Merhaba! Ben ZekiBot. Size nasıl yardımcı olabilirim?",
  tipMessages = [
    "Sesli komut için sağ alttaki mikrofon simgesine tıklayabilirsiniz.",
    "Hafıza oyunumuzu denediniz mi? Beyin egzersizi için harika!",
    "Yardıma ihtiyacınız olursa, sağ alttaki '?' butonuna tıklayın.",
    "Farklı yapay zeka modellerini keşfetmek için ana sayfadaki model kartlarına göz atın.",
    "Görünüm ayarlarını değiştirmek için sağ üstteki ayarlar simgesini kullanabilirsiniz."
  ],
  tipInterval = 30000,
  className = ""
}: AIMascotProps) {
  const [visible, setVisible] = useState(true);
  const [expression, setExpression] = useState<MascotExpression>(initialExpression);
  const [position, setPosition] = useState<MascotPosition>(initialPosition);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [welcomeDialogOpen, setWelcomeDialogOpen] = useState(false);
  const [message, setMessage] = useState(welcomeMessage);
  const [showBubble, setShowBubble] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const mascotRef = useRef<HTMLDivElement>(null);
  const { speak } = useSpeech();

  // Kullanıcının ilk ziyaretini kontrol et
  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem('visited');
    
    if (!hasVisitedBefore) {
      setIsFirstVisit(true);
      setWelcomeDialogOpen(true);
      localStorage.setItem('visited', 'true');
      speak(welcomeMessage);
    } else {
      // İlk ziyaret değilse 3 saniye sonra ipucu balonunu göster
      setTimeout(() => {
        setShowBubble(true);
        speak(message);
        
        // 10 saniye sonra balonu gizle
        setTimeout(() => {
          setShowBubble(false);
        }, 10000);
      }, 3000);
    }
  }, [welcomeMessage, speak]);

  // Periyodik ipuçları göster
  useEffect(() => {
    if (!isFirstVisit && tipMessages.length > 0) {
      const interval = setInterval(() => {
        const randomTip = tipMessages[Math.floor(Math.random() * tipMessages.length)];
        setMessage(randomTip);
        setShowBubble(true);
        speak(randomTip);
        
        // 10 saniye sonra balonu gizle
        setTimeout(() => {
          setShowBubble(false);
        }, 10000);
      }, tipInterval);
      
      return () => clearInterval(interval);
    }
  }, [isFirstVisit, tipMessages, tipInterval, speak]);

  // Fare hareketi izleme
  useEffect(() => {
    if (!mascotRef.current) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && mascotRef.current) {
        // Ekran sınırlarını kontrol et
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const mascotWidth = mascotRef.current.offsetWidth;
        const mascotHeight = mascotRef.current.offsetHeight;
        
        // Yeni pozisyonu hesapla
        let newRight = viewportWidth - (e.clientX + dragOffset.x);
        let newBottom = viewportHeight - (e.clientY + dragOffset.y);
        
        // Sınırları kontrol et
        newRight = Math.max(0, Math.min(viewportWidth - mascotWidth, newRight));
        newBottom = Math.max(0, Math.min(viewportHeight - mascotHeight, newBottom));
        
        setPosition({
          right: `${newRight}px`,
          bottom: `${newBottom}px`
        });
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = 'default';
      
      // Yeni pozisyonu localStorage'a kaydet
      localStorage.setItem('mascotPosition', JSON.stringify(position));
    };
    
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'grabbing';
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, position]);

  // Maskotun pozisyonunu localStorage'dan yükle
  useEffect(() => {
    const savedPosition = localStorage.getItem('mascotPosition');
    if (savedPosition) {
      try {
        setPosition(JSON.parse(savedPosition));
      } catch (e) {
        console.error('Maskot pozisyonu yüklenemedi:', e);
      }
    }
  }, []);

  // Sürüklemeyi başlat
  const handleMouseDown = (e: React.MouseEvent) => {
    if (mascotRef.current) {
      const rect = mascotRef.current.getBoundingClientRect();
      setDragOffset({
        x: rect.right - e.clientX,
        y: rect.bottom - e.clientY
      });
      setIsDragging(true);
      e.preventDefault();
    }
  };

  // Karşılama modeli kapat
  const handleCloseWelcomeDialog = () => {
    setWelcomeDialogOpen(false);
    setExpression(MascotExpression.HAPPY);
    
    // Hoş geldin balonunu göster
    setTimeout(() => {
      setShowBubble(true);
      
      // 10 saniye sonra balonu gizle
      setTimeout(() => {
        setShowBubble(false);
      }, 10000);
    }, 1000);
  };

  // Maskotu gizle
  const handleHideMascot = () => {
    setVisible(false);
    localStorage.setItem('mascotHidden', 'true');
  };

  // İfadelere göre stiller
  const getExpressionStyle = () => {
    switch (expression) {
      case MascotExpression.HAPPY:
        return "text-[#1565C0] bg-white";
      case MascotExpression.THINKING:
        return "text-[#1565C0] bg-white/90";
      case MascotExpression.CONFUSED:
        return "text-[#1565C0] bg-white";
      case MascotExpression.EXCITED:
        return "text-white bg-[#1565C0]";
      default:
        return "text-[#1565C0] bg-white";
    }
  };

  if (!visible) return null;

  return (
    <>
      <div
        ref={mascotRef}
        className={`fixed ${className} z-50 select-none`}
        style={{ bottom: position.bottom, right: position.right }}
      >
        {/* Konuşma balonu */}
        {showBubble && (
          <div className="absolute bottom-full right-0 mb-2 p-3 bg-white rounded-lg shadow-lg max-w-[300px] text-sm border border-slate-200">
            <div className="relative">
              <p>{message}</p>
              <div className="absolute -bottom-[18px] right-5 w-0 h-0 border-l-[8px] border-l-transparent border-t-[12px] border-t-white border-r-[8px] border-r-transparent"></div>
            </div>
          </div>
        )}
        
        {/* Maskot */}
        <div 
          className={`
            p-3 rounded-full shadow-lg cursor-grab active:cursor-grabbing
            transition-all duration-300 ease-in-out 
            hover:shadow-xl hover:scale-105
            flex items-center justify-center
            w-14 h-14 ${getExpressionStyle()}
          `}
          onMouseDown={handleMouseDown}
        >
          <Bot className="w-8 h-8" />
        </div>
        
        {/* Kapatma butonu */}
        {showCloseButton && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute -top-2 -left-2 bg-white shadow-sm rounded-full w-5 h-5 p-0 text-slate-500 hover:bg-red-100 hover:text-red-600"
            onClick={handleHideMascot}
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>
      
      {/* Karşılama diyaloğu */}
      <Dialog open={welcomeDialogOpen} onOpenChange={setWelcomeDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Bot className="w-6 h-6 mr-2 text-[#1565C0]" />
              ZekiBot'a Hoş Geldiniz
            </DialogTitle>
            <DialogDescription>
              Yapay zeka teknolojilerini keşfetmenize yardımcı olacağım.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-start">
              <div className="bg-[#1565C0] text-white rounded-full p-2 mr-3 mt-0.5">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-medium">Sizin için buradayım</h4>
                <p className="text-sm text-muted-foreground">
                  İhtiyaç duyduğunuzda size yardımcı olmak için buradayım. Yapay zeka teknolojilerini kullanırken karşılaşabileceğiniz zorlukları aşmanıza yardımcı olacağım.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-[#1565C0] text-white rounded-full p-2 mr-3 mt-0.5">
                <ArrowRight className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-medium">Nasıl yardımcı olabilirim?</h4>
                <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                  <li>• Sesli komutlarla uygulamayı kullanmanıza</li>
                  <li>• Yapay zeka modellerini keşfetmenize</li>
                  <li>• Erişilebilirlik özelliklerini ayarlamanıza</li>
                  <li>• Hafıza oyunlarıyla pratik yapmanıza</li>
                </ul>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={handleCloseWelcomeDialog} 
            className="w-full bg-[#1565C0] hover:bg-[#0D47A1]"
          >
            Başlayalım
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}