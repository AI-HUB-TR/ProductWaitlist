import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Ad ve soyad en az 2 karakter olmalıdır" }),
  email: z.string().email({ message: "Geçerli bir e-posta adresi giriniz" }),
  subject: z.string().min(1, { message: "Lütfen bir konu seçiniz" }),
  message: z.string().min(10, { message: "Mesajınız en az 10 karakter olmalıdır" }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactForm() {
  const { toast } = useToast();
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });
  
  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormValues) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Mesajınız gönderildi!",
        description: "En kısa sürede size dönüş yapacağız.",
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
  
  const onSubmit = (data: ContactFormValues) => {
    contactMutation.mutate(data);
  };
  
  return (
    <section id="iletisim" className="py-16 bg-[#F5F5F5]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center">İletişim</h2>
        <p className="text-xl text-center mb-8">
          Sorularınız veya geri bildirimleriniz için bizimle iletişime geçebilirsiniz.
        </p>
        
        <Card className="max-w-3xl mx-auto">
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
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
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">Konu</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 text-lg border-2 border-[#E0E0E0] rounded-lg">
                            <SelectValue placeholder="Seçiniz" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="question">Soru</SelectItem>
                          <SelectItem value="feedback">Geri Bildirim</SelectItem>
                          <SelectItem value="problem">Sorun Bildirme</SelectItem>
                          <SelectItem value="other">Diğer</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-base" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">Mesajınız</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Mesajınızı buraya yazınız" 
                          rows={5}
                          className="text-lg border-2 border-[#E0E0E0] rounded-lg" 
                        />
                      </FormControl>
                      <FormMessage className="text-base" />
                    </FormItem>
                  )}
                />
                
                <div className="text-center mt-8">
                  <Button 
                    type="submit" 
                    className="bg-[#1565C0] hover:bg-[#0D47A1] text-white text-xl py-4 px-8 h-auto w-full md:w-auto font-semibold rounded-lg"
                    disabled={contactMutation.isPending}
                  >
                    {contactMutation.isPending ? "Gönderiliyor..." : "Mesajı Gönder"}
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
