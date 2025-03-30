import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";

const waitlistSchema = z.object({
  fullName: z.string().min(2, { message: "Ad ve soyad en az 2 karakter olmalıdır" }),
  email: z.string().email({ message: "Geçerli bir e-posta adresi giriniz" }),
  phone: z.string().optional(),
  age: z.string().optional(),
  terms: z.literal(true, {
    errorMap: () => ({ message: "Devam etmek için kabul etmelisiniz" }),
  }),
});

type WaitlistFormValues = z.infer<typeof waitlistSchema>;

export default function WaitlistForm() {
  const { toast } = useToast();
  
  const form = useForm<WaitlistFormValues>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      age: "",
      terms: false,
    },
  });
  
  const waitlistMutation = useMutation({
    mutationFn: async (data: WaitlistFormValues) => {
      const response = await apiRequest("POST", "/api/waitlist", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Teşekkürler!",
        description: "Bekleme listesine kaydoldunuz. Uygulamamız hazır olduğunda size haber vereceğiz.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Bir hata oluştu",
        description: error.message || "Lütfen daha sonra tekrar deneyiniz.",
      });
    },
  });
  
  const onSubmit = (data: WaitlistFormValues) => {
    waitlistMutation.mutate(data);
  };
  
  return (
    <section id="waitlist" className="py-16 bg-[#F5F5F5]">
      <div className="container mx-auto px-4">
        <Card className="max-w-3xl mx-auto">
          <CardContent className="pt-6">
            <h2 className="text-3xl font-bold text-center mb-2">Bekleme Listesine Katılın</h2>
            <p className="text-lg text-center mb-8">
              Uygulamamız kullanıma hazır olduğunda size haber vereceğiz. 
              Aşağıdaki formu doldurarak bekleme listemize kaydolabilirsiniz.
            </p>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">Adınız Soyadınız</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Adınız ve soyadınızı yazınız" 
                          className="h-12 text-lg border-2 border-[#E0E0E0] rounded-lg" 
                        />
                      </FormControl>
                      <FormMessage className="text-base" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">E-posta Adresiniz</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="email" 
                          placeholder="ornek@mail.com" 
                          className="h-12 text-lg border-2 border-[#E0E0E0] rounded-lg" 
                        />
                      </FormControl>
                      <FormMessage className="text-base" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">Telefon Numaranız</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="05XX XXX XX XX" 
                          className="h-12 text-lg border-2 border-[#E0E0E0] rounded-lg" 
                        />
                      </FormControl>
                      <FormDescription className="text-base">
                        İsteğe bağlı
                      </FormDescription>
                      <FormMessage className="text-base" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">Yaşınız</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 text-lg border-2 border-[#E0E0E0] rounded-lg">
                            <SelectValue placeholder="Seçiniz" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="50-60">50-60</SelectItem>
                          <SelectItem value="61-70">61-70</SelectItem>
                          <SelectItem value="71-80">71-80</SelectItem>
                          <SelectItem value="81+">81 ve üzeri</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-base">
                        İsteğe bağlı
                      </FormDescription>
                      <FormMessage className="text-base" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                          className="h-6 w-6 mt-1 data-[state=checked]:bg-[#1565C0]" 
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-lg">
                          Kişisel verilerimin kaydedilmesini ve benimle iletişime geçilmesini kabul ediyorum.
                        </FormLabel>
                        <FormMessage className="text-base" />
                      </div>
                    </FormItem>
                  )}
                />
                
                <div className="text-center mt-8">
                  <Button 
                    type="submit" 
                    className="bg-[#1565C0] hover:bg-[#0D47A1] text-white text-xl py-4 px-8 h-auto w-full md:w-auto font-semibold rounded-lg"
                    disabled={waitlistMutation.isPending}
                  >
                    {waitlistMutation.isPending ? "Kaydediliyor..." : "Bekleme Listesine Kaydol"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
