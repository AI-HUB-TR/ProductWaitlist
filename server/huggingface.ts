import fetch from "node-fetch";

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY || "";
// Türkçe modellere geçiş
const CHAT_MODEL_URL = "https://api-inference.huggingface.co/models/dbmdz/bert-base-turkish-cased";
const TEXT_GENERATION_MODEL_URL = "https://api-inference.huggingface.co/models/dbmdz/convbert-base-turkish-cased";

// Model türlerine göre URL seçimi (Türkçe odaklı modeller)
const MODEL_URLS: Record<string, string> = {
  chat: CHAT_MODEL_URL,
  text: TEXT_GENERATION_MODEL_URL,
  code: "https://api-inference.huggingface.co/models/Salesforce/codegen-2B-mono",
  image: "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2",
  translation: "https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-tr-en", // Türkçe-İngilizce çeviri
  summarization: "https://api-inference.huggingface.co/models/facebook/bart-large-cnn"
};

// API yanıt tipleri
interface GeneratedTextResponse {
  generated_text: string;
}

interface SummaryTextResponse {
  summary_text: string;
}

interface TranslationTextResponse {
  translation_text: string;
}

// Bu fonksiyon Hugging Face API ile iletişim kurar veya hazır yanıtları kullanır
export async function getHuggingFaceResponse(
  message: string, 
  modelType: string = "chat"
): Promise<string> {
  try {
    // Belirli anahtar kelimeleri kontrol et ve öncelikle yerel yanıtları kullanmayı dene
    const normalizedMessage = message.toLowerCase();
    if (modelType === "chat") {
      // Selamlaşma mesajları için her zaman yerel yanıtları kullan (daha doğal Türkçe için)
      if (normalizedMessage.includes("merhaba") || 
          normalizedMessage.includes("selam") || 
          normalizedMessage.includes("nasılsın") || 
          normalizedMessage.includes("naber") || 
          normalizedMessage.includes("teşekkür") || 
          normalizedMessage.includes("sağol")) {
        return getFallbackResponse(message, modelType);
      }
    }
    
    // API anahtarı yoksa, yerel yanıtlar kullan
    if (!HUGGING_FACE_API_KEY) {
      console.warn("Hugging Face API key is not set. Using fallback responses.");
      return getFallbackResponse(message, modelType);
    }
    
    const modelUrl = MODEL_URLS[modelType] || CHAT_MODEL_URL;
    
    const response = await fetch(modelUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HUGGING_FACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: message }),
    });
    
    if (!response.ok) {
      console.warn(`API responded with status: ${response.status}`);
      return getFallbackResponse(message, modelType);
    }
    
    const data = await response.json();
    
    // Yanıt formatını model türüne göre işle
    let responseText = "";
    if (modelType === "chat" || modelType === "text") {
      if (Array.isArray(data) && data.length > 0) {
        const item = data[0] as GeneratedTextResponse;
        if (item && item.generated_text) {
          responseText = item.generated_text;
        }
      } else if (data && typeof data === 'object') {
        const item = data as GeneratedTextResponse;
        if (item.generated_text) {
          responseText = item.generated_text;
        }
      }
    } else if (modelType === "summarization") {
      if (Array.isArray(data) && data.length > 0) {
        const item = data[0] as SummaryTextResponse;
        if (item && item.summary_text) {
          responseText = item.summary_text;
        }
      }
    } else if (modelType === "translation") {
      if (Array.isArray(data) && data.length > 0) {
        const item = data[0] as TranslationTextResponse;
        if (item && item.translation_text) {
          responseText = item.translation_text;
        }
      }
    }
    
    // API yanıtı boş veya çok kısa ise yerel yanıtlar kullan
    if (!responseText || responseText.length < 5) {
      console.warn("Empty or very short response from API, using fallback responses.");
      return getFallbackResponse(message, modelType);
    }
    
    // API yanıtı İngilizce ise ve chat modunda ise yerel yanıtlar kullan
    if (modelType === "chat" && isEnglishResponse(responseText)) {
      console.warn("English response from API, using Turkish fallback responses.");
      return getFallbackResponse(message, modelType);
    }
    
    return responseText;
  } catch (error) {
    console.error("Error calling Hugging Face API:", error);
    return getFallbackResponse(message, modelType);
  }
}

