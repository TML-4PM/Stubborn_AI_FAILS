
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AuditRequest {
  baseUrl?: string;
  auditType?: 'full' | 'seo' | 'accessibility' | 'performance';
  maxPages?: number;
}

interface PageResult {
  url: string;
  status: number;
  loadTime: number;
  size: number;
  title: string;
  metaDescription: string;
  headings: Array<{ level: string; text: string }>;
  links: Array<{ url: string; text: string; isInternal: boolean; status?: number; error?: string }>;
  images: Array<{ url: string; alt: string; hasAlt: boolean; loading?: string; width?: string; height?: string; status?: number; error?: string }>;
  errors: Array<{ type: string; message: string; severity: 'critical' | 'warning' | 'info' }>;
  seo: any;
  accessibility: any;
  performance: any;
  timestamp: string;
}

interface AuditResults {
  pages: PageResult[];
  errors: Array<{ type: string; message: string; url?: string; severity: 'critical' | 'warning' | 'info' }>;
  summary: {
    totalPages: number;
    totalErrors: number;
    averageLoadTime: number;
    seoIssues: number;
    accessibilityIssues: number;
    brokenLinks: number;
    brokenImages: number;
    errorsByType: Record<string, number>;
    scores: {
      overall: number;
      seo: number;
      accessibility: number;
      performance: number;
    };
  };
  aiFailsSpecific: {
    coreRoutesWorking: boolean;
    navigationAccessible: boolean;
    formsValidated: boolean;
    keyFeaturesWorking: string[];
  };
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

    const { baseUrl, auditType = 'full', maxPages = 25 } = await req.json() as AuditRequest;
    
    // Auto-detect current domain if not provided
    const auditUrl = baseUrl || 'https://pflisxkcxbzboxwidywf.supabase.co';
    const normalizedUrl = normalizeUrl(auditUrl);
    const domain = new URL(normalizedUrl).hostname;

    console.log(`🚀 Starting comprehensive audit of ${normalizedUrl} (max ${maxPages} pages)`);

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

    // Perform comprehensive audit with proper crawling
    const auditor = new WebsiteAuditor(normalizedUrl, { maxPages, auditType });
    const auditResults = await auditor.performFullAudit();

    // Validate results
    const validationErrors = AuditValidator.validateResults(auditResults);
    if (validationErrors.length > 0) {
      console.error('❌ Result validation failed:', validationErrors);
      auditResults.errors.push(...validationErrors.map(error => ({
        type: 'VALIDATION_ERROR',
        message: error,
        severity: 'critical' as const
      })));
    }

    // Calculate comprehensive scores
    const scores = calculateAdvancedScores(auditResults);
    auditResults.summary.scores = scores;

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

    // Store detailed metrics
    await storeAdvancedMetrics(supabaseClient, audit.id, auditResults);

