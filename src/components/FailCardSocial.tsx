
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import LikeButton from '@/components/social/LikeButton';
import ShareButton from '@/components/social/ShareButton';
import { formatDistanceToNow } from 'date-fns';

interface FailCardSocialProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  username: string;
  date: string;
  likes: number;
  category: string;
  tags: string[];
  aiModel: string;
  featured: boolean;
}

const FailCardSocial = (props: FailCardSocialProps) => {
  const { id, title, imageUrl, username, date, likes } = props;
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <Link to={`/fail/${id}`} className="block">
        <div className="aspect-[4/3] overflow-hidden relative">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-bold text-lg line-clamp-2 mb-2">{title}</h3>
        </CardContent>
      </Link>
      
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center">
          <Avatar className="h-6 w-6 mr-2">
            <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
            <AvatarImage src={`https://avatar.vercel.sh/${username}`} />
          </Avatar>
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">{username}</span>
            <span className="ml-2">{formatDistanceToNow(new Date(date), { addSuffix: true })}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <LikeButton failId={id} initialLikes={likes} />
          <ShareButton failId={id} title={title} />
        </div>
      </CardFooter>
    </Card>
  );
};

export default FailCardSocial;
