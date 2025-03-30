import { createContext, ReactNode, useContext } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { User } from "@shared/auth.schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

// Auth bağlamı tipi
type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: ReturnType<typeof useLoginMutation>;
  logoutMutation: ReturnType<typeof useLogoutMutation>;
  registerMutation: ReturnType<typeof useRegisterMutation>;
  socialLoginMutation: ReturnType<typeof useSocialLoginMutation>;
};

// Login form verisi
interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Register form verisi
interface RegisterData {
  name: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

// Sosyal login verisi
interface SocialLoginData {
  provider: 'google' | 'facebook' | 'twitter' | 'apple';
  providerId: string;
  email?: string;
  name?: string;
  profileData?: Record<string, any>;
}

// Login mutation hook
function useLoginMutation() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest("POST", "/api/auth/login", credentials);
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Giriş başarısız");
      }
      
      return await res.json();
    },
    onSuccess: (data) => {
      const { user } = data;
      queryClient.setQueryData(["/api/auth/user"], user);
      
      // Başarılı giriş bildirimi
      toast({
        title: "Giriş başarılı",
        description: "Hoş geldiniz! Ana sayfaya yönlendiriliyorsunuz.",
      });
      
      // Ana sayfaya yönlendir
      setTimeout(() => setLocation("/"), 500);
    },
    onError: (error: Error) => {
      toast({
        title: "Giriş başarısız",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Register mutation hook
function useRegisterMutation() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const res = await apiRequest("POST", "/api/auth/register", data);
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Kayıt başarısız");
      }
      
      return await res.json();
    },
    onSuccess: (data) => {
      const { user } = data;
      queryClient.setQueryData(["/api/auth/user"], user);
      
      // Başarılı kayıt bildirimi
      toast({
        title: "Kayıt başarılı",
        description: "Hoş geldiniz! Ana sayfaya yönlendiriliyorsunuz.",
      });
      
      // Ana sayfaya yönlendir
      setTimeout(() => setLocation("/"), 500);
    },
    onError: (error: Error) => {
      toast({
        title: "Kayıt başarısız",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Sosyal login mutation hook
function useSocialLoginMutation() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: SocialLoginData) => {
      const res = await apiRequest("POST", "/api/auth/social", data);
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Sosyal giriş başarısız");
      }
      
      return await res.json();
    },
    onSuccess: (data) => {
      const { user } = data;
      queryClient.setQueryData(["/api/auth/user"], user);
      
      // Başarılı giriş bildirimi
      toast({
        title: "Giriş başarılı",
        description: "Hoş geldiniz! Ana sayfaya yönlendiriliyorsunuz.",
      });
      
      // Ana sayfaya yönlendir
      setTimeout(() => setLocation("/"), 500);
    },
    onError: (error: Error) => {
      toast({
        title: "Sosyal giriş başarısız",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Logout mutation hook
function useLogoutMutation() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/auth/logout");
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Çıkış başarısız");
      }
    },
    onSuccess: () => {
      // Kullanıcı verisini cache'den temizle
      queryClient.setQueryData(["/api/auth/user"], null);
      
      // Başarılı çıkış bildirimi
      toast({
        title: "Çıkış başarılı",
        description: "Güvenli bir şekilde çıkış yaptınız.",
      });
      
      // Giriş sayfasına yönlendir
      setTimeout(() => setLocation("/auth"), 500);
    },
    onError: (error: Error) => {
      toast({
        title: "Çıkış başarısız",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Auth bağlamı oluşturma
export const AuthContext = createContext<AuthContextType | null>(null);

// Auth sağlayıcı bileşeni
export function AuthProvider({ children }: { children: ReactNode }) {
  // Kullanıcı bilgisini getir
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User | null, Error>({
    queryKey: ["/api/auth/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    retry: 1,
  });
  
  // Mutation hook'ları
  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const socialLoginMutation = useSocialLoginMutation();
  const logoutMutation = useLogoutMutation();
  
  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
        socialLoginMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Auth hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Korumalı route bileşeni
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  
  // Yükleniyor durumu
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Yükleniyor...</div>;
  }
  
  // Kullanıcı giriş yapmamışsa, auth sayfasına yönlendir
  if (!user) {
    setLocation("/auth");
    return null;
  }
  
  // Kullanıcı giriş yapmışsa, çocukları göster
  return <>{children}</>;
}