import { Button } from "@/components/ui/button";
import { ArrowDownCircle } from "lucide-react";

export default function Hero() {
  return (
    <section id="avantajlar" className="py-12 bg-[#f7f5f0] border-t border-b border-[#e0dcd0]">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#1565C0]">ZekiBot Avantajları</h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Kolay kullanım ve erişilebilirlik önceliğimizdir. İşte ZekiBot'un sunduğu bazı avantajlar:
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white rounded-lg p-6 border border-[#e0dcd0] hover:border-[#1565C0] transition-all duration-300 hover:shadow-md">
            <div className="bg-[#1565C0]/10 p-3 rounded-full inline-block mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#1565C0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Tamamen Türkçe</h3>
            <p className="text-sm text-muted-foreground">
              Tüm arayüz ve AI yanıtları Türkçe dilinde, yabancı terimler olmadan sunulur.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 border border-[#e0dcd0] hover:border-[#1565C0] transition-all duration-300 hover:shadow-md">
            <div className="bg-[#1565C0]/10 p-3 rounded-full inline-block mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#1565C0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Basit Arayüz</h3>
            <p className="text-sm text-muted-foreground">
              Karmaşık menüler ve seçenekler olmadan, herkesin kolayca kullanabileceği temiz bir tasarım.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 border border-[#e0dcd0] hover:border-[#1565C0] transition-all duration-300 hover:shadow-md">
            <div className="bg-[#1565C0]/10 p-3 rounded-full inline-block mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#1565C0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Sesli Yanıt</h3>
            <p className="text-sm text-muted-foreground">
              Okuma zorluğu çekenler için sesli yanıt özelliği ile daha erişilebilir bir deneyim.
            </p>
          </div>
        </div>
        
        <div className="mt-10 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
            <div className="flex flex-col items-center p-3 bg-white rounded-xl shadow-sm border border-[#e0dcd0]">
              <span className="text-2xl md:text-3xl font-bold text-[#1565C0]">9+</span>
              <p className="mt-1 text-xs md:text-sm">AI Modeli</p>
            </div>
            <div className="flex flex-col items-center p-3 bg-white rounded-xl shadow-sm border border-[#e0dcd0]">
              <span className="text-2xl md:text-3xl font-bold text-[#1565C0]">100%</span>
              <p className="mt-1 text-xs md:text-sm">Türkçe</p>
            </div>
            <div className="flex flex-col items-center p-3 bg-white rounded-xl shadow-sm border border-[#e0dcd0]">
              <span className="text-2xl md:text-3xl font-bold text-[#1565C0]">Kolay</span>
              <p className="mt-1 text-xs md:text-sm">Kullanım</p>
            </div>
            <div className="flex flex-col items-center p-3 bg-white rounded-xl shadow-sm border border-[#e0dcd0]">
              <span className="text-2xl md:text-3xl font-bold text-[#1565C0]">Ücretsiz</span>
              <p className="mt-1 text-xs md:text-sm">Başlangıç</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
