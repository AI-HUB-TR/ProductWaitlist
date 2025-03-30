import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Menu, 
  Bot, 
  LogIn, 
  UserPlus, 
  User,
  LogOut,
  Home,
  HelpCircle,
  MessageSquare,
  Settings
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Örnek için, gerçek uygulamada auth hook'undan gelecek

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const navItems = [
    { name: "Anasayfa", id: "anasayfa", path: "/", icon: <Home className="h-4 w-4 mr-2" /> },
    { name: "Nasıl Çalışır?", id: "nasil-calisir", path: "/#nasil-calisir", icon: <HelpCircle className="h-4 w-4 mr-2" /> },
    { name: "SSS", id: "sss", path: "/#sss", icon: <MessageSquare className="h-4 w-4 mr-2" /> },
    { name: "İletişim", id: "iletisim", path: "/#iletisim", icon: <MessageSquare className="h-4 w-4 mr-2" /> },
  ];

  // Yönetici yetkisi varsa
  if (isLoggedIn) {
    navItems.push({ name: "Yönetim", id: "admin", path: "/admin", icon: <Settings className="h-4 w-4 mr-2" /> });
  }

  const handleNavClick = (id: string, path: string) => {
    if (path.startsWith('/') && !path.includes('#')) {
      // Yeni sayfaya yönlendir
      window.location.href = path;
      return;
    }
    
    if (location !== "/") {
      // Ana sayfaya dön ve bölüme kaydır
      window.location.href = `/#${id}`;
    } else {
      scrollToSection(id);
    }
  };

  const handleLogin = () => {
    // Örnek, gerçekte authentication sayfasına yönlendirilecek
    setIsLoggedIn(true);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    // Örnek, gerçekte logout API'si çağrılacak
    setIsLoggedIn(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Bot className="text-[#1565C0] h-6 w-6 md:h-7 md:w-7 mr-2" />
          <h1 className="text-2xl md:text-3xl font-bold text-[#1565C0]">ZekiBot</h1>
        </Link>
        
        <nav className="hidden md:block">
          <ul className="flex space-x-4">
            {navItems.map((item) => (
              <li key={item.id}>
                <button 
                  onClick={() => handleNavClick(item.id, item.path)}
                  className="text-base font-medium hover:text-[#1565C0] transition-colors px-2 py-1 rounded-md hover:bg-[#f0f0f0]"
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="hidden md:flex items-center space-x-3">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center border-[#1565C0] border text-[#1565C0]">
                  <User className="h-4 w-4 mr-2" />
                  <span>Hesabım</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Hesap İşlemleri</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profilim</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Ayarlar</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Çıkış Yap</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button 
                variant="outline" 
                className="border-[#1565C0] text-[#1565C0]"
                onClick={handleLogin}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Giriş Yap
              </Button>
              <Button 
                className="bg-[#1565C0] hover:bg-[#0D47A1] text-white"
                onClick={handleLogin}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Üye Ol
              </Button>
            </>
          )}
        </div>
        
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-[#f7f5f0]">
            <div className="flex flex-col gap-3 mt-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id, item.path)}
                  className="text-base font-medium py-2 hover:text-[#1565C0] transition-colors text-left flex items-center"
                >
                  {item.icon}
                  {item.name}
                </button>
              ))}
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                {isLoggedIn ? (
                  <>
                    <div className="mb-2 text-sm text-muted-foreground">Hesap İşlemleri</div>
                    <Button variant="outline" className="w-full justify-start mb-2">
                      <User className="mr-2 h-4 w-4" />
                      Profilim
                    </Button>
                    <Button variant="outline" className="w-full justify-start mb-2">
                      <Settings className="mr-2 h-4 w-4" />
                      Ayarlarım
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-red-500"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Çıkış Yap
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="mb-2 text-sm text-muted-foreground">Üyelik İşlemleri</div>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start mb-2"
                      onClick={handleLogin}
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      Giriş Yap
                    </Button>
                    <Button 
                      className="w-full justify-start bg-[#1565C0] hover:bg-[#0D47A1]"
                      onClick={handleLogin}
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Üye Ol
                    </Button>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
