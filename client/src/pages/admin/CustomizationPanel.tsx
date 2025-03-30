import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Save, Wand2 } from 'lucide-react';

interface ThemeSettings {
  primaryColor: string;
  fontSize: number;
  borderRadius: number;
  colorScheme: 'light' | 'dark' | 'system';
}

export default function CustomizationPanel() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<ThemeSettings>({
    primaryColor: '#1565C0',
    fontSize: 16,
    borderRadius: 8,
    colorScheme: 'light'
  });

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      primaryColor: e.target.value
    });
  };

  const handleSliderChange = (name: keyof ThemeSettings, value: number[]) => {
    setSettings({
      ...settings,
      [name]: value[0]
    });
  };

  const handleRadioChange = (value: 'light' | 'dark' | 'system') => {
    setSettings({
      ...settings,
      colorScheme: value
    });
  };

  const handleSave = () => {
    setIsLoading(true);
    // Burada normalde API'ye gönderilip tema güncellenir - Simüle ediyoruz
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Tema ayarları kaydedildi",
        description: "Site teması başarıyla güncellendi.",
      });

      // Normalde burada site tema değişikliklerini uygulayacak bir fonksiyon çağrılır
      document.documentElement.style.setProperty('--primary', settings.primaryColor);
      document.documentElement.style.setProperty('--radius', `${settings.borderRadius}px`);
      document.documentElement.style.fontSize = `${settings.fontSize}px`;
    }, 1000);
  };

  const presetThemes = [
    { name: 'Mavi', color: '#1565C0', fontSize: 16, borderRadius: 8 },
    { name: 'Yeşil', color: '#2e7d32', fontSize: 16, borderRadius: 4 },
    { name: 'Turuncu', color: '#e65100', fontSize: 18, borderRadius: 12 },
    { name: 'Mor', color: '#6200ea', fontSize: 16, borderRadius: 8 }
  ];

  const applyPreset = (preset: { color: string, fontSize: number, borderRadius: number }) => {
    setSettings({
      ...settings,
      primaryColor: preset.color,
      fontSize: preset.fontSize,
      borderRadius: preset.borderRadius
    });

    toast({
      title: "Tema şablonu uygulandı",
      description: "Değişiklikleri kaydetmek için 'Temayı Kaydet' butonuna tıklayın.",
      variant: "default"
    });
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Site Teması ve Görünümü</CardTitle>
          <CardDescription>
            Sitenin renklerini, yazı boyutlarını ve diğer görsel özelliklerini buradan özelleştirebilirsiniz.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-4">Hazır Temalar</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {presetThemes.map((theme, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => applyPreset(theme)}
                    className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-2"
                    style={{
                      borderColor: theme.color,
                      backgroundColor: `${theme.color}10`
                    }}
                  >
                    <div className="w-8 h-8 rounded-full" style={{ backgroundColor: theme.color }}></div>
                    <span>{theme.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="primaryColor">Ana Renk</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="primaryColor"
                  type="color"
                  value={settings.primaryColor}
                  onChange={handleColorChange}
                  className="w-12 h-12 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={settings.primaryColor}
                  onChange={handleColorChange}
                  className="font-mono"
                />
              </div>
              <div className="h-10 rounded-md" style={{ backgroundColor: settings.primaryColor }}></div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label htmlFor="fontSize">Yazı Boyutu: {settings.fontSize}px</Label>
              </div>
              <Slider
                id="fontSize"
                min={12} 
                max={24} 
                step={1}
                value={[settings.fontSize]}
                onValueChange={(value) => handleSliderChange('fontSize', value)}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Küçük (12px)</span>
                <span>Normal (16px)</span>
                <span>Büyük (24px)</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label htmlFor="borderRadius">Köşe Yuvarlaklığı: {settings.borderRadius}px</Label>
              </div>
              <Slider
                id="borderRadius"
                min={0} 
                max={24} 
                step={1}
                value={[settings.borderRadius]}
                onValueChange={(value) => handleSliderChange('borderRadius', value)}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Keskin (0px)</span>
                <span>Normal (8px)</span>
                <span>Yuvarlak (24px)</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Renk Modu</Label>
              <RadioGroup 
                defaultValue={settings.colorScheme}
                onValueChange={handleRadioChange as (value: string) => void}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light">Açık</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark">Koyu</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="system" id="system" />
                  <Label htmlFor="system">Sistem</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Değişiklikleri İptal Et
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-[#1565C0] hover:bg-[#0D47A1]"
          >
            {isLoading ? (
              "Kaydediliyor..."
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Temayı Kaydet
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Önizleme</CardTitle>
          <CardDescription>
            Yaptığınız değişikliklerin örneklerine bu bölümden bakabilirsiniz.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md p-6" style={{ borderRadius: `${settings.borderRadius}px` }}>
            <h3 className="text-2xl font-bold mb-4" style={{ color: settings.primaryColor }}>
              Başlık Örneği
            </h3>
            <p className="mb-4" style={{ fontSize: `${settings.fontSize}px` }}>
              Bu bir paragraf örneğidir. Burada seçtiğiniz yazı boyutu ve diğer ayarlar görüntülenir.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="px-3 py-1 rounded-full text-white" style={{ backgroundColor: settings.primaryColor, borderRadius: `${settings.borderRadius}px` }}>
                Etiket 1
              </div>
              <div className="px-3 py-1 rounded-full text-white" style={{ backgroundColor: settings.primaryColor, borderRadius: `${settings.borderRadius}px` }}>
                Etiket 2
              </div>
              <div className="px-3 py-1 rounded-full text-white" style={{ backgroundColor: settings.primaryColor, borderRadius: `${settings.borderRadius}px` }}>
                Etiket 3
              </div>
            </div>
            <div className="flex gap-2">
              <Button style={{ backgroundColor: settings.primaryColor, borderRadius: `${settings.borderRadius}px` }}>
                Birincil Buton
              </Button>
              <Button variant="outline" style={{ borderColor: settings.primaryColor, color: settings.primaryColor, borderRadius: `${settings.borderRadius}px` }}>
                İkincil Buton
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}