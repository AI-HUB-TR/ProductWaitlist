import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginSchema, registerSchema } from "@shared/auth.schema";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { FaGoogle, FaFacebook, FaTwitter, FaApple } from "react-icons/fa";

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { user, loginMutation, registerMutation, socialLoginMutation } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("login");
  
  // Kullanıcı giriş yapmış, ana sayfaya yönlendir
  if (user) {
    navigate("/");
    return null;
  }
  
  // Login formu
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });
  
  // Register formu
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });
  
  // Login form submit
  const onLoginSubmit = async (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };
  
  // Register form submit
  const onRegisterSubmit = async (data: RegisterFormValues) => {
    registerMutation.mutate(data);
  };
  
  // Sosyal giriş işlemleri
  const handleSocialLogin = (provider: 'google' | 'facebook' | 'twitter' | 'apple') => {
    // Gerçek uygulamada, OAuth sağlayıcısına yönlendirme yapılır
    // Bu örnekte simüle ediyoruz
    
    // Mock social login data
    const socialData = {
      provider,
      providerId: `${provider}_${Math.random().toString(36).substring(2, 15)}`,
      name: `Test User (${provider})`, // Gerçek uygulamada, sağlayıcıdan dönen isim kullanılır
      email: `test.${provider}@example.com`, // Gerçek uygulamada, sağlayıcıdan dönen e-posta kullanılır
    };
    
    socialLoginMutation.mutate(socialData);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 p-4">
      <div className="w-full max-w-6xl flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Sol Kısım: Giriş/Kayıt Formu */}
        <div className="w-full md:w-1/2 p-6 md:p-10">
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-blue-900 mb-2">ZekiBot</h1>
              <p className="text-gray-600 mb-4">Türkiye'nin yapay zeka asistanına hoş geldiniz</p>
              <TabsList className="w-full">
                <TabsTrigger value="login" className="w-1/2">Giriş</TabsTrigger>
                <TabsTrigger value="register" className="w-1/2">Kayıt</TabsTrigger>
              </TabsList>
            </div>
            
            {/* Giriş Formu */}
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Hesabınıza giriş yapın</CardTitle>
                  <CardDescription>E-posta ve şifrenizle giriş yapın veya sosyal medya hesaplarınızı kullanın.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">E-posta</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="ornek@email.com" 
                        {...loginForm.register("email")} 
                      />
                      {loginForm.formState.errors.email && (
                        <p className="text-sm text-red-500">{loginForm.formState.errors.email.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="password">Şifre</Label>
                        <a href="#" className="text-sm text-blue-600 hover:underline">Şifremi unuttum</a>
                      </div>
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder="••••••••" 
                        {...loginForm.register("password")} 
                      />
                      {loginForm.formState.errors.password && (
                        <p className="text-sm text-red-500">{loginForm.formState.errors.password.message}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="rememberMe" 
                        {...loginForm.register("rememberMe")} 
                      />
                      <Label htmlFor="rememberMe" className="text-sm cursor-pointer">Beni hatırla</Label>
                    </div>
                    
                    {loginMutation.isError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Hata</AlertTitle>
                        <AlertDescription>
                          {loginMutation.error?.message || "Giriş yapılırken bir hata oluştu."}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700" 
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "Giriş yapılıyor..." : "Giriş Yap"}
                    </Button>
                  </form>
                  
                  <div className="mt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">veya bu yöntemlerle giriş yapın</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => handleSocialLogin('google')}
                      >
                        <FaGoogle className="mr-2 h-4 w-4 text-red-500" />
                        Google
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => handleSocialLogin('facebook')}
                      >
                        <FaFacebook className="mr-2 h-4 w-4 text-blue-600" />
                        Facebook
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => handleSocialLogin('apple')}
                      >
                        <FaApple className="mr-2 h-4 w-4" />
                        Apple
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => handleSocialLogin('twitter')}
                      >
                        <FaTwitter className="mr-2 h-4 w-4 text-blue-400" />
                        Twitter
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <p className="text-sm text-gray-600">
                    Hesabınız yok mu?{" "}
                    <button
                      type="button"
                      onClick={() => setActiveTab("register")}
                      className="text-blue-600 hover:underline"
                    >
                      Hemen kayıt olun
                    </button>
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Kayıt Formu */}
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Yeni hesap oluşturun</CardTitle>
                  <CardDescription>ZekiBot'u kullanmak için yeni bir hesap oluşturun.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Adınız Soyadınız</Label>
                      <Input 
                        id="name" 
                        type="text" 
                        placeholder="Adınız Soyadınız" 
                        {...registerForm.register("name")} 
                      />
                      {registerForm.formState.errors.name && (
                        <p className="text-sm text-red-500">{registerForm.formState.errors.name.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">E-posta</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="ornek@email.com" 
                        {...registerForm.register("email")} 
                      />
                      {registerForm.formState.errors.email && (
                        <p className="text-sm text-red-500">{registerForm.formState.errors.email.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="username">Kullanıcı Adı</Label>
                      <Input 
                        id="username" 
                        type="text" 
                        placeholder="kullanici_adi" 
                        {...registerForm.register("username")} 
                      />
                      {registerForm.formState.errors.username && (
                        <p className="text-sm text-red-500">{registerForm.formState.errors.username.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Şifre</Label>
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder="••••••••" 
                        {...registerForm.register("password")} 
                      />
                      {registerForm.formState.errors.password && (
                        <p className="text-sm text-red-500">{registerForm.formState.errors.password.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
                      <Input 
                        id="confirmPassword" 
                        type="password" 
                        placeholder="••••••••" 
                        {...registerForm.register("confirmPassword")} 
                      />
                      {registerForm.formState.errors.confirmPassword && (
                        <p className="text-sm text-red-500">{registerForm.formState.errors.confirmPassword.message}</p>
                      )}
                    </div>
                    
                    {registerMutation.isError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Hata</AlertTitle>
                        <AlertDescription>
                          {registerMutation.error?.message || "Kayıt olurken bir hata oluştu."}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700" 
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? "Kayıt yapılıyor..." : "Kayıt Ol"}
                    </Button>
                    
                    <p className="text-xs text-gray-500 text-center">
                      Kayıt olarak <a href="#" className="text-blue-600 hover:underline">kullanım koşullarımızı</a> ve <a href="#" className="text-blue-600 hover:underline">gizlilik politikamızı</a> kabul etmiş olursunuz.
                    </p>
                  </form>
                  
                  <div className="mt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">veya bu yöntemlerle kayıt olun</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => handleSocialLogin('google')}
                      >
                        <FaGoogle className="mr-2 h-4 w-4 text-red-500" />
                        Google
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => handleSocialLogin('facebook')}
                      >
                        <FaFacebook className="mr-2 h-4 w-4 text-blue-600" />
                        Facebook
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => handleSocialLogin('apple')}
                      >
                        <FaApple className="mr-2 h-4 w-4" />
                        Apple
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => handleSocialLogin('twitter')}
                      >
                        <FaTwitter className="mr-2 h-4 w-4 text-blue-400" />
                        Twitter
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <p className="text-sm text-gray-600">
                    Zaten hesabınız var mı?{" "}
                    <button
                      type="button"
                      onClick={() => setActiveTab("login")}
                      className="text-blue-600 hover:underline"
                    >
                      Giriş yapın
                    </button>
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Sağ Kısım: Tanıtım Alanı */}
        <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-blue-500 to-blue-700 p-10 text-white">
          <div className="h-full flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-4">Yapay Zeka ile Tanışın</h2>
              <p className="text-lg mb-6">ZekiBot ile teknoloji dünyasını keşfedin, sorular sorun, yeni şeyler öğrenin.</p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg">Kolay Kullanım</h3>
                    <p className="text-blue-100">Teknoloji bilginiz ne olursa olsun, herkesin anlayabileceği basit bir arayüz</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg">Türkçe Destek</h3>
                    <p className="text-blue-100">Tamamen Türkçe yapay zeka modellerimizle ana dilimizde iletişim kurun</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg">Çok Yönlü</h3>
                    <p className="text-blue-100">Metin yanıtları, görsel oluşturma, sesli asistan ve daha fazlası</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-blue-400 pt-6">
              <blockquote className="italic text-blue-100">
                "ZekiBot sayesinde teknoloji dünyasına adım atmak çok daha kolay oldu. Artık internette istediğim her şeyi yapabiliyorum."
              </blockquote>
              <div className="mt-4 flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-300"></div>
                <div className="ml-3">
                  <p className="font-medium">Ayşe Yılmaz</p>
                  <p className="text-sm text-blue-200">ZekiBot Kullanıcısı</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}