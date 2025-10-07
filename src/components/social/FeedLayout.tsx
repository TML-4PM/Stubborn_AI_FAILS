import { ReactNode } from 'react';
import FollowSuggestions from './FollowSuggestions';
import { useUser } from '@/contexts/UserContext';

interface FeedLayoutProps {
  children: ReactNode;
}

const FeedLayout = ({ children }: FeedLayoutProps) => {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-8 space-y-6">
            {children}
          </div>

          {/* Sidebar */}
          {user && (
            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                <FollowSuggestions />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedLayout;
