import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useSpeech } from "@/hooks/use-speech";
import VoiceDescription from "@/components/accessibility/VoiceDescription";

interface HelpStep {
  title: string;
  description: string;
  image?: string;
  voiceDescription: string;
}

interface HelpSection {
  id: string;
  title: string;
  steps: HelpStep[];
}

interface HelpButtonProps {
  variant?: "icon" | "text" | "floating";
  sections?: HelpSection[];
}

// Varsayılan yardım bölümleri
const defaultSections: HelpSection[] = [
  {
    id: "basics",
    title: "Temel Kullanım",
    steps: [
      {
        title: "ZekiBot'a Hoş Geldiniz",
        description: "ZekiBot, teknoloji kullanımını kolaylaştırmak için tasarlanmış yapay zeka asistanıdır. Basit ve anlaşılır arayüzü ile teknoloji deneyiminizi zenginleştirir.",
        voiceDescription: "Zeki Bot'a Hoş Geldiniz. Zeki Bot, teknoloji kullanımını kolaylaştırmak için tasarlanmış yapay zeka asistanıdır. Basit ve anlaşılır arayüzü ile teknoloji deneyiminizi zenginleştirir.",
        image: "/help/welcome.png"
      },
      {
        title: "Ana Ekran",
        description: "Ana ekranda farklı yapay zeka modellerini görebilirsiniz. İstediğiniz modele tıklayarak o modelin sayfasına gidebilirsiniz.",
        voiceDescription: "Ana ekranda farklı yapay zeka modellerini görebilirsiniz. İstediğiniz modele tıklayarak o modelin sayfasına gidebilirsiniz.",
        image: "/help/home.png"
      },
      {
        title: "Yapay Zeka ile Konuşma",
        description: "Model sayfasında bulunan metin kutusuna sorunuzu yazarak yapay zeka ile sohbet edebilirsiniz. Gönder butonuna tıkladığınızda cevap alacaksınız.",
        voiceDescription: "Model sayfasında bulunan metin kutusuna sorunuzu yazarak yapay zeka ile sohbet edebilirsiniz. Gönder butonuna tıkladığınızda cevap alacaksınız.",
        image: "/help/chat.png"
      }
    ]
  },
  {
    id: "accessibility",
    title: "Erişilebilirlik Özellikleri",
    steps: [
      {
        title: "Ses ile Kontrol",
        description: "Ekranın sağ alt köşesindeki mikrofon simgesine tıklayarak ses ile komut verebilirsiniz. Konuşmaya başladığınızda yapay zeka sizi dinleyecektir.",
        voiceDescription: "Ekranın sağ alt köşesindeki mikrofon simgesine tıklayarak ses ile komut verebilirsiniz. Konuşmaya başladığınızda yapay zeka sizi dinleyecektir.",
        image: "/help/voice.png"
      },
      {
        title: "Görünüm Ayarları",
        description: "Sağ üst köşedeki ayarlar simgesine tıklayarak yazı boyutu, renk kontrastı ve tema gibi görünüm ayarlarını değiştirebilirsiniz.",
        voiceDescription: "Sağ üst köşedeki ayarlar simgesine tıklayarak yazı boyutu, renk kontrastı ve tema gibi görünüm ayarlarını değiştirebilirsiniz.",
        image: "/help/settings.png"
      },
      {
        title: "Sesli Okuma",
        description: "Metinlerin üzerine geldiğinizde beliren hoparlör simgesine tıklayarak metinleri sesli olarak dinleyebilirsiniz.",
        voiceDescription: "Metinlerin üzerine geldiğinizde beliren hoparlör simgesine tıklayarak metinleri sesli olarak dinleyebilirsiniz.",
        image: "/help/read.png"
      }
    ]
  },
  {
    id: "features",
    title: "Özellikler",
    steps: [
      {
        title: "Metin Oluşturma",
        description: "Yapay zeka modellerimiz ile çeşitli konularda metin oluşturabilirsiniz. Örneğin, bir e-posta, hikaye veya bilgi içeren bir yazı yazılmasını isteyebilirsiniz.",
        voiceDescription: "Yapay zeka modellerimiz ile çeşitli konularda metin oluşturabilirsiniz. Örneğin, bir e-posta, hikaye veya bilgi içeren bir yazı yazılmasını isteyebilirsiniz.",
        image: "/help/text.png"
      },
      {
        title: "Resim Oluşturma",
        description: "Resim modelleri ile istediğiniz konuda görsel oluşturabilirsiniz. Detaylı bir şekilde tarif ettiğinizde daha iyi sonuçlar alırsınız.",
        voiceDescription: "Resim modelleri ile istediğiniz konuda görsel oluşturabilirsiniz. Detaylı bir şekilde tarif ettiğinizde daha iyi sonuçlar alırsınız.",
        image: "/help/image.png"
      },
      {
        title: "Bilgi Sorgulama",
        description: "Merak ettiğiniz herhangi bir konuda soru sorabilirsiniz. Yapay zeka, bilgi tabanındaki en güncel bilgilerle size yardımcı olacaktır.",
        voiceDescription: "Merak ettiğiniz herhangi bir konuda soru sorabilirsiniz. Yapay zeka, bilgi tabanındaki en güncel bilgilerle size yardımcı olacaktır.",
        image: "/help/info.png"
      }
    ]
  },
  {
    id: "games",
    title: "Hafıza Oyunları",
    steps: [
      {
        title: "Hafıza Oyunu",
        description: "Hafıza oyunu ile hem eğlenebilir hem de hafızanızı geliştirebilirsiniz. Eşleşen kartları bulmaya çalışın.",
        voiceDescription: "Hafıza oyunu ile hem eğlenebilir hem de hafızanızı geliştirebilirsiniz. Eşleşen kartları bulmaya çalışın.",
        image: "/help/memory.png"
      },
      {
        title: "Zorluk Seviyeleri",
        description: "Oyunların farklı zorluk seviyeleri bulunmaktadır. Kendinize uygun seviyeyi seçerek başlayabilirsiniz.",
        voiceDescription: "Oyunların farklı zorluk seviyeleri bulunmaktadır. Kendinize uygun seviyeyi seçerek başlayabilirsiniz.",
        image: "/help/difficulty.png"
      },
      {
        title: "Puan ve İstatistikler",
        description: "Oyunlarda aldığınız puanları ve istatistikleri görebilirsiniz. Böylece gelişiminizi takip edebilirsiniz.",
        voiceDescription: "Oyunlarda aldığınız puanları ve istatistikleri görebilirsiniz. Böylece gelişiminizi takip edebilirsiniz.",
        image: "/help/stats.png"
      }
    ]
  }
];

