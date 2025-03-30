import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function HowItWorks() {
  const steps = [
    {
      title: "1. Soru Sorun",
      description: "Merak ettiğiniz konuyu yazın veya sesli olarak sorun. Basit ve anlaşılır bir dil kullanabilirsiniz.",
      icon: "question_answer"
    },
    {
      title: "2. Cevabı Alın",
      description: "Yapay zeka asistanımız sorunuzu anlayıp basit ve net bir cevap hazırlar. Karmaşık terimler yerine anlaşılır bir dil kullanır.",
      icon: "psychology"
    },
    {
      title: "3. Sesli Dinleyin",
      description: "İsterseniz cevabı sesli olarak dinleyebilirsiniz. Net ve anlaşılır bir ses ile cevaplar okunur.",
      icon: "volume_up"
    }
  ];
  
  return (
    <section id="nasil-calisir" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Nasıl Çalışır?</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-[#1565C0] flex items-center justify-center">
                  <span className="material-icons text-white text-3xl">{step.icon}</span>
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
              <p className="text-lg">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="/chat-demo">
            <Button className="bg-[#4CAF50] hover:bg-[#388E3C] text-white text-xl py-4 px-8 h-auto font-semibold rounded-lg">
              Örnek Bir Demo Deneyin
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
