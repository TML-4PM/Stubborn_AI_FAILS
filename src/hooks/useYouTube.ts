
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
}

interface YouTubeUploadData {
  title: string;
  description: string;
  tags: string[];
  thumbnailFile?: File;
  videoBlob: Blob;
}

export const useYouTube = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [channelVideos, setChannelVideos] = useState<YouTubeVideo[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);

  const uploadToYouTube = useCallback(async (uploadData: YouTubeUploadData) => {
    setIsUploading(true);
    
    try {
      // In a real implementation, this would use YouTube Data API v3
      // For now, we'll simulate the upload process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Video uploaded successfully!",
        description: "Your AI fail video has been uploaded to YouTube.",
      });
      
      return {
        success: true,
        videoId: `yt_${Date.now()}`,
        url: `https://youtube.com/watch?v=yt_${Date.now()}`
      };
    } catch (error) {
      console.error('YouTube upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload video to YouTube. Please try again.",
        variant: "destructive"
      });
      return { success: false };
    } finally {
      setIsUploading(false);
    }
  }, []);

  const fetchChannelVideos = useCallback(async () => {
    setIsLoadingVideos(true);
    
    try {
      // Simulate fetching channel videos
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockVideos: YouTubeVideo[] = [
        {
          id: 'video1',
          title: 'Top 10 AI Fails This Week',
          description: 'Compilation of the funniest AI mistakes...',
          thumbnailUrl: 'https://picsum.photos/320/180?random=1',
          publishedAt: new Date().toISOString(),
          viewCount: 12500,
          likeCount: 850
        },
        {
          id: 'video2',
          title: 'ChatGPT Goes Wrong - Hilarious Compilation',
          description: 'When AI gets confused...',
          thumbnailUrl: 'https://picsum.photos/320/180?random=2',
          publishedAt: new Date(Date.now() - 86400000).toISOString(),
          viewCount: 8200,
          likeCount: 620
        }
      ];
      
      setChannelVideos(mockVideos);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    } finally {
      setIsLoadingVideos(false);
    }
  }, []);

  return {
    uploadToYouTube,
    fetchChannelVideos,
    channelVideos,
    isUploading,
    isLoadingVideos
  };
};
