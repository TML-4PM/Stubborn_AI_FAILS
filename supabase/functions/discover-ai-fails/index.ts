
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// System user ID - should be created in profiles table
const SYSTEM_USER_ID = '00000000-0000-0000-0000-000000000000';

interface RedditPost {
  id: string;
  title: string;
  selftext: string;
  url: string;
  thumbnail: string;
  ups: number;
  num_comments: number;
  created_utc: number;
  subreddit: string;
  permalink: string;
  is_video: boolean;
}

interface DiscoveredContent {
  title: string;
  description: string;
  image_url?: string;
  source_url: string;
  source_platform: string;
  confidence_score: number;
  category: string;
  viral_score: number;
  keywords: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { platform = 'reddit' } = await req.json().catch(() => ({}))

    // Validate platform
    const validPlatforms = ['reddit', 'hackernews'];
    if (!validPlatforms.includes(platform)) {
      throw new Error(`Invalid platform: ${platform}. Must be one of: ${validPlatforms.join(', ')}`);
    }

    console.log(`Starting content discovery for platform: ${platform}`)

    // Ensure system user exists
    await ensureSystemUserExists(supabase);

    let discoveredContent: DiscoveredContent[] = []

    if (platform === 'reddit') {
      discoveredContent = await discoverFromReddit()
    } else if (platform === 'hackernews') {
      discoveredContent = await discoverFromHackerNews()
    }

    // Validate and store discovered content
    let storedCount = 0;
    for (const content of discoveredContent) {
      const validationResult = validateDiscoveredContent(content);
      if (validationResult.isValid) {
        const stored = await storeDiscoveredContent(supabase, content);
        if (stored) storedCount++;
      } else {
        console.warn('Invalid content skipped:', validationResult.errors);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        discovered: discoveredContent.length,
        stored: storedCount,
        platform,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Discovery error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        code: error.code || 'UNKNOWN_ERROR',
        timestamp: new Date().toISOString()
      }),
      { 
        status: error.status || 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function ensureSystemUserExists(supabase: any): Promise<void> {
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', SYSTEM_USER_ID)
    .single();

  if (!existingProfile) {
    const { error } = await supabase
      .from('profiles')
      .insert({
        user_id: SYSTEM_USER_ID,
        username: 'ai_discovery_system',
        full_name: 'AI Discovery System',
        bio: 'Automated content discovery system'
      });

    if (error) {
      console.error('Error creating system user:', error);
    } else {
      console.log('System user profile created successfully');
    }
  }
}

function validateDiscoveredContent(content: DiscoveredContent): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!content.title || content.title.length < 5 || content.title.length > 300) {
    errors.push('Title must be between 5 and 300 characters');
  }

  if (!content.description || content.description.length < 10 || content.description.length > 1000) {
    errors.push('Description must be between 10 and 1000 characters');
  }

  if (!content.source_url || !isValidUrl(content.source_url)) {
    errors.push('Valid source URL is required');
  }

  if (!['reddit', 'hackernews', 'twitter', 'github'].includes(content.source_platform)) {
    errors.push('Invalid source platform');
  }

  if (content.confidence_score < 0 || content.confidence_score > 1) {
    errors.push('Confidence score must be between 0 and 1');
  }

  if (content.viral_score < 0 || content.viral_score > 100) {
    errors.push('Viral score must be between 0 and 100');
  }

  return { isValid: errors.length === 0, errors };
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

async function discoverFromReddit(): Promise<DiscoveredContent[]> {
  const subreddits = [
    'ChatGPTfails', 'weirddalle', 'MediaSynthesis', 'artificial',
    'ChatGPT', 'OpenAI', 'MachineLearning', 'deeplearning'
  ]

  const discoveries: DiscoveredContent[] = []

  for (const subreddit of subreddits) {
    try {
      console.log(`Fetching from r/${subreddit}`)
      
      const response = await fetch(
        `https://www.reddit.com/r/${subreddit}/hot.json?limit=25`,
        {
          headers: {
            'User-Agent': 'AI-Fail-Discovery-Bot/2.0 (Content Discovery)'
          }
        }
      )

      if (!response.ok) {
        console.warn(`Failed to fetch r/${subreddit}: ${response.status}`);
        continue;
      }

      const data = await response.json()
      const posts = data.data?.children || []

      for (const postWrapper of posts) {
        const post: RedditPost = postWrapper.data
        
        const analysis = analyzePostForAIFails(post);
        console.log(`Post: "${post.title.substring(0, 50)}..." - Confidence: ${analysis.confidence}, IsAIFail: ${analysis.isLikelyAIFail}`);
        
        // Lower threshold to 0.4 to get more results for initial data population
        if (analysis.isLikelyAIFail && analysis.confidence > 0.4) {
          const content = await processRedditPost(post, analysis);
          if (content) {
            discoveries.push(content);
            console.log(`✅ Added: ${content.title.substring(0, 60)}...`);
          }
        }
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1500))
      
    } catch (error) {
      console.error(`Error fetching from r/${subreddit}:`, error)
    }
  }

  return discoveries
}

