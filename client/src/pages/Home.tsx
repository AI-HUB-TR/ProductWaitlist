import ModelGrid from "@/components/sections/ModelGrid";
import HowItWorks from "@/components/sections/HowItWorks";
import Features from "@/components/sections/Features";
import FAQ from "@/components/sections/FAQ";
import ContactForm from "@/components/sections/ContactForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="bg-white pt-8">
        <ModelGrid />
      </div>
      <HowItWorks />
      <Features />
      <FAQ />
      <ContactForm />
    </div>
  );
}