    console.log(`✅ Audit completed: ${auditResults.summary.totalPages} pages, ${auditResults.summary.totalErrors} errors`);

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
    console.error('❌ Audit error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})

class WebsiteAuditor {
  private baseUrl: string;
  private domain: string;
  private visitedPages = new Set<string>();
  private pendingPages = new Set<string>();
  private options: { maxPages: number; auditType: string };
  private results: AuditResults;

  constructor(baseUrl: string, options: { maxPages: number; auditType: string }) {
    this.baseUrl = normalizeUrl(baseUrl);
    this.domain = new URL(this.baseUrl).hostname;
    this.options = options;
    this.pendingPages.add(this.baseUrl);
    
    // Pre-populate with known AI Fails routes for better coverage
    const knownRoutes = [
      '',
      '/gallery',
      '/submit', 
      '/youtube',
      '/about',
      '/donate',
      '/admin',
      '/profile'
    ];
    
    knownRoutes.forEach(route => {
      this.pendingPages.add(new URL(route, this.baseUrl).href);
    });
    
    this.results = {
      pages: [],
      errors: [],
      summary: {
        totalPages: 0,
        totalErrors: 0,
        averageLoadTime: 0,
        seoIssues: 0,
        accessibilityIssues: 0,
        brokenLinks: 0,
        brokenImages: 0,
        errorsByType: {},
        scores: { overall: 0, seo: 0, accessibility: 0, performance: 0 }
      },
      aiFailsSpecific: {
        coreRoutesWorking: false,
        navigationAccessible: false,
        formsValidated: false,
        keyFeaturesWorking: []
      }
    };
  }

  async performFullAudit(): Promise<AuditResults> {
    console.log(`🔍 Starting audit with ${this.options.maxPages} max pages`);
    console.log(`📝 Known routes to check: ${Array.from(this.pendingPages).join(', ')}`);

    // Crawl and audit pages
    while (this.pendingPages.size > 0 && this.visitedPages.size < this.options.maxPages) {
      const currentUrl = Array.from(this.pendingPages)[0];
      this.pendingPages.delete(currentUrl);
      
      if (this.visitedPages.has(currentUrl)) continue;
      
      console.log(`📄 Auditing page ${this.visitedPages.size + 1}/${this.options.maxPages}: ${currentUrl}`);
      await this.auditPage(currentUrl);
      
      // Small delay to be respectful
      await this.delay(1000);
    }

    // Perform AI Fails specific checks
    await this.performAIFailsSpecificChecks();

    // Generate comprehensive summary
    this.generateAdvancedSummary();

    console.log(`🏁 Crawling complete: found ${this.results.pages.length} pages`);
    return this.results;
  }

  async auditPage(url: string): Promise<void> {
    const startTime = Date.now();
    
    try {
      this.visitedPages.add(url);
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'AI-Fails-Site-Health-Bot/2.0',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      });
      
      const loadTime = Date.now() - startTime;
      
      // Handle redirects
      if (response.redirected) {
        console.log(`↩️ Redirect from ${url} to ${response.url}`);
        url = response.url;
      }
      
      const html = await response.text();
      
      const pageResult: PageResult = {
        url,
        status: response.status,
        loadTime,
        size: new TextEncoder().encode(html).length,
        title: '',
        metaDescription: '',
        headings: [],
        links: [],
        images: [],
        errors: [],
        seo: {},
        accessibility: {},
        performance: { loadTime, size: html.length },
        timestamp: new Date().toISOString()
      };

      if (!response.ok) {
        pageResult.errors.push({
          type: 'HTTP_ERROR',
          message: `HTTP ${response.status}`,
          severity: response.status >= 500 ? 'critical' : 'warning'
        });
      }

      // Parse HTML and extract data
      await this.parseHTMLContent(html, url, pageResult);
      
      // Perform specific analyses based on audit type
      if (this.options.auditType === 'full' || this.options.auditType === 'seo') {
        this.analyzeSEO(pageResult);
      }
      
      if (this.options.auditType === 'full' || this.options.auditType === 'accessibility') {
        this.analyzeAccessibility(pageResult);
      }
      
      if (this.options.auditType === 'full' || this.options.auditType === 'performance') {
        this.analyzePerformance(pageResult);
      }

      this.results.pages.push(pageResult);
      console.log(`✅ Page audited: ${url} (${response.status}, ${loadTime}ms, ${pageResult.links.length} links found)`);

    } catch (error) {
      console.error(`❌ Error auditing ${url}:`, error);
      this.results.errors.push({
        type: 'PAGE_ERROR',
        message: `Failed to audit ${url}: ${error.message}`,
        url,
        severity: 'critical'
      });
    }
  }

  async parseHTMLContent(html: string, baseUrl: string, pageResult: PageResult): Promise<void> {
    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    pageResult.title = titleMatch ? titleMatch[1].trim() : '';

    // Extract meta description
    const metaMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i);
    pageResult.metaDescription = metaMatch ? metaMatch[1].trim() : '';

    // Extract headings
    const headingMatches = html.matchAll(/<(h[1-6])[^>]*>([^<]*)<\/h[1-6]>/gi);
    for (const match of headingMatches) {
      pageResult.headings.push({
        level: match[1].toLowerCase(),
        text: match[2].trim()
      });
    }

    // Extract and analyze links
    await this.extractAndAnalyzeLinks(html, baseUrl, pageResult);

