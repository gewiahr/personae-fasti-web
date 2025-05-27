import { config } from '../utils/config';
import { ApiResponse, ApiError } from '../types/api';

export const api = {
  get: async <T = any>(
    endpoint: string,
    accessKey: string
  ): Promise<ApiResponse<T>> => {
    return makeRequest<T>(endpoint, 'GET', accessKey);
  },

  post: async <T = any>(
    endpoint: string,
    accessKey: string,
    body: any
  ): Promise<ApiResponse<T>> => {
    return makeRequest<T>(endpoint, 'POST', accessKey, body);
  },

  put: async <T = any>(
    endpoint: string,
    accessKey: string,
    body: any
  ): Promise<ApiResponse<T>> => {
    return makeRequest<T>(endpoint, 'PUT', accessKey, body);
  },

  patch: async <T = any>(
    endpoint: string,
    accessKey: string,
    body: any
  ): Promise<ApiResponse<T>> => {
    return makeRequest<T>(endpoint, 'PATCH', accessKey, body);
  },

  delete: async (
    endpoint: string,
    accessKey: string
  ): Promise<ApiResponse<void>> => {
    return makeRequest<void>(endpoint, 'DELETE', accessKey);
  },

  fetch: async <T = any>(
    method: string,
    endpoint: string,
    accessKey: string,
    body?: any
  ): Promise<ApiResponse<T>> => {
    return makeRequest<T>(endpoint, method, accessKey, body);
  },
};

async function makeRequest<T>(
  endpoint: string,
  method: string,
  accessKey: string,
  body?: any
): Promise<ApiResponse<T>> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'AccessKey': accessKey,
    };
    console.log(`${config.apiBaseUrl}${endpoint}`)
    const response = await fetch(`${config.apiBaseUrl}${endpoint}`, {
      method,
      headers,
      body: !body || method == 'GET' ? null : JSON.stringify(body),
    });

    if (!response.ok) {
      let errorData: any;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: await response.text() };
      }

      const error: ApiError = {
        message: errorData.message || 'Request failed',
        status: response.status,
        data: errorData,
      };
      return { error };
    }

    // Handle empty responses for DELETE
    if (method === 'DELETE' && response.status === 204) {
      return { data: undefined as unknown as T };
    }

    const data = await response.json();
    return { data };
  } catch (err) {
    const error: ApiError = {
      message: err instanceof Error ? err.message : 'Unknown error occurred',
    };
    return { error };
  }
}