
export class DiscoveryError extends Error {
  constructor(
    message: string,
    public code: string,
    public platform?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'DiscoveryError';
  }
}

export class RateLimitError extends DiscoveryError {
  constructor(platform: string, retryAfter?: number) {
    super(`Rate limit exceeded for ${platform}`, 'RATE_LIMIT_EXCEEDED', platform, { retryAfter });
  }
}

export class ValidationError extends DiscoveryError {
  constructor(message: string, field?: string) {
    super(message, 'VALIDATION_ERROR', undefined, { field });
  }
}

export const handleApiError = (error: any, platform: string): DiscoveryError => {
  console.error(`API Error for ${platform}:`, error);

  if (error.status === 429) {
    return new RateLimitError(platform, error.headers?.['retry-after']);
  }

  if (error.status >= 400 && error.status < 500) {
    return new DiscoveryError(
      `Client error for ${platform}: ${error.message}`,
      'CLIENT_ERROR',
      platform,
      { status: error.status }
    );
  }

  if (error.status >= 500) {
    return new DiscoveryError(
      `Server error for ${platform}: ${error.message}`,
      'SERVER_ERROR',
      platform,
      { status: error.status }
    );
  }

  return new DiscoveryError(
    `Unknown error for ${platform}: ${error.message}`,
    'UNKNOWN_ERROR',
    platform
  );
};

export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }

      // Don't retry on validation errors or client errors
      if (error instanceof ValidationError || 
          (error instanceof DiscoveryError && error.code === 'CLIENT_ERROR')) {
        throw error;
      }

      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
};
