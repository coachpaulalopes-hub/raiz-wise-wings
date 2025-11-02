import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  cover_image: string | null;
  created_at: string;
}

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();

      if (!error && data) {
        setPost(data);
      }
      setLoading(false);
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-32 pb-20 container mx-auto px-4 text-center">
          <p className="text-muted-foreground">A carregar...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-32 pb-20 container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Artigo não encontrado</h1>
          <Button asChild>
            <Link to="/blog">
              <ArrowLeft className="mr-2" size={18} />
              Voltar ao Blog
            </Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <article className="pt-32 pb-20 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" asChild className="mb-8">
            <Link to="/blog">
              <ArrowLeft className="mr-2" size={18} />
              Voltar ao Blog
            </Link>
          </Button>

          {post.cover_image && (
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-96 object-cover rounded-lg shadow-xl mb-8"
            />
          )}

          <h1 className="text-5xl font-bold mb-4">{post.title}</h1>
          <p className="text-muted-foreground mb-8">
            {format(new Date(post.created_at), "d 'de' MMMM, yyyy", { locale: pt })}
          </p>

          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>

      <Newsletter />
      <Footer />
    </div>
  );
};

export default BlogPost;
