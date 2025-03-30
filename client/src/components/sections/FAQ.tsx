import { useState } from "react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

export default function FAQ() {
  const faqs = [
    {
      question: "Bu uygulama ne zaman kullanıma açılacak?",
      answer: "Uygulamamız 2023 yılının sonlarında kullanıma açılacaktır. Bekleme listesine kaydolarak ilk kullanıcılar arasında yer alabilirsiniz."
    },
    {
      question: "Uygulamayı kullanmak için ne gerekiyor?",
      answer: "Uygulamayı kullanmak için internet bağlantısı olan bir telefon, tablet veya bilgisayar yeterlidir. Herhangi bir özel ekipman gerekmez."
    },
    {
      question: "Uygulama ücretli mi olacak?",
      answer: "Uygulamamızın temel özellikleri ücretsiz olarak sunulacaktır. İleri düzey özellikler için aylık ücretli bir abonelik sistemi olacaktır."
    },
    {
      question: "Uygulamayı kullanmak zor mu?",
      answer: "Hayır, uygulamamız özellikle yaşlı kullanıcılar düşünülerek tasarlanmıştır. Büyük butonlar, okunaklı yazılar ve basit bir arayüz ile kolayca kullanılabilir."
    },
    {
      question: "Her türlü soruya cevap alabilir miyim?",
      answer: "Uygulamamız genel bilgi, günlük yaşam, sağlık, haberler ve daha birçok konuda sorulara cevap verebilir. Ancak tıbbi teşhis koymaz ve profesyonel tavsiye yerine geçmez."
    }
  ];
  
  return (
    <section id="sss" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Sık Sorulan Sorular</h2>
        
        <div className="max-w-3xl mx-auto space-y-6">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-white rounded-lg shadow-md mb-4 border-0"
              >
                <AccordionTrigger className="text-xl font-semibold p-6 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 text-lg">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
