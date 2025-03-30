export default function Features() {
  const features = [
    {
      title: "Büyük ve Okunaklı Yazılar",
      description: "Tüm yazılar rahatlıkla okunabilecek büyüklükte ve nettir. Gözlerinizi yormaz.",
      icon: "text_format"
    },
    {
      title: "Sesli Yanıt Sistemi",
      description: "Ekrandaki yazıları okumak istemezseniz, cevapları sesli olarak dinleyebilirsiniz.",
      icon: "record_voice_over"
    },
    {
      title: "Konu Kategorileri",
      description: "Sağlık, günlük yaşam, haberler gibi kategorilere ayrılmış konulara kolayca erişebilirsiniz.",
      icon: "category"
    },
    {
      title: "Basit Kullanım Kılavuzu",
      description: "Uygulamayı nasıl kullanacağınızı adım adım anlatan basit bir kılavuza sahiptir.",
      icon: "help_outline"
    },
    {
      title: "Destek Hizmeti",
      description: "Sorularınız veya sorunlarınız için her zaman yardımcı olacak destek ekibimiz bulunmaktadır.",
      icon: "support_agent"
    },
    {
      title: "Gizlilik ve Güvenlik",
      description: "Bilgileriniz güvende kalır, kişisel verileriniz korunur ve asla üçüncü kişilerle paylaşılmaz.",
      icon: "privacy_tip"
    }
  ];
  
  return (
    <section className="py-16 bg-[#F5F5F5]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Özellikler</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 flex">
              <div className="mr-6">
                <span className="material-icons text-[#1565C0] text-4xl">{feature.icon}</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-lg">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
