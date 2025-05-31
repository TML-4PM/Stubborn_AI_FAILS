
import { z } from 'zod';

// Content validation schemas
export const DiscoveredContentSchema = z.object({
  title: z.string().min(5).max(300).trim(),
  description: z.string().min(10).max(1000).trim(),
  image_url: z.string().url().optional().nullable(),
  source_url: z.string().url(),
  source_platform: z.enum(['reddit', 'hackernews', 'twitter', 'github']),
  confidence_score: z.number().min(0).max(1),
  category: z.string().min(1).max(100),
  viral_score: z.number().min(0).max(100)
});

export const RedditPostSchema = z.object({
  id: z.string(),
  title: z.string(),
  selftext: z.string(),
  url: z.string(),
  thumbnail: z.string().optional(),
  ups: z.number(),
  num_comments: z.number(),
  created_utc: z.number(),
  subreddit: z.string(),
  permalink: z.string(),
  is_video: z.boolean()
});

export const HackerNewsStorySchema = z.object({
  id: z.number(),
  title: z.string(),
  url: z.string().optional(),
  text: z.string().optional(),
  score: z.number(),
  time: z.number()
});

// Input sanitization functions
export const sanitizeText = (text: string, maxLength: number = 500): string => {
  if (!text || typeof text !== 'string') return '';
  
  return text
    .replace(/[<>\"']/g, '') // Remove potentially dangerous characters
    .replace(/\[.*?\]/g, '') // Remove markdown links
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
    .substring(0, maxLength);
};

export const sanitizeUrl = (url: string): string => {
  if (!url || typeof url !== 'string') return '';
  
  try {
    const parsedUrl = new URL(url);
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return '';
    }
    return parsedUrl.toString();
  } catch {
    return '';
  }
};

export const validateImageUrl = (url: string): boolean => {
  if (!url) return false;
  
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const lowerUrl = url.toLowerCase();
  
  return imageExtensions.some(ext => lowerUrl.includes(ext)) || 
         lowerUrl.includes('imgur.com') || 
         lowerUrl.includes('i.redd.it') ||
         lowerUrl.includes('i.imgur.com');
};

export const calculateConfidenceScore = (
  engagement: { upvotes: number; comments: number },
  keywords: string[],
  subreddit?: string
): number => {
  let score = 0.3; // Base score

  // Engagement scoring
  if (engagement.upvotes > 100) score += 0.2;
  else if (engagement.upvotes > 50) score += 0.15;
  else if (engagement.upvotes > 10) score += 0.1;

  if (engagement.comments > 50) score += 0.15;
  else if (engagement.comments > 20) score += 0.1;
  else if (engagement.comments > 5) score += 0.05;

  // Keyword relevance
  if (keywords.length > 0) score += Math.min(keywords.length * 0.1, 0.3);

  // Subreddit relevance
  const relevantSubs = ['chatgptfails', 'weirddalle', 'mediasynthesis', 'artificial'];
  if (subreddit && relevantSubs.includes(subreddit.toLowerCase())) {
    score += 0.2;
  }

  return Math.min(Math.max(score, 0), 1);
};
