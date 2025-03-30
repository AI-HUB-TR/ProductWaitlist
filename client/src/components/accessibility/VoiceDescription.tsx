import { useState } from "react";
import { useSpeech } from "@/hooks/use-speech";
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";

interface VoiceDescriptionProps {
  description: string;
  visualLabel?: string;
  children: React.ReactNode;
  className?: string;
  buttonPosition?: "top-right" | "bottom-right" | "top-left" | "bottom-left" | "none";
  showOnHover?: boolean;
}

/**
 * Görsel elemanlar için sesli açıklama sağlayan bileşen
 * Görsele hover edildiğinde veya tıklandığında açıklama seslendirilir
 * 
 * @example
 * <VoiceDescription 
 *   description="Bu bir kedi resmidir. Turuncu renkte, yeşil gözlü bir kedidir."
 *   visualLabel="Kedi resmi"
 * >
 *   <img src="/kedi.jpg" alt="Kedi" />
 * </VoiceDescription>
 */
export default function VoiceDescription({
  description,
  visualLabel,
  children,
  className = "",
  buttonPosition = "top-right",
  showOnHover = true
}: VoiceDescriptionProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { speak, isSpeaking, cancelSpeech } = useSpeech();
  
  const handleSpeak = () => {
    if (isSpeaking) {
      cancelSpeech();
    } else {
      speak(description);
    }
  };
  
  const getButtonPositionClass = () => {
    switch (buttonPosition) {
      case "top-right":
        return "top-1 right-1";
      case "bottom-right":
        return "bottom-1 right-1";
      case "top-left":
        return "top-1 left-1";
      case "bottom-left":
        return "bottom-1 left-1";
      case "none":
        return "hidden";
      default:
        return "top-1 right-1";
    }
  };
  
  return (
    <div 
      className={`relative group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      
      {/* Sesli açıklama butonu */}
      <Button
        size="icon"
        variant="ghost"
        onClick={handleSpeak}
        aria-label={visualLabel || "Sesli açıklamayı dinle"}
        className={`
          absolute w-7 h-7 p-1 text-[#1565C0] bg-white/80 rounded-full
          transition-opacity
          ${getButtonPositionClass()}
          ${showOnHover 
            ? (isHovered ? "opacity-100" : "opacity-0") 
            : "opacity-100"}
          ${isSpeaking ? "bg-[#1565C0] text-white" : ""}
        `}
      >
        <Volume2 className="h-full w-full" />
      </Button>
    </div>
  );
}