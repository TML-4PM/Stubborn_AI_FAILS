
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useIsMobile } from '@/hooks/use-mobile';
import PullToRefresh from '@/components/ui/PullToRefresh';
import GalleryContent from '@/components/gallery/GalleryContent';

const GalleryPage = () => {
  const isMobile = useIsMobile();

  const handleRefresh = () => {
    // Refresh functionality will be handled by GalleryContent
  };

  const content = <GalleryContent onRefresh={handleRefresh} />;

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
      
      <Footer />
    </div>
  );
};

export default GalleryPage;
