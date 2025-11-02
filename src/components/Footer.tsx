import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-secondary/30 border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-primary mb-4">Método Raízes®</h3>
            <p className="text-muted-foreground">
              Coaching Educativo e Parental Consciente
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              "Ajudar a crescer é ensinar a criar raízes antes de voar."
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/sobre" className="text-muted-foreground hover:text-primary transition-colors">
                  Sobre
                </Link>
              </li>
              <li>
                <Link to="/metodo" className="text-muted-foreground hover:text-primary transition-colors">
                  O Método
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-muted-foreground hover:text-primary transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin size={18} className="text-primary" />
                Vila Real, Portugal
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail size={18} className="text-primary" />
                <a href="mailto:coachpaulalopes@gmail.com" className="hover:text-primary transition-colors">
                  coachpaulalopes@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone size={18} className="text-primary" />
                <a href="tel:+351963392511" className="hover:text-primary transition-colors">
                  +351 963 392 511
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Método Raízes® - Todos os direitos reservados</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
