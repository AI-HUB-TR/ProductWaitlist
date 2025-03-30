import { useCallback, useRef, useEffect, createContext, useState, useContext } from 'react';
import { Howl } from 'howler';

// Ses dosyalarını içeren obje - burada base64 olarak kaydedilmiş küçük ses dosyaları kullanıyoruz
// Bu sayede harici ses dosyalarına ihtiyaç duymuyoruz
const SOUND_EFFECTS = {
  success: 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAAFNgCenp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6e//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAZFAAAAAAAABTaym5WBAAAAAAD/+xDEAAAHdAF59BAAJdNILn81gAKAAAAsBQAzDygMQ5TgMLw4DAvAYDAMahoKooozEXFYKImKoRjMJQnCgLxGEoeDwPcUBOIwtF/4oCcXhQHAYig8H4uEoqigOB7/xWL//xeIxiFImCoVh6Lg9//EAaCwVhsRA6AAAAABISMZjPMQZFVQACQcFj2IwAAAAP/7EsQFAAul8W/nrHgDSLZvPPYPAAARgcmYLq0rX5sZLIMKn5XL+LI43R4ul0jFLkOkZzcylMvl2c5mZ/NF1msxjw/nO7/d3/+//+pAQEBAQEBAQEBAQEBt3Ziou9uxdjTF0JAQEBAOHT58+/8+YZs9QEBAQGz5vY/P36j9XrmPZAQEBAQEBAQWouUXdLu6Wf/7EsQEA8gVsXnnpHgC9TYvvPSPAFi7FmHgJiAgJ6Bfyi7pZ3Szui5RcouUXKLlFyC3QEBATl6AgICAsUVyilQUVBMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EsQHg8f9sYHnpHgC3zYwPPSPAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=',
  click: 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAADwACFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWF//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAMAAAAAAAAAA8CEhYmWAAAAAAD/+xDEAAAFRAF39AAAIdNILr80gAKAAAAsBUBNE4bmokJjQZA+cDgQA4FAYDAGAUAwEgGJBiFgyAQQA+EgGAUBABoFBkJAdQWBQJBADkYBwHAc+5CAHAgDEAuCkAYYDgYAgOA4/5GIgfDgPf/CAMQgIB7+MBwHoAAAAADBzDKrAISO1mGYBB5RbNwdBnuDU3kAAAAA//sSxAWAB1WhdfemkADxNC788w8AWouDuUcotGrBwvfKLlV3dEXYpzZbGMYzqQGkdS7L5C7tWdatrVtROtW1q2ta1bVcPv/63/77xslUy5tS7p5Ooj85Jb3d6spmFEREWYufQEBqCCgIKBAQEBAQEH4oCAgICAgICAsUBAQEBARzEJq6AgoCAhhQUWKCgICAnM//sQxAQCR/WheeekYAJQrUivPLKAQgmHFigICAgICGAglXLGiHMQEFAQEBATEFNRTMuOTkuNaqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//sSxBoABlmlWeeSQADGqsuPPSAAqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq',
  error: 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAADwACQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQ//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAUAAAAAAAAAA8CQmZaHAAAAAAD/+xDEAAAAAGkAAAAATKAJL4wjAIAFADAMDgfD5OLxeIw+MQzDEWjEiESiNMCpUK5YKpcJgyGgYCCOiCIhH0PA+FAYBgEAQDgLAsAwEAQ9D3/EAQhAEAQCAIB7/ggCQIeMCgIAgCAIB8EfH//+GAeCAIAgEAQDgMQAQDyASiYIA8BwAWW1T9B1EmhqxN4KiwsNGHARB4//sQxAWACLl3M0HsAAEQria4NYAADRw6AwfXJyB4QFRAOEAgMYFm/5EHRlKI4FWP0TBJQy06bq0OcQbLIdIXxUwQVQz4MZcJy5wYGhgYHS4EHfLu8+/5d3v/3e79M8QEBAQEBAQEBAQEBAQ7O7u+2ZPkOH3ZiAgICAgfPnr169evWPnzAgICAjtO/8+evXr169//sQxAQDx82hdeekYAI4rQrfLSPAevXrIrN/ICAgICAgICBQXKCgoKCgoLlBQUFCguQEBAQE5fQEBAQEFBcoKCgoU1BQUFCmAmlQXKCgoKChTAqoKFBQUFBQXICAgJqCmopqKaimoKaimopqKaimoKaj/7EsQHg8ctsXnnnGgCSK0KzzzzgApqKaimoKaimoKaimopqKaimoKaimopqKaimopqKaimopqCYgpqCmopqCmopqCmopiCmopiCmopiCmopiCmopiCmopiCmpVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EsQPg8alsXfnpHACQK0K3z0jABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=',
  reward: 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAATAAAKUgAYGBgYJCQkJCQwMDAwPDw8PExMTExYWFhYZGRkZGxsbGx4eHh4hISEhJCQkJCcnJycp6enp7S0tLS/v7+/zMzMzNjY2Njk5OTk8PDw8P////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAcCAAAAAAAAClKx6KD8AAAAAAD/+xDEAAAFPAGJ1AAAJyhILnc0gBFGAAAAgBUAAANAOA4Dg+/B8PhB8H4PAYCA+D4oK5QVihCEMQgvBAMBB+Iw+DxQEAQfjAMAgCHggCcXj/hYOA9w+JBiEIQhCEPigOA5wQBAIAgHwfmAYB8BAIAgEA+CxIE4MAgCAeCgPggCcHwQBAMYhCH4QBAIf+H/g+EPiQfhCEIYBcP/g98HweB4HggIf4PB4Ic//sSxAWAHAmdZ/mEACI5Mi8/NJACoqLGIhqJFNFbLkTI1J3YlL7O+nDO/I9sZCxLqRSfg3CyE0c1Jn3/dSlIyWGiIajK2XzILZ5E3MiY30yEgyKGrm1fmxj4e02X8FdmYkO3EYDwj6Ym0iYhKs2EQx34dJvJeRCXUMJHBYzckY1yKZqRr3UbOcsjSlfJ3Y9O1+dMlIllQQiNRpdX//sSxAWCFvmTXljGAGK7Miu7GMgCrBYNQVF2tFWnayUiXu5kDvMPMklbqQQWGZJOVCbMpEImSqEgixvqfbRt3Jnvq3Znvq2WgWC4qKjo3//G5GqmBYXFRUVmqoqOjq5Y1IossbqM+0jG+2XRJSExCUxJSJRCsXDQSkJCsXDQSkJCsXDQSkQrFw0EpEKxcNBKQkKxcNBKQkKxcP/7EsQLA8YZkVniCfGIri4qvDDSAt9oJCQrFw0EpCQrFw0EpCQaFfEaFfEaFfEaFfEaFfEaFfEaFfEaFfEaFfEaFfEaFfEaFfEaFfEaFfEaFfEaFekGgVTrBDUCqddUCqddUCqddUCqdaBVXaRVXCGcaXP/cAZxpc/9wBnGlz/3AYAZwGcBnAZwGAGcBg//sQxBcDxZlxUeGekoitLek8M9JR6wGcBnAYAYQGcBgBhAKIFSUX///wFFSf//4CipP//8BRUn///AUVJ///8BRUn///AUVJ///8BRUn///wFFSUVJRUkvKSkVJf5FQ0oqSipKKkoqSipKKkoqSipKKkgqSSg9IDw9ITw9IDw9ITw9IP/7EsQbA8UZcUnh7JqIvy4ovDFTU9ITw9ITw9ITw9ITw9ITw9ITw9IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sSxCAPxU1vR+GeljCzLii8MVKQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
  notification: 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAADwAC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAQAAAAAAAAAA8C0uL3PAAAAAAD/+xDEAAAGKAFx9BAAJc9ILn80gAKAAAAsBUBQ+DwKIYRB+D4fh+EAQB+CAofggCCvEAQB/0AgH4PA/BAEFf/y4Ph///5cHwQBAMQhCEIQhCEIQhCEIQ+4IA///6wfB/yAQYxuBAP//CEA/v////4YBcMBXDHX/////4YC4V8EIQhCEIQhCEIQhCEJoeBDFxDFwfNRDFwfB8HwfB8EAQZQoIAgCOkgQBHSQIAjpIEAR0kCAI6SBAF//sSxAWAGD2zc+eYUAMKti989I8A6SBAEdJAgCOkgQBHSQIAjpIEAR0kCAI6SBAEdJAgCOkgQBHSQIAjpIEAR0kCAI6SBAEdJAgCOkgQBHSQIAjpIEAR0kCAI6SBAEdJAgCOkgQBHSQIAjpIEAR0kCAGwQA2F2wwI0EsOCNBLDgjQSwEpkgBQJYCUyQAoEsBKZIAUCWAlMkAKBLASmSAFAlgJTJACgSwEpkgBQP/7EsQFg8bJrXXnmGACZimu/PMMALSWAIAJ4AIAJYAIAJYAIAJCWACACQwAQASEsAEAEhLABABISwAQASEsAEAEhLABABISwAQASEsAEAEhLABABISwAQASEsAEAEhLABABISwAQASE1FRTVVNRTUVNRTUVNRTUVNRTUVNRTUVNRTUVNRTUVNRTUVNRTUVNRTUVNRTUVP/7EsQEg8XZrWnnnGgCVq2tPPONAFRTUVNRTUVNRTUVNRTUVNRTUVNRTUVNRTUVNRTUVNRTUVNRU1FTUVNRU1FTUVNRU1FTUVNRU1FTUVNRU1FTUVNRU1FTUVNRU1FTUVNRU1FRERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERP/7EsQHg8T5+V3njHACUC2srzyygBEREREREREREREREREREREREREREREREREVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU='
};

