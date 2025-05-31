
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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

    console.log(`Starting content discovery for platform: ${platform}`)

    let discoveredContent: DiscoveredContent[] = []

    if (platform === 'reddit') {
      discoveredContent = await discoverFromReddit()
    } else if (platform === 'hackernews') {
      discoveredContent = await discoverFromHackerNews()
    }

    // Process and store discovered content
    for (const content of discoveredContent) {
      await storeDiscoveredContent(supabase, content)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        discovered: discoveredContent.length,
        platform 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Discovery error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function discoverFromReddit(): Promise<DiscoveredContent[]> {
  const subreddits = [
    'ChatGPTfails',
    'weirddalle', 
    'MediaSynthesis',
    'artificial',
    'ChatGPT',
    'OpenAI',
    'MachineLearning'
  ]

  const discoveries: DiscoveredContent[] = []

  for (const subreddit of subreddits) {
    try {
      console.log(`Fetching from r/${subreddit}`)
      
      const response = await fetch(
        `https://www.reddit.com/r/${subreddit}/hot.json?limit=25`,
        {
          headers: {
            'User-Agent': 'AI-Fail-Discovery-Bot/1.0'
          }
        }
      )

      if (!response.ok) continue

      const data = await response.json()
      const posts = data.data?.children || []

      for (const postWrapper of posts) {
        const post: RedditPost = postWrapper.data
        
        // Filter for potential AI fails
        if (await isLikelyAIFail(post)) {
          const content = await processRedditPost(post)
          if (content) {
            discoveries.push(content)
          }
        }
      }

      // Rate limiting - wait between subreddit requests
      await new Promise(resolve => setTimeout(resolve, 1000))
      
    } catch (error) {
      console.error(`Error fetching from r/${subreddit}:`, error)
    }
  }

  return discoveries
}

async function discoverFromHackerNews(): Promise<DiscoveredContent[]> {
  const discoveries: DiscoveredContent[] = []

  try {
    // Get recent stories
    const response = await fetch('https://hacker-news.firebaseio.com/v0/newstories.json')
    const storyIds = await response.json()
    
    // Check first 50 recent stories
    for (const id of storyIds.slice(0, 50)) {
      const storyResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
      const story = await storyResponse.json()
      
      if (story && await isLikelyAIFailHN(story)) {
        const content = await processHNStory(story)
        if (content) {
          discoveries.push(content)
        }
      }
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  } catch (error) {
    console.error('Error fetching from HackerNews:', error)
  }

  return discoveries
}

async function isLikelyAIFail(post: RedditPost): Promise<boolean> {
  const failKeywords = [
    'fail', 'wrong', 'mistake', 'error', 'bug', 'glitch',
    'weird', 'strange', 'broken', 'wtf', 'hilarious',
    'chatgpt', 'gpt', 'dalle', 'midjourney', 'ai', 'artificial intelligence'
  ]

  const title = post.title.toLowerCase()
  const text = post.selftext.toLowerCase()
  const combined = title + ' ' + text

  const hasFailKeywords = failKeywords.some(keyword => combined.includes(keyword))
  const hasGoodEngagement = post.ups > 5 || post.num_comments > 2
  const isNotTooOld = (Date.now() / 1000 - post.created_utc) < (7 * 24 * 60 * 60) // Within a week

  return hasFailKeywords && hasGoodEngagement && isNotTooOld
}

async function isLikelyAIFailHN(story: any): Promise<boolean> {
  if (!story.title) return false
  
  const title = story.title.toLowerCase()
  const hasAI = title.includes('ai ') || title.includes('gpt') || title.includes('artificial intelligence')
  const hasFail = title.includes('fail') || title.includes('wrong') || title.includes('mistake')
  
  return hasAI && (hasFail || story.score > 50)
}

async function processRedditPost(post: RedditPost): Promise<DiscoveredContent | null> {
  try {
    const confidence = calculateConfidenceScore(post)
    
    // Extract image URL
    let imageUrl = null
    if (post.thumbnail && post.thumbnail.startsWith('http')) {
      imageUrl = post.thumbnail
    } else if (post.url && (post.url.includes('.jpg') || post.url.includes('.png') || post.url.includes('.gif'))) {
      imageUrl = post.url
    }

    const category = determineCategory(post.title + ' ' + post.selftext)
    const viralScore = calculateViralScore(post.ups, post.num_comments, 0, post.created_utc)

    return {
      title: cleanTitle(post.title),
      description: cleanDescription(post.selftext || post.title),
      image_url: imageUrl,
      source_url: `https://reddit.com${post.permalink}`,
      source_platform: 'reddit',
      confidence_score: confidence,
      category,
      viral_score: viralScore
    }
  } catch (error) {
    console.error('Error processing Reddit post:', error)
    return null
  }
}

async function processHNStory(story: any): Promise<DiscoveredContent | null> {
  try {
    return {
      title: cleanTitle(story.title),
      description: story.text ? cleanDescription(story.text) : story.title,
      source_url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
      source_platform: 'hackernews',
      confidence_score: 0.7,
      category: 'Tech Discussion',
      viral_score: Math.min(story.score / 10, 10)
    }
  } catch (error) {
    console.error('Error processing HN story:', error)
    return null
  }
}

function calculateConfidenceScore(post: RedditPost): number {
  let score = 0.5 // Base score

  // Increase confidence based on engagement
  if (post.ups > 50) score += 0.2
  if (post.num_comments > 10) score += 0.2

  // Increase confidence for relevant subreddits
  const relevantSubs = ['chatgptfails', 'weirddalle', 'mediasynthesis']
  if (relevantSubs.includes(post.subreddit.toLowerCase())) {
    score += 0.3
  }

  return Math.min(score, 1.0)
}

function determineCategory(text: string): string {
  const lower = text.toLowerCase()
  
  if (lower.includes('dalle') || lower.includes('midjourney') || lower.includes('stable diffusion')) {
    return 'Image Generation'
  } else if (lower.includes('chatgpt') || lower.includes('gpt') || lower.includes('conversation')) {
    return 'Chat AI'
  } else if (lower.includes('code') || lower.includes('programming')) {
    return 'Code Generation'
  } else if (lower.includes('video') || lower.includes('music')) {
    return 'Media Generation'
  }
  
  return 'General AI'
}

function calculateViralScore(ups: number, comments: number, shares: number, createdUtc: number): number {
  const hoursOld = (Date.now() / 1000 - createdUtc) / 3600
  return ((ups * 1.0) + (comments * 2.0) + (shares * 3.0)) / Math.pow(hoursOld + 1, 0.8)
}

function cleanTitle(title: string): string {
  return title.replace(/^\[.*?\]\s*/, '').replace(/\s+/g, ' ').trim().substring(0, 200)
}

function cleanDescription(text: string): string {
  return text.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 500)
}

async function storeDiscoveredContent(supabase: any, content: DiscoveredContent) {
  try {
    // Check if content already exists
    const { data: existing } = await supabase
      .from('oopsies')
      .select('id')
      .eq('source_url', content.source_url)
      .single()

    if (existing) {
      console.log('Content already exists, skipping:', content.source_url)
      return
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
        user_id: '00000000-0000-0000-0000-000000000000', // System user
        likes: 0,
        comments: 0,
        shares: 0,
        is_featured: content.viral_score > 5
      })

    if (error) {
      console.error('Error storing content:', error)
    } else {
      console.log('Stored new content:', content.title)
    }
  } catch (error) {
    console.error('Error in storeDiscoveredContent:', error)
  }
}
