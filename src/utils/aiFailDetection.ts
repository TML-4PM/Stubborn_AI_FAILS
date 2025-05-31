
import { extractKeywords } from './contentDiscoveryUtils';

interface ContentAnalysis {
  isLikelyAIFail: boolean;
  confidence: number;
  keywords: string[];
  category: string;
  reasons: string[];
}

export const analyzeContentForAIFails = (
  title: string, 
  description: string,
  metadata?: { subreddit?: string; score?: number; comments?: number }
): ContentAnalysis => {
  const combined = (title + ' ' + description).toLowerCase();
  const keywords = extractKeywords(combined);
  const reasons: string[] = [];
  
  let confidence = 0.1; // Base confidence
  let isLikelyAIFail = false;

  // AI-related keywords
  const aiKeywords = [
    'chatgpt', 'gpt', 'dalle', 'midjourney', 'stable diffusion',
    'ai', 'artificial intelligence', 'machine learning', 'neural network',
    'openai', 'claude', 'bard', 'llm', 'large language model'
  ];

  // Fail/error keywords
  const failKeywords = [
    'fail', 'failed', 'wrong', 'mistake', 'error', 'bug', 'glitch',
    'weird', 'strange', 'broken', 'wtf', 'hilarious', 'oops',
    'gone wrong', 'disaster', 'nightmare', 'cursed'
  ];

  // Check for AI keywords
  const foundAIKeywords = aiKeywords.filter(keyword => combined.includes(keyword));
  if (foundAIKeywords.length > 0) {
    confidence += 0.3;
    reasons.push(`Contains AI keywords: ${foundAIKeywords.join(', ')}`);
  }

  // Check for fail keywords
  const foundFailKeywords = failKeywords.filter(keyword => combined.includes(keyword));
  if (foundFailKeywords.length > 0) {
    confidence += 0.25;
    reasons.push(`Contains fail keywords: ${foundFailKeywords.join(', ')}`);
  }

  // Check engagement metrics
  if (metadata?.score && metadata.score > 50) {
    confidence += 0.15;
    reasons.push('High engagement score');
  }

  if (metadata?.comments && metadata.comments > 20) {
    confidence += 0.1;
    reasons.push('High comment count');
  }

  // Check subreddit relevance
  const relevantSubreddits = [
    'chatgptfails', 'weirddalle', 'mediasynthesis', 'artificial',
    'machinelearning', 'deeplearning', 'openai'
  ];
  
  if (metadata?.subreddit && relevantSubreddits.includes(metadata.subreddit.toLowerCase())) {
    confidence += 0.2;
    reasons.push(`Posted in relevant subreddit: ${metadata.subreddit}`);
  }

  // Determine category
  const category = determineCategory(combined, foundAIKeywords);

  // Final determination
  isLikelyAIFail = confidence > 0.6 && foundAIKeywords.length > 0;

  return {
    isLikelyAIFail,
    confidence: Math.min(confidence, 1.0),
    keywords: [...foundAIKeywords, ...foundFailKeywords],
    category,
    reasons
  };
};

const determineCategory = (text: string, aiKeywords: string[]): string => {
  if (text.includes('dalle') || text.includes('midjourney') || text.includes('stable diffusion')) {
    return 'Image Generation';
  } else if (text.includes('chatgpt') || text.includes('gpt') || text.includes('conversation')) {
    return 'Chat AI';
  } else if (text.includes('code') || text.includes('programming') || text.includes('github copilot')) {
    return 'Code Generation';
  } else if (text.includes('video') || text.includes('music') || text.includes('audio')) {
    return 'Media Generation';
  } else if (aiKeywords.length > 0) {
    return 'General AI';
  }
  
  return 'Unknown';
};

export const scoreViralPotential = (
  upvotes: number,
  comments: number,
  shares: number,
  ageHours: number,
  platform: string = 'reddit'
): number => {
  const engagementScore = (upvotes * 1.0) + (comments * 2.0) + (shares * 3.0);
  const timeDecay = Math.pow(ageHours + 1, 0.8);
  const platformMultiplier = platform === 'reddit' ? 1.0 : 0.8;
  
  return Math.round((engagementScore / timeDecay) * platformMultiplier * 100) / 100;
};
