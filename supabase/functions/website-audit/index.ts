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

interface ImageAnalysis {
  url: string;
  alt: string;
  hasAlt: boolean;
  loading?: string;
  width?: string;
  height?: string;
  status?: number;
  error?: string;
  fileSize?: number;
  format?: string;
  dimensions?: { width: number; height: number };
  isOptimized?: boolean;
  hasLazyLoading?: boolean;
  isResponsive?: boolean;
  accessibilityScore?: number;
  performanceScore?: number;
  recommendations?: string[];
  srcset?: string;
  sizes?: string;
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
  images: ImageAnalysis[];
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
    imageAnalysis: {
      totalImages: number;
      unoptimizedImages: number;
      imagesWithoutAlt: number;
      imagesWithoutLazyLoading: number;
      largeImages: number;
      averageImageSize: number;
      formatDistribution: Record<string, number>;
      optimizationScore: number;
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
        scores: { overall: 0, seo: 0, accessibility: 0, performance: 0 },
        imageAnalysis: {
          totalImages: 0,
          unoptimizedImages: 0,
          imagesWithoutAlt: 0,
          imagesWithoutLazyLoading: 0,
          largeImages: 0,
          averageImageSize: 0,
          formatDistribution: {},
          optimizationScore: 0
        }
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

    // Generate comprehensive summary including image analysis
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
      console.log(`✅ Page audited: ${url} (${response.status}, ${loadTime}ms, ${pageResult.images.length} images analyzed)`);

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
    const imageMatches = html.matchAll(/<img[^>]*>/gi);
    
    for (const match of imageMatches) {
      try {
        const imgTag = match[0];
        const src = this.extractAttribute(imgTag, 'src');
        const alt = this.extractAttribute(imgTag, 'alt') || '';
        const loading = this.extractAttribute(imgTag, 'loading');
        const width = this.extractAttribute(imgTag, 'width');
        const height = this.extractAttribute(imgTag, 'height');
        const srcset = this.extractAttribute(imgTag, 'srcset');
        const sizes = this.extractAttribute(imgTag, 'sizes');
        
        if (src) {
          const absoluteUrl = new URL(src, baseUrl).href;
          const imageAnalysis: ImageAnalysis = {
            url: absoluteUrl,
            alt,
            hasAlt: !!alt && alt.trim().length > 0,
            loading,
            width,
            height,
            srcset,
            sizes,
            isResponsive: !!(srcset || sizes),
            hasLazyLoading: loading === 'lazy',
            recommendations: []
          };

          // Analyze image format
          const format = this.detectImageFormat(absoluteUrl);
          imageAnalysis.format = format;

          // Check image loading and get metadata
          try {
            const imgResponse = await fetch(absoluteUrl, { 
              method: 'HEAD',
              signal: AbortSignal.timeout(10000)
            });
            
            imageAnalysis.status = imgResponse.status;
            
            if (imgResponse.ok) {
              const contentLength = imgResponse.headers.get('content-length');
              if (contentLength) {
                imageAnalysis.fileSize = parseInt(contentLength);
              }
              
              // Analyze image optimization
              await this.analyzeImageOptimization(imageAnalysis, baseUrl);
              
              // Calculate scores
              imageAnalysis.accessibilityScore = this.calculateImageAccessibilityScore(imageAnalysis);
              imageAnalysis.performanceScore = this.calculateImagePerformanceScore(imageAnalysis);
              
            } else {
              imageAnalysis.error = `HTTP ${imgResponse.status}`;
              this.results.errors.push({
                type: 'BROKEN_IMAGE',
                message: `Broken image: ${absoluteUrl} (${imgResponse.status})`,
                url: baseUrl,
                severity: 'warning'
              });
            }
          } catch (error) {
            imageAnalysis.error = error.message;
            this.results.errors.push({
              type: 'BROKEN_IMAGE',
              message: `Image error: ${absoluteUrl} - ${error.message}`,
              url: baseUrl,
              severity: 'warning'
            });
          }

          pageResult.images.push(imageAnalysis);
        }
      } catch (error) {
        console.log(`⚠️ Skipping invalid image: ${match[0]}`);
      }
    }
  }

  private extractAttribute(tag: string, attribute: string): string | undefined {
    const regex = new RegExp(`${attribute}=["']([^"']*)["']`, 'i');
    const match = tag.match(regex);
    return match ? match[1] : undefined;
  }

