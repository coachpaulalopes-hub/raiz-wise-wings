import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import rootsConcept from "@/assets/roots-concept.jpg";

const Metodo = () => {
  const processoGuiado = [
    "Sessão inicial – pais + criança: definição do objetivo",
    "Blocos de evolução – 3 sessões com a criança + 1 sessão com os pais (x2)",
    "Sessão final – balanço e plano futuro familiar",
  ];

  const porqueFunciona = [
    {
      title: "Personalização Total",
      description: "Cada criança é acompanhada de forma única",
    },
    {
      title: "Base Neuroeducativa",
      description: "Integra técnicas de coaching, psicopedagogia e regulação emocional",
    },
    {
      title: "Sem Julgamentos",
      description: "Cada família é acolhida tal como é",
    },
    {
      title: "Aprendizagem Viva",
      description: "Foca-se no sentir, não só no saber",
    },
    {
      title: "Autorresponsabilidade Ativa",
      description: "Desenvolve o protagonismo infantil",
    },
    {
      title: "Crescimento Sustentável",
      description: "O progresso mantém-se após o processo",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-8 text-center">O Método Raízes®</h1>

          <div className="mb-12">
            <img
              src={rootsConcept}
              alt="Método Raízes"
              className="rounded-lg shadow-xl w-full max-w-2xl mx-auto"
            />
          </div>

          <p className="text-xl text-center text-muted-foreground mb-16">
            Duas formas de caminhar juntos
          </p>

          {/* Processo Guiado */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-3xl">Processo Guiado (Formal)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground mb-6">
                10 sessões de 1h, desenhadas para crianças dos 7 aos 12 anos. Envolve criança e
                família, com acompanhamento integral por um <strong>Coach Educativo Raízes®</strong>.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                O foco está em criar um plano de desenvolvimento emocional e comportamental que se
                mantenha após o processo.
              </p>
              <h4 className="text-xl font-semibold mb-4">Estrutura:</h4>
              <ul className="space-y-3">
                {processoGuiado.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Processo de Conexão */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-3xl">Processo de Conexão (Informal)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground mb-6">
                5 sessões dirigidas a pais, professores ou cuidadores de crianças a partir dos 2
                anos. Aqui, o foco é o adulto: fortalecer competências emocionais, comunicação
                empática e práticas educativas positivas.
              </p>
              <blockquote className="text-lg italic text-muted-foreground border-l-4 border-primary pl-4 my-6">
                "Os pais são o primeiro espelho das crianças. O coaching ajuda esse espelho a
                refletir segurança e amor."
              </blockquote>
            </CardContent>
          </Card>

          {/* Porque Funciona */}
          <section className="mb-12">
            <h2 className="text-4xl font-bold mb-8 text-center">Porque Funciona</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {porqueFunciona.map((item, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-start gap-2">
                      <span className="text-primary text-2xl font-bold">{index + 1}.</span>
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <div className="text-center">
            <Button size="lg" asChild>
              <Link to="/contacto">Começar Agora</Link>
            </Button>
          </div>
        </div>
      </section>

      <Newsletter />
      <Footer />
    </div>
  );
};

export default Metodo;