// Yanıtın İngilizce olup olmadığını kontrol et
function isEnglishResponse(text: string): boolean {
  // İngilizce dilinde yaygın olan kelimeler
  const englishWords = ["the", "is", "and", "in", "to", "a", "of", "for", "my", "i", "you", "that", "it", "with"];
  const lowercaseText = text.toLowerCase();
  
  // İngilizce kelimeler yanıtta ne kadar yaygın kullanılıyor?
  let englishWordCount = 0;
  for (const word of englishWords) {
    if (lowercaseText.includes(` ${word} `) || lowercaseText.startsWith(`${word} `)) {
      englishWordCount++;
    }
  }
  
  // Türkçe karakterler içeriyorsa muhtemelen Türkçedir
  const containsTurkishChars = /[şŞğĞüÜçÇöÖıİ]/.test(text);
  
  // Eğer Türkçe karakterler varsa veya çok az İngilizce kelime varsa Türkçedir
  return !containsTurkishChars && englishWordCount >= 2;
}

// Model detayları için tip tanımı
interface ModelDetail {
  prompt: string;
  features: string[];
  examples: string[];
  instructions: string;
}

// Model özellikleri için açıklamalar getir
export async function getModelDetailResponse(modelId: string): Promise<{ features: string[]; examples: string[]; instructions: string }> {
  // Model özellikleri, örnek kullanımlar ve talimatları içeren bir yapı döndür
  const modelDetails: Record<string, ModelDetail> = {
    "chat-ai": {
      prompt: "Sohbet yapay zekası nedir ve nasıl kullanılır? Örnek kullanım senaryoları ve faydalı örnekler ver.",
      features: [
        "Doğal dil işlemeyi kullanarak sohbetlere katılır",
        "Genel bilgi sorularına cevap verir",
        "Günlük konuşmalara uygun, doğal yanıtlar üretir",
        "Basit fıkralar anlatabilir ve farklı konularda bilgi verebilir",
        "Türkçe dilinde yardımcı olacak şekilde tasarlanmıştır"
      ],
      examples: [
        "Bugün hava nasıl olacak?",
        "İstanbul'un tarihi yerleri nelerdir?",
        "Sağlıklı yaşam için öneriler verir misin?",
        "İyi bir gezi için yanıma neler almalıyım?",
        "Türk mutfağından sevilen yemekler nelerdir?"
      ],
      instructions: "Metin kutusuna sorunuzu yazın ve 'Gönder' düğmesine tıklayın. Yapay zeka en kısa sürede yanıt verecektir. Sorunuzu ne kadar açık ve anlaşılır sorarsanız, o kadar iyi yanıt alırsınız."
    },
    "image-ai": {
      prompt: "Görsel oluşturan yapay zeka ne işe yarar? En iyi sonuçları almak için nasıl kullanılır?",
      features: [
        "Metin açıklamasına dayalı görsel oluşturma",
        "Farklı sanat stillerinde resimler üretebilme",
        "Gerçekçi ve hayal ürünü görseller yaratabilme",
        "İstenilen temalarda görseller oluşturabilme",
        "Çeşitli renk paletlerini ve kompozisyonları destekleme"
      ],
      examples: [
        "Gün batımında deniz kenarında bir kayık",
        "Masalsı bir orman ve içinde küçük bir kulübe",
        "Yağmurlu bir günde İstanbul sokakları",
        "Van Gogh stilinde çiçek bahçesi",
        "Uzay istasyonundan dünya manzarası"
      ],
      instructions: "İstediğiniz görseli metinle tanımlayın ve 'Oluştur' düğmesine tıklayın. Ne kadar detaylı tanımlarsanız o kadar iyi sonuç alırsınız. Belirli bir sanat stili veya renk tonu belirtebilirsiniz."
    },
    "code-ai": {
      prompt: "Kod yazan yapay zeka nasıl çalışır? Hangi programlama dillerini destekler ve nasıl kullanılır?",
      features: [
        "Birçok programlama dilinde kod yazabilme",
        "Kod hatalarını tespit edip düzeltebilme",
        "Mevcut kodun açıklamasını yapabilme",
        "Algoritma önerileri sunabilme",
        "Basit projeler ve fonksiyonlar oluşturabilme"
      ],
      examples: [
        "Python ile dosyaları sıralayan bir program yaz",
        "JavaScript ile basit bir sayaç oluştur",
        "HTML ve CSS kullanarak bir iletişim formu tasarla",
        "Bu kodun neden hata verdiğini açıkla: [hatalı kod]",
        "SQL ile müşteri tablosundan veri çekme sorgusu yaz"
      ],
      instructions: "İhtiyacınız olan kodu veya çözmek istediğiniz problemi açıklayın. Programlama dilini belirtirseniz daha doğru sonuçlar alırsınız. Mevcut kodunuzu paylaşarak hata düzeltme veya iyileştirme önerileri alabilirsiniz."
    },
    "calculator-ai": {
      prompt: "Yapay zeka temelli hesap yapma asistanı nasıl kullanılır ve ne tür problemleri çözebilir?",
      features: [
        "Karmaşık matematiksel işlemleri çözebilme",
        "Cebirsel denklemleri hesaplayabilme",
        "Geometri problemlerini çözebilme",
        "İstatistiksel hesaplamalar yapabilme",
        "Adım adım çözüm yollarını açıklayabilme"
      ],
      examples: [
        "3x + 5 = 20 denklemini çöz",
        "75 kilogramlık bir insanın Vücut Kitle İndeksi ne olmalıdır?",
        "3 metre çapında bir dairenin alanı nedir?",
        "250, 320, 145, 780 ve 455 sayılarının ortalaması nedir?",
        "Aylık 4500 TL taksit ödemesi ile 120.000 TL kredi çekmek için faiz oranı ne olmalı?"
      ],
      instructions: "Hesaplamak istediğiniz matematiksel problemi açık bir şekilde yazın. Karmaşık problemlerde adım adım çözüm görmek istiyorsanız bunu belirtin. Birimler ve formüller hakkında açıklama isteyebilirsiniz."
    },
    "game-ai": {
      prompt: "Yapay zeka ile oynayabileceğimiz oyunlar nelerdir? ZekiBot'taki oyun modülü ne tür etkileşimler sunar?",
      features: [
        "Kelime oyunları ve bilmeceler sunabilme",
        "Düşünme ve mantık oyunları oynayabilme",
        "Şans oyunları ve tahmin oyunları sunabilme",
        "Hafıza oyunlarında rakip olabilme",
        "Kişiselleştirilmiş zorluk seviyelerinde oyun oynayabilme"
      ],
      examples: [
        "Aklından bir sayı tut oyunu oynayalım",
        "Bana bir bilmece sor",
        "Adam asmaca oyunu oynayalım",
        "Bir kelime tahmin oyunu başlat",
        "Zor seviyede bir mantık bulmacası çözelim"
      ],
      instructions: "Oynamak istediğiniz oyunu belirtin ve başlamak için 'Oyna' düğmesine tıklayın. Oyun sırasında yanıtlarınızı metin kutusuna yazabilirsiniz. Oyunu sonlandırmak istediğinizde 'Oyunu Bitir' diyebilirsiniz."
    },
    "translate-ai": {
      prompt: "Çeviri yapay zekası nasıl çalışır? Hangi diller arasında çeviri yapabilir ve nasıl en iyi sonucu alırız?",
      features: [
        "100'den fazla dil arasında çeviri yapabilme",
        "Uzun metinleri hızlıca tercüme edebilme",
        "Kültüre özgü deyimleri anlayabilme",
        "Bağlama göre doğru anlamı seçebilme",
        "Teknik terimler ve özel alanlar için çeviri yapabilme"
      ],
      examples: [
        "İngilizce: Hello, how are you today?",
        "Almanca: Ich möchte einen Kaffee bestellen.",
        "Fransızca: Je voudrais visiter le musée demain.",
        "İspanyolca: ¿Dónde está la estación de tren?",
        "İtalyanca: Quanto costa questo libro?"
      ],
      instructions: "Çevirmek istediğiniz metni yazın ve kaynak dili belirtin. Hedef dili seçtikten sonra 'Çevir' düğmesine tıklayın. Daha iyi çeviri almak için cümleleri tam ve anlaşılır yazın."
    },
    "audio-ai": {
      prompt: "Ses asistanı yapay zekası ne yapabilir? Metinden sese dönüşüm ve ses tanıma özellikleri nasıl kullanılır?",
      features: [
        "Metinden sese dönüşüm yapabilme",
        "Sesten metne dönüşüm yapabilme",
        "Farklı ses tonları ve aksanlarda konuşabilme",
        "Müzik ve ses efektleri oluşturabilme",
        "Sesli komutları anlayıp yanıtlayabilme"
      ],
      examples: [
        "Bu metni sesli olarak oku: [metin]",
        "Bana sakin bir fon müziği oluştur",
        "Bu ses kaydını metne dönüştür",
        "Erkek/kadın sesiyle şu metni seslendir",
        "Kuş sesleri içeren bir doğa sesi oluştur"
      ],
      instructions: "Metinden sese dönüşüm için metninizi yazın ve 'Seslendir' düğmesine tıklayın. Ses tanıma için 'Mikrofon' simgesine tıklayıp konuşmaya başlayın. Ses ayarlarından hız ve tonu değiştirebilirsiniz."
    },
    "summary-ai": {
      prompt: "Metin özetleme yapay zekası nasıl çalışır? Hangi tür metinleri özetleyebilir ve nasıl kullanılır?",
      features: [
        "Uzun metinleri kısa özetlere dönüştürebilme",
        "Ana fikirleri ve anahtar noktaları çıkarabilme",
        "Farklı uzunluklarda özetler oluşturabilme",
        "Makaleler, haberler ve belgeleri özetleyebilme",
        "Maddeler halinde özetleme yapabilme"
      ],
      examples: [
        "Bu makaleyi 3 paragrafta özetle",
        "Bu haberin ana fikrini bir cümlede belirt",
        "Bu dokümanın önemli noktalarını maddeler halinde çıkar",
        "Bu kitap bölümünü 250 kelimede özetle",
        "Bu bilimsel makaleyi genel okuyucular için basitleştir"
      ],
      instructions: "Özetlemek istediğiniz metni yapıştırın ve istediğiniz özet uzunluğunu belirtin. 'Özetle' düğmesine tıkladığınızda, yapay zeka metninizi işleyip önemli noktaları içeren bir özet oluşturacaktır."
    },
    "education-ai": {
      prompt: "Eğitim asistanı yapay zekası nasıl öğrenmeye yardımcı olur? Hangi konularda ve seviyede destek verebilir?",
      features: [
        "Farklı eğitim seviyelerinde ders içerikleri sunabilme",
        "Konuları basit ve anlaşılır şekilde açıklayabilme",
        "Sorulara detaylı cevaplar verebilme",
        "Test ve alıştırmalar oluşturabilme",
        "Öğrenme sürecini kişiselleştirebilme"
      ],
      examples: [
        "Fotosentez sürecini basitçe açıklar mısın?",
        "İlkokul 4. sınıf seviyesinde kesirler konusunu anlat",
        "Türkçe dilbilgisinde özne ve yüklem konusunu örneklerle açıkla",
        "Lise seviyesinde Newton'un hareket yasalarını anlat",
        "Osmanlı İmparatorluğu'nun kuruluşu hakkında bilgi ver"
      ],
      instructions: "Öğrenmek istediğiniz konuyu ve seviyenizi belirtin. Spesifik sorular sorarak daha detaylı bilgiler alabilirsiniz. Konuyu anlaşılır hale getirmek için örnekler veya görsel açıklamalar isteyebilirsiniz."
    }
  };

  // İstenen modelin detaylarını getir veya varsayılan detayları döndür
  if (modelId && modelDetails[modelId]) {
    try {
      // API ile model açıklaması oluşturmayı dene
      const modelPrompt = modelDetails[modelId].prompt;
      const apiResponse = await getHuggingFaceResponse(modelPrompt, "text");
      
      // API yanıtı varsa, örnekleri ve özellikleri ekleyerek döndür
      if (apiResponse && apiResponse.length > 50) {
        return {
          features: modelDetails[modelId].features,
          examples: modelDetails[modelId].examples,
          instructions: apiResponse
        };
      }
    } catch (error) {
      console.error(`Error generating model details for ${modelId}:`, error);
    }
    
    // API ile yanıt alınamadıysa hazır içerikleri döndür
    return {
      features: modelDetails[modelId].features,
      examples: modelDetails[modelId].examples,
      instructions: "Bu model şu anda detaylı açıklama için hazırlanıyor. Lütfen daha sonra tekrar deneyin."
    };
  }
  
  // Model bulunamadığında varsayılan detayları döndür
  return {
    features: [
      "Doğal dil işleme ve anlama",
      "Sorulara hızlı ve doğru yanıtlar",
      "Farklı konularda bilgi ve yardım",
      "Kullanıcı dostu arayüz",
      "Türkçe dil desteği"
    ],
    examples: [
      "Genel bilgi soruları",
      "Günlük hayatta yardımcı olabilecek bilgiler",
      "Çeşitli konularda tavsiyeler",
      "Eğitim ve öğrenim desteği",
      "Eğlence içerikleri"
    ],
    instructions: "Modele sorularınızı metin kutusundan yazarak iletebilirsiniz. Yanıtlar hızlı ve anlaşılır şekilde sunulacaktır."
  };
}

