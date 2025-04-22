export type ApiResponse<T> = {
  data?: T;
  error?: ApiError;
};

export type ApiError = {
  message: string;
  status?: number;
  data?: any;
};