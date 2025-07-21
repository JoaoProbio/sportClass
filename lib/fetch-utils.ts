/**
 * Safe fetch utility with error handling
 */

interface FetchOptions extends RequestInit {
  timeout?: number;
  retries?: number;
}

class FetchError extends Error {
  constructor(
    message: string,
    public status?: number,
    public statusText?: string
  ) {
    super(message);
    this.name = 'FetchError';
  }
}

/**
 * Safe fetch function with timeout and retry logic
 */
export async function safeFetch(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { timeout = 10000, retries = 3, ...fetchOptions } = options;

  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new FetchError(
          `HTTP error! status: ${response.status}`,
          response.status,
          response.statusText
        );
      }

      return response;
    } catch (error) {
      lastError = error as Error;
      
      // If it's the last attempt, throw the error
      if (attempt === retries) {
        break;
      }

      // Wait before retrying (exponential backoff)
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, attempt) * 1000)
      );
    }
  }

  throw new FetchError(
    `Failed to fetch after ${retries + 1} attempts: ${lastError?.message || 'Unknown error'}`
  );
}

/**
 * Fetch JSON data safely
 */
export async function fetchJSON<T = any>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  try {
    const response = await safeFetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    return await response.json();
  } catch (error) {
    console.error('Error fetching JSON:', error);
    throw error;
  }
}

/**
 * Check if the application is online
 */
export function isOnline(): boolean {
  return typeof navigator !== 'undefined' && navigator.onLine;
}

/**
 * Add online/offline event listeners
 */
export function addNetworkListeners(
  onOnline?: () => void,
  onOffline?: () => void
): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handleOnline = () => {
    console.log('Application is back online');
    onOnline?.();
  };

  const handleOffline = () => {
    console.log('Application is offline');
    onOffline?.();
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
} 