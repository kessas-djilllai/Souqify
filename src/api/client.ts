const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * A basic API client designed to communicate with your existing PHP backend.
 * It automatically handles JSON parsing and standard headers.
 */
export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Ensure endpoints start with a slash if not provided
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${path}`;

  const headers: Record<string, string> = {
    'Accept': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  // If using JSON, set Content-Type
  if (options.body && typeof options.body === 'string' && !headers['Content-Type']) {
     headers['Content-Type'] = 'application/json';
  }

  // If you use a token-based authentication (like JWT or sanctum), include it here
  const token = localStorage.getItem('auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = 'API request failed';
    try {
      const errorData = await response.json();
      errorMsg = errorData.message || errorMsg;
    } catch (e) {
      // Not JSON
    }
    throw new Error(errorMsg);
  }

  return response.json();
}
