import { apiRequest } from "./queryClient";

// Chat API 
export async function sendChatMessage(message: string) {
  try {
    const response = await apiRequest("POST", "/api/chat", { message });
    return await response.json();
  } catch (error) {
    console.error("Error sending chat message:", error);
    throw error;
  }
}

// Waitlist API
export async function submitWaitlistForm(data: {
  fullName: string;
  email: string;
  phone?: string;
  age?: string;
  terms: boolean;
}) {
  try {
    const response = await apiRequest("POST", "/api/waitlist", data);
    return await response.json();
  } catch (error) {
    console.error("Error submitting waitlist form:", error);
    throw error;
  }
}

// Contact API
export async function submitContactForm(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  try {
    const response = await apiRequest("POST", "/api/contact", data);
    return await response.json();
  } catch (error) {
    console.error("Error submitting contact form:", error);
    throw error;
  }
}
