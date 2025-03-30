import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Globe, ChevronDown, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSound } from "@/hooks/use-sound-effects";

// Desteklenen diller ve bayrakları
export const SUPPORTED_LANGUAGES = [
  { code: "tr", name: "Türkçe", flag: "🇹🇷", isDefault: true },
  { code: "en", name: "English", flag: "🇬🇧", isDefault: false },
  { code: "de", name: "Deutsch", flag: "🇩🇪", isDefault: false },
  { code: "fr", name: "Français", flag: "🇫🇷", isDefault: false },
  { code: "es", name: "Español", flag: "🇪🇸", isDefault: false },
  { code: "ar", name: "العربية", flag: "🇸🇦", isDefault: false },
  { code: "ru", name: "Русский", flag: "🇷🇺", isDefault: false },
];

// Yerel depolama anahtarı
const LANGUAGE_STORAGE_KEY = 'zekibot_selected_language';

// Basit çeviri veritabanı
export const TRANSLATIONS: Record<string, Record<string, string>> = {
  // Uygulama genelindeki metin çevirileri
  "app.title": {
    "tr": "ZekiBot - Teknoloji Asistanınız",
    "en": "ZekiBot - Your Technology Assistant",
    "de": "ZekiBot - Ihr Technologie-Assistent",
    "fr": "ZekiBot - Votre Assistant Technologique",
    "es": "ZekiBot - Su Asistente Tecnológico",
    "ar": "زيكي بوت - مساعدك التكنولوجي",
    "ru": "ZekiBot - Ваш технологический помощник"
  },
  "app.welcome": {
    "tr": "Teknoloji dünyasına hoş geldiniz",
    "en": "Welcome to the world of technology",
    "de": "Willkommen in der Welt der Technologie",
    "fr": "Bienvenue dans le monde de la technologie",
    "es": "Bienvenido al mundo de la tecnología",
    "ar": "مرحبًا بكم في عالم التكنولوجيا",
    "ru": "Добро пожаловать в мир технологий"
  },
  "nav.home": {
    "tr": "Ana Sayfa",
    "en": "Home",
    "de": "Startseite",
    "fr": "Accueil",
    "es": "Inicio",
    "ar": "الصفحة الرئيسية",
    "ru": "Главная"
  },
  "nav.about": {
    "tr": "Hakkımızda",
    "en": "About",
    "de": "Über uns",
    "fr": "À propos",
    "es": "Acerca de",
    "ar": "من نحن",
    "ru": "О нас"
  },
  "button.start": {
    "tr": "Başla",
    "en": "Start",
    "de": "Anfangen",
    "fr": "Commencer",
    "es": "Comenzar",
    "ar": "ابدأ",
    "ru": "Начать"
  },
  "button.continue": {
    "tr": "Devam Et",
    "en": "Continue",
    "de": "Fortfahren",
    "fr": "Continuer",
    "es": "Continuar",
    "ar": "متابعة",
    "ru": "Продолжить"
  }
};

// Çeviri bağlamı
export interface TranslationContextProps {
  currentLanguage: string;
  setLanguage: (code: string) => void;
  t: (key: string) => string;
}

// Varsayılan dil
const DEFAULT_LANGUAGE = "tr";

// Dil değiştirici bileşeni
export function LanguageSwitcher({ variant = "icon" }: { variant?: "icon" | "full" }) {
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  const { playSound } = useSound();

  // Yerel depolamadan dil tercihini yükle
  useEffect(() => {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Dil değiştirme fonksiyonu
  const changeLanguage = (code: string) => {
    setLanguage(code);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
    playSound('click');
    
    // Sayfa çevirisi için bir olay tetikle
    window.dispatchEvent(new CustomEvent('languageChange', { detail: { language: code } }));
  };

  // Mevcut dili bul
  const currentLanguageInfo = SUPPORTED_LANGUAGES.find(lang => lang.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={variant === "icon" ? "icon" : "sm"}
          className="flex items-center"
        >
          {variant === "icon" ? (
            <Globe className="h-5 w-5" />
          ) : (
            <>
              <span className="mr-1">{currentLanguageInfo.flag}</span>
              <span className="mr-1">{currentLanguageInfo.name}</span>
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[150px]">
        {SUPPORTED_LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            className="flex items-center cursor-pointer"
            onClick={() => changeLanguage(lang.code)}
          >
            <span className="mr-2">{lang.flag}</span>
            <span className="flex-1">{lang.name}</span>
            {language === lang.code && <Check className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Çeviri hook'u
export function useTranslation() {
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);

  // Yerel depolamadan dil tercihini yükle
  useEffect(() => {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
    
    // Dil değişim olayını dinle
    const handleLanguageChange = (event: CustomEvent) => {
      setLanguage(event.detail.language);
    };
    
    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange as EventListener);
    };
  }, []);

  // Çeviri fonksiyonu
  const t = (key: string): string => {
    if (TRANSLATIONS[key] && TRANSLATIONS[key][language]) {
      return TRANSLATIONS[key][language];
    }
    
    // Mevcut dilde çeviri yoksa türkçe çeviriyi göster
    if (TRANSLATIONS[key] && TRANSLATIONS[key]["tr"]) {
      return TRANSLATIONS[key]["tr"];
    }
    
    // Çeviri bulunamadıysa anahtarı göster
    return key;
  };

  return {
    currentLanguage: language,
    setLanguage: (code: string) => {
      setLanguage(code);
      localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
    },
    t,
  };
}

// Otomatik sayfa çevirisi için bileşen
export function AutoTranslateProvider({ children }: { children: React.ReactNode }) {
  const { currentLanguage } = useTranslation();
  
  useEffect(() => {
    // Sayfa dili değiştiğinde sayfa içeriğini çevir
    if (currentLanguage !== DEFAULT_LANGUAGE) {
      // Sayfa çevirisi için gerekli işlemleri burada yapabilirsiniz
      console.log(`Sayfa ${currentLanguage} diline çevriliyor...`);
      
      // Basit bir içerik çevirisi örneği
      document.querySelectorAll('[data-translation-key]').forEach(element => {
        const key = element.getAttribute('data-translation-key');
        if (key && TRANSLATIONS[key] && TRANSLATIONS[key][currentLanguage]) {
          element.textContent = TRANSLATIONS[key][currentLanguage];
        }
      });
    }
  }, [currentLanguage]);
  
  return <>{children}</>;
}