
import { useEffect } from 'react';
import { updateSEOMetadata, generateStructuredData } from '@/utils/seoUtils';

const GalleryHeader = () => {
  useEffect(() => {
    updateSEOMetadata({
      title: 'AI Fails Gallery - Hilarious AI Mishaps & Funny AI Responses',
      description: 'Browse our collection of hilarious AI fails, unexpected responses, and funny AI-generated content. Discover the lighter side of artificial intelligence.',
      type: 'website',
      url: window.location.href
    });

    generateStructuredData('ImageGallery', {
      name: 'AI Oopsies Gallery',
      description: 'A collection of hilarious AI fails and unexpected responses',
      url: window.location.href
    });
  }, []);

  return (
    <div className="max-w-3xl mx-auto text-center mb-8">
      <h1 className="text-4xl font-bold mb-4">AI Fails Gallery</h1>
      <p className="text-muted-foreground">
        Browse our collection of hilarious AI mishaps and unexpected responses. 
        Use the search bar to find specific fails or filter by categories and tags.
      </p>
    </div>
  );
};

export default GalleryHeader;
