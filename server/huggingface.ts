import fetch from "node-fetch";

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY || "";
const MODEL_URL = "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill";

// This function handles the communication with the Hugging Face API
export async function getHuggingFaceResponse(message: string): Promise<string> {
  try {
    // If we don't have an API key, return a friendly message
    if (!HUGGING_FACE_API_KEY) {
      console.warn("Hugging Face API key is not set. Using fallback responses.");
      return getFallbackResponse(message);
    }
    
    const response = await fetch(MODEL_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HUGGING_FACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: message }),
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract the generated response
    // Format will depend on the specific model used
    if (Array.isArray(data) && data.length > 0 && data[0].generated_text) {
      return data[0].generated_text;
    } else if (typeof data === 'object' && data.generated_text) {
      return data.generated_text;
    } else {
      console.warn("Unexpected response format from Hugging Face API:", data);
      return "Üzgünüm, cevap formatı beklenmedik bir şekildeydi. Lütfen daha sonra tekrar deneyiniz.";
    }
  } catch (error) {
    console.error("Error calling Hugging Face API:", error);
    return "Şu anda yanıt veremiyorum. Lütfen daha sonra tekrar deneyiniz.";
  }
}

// Fallback responses when API key is not available
function getFallbackResponse(message: string): string {
  const normalizedMessage = message.toLowerCase();
  
  if (normalizedMessage.includes("hava") || normalizedMessage.includes("hava durumu")) {
    return "İstanbul'da bugün hava parçalı bulutlu, sıcaklık 22 derece civarında olacak. Öğleden sonra hafif yağmur ihtimali var. Dışarı çıkarken şemsiye almanızda fayda var.";
  }
  
  if (normalizedMessage.includes("tansiyon")) {
    return "Yüksek tansiyonu kontrol altında tutmak için tuz tüketimini azaltmak, düzenli egzersiz yapmak ve stresten uzak durmak önemlidir. Doktorunuzun önerdiği ilaçları düzenli kullanmayı unutmayın. Ancak bu bilgiler genel tavsiyedir, mutlaka doktorunuza danışmalısınız.";
  }
  
  if (normalizedMessage.includes("yemek") || normalizedMessage.includes("tarif") || normalizedMessage.includes("akşam yemeği")) {
    return "Kolay ve lezzetli bir akşam yemeği için fırında sebzeli tavuk yapabilirsiniz. Tavuk göğsünü dilimleyip, yanına patates, havuç ve biber ekleyin. Üzerine zeytinyağı, tuz ve baharat serpin. 180 derecede 40 dakika pişirin. Yanında yoğurt ile servis edebilirsiniz.";
  }
  
  if (normalizedMessage.includes("merhaba") || normalizedMessage.includes("selam")) {
    return "Merhaba! Size nasıl yardımcı olabilirim?";
  }
  
  if (normalizedMessage.includes("teşekkür")) {
    return "Rica ederim! Başka bir konuda yardıma ihtiyacınız olursa bana sorabilirsiniz.";
  }
  
  if (normalizedMessage.includes("hasta") || normalizedMessage.includes("doktor")) {
    return "Kendinizi iyi hissetmiyorsanız, doktorunuza başvurmanızı öneririm. Tıbbi konularda size sadece genel bilgiler verebilirim, teşhis koyamam.";
  }
  
  // Default response for any other message
  return "Bu konuda size yardımcı olmak için daha fazla bilgiye ihtiyacım var. Lütfen sorunuzu biraz daha açıklayabilir misiniz?";
}
