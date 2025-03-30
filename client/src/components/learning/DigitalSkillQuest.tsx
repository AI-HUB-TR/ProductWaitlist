import { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Lock, Award, BookOpen, ExternalLink, ArrowRight, ChevronRight, Star } from 'lucide-react';
import { Link } from 'wouter';
import { useSound } from '@/hooks/use-sound-effects';

// Öğrenme modülü veri tipi
interface LearningModule {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'başlangıç' | 'orta' | 'ileri';
  duration: number; // dakika olarak
  steps: LearningStep[];
  completed: boolean;
  unlocked: boolean;
  icon: string;
}

// Öğrenme adımı veri tipi
interface LearningStep {
  id: string;
  title: string;
  content: string;
  type: 'video' | 'text' | 'quiz' | 'interactive';
  completed: boolean;
}

// Kullanıcı ilerleme veri tipi
interface UserProgress {
  completedModules: string[];
  completedSteps: string[];
  earnedPoints: number;
  level: number;
  confidenceScore: number; // 0-100 arası teknoloji özgüven puanı
}

// Beceri yolları
const SKILL_PATHS = [
  { id: 'temel', name: 'Temel Beceriler', icon: '💻', color: 'bg-blue-500' },
  { id: 'iletisim', name: 'İletişim Becerileri', icon: '💬', color: 'bg-green-500' },
  { id: 'guvenlik', name: 'Güvenlik Becerileri', icon: '🛡️', color: 'bg-red-500' },
  { id: 'eglence', name: 'Eğlence Becerileri', icon: '🎮', color: 'bg-purple-500' },
];

