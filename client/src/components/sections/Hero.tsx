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
    <section id="anasayfa" className="py-12 bg-gradient-to-b from-[#f7f5f0] to-[#f9f8f5]">
      <div className="container mx-auto px-4 text-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center p-3 bg-white rounded-xl shadow-sm border border-[#e6e0d4]">
            <span className="text-3xl font-bold text-primary">9+</span>
            <p className="mt-1 text-sm">AI Modeli</p>
          </div>
          <div className="flex flex-col items-center p-3 bg-white rounded-xl shadow-sm border border-[#e6e0d4]">
            <span className="text-3xl font-bold text-primary">100%</span>
            <p className="mt-1 text-sm">Türkçe</p>
          </div>
          <div className="flex flex-col items-center p-3 bg-white rounded-xl shadow-sm border border-[#e6e0d4]">
            <span className="text-3xl font-bold text-primary">Kolay</span>
            <p className="mt-1 text-sm">Kullanım</p>
          </div>
          <div className="flex flex-col items-center p-3 bg-white rounded-xl shadow-sm border border-[#e6e0d4]">
            <span className="text-3xl font-bold text-primary">Ücretsiz</span>
            <p className="mt-1 text-sm">Başlangıç</p>
          </div>
        </div>
      </div>
    </section>
  );
}
