import { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';
import type { ApiError } from '../types/api';

type ApiResponse<T> = {
  data: T | null;
  loading: boolean;
  error?: ApiError;
  status: number;
  refetch: (newConfig? : Partial<ApiRequest>) => void;
};

type ApiRequest = {
  method?: string;
  endpoint?: string; 
  body?: string | null;
  authorization: string;
};

function useApiCore<T = any>(
  config: ApiRequest,
  skip: boolean = false,
  dependencies: any[] = [],
): ApiResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<ApiError>();
  const [status, setStatus] = useState<number>(0);

  const fetchData = useCallback(async (overrideConfig?: Partial<ApiRequest>) => {
    const mergedConfig = { ...config, ...overrideConfig };
  
    if (skip) return;
    
    setLoading(true);
    
    try {
      const { data, status, error } = await api.fetch<T>(mergedConfig.method || "GET", mergedConfig.endpoint || "/", mergedConfig.authorization, mergedConfig.body);
      
      if (error) {
        setError(error);
        setStatus(status);
      } else {
        setData(data || null);
        setStatus(status);
      }
    } catch (err) {
      setError({
        message: (err as Error).message || 'Unknown error',
        status: 500
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  const refetch = useCallback((newConfig?: Partial<ApiRequest>) => {
    fetchData(newConfig);
  }, [fetchData]);

  return { data, loading, error, status, refetch };
};

export const useApi = {
  get: <T = any>(
    endpoint: string, 
    authorization: string, 
    deps: any[] = [],
    skip: boolean = false
  ) => useApiCore<T>({ method: 'GET', endpoint, body: null, authorization }, skip, deps),
  
  post: <T = any>(
    endpoint: string,
    authorization: string,
    body?: any,
    deps: any[] = [],
    skip: boolean = false
  ) => useApiCore<T>({ method: 'POST', endpoint, body, authorization }, skip, deps),
  
  put: <T = any>(
    endpoint: string,
    authorization: string,
    body?: any,
    deps: any[] = [],
    skip: boolean = false
  ) => useApiCore<T>({ method: 'PUT', endpoint, body, authorization }, skip, deps),
  
  del: <T = any>(
    endpoint: string,
    authorization: string,
    deps: any[] = [],
    skip: boolean = false
  ) => useApiCore<T>({ method: 'DELETE', endpoint, body: null, authorization }, skip, deps),
  
  patch: <T = any>(
    endpoint: string,
    authorization: string,
    body?: any,
    deps: any[] = [],
    skip: boolean = false
  ) => useApiCore<T>({ method: 'PATCH', endpoint, body, authorization }, skip, deps)
};