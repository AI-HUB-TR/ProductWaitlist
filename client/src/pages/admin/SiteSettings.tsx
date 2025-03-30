import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Check } from 'lucide-react';

export default function SiteSettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    siteName: 'ZekiBot',
    siteDescription: 'Türkiye\'nin ilk tamamen Türkçe, teknoloji ile yeni tanışanlar için tasarlanmış yapay zeka platformu',
    contactEmail: 'iletisim@zekibot.com',
    contactPhone: '0212 123 45 67',
    footerText: '© 2025 ZekiBot. Tüm hakları saklıdır.'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    setIsLoading(true);
    
    // Burada API'ye kaydetme işlemi yapılır - Simüle ediyoruz
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Ayarlar kaydedildi",
        description: "Site ayarları başarıyla güncellendi.",
      });
    }, 1000);
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Genel Site Ayarları</CardTitle>
          <CardDescription>
            Sitenin genel görünüm ve içeriğini buradan düzenleyebilirsiniz.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="siteName">Site Adı</Label>
            <Input
              id="siteName"
              name="siteName"
              value={formData.siteName}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="siteDescription">Site Açıklaması</Label>
            <Textarea
              id="siteDescription"
              name="siteDescription"
              value={formData.siteDescription}
              onChange={handleInputChange}
              rows={3}
            />
            <p className="text-sm text-muted-foreground">
              Bu açıklama ana sayfada ve meta açıklamalarda kullanılacaktır.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>İletişim Bilgileri</CardTitle>
          <CardDescription>
            İletişim sayfasında ve footer'da görünecek iletişim bilgilerini düzenleyin.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contactEmail">İletişim E-posta Adresi</Label>
            <Input
              id="contactEmail"
              name="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contactPhone">İletişim Telefon Numarası</Label>
            <Input
              id="contactPhone"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleInputChange}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Footer Ayarları</CardTitle>
          <CardDescription>
            Sitenin alt kısmında görünecek metinleri düzenleyin.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="footerText">Footer Metin</Label>
            <Input
              id="footerText"
              name="footerText"
              value={formData.footerText}
              onChange={handleInputChange}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-[#1565C0] hover:bg-[#0D47A1]"
        >
          {isLoading ? (
            <>Kaydediliyor...</>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Değişiklikleri Kaydet
            </>
          )}
        </Button>
      </div>
    </div>
  );
}