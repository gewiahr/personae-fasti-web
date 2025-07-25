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
    body: any,
    imageBody?: boolean
  ): Promise<ApiResponse<T>> => {
    return makeRequest<T>(endpoint, 'POST', accessKey, body, imageBody);
  },

  put: async <T = any>(
    endpoint: string,
    accessKey: string,
    body: any,
    imageBody?: boolean
  ): Promise<ApiResponse<T>> => {
    return makeRequest<T>(endpoint, 'PUT', accessKey, body, imageBody);
  },

  patch: async <T = any>(
    endpoint: string,
    accessKey: string,
    body: any,
    imageBody?: boolean
  ): Promise<ApiResponse<T>> => {
    return makeRequest<T>(endpoint, 'PATCH', accessKey, body, imageBody);
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
    body?: any,
    imageBody?: boolean
  ): Promise<ApiResponse<T>> => {
    return makeRequest<T>(endpoint, method, accessKey, body, imageBody);
  },
};

async function makeRequest<T>(
  endpoint: string,
  method: string,
  accessKey: string,
  body?: any,
  imageBody: boolean = false, 
): Promise<ApiResponse<T>> {
  try {
    //const applicationType = imageBody ? 'multipart/form-data' : 'application/json';
    const headers: Record<string, string> = {
      //'Content-Type': applicationType,
      'AccessKey': accessKey,   
    };
    const response = await fetch(`${config.apiBaseUrl}${endpoint}`, {
      method,
      headers,
      body: !body || method == 'GET' ? null : imageBody ? body : JSON.stringify(body),
    });

    if (!response.ok) {
      let errorData: any;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: await response.text() };
      }
      const error: ApiError = {
        message: errorData.error || 'Request failed',
        status: response.status,
        data: errorData,
      };
      return { status: response.status, error };
    }

    // Handle empty responses for DELETE
    if (method === 'DELETE' && response.status === 204) {
      return { data: undefined as unknown as T, status: response.status };
    }

    const data = await response.json();
    return { data, status: response.status };
  } catch (err) {
    const error: ApiError = {
      message: err instanceof Error ? err.message : 'Unknown error occurred',
    };
    return { error, status: 500 };
  }
}