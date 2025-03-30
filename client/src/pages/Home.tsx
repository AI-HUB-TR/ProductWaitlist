import ModelGrid from "@/components/sections/ModelGrid";
import HowItWorks from "@/components/sections/HowItWorks";
import Features from "@/components/sections/Features";
import FAQ from "@/components/sections/FAQ";
import ContactForm from "@/components/sections/ContactForm";
import Hero from "@/components/sections/Hero";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <div className="bg-white pt-6 shadow-sm">
        <ModelGrid />
      </div>
      <HowItWorks />
      <Features />
      <FAQ />
      <ContactForm />
    </div>
  );
}
