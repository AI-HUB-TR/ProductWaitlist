import { Link } from "wouter";

export default function Footer() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  
  return (
    <footer className="bg-[#1565C0] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-8 md:mb-0">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <span className="material-icons mr-2">smart_toy</span>
              ZekiBot
            </h2>
            <p className="text-lg max-w-md">
              Yaşlılar için tasarlanmış, kolay kullanımlı yapay zeka asistanı. 
              Sorularınıza basit ve anlaşılır yanıtlar alın.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Hızlı Bağlantılar</h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => scrollToSection("anasayfa")}
                    className="hover:underline text-lg"
                  >
                    Anasayfa
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection("nasil-calisir")}
                    className="hover:underline text-lg"
                  >
                    Nasıl Çalışır?
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection("sss")} 
                    className="hover:underline text-lg"
                  >
                    Sık Sorulan Sorular
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection("iletisim")}
                    className="hover:underline text-lg"
                  >
                    İletişim
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Yasal</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:underline text-lg">Gizlilik Politikası</Link></li>
                <li><Link href="#" className="hover:underline text-lg">Kullanım Şartları</Link></li>
                <li><Link href="#" className="hover:underline text-lg">Çerez Politikası</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">İletişim</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="material-icons mr-2">email</span>
                  <a href="mailto:iletisim@akilliyardimci.com" className="hover:underline text-lg">
                    iletisim@akilliyardimci.com
                  </a>
                </li>
                <li className="flex items-center">
                  <span className="material-icons mr-2">phone</span>
                  <a href="tel:+902121234567" className="hover:underline text-lg">
                    0212 123 45 67
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/30 mt-8 pt-8 text-center">
          <p className="text-lg">&copy; {new Date().getFullYear()} ZekiBot. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
