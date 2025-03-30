import { Button } from "@/components/ui/button";
import { ArrowDownCircle } from "lucide-react";

export default function Hero() {
  const scrollToModels = () => {
    const modelsSection = document.querySelector(".model-grid-section");
    if (modelsSection) {
      modelsSection.scrollIntoView({ behavior: "smooth" });
    }
  };
  
  return (
    <section id="anasayfa" className="py-20 bg-gradient-to-b from-white to-[#f8f9ff]">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary/90 to-primary/60 text-transparent bg-clip-text">
          BilgeZeka AI Platformu
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-muted-foreground">
          Türkiye'nin ilk tamamen Türkçe, yaşlılar ve teknoloji ile yeni tanışanlar için
          tasarlanmış yapay zeka platformu
        </p>
        
        <div className="flex flex-col md:flex-row justify-center gap-4 my-10">
          <Button 
            className="bg-primary hover:bg-primary/90 text-white text-xl py-8 px-8 h-auto font-semibold rounded-lg"
            onClick={scrollToModels}
          >
            AI Modellerini Keşfet
            <ArrowDownCircle className="ml-2 h-5 w-5" />
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 mt-16 max-w-4xl mx-auto">
          <div className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm border">
            <span className="text-4xl font-bold text-primary">9+</span>
            <p className="mt-2 text-sm md:text-base">AI Modeli</p>
          </div>
          <div className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm border">
            <span className="text-4xl font-bold text-primary">100%</span>
            <p className="mt-2 text-sm md:text-base">Türkçe</p>
          </div>
          <div className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm border">
            <span className="text-4xl font-bold text-primary">Kolay</span>
            <p className="mt-2 text-sm md:text-base">Kullanım</p>
          </div>
          <div className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm border">
            <span className="text-4xl font-bold text-primary">Ücretsiz</span>
            <p className="mt-2 text-sm md:text-base">Erişim</p>
          </div>
        </div>
      </div>
    </section>
  );
}
