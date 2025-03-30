import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Settings, Check, Palette, Type, SlidersHorizontal, Eye, Volume2 } from "lucide-react";
import { useSpeech } from "@/hooks/use-speech";

// Yaşa göre önceden tanımlanmış tema seçenekleri
const presetThemes = [
  {
    id: "default",
    name: "Varsayılan",
    description: "Standart tema",
    backgroundColor: "#f7f5f0",
    textColor: "#333333",
    primaryColor: "#1565C0",
    contrastLevel: 1,
    fontSize: 1
  },
  {
    id: "highContrast",
    name: "Yüksek Kontrast",
    description: "Daha kolay okuma için siyah arka plan, beyaz yazı",
    backgroundColor: "#000000",
    textColor: "#ffffff",
    primaryColor: "#ffcc00",
    contrastLevel: 3,
    fontSize: 1.1
  },
  {
    id: "largeText",
    name: "Büyük Yazı",
    description: "Standart tema, büyük yazı boyutu",
    backgroundColor: "#f7f5f0",
    textColor: "#333333",
    primaryColor: "#1565C0",
    contrastLevel: 1,
    fontSize: 1.3
  },
  {
    id: "softColors",
    name: "Yumuşak Renkler",
    description: "Daha az yorucu, yumuşak renkler",
    backgroundColor: "#f0f7ff",
    textColor: "#333333",
    primaryColor: "#4b86b4",
    contrastLevel: 1.5,
    fontSize: 1.1
  },
  {
    id: "warmTones",
    name: "Sıcak Tonlar",
    description: "Daha rahat okuma için sıcak tonlar",
    backgroundColor: "#fff8e6",
    textColor: "#4d3900",
    primaryColor: "#d97706",
    contrastLevel: 1.8,
    fontSize: 1.15
  },
  {
    id: "maxAccessibility",
    name: "Maksimum Erişilebilirlik",
    description: "Çok büyük yazı, yüksek kontrast",
    backgroundColor: "#000000",
    textColor: "#ffffff",
    primaryColor: "#ffcc00",
    contrastLevel: 3,
    fontSize: 1.5
  }
];

// CSS değişkenleri ve değerleri için tür tanımı
interface ThemeSettings {
  backgroundColor: string;
  textColor: string;
  primaryColor: string;
  contrastLevel: number;
  fontSize: number;
}