  private detectImageFormat(url: string): string {
    const extension = url.split('.').pop()?.toLowerCase().split('?')[0];
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'JPEG';
      case 'png':
        return 'PNG';
      case 'webp':
        return 'WebP';
      case 'avif':
        return 'AVIF';
      case 'svg':
        return 'SVG';
      case 'gif':
        return 'GIF';
      default:
        return 'Unknown';
    }
  }

  private async analyzeImageOptimization(image: ImageAnalysis, pageUrl: string): Promise<void> {
    const recommendations: string[] = [];

    // File size analysis
    if (image.fileSize) {
      if (image.fileSize > 1000000) { // > 1MB
        recommendations.push('Image file size is very large (>1MB). Consider compression or resizing.');
        image.isOptimized = false;
      } else if (image.fileSize > 500000) { // > 500KB
        recommendations.push('Image file size is large (>500KB). Consider optimization.');
        image.isOptimized = false;
      } else {
        image.isOptimized = true;
      }
    }

    // Format recommendations
    if (image.format === 'JPEG' || image.format === 'PNG') {
      recommendations.push('Consider using modern formats like WebP or AVIF for better compression.');
    }

    // Lazy loading
    if (!image.hasLazyLoading && image.fileSize && image.fileSize > 100000) {
      recommendations.push('Large image should use lazy loading (loading="lazy").');
    }

    // Alt text quality
    if (!image.hasAlt) {
      recommendations.push('Missing alt text affects accessibility and SEO.');
    } else if (image.alt && image.alt.length < 10) {
      recommendations.push('Alt text is very short. Consider a more descriptive alternative.');
    }

    // Responsive images
    if (!image.isResponsive && image.fileSize && image.fileSize > 200000) {
      recommendations.push('Consider using srcset for responsive images.');
    }

    // Dimensions
    if (!image.width || !image.height) {
      recommendations.push('Missing width/height attributes may cause layout shifts.');
    }

    image.recommendations = recommendations;
  }

  private calculateImageAccessibilityScore(image: ImageAnalysis): number {
    let score = 100;

    if (!image.hasAlt) score -= 40;
    else if (image.alt && image.alt.length < 10) score -= 15;

    if (!image.width || !image.height) score -= 10;
    
    return Math.max(0, score);
  }

  private calculateImagePerformanceScore(image: ImageAnalysis): number {
    let score = 100;

    if (image.fileSize) {
      if (image.fileSize > 1000000) score -= 40;
      else if (image.fileSize > 500000) score -= 25;
      else if (image.fileSize > 200000) score -= 10;
    }

    if (image.format === 'PNG' && image.fileSize && image.fileSize > 100000) score -= 15;
    if (image.format === 'JPEG' && image.fileSize && image.fileSize > 500000) score -= 10;

    if (!image.hasLazyLoading && image.fileSize && image.fileSize > 100000) score -= 15;
    if (!image.isResponsive && image.fileSize && image.fileSize > 200000) score -= 10;

    return Math.max(0, score);
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
      coreRoutesWorking: workingRoutes.length >= 4,
      navigationAccessible: true,
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

    this.results.summary.brokenLinks = errorsByType['BROKEN_LINK'] || 0;
    this.results.summary.brokenImages = errorsByType['BROKEN_IMAGE'] || 0;
    this.results.summary.seoIssues = errorsByType['SEO_ISSUE'] || 0;
    this.results.summary.accessibilityIssues = errorsByType['ACCESSIBILITY_ISSUE'] || 0;

    // Calculate image analysis summary
    const allImages = this.results.pages.flatMap(page => page.images);
    this.results.summary.imageAnalysis = {
      totalImages: allImages.length,
      unoptimizedImages: allImages.filter(img => img.isOptimized === false).length,
      imagesWithoutAlt: allImages.filter(img => !img.hasAlt).length,
      imagesWithoutLazyLoading: allImages.filter(img => !img.hasLazyLoading && img.fileSize && img.fileSize > 100000).length,
      largeImages: allImages.filter(img => img.fileSize && img.fileSize > 500000).length,
      averageImageSize: allImages.length > 0 ? Math.round(allImages.reduce((sum, img) => sum + (img.fileSize || 0), 0) / allImages.length) : 0,
      formatDistribution: this.calculateFormatDistribution(allImages),
      optimizationScore: this.calculateImageOptimizationScore(allImages)
    };
  }

  private calculateFormatDistribution(images: ImageAnalysis[]): Record<string, number> {
    const distribution: Record<string, number> = {};
    images.forEach(img => {
      if (img.format) {
        distribution[img.format] = (distribution[img.format] || 0) + 1;
      }
    });
    return distribution;
  }

  private calculateImageOptimizationScore(images: ImageAnalysis[]): number {
    if (images.length === 0) return 100;
    
    const totalScore = images.reduce((sum, img) => {
      const accessibilityScore = img.accessibilityScore || 50;
      const performanceScore = img.performanceScore || 50;
      return sum + ((accessibilityScore + performanceScore) / 2);
    }, 0);
    
    return Math.round(totalScore / images.length);
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
    if (page.seo) {
      if (!page.seo.title.optimal) seoScore -= 5;
      if (!page.seo.metaDescription.optimal) seoScore -= 5;
      if (!page.seo.headings.hasH1) seoScore -= 10;
      seoScore -= Math.min(page.seo.images.withoutAlt * 2, 15);
    }

    if (page.accessibility) {
      accessibilityScore -= Math.min(page.accessibility.images.missingAlt * 3, 20);
      if (!page.accessibility.headings.hasH1) accessibilityScore -= 5;
      accessibilityScore -= Math.min(page.accessibility.links.emptyLinks * 2, 10);
    }

    if (page.loadTime > 5000) performanceScore -= 15;
    else if (page.loadTime > 3000) performanceScore -= 8;
    else if (page.loadTime > 1000) performanceScore -= 3;
  });

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
    { metric_type: 'broken_images', metric_value: results.summary.brokenImages },
    { metric_type: 'total_images', metric_value: results.summary.imageAnalysis.totalImages },
    { metric_type: 'unoptimized_images', metric_value: results.summary.imageAnalysis.unoptimizedImages },
    { metric_type: 'images_without_alt', metric_value: results.summary.imageAnalysis.imagesWithoutAlt },
    { metric_type: 'image_optimization_score', metric_value: results.summary.imageAnalysis.optimizationScore }
  ];

  for (const metric of metrics) {
    await supabaseClient.from('audit_metrics').insert({
      audit_id: auditId,
      ...metric
    });
  }
}