// Örnek modüller
const LEARNING_MODULES: LearningModule[] = [
  {
    id: 'farekullanimi',
    title: 'Fare Kullanımı',
    description: 'Bilgisayarınızda fare kullanımının temellerini öğrenin, tıklama ve sürükleme işlemlerini pratik yapın.',
    category: 'temel',
    level: 'başlangıç',
    duration: 10,
    icon: 'mouse',
    unlocked: true,
    completed: false,
    steps: [
      {
        id: 'fare-step1',
        title: 'Farenin Bölümleri',
        content: 'Fare, bilgisayarınızı kontrol etmenize yardımcı olan önemli bir araçtır. Sol tuş tıklama, sağ tuş özel menüler için kullanılır. Tekerlek ise sayfaları kaydırmaya yarar.',
        type: 'text',
        completed: false
      },
      {
        id: 'fare-step2',
        title: 'Tıklama Pratiği',
        content: 'Bu alıştırmada ekrandaki hedeflere tıklamayı deneyeceğiz. Gösterilen yerlere sırayla tıklayın.',
        type: 'interactive',
        completed: false
      },
      {
        id: 'fare-step3',
        title: 'Sürükleme Alıştırması',
        content: 'Nesneleri sürüklemek için fareye basılı tutup hareket ettirmeniz gerekir. Kutuları hedeflere sürükleyin.',
        type: 'interactive',
        completed: false
      }
    ]
  },
  {
    id: 'internetkullanimi',
    title: 'İnternet Kullanımı',
    description: 'Web tarayıcı nedir, nasıl kullanılır, adres çubuğu ve arama yapma yöntemlerini öğrenin.',
    category: 'temel',
    level: 'başlangıç',
    duration: 15,
    icon: 'globe',
    unlocked: true,
    completed: false,
    steps: [
      {
        id: 'internet-step1',
        title: 'Web Tarayıcı Nedir?',
        content: 'Web tarayıcı, internet sayfalarını görüntülemenizi sağlayan programdır. Chrome, Firefox, Edge gibi farklı tarayıcılar vardır.',
        type: 'video',
        completed: false
      },
      {
        id: 'internet-step2',
        title: 'Arama Motoru Kullanımı',
        content: 'Google gibi arama motorları, internette bilgi bulmanızı sağlar. Arama kutusuna merak ettiğiniz konuyu yazarak arama yapabilirsiniz.',
        type: 'text',
        completed: false
      },
      {
        id: 'internet-step3',
        title: 'Web Sitesinde Gezinme',
        content: 'Web sitelerinde bulunan bağlantılara (mavi renkli ve altı çizili metinler) tıklayarak farklı sayfalara gidebilirsiniz.',
        type: 'interactive',
        completed: false
      }
    ]
  },
  {
    id: 'guvenliinternet',
    title: 'Güvenli İnternet Kullanımı',
    description: 'İnternette güvenli kalmanın yollarını, şifre oluşturma ve dolandırıcılıktan korunma yöntemlerini öğrenin.',
    category: 'guvenlik',
    level: 'orta',
    duration: 20,
    icon: 'shield',
    unlocked: false,
    completed: false,
    steps: [
      {
        id: 'guvenli-step1',
        title: 'Güçlü Şifre Oluşturma',
        content: 'Güçlü şifreler en az 8 karakter uzunluğunda olmalı ve büyük/küçük harf, rakam ve özel karakterler içermelidir.',
        type: 'text',
        completed: false
      },
      {
        id: 'guvenli-step2',
        title: 'Dolandırıcılık Belirtileri',
        content: 'E-posta ve internet sitelerindeki dolandırıcılık belirtilerini tanımayı öğrenin. Şüpheli bağlantılara tıklamaktan kaçının.',
        type: 'video',
        completed: false
      },
      {
        id: 'guvenli-step3',
        title: 'Güvenlik Testi',
        content: 'Öğrendiklerinizi test edin. Hangi e-postalar güvenlidir, hangileri dolandırıcılık amaçlıdır?',
        type: 'quiz',
        completed: false
      }
    ]
  },
  {
    id: 'goruntuluchatlesme',
    title: 'Görüntülü Konuşma',
    description: 'Aileniz ve arkadaşlarınızla görüntülü konuşma yapmanın basit yollarını öğrenin.',
    category: 'iletisim',
    level: 'orta',
    duration: 15,
    icon: 'video',
    unlocked: false,
    completed: false,
    steps: [
      {
        id: 'video-step1',
        title: 'Görüntülü Konuşma Uygulamaları',
        content: 'WhatsApp, Zoom ve Google Meet gibi popüler görüntülü konuşma uygulamalarını tanıyın.',
        type: 'text',
        completed: false
      },
      {
        id: 'video-step2',
        title: 'Görüntülü Arama Başlatma',
        content: 'Adım adım görüntülü arama başlatmayı ve ayarları yapılandırmayı öğrenin.',
        type: 'video',
        completed: false
      },
      {
        id: 'video-step3',
        title: 'Pratik Yapalım',
        content: 'Öğrendiklerinizi pekiştirmek için basit bir görüntülü arama canlandırması yapın.',
        type: 'interactive',
        completed: false
      }
    ]
  },
  {
    id: 'sosyalmedya',
    title: 'Sosyal Medya Kullanımı',
    description: 'Sosyal medya platformlarını güvenli bir şekilde kullanmayı ve ailenizle bağlantıda kalmayı öğrenin.',
    category: 'iletisim',
    level: 'orta',
    duration: 25,
    icon: 'share2',
    unlocked: false,
    completed: false,
    steps: [
      {
        id: 'sosyal-step1',
        title: 'Sosyal Medya Nedir?',
        content: 'Facebook, Instagram ve Twitter gibi sosyal medya platformlarının temel özelliklerini tanıyın.',
        type: 'text',
        completed: false
      },
      {
        id: 'sosyal-step2',
        title: 'Profil Oluşturma',
        content: 'Güvenli bir sosyal medya profili oluşturmanın adımlarını öğrenin.',
        type: 'video',
        completed: false
      },
      {
        id: 'sosyal-step3',
        title: 'Gizlilik Ayarları',
        content: 'Sosyal medyada kişisel bilgilerinizi korumak için gizlilik ayarlarını nasıl düzenleyeceğinizi öğrenin.',
        type: 'text',
        completed: false
      }
    ]
  },
];

// Varsayılan kullanıcı ilerleme durumu 
const DEFAULT_USER_PROGRESS: UserProgress = {
  completedModules: [],
  completedSteps: [],
  earnedPoints: 0,
  level: 1,
  confidenceScore: 10
};

// Yerel depolama anahtarı
const PROGRESS_STORAGE_KEY = 'zekibot_learning_progress';

