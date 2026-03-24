import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Eye, Heart, Calendar } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: article, isLoading } = useQuery({
    queryKey: ['blog-article', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_articles')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  // Increment view count
  useEffect(() => {
    if (article?.id) {
      supabase
        .from('blog_articles')
        .update({ view_count: (article.view_count || 0) + 1 })
        .eq('id', article.id)
        .then(() => {});
    }
  }, [article?.id]);

  const { data: relatedArticles } = useQuery({
    queryKey: ['blog-related', article?.category, article?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_articles')
        .select('id, title, slug, cover_image_url, excerpt, published_at')
        .eq('status', 'published')
        .eq('category', article!.category!)
        .neq('id', article!.id)
        .order('published_at', { ascending: false })
        .limit(3);
      if (error) throw error;
      return data;
    },
    enabled: !!article?.category && !!article?.id,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Post not found</h1>
        <Button asChild variant="outline">
          <Link to="/blog">Back to Blog</Link>
        </Button>
      </div>
    );
  }

  return (
    <article className="container mx-auto px-4 py-12 max-w-3xl">
      <Link
        to="/blog"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Blog
      </Link>

      {article.cover_image_url && (
        <img
          src={article.cover_image_url}
          alt={article.title}
          className="w-full aspect-video object-cover rounded-lg mb-8"
        />
      )}

      <div className="flex flex-wrap items-center gap-3 mb-4">
        {article.category && (
          <Badge variant="outline">{article.category}</Badge>
        )}
        {article.tags && (article.tags as string[]).map((tag: string) => (
          <Badge key={tag} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>

      <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>

      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b">
        {article.author_name && <span>By {article.author_name}</span>}
        {article.published_at && (
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(article.published_at)}
          </span>
        )}
        {article.reading_time_minutes && (
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {article.reading_time_minutes} min read
          </span>
        )}
        <span className="flex items-center gap-1">
          <Eye className="h-3.5 w-3.5" />
          {article.view_count || 0} views
        </span>
      </div>

      <div
        className="prose prose-lg dark:prose-invert max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: article.content || '' }}
      />

      {/* Related articles */}
      {relatedArticles && relatedArticles.length > 0 && (
        <div className="border-t pt-10">
          <h2 className="text-2xl font-bold mb-6">More like this</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedArticles.map((related) => (
              <Link key={related.id} to={`/blog/${related.slug}`} className="group">
                <div className="rounded-lg overflow-hidden border hover:shadow-md transition-shadow">
                  {related.cover_image_url && (
                    <img
                      src={related.cover_image_url}
                      alt={related.title}
                      className="w-full aspect-video object-cover"
                    />
                  )}
                  <div className="p-3">
                    <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                      {related.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};

export default BlogPost;
