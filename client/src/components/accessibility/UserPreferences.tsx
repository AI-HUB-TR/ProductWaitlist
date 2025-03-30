import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Settings, User, Type, Volume2, Eye, Monitor, 
  Moon, Sun, MoonStar, Sparkles, Languages
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSpeech } from "@/hooks/use-speech";
import HighContrastSettings from "@/components/accessibility/HighContrastSettings";

// Kullanıcı tercihleri için arayüz
export interface UserPreferencesOptions {
  fontSize: number;
  voiceEnabled: boolean;
  highContrast: boolean;
  colorScheme: 'light' | 'dark' | 'system';
  language: string;
  reduceAnimations: boolean;
  focusMode: boolean;
  autoPlayVideos: boolean;
  screenReaderHints: boolean;
}

// Desteklenen diller
const SUPPORTED_LANGUAGES = [
  { code: 'tr', name: 'Türkçe' },
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'العربية' },
  { code: 'de', name: 'Deutsch' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' },
  { code: 'ru', name: 'Русский' }
];

// Varsayılan kullanıcı tercihleri
const DEFAULT_PREFERENCES: UserPreferencesOptions = {
  fontSize: 1.0,
  voiceEnabled: true,
  highContrast: false,
  colorScheme: 'system',
  language: 'tr',
  reduceAnimations: false,
  focusMode: false,
  autoPlayVideos: true,
  screenReaderHints: false
};

// Yerel depolamadaki anahtar
const STORAGE_KEY = 'zekibot_user_preferences';

interface UserPreferencesProps {
  variant?: 'dropdown' | 'sheet';
  onChange?: (preferences: UserPreferencesOptions) => void;
  triggerClassName?: string;
}

