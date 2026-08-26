export type ApiRequest = {
  method?: string;
  endpoint?: string; 
  body?: string | null;
  authorization: string;
};

export type ApiResponse<T> = {
  data?: T;
  status: number;
  error?: ApiError;
};

export type ApiError = {
  message: string;
  status?: number;
  data?: {
    error?: string;
    fields?: Record<string, string>;
    [key: string]: unknown;
  };
};
