import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import parentTeacher from "@/assets/parent-teacher.jpg";

const Sobre = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-8 text-center">Sobre Paula Lopes</h1>
          
          <div className="mb-12">
            <img
              src={parentTeacher}
              alt="Paula Lopes"
              className="rounded-lg shadow-xl w-full max-w-2xl mx-auto"
            />
          </div>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold mb-6">Caminhar com propósito, educar com presença</h2>
            
            <p className="text-lg text-muted-foreground mb-6">
              Educar é um ato de presença. É estar disponível para ouvir, orientar e inspirar.
              No <strong>Coaching Educativo</strong>, acreditamos que o progresso acontece passo a
              passo — quando uma mão segura a outra, quando a confiança cresce e o medo diminui.
            </p>

            <p className="text-lg text-muted-foreground mb-6">
              O <strong>Método Raízes®</strong> propõe uma forma de educar que respeita a
              individualidade da criança e o ritmo de cada família. Não se trata de ensinar o "que
              fazer", mas de <strong>ajudar cada um a descobrir como fazer sentido do seu próprio
              caminho.</strong>
            </p>

            <div className="bg-secondary/30 p-8 rounded-lg my-12">
              <h3 className="text-2xl font-bold mb-4">O que é o Coaching Educativo</h3>
              <p className="text-lg text-muted-foreground mb-4">
                <strong>Aprender a aprender. Crescer a crescer.</strong>
              </p>
              <p className="text-lg text-muted-foreground mb-4">
                O coaching educativo é uma jornada partilhada entre a criança, os pais e o educador.
                Cada sessão é uma oportunidade para desenvolver competências emocionais, cognitivas e
                relacionais — a base da aprendizagem duradoura.
              </p>
              <blockquote className="text-xl italic text-muted-foreground border-l-4 border-primary pl-4">
                "Quando a criança aprende a confiar em si, o mundo torna-se um lugar possível."
              </blockquote>
            </div>

            <h3 className="text-2xl font-bold mb-6">Missão</h3>
            <p className="text-lg text-muted-foreground mb-6">
              Ajudar famílias a criar ambientes onde as crianças possam desenvolver-se plenamente,
              com confiança, autonomia e propósito. Cada criança é única, e cada família merece um
              acompanhamento que respeite essa individualidade.
            </p>

            <h3 className="text-2xl font-bold mb-6">Formação e Experiência</h3>
            <p className="text-lg text-muted-foreground mb-6">
              Com formação em coaching educativo, psicopedagogia e neuroeducação, Paula Lopes
              dedica-se a apoiar pais, professores e crianças no desenvolvimento de competências
              emocionais e relacionais que transformam o processo de aprendizagem.
            </p>

            <div className="text-center mt-12">
              <Button size="lg" asChild>
                <Link to="/contacto">Agendar uma Sessão</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Newsletter />
      <Footer />
    </div>
  );
};

export default Sobre;
