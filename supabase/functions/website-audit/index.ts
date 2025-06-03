
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AuditRequest {
  url: string;
  auditType?: 'full' | 'seo' | 'accessibility' | 'performance';
  maxPages?: number;
}

interface PageResult {
  url: string;
  status: number;
  loadTime: number;
  title: string;
  metaDescription: string;
  headings: Array<{ level: string; text: string }>;
  links: Array<{ url: string; text: string; isInternal: boolean; status?: number }>;
  images: Array<{ url: string; alt: string; hasAlt: boolean }>;
  errors: Array<{ type: string; message: string }>;
  seo: any;
  accessibility: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { url, auditType = 'full', maxPages = 10 } = await req.json() as AuditRequest;
    
    if (!url) {
      throw new Error('URL is required');
    }

    // Normalize URL
    const normalizedUrl = normalizeUrl(url);
    const domain = new URL(normalizedUrl).hostname;

    // Create audit record
    const { data: audit, error: auditError } = await supabaseClient
      .from('site_audits')
      .insert({
        url: normalizedUrl,
        domain,
        audit_type: auditType,
        status: 'running'
      })
      .select()
      .single();

    if (auditError) throw auditError;

    console.log(`Starting audit for ${normalizedUrl}`);

    // Perform the audit
    const auditResults = await performAudit(normalizedUrl, auditType, maxPages);

    // Calculate scores
    const scores = calculateScores(auditResults);

    // Update audit with results
    const { error: updateError } = await supabaseClient
      .from('site_audits')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        results: auditResults,
        summary: auditResults.summary,
        total_pages: auditResults.pages?.length || 0,
        total_errors: auditResults.errors?.length || 0,
        average_load_time: auditResults.summary?.averageLoadTime || 0,
        seo_score: scores.seo,
        accessibility_score: scores.accessibility,
        performance_score: scores.performance
      })
      .eq('id', audit.id);

    if (updateError) throw updateError;

    // Store individual metrics
    if (auditResults.pages) {
      for (const page of auditResults.pages) {
        await storePageMetrics(supabaseClient, audit.id, page);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        auditId: audit.id,
        results: auditResults,
        scores 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Audit error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})

function normalizeUrl(url: string): string {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

async function performAudit(baseUrl: string, auditType: string, maxPages: number) {
  const results = {
    pages: [] as PageResult[],
    errors: [] as Array<{ type: string; message: string; url?: string }>,
    summary: {
      totalPages: 0,
      totalErrors: 0,
      averageLoadTime: 0,
      seoIssues: 0,
      accessibilityIssues: 0
    }
  };

  const visitedPages = new Set<string>();
  const pendingPages = new Set([baseUrl]);

  while (pendingPages.size > 0 && visitedPages.size < maxPages) {
    const currentUrl = Array.from(pendingPages)[0];
    pendingPages.delete(currentUrl);
    
    if (visitedPages.has(currentUrl)) continue;
    
    console.log(`Auditing page: ${currentUrl}`);
    const pageResult = await auditPage(currentUrl, baseUrl, auditType);
    
    if (pageResult) {
      results.pages.push(pageResult);
      visitedPages.add(currentUrl);
      
      // Add internal links to pending queue
      if (auditType === 'full') {
        pageResult.links
          .filter(link => link.isInternal && !visitedPages.has(link.url) && !link.url.includes('#'))
          .forEach(link => pendingPages.add(link.url));
      }
    }

    // Small delay to be respectful
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Calculate summary
  results.summary.totalPages = results.pages.length;
  results.summary.totalErrors = results.errors.length;
  results.summary.averageLoadTime = Math.round(
    results.pages.reduce((sum, page) => sum + page.loadTime, 0) / results.pages.length
  );

  // Count issues
  results.pages.forEach(page => {
    if (page.seo) {
      if (!page.title || page.title.length < 30 || page.title.length > 60) results.summary.seoIssues++;
      if (!page.metaDescription || page.metaDescription.length < 120) results.summary.seoIssues++;
    }
    if (page.accessibility) {
      results.summary.accessibilityIssues += page.images.filter(img => !img.hasAlt).length;
    }
  });

  return results;
}

async function auditPage(url: string, baseUrl: string, auditType: string): Promise<PageResult | null> {
  try {
    const startTime = Date.now();
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'AI-Oopsies-Audit-Bot/1.0'
      }
    });
    const loadTime = Date.now() - startTime;

    if (!response.ok) {
      return {
        url,
        status: response.status,
        loadTime,
        title: '',
        metaDescription: '',
        headings: [],
        links: [],
        images: [],
        errors: [{ type: 'HTTP_ERROR', message: `HTTP ${response.status}` }],
        seo: null,
        accessibility: null
      };
    }

    const html = await response.text();
    return await parseHTML(html, url, baseUrl, loadTime, auditType);

  } catch (error) {
    console.error(`Error auditing ${url}:`, error);
    return null;
  }
}

async function parseHTML(html: string, url: string, baseUrl: string, loadTime: number, auditType: string): Promise<PageResult> {
  // Simple HTML parsing without external dependencies
  const page: PageResult = {
    url,
    status: 200,
    loadTime,
    title: extractTitle(html),
    metaDescription: extractMetaDescription(html),
    headings: extractHeadings(html),
    links: extractLinks(html, url, baseUrl),
    images: extractImages(html, url),
    errors: [],
    seo: null,
    accessibility: null
  };

  if (auditType === 'full' || auditType === 'seo') {
    page.seo = analyzeSEO(page);
  }

  if (auditType === 'full' || auditType === 'accessibility') {
    page.accessibility = analyzeAccessibility(page);
  }

  return page;
}