export default function HelpButton({ 
  variant = "icon", 
  sections = defaultSections 
}: HelpButtonProps) {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const { speak } = useSpeech();
  
  const activeSteps = sections.find(section => section.id === activeSection)?.steps || [];
  const activeStep = activeSteps[activeStepIndex];
  
  const handleNext = () => {
    if (activeStepIndex < activeSteps.length - 1) {
      setActiveStepIndex(activeStepIndex + 1);
      if (activeStep) {
        speak(activeSteps[activeStepIndex + 1].voiceDescription);
      }
    }
  };
  
  const handlePrevious = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex(activeStepIndex - 1);
      if (activeStep) {
        speak(activeSteps[activeStepIndex - 1].voiceDescription);
      }
    }
  };
  
  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    setActiveStepIndex(0);
    
    const newSection = sections.find(section => section.id === sectionId);
    if (newSection && newSection.steps.length > 0) {
      speak(newSection.steps[0].voiceDescription);
    }
  };
  
  // Yardım açıldığında ilk adımı seslendir
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    
    if (newOpen && activeStep) {
      speak(activeStep.voiceDescription);
    }
  };
  
  return (
    <>
      {variant === "floating" ? (
        <Button 
          onClick={() => handleOpenChange(true)}
          className="fixed bottom-20 right-5 bg-[#1565C0] hover:bg-[#0D47A1] text-white shadow-lg rounded-full w-12 h-12 flex items-center justify-center"
          aria-label="Yardım"
        >
          <HelpCircle className="h-6 w-6" />
        </Button>
      ) : variant === "text" ? (
        <Button 
          onClick={() => handleOpenChange(true)} 
          variant="outline"
          className="flex items-center"
        >
          <HelpCircle className="h-4 w-4 mr-2" />
          Yardım
        </Button>
      ) : (
        <Button 
          onClick={() => handleOpenChange(true)} 
          variant="ghost" 
          size="icon"
          className="text-[#1565C0]"
          aria-label="Yardım"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
      )}
      
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] h-full overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Nasıl Yardımcı Olabilirim?</DialogTitle>
            <DialogDescription>
              Aşağıdaki yardım konularından birini seçin veya ilerleyin
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col flex-grow overflow-hidden">
            <Tabs
              value={activeSection}
              onValueChange={handleSectionChange}
              className="flex flex-col h-full overflow-hidden"
            >
              <TabsList className="flex justify-start w-full overflow-auto">
                {sections.map((section) => (
                  <TabsTrigger
                    key={section.id}
                    value={section.id}
                    className="shrink-0"
                  >
                    {section.title}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {sections.map((section) => (
                <TabsContent
                  key={section.id}
                  value={section.id}
                  className="flex-grow overflow-hidden flex flex-col"
                >
                  <div className="relative flex-grow overflow-hidden">
                    <Carousel
                      className="h-full"
                      setApi={(api) => {
                        if (api) {
                          api.on('select', () => {
                            const index = api.selectedScrollSnap();
                            setActiveStepIndex(index);
                            if (section.steps[index]) {
                              speak(section.steps[index].voiceDescription);
                            }
                          });
                        }
                      }}
                    >
                      <CarouselContent className="h-full">
                        {section.steps.map((step, index) => (
                          <CarouselItem key={index} className="h-full">
                            <div className="flex flex-col h-full p-2">
                              <h3 className="text-xl font-semibold mb-2 text-[#1565C0]">
                                {step.title}
                              </h3>
                              <VoiceDescription
                                description={step.voiceDescription}
                                buttonPosition="none"
                              >
                                <p className="text-base mb-4">{step.description}</p>
                              </VoiceDescription>
                              
                              {step.image && (
                                <div className="flex-grow flex items-center justify-center p-4 bg-muted/20 rounded-lg">
                                  <div className="relative w-full max-w-md mx-auto">
                                    <div className="aspect-video relative flex items-center justify-center bg-muted rounded-md border">
                                      {/* Burada resim olacak */}
                                      <div className="flex items-center justify-center h-full w-full">
                                        <p className="text-muted-foreground text-sm">Yardımcı görsel burada olacak</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      
                      <div className="flex items-center justify-between absolute bottom-0 left-0 right-0 p-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handlePrevious}
                          disabled={activeStepIndex === 0}
                          className="rounded-full"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        
                        <span className="text-sm text-muted-foreground">
                          {activeStepIndex + 1} / {activeSteps.length}
                        </span>
                        
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleNext}
                          disabled={activeStepIndex === activeSteps.length - 1}
                          className="rounded-full"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </Carousel>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setOpen(false)}>Kapat</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}