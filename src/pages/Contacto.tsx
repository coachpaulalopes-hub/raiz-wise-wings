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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Validation schema
const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Email inválido")
    .max(255, "Email deve ter no máximo 255 caracteres"),
  phone: z
    .string()
    .max(20, "Telefone deve ter no máximo 20 caracteres")
    .regex(/^[\d\s\+\-\(\)]*$/, "Telefone contém caracteres inválidos")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .min(10, "Mensagem deve ter pelo menos 10 caracteres")
    .max(2000, "Mensagem deve ter no máximo 2000 caracteres"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const Contacto = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);

    try {
      const { error } = await supabase.from("contact_messages").insert([
        {
          name: data.name.trim(),
          email: data.email.trim().toLowerCase(),
          phone: data.phone?.trim() || null,
          message: data.message.trim(),
        },
      ]);

      if (error) throw error;

      toast({
        title: "Mensagem enviada!",
        description: "Entraremos em contacto em breve.",
      });

      reset();
    } catch (error: any) {
      console.error("Error submitting contact form:", error);
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao enviar a mensagem. Tente novamente.",
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
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Input
                    placeholder="Nome"
                    {...register("name")}
                    disabled={loading}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    {...register("email")}
                    disabled={loading}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <Input
                    type="tel"
                    placeholder="Telefone (opcional)"
                    {...register("phone")}
                    disabled={loading}
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
                  )}
                </div>
                <div>
                  <Textarea
                    placeholder="Mensagem"
                    rows={6}
                    {...register("message")}
                    disabled={loading}
                  />
                  {errors.message && (
                    <p className="text-sm text-destructive mt-1">{errors.message.message}</p>
                  )}
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