export default function HighContrastSettings() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activePreset, setActivePreset] = useState(presetThemes[0].id);
  const [settings, setSettings] = useState<ThemeSettings>(presetThemes[0]);
  const [customColors, setCustomColors] = useState(false);
  const { speak } = useSpeech();
  
  // Ayarları uygula
  useEffect(() => {
    // Tema ayarlarını localStorage'a kaydet
    localStorage.setItem('themeSettings', JSON.stringify(settings));
    
    // CSS değişkenlerini ayarla
    document.documentElement.style.setProperty('--background', settings.backgroundColor);
    document.documentElement.style.setProperty('--foreground', settings.textColor);
    document.documentElement.style.setProperty('--primary', settings.primaryColor);
    
    // Yazı boyutunu ayarla 
    document.documentElement.style.setProperty('--font-size-multiplier', settings.fontSize.toString());
    document.documentElement.style.fontSize = `${settings.fontSize * 100}%`;
    
    // Kontrast ayarlarını uygula
    document.documentElement.style.setProperty('--contrast-multiplier', settings.contrastLevel.toString());
    
  }, [settings]);
  
  // localStorage'dan ayarları yükle
  useEffect(() => {
    const savedSettings = localStorage.getItem('themeSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
        
        // Kaydedilen ayarlara en yakın olan ön tanımlı temayı bul
        const matchingPreset = presetThemes.find(
          theme => theme.backgroundColor === parsedSettings.backgroundColor && 
                  theme.textColor === parsedSettings.textColor &&
                  theme.primaryColor === parsedSettings.primaryColor
        );
        
        if (matchingPreset) {
          setActivePreset(matchingPreset.id);
          setCustomColors(false);
        } else {
          setActivePreset('');
          setCustomColors(true);
        }
      } catch (e) {
        console.error("Tema ayarları yüklenemedi:", e);
      }
    }
  }, []);
  
  // Ön tanımlı tema seçildiğinde
  const handlePresetChange = (presetId: string) => {
    const selectedPreset = presetThemes.find(theme => theme.id === presetId);
    if (selectedPreset) {
      setSettings({
        backgroundColor: selectedPreset.backgroundColor,
        textColor: selectedPreset.textColor,
        primaryColor: selectedPreset.primaryColor,
        contrastLevel: selectedPreset.contrastLevel,
        fontSize: selectedPreset.fontSize
      });
      setActivePreset(presetId);
      setCustomColors(false);
      
      speak(`${selectedPreset.name} teması seçildi. ${selectedPreset.description}`);
    }
  };
  
  // Tema ayarlarını sıfırla
  const resetToDefault = () => {
    handlePresetChange("default");
  };
  
  // Yazı boyutunu değiştir
  const handleFontSizeChange = (value: number[]) => {
    setSettings(prev => ({ ...prev, fontSize: value[0] }));
    
    // Özel tema ayarı olarak işaretle
    if (!customColors) {
      setActivePreset('');
      setCustomColors(true);
    }
  };
  
  // Kontrast seviyesini değiştir
  const handleContrastChange = (value: number[]) => {
    setSettings(prev => ({ ...prev, contrastLevel: value[0] }));
    
    // Özel tema ayarı olarak işaretle
    if (!customColors) {
      setActivePreset('');
      setCustomColors(true);
    }
  };
  
  // Renk değiştirme
  const handleColorChange = (type: keyof ThemeSettings, value: string) => {
    setSettings(prev => ({ ...prev, [type]: value }));
    
    // Özel tema ayarı olarak işaretle
    if (!customColors) {
      setActivePreset('');
      setCustomColors(true);
    }
  };
  
  return (
    <>
      <Button 
        onClick={() => setIsDialogOpen(true)} 
        variant="ghost" 
        size="icon"
        className="relative text-[#1565C0]"
        aria-label="Erişilebilirlik ayarları"
      >
        <Settings className="h-5 w-5" />
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center text-[#1565C0]">
              <Eye className="mr-2 h-5 w-5" />
              Görünüm ve Erişilebilirlik Ayarları
            </DialogTitle>
            <DialogDescription>
              İhtiyaçlarınıza uygun görünüm ve erişilebilirlik seçeneklerini belirleyin.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Ön tanımlı temalar */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium flex items-center">
                  <Palette className="h-4 w-4 mr-2" />
                  Ön Tanımlı Temalar
                </Label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={resetToDefault}
                  className="text-xs"
                >
                  Varsayılana Dön
                </Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {presetThemes.map((theme) => (
                  <Button
                    key={theme.id}
                    variant="outline"
                    className={`h-auto py-3 px-3 justify-start items-start text-left relative flex flex-col ${
                      activePreset === theme.id ? "border-[#1565C0] border-2" : ""
                    }`}
                    onClick={() => handlePresetChange(theme.id)}
                    style={{
                      background: theme.backgroundColor,
                      color: theme.textColor,
                    }}
                  >
                    <span className="font-medium mb-1" style={{ fontSize: `${theme.fontSize}rem` }}>
                      {theme.name}
                    </span>
                    <span className="text-xs opacity-80" style={{ color: theme.textColor }}>
                      {theme.description}
                    </span>
                    {activePreset === theme.id && (
                      <Check className="absolute top-2 right-2 h-4 w-4" style={{ color: theme.primaryColor }} />
                    )}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Gelişmiş ayarlar */}
            <div className="space-y-4 pt-2 border-t">
              <Label className="text-base font-medium flex items-center">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Gelişmiş Ayarlar
              </Label>
              
              <div className="space-y-6">
                {/* Yazı boyutu ayarı */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="font-size" className="flex items-center">
                      <Type className="h-4 w-4 mr-2" />
                      Yazı Boyutu
                    </Label>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(settings.fontSize * 100)}%
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-xs">A</span>
                    <Slider
                      id="font-size"
                      defaultValue={[settings.fontSize]}
                      min={0.8}
                      max={2.0}
                      step={0.1}
                      className="flex-1"
                      onValueChange={handleFontSizeChange}
                      value={[settings.fontSize]}
                    />
                    <span className="text-base">A</span>
                  </div>
                </div>
                
                {/* Kontrast ayarı */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="contrast" className="flex items-center">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Kontrast Seviyesi
                    </Label>
                    <span className="text-sm text-muted-foreground">
                      {settings.contrastLevel < 1.5 ? 'Normal' : 
                       settings.contrastLevel < 2.5 ? 'Orta' : 'Yüksek'}
                    </span>
                  </div>
                  
                  <Slider
                    id="contrast"
                    defaultValue={[settings.contrastLevel]}
                    min={1}
                    max={3}
                    step={0.5}
                    onValueChange={handleContrastChange}
                    value={[settings.contrastLevel]}
                  />
                </div>
                
                {/* Renk seçiciler */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="background-color" className="text-xs">
                      Arka Plan
                    </Label>
                    <div className="relative">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="w-full h-8 p-0"
                            aria-label="Arka plan rengi seç"
                          >
                            <div 
                              className="w-full h-full rounded-sm" 
                              style={{ backgroundColor: settings.backgroundColor }}
                            />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64">
                          <div className="grid grid-cols-5 gap-2">
                            {["#ffffff", "#f7f5f0", "#f0f7ff", "#f5f5f5", "#000000", 
                              "#fffaeb", "#f3f4f6", "#fff8e6", "#fef2f2", "#192734"].map((color) => (
                              <Button
                                key={color}
                                variant="outline"
                                className="w-full h-8 p-0"
                                style={{ backgroundColor: color }}
                                onClick={() => handleColorChange("backgroundColor", color)}
                              >
                                {settings.backgroundColor === color && (
                                  <Check className="h-4 w-4" 
                                    style={{ color: color === "#000000" ? "#fff" : "#000" }}
                                  />
                                )}
                              </Button>
                            ))}
                          </div>
                          <input
                            type="color"
                            id="background-color"
                            value={settings.backgroundColor}
                            onChange={(e) => handleColorChange("backgroundColor", e.target.value)}
                            className="mt-2 w-full"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="text-color" className="text-xs">
                      Yazı Rengi
                    </Label>
                    <div className="relative">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="w-full h-8 p-0"
                            aria-label="Yazı rengi seç"
                          >
                            <div 
                              className="w-full h-full rounded-sm" 
                              style={{ backgroundColor: settings.textColor }}
                            />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64">
                          <div className="grid grid-cols-5 gap-2">
                            {["#000000", "#333333", "#4d3900", "#1a365d", "#1e293b", 
                              "#ffffff", "#f0f0f0", "#94a3b8", "#64748b", "#475569"].map((color) => (
                              <Button
                                key={color}
                                variant="outline"
                                className="w-full h-8 p-0"
                                style={{ backgroundColor: color }}
                                onClick={() => handleColorChange("textColor", color)}
                              >
                                {settings.textColor === color && (
                                  <Check className="h-4 w-4" 
                                    style={{ color: color === "#000000" ? "#fff" : "#000" }}
                                  />
                                )}
                              </Button>
                            ))}
                          </div>
                          <input
                            type="color"
                            id="text-color"
                            value={settings.textColor}
                            onChange={(e) => handleColorChange("textColor", e.target.value)}
                            className="mt-2 w-full"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="primary-color" className="text-xs">
                      Vurgu Rengi
                    </Label>
                    <div className="relative">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="w-full h-8 p-0"
                            aria-label="Vurgu rengi seç"
                          >
                            <div 
                              className="w-full h-full rounded-sm" 
                              style={{ backgroundColor: settings.primaryColor }}
                            />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64">
                          <div className="grid grid-cols-5 gap-2">
                            {["#1565C0", "#2563eb", "#7c3aed", "#4b86b4", "#059669", 
                              "#d97706", "#ffcc00", "#ef4444", "#ec4899", "#14b8a6"].map((color) => (
                              <Button
                                key={color}
                                variant="outline"
                                className="w-full h-8 p-0"
                                style={{ backgroundColor: color }}
                                onClick={() => handleColorChange("primaryColor", color)}
                              >
                                {settings.primaryColor === color && (
                                  <Check className="h-4 w-4" 
                                    style={{ color: "#fff" }}
                                  />
                                )}
                              </Button>
                            ))}
                          </div>
                          <input
                            type="color"
                            id="primary-color"
                            value={settings.primaryColor}
                            onChange={(e) => handleColorChange("primaryColor", e.target.value)}
                            className="mt-2 w-full"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                speak("Görünüm ayarları: " + 
                  (activePreset ? presetThemes.find(t => t.id === activePreset)?.name + " teması seçili. " : "Özel tema") +
                  " Yazı boyutu: %" + Math.round(settings.fontSize * 100) + 
                  ". Kontrast seviyesi: " + (settings.contrastLevel < 1.5 ? 'Normal' : 
                    settings.contrastLevel < 2.5 ? 'Orta' : 'Yüksek')
                );
              }}
              className="mr-auto"
            >
              <Volume2 className="h-4 w-4 mr-2" />
              Sesli Anlat
            </Button>
            <DialogClose asChild>
              <Button className="bg-[#1565C0] text-white">
                Tamam
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}