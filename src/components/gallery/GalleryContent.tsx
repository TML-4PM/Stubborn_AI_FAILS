
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import FailCard from '@/components/FailCard';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { initialAIFails } from '@/data/initialAIFails';

interface Fail {
  id: string;
  title: string;
  description: string;
  image_url: string;
  likes: number;
  created_at: string;
  status: string;
  username: string;
}

interface GalleryContentProps {
  category?: string;
  query?: string;
}

const GalleryContent = ({ category, query }: GalleryContentProps) => {
  const [fails, setFails] = useState<Fail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 12;
  
  const fetchFails = async (page: number, category?: string, query?: string): Promise<Fail[]> => {
    setIsLoading(true);
    
    let dbQuery = supabase
      .from('oopsies')
      .select(`
        *,
        profiles(username)
      `)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .range((page - 1) * itemsPerPage, page * itemsPerPage - 1);
    
    if (category) {
      dbQuery = dbQuery.eq('category', category);
    }
    
    if (query) {
      dbQuery = dbQuery.ilike('title', `%${query}%`);
    }
    
    const { data, error } = await dbQuery;
    
    if (error) {
      console.error('Error fetching fails:', error);
      throw error;
    }
    
    setIsLoading(false);
    
    // Transform the data to match the expected interface
    const transformedData = (data || []).map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      image_url: item.image_url,
      likes: item.likes || 0,
      created_at: item.created_at,
      status: item.status,
      username: (item.profiles as any)?.username || 'Anonymous'
    }));

    if (transformedData.length === 0) {
      const local = initialAIFails
        .filter(f => (category ? f.category === category : true))
        .filter(f => (query ? f.title.toLowerCase().includes(query.toLowerCase()) : true))
        .slice((page - 1) * itemsPerPage, page * itemsPerPage)
        .map((f, idx) => ({
          id: `local-${(page - 1) * itemsPerPage + idx}-${f.title}`,
          title: f.title,
          description: f.description,
          image_url: f.image_url,
          likes: (f as any).likes || 0,
          created_at: new Date().toISOString(),
          status: (f as any).status || 'approved',
          username: 'Community'
        }));
      return local as Fail[];
    }
    
    return transformedData;
  };
  
  useEffect(() => {
    setFails([]);
    setPage(1);
    setHasMore(true);
  }, [category, query]);
  
  useEffect(() => {
    if (hasMore) {
      setIsLoading(true);
      fetchFails(page, category, query)
        .then(newFails => {
          if (newFails.length === 0) {
            setHasMore(false);
          } else {
            setFails(prevFails => [...prevFails, ...newFails]);
          }
        })
        .catch(error => {
          console.error('Error in useEffect:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [page, category, query, hasMore]);
  
  const loadMore = () => {
    if (!isLoading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {fails.map((fail) => (
        <FailCard
          key={fail.id}
          id={fail.id}
          image={fail.image_url}
          name={fail.title}
          description={fail.description}
          likeCount={fail.likes || 0}
          author={fail.username}
          timestamp={new Date(fail.created_at).toISOString()}
          status={fail.status}
        />
      ))}
      
      {isLoading && (
        <>
          {[...Array(itemsPerPage)].map((_, i) => (
            <div key={`loading-${i}`} className="animate-pulse rounded-md aspect-square bg-muted" />
          ))}
        </>
      )}
      
      {!isLoading && fails.length === 0 && (
        <div className="col-span-full text-center py-12">
          <p className="text-muted-foreground">No fails found in this category.</p>
        </div>
      )}
      
      {!isLoading && hasMore && (
        <Button onClick={loadMore} className="col-span-full">
          Load More
        </Button>
      )}
      
      {!hasMore && fails.length > 0 && (
        <div className="col-span-full text-center py-6">
          <p className="text-muted-foreground">No more fails to load.</p>
        </div>
      )}
    </div>
  );
};

export default GalleryContent;