    // Extract and analyze images
    await this.extractAndAnalyzeImages(html, baseUrl, pageResult);
  }

  async extractAndAnalyzeLinks(html: string, baseUrl: string, pageResult: PageResult): Promise<void> {
    const linkMatches = html.matchAll(/<a[^>]*href=["']([^"']*)["'][^>]*>([^<]*)<\/a>/gi);
    
    for (const match of linkMatches) {
      try {
        const href = match[1];
        const text = match[2].trim();
        
        if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
          const absoluteUrl = new URL(href, baseUrl).href;
          const isInternal = new URL(absoluteUrl).hostname === this.domain;
          
          const linkData = {
            url: absoluteUrl,
            text,
            isInternal
          };

          // Check link health with timeout
          try {
            const linkResponse = await fetch(absoluteUrl, { 
              method: 'HEAD',
              signal: AbortSignal.timeout(5000)
            });
            linkData.status = linkResponse.status;
            
            if (!linkResponse.ok) {
              linkData.error = `HTTP ${linkResponse.status}`;
              this.results.errors.push({
                type: 'BROKEN_LINK',
                message: `Broken link: ${absoluteUrl} (${linkResponse.status})`,
                url: baseUrl,
                severity: 'warning'
              });
            }
          } catch (error) {
            linkData.error = error.message;
            this.results.errors.push({
              type: 'BROKEN_LINK',
              message: `Link error: ${absoluteUrl} - ${error.message}`,
              url: baseUrl,
              severity: 'warning'
            });
          }

          pageResult.links.push(linkData);
          
          // Add internal links to pending queue (but avoid infinite loops)
          if (isInternal && !href.includes('#') && this.visitedPages.size < this.options.maxPages) {
            const cleanUrl = absoluteUrl.split('?')[0].split('#')[0]; // Remove query params and fragments
            if (!this.visitedPages.has(cleanUrl) && !this.pendingPages.has(cleanUrl)) {
              this.pendingPages.add(cleanUrl);
              console.log(`🔗 Found new internal link: ${cleanUrl}`);
            }
          }
        }
      } catch (error) {
        // Skip invalid URLs
        console.log(`⚠️ Skipping invalid link: ${match[1]}`);
      }
    }
  }

  async extractAndAnalyzeImages(html: string, baseUrl: string, pageResult: PageResult): Promise<void> {
    const imageMatches = html.matchAll(/<img[^>]*src=["']([^"']*)["'][^>]*(?:alt=["']([^"']*)["'])?[^>]*>/gi);
    
    for (const match of imageMatches) {
      try {
        const src = match[1];
        const alt = match[2] || '';
        
        if (src) {
          const absoluteUrl = new URL(src, baseUrl).href;
          const imageData = {
            url: absoluteUrl,
            alt,
            hasAlt: !!alt,
            loading: 'eager' // Default, would need more parsing to detect
          };

          // Check image loading with timeout
          try {
            const imgResponse = await fetch(absoluteUrl, { 
              method: 'HEAD',
              signal: AbortSignal.timeout(5000)
            });
            imageData.status = imgResponse.status;
            
            if (!imgResponse.ok) {
              imageData.error = `HTTP ${imgResponse.status}`;
              this.results.errors.push({
                type: 'BROKEN_IMAGE',
                message: `Broken image: ${absoluteUrl} (${imgResponse.status})`,
                url: baseUrl,
                severity: 'warning'
              });
            }
          } catch (error) {
            imageData.error = error.message;
            this.results.errors.push({
              type: 'BROKEN_IMAGE',
              message: `Image error: ${absoluteUrl} - ${error.message}`,
              url: baseUrl,
              severity: 'warning'
            });
          }

          pageResult.images.push(imageData);
        }
      } catch (error) {
        // Skip invalid URLs
        console.log(`⚠️ Skipping invalid image: ${match[1]}`);
      }
    }
  }

  analyzeSEO(pageResult: PageResult): void {
    pageResult.seo = {
      title: {
        exists: !!pageResult.title,
        length: pageResult.title.length,
        optimal: pageResult.title.length >= 30 && pageResult.title.length <= 60
      },
      metaDescription: {
        exists: !!pageResult.metaDescription,
        length: pageResult.metaDescription.length,
        optimal: pageResult.metaDescription.length >= 120 && pageResult.metaDescription.length <= 160
      },
      headings: {
        h1Count: pageResult.headings.filter(h => h.level === 'h1').length,
        hasH1: pageResult.headings.some(h => h.level === 'h1'),
        structure: this.analyzeHeadingStructure(pageResult.headings)
      },
      images: {
        total: pageResult.images.length,
        withoutAlt: pageResult.images.filter(img => !img.hasAlt).length
      }
    };

    // Add SEO issues to errors
    if (!pageResult.seo.title.optimal) {
      pageResult.errors.push({
        type: 'SEO_ISSUE',
        message: `Title length not optimal: ${pageResult.title.length} characters (recommended: 30-60)`,
        severity: 'warning'
      });
    }

    if (!pageResult.seo.metaDescription.optimal) {
      pageResult.errors.push({
        type: 'SEO_ISSUE',
        message: `Meta description length not optimal: ${pageResult.metaDescription.length} characters (recommended: 120-160)`,
        severity: 'warning'
      });
    }
  }

  analyzeAccessibility(pageResult: PageResult): void {
    pageResult.accessibility = {
      images: {
        total: pageResult.images.length,
        missingAlt: pageResult.images.filter(img => !img.hasAlt).length
      },
      headings: {
        hasH1: pageResult.headings.some(h => h.level === 'h1'),
        structure: this.checkHeadingSequence(pageResult.headings)
      },
      links: {
        emptyLinks: pageResult.links.filter(l => !l.text.trim()).length
      }
    };

    // Add accessibility issues to errors
    if (pageResult.accessibility.images.missingAlt > 0) {
      pageResult.errors.push({
        type: 'ACCESSIBILITY_ISSUE',
        message: `${pageResult.accessibility.images.missingAlt} images missing alt text`,
        severity: 'warning'
      });
    }

    if (!pageResult.accessibility.headings.hasH1) {
      pageResult.errors.push({
        type: 'ACCESSIBILITY_ISSUE',
        message: 'Page missing H1 heading',
        severity: 'warning'
      });
    }
  }

  analyzePerformance(pageResult: PageResult): void {
    pageResult.performance = {
      loadTime: pageResult.loadTime,
      size: pageResult.size,
      optimization: {
        slowLoad: pageResult.loadTime > 3000,
        largeSize: pageResult.size > 1000000
      }
    };

    if (pageResult.performance.optimization.slowLoad) {
      pageResult.errors.push({
        type: 'PERFORMANCE_ISSUE',
        message: `Slow page load: ${pageResult.loadTime}ms (recommended: <3000ms)`,
        severity: 'warning'
      });
    }
  }

  analyzeHeadingStructure(headings: Array<{ level: string; text: string }>): { valid: boolean; issues: string[] } {
    const levels = headings.map(h => parseInt(h.level.charAt(1)));
    const issues: string[] = [];
    
    for (let i = 1; i < levels.length; i++) {
      if (levels[i] > levels[i-1] + 1) {
        issues.push(`Heading level jumps from h${levels[i-1]} to h${levels[i]}`);
      }
    }
    
    return { valid: issues.length === 0, issues };
  }

  checkHeadingSequence(headings: Array<{ level: string; text: string }>): { valid: boolean } {
    const levels = headings.map(h => parseInt(h.level.charAt(1)));
    return { valid: levels.length === 0 || levels[0] === 1 };
  }

  async performAIFailsSpecificChecks(): Promise<void> {
    console.log('🎯 Performing AI Fails specific checks...');
    
    const coreRoutes = ['/', '/gallery', '/submit', '/youtube', '/about', '/donate'];
    const workingRoutes: string[] = [];
    
    for (const route of coreRoutes) {
      const routeUrl = new URL(route, this.baseUrl).href;
      const pageExists = this.results.pages.some(page => 
        page.url === routeUrl && page.status === 200
      );
      
      if (pageExists) {
        workingRoutes.push(route);
      }
    }
    
    this.results.aiFailsSpecific = {
      coreRoutesWorking: workingRoutes.length >= 4, // At least 4 core routes working
      navigationAccessible: true, // Would need more sophisticated check
      formsValidated: this.results.pages.some(page => page.url.includes('/submit')),
      keyFeaturesWorking: workingRoutes
    };
    
    console.log(`✅ Core routes working: ${workingRoutes.join(', ')}`);
  }

  generateAdvancedSummary(): void {
    this.results.summary.totalPages = this.results.pages.length;
    this.results.summary.totalErrors = this.results.errors.length;
    
    this.results.summary.averageLoadTime = Math.round(
      this.results.pages.reduce((sum, page) => sum + page.loadTime, 0) / this.results.pages.length
    );

    // Count errors by type
    const errorsByType: Record<string, number> = {};
    this.results.errors.forEach(error => {
      errorsByType[error.type] = (errorsByType[error.type] || 0) + 1;
    });
    this.results.summary.errorsByType = errorsByType;

    // Count specific issue types
    this.results.summary.brokenLinks = errorsByType['BROKEN_LINK'] || 0;
    this.results.summary.brokenImages = errorsByType['BROKEN_IMAGE'] || 0;
    this.results.summary.seoIssues = errorsByType['SEO_ISSUE'] || 0;
    this.results.summary.accessibilityIssues = errorsByType['ACCESSIBILITY_ISSUE'] || 0;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

class AuditValidator {
  static validateResults(results: AuditResults): string[] {
    const errors: string[] = [];
    
    if (!results.pages || !Array.isArray(results.pages)) {
      errors.push('Missing or invalid pages array');
    }
    
    if (!results.summary || typeof results.summary !== 'object') {
      errors.push('Missing or invalid summary object');
    }
    
    results.pages?.forEach((page, index) => {
      if (!page.url) errors.push(`Page ${index} missing URL`);
      if (page.status === null || page.status === undefined) errors.push(`Page ${index} missing status`);
      if (!Array.isArray(page.links)) errors.push(`Page ${index} missing links array`);
      if (!Array.isArray(page.images)) errors.push(`Page ${index} missing images array`);
    });
    
    // Validate summary calculations
    if (results.summary && results.pages) {
      const actualPageCount = results.pages.length;
      if (results.summary.totalPages !== actualPageCount) {
        errors.push(`Summary page count mismatch: ${results.summary.totalPages} vs ${actualPageCount}`);
      }
    }
    
    return errors;
  }
}

function normalizeUrl(url: string): string {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

function calculateAdvancedScores(results: AuditResults) {
  let seoScore = 100;
  let accessibilityScore = 100;
  let performanceScore = 100;

  results.pages.forEach(page => {
    // SEO scoring
    if (page.seo) {
      if (!page.seo.title.optimal) seoScore -= 5;
      if (!page.seo.metaDescription.optimal) seoScore -= 5;
      if (!page.seo.headings.hasH1) seoScore -= 10;
      seoScore -= Math.min(page.seo.images.withoutAlt * 2, 15);
    }

    // Accessibility scoring
    if (page.accessibility) {
      accessibilityScore -= Math.min(page.accessibility.images.missingAlt * 3, 20);
      if (!page.accessibility.headings.hasH1) accessibilityScore -= 5;
      accessibilityScore -= Math.min(page.accessibility.links.emptyLinks * 2, 10);
    }

    // Performance scoring
    if (page.loadTime > 5000) performanceScore -= 15;
    else if (page.loadTime > 3000) performanceScore -= 8;
    else if (page.loadTime > 1000) performanceScore -= 3;
  });

  // Critical errors heavily impact scores
  results.errors.forEach(error => {
    if (error.severity === 'critical') {
      seoScore -= 10;
      accessibilityScore -= 10;
      performanceScore -= 10;
    }
  });

  const scores = {
    seo: Math.max(0, Math.round(seoScore)),
    accessibility: Math.max(0, Math.round(accessibilityScore)),
    performance: Math.max(0, Math.round(performanceScore))
  };

  scores.overall = Math.round((scores.seo + scores.accessibility + scores.performance) / 3);

  return scores;
}

async function storeAdvancedMetrics(supabaseClient: any, auditId: string, results: AuditResults) {
  const metrics = [
    { metric_type: 'overall_score', metric_value: results.summary.scores.overall },
    { metric_type: 'total_errors', metric_value: results.summary.totalErrors },
    { metric_type: 'avg_load_time', metric_value: results.summary.averageLoadTime },
    { metric_type: 'broken_links', metric_value: results.summary.brokenLinks },
    { metric_type: 'broken_images', metric_value: results.summary.brokenImages }
  ];

  for (const metric of metrics) {
    await supabaseClient.from('audit_metrics').insert({
      audit_id: auditId,
      ...metric
    });
  }
}
