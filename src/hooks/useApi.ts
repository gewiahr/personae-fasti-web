// hooks/useApi.ts
import { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';
import { ApiError } from '../types/api';

type UseApiResponse<T> = {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  //refetch: (newConfig?: Partial<ApiConfig>) => void;
  refetch: (newConfig? : Partial<ApiRequest>) => void;
};

type ApiRequest = {
  method?: string;
  endpoint?: string; 
  body?: string | null;
  accessKey: string;
};

function useApiCore<T = any>(
  config: ApiRequest,
  //config: ApiConfig = { method: 'GET' }, // Default to GET
  skip: boolean = false,
  dependencies: any[] = [],
): UseApiResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchData = useCallback(async (overrideConfig?: Partial<ApiRequest>) => {
    const mergedConfig = { ...config, ...overrideConfig };
  
    if (skip) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await api.fetch<T>(mergedConfig.method || "GET", mergedConfig.endpoint || "/", mergedConfig.accessKey, mergedConfig.body);
      
      if (error) {
        setError(error);
      } else {
        setData(data || null);
      }
    } catch (err) {
      setError({
        message: (err as Error).message || 'Unknown error',
        status: 500
      });
    } finally {
      setLoading(false);
    }
  }, []); //JSON.stringify(config)]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  const refetch = useCallback((newConfig?: Partial<ApiRequest>) => {
    fetchData(newConfig);
  }, [fetchData]);

  return { data, loading, error, refetch };
}

export const useApi = {
  get: <T = any>(
    endpoint: string, 
    accessKey: string, 
    deps: any[] = [],
    skip: boolean = false
  ) => useApiCore<T>({ method: 'GET', endpoint, body: null, accessKey }, skip, deps),
  
  post: <T = any>(
    endpoint: string,
    accessKey: string,
    body?: any,
    deps: any[] = [],
    skip: boolean = false
  ) => useApiCore<T>({ method: 'POST', endpoint, body, accessKey }, skip, deps),
  
  put: <T = any>(
    endpoint: string,
    accessKey: string,
    body?: any,
    deps: any[] = [],
    skip: boolean = false
  ) => useApiCore<T>({ method: 'PUT', endpoint, body, accessKey }, skip, deps),
  
  del: <T = any>(
    endpoint: string,
    accessKey: string,
    deps: any[] = [],
    skip: boolean = false
  ) => useApiCore<T>({ method: 'DELETE', endpoint, body: null, accessKey }, skip, deps),
  
  patch: <T = any>(
    endpoint: string,
    accessKey: string,
    body?: any,
    deps: any[] = [],
    skip: boolean = false
  ) => useApiCore<T>({ method: 'PATCH', endpoint, body, accessKey }, skip, deps)
};