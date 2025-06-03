
import { useParams } from 'react-router-dom';
import EnhancedUserProfile from '@/components/social/EnhancedUserProfile';

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();

  if (!userId) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
        <p className="text-muted-foreground">The requested user profile could not be found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <EnhancedUserProfile userId={userId} />
    </div>
  );
};

export default UserProfile;
