import { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Sparkles, Check, Trophy, Award, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSound } from "@/hooks/use-sound-effects";

interface TechConfidenceMeterProps {
  showTitle?: boolean;
  showControls?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Yerel depolama anahtarı
const CONFIDENCE_STORAGE_KEY = 'zekibot_tech_confidence';
const ACHIEVEMENT_STORAGE_KEY = 'zekibot_achievements';

// Başarı rozetleri
const ACHIEVEMENTS = [
  { id: 'first_login', name: 'İlk Adım', description: 'ZekiBot\'a ilk kez giriş yaptınız', icon: '🔍', threshold: 0 },
  { id: 'first_chat', name: 'İlk Sohbet', description: 'İlk AI sohbetinizi gerçekleştirdiniz', icon: '💬', threshold: 10 },
  { id: 'explorer', name: 'Teknoloji Kâşifi', description: 'Tüm modelleri incelediniz', icon: '🧭', threshold: 30 },
  { id: 'memory_master', name: 'Hafıza Ustası', description: 'Hafıza oyununda 3 seviye tamamladınız', icon: '🎮', threshold: 40 },
  { id: 'community_joiner', name: 'Topluluk Üyesi', description: 'Topluluk sayfasında ilk paylaşımınızı yaptınız', icon: '👥', threshold: 50 },
  { id: 'skill_learner', name: 'Beceri Öğrencisi', description: 'İlk dijital beceri modülünü tamamladınız', icon: '📚', threshold: 60 },
  { id: 'adventurer', name: 'Dijital Maceracı', description: 'Platformda 5 farklı özelliği kullandınız', icon: '🌟', threshold: 80 },
  { id: 'tech_master', name: 'Teknoloji Ustası', description: 'Tüm özgüven seviyesine ulaştınız', icon: '🏆', threshold: 100 }
];

export default function TechConfidenceMeter({ 
  showTitle = true, 
  showControls = false,
  size = 'md',
  className = ''
}: TechConfidenceMeterProps) {
  // Teknoloji özgüven puanı (0-100 arası)
  const [confidenceScore, setConfidenceScore] = useState<number>(() => {
    const savedScore = localStorage.getItem(CONFIDENCE_STORAGE_KEY);
    return savedScore ? parseInt(savedScore, 10) : 10; // Varsayılan başlangıç değeri
  });
  
  // Kazanılan başarılar
  const [achievements, setAchievements] = useState<string[]>(() => {
    const savedAchievements = localStorage.getItem(ACHIEVEMENT_STORAGE_KEY);
    return savedAchievements ? JSON.parse(savedAchievements) : ['first_login'];
  });
  
  // Yeni başarı gösterimi
  const [showNewAchievement, setShowNewAchievement] = useState<string | null>(null);
  
  // Ses efektleri
  const { playSound } = useSound();

  // Özgüven puanı değiştiğinde yerel depolamaya kaydet
  useEffect(() => {
    localStorage.setItem(CONFIDENCE_STORAGE_KEY, confidenceScore.toString());
    
    // Özgüven puanı belirli eşikleri geçtiğinde yeni başarılar ekle
    const newAchievements = [...achievements];
    let newAchievementAdded = false;
    
    ACHIEVEMENTS.forEach(achievement => {
      if (confidenceScore >= achievement.threshold && !achievements.includes(achievement.id)) {
        newAchievements.push(achievement.id);
        setShowNewAchievement(achievement.id);
        newAchievementAdded = true;
        
        // Başarı ödül sesi çal
        playSound('reward');
        
        // 3 saniye sonra yeni başarı bildirimini kapat
        setTimeout(() => {
          setShowNewAchievement(null);
        }, 3000);
      }
    });
    
    if (newAchievementAdded) {
      setAchievements(newAchievements);
      localStorage.setItem(ACHIEVEMENT_STORAGE_KEY, JSON.stringify(newAchievements));
    }
  }, [confidenceScore]);

  // Özgüven seviyesine göre mesaj
  const getConfidenceMessage = () => {
    if (confidenceScore < 20) return "Yeni Başlangıç";
    if (confidenceScore < 40) return "Teknoloji Öğrencisi";
    if (confidenceScore < 60) return "Dijital Keşifçi";
    if (confidenceScore < 80) return "Teknoloji Gezgini";
    return "Dijital Usta";
  };

  // Özgüven seviyesine göre renk
  const getConfidenceColor = () => {
    if (confidenceScore < 20) return "bg-blue-400";
    if (confidenceScore < 40) return "bg-green-400";
    if (confidenceScore < 60) return "bg-yellow-400";
    if (confidenceScore < 80) return "bg-orange-400";
    return "bg-purple-500";
  };

  // Test için özgüven değerini artır (gerçek uygulamada kullanım istatistiklerine göre artar)
  const increaseConfidence = () => {
    setConfidenceScore(prev => Math.min(100, prev + 10));
    playSound('success');
  };

  // Son kazanılan rozeti göster
  const getLastAchievement = () => {
    if (achievements.length === 0) return null;
    
    const lastAchievementId = achievements[achievements.length - 1];
    return ACHIEVEMENTS.find(a => a.id === lastAchievementId);
  };

  // Başarı sayısı
  const achievementCount = achievements.length;
  const totalAchievements = ACHIEVEMENTS.length;

  return (
    <div className={`rounded-lg bg-white shadow-sm p-4 ${className}`}>
      {showTitle && (
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-sm">Teknoloji Özgüven Ölçeri</h3>
          <Badge variant="outline" className="text-xs">
            {getConfidenceMessage()}
          </Badge>
        </div>
      )}
      
      <div className="mb-2">
        <Progress 
          value={confidenceScore} 
          className={`h-3 ${size === 'sm' ? 'h-2' : size === 'lg' ? 'h-4' : 'h-3'}`} 
        />
      </div>
      
      <div className="flex justify-between text-xs text-slate-500">
        <span>Başlangıç</span>
        <div className="flex gap-1 items-center">
          <Trophy className="h-3 w-3 text-yellow-500" />
          <span>{achievementCount}/{totalAchievements} Başarı</span>
        </div>
        <span>Uzman</span>
      </div>
      
      {showControls && (
        <div className="mt-4">
          <Button size="sm" onClick={increaseConfidence} className="w-full">
            <Sparkles className="h-4 w-4 mr-2" />
            Özgüven Artır
          </Button>
        </div>
      )}
      
      {/* Son kazanılan rozeti göster */}
      {getLastAchievement() && (
        <div className="mt-3 border-t pt-2">
          <div className="flex items-center text-xs text-slate-700">
            <Award className="h-4 w-4 mr-1 text-yellow-500" />
            <span className="mr-1">Son Başarı:</span>
            <Badge variant="outline" className="text-xs font-normal">
              {getLastAchievement()?.icon} {getLastAchievement()?.name}
            </Badge>
          </div>
        </div>
      )}
      
      {/* Yeni başarı bildirimi */}
      {showNewAchievement && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm text-center animate-bounce">
            <div className="text-4xl mb-2">
              {ACHIEVEMENTS.find(a => a.id === showNewAchievement)?.icon || '🌟'}
            </div>
            <h3 className="text-xl font-bold mb-1">
              Yeni Başarı Kazandınız!
            </h3>
            <p className="text-lg font-medium mb-3">
              {ACHIEVEMENTS.find(a => a.id === showNewAchievement)?.name}
            </p>
            <p className="text-sm text-slate-600 mb-4">
              {ACHIEVEMENTS.find(a => a.id === showNewAchievement)?.description}
            </p>
            <Button onClick={() => setShowNewAchievement(null)}>
              <Check className="h-4 w-4 mr-2" />
              Harika!
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}