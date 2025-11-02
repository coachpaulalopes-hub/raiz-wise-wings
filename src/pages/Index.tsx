import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import heroImage from "@/assets/hero-image.jpg";
import rootsConcept from "@/assets/roots-concept.jpg";
import childGrowth from "@/assets/child-growth.jpg";
import parentTeacher from "@/assets/parent-teacher.jpg";
import { Sprout, Heart, Target, BookOpen, Users, Sparkles } from "lucide-react";

const Index = () => {
  const pillars = [
    {
      icon: <Sprout className="w-12 h-12 text-primary" />,
      title: "Autonomia",
      description: "A criança descobre o seu poder de escolha",
    },
    {
      icon: <Heart className="w-12 h-12 text-primary" />,
      title: "Vínculo",
      description: "A relação é o terreno fértil onde cresce a confiança",
    },
    {
      icon: <Target className="w-12 h-12 text-primary" />,
      title: "Propósito",
      description: "Tudo ganha sentido quando há um 'porquê'",
    },
  ];

  const benefits = [
    {
      icon: <Sparkles className="w-8 h-8 text-primary" />,
      title: "Para as crianças",
      items: [
        "Maior autoconfiança e autonomia",
        "Melhoria nas relações",
        "Capacidade para lidar com frustrações",
        "Mais foco e equilíbrio emocional",
      ],
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Para pais e professores",
      items: [
        "Novas ferramentas práticas",
        "Compreensão profunda das emoções",
        "Maior serenidade nas decisões",
        "Relação mais harmoniosa",
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImage})`,
            filter: "brightness(0.7)",
          }}
        />
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Método Raízes®
          </h1>
          <p className="text-xl md:text-2xl mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Ajudar a crescer é ensinar a criar raízes antes de voar.
          </p>
          <Button size="lg" asChild className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <Link to="/contacto">Agendar Sessão</Link>
          </Button>
        </div>
      </section>

      {/* Concept Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">Coaching Educativo e Parental Consciente</h2>
            <p className="text-lg text-muted-foreground mb-4">
              O <strong>Método Raízes®</strong> nasce da fusão entre o coaching educativo clássico
              e as práticas modernas da neuroeducação e parentalidade consciente.
            </p>
            <p className="text-lg text-muted-foreground mb-6">
              Mais do que "corrigir comportamentos", este método orienta pais, professores e
              crianças a compreenderem as emoções, os ritmos e as intenções que moldam a
              aprendizagem.
            </p>
            <Button asChild>
              <Link to="/sobre">Saber Mais</Link>
            </Button>
          </div>
          <div className="relative">
            <img
              src={rootsConcept}
              alt="Conceito de Raízes"
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Three Pillars */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Os Três Pilares</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {pillars.map((pillar, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-8">
                  <div className="flex justify-center mb-4">{pillar.icon}</div>
                  <h3 className="text-2xl font-bold mb-3">{pillar.title}</h3>
                  <p className="text-muted-foreground">{pillar.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Resultados Visíveis</h2>
        <div className="grid md:grid-cols-2 gap-12">
          {benefits.map((benefit, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-6">
                  {benefit.icon}
                  <h3 className="text-2xl font-bold">{benefit.title}</h3>
                </div>
                <ul className="space-y-3">
                  {benefit.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <img
              src={childGrowth}
              alt="Crescimento Infantil"
              className="rounded-lg shadow-lg w-full h-80 object-cover"
            />
            <img
              src={parentTeacher}
              alt="Colaboração"
              className="rounded-lg shadow-lg w-full h-80 object-cover"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 container mx-auto px-4 text-center">
        <blockquote className="text-3xl md:text-4xl font-serif italic text-muted-foreground mb-8">
          "Educar é plantar raízes para que um dia possam voar."
        </blockquote>
        <p className="text-xl mb-8">— Paula Lopes</p>
        <Button size="lg" asChild>
          <Link to="/metodo">Conhecer o Método</Link>
        </Button>
      </section>

      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;
