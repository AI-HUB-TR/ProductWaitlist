import Hero from "@/components/sections/Hero";
import WaitlistForm from "@/components/sections/WaitlistForm";
import HowItWorks from "@/components/sections/HowItWorks";
import Features from "@/components/sections/Features";
import FAQ from "@/components/sections/FAQ";
import ContactForm from "@/components/sections/ContactForm";
import ChatInterface from "@/components/chat/ChatInterface";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Hero />
      <WaitlistForm />
      <HowItWorks />
      <Features />
      <FAQ />
      <ContactForm />
      
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Uygulama Demosunu Deneyimleyin</h2>
          <p className="text-xl text-center mb-12">Aşağıda uygulamamızın nasıl çalıştığını gösteren basit bir demo bulunmaktadır. Bir soru yazarak deneyebilirsiniz.</p>
          <ChatInterface />
        </div>
      </section>
    </div>
  );
}
