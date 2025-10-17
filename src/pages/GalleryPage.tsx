
import Navbar from '@/components/Navbar';

import { useIsMobile } from '@/hooks/use-mobile';
import PullToRefresh from '@/components/ui/PullToRefresh';
import GalleryContent from '@/components/gallery/GalleryContent';

const GalleryPage = () => {
  const isMobile = useIsMobile();

  const handleRefresh = () => {
    // Refresh functionality will be handled by GalleryContent
    window.location.reload();
  };

  const content = (
    <main className="flex-1 container mx-auto px-4 py-8">
      <GalleryContent />
    </main>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {isMobile ? (
        <PullToRefresh onRefresh={handleRefresh}>
          {content}
        </PullToRefresh>
      ) : (
        content
      )}
    </div>
  );
};

export default GalleryPage;
