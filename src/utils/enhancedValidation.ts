
import { useLinkHealthChecker } from '@/hooks/useLinkHealthChecker';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  linkHealth?: {
    totalLinks: number;
    brokenLinks: number;
    healthyLinks: number;
    details: Array<{
      url: string;
      isHealthy: boolean;
      error?: string;
    }>;
  };
}

// Extract URLs from text content
export const extractUrls = (text: string): string[] => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const matches = text.match(urlRegex);
  return matches || [];
};

// Validate submission content with enhanced link checking
export const validateSubmissionContent = async (
  title: string,
  description: string,
  sourceUrl?: string
): Promise<ValidationResult> => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Basic validation
  if (!title.trim()) {
    errors.push('Title is required');
  } else if (title.length < 10) {
    warnings.push('Title is quite short - consider making it more descriptive');
  } else if (title.length > 100) {
    errors.push('Title is too long (max 100 characters)');
  }

  if (!description.trim()) {
    errors.push('Description is required');
  } else if (description.length < 20) {
    warnings.push('Description is quite short - consider adding more details');
  } else if (description.length > 500) {
    errors.push('Description is too long (max 500 characters)');
  }

  // Extract and validate URLs
  const allText = `${title} ${description} ${sourceUrl || ''}`;
  const extractedUrls = extractUrls(allText);
  
  let linkHealth;
  if (extractedUrls.length > 0) {
    try {
      // Check health of extracted URLs
      const { checkMultipleLinks } = useLinkHealthChecker();
      const healthResults = await checkMultipleLinks(extractedUrls);
      
      const brokenLinks = healthResults.filter(result => !result.isHealthy);
      const healthyLinks = healthResults.filter(result => result.isHealthy);

      linkHealth = {
        totalLinks: extractedUrls.length,
        brokenLinks: brokenLinks.length,
        healthyLinks: healthyLinks.length,
        details: healthResults
      };

      // Add warnings for broken links
      if (brokenLinks.length > 0) {
        warnings.push(`${brokenLinks.length} of ${extractedUrls.length} links appear to be broken or inaccessible`);
        brokenLinks.forEach(link => {
          warnings.push(`Broken link: ${link.url} (${link.error})`);
        });
      }

      // Flag as error if more than half the links are broken
      if (brokenLinks.length > extractedUrls.length / 2) {
        errors.push('Too many broken links detected. Please verify your URLs before submitting.');
      }

    } catch (error) {
      warnings.push('Unable to verify link health - submission will be reviewed manually');
    }
  }

  // Content quality checks
  const suspiciousPatterns = [
    /\b(spam|click here|free money|get rich quick)\b/i,
    /(.)\1{4,}/, // Repeated characters
    /[A-Z]{10,}/, // Excessive caps
  ];

  const hasSuspiciousContent = suspiciousPatterns.some(pattern => 
    pattern.test(title) || pattern.test(description)
  );

  if (hasSuspiciousContent) {
    warnings.push('Content may need manual review due to suspicious patterns');
  }

  // AI fail relevance check (basic keyword matching)
  const aiKeywords = [
    'ai', 'artificial intelligence', 'chatgpt', 'gpt', 'claude', 'dall-e',
    'midjourney', 'copilot', 'bard', 'prompt', 'neural', 'machine learning',
    'algorithm', 'bot', 'automation', 'generated'
  ];

  const hasAIKeywords = aiKeywords.some(keyword => 
    title.toLowerCase().includes(keyword) || description.toLowerCase().includes(keyword)
  );

  if (!hasAIKeywords) {
    warnings.push('Content doesn\'t seem AI-related - please ensure it\'s relevant to AI fails');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    linkHealth
  };
};

// Validate image URLs for accessibility and format
export const validateImageSubmission = async (imageUrl: string): Promise<ValidationResult> => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!imageUrl.trim()) {
    errors.push('Image URL is required');
    return { isValid: false, errors, warnings };
  }

  // Check if URL looks like an image
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const hasImageExtension = imageExtensions.some(ext => 
    imageUrl.toLowerCase().includes(ext)
  );

  if (!hasImageExtension && !imageUrl.includes('imgur') && !imageUrl.includes('discord')) {
    warnings.push('URL doesn\'t appear to be a direct image link');
  }

  // Check image accessibility via link health
  try {
    const { checkLinkHealth } = useLinkHealthChecker();
    const healthResult = await checkLinkHealth(imageUrl);
    
    if (!healthResult.isHealthy) {
      errors.push(`Image URL is not accessible: ${healthResult.error}`);
    }

    if (healthResult.responseTime && healthResult.responseTime > 5000) {
      warnings.push('Image loads slowly - consider using a faster hosting service');
    }

  } catch (error) {
    warnings.push('Unable to verify image accessibility');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Enhanced URL validation for source URLs
export const validateSourceUrl = async (url: string): Promise<ValidationResult> => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!url.trim()) {
    return { isValid: true, errors, warnings }; // Source URL is optional
  }

  // Basic URL format validation
  try {
    new URL(url);
  } catch {
    errors.push('Invalid URL format');
    return { isValid: false, errors, warnings };
  }

  // Check for suspicious domains
  const suspiciousDomains = ['bit.ly', 'tinyurl.com', 'goo.gl'];
  const domain = new URL(url).hostname;
  
  if (suspiciousDomains.some(suspicious => domain.includes(suspicious))) {
    warnings.push('Shortened URLs may be flagged for review');
  }

  // Verify URL accessibility
  try {
    const { checkLinkHealth } = useLinkHealthChecker();
    const healthResult = await checkLinkHealth(url);
    
    if (!healthResult.isHealthy) {
      errors.push(`Source URL is not accessible: ${healthResult.error}`);
    }

  } catch (error) {
    warnings.push('Unable to verify source URL accessibility');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};
