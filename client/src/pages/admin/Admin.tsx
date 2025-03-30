import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'wouter';
import { ArrowLeft, Users, Settings, Save, Image, PenTool } from 'lucide-react';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('site-settings');

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-[#1565C0]">ZekiBot Yönetim Paneli</h1>
        </div>
      </div>

      <Tabs
        defaultValue="site-settings"
        className="w-full"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid grid-cols-1 md:grid-cols-3 w-full md:w-[600px] mb-8">
          <TabsTrigger value="site-settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Site Ayarları</span>
          </TabsTrigger>
          <TabsTrigger value="user-management" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Kullanıcı Yönetimi</span>
          </TabsTrigger>
          <TabsTrigger value="customization" className="flex items-center gap-2">
            <PenTool className="h-4 w-4" />
            <span>Özelleştirme</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="site-settings">
          <Card>
            <CardHeader>
              <CardTitle>Site Ayarları</CardTitle>
              <CardDescription>
                Sitenin genel görünüm ve içeriğini buradan düzenleyebilirsiniz.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Site ayarları yakında eklenecek</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user-management">
          <Card>
            <CardHeader>
              <CardTitle>Kullanıcı Yönetimi</CardTitle>
              <CardDescription>
                Sisteme kayıtlı kullanıcıları buradan yönetebilirsiniz.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Kullanıcı yönetimi yakında eklenecek</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customization">
          <Card>
            <CardHeader>
              <CardTitle>Site Teması ve Görünümü</CardTitle>
              <CardDescription>
                Sitenin renklerini, yazı boyutlarını ve diğer görsel özelliklerini buradan özelleştirebilirsiniz.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Özelleştirme ayarları yakında eklenecek</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}