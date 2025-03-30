import DigitalSkillQuest from "@/components/learning/DigitalSkillQuest";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function SkillQuestPage() {
  return (
    <div className="bg-[#f7f5f0] min-h-screen pb-12">
      <div className="container mx-auto px-4 py-4">
        <div className="mb-6 flex items-center">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">ZekiBot Dijital Beceri Yolculuğu</h1>
        </div>
        
        <div className="mb-8 max-w-4xl">
          <p className="text-lg text-slate-700">
            ZekiBot Dijital Beceri Yolculuğu, teknolojinin temel kavramlarını adım adım öğrenmeniz için tasarlanmış, 
            kendi hızınızda ilerleyebileceğiniz eğitim modülleri sunar. Her modül tamamlandığında hem becerilerinizi 
            geliştirir hem de yeni rozet ve puanlar kazanırsınız.
          </p>
        </div>
      </div>

      <DigitalSkillQuest />
    </div>
  );
}