import { useState } from 'react';
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Pencil, Trash2, Shield } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  lastLogin: string;
}

export default function UserManagement() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: 'Ahmet Yılmaz',
      email: 'ahmet@example.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2025-03-29'
    },
    {
      id: 2,
      name: 'Ayşe Kaya',
      email: 'ayse@example.com',
      role: 'user',
      status: 'active',
      lastLogin: '2025-03-28'
    },
    {
      id: 3,
      name: 'Mehmet Can',
      email: 'mehmet@example.com',
      role: 'user',
      status: 'inactive',
      lastLogin: '2025-03-15'
    }
  ]);

  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'user' as const,
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddUser = () => {
    // Normalde API'ye gönderilecek
    const user: User = {
      id: users.length + 1,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: 'active',
      lastLogin: 'Henüz giriş yapmadı'
    };

    setUsers([...users, user]);
    setNewUser({
      name: '',
      email: '',
      role: 'user',
      password: ''
    });

    toast({
      title: "Kullanıcı eklendi",
      description: `${user.name} başarıyla eklendi.`,
    });
  };

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId));
    
    toast({
      title: "Kullanıcı silindi",
      description: "Kullanıcı başarıyla silindi.",
    });
  };

  const handleToggleStatus = (userId: number) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        const newStatus = user.status === 'active' ? 'inactive' : 'active';
        
        toast({
          title: "Durum değiştirildi",
          description: `Kullanıcı durumu ${newStatus === 'active' ? 'aktif' : 'pasif'} olarak ayarlandı.`,
        });
        
        return {
          ...user,
          status: newStatus as 'active' | 'inactive'
        };
      }
      return user;
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Kullanıcı Yönetimi</CardTitle>
            <CardDescription>
              Sistemde kayıtlı tüm kullanıcıları görüntüleyin ve yönetin.
            </CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-[#1565C0] text-white hover:bg-[#0D47A1]">
                <PlusCircle className="mr-2 h-4 w-4" />
                Yeni Kullanıcı
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Yeni Kullanıcı Ekle</DialogTitle>
                <DialogDescription>
                  Sisteme yeni bir kullanıcı eklemek için bilgileri doldurun.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Ad Soyad
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={newUser.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    E-posta
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={newUser.email}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    Şifre
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={newUser.password}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    İptal
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button type="submit" onClick={handleAddUser}>
                    Kullanıcı Ekle
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>Toplam {users.length} kullanıcı</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Ad Soyad</TableHead>
                <TableHead>E-posta</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Son Giriş</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>
                      {user.role === 'admin' ? 'Yönetici' : 'Kullanıcı'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                      {user.status === 'active' ? 'Aktif' : 'Pasif'}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleToggleStatus(user.id)}
                      >
                        <Shield className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}