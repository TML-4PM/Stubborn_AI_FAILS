import { usePersonalizedFeed } from '@/hooks/usePersonalizedFeed';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import EnhancedFailCard from './EnhancedFailCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useSocialActions } from '@/hooks/useSocialActions';

const PersonalizedFeed = () => {
  const { feed, loading, hasMore, loadMore, refresh } = usePersonalizedFeed();
  
  useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore,
    isLoading: loading,
  });

  if (loading && feed.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!loading && feed.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">No content found in your feed</p>
        <Button onClick={refresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Feed
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Feed</h2>
        <Button onClick={refresh} variant="ghost" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {feed.map((item) => {
          const { handleLike, handleBookmark, isLiked, isBookmarked, likesCount } = 
            useSocialActions(item.id, item.likes);

          return (
            <EnhancedFailCard
              key={item.id}
              id={item.id}
              title={item.title}
              description={item.description}
              category={item.category}
              imageUrl={item.image_url}
              likes={likesCount}
              comments={item.comments || 0}
              shares={item.shares || 0}
              viralScore={item.viral_score || 0}
              createdAt={item.created_at}
              userId={item.user_id}
              username={item.username}
              avatarUrl={item.avatar_url}
              isLiked={isLiked}
              isBookmarked={isBookmarked}
              onLike={handleLike}
              onBookmark={handleBookmark}
            />
          );
        })}
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      )}

      {!hasMore && feed.length > 0 && (
        <div className="text-center py-8 text-muted-foreground">
          You've reached the end of your feed
        </div>
      )}
    </div>
  );
};

export default PersonalizedFeed;
