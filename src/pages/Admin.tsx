import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Eye, EyeOff, Edit } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const Admin = () => {
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const ADMIN_PASSWORD = "admin123"; // Em produção, usar autenticação adequada

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    const [postsData, subsData, messagesData] = await Promise.all([
      supabase.from("blog_posts").select("*").order("created_at", { ascending: false }),
      supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false }),
      supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
    ]);

    if (postsData.data) setBlogPosts(postsData.data);
    if (subsData.data) setSubscribers(subsData.data);
    if (messagesData.data) setMessages(messagesData.data);
  };

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast({ title: "Autenticado com sucesso!" });
    } else {
      toast({ title: "Senha incorreta", variant: "destructive" });
    }
  };

  const handleCreatePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const title = formData.get("title")?.toString() || "";
    const slug = title.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-");

    const { error } = await supabase.from("blog_posts").insert([{
      title,
      slug,
      excerpt: formData.get("excerpt")?.toString() || "",
      content: formData.get("content")?.toString() || "",
      cover_image: formData.get("cover_image")?.toString() || null,
      published: formData.get("published") === "on",
    }]);

    if (!error) {
      toast({ title: "Artigo criado!" });
      fetchData();
      e.currentTarget.reset();
    } else {
      toast({ title: "Erro ao criar artigo", variant: "destructive" });
    }
  };

  const handleUpdatePost = async (id: string, published: boolean) => {
    const { error } = await supabase
      .from("blog_posts")
      .update({ published })
      .eq("id", id);

    if (!error) {
      toast({ title: "Artigo atualizado!" });
      fetchData();
    }
  };

  const handleDeletePost = async (id: string) => {
    if (confirm("Tem certeza que deseja eliminar este artigo?")) {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (!error) {
        toast({ title: "Artigo eliminado!" });
        fetchData();
      }
    }
  };

  const handleMarkAsRead = async (id: string, read: boolean) => {
    const { error } = await supabase
      .from("contact_messages")
      .update({ read })
      .eq("id", id);

    if (!error) {
      fetchData();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/30">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Acesso à Gestão</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleLogin()}
            />
            <Button onClick={handleLogin} className="w-full mt-4">
              Entrar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-20">
        <h1 className="text-4xl font-bold mb-8">Painel de Gestão</h1>

        <Tabs defaultValue="blog">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
            <TabsTrigger value="messages">Mensagens</TabsTrigger>
          </TabsList>

          <TabsContent value="blog" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Criar Novo Artigo</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreatePost} className="space-y-4">
                  <Input name="title" placeholder="Título" required />
                  <Input name="excerpt" placeholder="Resumo" required />
                  <Input name="cover_image" placeholder="URL da Imagem de Capa" />
                  <Textarea name="content" placeholder="Conteúdo (HTML)" rows={10} required />
                  <div className="flex items-center gap-2">
                    <Switch name="published" id="published" />
                    <label htmlFor="published">Publicar imediatamente</label>
                  </div>
                  <Button type="submit">Criar Artigo</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Artigos ({blogPosts.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {blogPosts.map((post) => (
                    <div key={post.id} className="flex items-center justify-between p-4 border rounded">
                      <div className="flex-1">
                        <h3 className="font-semibold">{post.title}</h3>
                        <p className="text-sm text-muted-foreground">{post.slug}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdatePost(post.id, !post.published)}
                        >
                          {post.published ? <EyeOff size={16} /> : <Eye size={16} />}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="newsletter">
            <Card>
              <CardHeader>
                <CardTitle>Subscritores ({subscribers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {subscribers.map((sub) => (
                    <div key={sub.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{sub.name || "Sem nome"}</p>
                        <p className="text-sm text-muted-foreground">{sub.email}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${sub.subscribed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {sub.subscribed ? "Ativo" : "Inativo"}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Mensagens de Contacto ({messages.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`p-4 border rounded ${msg.read ? "bg-secondary/20" : "bg-accent/10"}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold">{msg.name}</p>
                          <p className="text-sm text-muted-foreground">{msg.email}</p>
                          {msg.phone && <p className="text-sm text-muted-foreground">{msg.phone}</p>}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkAsRead(msg.id, !msg.read)}
                        >
                          {msg.read ? "Marcar como não lida" : "Marcar como lida"}
                        </Button>
                      </div>
                      <p className="mt-2">{msg.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(msg.created_at).toLocaleString("pt-PT")}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