function analyzePostForAIFails(post: RedditPost): { isLikelyAIFail: boolean; confidence: number; keywords: string[]; category: string } {
  const combined = (post.title + ' ' + post.selftext).toLowerCase();
  const keywords: string[] = [];
  let confidence = 0.1;

  // AI keywords
  const aiKeywords = ['chatgpt', 'gpt', 'dalle', 'midjourney', 'ai', 'artificial intelligence'];
  const foundAI = aiKeywords.filter(k => combined.includes(k));
  if (foundAI.length > 0) {
    confidence += 0.3;
    keywords.push(...foundAI);
  }

  // Fail keywords  
  const failKeywords = ['fail', 'wrong', 'mistake', 'error', 'weird', 'broken'];
  const foundFail = failKeywords.filter(k => combined.includes(k));
  if (foundFail.length > 0) {
    confidence += 0.25;
    keywords.push(...foundFail);
  }

  // Engagement
  if (post.ups > 50) confidence += 0.15;
  if (post.num_comments > 20) confidence += 0.1;

  // Subreddit relevance
  const relevantSubs = ['chatgptfails', 'weirddalle', 'mediasynthesis'];
  if (relevantSubs.includes(post.subreddit.toLowerCase())) {
    confidence += 0.2;
  }

  const category = determineCategory(combined);
  const isLikelyAIFail = confidence > 0.6 && foundAI.length > 0;

  return { isLikelyAIFail, confidence, keywords, category };
}

function determineCategory(text: string): string {
  if (text.includes('dalle') || text.includes('midjourney')) return 'Image Generation';
  if (text.includes('chatgpt') || text.includes('gpt')) return 'Chat AI';
  if (text.includes('code') || text.includes('programming')) return 'Code Generation';
  if (text.includes('video') || text.includes('music')) return 'Media Generation';
  return 'General AI';
}

async function processRedditPost(post: RedditPost, analysis: any): Promise<DiscoveredContent | null> {
  try {
    let imageUrl = null;
    if (post.thumbnail && post.thumbnail.startsWith('http') && post.thumbnail !== 'self') {
      imageUrl = post.thumbnail;
    } else if (post.url && isImageUrl(post.url)) {
      imageUrl = post.url;
    }

    const viralScore = calculateViralScore(post.ups, post.num_comments, 0, post.created_utc);

    return {
      title: sanitizeText(post.title, 200),
      description: sanitizeText(post.selftext || post.title, 500),
      image_url: imageUrl,
      source_url: `https://reddit.com${post.permalink}`,
      source_platform: 'reddit',
      confidence_score: Math.min(analysis.confidence, 1.0),
      category: analysis.category,
      viral_score: viralScore,
      keywords: analysis.keywords
    };
  } catch (error) {
    console.error('Error processing Reddit post:', error);
    return null;
  }
}

function isImageUrl(url: string): boolean {
  const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  return imageExts.some(ext => url.toLowerCase().includes(ext)) ||
         url.includes('imgur.com') || url.includes('i.redd.it');
}

function sanitizeText(text: string, maxLength: number): string {
  if (!text) return '';
  return text
    .replace(/[<>\"']/g, '')
    .replace(/\[.*?\]/g, '')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, maxLength);
}

function calculateViralScore(ups: number, comments: number, shares: number, createdUtc: number): number {
  const hoursOld = (Date.now() / 1000 - createdUtc) / 3600;
  const engagementScore = (ups * 1.0) + (comments * 2.0) + (shares * 3.0);
  return Math.round((engagementScore / Math.pow(hoursOld + 1, 0.8)) * 100) / 100;
}

async function discoverFromHackerNews(): Promise<DiscoveredContent[]> {
  const discoveries: DiscoveredContent[] = [];

  try {
    const response = await fetch('https://hacker-news.firebaseio.com/v0/newstories.json');
    if (!response.ok) return discoveries;

    const storyIds = await response.json();
    
    for (const id of storyIds.slice(0, 50)) {
      try {
        const storyResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
        if (!storyResponse.ok) continue;

        const story = await storyResponse.json();
        
        if (story && isLikelyAIFailHN(story)) {
          const content = processHNStory(story);
          if (content) discoveries.push(content);
        }
        
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error fetching HN story ${id}:`, error);
      }
    }
  } catch (error) {
    console.error('Error fetching from HackerNews:', error);
  }

  return discoveries;
}

function isLikelyAIFailHN(story: any): boolean {
  if (!story.title) return false;
  const title = story.title.toLowerCase();
  const hasAI = title.includes('ai ') || title.includes('gpt') || title.includes('artificial intelligence');
  const hasFail = title.includes('fail') || title.includes('wrong') || title.includes('mistake');
  return hasAI && (hasFail || story.score > 50);
}

function processHNStory(story: any): DiscoveredContent | null {
  try {
    return {
      title: sanitizeText(story.title, 200),
      description: sanitizeText(story.text || story.title, 500),
      source_url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
      source_platform: 'hackernews',
      confidence_score: 0.7,
      category: 'Tech Discussion',
      viral_score: Math.min(story.score / 10, 10),
      keywords: ['hackernews', 'tech']
    };
  } catch (error) {
    console.error('Error processing HN story:', error);
    return null;
  }
}

async function storeDiscoveredContent(supabase: any, content: DiscoveredContent): Promise<boolean> {
  try {
    // Check for duplicates
    const { data: existing } = await supabase
      .from('oopsies')
      .select('id')
      .eq('source_url', content.source_url)
      .single();

    if (existing) {
      console.log('Content already exists, skipping:', content.source_url);
      return false;
    }

    // Insert new content
    const { error } = await supabase
      .from('oopsies')
      .insert({
        title: content.title,
        description: content.description,
        image_url: content.image_url,
        source_url: content.source_url,
        source_platform: content.source_platform,
        confidence_score: content.confidence_score,
        category: content.category,
        viral_score: content.viral_score,
        auto_generated: true,
        review_status: 'pending',
        status: 'pending',
        user_id: SYSTEM_USER_ID,
        likes: 0,
        comments: 0,
        shares: 0,
        is_featured: content.viral_score > 5,
        discovery_date: new Date().toISOString()
      });

    if (error) {
      console.error('Error storing content:', error);
      return false;
    }

    console.log('Stored new content:', content.title);
    return true;
  } catch (error) {
    console.error('Error in storeDiscoveredContent:', error);
    return false;
  }
}
