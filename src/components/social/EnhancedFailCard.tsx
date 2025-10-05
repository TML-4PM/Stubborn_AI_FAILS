import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  ExternalLink, 
  User,
  Shield,
  TrendingUp,
  Star,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface EnhancedFailCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  likes: number;
  comments: number;
  shares: number;
  viralScore: number;
  createdAt: string;
  userId?: string;
  username?: string;
  avatarUrl?: string;
  isFollowing?: boolean;
  isLiked?: boolean;
  isBookmarked?: boolean;
  isVerified?: boolean;
  isTrendingCreator?: boolean;
  onLike?: () => void;
  onBookmark?: () => void;
  onFollow?: () => void;
}

const EnhancedFailCard = ({
  id,
  title,
  description,
  category,
  imageUrl,
  likes,
  comments,
  shares,
  viralScore,
  createdAt,
  userId,
  username,
  avatarUrl,
  isFollowing = false,
  isLiked = false,
  isBookmarked = false,
  isVerified = false,
  isTrendingCreator = false,
  onLike,
  onBookmark,
  onFollow,
}: EnhancedFailCardProps) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* User Header */}
      {username && (
        <div className="p-3 flex items-center justify-between border-b">
          <Link 
            to={`/user/${userId}`} 
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatarUrl} alt={username} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm">{username}</span>
              {isVerified && (
                <Shield className="h-3.5 w-3.5 text-primary" />
              )}
              {isTrendingCreator && (
                <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                  <TrendingUp className="h-3 w-3 text-orange-500" />
                </Badge>
              )}
            </div>
          </Link>
          {onFollow && (
            <Button
              size="sm"
              variant={isFollowing ? 'outline' : 'default'}
              onClick={onFollow}
              className="h-7 text-xs"
            >
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
          )}
        </div>
      )}

      {/* Image */}
      <div className="aspect-video overflow-hidden relative">
        {imageLoading && !imageError && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}
        {!imageError ? (
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageLoading(false);
              setImageError(true);
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <ExternalLink className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Category and Badges */}
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {category}
          </Badge>
          <div className="flex gap-1">
            {viralScore > 100 && (
              <Badge className="bg-fail text-white text-xs">
                🔥 Viral
              </Badge>
            )}
          </div>
        </div>
        
        {/* Title and Description */}
        <Link to={`/fail/${id}`}>
          <h3 className="font-semibold mb-1 line-clamp-2 group-hover:text-fail transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        </Link>

        {/* Time */}
        <p className="text-xs text-muted-foreground">{timeAgo}</p>
        
        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex gap-4">
            <button
              onClick={onLike}
              className={`flex items-center gap-1 text-sm transition-colors ${
                isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
              }`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{likes}</span>
            </button>
            <Link 
              to={`/fail/${id}`}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{comments}</span>
            </Link>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Share2 className="h-4 w-4" />
              <span>{shares}</span>
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBookmark}
              className="h-8 w-8 p-0"
            >
              {isBookmarked ? (
                <BookmarkCheck className="h-4 w-4 text-primary fill-current" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </Button>
            <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
              <Link to={`/fail/${id}`}>
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedFailCard;