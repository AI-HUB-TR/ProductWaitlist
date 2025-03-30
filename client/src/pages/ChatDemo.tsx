import ChatInterface from "@/components/chat/ChatInterface";

export default function ChatDemo() {
  return (
    <div className="min-h-screen py-16 bg-[#F5F5F5]">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Akıllı Yardımcı Demo</h1>
        <p className="text-xl text-center mb-12">
          Bu sayfada uygulamamızı test edebilirsiniz. Aşağıdaki sohbet kutusuna merak ettiğiniz herhangi bir soruyu yazabilir ve yanıtını alabilirsiniz.
        </p>
        
        <div className="max-w-3xl mx-auto">
          <ChatInterface fullPage />
        </div>
      </div>
    </div>
  );
}