export interface SoundOptions {
  volume?: number;
  loop?: boolean;
}

export type SoundEffect = 'success' | 'click' | 'error' | 'reward' | 'notification';

// Ses ayarları için yerel depolama anahtarı
const SOUND_SETTINGS_KEY = 'zekibot_sound_settings';

export function useSoundEffects() {
  // Ses etkinleştirilmiş mi?
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const savedSettings = localStorage.getItem(SOUND_SETTINGS_KEY);
    if (savedSettings) {
      try {
        return JSON.parse(savedSettings).enabled;
      } catch (e) {
        console.error('Ses ayarları yüklenemedi:', e);
      }
    }
    return true; // Varsayılan olarak ses açık
  });

  // Ses seviyesi (0-1 arası)
  const [volume, setVolume] = useState<number>(() => {
    const savedSettings = localStorage.getItem(SOUND_SETTINGS_KEY);
    if (savedSettings) {
      try {
        return JSON.parse(savedSettings).volume;
      } catch (e) {
        console.error('Ses ayarları yüklenemedi:', e);
      }
    }
    return 0.5; // Varsayılan ses seviyesi
  });

  // Ses objelerini saklamak için ref kullanımı
  const soundsRef = useRef<Record<string, Howl>>({});

  // İlk yüklemede ses objelerini oluştur
  useEffect(() => {
    // Tüm ses dosyaları için Howl objeleri oluştur
    Object.entries(SOUND_EFFECTS).forEach(([key, src]) => {
      soundsRef.current[key] = new Howl({
        src: [src],
        volume: volume,
        preload: true,
        html5: true
      });
    });

    // Temizlik fonksiyonu
    return () => {
      // Tüm sesleri durdur ve bellekten temizle
      Object.values(soundsRef.current).forEach(sound => {
        sound.stop();
        sound.unload();
      });
      soundsRef.current = {};
    };
  }, []);

  // Ses seviyesi değiştiğinde güncelle
  useEffect(() => {
    Object.values(soundsRef.current).forEach(sound => {
      sound.volume(volume);
    });
    
    // Ses ayarlarını yerel depolamaya kaydet
    localStorage.setItem(SOUND_SETTINGS_KEY, JSON.stringify({
      enabled: soundEnabled,
      volume: volume
    }));
  }, [volume, soundEnabled]);

  // Ses çalma fonksiyonu
  const playSound = useCallback((sound: SoundEffect, options: SoundOptions = {}) => {
    if (!soundEnabled) return null;
    
    const soundObj = soundsRef.current[sound];
    if (soundObj) {
      const id = soundObj.play();
      if (options.volume !== undefined) {
        soundObj.volume(options.volume, id);
      }
      if (options.loop) {
        soundObj.loop(true, id);
      }
      return id;
    }
    return null;
  }, [soundEnabled]);

  // Sesi durdurma fonksiyonu
  const stopSound = useCallback((sound: SoundEffect, id?: number) => {
    const soundObj = soundsRef.current[sound];
    if (soundObj) {
      if (id !== undefined) {
        soundObj.stop(id);
      } else {
        soundObj.stop();
      }
    }
  }, []);

  // Ses ayarlarını değiştirme fonksiyonları
  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);

  const setVolumeLevel = useCallback((level: number) => {
    // 0-1 aralığında olduğundan emin ol
    const normalizedLevel = Math.max(0, Math.min(1, level));
    setVolume(normalizedLevel);
  }, []);

  return {
    playSound,
    stopSound,
    soundEnabled,
    toggleSound,
    volume,
    setVolume: setVolumeLevel
  };
}

// Ses içeriği için tip tanımları
interface SoundContextType {
  playSound: (sound: SoundEffect, options?: SoundOptions) => number | null;
  stopSound: (sound: SoundEffect, id?: number) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  volume: number;
  setVolume: (level: number) => void;
}

// Context oluştur
export const SoundContext = createContext<SoundContextType | null>(null);

// Context sağlayıcısı
export function SoundProvider({ children }: { children: any }) {
  const soundUtils = useSoundEffects();
  
  return (
    <SoundContext.Provider value={soundUtils}>
      {children}
    </SoundContext.Provider>
  );
}

// Ses hook'u
export function useSound() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
}