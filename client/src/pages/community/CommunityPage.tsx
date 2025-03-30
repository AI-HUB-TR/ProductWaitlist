import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Users, 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  Heart, 
  Clock,
  Lightbulb,
  HelpCircle,
  Award,
  Bot
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import VoiceDescription from "@/components/accessibility/VoiceDescription";

// Sahte topluluk verileri
const communityPosts = [
  {
    id: 1,
    title: "ZekiBot ile ilk deneyimim",
    content: "Bugün yapay zeka ile ilk defa konuştum! Resmi tarif edip oluşturmasını istedim ve gerçekten çok güzel oldu. Herkesin denemesini tavsiye ederim.",
    author: "Ayşe Y.",
    avatar: "AY",
    date: "2 gün önce",
    likes: 24,
    comments: 5,
    category: "deneyimler",
    tags: ["yapay zeka", "resim oluşturma"]
  },
  {
    id: 2,
    title: "Hafıza oyununda kendi rekorumu kırdım!",
    content: "Zor seviyede tam 320 puan aldım. Eşleştirmeleri doğru yapınca çok yüksek puan veriyor. Sıra arkadaşlarımda, onları geçebilecekler mi merak ediyorum.",
    author: "Mehmet K.",
    avatar: "MK",
    date: "1 hafta önce",
    likes: 18,
    comments: 12,
    category: "deneyimler",
    tags: ["oyun", "hafıza oyunu", "puan rekoru"]
  },
  {
    id: 3,
    title: "Yapay zekanın hayatımıza etkileri",
    content: "Son zamanlarda yapay zekanın hayatımıza nasıl girdiğini ve ne gibi kolaylıklar sağladığını görmek çok ilginç. Sizce yapay zeka gelecekte hayatımızı nasıl etkileyecek?",
    author: "Ali R.",
    avatar: "AR",
    date: "3 gün önce",
    likes: 32,
    comments: 15,
    category: "tartışmalar",
    tags: ["yapay zeka", "gelecek", "teknoloji"]
  },
  {
    id: 4,
    title: "Yeni başlayanlar için en iyi ipuçları",
    content: "ZekiBot'u yeni kullanmaya başlayanlara birkaç ipucum var: Öncelikle sorunuzu net bir şekilde sorun. Detaylı cevaplar istiyorsanız, detaylı sorular sorun. Cevabı beğenmezseniz tekrar deneyin.",
    author: "Zeynep T.",
    avatar: "ZT",
    date: "5 gün önce",
    likes: 45,
    comments: 8,
    category: "ipuçları",
    tags: ["ipuçları", "başlangıç", "yardım"]
  },
  {
    id: 5,
    title: "Yaşlı annem için çok faydalı oldu",
    content: "Annem teknoloji kullanımında zorlanıyordu, ancak ZekiBot'un basit arayüzü ve sesli komutları sayesinde artık rahatça kullanabiliyor. Özellikle sesli okuma özelliği çok işine yarıyor.",
    author: "Hasan D.",
    avatar: "HD",
    date: "1 gün önce",
    likes: 36,
    comments: 7,
    category: "deneyimler",
    tags: ["erişilebilirlik", "sesli komutlar", "aile"]
  },
  {
    id: 6,
    title: "Sesli komut özelliği hakkında sorum var",
    content: "Sesli komut verirken bazen beni anlamıyor. Daha net anlaması için ne yapabilirim? Türkçe aksanım biraz farklı olabilir, bu etkiliyor olabilir mi?",
    author: "Kemal B.",
    avatar: "KB",
    date: "3 gün önce",
    likes: 12,
    comments: 21,
    category: "sorular",
    tags: ["sesli komut", "sorun", "yardım"]
  },
  {
    id: 7,
    title: "Bir haftalık deneyimim",
    content: "Bir haftadır ZekiBot kullanıyorum ve gerçekten çok memnunum. E-posta yazmak, bilgi aramak ve hafıza oyunları ile vakit geçirmek için kullanıyorum. Özellikle hafıza oyunu çok eğlenceli!",
    author: "Fatma S.",
    avatar: "FS",
    date: "4 gün önce",
    likes: 19,
    comments: 3,
    category: "deneyimler",
    tags: ["deneyim", "memnuniyet", "oyun"]
  },
  {
    id: 8,
    title: "Yüksek kontrast modu çok iyi",
    content: "Göz problemlerim var ve yüksek kontrast modu sayesinde çok daha rahat okuyabiliyorum. Yazı boyutunu büyütme özelliği de harika. Erişilebilirlik özelliklerini geliştiren ekibe teşekkürler!",
    author: "Nurhan K.",
    avatar: "NK",
    date: "1 hafta önce",
    likes: 28,
    comments: 6,
    category: "deneyimler",
    tags: ["erişilebilirlik", "kontrast", "görme"]
  }
];