// API anahtarı yokken veya API yanıt vermediğinde kullanılacak hazır yanıtlar
function getFallbackResponse(message: string, modelType: string = "chat"): string {
  const normalizedMessage = message.toLowerCase();
  
  // Görsel modeliyle ilgili sorgu
  if (modelType === "image") {
    // Verilen prompt ile alakalı bir görsel oluşturulamadı yanıtı
    return "Belirttiğiniz görsel şu anda oluşturulamadı. Lütfen farklı bir açıklama ile tekrar deneyin veya daha sonra tekrar deneyin. Örnek olarak 'Mavi gökyüzünde uçan kuşlar' veya 'Deniz kenarında günbatımı' gibi açıklamaları deneyebilirsiniz.";
  }
  
  // Model türüne göre farklı yanıtlar
  if (modelType === "chat") {
    // Genel selamlaşmalar
    if (normalizedMessage.includes("merhaba") || normalizedMessage.includes("selam")) {
      return "Merhaba! Size nasıl yardımcı olabilirim?";
    }
    
    if (normalizedMessage.includes("nasılsın") || normalizedMessage.includes("naber")) {
      return "İyiyim, teşekkür ederim! Size bugün nasıl yardımcı olabilirim?";
    }
    
    if (normalizedMessage.includes("teşekkür") || normalizedMessage.includes("sağol")) {
      return "Rica ederim! Başka bir konuda yardıma ihtiyacınız olursa bana sorabilirsiniz.";
    }
    
    // Hava durumu soruları
    if (normalizedMessage.includes("hava") || normalizedMessage.includes("hava durumu")) {
      return "İstanbul'da bugün hava parçalı bulutlu, sıcaklık 22 derece civarında olacak. Öğleden sonra hafif yağmur ihtimali var. Dışarı çıkarken şemsiye almanızda fayda var.";
    }
    
    // Sağlık soruları
    if (normalizedMessage.includes("tansiyon") || normalizedMessage.includes("tansiyon")) {
      return "Yüksek tansiyonu kontrol altında tutmak için tuz tüketimini azaltmak, düzenli egzersiz yapmak ve stresten uzak durmak önemlidir. Doktorunuzun önerdiği ilaçları düzenli kullanmayı unutmayın. Ancak bu bilgiler genel tavsiyedir, mutlaka doktorunuza danışmalısınız.";
    }
    
    if (normalizedMessage.includes("hasta") || normalizedMessage.includes("doktor") || normalizedMessage.includes("grip")) {
      return "Kendinizi iyi hissetmiyorsanız, doktorunuza başvurmanızı öneririm. Tıbbi konularda size sadece genel bilgiler verebilirim, teşhis koyamam.";
    }
    
    // Yemek tarifleri
    if (normalizedMessage.includes("yemek") || normalizedMessage.includes("tarif") || normalizedMessage.includes("akşam yemeği")) {
      return "Kolay ve lezzetli bir akşam yemeği için fırında sebzeli tavuk yapabilirsiniz. Tavuk göğsünü dilimleyip, yanına patates, havuç ve biber ekleyin. Üzerine zeytinyağı, tuz ve baharat serpin. 180 derecede 40 dakika pişirin. Yanında yoğurt ile servis edebilirsiniz.";
    }
    
    // İstanbul hakkında
    if (normalizedMessage.includes("istanbul") && (normalizedMessage.includes("yer") || normalizedMessage.includes("mekan") || normalizedMessage.includes("gez"))) {
      return "İstanbul'da gezilecek birçok tarihi yer var. Ayasofya, Topkapı Sarayı, Sultanahmet Camii (Mavi Cami), Kapalı Çarşı ve Galata Kulesi en popüler yerlerden bazıları. Ayrıca Boğaz turu yapmak ve Adalar'ı ziyaret etmek de güzel bir deneyim olacaktır.";
    }
    
    // Türk mutfağı
    if (normalizedMessage.includes("türk yemek") || normalizedMessage.includes("türk mutfağı")) {
      return "Türk mutfağı dünyanın en zengin mutfaklarından biridir. Kebaplar, köfteler, dolmalar, börekler, baklavalar ve lokmalar en bilinen Türk yemekleridir. Ayrıca Türk kahvesi ve çay kültürü de dünyaca ünlüdür.";
    }
    
    // Teknoloji soruları
    if (normalizedMessage.includes("bilgisayar") || normalizedMessage.includes("telefon") || normalizedMessage.includes("teknoloji")) {
      return "Teknoloji kullanımında zorluk yaşıyorsanız, adım adım ilerlemek en iyisidir. Temel işlevleri öğrenerek başlayın ve yavaş yavaş ilerleyin. İnternet üzerinde birçok eğitim videosu bulabilirsiniz. Ayrıca yakınlarınızdan da yardım isteyebilirsiniz.";
    }
    
    // İnternet ve sosyal medya
    if (normalizedMessage.includes("internet") || normalizedMessage.includes("sosyal medya") || normalizedMessage.includes("facebook")) {
      return "İnternet ve sosyal medya platformları günümüzde iletişim için çok önemli araçlardır. Ancak güvenliğiniz için şifrelerinizi kimseyle paylaşmayın, tanımadığınız kişilerden gelen arkadaşlık isteklerini kabul etmeyin ve kişisel bilgilerinizi sınırlı paylaşın.";
    }
    
    // Genel bilgiler
    if (normalizedMessage.includes("türkiye") && normalizedMessage.includes("başkent")) {
      return "Türkiye'nin başkenti Ankara'dır.";
    }
    
    if (normalizedMessage.includes("atatürk")) {
      return "Mustafa Kemal Atatürk, Türkiye Cumhuriyeti'nin kurucusu ve ilk cumhurbaşkanıdır. 1881'de Selanik'te doğmuş, 10 Kasım 1938'de İstanbul'da vefat etmiştir.";
    }
    
    // Varsayılan yanıt
    return "Bu konuda size yardımcı olmak için elimden geleni yapacağım. Lütfen sorunuzu biraz daha açıklayabilir misiniz?";
  } 
  else if (modelType === "code") {
    return "İşte istediğiniz kod örneği:\n\n```javascript\n// Basit bir sayaç uygulaması\nlet count = 0;\n\nfunction increment() {\n  count++;\n  updateDisplay();\n}\n\nfunction decrement() {\n  if (count > 0) {\n    count--;\n    updateDisplay();\n  }\n}\n\nfunction updateDisplay() {\n  document.getElementById('counter').textContent = count;\n}\n```\n\nBu kodu HTML dosyanıza ekleyip, butona tıklama olaylarını bağlayarak kullanabilirsiniz.";
  }
  else if (modelType === "translation") {
    if (normalizedMessage.includes("hello") || normalizedMessage.includes("hi")) {
      return "Merhaba! Nasılsınız?";
    }
    return "Çevirilen metin: " + message;
  }
  else if (modelType === "summarization") {
    return "Bu metin, teknolojinin günlük hayattaki önemini, yapay zekanın gelişimini ve dijital dönüşümün toplum üzerindeki etkilerini inceliyor. Temel olarak, doğru kullanıldığında teknolojinin hayatımızı kolaylaştırabileceğini ancak bilinçli kullanım gerektirdiğini vurguluyor.";
  }
  
  // Diğer tüm modeller için varsayılan yanıt
  return "Bu işlem için şu anda hazır bir yanıt bulunmuyor. API anahtarı ile daha doğru sonuçlar alabilirsiniz.";
}
