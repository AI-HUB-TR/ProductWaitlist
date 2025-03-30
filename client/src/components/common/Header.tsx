import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const navItems = [
    { name: "Anasayfa", id: "anasayfa", path: "/" },
    { name: "Nasıl Çalışır?", id: "nasil-calisir", path: "/#nasil-calisir" },
    { name: "Sık Sorulan Sorular", id: "sss", path: "/#sss" },
    { name: "İletişim", id: "iletisim", path: "/#iletisim" },
  ];

  const handleNavClick = (id: string) => {
    if (location !== "/") {
      // Navigate to home and then scroll to section
      window.location.href = `/#${id}`;
    } else {
      scrollToSection(id);
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <span className="material-icons text-primary text-4xl mr-2">smart_toy</span>
          <h1 className="text-2xl font-bold text-primary">ZekiBot</h1>
        </Link>
        
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            {navItems.map((item) => (
              <li key={item.id}>
                <button 
                  onClick={() => handleNavClick(item.id)}
                  className="text-lg font-semibold hover:text-[#1565C0] transition-colors"
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="hidden md:block">
          <Button 
            className="bg-[#1565C0] hover:bg-[#0D47A1] text-white text-lg font-semibold px-6 py-3 h-auto"
            onClick={() => scrollToSection("waitlist")}
          >
            Bekleme Listesine Katıl
          </Button>
        </div>
        
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="flex flex-col gap-4 mt-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="text-lg font-semibold py-2 hover:text-[#1565C0] transition-colors text-left"
                >
                  {item.name}
                </button>
              ))}
              <Button 
                className="bg-[#1565C0] hover:bg-[#0D47A1] text-white text-lg font-semibold mt-4"
                onClick={() => {
                  scrollToSection("waitlist");
                  setIsMenuOpen(false);
                }}
              >
                Bekleme Listesine Katıl
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