// Sahte duyurular
const announcements = [
  {
    id: 1,
    title: "Yeni Hafıza Oyunu Eklendi",
    content: "Hafıza oyunu artık kullanımda! Üç farklı zorluk seviyesiyle hafızanızı test edebilirsiniz.",
    date: "1 hafta önce",
    icon: Award
  },
  {
    id: 2,
    title: "Sesli Komut Güncellemesi",
    content: "Sesli komut özelliği geliştirildi. Artık daha fazla Türkçe aksanı tanıyor ve komutları daha iyi anlıyor.",
    date: "2 hafta önce",
    icon: Bot
  },
  {
    id: 3,
    title: "Yardım Bölümü Yenilendi",
    content: "Yardım bölümümüz tamamen yenilendi. Artık daha detaylı rehberler ve görsellerle kullanımı daha kolay.",
    date: "3 hafta önce",
    icon: HelpCircle
  }
];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("tümü");
  const [activePosts, setActivePosts] = useState(communityPosts);
  
  // Kategori filtreleme
  const filterByCategory = (category: string) => {
    setActiveTab(category);
    
    if (category === "tümü") {
      setActivePosts(communityPosts);
    } else {
      setActivePosts(communityPosts.filter(post => post.category === category));
    }
  };
  
  // Etiket filtreleme
  const filterByTag = (tag: string) => {
    setActiveTab("tümü");
    setActivePosts(communityPosts.filter(post => post.tags.includes(tag)));
  };
  
  // Tarih formatı
  const formatDate = (dateString: string) => {
    return dateString;
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link href="/">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold flex items-center">
          <Users className="h-6 w-6 mr-2 text-[#1565C0]" />
          ZekiBot Topluluğu
        </h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Ana içerik */}
        <div className="md:col-span-2 space-y-6">
          <VoiceDescription
            description="Topluluk sayfasında bulunuyorsunuz. Burası kullanıcıların deneyimlerini, sorularını ve ipuçlarını paylaştığı bir alandır."
            buttonPosition="top-right"
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Topluluk Paylaşımları</CardTitle>
                <CardDescription>
                  Diğer kullanıcıların deneyimlerini, sorularını ve ipuçlarını keşfedin
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue="tümü" value={activeTab} onValueChange={filterByCategory}>
                  <TabsList className="w-full justify-start p-0 pl-6 border-b rounded-none">
                    <TabsTrigger value="tümü" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#1565C0]">
                      Tümü
                    </TabsTrigger>
                    <TabsTrigger value="deneyimler" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#1565C0]">
                      Deneyimler
                    </TabsTrigger>
                    <TabsTrigger value="sorular" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#1565C0]">
                      Sorular
                    </TabsTrigger>
                    <TabsTrigger value="ipuçları" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#1565C0]">
                      İpuçları
                    </TabsTrigger>
                    <TabsTrigger value="tartışmalar" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#1565C0]">
                      Tartışmalar
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value={activeTab} className="m-0 p-0">
                    <div className="divide-y">
                      {activePosts.map(post => (
                        <div key={post.id} className="p-6">
                          <div className="flex items-start space-x-4">
                            <Avatar>
                              <AvatarImage src={`/avatars/${post.id}.png`} alt={post.author} />
                              <AvatarFallback className="bg-[#1565C0] text-white">
                                {post.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium text-lg">{post.title}</h3>
                                <span className="text-sm text-muted-foreground flex items-center">
                                  <Clock className="h-3 w-3 mr-1" /> 
                                  {formatDate(post.date)}
                                </span>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {post.author}
                              </div>
                              <p className="mt-2 mb-3">
                                {post.content}
                              </p>
                              <div className="flex flex-wrap gap-2 mb-3">
                                {post.tags.map(tag => (
                                  <Button 
                                    key={tag} 
                                    variant="outline" 
                                    size="sm"
                                    className="h-6 px-2 text-xs"
                                    onClick={() => filterByTag(tag)}
                                  >
                                    #{tag}
                                  </Button>
                                ))}
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <Button variant="ghost" size="sm" className="flex items-center space-x-1 h-8 px-2">
                                  <ThumbsUp className="h-4 w-4" />
                                  <span>{post.likes}</span>
                                </Button>
                                <Button variant="ghost" size="sm" className="flex items-center space-x-1 h-8 px-2">
                                  <MessageSquare className="h-4 w-4" />
                                  <span>{post.comments}</span>
                                </Button>
                                <Button variant="ghost" size="sm" className="flex items-center space-x-1 h-8 px-2">
                                  <Share2 className="h-4 w-4" />
                                  <span>Paylaş</span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </VoiceDescription>
        </div>
        
        {/* Yan panel */}
        <div className="space-y-6">
          {/* Duyurular */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-[#1565C0]" />
                Duyurular
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {announcements.map(announcement => (
                  <div key={announcement.id} className="pb-4 last:pb-0 border-b last:border-0">
                    <div className="flex items-start space-x-3">
                      <div className="bg-muted rounded-full p-2">
                        <announcement.icon className="h-4 w-4 text-[#1565C0]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{announcement.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{announcement.content}</p>
                        <p className="text-xs text-muted-foreground mt-2">{announcement.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Popüler Etiketler */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Popüler Etiketler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => filterByTag("yapay zeka")}
                >
                  #yapay zeka
                  <span className="ml-1 text-xs bg-muted rounded-full px-1">8</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => filterByTag("erişilebilirlik")}
                >
                  #erişilebilirlik
                  <span className="ml-1 text-xs bg-muted rounded-full px-1">5</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => filterByTag("sesli komut")}
                >
                  #sesli komut
                  <span className="ml-1 text-xs bg-muted rounded-full px-1">4</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => filterByTag("oyun")}
                >
                  #oyun
                  <span className="ml-1 text-xs bg-muted rounded-full px-1">6</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => filterByTag("yardım")}
                >
                  #yardım
                  <span className="ml-1 text-xs bg-muted rounded-full px-1">3</span>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Topluluk İstatistikleri */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Topluluk İstatistikleri</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Toplam Kullanıcı:</span>
                  <span className="font-medium">1,254</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Paylaşım Sayısı:</span>
                  <span className="font-medium">345</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bugün Aktif:</span>
                  <span className="font-medium">78</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Toplam Yorum:</span>
                  <span className="font-medium">1,876</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}