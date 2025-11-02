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
import { Trash2, Eye, EyeOff, Edit, LogOut } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Validation schemas
const blogPostSchema = z.object({
  title: z.string().min(1, "Título é obrigatório").max(200, "Título deve ter no máximo 200 caracteres"),
  excerpt: z.string().min(1, "Resumo é obrigatório").max(500, "Resumo deve ter no máximo 500 caracteres"),
  cover_image: z.string().url("URL inválida").optional().or(z.literal("")),
  content: z.string().min(1, "Conteúdo é obrigatório").max(50000, "Conteúdo deve ter no máximo 50000 caracteres"),
  published: z.boolean().default(false),
});

type BlogPostFormData = z.infer<typeof blogPostSchema>;

const Admin = () => {
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
  });

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        setIsAuthenticated(true);
        fetchData();
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setUser(session.user);
      setIsAuthenticated(true);
      fetchData();
    }
  };

  const fetchData = async () => {
    if (!isAuthenticated) return;

    try {
      const [postsData, subsData, messagesData] = await Promise.all([
        supabase.from("blog_posts").select("*").order("created_at", { ascending: false }),
        supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false }),
        supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
      ]);

      if (postsData.error) {
        console.error("Error fetching posts:", postsData.error);
        toast({
          title: "Erro ao carregar artigos",
          description: postsData.error.message,
          variant: "destructive",
        });
      } else {
        setBlogPosts(postsData.data || []);
      }

      if (subsData.error) {
        console.error("Error fetching subscribers:", subsData.error);
      } else {
        setSubscribers(subsData.data || []);
      }

      if (messagesData.error) {
        console.error("Error fetching messages:", messagesData.error);
      } else {
        setMessages(messagesData.data || []);
      }
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados.",
        variant: "destructive",
      });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Check if user has admin role
        const { data: roleData, error: roleError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id)
          .eq("role", "admin")
          .single();

        if (roleError || !roleData) {
          // Sign out if not admin
          await supabase.auth.signOut();
          toast({
            title: "Acesso negado",
            description: "Apenas administradores podem acessar este painel.",
            variant: "destructive",
          });
          return;
        }

        setUser(data.user);
        setIsAuthenticated(true);
        toast({ title: "Autenticado com sucesso!" });
        fetchData();
      }
    } catch (error: any) {
      toast({
        title: "Erro de autenticação",
        description: error.message || "Credenciais inválidas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUser(null);
    toast({ title: "Sessão encerrada" });
  };

  const onSubmitPost = async (data: BlogPostFormData) => {
    try {
      const slug = data.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-");

      const { error } = await supabase.from("blog_posts").insert([
        {
          title: data.title,
          slug,
          excerpt: data.excerpt,
          content: data.content,
          cover_image: data.cover_image || null,
          published: data.published,
        },
      ]);

      if (error) throw error;

      toast({ title: "Artigo criado!" });
      fetchData();
      reset();
    } catch (error: any) {
      toast({
        title: "Erro ao criar artigo",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdatePost = async (id: string, published: boolean) => {
    try {
      const { error } = await supabase
        .from("blog_posts")
        .update({ published })
        .eq("id", id);

      if (error) throw error;

      toast({ title: "Artigo atualizado!" });
      fetchData();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar artigo",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm("Tem certeza que deseja eliminar este artigo?")) return;

    try {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      
      if (error) throw error;

      toast({ title: "Artigo eliminado!" });
      fetchData();
    } catch (error: any) {
      toast({
        title: "Erro ao eliminar artigo",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleMarkAsRead = async (id: string, read: boolean) => {
    try {
      const { error } = await supabase
        .from("contact_messages")
        .update({ read })
        .eq("id", id);

      if (error) throw error;

      fetchData();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar mensagem",
        description: error.message,
        variant: "destructive",
      });
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
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff size={18} className="text-muted-foreground" />
                  ) : (
                    <Eye size={18} className="text-muted-foreground" />
                  )}
                </button>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "A autenticar..." : "Entrar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Painel de Gestão</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2" size={16} />
              Sair
            </Button>
          </div>
        </div>

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
                <form onSubmit={handleSubmit(onSubmitPost)} className="space-y-4">
                  <div>
                    <Input
                      placeholder="Título"
                      {...register("title")}
                    />
                    {errors.title && (
                      <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
                    )}
                  </div>
                  <div>
                    <Input
                      placeholder="Resumo"
                      {...register("excerpt")}
                    />
                    {errors.excerpt && (
                      <p className="text-sm text-destructive mt-1">{errors.excerpt.message}</p>
                    )}
                  </div>
                  <div>
                    <Input
                      placeholder="URL da Imagem de Capa"
                      {...register("cover_image")}
                    />
                    {errors.cover_image && (
                      <p className="text-sm text-destructive mt-1">{errors.cover_image.message}</p>
                    )}
                  </div>
                  <div>
                    <Textarea
                      placeholder="Conteúdo (HTML)"
                      rows={10}
                      {...register("content")}
                    />
                    {errors.content && (
                      <p className="text-sm text-destructive mt-1">{errors.content.message}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch {...register("published")} />
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
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          sub.subscribed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
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
                    <div
                      key={msg.id}
                      className={`p-4 border rounded ${msg.read ? "bg-secondary/20" : "bg-accent/10"}`}
                    >
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
