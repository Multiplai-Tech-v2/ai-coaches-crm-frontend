/**
 * Global error handler utility
 * Suppresses non-critical errors and provides better error messages
 */

// Store original console.error
const originalConsoleError = console.error;

// Known non-critical error patterns that can be safely ignored
const ignoredErrorPatterns = [
  /Failed to fetch/i, // Network errors from external resources
  /Network request failed/i,
  /Load failed/i,
  /Loading chunk/i, // Dynamic import failures
];

/**
 * Check if an error should be ignored
 */
function shouldIgnoreError(error: any): boolean {
  const errorMessage = error?.toString() || '';
  return ignoredErrorPatterns.some(pattern => pattern.test(errorMessage));
}

/**
 * Initialize the error handler
 * This should be called once when the app starts
 */
export function initErrorHandler() {
  // Only initialize if we're in a browser environment
  if (typeof window === 'undefined') {
    return;
  }

  // Override console.error to filter out known non-critical errors
  console.error = (...args: any[]) => {
    // Check if this is a non-critical error we can ignore
    const shouldIgnore = args.some(arg => shouldIgnoreError(arg));
    
    if (!shouldIgnore) {
      // If it's a real error, log it normally
      originalConsoleError.apply(console, args);
    }
    // Silently ignore non-critical errors (no console.warn spam)
  };

  // Add global error handler for unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    if (shouldIgnoreError(event.reason)) {
      event.preventDefault(); // Prevent the error from appearing in console
    }
  });

  // Add global error handler for resource loading errors
  window.addEventListener('error', (event) => {
    // Check if it's a resource loading error
    if (event.target && event.target !== window) {
      const target = event.target as HTMLElement;
      if (target.tagName === 'IMG' || target.tagName === 'SCRIPT' || target.tagName === 'LINK') {
        // Suppress image/script/stylesheet loading errors
        event.preventDefault();
        return false;
      }
    }
    
    // Check if the error message should be ignored
    if (shouldIgnoreError(event.message || event.error)) {
      event.preventDefault();
      return false;
    }
  }, true); // Use capture phase to catch errors early
}

/**
 * Restore original error handling
 * Useful for testing or debugging
 */
export function restoreErrorHandler() {
  console.error = originalConsoleError;
}