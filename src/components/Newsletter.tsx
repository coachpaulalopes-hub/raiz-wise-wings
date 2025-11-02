import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert([{ email, name }]);

      if (error) throw error;

      toast({
        title: "Subscrição realizada!",
        description: "Obrigado por subscrever a nossa newsletter.",
      });
      setEmail("");
      setName("");
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message === 'duplicate key value violates unique constraint "newsletter_subscribers_email_key"'
          ? "Este email já está subscrito."
          : "Ocorreu um erro. Por favor, tente novamente.",
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="O seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-background"
            />
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="O seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background"
              />
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
