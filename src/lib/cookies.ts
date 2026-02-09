/**
 * Cookie utility functions for managing authentication tokens
 */

export interface CookieOptions {
  expires?: number | Date; // Days or Date object
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

/**
 * Set a cookie with the given name, value, and options
 */
export const setCookie = (
  name: string,
  value: string,
  options: CookieOptions = {}
): void => {
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  // Handle expiration
  if (options.expires) {
    let expires: Date;
    if (typeof options.expires === 'number') {
      expires = new Date();
      expires.setTime(expires.getTime() + options.expires * 24 * 60 * 60 * 1000);
    } else {
      expires = options.expires;
    }
    cookieString += `; expires=${expires.toUTCString()}`;
  }

  // Add path (default to root)
  cookieString += `; path=${options.path || '/'}`;

  // Add domain if specified
  if (options.domain) {
    cookieString += `; domain=${options.domain}`;
  }

  // Add secure flag if specified (should be true in production)
  if (options.secure) {
    cookieString += '; secure';
  }

  // Add SameSite attribute (default to lax)
  cookieString += `; SameSite=${options.sameSite || 'lax'}`;

  document.cookie = cookieString;
};

/**
 * Get a cookie value by name
 */
export const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${encodeURIComponent(name)}=`);
  
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    return cookieValue ? decodeURIComponent(cookieValue) : null;
  }
  
  return null;
};

/**
 * Remove a cookie by name
 */
export const removeCookie = (
  name: string,
  options: Pick<CookieOptions, 'path' | 'domain'> = {}
): void => {
  setCookie(name, '', {
    ...options,
    expires: new Date(0), // Set to past date to delete
  });
};

/**
 * Check if a cookie exists
 */
export const hasCookie = (name: string): boolean => {
  return getCookie(name) !== null;
};

// Token-specific cookie utilities
export const TOKEN_COOKIE_NAME = 'auth_token';

export const setAuthToken = (token: string, remember: boolean = false): void => {
  setCookie(TOKEN_COOKIE_NAME, token, {
    expires: remember ? 30 : undefined, // 30 days if remember, session cookie otherwise
    secure: window.location.protocol === 'https:',
    sameSite: 'lax',
  });
};

export const getAuthToken = (): string | null => {
  return getCookie(TOKEN_COOKIE_NAME);
};

export const removeAuthToken = (): void => {
  removeCookie(TOKEN_COOKIE_NAME);
};