export default function DigitalSkillQuest() {
  // Kullanıcı ilerleme durumu
  const [userProgress, setUserProgress] = useState<UserProgress>(DEFAULT_USER_PROGRESS);
  
  // Aktif sekme ve modül
  const [activeTab, setActiveTab] = useState('temel');
  const [activeModule, setActiveModule] = useState<LearningModule | null>(null);
  const [activeStep, setActiveStep] = useState<LearningStep | null>(null);
  
  // Animasyon ve ödül efektleri
  const [showCelebration, setShowCelebration] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState('');
  
  // Ses efektleri
  const { playSound } = useSound();

  // Kullanıcı ilerleme durumunu yerel depolamadan yükle
  useEffect(() => {
    const savedProgress = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        setUserProgress(parsed);
      } catch (e) {
        console.error('İlerleme durumu yüklenemedi:', e);
      }
    }
  }, []);

  // Kullanıcı ilerleme durumunu kaydet
  useEffect(() => {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(userProgress));
  }, [userProgress]);

  // Modül tamamlandığında puanları güncelle ve rozet kazandır
  const completeModule = (moduleId: string) => {
    if (userProgress.completedModules.includes(moduleId)) return;
    
    // Puanları ve tamamlanan modülleri güncelle
    const updatedProgress = {
      ...userProgress,
      completedModules: [...userProgress.completedModules, moduleId],
      earnedPoints: userProgress.earnedPoints + 100,
      confidenceScore: Math.min(100, userProgress.confidenceScore + 10)
    };
    
    // Seviye artışını kontrol et
    const newLevel = Math.floor(updatedProgress.earnedPoints / 300) + 1;
    if (newLevel > userProgress.level) {
      updatedProgress.level = newLevel;
      // Yeni seviye kazanıldığında kutlama göster
      setShowCelebration(true);
      playSound('reward');
      
      // Belirli modüller için rozet kazandır
      if (moduleId === 'farekullanimi') {
        setEarnedBadge('Fare Ustası');
      } else if (moduleId === 'internetkullanimi') {
        setEarnedBadge('İnternet Kâşifi');
      }
      
      // 3 saniye sonra kutlamayı kapat
      setTimeout(() => {
        setShowCelebration(false);
        setEarnedBadge('');
      }, 3000);
    }
    
    setUserProgress(updatedProgress);
  };

  // Adım tamamlandığında güncelle
  const completeStep = (stepId: string) => {
    if (userProgress.completedSteps.includes(stepId)) return;
    
    // Tamamlanan adımları ve puanları güncelle
    const updatedProgress = {
      ...userProgress,
      completedSteps: [...userProgress.completedSteps, stepId],
      earnedPoints: userProgress.earnedPoints + 20,
      confidenceScore: Math.min(100, userProgress.confidenceScore + 2)
    };
    
    setUserProgress(updatedProgress);
    
    // Başarı sesi çal
    playSound('success');
    
    // Eğer modülün tüm adımları tamamlandıysa modülü tamamla
    if (activeModule) {
      const allStepsCompleted = activeModule.steps.every(
        step => updatedProgress.completedSteps.includes(step.id)
      );
      if (allStepsCompleted) {
        completeModule(activeModule.id);
      }
    }
  };

  // Modülleri filtrele
  const filteredModules = LEARNING_MODULES.filter(
    module => module.category === activeTab
  );

  // Modül kilidi açma kontrolü
  const isModuleUnlocked = (module: LearningModule) => {
    if (module.unlocked) return true;
    
    // Temel seviye modülleri her zaman açık
    if (module.level === 'başlangıç') return true;
    
    // Kullanıcı seviyesine göre modüllerin kilidini aç
    if (module.level === 'orta' && userProgress.level >= 2) return true;
    if (module.level === 'ileri' && userProgress.level >= 3) return true;
    
    return false;
  };

  // İlerleme yüzdesi
  const calculateProgressPercentage = () => {
    if (LEARNING_MODULES.length === 0) return 0;
    
    // Kilidi açılmış modülleri say
    const unlockedModules = LEARNING_MODULES.filter(
      module => isModuleUnlocked(module)
    );
    
    if (unlockedModules.length === 0) return 0;
    
    // Tamamlanan modüllerin yüzdesi
    return Math.round(
      (userProgress.completedModules.length / unlockedModules.length) * 100
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-center mb-2">Dijital Beceri Yolculuğu</h1>
        <p className="text-center text-slate-600 mb-4">
          Teknoloji dünyasında kendinize güvenle ilerleyin, adım adım yeni beceriler kazanın.
        </p>
        
        {/* Teknoloji Özgüven Ölçeri */}
        <div className="p-4 bg-white rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Teknoloji Özgüven Ölçeriniz</h2>
            <Badge variant="outline" className="bg-[#1565C0] text-white">
              Seviye {userProgress.level}
            </Badge>
          </div>
          
          <div className="mb-2">
            <Progress value={userProgress.confidenceScore} className="h-3" />
          </div>
          
          <div className="flex justify-between text-sm text-slate-500">
            <span>Başlangıç</span>
            <span>İlerliyor</span>
            <span>Uzman</span>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-slate-600">
              <Award className="inline-block h-4 w-4 mr-1 text-yellow-500" />
              {userProgress.earnedPoints} puan kazandınız
            </span>
            <span className="text-sm text-slate-600">
              <CheckCircle className="inline-block h-4 w-4 mr-1 text-green-500" />
              {userProgress.completedModules.length} modül tamamlandı
            </span>
          </div>
        </div>
      </div>
      
      {/* Beceri yolları sekmeleri */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="w-full flex mb-4">
          {SKILL_PATHS.map(path => (
            <TabsTrigger 
              key={path.id} 
              value={path.id}
              className="flex-1"
              onClick={() => playSound('click')}
            >
              <span className="mr-2">{path.icon}</span>
              {path.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {SKILL_PATHS.map(path => (
          <TabsContent key={path.id} value={path.id}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModules.map(module => {
                const isUnlocked = isModuleUnlocked(module);
                const isCompleted = userProgress.completedModules.includes(module.id);
                
                return (
                  <Card 
                    key={module.id} 
                    className={`
                      ${isUnlocked ? 'opacity-100 hover:shadow-lg' : 'opacity-70'} 
                      ${isCompleted ? 'border-green-300 bg-green-50' : ''}
                      transition-all duration-300
                    `}
                  >
                    <CardHeader className="relative pb-2">
                      {isCompleted && (
                        <Badge className="absolute right-4 top-4 bg-green-500 text-white">
                          <CheckCircle className="h-3 w-3 mr-1" /> Tamamlandı
                        </Badge>
                      )}
                      <CardTitle className="flex items-center text-xl">
                        <span 
                          className={`p-2 rounded-full mr-2 ${path.color} text-white`}
                          dangerouslySetInnerHTML={{ __html: module.icon }}
                        ></span>
                        {module.title}
                      </CardTitle>
                      <CardDescription>
                        <Badge variant="outline" className="mr-1">
                          {module.level}
                        </Badge>
                        <Badge variant="outline">
                          {module.duration} dakika
                        </Badge>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{module.description}</p>
                      <div className="mt-2">
                        <div className="flex items-center text-xs text-slate-500">
                          <Star className="h-3 w-3 mr-1 text-yellow-500" />
                          <span className="mr-2">100 puan değerinde</span>
                          <BookOpen className="h-3 w-3 mr-1" />
                          <span>{module.steps.length} adım</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      {isUnlocked ? (
                        <Button 
                          onClick={() => {
                            setActiveModule(module);
                            setActiveStep(module.steps[0]);
                            playSound('click');
                          }}
                          className="w-full bg-[#1565C0]"
                        >
                          {isCompleted ? "Tekrar Gözden Geçir" : "Öğrenmeye Başla"}
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      ) : (
                        <Button variant="outline" disabled className="w-full">
                          <Lock className="h-4 w-4 mr-1" />
                          Kilidi Açmak İçin İlerleyin
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      
      {/* Aktif modül içeriği */}
      {activeModule && activeStep && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{activeModule.title}</h2>
            <Button 
              variant="ghost" 
              onClick={() => {
                setActiveModule(null);
                setActiveStep(null);
                playSound('click');
              }}
            >
              Modüllere Dön
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Adım listesi */}
            <div className="md:col-span-1 border-r pr-4">
              <h3 className="font-semibold mb-3">Adımlar</h3>
              <ul className="space-y-2">
                {activeModule.steps.map((step, index) => {
                  const isCompleted = userProgress.completedSteps.includes(step.id);
                  const isActive = step.id === activeStep.id;
                  
                  return (
                    <li key={step.id}>
                      <Button 
                        variant={isActive ? "default" : "ghost"}
                        size="sm"
                        className={`
                          w-full justify-start text-left
                          ${isCompleted ? 'text-green-600' : ''}
                          ${isActive ? 'bg-[#1565C0]' : ''}
                        `}
                        onClick={() => {
                          setActiveStep(step);
                          playSound('click');
                        }}
                      >
                        <div className="flex items-center">
                          {isCompleted ? (
                            <CheckCircle className="h-4 w-4 mr-2" />
                          ) : (
                            <span className="w-4 h-4 rounded-full border flex items-center justify-center mr-2">
                              {index + 1}
                            </span>
                          )}
                          <span>{step.title}</span>
                        </div>
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </div>
            
            {/* Adım içeriği */}
            <div className="md:col-span-3">
              <h3 className="text-xl font-semibold mb-4">{activeStep.title}</h3>
              
              <div className="mb-6">
                <p className="text-lg leading-relaxed">{activeStep.content}</p>
              </div>
              
              {/* Adımın tipine göre içerik */}
              {activeStep.type === 'interactive' && (
                <div className="border p-4 rounded-lg bg-slate-50 mb-6">
                  <h4 className="font-semibold mb-2">Etkileşimli Alıştırma</h4>
                  <p>Bu alıştırmayı tamamlamak için aşağıdaki etkileşimli içerikle çalışın.</p>
                  
                  {/* Örnek bir etkileşimli alıştırma */}
                  <div className="mt-4 p-6 border rounded-lg bg-white text-center">
                    <p className="mb-4">Alıştırma: Aşağıdaki düğmeye tıklayın</p>
                    <Button 
                      variant="outline" 
                      className="animate-pulse"
                      onClick={() => {
                        completeStep(activeStep.id);
                        playSound('success');
                      }}
                    >
                      Buraya tıklayın
                    </Button>
                  </div>
                </div>
              )}
              
              {activeStep.type === 'quiz' && (
                <div className="border p-4 rounded-lg bg-slate-50 mb-6">
                  <h4 className="font-semibold mb-2">Bilgi Testi</h4>
                  <p>Bu testi tamamlamak için soruları yanıtlayın.</p>
                  
                  {/* Basit bir quiz örneği */}
                  <div className="mt-4 space-y-4">
                    <div className="p-4 border rounded-lg bg-white">
                      <p className="mb-3">Soru: İnternet güvenliği için aşağıdakilerden hangisi doğrudur?</p>
                      <div className="space-y-2">
                        <Button 
                          variant="outline" 
                          className="w-full justify-start"
                          onClick={() => {
                            playSound('error');
                          }}
                        >
                          A) Tüm şifrelerde aynı kelimeyi kullanmak güvenlidir
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start"
                          onClick={() => {
                            completeStep(activeStep.id);
                            playSound('success');
                          }}
                        >
                          B) Güçlü bir şifre hem harf hem rakam içermelidir
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start"
                          onClick={() => {
                            playSound('error');
                          }}
                        >
                          C) Kişisel bilgilerinizi internet sitelerinde paylaşmak her zaman güvenlidir
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeStep.type === 'video' && (
                <div className="border p-4 rounded-lg bg-slate-50 mb-6">
                  <h4 className="font-semibold mb-2">Video Eğitimi</h4>
                  <p>Bu eğitim videosunu izleyerek ilerleyin.</p>
                  
                  {/* Video içeriği yerine placeholder */}
                  <div className="mt-4 p-8 border rounded-lg bg-slate-200 text-center">
                    <p className="mb-4">Video oynatıcı burada gösterilecektir.</p>
                    <Button 
                      onClick={() => {
                        completeStep(activeStep.id);
                        playSound('success');
                      }}
                    >
                      İzledim, Devam Et
                    </Button>
                  </div>
                </div>
              )}
              
              {activeStep.type === 'text' && (
                <div className="flex justify-end mt-6">
                  <Button 
                    onClick={() => {
                      completeStep(activeStep.id);
                      playSound('success');
                    }}
                    className="bg-[#1565C0]"
                  >
                    Okudum, Anladım
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Kutlama animasyonu */}
      {showCelebration && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 text-center animate-bounce shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Tebrikler!</h2>
            <div className="text-6xl mb-4">🏆</div>
            <p className="mb-4">Seviye {userProgress.level}'e ulaştınız!</p>
            {earnedBadge && (
              <div className="mb-4">
                <Badge className="py-2 px-4 bg-yellow-500 text-white">
                  <Award className="h-4 w-4 mr-2" />
                  {earnedBadge} rozetini kazandınız!
                </Badge>
              </div>
            )}
            <Button 
              onClick={() => {
                setShowCelebration(false);
                playSound('click');
              }}
              className="bg-[#1565C0]"
            >
              Devam Et
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}