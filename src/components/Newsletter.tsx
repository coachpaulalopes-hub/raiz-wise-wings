import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Validation schema
const newsletterSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Email inválido")
    .max(255, "Email deve ter no máximo 255 caracteres"),
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

const Newsletter = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (data: NewsletterFormData) => {
    setLoading(true);

    try {
      const { error } = await supabase.from("newsletter_subscribers").insert([
        {
          email: data.email.trim().toLowerCase(),
          name: data.name.trim(),
        },
      ]);

      if (error) {
        if (
          error.message ===
          'duplicate key value violates unique constraint "newsletter_subscribers_email_key"'
        ) {
          toast({
            title: "Este email já está subscrito.",
            description: "Obrigado pelo seu interesse!",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: "Subscrição realizada!",
        description: "Obrigado por subscrever a nossa newsletter.",
      });
      reset();
    } catch (error: any) {
      console.error("Error subscribing to newsletter:", error);
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-r from-primary/10 to-accent/10">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Junte-se à Nossa Comunidade
          </h2>
          <p className="text-muted-foreground mb-8">
            Receba dicas e insights sobre coaching educativo e parentalidade consciente
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="O seu nome"
                {...register("name")}
                disabled={loading}
                className="bg-background"
              />
              {errors.name && (
                <p className="text-sm text-destructive mt-1 text-left">{errors.name.message}</p>
              )}
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="O seu email"
                  {...register("email")}
                  disabled={loading}
                  className="bg-background"
                />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1 text-left">{errors.email.message}</p>
                )}
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? "A subscrever..." : "Subscrever"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
