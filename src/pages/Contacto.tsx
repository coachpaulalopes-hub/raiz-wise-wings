import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Phone, MapPin } from "lucide-react";

const Contacto = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("contact_messages")
        .insert([formData]);

      if (error) throw error;

      toast({
        title: "Mensagem enviada!",
        description: "Entraremos em contacto em breve.",
      });
      
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar a mensagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 container mx-auto px-4">
        <h1 className="text-5xl font-bold mb-4 text-center">Contacto</h1>
        <p className="text-xl text-center text-muted-foreground mb-16">
          Entre em contacto connosco. Estamos aqui para ajudar.
        </p>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Envie-nos uma mensagem</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    placeholder="Nome"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Input
                    type="tel"
                    placeholder="Telefone (opcional)"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Mensagem"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={6}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "A enviar..." : "Enviar Mensagem"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informação de Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <p className="font-semibold">Localização</p>
                    <p className="text-muted-foreground">Vila Real, Portugal</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <a
                      href="mailto:coachpaulalopes@gmail.com"
                      className="text-muted-foreground hover:text-primary"
                    >
                      coachpaulalopes@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <p className="font-semibold">Telefone</p>
                    <a
                      href="tel:+351963392511"
                      className="text-muted-foreground hover:text-primary"
                    >
                      +351 963 392 511
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-3">Horário de Atendimento</h3>
                <p className="text-muted-foreground">
                  Segunda a Sexta: 9h00 - 19h00
                </p>
                <p className="text-muted-foreground">
                  Sábado: 9h00 - 13h00
                </p>
                <p className="text-muted-foreground mt-4 text-sm">
                  * Horários flexíveis mediante disponibilidade
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contacto;
