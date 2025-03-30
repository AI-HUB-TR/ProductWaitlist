import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import ChatDemo from "@/pages/ChatDemo";
import ModelDetail from "@/pages/model/ModelDetail";
import Admin from "@/pages/admin/Admin";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import SpeechAssistant from "@/components/floating/SpeechAssistant";
import MemoryGame from "@/pages/games/MemoryGame";
import CommunityPage from "@/pages/community/CommunityPage";
import SkillQuestPage from "@/pages/learning/SkillQuestPage";
import AIMascot from "@/components/mascot/AIMascot";
import HelpButton from "@/components/common/HelpButton";
import { SoundProvider } from "@/hooks/use-sound-effects";
import { AutoTranslateProvider } from "@/components/translation/LanguageSwitcher";

function Router() {
  const [loaded, setLoaded] = useState(false);

  // Erişilebilirlik özelliklerini ve tema ayarlarını uygulama yüklendiğinde ayarla
  useEffect(() => {
    // LocalStorage'dan tercihler yüklenir
    const preferences = localStorage.getItem('zekibot_user_preferences');
    
    if (preferences) {
      try {
        const parsedPrefs = JSON.parse(preferences);
        
        // Yazı boyutu ayarı
        if (parsedPrefs.fontSize) {
          document.documentElement.style.fontSize = `${parsedPrefs.fontSize * 100}%`;
        }
        
        // Kontrast ayarı
        if (parsedPrefs.highContrast) {
          document.documentElement.classList.add('high-contrast');
        }
        
        // Tema ayarı
        const colorScheme = parsedPrefs.colorScheme;
        const colorSchemeClass = colorScheme === 'dark' 
          ? 'dark' 
          : colorScheme === 'light' 
            ? 'light' 
            : window.matchMedia('(prefers-color-scheme: dark)').matches 
              ? 'dark' 
              : 'light';
        
        document.documentElement.classList.add(colorSchemeClass);
        
        // Animasyon azaltma
        if (parsedPrefs.reduceAnimations) {
          document.documentElement.classList.add('reduce-motion');
        }
        
        // Odak modu
        if (parsedPrefs.focusMode) {
          document.documentElement.classList.add('focus-mode');
        }
      } catch (e) {
        console.error('Tercihler yüklenemedi:', e);
      }
    }
    
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  return (
    <div className="flex flex-col min-h-screen bg-[#f7f5f0]">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/chat-demo" component={ChatDemo} />
          <Route path="/models/:id" component={ModelDetail} />
          <Route path="/admin" component={Admin} />
          <Route path="/games/memory" component={MemoryGame} />
          <Route path="/community" component={CommunityPage} />
          <Route path="/learning/skills" component={SkillQuestPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <SpeechAssistant />
      <AIMascot />
      <HelpButton variant="floating" />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SoundProvider>
        <AutoTranslateProvider>
          <Router />
          <Toaster />
        </AutoTranslateProvider>
      </SoundProvider>
    </QueryClientProvider>
  );
}

export default App;
