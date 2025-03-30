import { Button } from "@/components/ui/button";

export default function Hero() {
  const scrollToWaitlist = () => {
    const waitlistSection = document.getElementById("waitlist");
    if (waitlistSection) {
      waitlistSection.scrollIntoView({ behavior: "smooth" });
    }
  };
  
  return (
    <section id="anasayfa" className="py-16 bg-white">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Yaşlılar İçin Tasarlanmış Akıllı Sesli Asistan
          </h2>
          <p className="text-xl mb-8">
            Günlük sorularınıza basit ve anlaşılır cevaplar veren, sizi dinleyen, 
            kolay kullanımlı yapay zeka asistanımıza hoş geldiniz.
          </p>
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="material-icons text-[#4CAF50] mr-4">check_circle</span>
              <p className="text-lg">Büyük ve okunaklı yazılar</p>
            </div>
            <div className="flex items-center">
              <span className="material-icons text-[#4CAF50] mr-4">check_circle</span>
              <p className="text-lg">Basit Türkçe ile yanıtlar</p>
            </div>
            <div className="flex items-center">
              <span className="material-icons text-[#4CAF50] mr-4">check_circle</span>
              <p className="text-lg">Sesli cevap seçeneği</p>
            </div>
            <div className="flex items-center">
              <span className="material-icons text-[#4CAF50] mr-4">check_circle</span>
              <p className="text-lg">Kolay kullanım</p>
            </div>
          </div>
          <div className="mt-10">
            <Button 
              className="bg-[#1565C0] hover:bg-[#0D47A1] text-white text-xl py-4 px-8 h-auto font-semibold rounded-lg"
              onClick={scrollToWaitlist}
            >
              Bekleme Listesine Katıl
            </Button>
          </div>
        </div>
        <div className="md:w-1/2">
          <img 
            src="https://images.unsplash.com/photo-1516307365426-bea591f05011?w=600&h=400&fit=crop" 
            alt="Yaşlı bir çift tablet kullanıyor" 
            className="rounded-lg shadow-xl max-w-full h-auto" 
            width="600" 
            height="400"
          />
        </div>
      </div>
    </section>
  );
}
