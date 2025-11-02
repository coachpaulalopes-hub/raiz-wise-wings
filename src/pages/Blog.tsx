import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string | null;
  created_at: string;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setPosts(data);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 container mx-auto px-4">
        <h1 className="text-5xl font-bold mb-4 text-center">Blog</h1>
        <p className="text-xl text-center text-muted-foreground mb-16">
          Insights sobre parentalidade consciente e coaching educativo
        </p>

        {loading ? (
          <div className="text-center text-muted-foreground">A carregar...</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-muted-foreground">
            Ainda não há artigos publicados.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link key={post.id} to={`/blog/${post.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  {post.cover_image && (
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  )}
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(post.created_at), "d 'de' MMMM, yyyy", { locale: pt })}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Newsletter />
      <Footer />
    </div>
  );
};

export default Blog;
