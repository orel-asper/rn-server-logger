/**
 * List of sensitive parameter names to remove from URLs
 */
const SENSITIVE_PARAMS = [
  'accessToken',
  'access_token',
  'token',
  'apiKey',
  'api_key',
  'password',
  'pwd',
  'secret',
  'auth',
  'authorization',
  'session',
  'sessionId',
  'session_id',
  'key',
  'private',
];

/**
 * Sanitize URL by removing sensitive query parameters
 */
export const sanitizeUrl = (url: string): string => {
  if (!url) return '';

  try {
    const urlObj = new URL(url, 'http://dummy'); // Use dummy base for relative URLs
    const searchParams = urlObj.searchParams;

    // Remove sensitive parameters
    SENSITIVE_PARAMS.forEach(param => {
      if (searchParams.has(param)) {
        searchParams.delete(param);
      }
    });

    // Reconstruct URL
    const sanitizedUrl = url.includes('?')
      ? `${url.split('?')[0]}${searchParams.toString() ? '?' + searchParams.toString() : ''}`
      : url;

    return sanitizedUrl;
  } catch (error) {
    // If URL parsing fails, do basic sanitization
    let sanitized = url;
    SENSITIVE_PARAMS.forEach(param => {
      const regex = new RegExp(`[?&]${param}=[^&]*`, 'gi');
      sanitized = sanitized.replace(regex, '');
    });
    return sanitized;
  }
};

/**
 * Mask sensitive data in JSON strings
 */
export const maskSensitiveData = (data: string, shouldMask: boolean = false): string => {
  if (!shouldMask || !data) return data;

  try {
    const parsed = JSON.parse(data);
    const masked = maskObjectValues(parsed);
    return JSON.stringify(masked, null, 2);
  } catch {
    // If not JSON, return as is
    return data;
  }
};

/**
 * Recursively mask sensitive values in objects
 */
const maskObjectValues = (obj: any): any => {
  if (typeof obj !== 'object' || obj === null) return obj;

  if (Array.isArray(obj)) {
    return obj.map(maskObjectValues);
  }

  const masked: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const lowerKey = key.toLowerCase();
      if (
        lowerKey.includes('password') ||
        lowerKey.includes('token') ||
        lowerKey.includes('secret') ||
        lowerKey.includes('auth') ||
        lowerKey.includes('key')
      ) {
        masked[key] = '***MASKED***';
      } else {
        masked[key] = maskObjectValues(obj[key]);
      }
    }
  }
  return masked;
};

/**
 * Escape special regex characters in search string
 */
export const escapeRegex = (str: string): string => {
  if (!str) return '';
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