export default function UserPreferences({ 
  variant = 'dropdown',
  onChange,
  triggerClassName = ''
}: UserPreferencesProps) {
  const [preferences, setPreferences] = useState<UserPreferencesOptions>(DEFAULT_PREFERENCES);
  const [isOpen, setIsOpen] = useState(false);
  const { toggleVoice, speak, isVoiceEnabled } = useSpeech();

  // Kaydedilmiş tercihleri yükle
  useEffect(() => {
    const savedPreferences = localStorage.getItem(STORAGE_KEY);
    if (savedPreferences) {
      try {
        const parsedPrefs = JSON.parse(savedPreferences);
        setPreferences({...DEFAULT_PREFERENCES, ...parsedPrefs});
      } catch (e) {
        console.error('Tercihler yüklenemedi:', e);
      }
    }
  }, []);

  // Tercihleri kaydet ve yenile
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    
    // Tema ayarlarını uygula
    document.documentElement.style.fontSize = `${preferences.fontSize * 100}%`;
    
    // Değişimleri bildirme callback'i
    if (onChange) {
      onChange(preferences);
    }
    
    // Ses ayarlarını senkronize et
    if (preferences.voiceEnabled !== isVoiceEnabled) {
      toggleVoice();
    }
    
    // Renk şeması ayarları
    const colorSchemeClass = preferences.colorScheme === 'dark' 
      ? 'dark' 
      : preferences.colorScheme === 'light' 
        ? 'light' 
        : window.matchMedia('(prefers-color-scheme: dark)').matches 
          ? 'dark' 
          : 'light';
    
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(colorSchemeClass);
    
    // Yüksek kontrast ayarları
    if (preferences.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    
    // Odak modu
    if (preferences.focusMode) {
      document.documentElement.classList.add('focus-mode');
    } else {
      document.documentElement.classList.remove('focus-mode');
    }
    
    // Animasyon azaltma
    if (preferences.reduceAnimations) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
    
  }, [preferences, onChange, toggleVoice, isVoiceEnabled]);

  // Tercihleri güncelleme fonksiyonu
  const updatePreferences = (newValues: Partial<UserPreferencesOptions>) => {
    setPreferences(prev => ({ ...prev, ...newValues }));
  };

  // Tüm tercihleri sıfırla
  const resetPreferences = () => {
    setPreferences(DEFAULT_PREFERENCES);
    speak('Tercihler varsayılan ayarlara sıfırlandı.');
  };

  // Tercihleri sesli oku
  const speakPreferences = () => {
    const fontSizePercent = Math.round(preferences.fontSize * 100);
    const contrastSetting = preferences.highContrast ? 'Yüksek' : 'Normal';
    const themeSetting = preferences.colorScheme === 'light' 
      ? 'Açık tema' 
      : preferences.colorScheme === 'dark' 
        ? 'Koyu tema' 
        : 'Sistem teması';
    
    const preferencesSummary = `
      Aktif tercihleriniz:
      Yazı boyutu: Yüzde ${fontSizePercent}.
      Sesli yanıt: ${preferences.voiceEnabled ? 'Açık' : 'Kapalı'}.
      Kontrast: ${contrastSetting}.
      Tema: ${themeSetting}.
      Dil: ${SUPPORTED_LANGUAGES.find(l => l.code === preferences.language)?.name || 'Türkçe'}.
      Animasyonlar: ${preferences.reduceAnimations ? 'Azaltılmış' : 'Normal'}.
      Odak modu: ${preferences.focusMode ? 'Açık' : 'Kapalı'}.
    `;
    
    speak(preferencesSummary);
  };

  // Tercihler içeriği
  const PreferencesContent = () => (
    <div className="space-y-6">
      {/* Yazı boyutu */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label htmlFor="font-size" className="flex items-center">
            <Type className="h-4 w-4 mr-2" />
            Yazı Boyutu
          </Label>
          <span className="text-sm text-muted-foreground">
            {Math.round(preferences.fontSize * 100)}%
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-xs">A</span>
          <Slider
            id="font-size"
            min={0.7}
            max={1.5}
            step={0.05}
            value={[preferences.fontSize]}
            onValueChange={(values) => updatePreferences({ fontSize: values[0] })}
          />
          <span className="text-xl">A</span>
        </div>
      </div>
      
      {/* Renk teması */}
      <div className="space-y-3">
        <Label className="flex items-center">
          <Monitor className="h-4 w-4 mr-2" />
          Renk Teması
        </Label>
        
        <RadioGroup
          value={preferences.colorScheme}
          onValueChange={(value) => updatePreferences({ colorScheme: value as 'light' | 'dark' | 'system' })}
          className="flex items-center space-x-2"
        >
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="light" id="theme-light" />
            <Label htmlFor="theme-light" className="flex items-center cursor-pointer">
              <Sun className="h-4 w-4 mr-1" />
              <span className="text-sm">Açık</span>
            </Label>
          </div>
          
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="dark" id="theme-dark" />
            <Label htmlFor="theme-dark" className="flex items-center cursor-pointer">
              <Moon className="h-4 w-4 mr-1" />
              <span className="text-sm">Koyu</span>
            </Label>
          </div>
          
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="system" id="theme-system" />
            <Label htmlFor="theme-system" className="flex items-center cursor-pointer">
              <MoonStar className="h-4 w-4 mr-1" />
              <span className="text-sm">Sistem</span>
            </Label>
          </div>
        </RadioGroup>
      </div>
      
      {/* Ses ayarları */}
      <div className="flex items-center justify-between">
        <Label htmlFor="voice-enabled" className="flex items-center cursor-pointer">
          <Volume2 className="h-4 w-4 mr-2" />
          <span>Sesli Yanıt</span>
        </Label>
        <Switch
          id="voice-enabled"
          checked={preferences.voiceEnabled}
          onCheckedChange={(checked) => {
            updatePreferences({ voiceEnabled: checked });
            if (checked) {
              speak('Sesli yanıt açıldı');
            }
          }}
        />
      </div>
      
      {/* Kontrast ayarları */}
      <div className="flex items-center justify-between">
        <Label htmlFor="high-contrast" className="flex items-center cursor-pointer">
          <Eye className="h-4 w-4 mr-2" />
          <span>Yüksek Kontrast</span>
        </Label>
        <Switch
          id="high-contrast"
          checked={preferences.highContrast}
          onCheckedChange={(checked) => updatePreferences({ highContrast: checked })}
        />
      </div>
      
      {/* Dil seçimi */}
      <div className="space-y-3">
        <Label htmlFor="language" className="flex items-center">
          <Languages className="h-4 w-4 mr-2" />
          Dil
        </Label>
        
        <select
          id="language"
          value={preferences.language}
          onChange={(e) => updatePreferences({ language: e.target.value })}
          className="w-full p-2 border border-input rounded-md"
        >
          {SUPPORTED_LANGUAGES.map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>
      
      {/* Animasyonları azalt */}
      <div className="flex items-center justify-between">
        <Label htmlFor="reduce-animations" className="flex items-center cursor-pointer">
          <Sparkles className="h-4 w-4 mr-2" />
          <span>Animasyonları Azalt</span>
        </Label>
        <Switch
          id="reduce-animations"
          checked={preferences.reduceAnimations}
          onCheckedChange={(checked) => updatePreferences({ reduceAnimations: checked })}
        />
      </div>
      
      {/* Odak modu */}
      <div className="flex items-center justify-between">
        <Label htmlFor="focus-mode" className="flex items-center cursor-pointer">
          <span>Odak Modu</span>
        </Label>
        <Switch
          id="focus-mode"
          checked={preferences.focusMode}
          onCheckedChange={(checked) => updatePreferences({ focusMode: checked })}
        />
      </div>
      
      {/* Tercih yönetimi butonları */}
      <div className="flex justify-between pt-4 border-t">
        <Button 
          variant="outline" 
          size="sm"
          onClick={speakPreferences}
        >
          <Volume2 className="h-4 w-4 mr-2" />
          Sesli Anlat
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={resetPreferences}
        >
          Varsayılana Sıfırla
        </Button>
      </div>
    </div>
  );

  // Dropdown menu versiyonu
  if (variant === 'dropdown') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className={triggerClassName}
            aria-label="Kullanıcı ayarları"
          >
            <User className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Kullanıcı Ayarları
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <div className="p-2">
            <PreferencesContent />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Sheet (yan panel) versiyonu
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={triggerClassName}
          aria-label="Kullanıcı ayarları"
        >
          <User className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Kullanıcı Ayarları
          </SheetTitle>
          <SheetDescription>
            Kişisel tercihlerinizi buradan düzenleyebilirsiniz.
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-6">
          <PreferencesContent />
        </div>
        
        <SheetFooter>
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
          >
            Kapat
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}