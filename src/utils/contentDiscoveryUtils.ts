
export interface DiscoveryMetrics {
  totalDiscovered: number;
  approvedCount: number;
  pendingCount: number;
  rejectedCount: number;
  averageConfidence: number;
  topSources: Array<{ platform: string; count: number }>;
}

export const getDiscoveryMetrics = async (): Promise<DiscoveryMetrics> => {
  // This would typically fetch from Supabase
  // For now, returning mock data structure
  return {
    totalDiscovered: 0,
    approvedCount: 0,
    pendingCount: 0,
    rejectedCount: 0,
    averageConfidence: 0,
    topSources: []
  };
};

export const categorizeContent = (title: string, description: string): string => {
  const combined = (title + ' ' + description).toLowerCase();
  
  if (combined.includes('dalle') || combined.includes('midjourney') || combined.includes('stable diffusion')) {
    return 'Image Generation';
  } else if (combined.includes('chatgpt') || combined.includes('gpt') || combined.includes('conversation')) {
    return 'Chat AI';
  } else if (combined.includes('code') || combined.includes('programming')) {
    return 'Code Generation';
  } else if (combined.includes('video') || combined.includes('music')) {
    return 'Media Generation';
  }
  
  return 'General AI';
};

export const calculateContentScore = (
  engagement: { upvotes: number; comments: number; shares: number },
  ageHours: number,
  source: string
): number => {
  const { upvotes, comments, shares } = engagement;
  
  // Base viral score calculation
  const engagementScore = (upvotes * 1.0) + (comments * 2.0) + (shares * 3.0);
  const timeDecay = Math.pow(ageHours + 1, 0.8);
  const viralScore = engagementScore / timeDecay;
  
  // Source reliability multiplier
  const sourceMultiplier = source === 'reddit' ? 1.0 : 0.8;
  
  return Math.round(viralScore * sourceMultiplier * 100) / 100;
};

export const isValidImageUrl = (url: string): boolean => {
  if (!url) return false;
  
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const lowerUrl = url.toLowerCase();
  
  return imageExtensions.some(ext => lowerUrl.includes(ext)) || 
         lowerUrl.includes('imgur.com') || 
         lowerUrl.includes('i.redd.it');
};

export const cleanContentText = (text: string, maxLength: number = 500): string => {
  if (!text) return '';
  
  return text
    .replace(/\[.*?\]/g, '') // Remove markdown links
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
    .substring(0, maxLength);
};

export const extractKeywords = (text: string): string[] => {
  const failKeywords = [
    'ai fail', 'chatgpt fail', 'dalle fail', 'gpt error',
    'ai mistake', 'machine learning fail', 'neural network',
    'artificial intelligence', 'deep learning', 'ai gone wrong'
  ];
  
  const lowerText = text.toLowerCase();
  return failKeywords.filter(keyword => lowerText.includes(keyword));
};
