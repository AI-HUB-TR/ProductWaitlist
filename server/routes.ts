import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { WaitlistEntry, Contact, insertWaitlistSchema, insertContactSchema } from "@shared/schema";
import { getHuggingFaceResponse, getModelDetailResponse } from "./huggingface";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  
  // Chat endpoint - sends messages to Hugging Face API
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, modelType } = req.body;
      
      if (!message || typeof message !== "string") {
        return res.status(400).json({ message: "Geçerli bir mesaj gereklidir." });
      }
      
      // Get response from Hugging Face API
      const response = await getHuggingFaceResponse(message, modelType || "chat");
      
      // Özel görsel yanıtı işleme
      if (modelType === "image") {
        // Görsel oluşturma hatası varsa
        if (response === "API_KEY_MISSING" || response === "API_ERROR" || response === "ERROR_GENERATING_IMAGE") {
          return res.status(400).json({ 
            message: "Görsel oluşturulamadı. Lütfen farklı bir açıklama deneyin veya daha sonra tekrar deneyin.",
            error: response
          });
        }

        // Base64 tam değil - kırpılmış bir yanıt mı kontrol et
        if (response && response.startsWith("data:image/jpeg;base64,") && response.length < 500) {
          return res.status(400).json({ 
            message: "Görsel veri eksik. Lütfen daha sonra tekrar deneyin.",
            error: "INCOMPLETE_IMAGE_DATA"
          });
        }
      }
      
      return res.status(200).json({ message: response });
    } catch (error) {
      console.error("Chat API error:", error);
      return res.status(500).json({ 
        message: "Üzgünüm, bir hata oluştu. Lütfen daha sonra tekrar deneyiniz." 
      });
    }
  });
  
  // Model details endpoint - gets details about a specific AI model
  app.get("/api/models/:modelId", async (req, res) => {
    try {
      const { modelId } = req.params;
      
      if (!modelId) {
        return res.status(400).json({ message: "Model ID gereklidir." });
      }
      
      // Get model details from Hugging Face API
      const modelDetails = await getModelDetailResponse(modelId);
      
      return res.status(200).json({ 
        modelId,
        ...modelDetails
      });
    } catch (error) {
      console.error(`Model details API error for ${req.params.modelId}:`, error);
      return res.status(500).json({ 
        message: "Model detayları alınırken bir hata oluştu. Lütfen daha sonra tekrar deneyiniz." 
      });
    }
  });
  
  // Waitlist endpoint
  app.post("/api/waitlist", async (req, res) => {
    try {
      const result = insertWaitlistSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Form verilerinde hata var. Lütfen tüm alanları doğru doldurunuz." 
        });
      }
      
      const waitlistEntry = result.data;
      
      // Add to waitlist
      const savedEntry = await storage.addToWaitlist(waitlistEntry);
      
      return res.status(200).json({ 
        message: "Bekleme listesine başarıyla kaydoldunuz.", 
        data: savedEntry 
      });
    } catch (error) {
      console.error("Waitlist API error:", error);
      return res.status(500).json({ 
        message: "Kayıt sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyiniz." 
      });
    }
  });
  
  // Contact form endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const result = insertContactSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Form verilerinde hata var. Lütfen tüm alanları doğru doldurunuz." 
        });
      }
      
      const contactForm = result.data;
      
      // Save contact form submission
      const savedContact = await storage.saveContactForm(contactForm);
      
      return res.status(200).json({ 
        message: "Mesajınız başarıyla gönderildi.", 
        data: savedContact 
      });
    } catch (error) {
      console.error("Contact API error:", error);
      return res.status(500).json({ 
        message: "Mesaj gönderimi sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyiniz." 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
