// AI modellerinin veri yapısı
export interface AIModel {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  color: string;
  url: string;
}

// AI modelleri listesi
export const aiModels: AIModel[] = [
  {
    id: "chat-ai",
    name: "Sohbet AI",
    description: "Sorularınızı cevaplayacak, sohbet edebileceğiniz ve bilgi alabileceğiniz yapay zeka sistemi.",
    icon: "message-circle",
    category: "Metin",
    color: "bg-gradient-to-br from-blue-500 to-violet-600",
    url: "/models/chat-ai"
  },
  {
    id: "image-ai",
    name: "Görsel Oluşturucu",
    description: "Metinden görsel oluşturan, hayal ettiğiniz görselleri saniyeler içinde üreten yapay zeka.",
    icon: "image",
    category: "Görsel",
    color: "bg-gradient-to-br from-pink-500 to-orange-500",
    url: "/models/image-ai"
  },
  {
    id: "code-ai",
    name: "Kod Yazma",
    description: "Programlama yardımcınız! İstediğiniz kodları yazabilen, hataları düzeltebilen ve açıklayabilen yapay zeka.",
    icon: "code",
    category: "Kod",
    color: "bg-gradient-to-br from-emerald-500 to-teal-600",
    url: "/models/code-ai"
  },
  {
    id: "calculator-ai",
    name: "Hesap Yapma",
    description: "Karmaşık matematik problemlerini çözen, formülleri anlayan ve grafikler oluşturabilen yapay zeka.",
    icon: "calculator",
    category: "Matematik",
    color: "bg-gradient-to-br from-yellow-400 to-amber-600",
    url: "/models/calculator-ai"
  },
  {
    id: "game-ai",
    name: "Oyun Oynama",
    description: "Sizinle çeşitli zeka oyunları oynayabilen, tahmin oyunları ve bilmeceler sunan eğlenceli yapay zeka.",
    icon: "gamepad-2",
    category: "Eğlence",
    color: "bg-gradient-to-br from-indigo-500 to-purple-600",
    url: "/models/game-ai"
  },
  {
    id: "translate-ai",
    name: "Çeviri Asistanı",
    description: "Tüm dünya dillerinde çeviri yapabilen, cümleleri ve metinleri hızlıca tercüme eden yapay zeka.",
    icon: "languages",
    category: "Metin",
    color: "bg-gradient-to-br from-cyan-500 to-blue-600",
    url: "/models/translate-ai"
  },
  {
    id: "audio-ai",
    name: "Ses Asistanı",
    description: "Metinden sese, sesten metne dönüşüm yapabilen, müzik ve ses efektleri oluşturabilen yapay zeka.",
    icon: "music",
    category: "Ses",
    color: "bg-gradient-to-br from-red-500 to-pink-600",
    url: "/models/audio-ai"
  },
  {
    id: "summary-ai",
    name: "Özetleme",
    description: "Uzun metinleri özetleyen, ana fikirleri çıkaran ve notlar oluşturabilen yapay zeka.",
    icon: "file-text",
    category: "Metin",
    color: "bg-gradient-to-br from-green-500 to-emerald-600",
    url: "/models/summary-ai"
  },
  {
    id: "education-ai",
    name: "Eğitim Asistanı",
    description: "Her yaş grubuna uygun eğitim içerikleri sunan, ders çalışmanıza yardımcı olan yapay zeka.",
    icon: "book-open",
    category: "Eğitim",
    color: "bg-gradient-to-br from-blue-400 to-indigo-600",
    url: "/models/education-ai"
  }
];

// Kategorilere göre filtreleme
export function getModelsByCategory(category: string): AIModel[] {
  return aiModels.filter(model => model.category === category);
}

// ID'ye göre model bulma
export function getModelById(id: string): AIModel | undefined {
  return aiModels.find(model => model.id === id);
}

// Tüm kategorileri getirme
export function getAllCategories(): string[] {
  const categories = aiModels.map(model => model.category);
  const uniqueCategories = Array.from(new Set(categories));
  return uniqueCategories; // Benzersiz kategoriler
}