function extractTitle(html: string): string {
  const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return match ? match[1].trim() : '';
}

function extractMetaDescription(html: string): string {
  const match = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  return match ? match[1].trim() : '';
}

function extractHeadings(html: string): Array<{ level: string; text: string }> {
  const headings: Array<{ level: string; text: string }> = [];
  const headingRegex = /<(h[1-6])[^>]*>([^<]*)<\/h[1-6]>/gi;
  let match;

  while ((match = headingRegex.exec(html)) !== null) {
    headings.push({
      level: match[1].toLowerCase(),
      text: match[2].trim()
    });
  }

  return headings;
}

function extractLinks(html: string, pageUrl: string, baseUrl: string): Array<{ url: string; text: string; isInternal: boolean; status?: number }> {
  const links: Array<{ url: string; text: string; isInternal: boolean }> = [];
  const linkRegex = /<a[^>]*href=["']([^"']*)["'][^>]*>([^<]*)<\/a>/gi;
  let match;

  while ((match = linkRegex.exec(html)) !== null) {
    try {
      const href = match[1];
      const text = match[2].trim();
      
      if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
        const absoluteUrl = new URL(href, pageUrl).href;
        const isInternal = new URL(absoluteUrl).hostname === new URL(baseUrl).hostname;
        
        links.push({
          url: absoluteUrl,
          text,
          isInternal
        });
      }
    } catch (error) {
      // Skip invalid URLs
    }
  }

  return links;
}

function extractImages(html: string, pageUrl: string): Array<{ url: string; alt: string; hasAlt: boolean }> {
  const images: Array<{ url: string; alt: string; hasAlt: boolean }> = [];
  const imageRegex = /<img[^>]*src=["']([^"']*)["'][^>]*(?:alt=["']([^"']*)["'])?[^>]*>/gi;
  let match;

  while ((match = imageRegex.exec(html)) !== null) {
    try {
      const src = match[1];
      const alt = match[2] || '';
      
      if (src) {
        const absoluteUrl = new URL(src, pageUrl).href;
        images.push({
          url: absoluteUrl,
          alt,
          hasAlt: !!alt
        });
      }
    } catch (error) {
      // Skip invalid URLs
    }
  }

  return images;
}

function analyzeSEO(page: PageResult) {
  return {
    title: {
      exists: !!page.title,
      length: page.title.length,
      optimal: page.title.length >= 30 && page.title.length <= 60
    },
    metaDescription: {
      exists: !!page.metaDescription,
      length: page.metaDescription.length,
      optimal: page.metaDescription.length >= 120 && page.metaDescription.length <= 160
    },
    headings: {
      h1Count: page.headings.filter(h => h.level === 'h1').length,
      hasH1: page.headings.some(h => h.level === 'h1')
    },
    images: {
      total: page.images.length,
      withoutAlt: page.images.filter(img => !img.hasAlt).length
    }
  };
}

function analyzeAccessibility(page: PageResult) {
  return {
    images: {
      total: page.images.length,
      missingAlt: page.images.filter(img => !img.hasAlt).length
    },
    headings: {
      hasH1: page.headings.some(h => h.level === 'h1'),
      structure: checkHeadingStructure(page.headings)
    }
  };
}

function checkHeadingStructure(headings: Array<{ level: string; text: string }>): { valid: boolean; issues: string[] } {
  const levels = headings.map(h => parseInt(h.level.charAt(1)));
  const issues: string[] = [];
  
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] > levels[i-1] + 1) {
      issues.push(`Heading level jumps from h${levels[i-1]} to h${levels[i]}`);
    }
  }
  
  return { valid: issues.length === 0, issues };
}

function calculateScores(results: any) {
  let seoScore = 100;
  let accessibilityScore = 100;
  let performanceScore = 100;

  if (results.pages) {
    results.pages.forEach((page: PageResult) => {
      // SEO scoring
      if (page.seo) {
        if (!page.seo.title.optimal) seoScore -= 10;
        if (!page.seo.metaDescription.optimal) seoScore -= 10;
        if (!page.seo.headings.hasH1) seoScore -= 15;
        seoScore -= Math.min(page.seo.images.withoutAlt * 2, 20);
      }

      // Accessibility scoring
      if (page.accessibility) {
        accessibilityScore -= Math.min(page.accessibility.images.missingAlt * 3, 30);
        if (!page.accessibility.headings.hasH1) accessibilityScore -= 10;
      }

      // Performance scoring
      if (page.loadTime > 3000) performanceScore -= 20;
      else if (page.loadTime > 1000) performanceScore -= 10;
    });
  }

  return {
    seo: Math.max(0, seoScore),
    accessibility: Math.max(0, accessibilityScore),
    performance: Math.max(0, performanceScore)
  };
}

async function storePageMetrics(supabaseClient: any, auditId: string, page: PageResult) {
  const metrics = [
    { metric_type: 'load_time', metric_value: page.loadTime, page_url: page.url },
    { metric_type: 'error_count', metric_value: page.errors.length, page_url: page.url }
  ];

  if (page.seo) {
    metrics.push({ metric_type: 'seo', metric_value: page.seo.title.optimal ? 1 : 0, page_url: page.url });
  }

  if (page.accessibility) {
    metrics.push({ 
      metric_type: 'accessibility', 
      metric_value: page.accessibility.images.missingAlt, 
      page_url: page.url 
    });
  }

  for (const metric of metrics) {
    await supabaseClient.from('audit_metrics').insert({
      audit_id: auditId,
      ...metric
    });
  }
}
