
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';

import YouTubeChannel from '@/components/youtube/YouTubeChannel';
import { updateSEOMetadata } from '@/utils/seoUtils';

const YouTubePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    
    updateSEOMetadata({
      title: 'AI Fails YouTube Channel - Watch the Best AI Mistakes',
      description: 'Watch hilarious compilations of AI fails and mistakes on our YouTube channel. Subscribe for weekly content featuring the funniest AI errors and glitches.',
      type: 'website'
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block p-3 rounded-full bg-red-500/10 mb-4">
                <div className="bg-red-500/20 rounded-full p-3">
                  <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-4">AI Fails YouTube Channel</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Watch the funniest AI mistakes and fails compiled into entertaining videos. 
                Subscribe to never miss the latest AI comedy gold!
              </p>
            </div>

            <YouTubeChannel />
          </div>
        </div>
      </main>
      
      
    </div>
  );
};

export default YouTubePage;
