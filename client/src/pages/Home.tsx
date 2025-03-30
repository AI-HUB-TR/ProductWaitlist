import ModelGrid from "@/components/sections/ModelGrid";
import HowItWorks from "@/components/sections/HowItWorks";
import Features from "@/components/sections/Features";
import FAQ from "@/components/sections/FAQ";
import ContactForm from "@/components/sections/ContactForm";
import Hero from "@/components/sections/Hero";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="bg-white shadow-sm">
        <ModelGrid />
      </div>
      <HowItWorks />
      <Features />
      <FAQ />
      <Hero />
      <ContactForm />
    </div>
  );
}
