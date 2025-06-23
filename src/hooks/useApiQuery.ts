import { useState, useEffect, useCallback, useRef } from "react";
import { apiClient, ApiError } from "@/lib/api-client";
import { ApiResponse, PaginatedResponse } from "@/lib/schemas";

// Cache for storing query results
const queryCache = new Map<
  string,
  { data: any; timestamp: number; ttl: number }
>();

interface UseApiQueryOptions<T> {
  enabled?: boolean;
  staleTime?: number; // Cache duration in ms
  refetchOnWindowFocus?: boolean;
  retry?: number;
  retryDelay?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
}

interface UseApiQueryResult<T> {
  data: T | null;
  isLoading: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
  isValidating: boolean;
}

export function useApiQuery<T>(
  queryKey: string[],
  queryFn: () => Promise<ApiResponse<T>>,
  options: UseApiQueryOptions<T> = {}
): UseApiQueryResult<T> {
  const {
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes default
    refetchOnWindowFocus = true,
    retry = 3,
    retryDelay = 1000,
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const retryCountRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const cacheKey = queryKey.join(":");

  // Get cached data
  const getCachedData = useCallback((): T | null => {
    const cached = queryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    return null;
  }, [cacheKey]);

  // Set cached data
  const setCachedData = useCallback(
    (newData: T) => {
      queryCache.set(cacheKey, {
        data: newData,
        timestamp: Date.now(),
        ttl: staleTime,
      });
    },
    [cacheKey, staleTime]
  );

  const executeQuery = useCallback(
    async (isRefetch = false) => {
      if (!enabled) return;

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      // Check cache first (unless it's a refetch)
      if (!isRefetch) {
        const cachedData = getCachedData();
        if (cachedData) {
          setData(cachedData);
          setIsLoading(false);
          setError(null);
          return;
        }
      }

      setIsValidating(true);
      if (!isRefetch) {
        setIsLoading(true);
      }
      setError(null);

      try {
        const result = await queryFn();

        if (result.success && result.data) {
          setData(result.data);
          setCachedData(result.data);
          retryCountRef.current = 0;
          onSuccess?.(result.data);
        } else {
          throw new ApiError(result.error || "Unbekannter Fehler");
        }
      } catch (err) {
        const apiError =
          err instanceof ApiError ? err : new ApiError("Unbekannter Fehler");

        // Retry logic
        if (retryCountRef.current < retry) {
          retryCountRef.current++;
          setTimeout(() => {
            executeQuery(isRefetch);
          }, retryDelay * retryCountRef.current);
          return;
        }

        setError(apiError);
        onError?.(apiError);
      } finally {
        setIsLoading(false);
        setIsValidating(false);
      }
    },
    [
      enabled,
      queryFn,
      getCachedData,
      setCachedData,
      retry,
      retryDelay,
      onSuccess,
      onError,
    ]
  );

  const refetch = useCallback(async () => {
    retryCountRef.current = 0;
    await executeQuery(true);
  }, [executeQuery]);

  // Initial load
  useEffect(() => {
    executeQuery();
  }, [executeQuery]);

  // Refetch on window focus
  useEffect(() => {
    if (!refetchOnWindowFocus) return;

    const handleFocus = () => {
      if (document.visibilityState === "visible") {
        refetch();
      }
    };

    document.addEventListener("visibilitychange", handleFocus);
    return () => document.removeEventListener("visibilitychange", handleFocus);
  }, [refetchOnWindowFocus, refetch]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch,
    isValidating,
  };
}

// Mutation hook for create/update/delete operations
interface UseApiMutationOptions<TData, TVariables> {
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: ApiError, variables: TVariables) => void;
  onSettled?: (
    data: TData | null,
    error: ApiError | null,
    variables: TVariables
  ) => void;
}

interface UseApiMutationResult<TData, TVariables> {
  mutate: (variables: TVariables) => Promise<void>;
  data: TData | null;
  error: ApiError | null;
  isLoading: boolean;
  reset: () => void;
}

export function useApiMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>,
  options: UseApiMutationOptions<TData, TVariables> = {}
): UseApiMutationResult<TData, TVariables> {
  const { onSuccess, onError, onSettled } = options;

  const [data, setData] = useState<TData | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const mutate = useCallback(
    async (variables: TVariables) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await mutationFn(variables);

        if (result.success && result.data) {
          setData(result.data);
          onSuccess?.(result.data, variables);
        } else {
          throw new ApiError(result.error || "Unbekannter Fehler");
        }
      } catch (err) {
        const apiError =
          err instanceof ApiError ? err : new ApiError("Unbekannter Fehler");
        setError(apiError);
        onError?.(apiError, variables);
      } finally {
        setIsLoading(false);
        onSettled?.(data, error, variables);
      }
    },
    [mutationFn, onSuccess, onError, onSettled]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    mutate,
    data,
    error,
    isLoading,
    reset,
  };
}

// Paginated query hook
export function useApiPaginatedQuery<T>(
  queryKey: string[],
  queryFn: (page: number, limit: number) => Promise<PaginatedResponse<T>>,
  options: {
    enabled?: boolean;
    staleTime?: number;
    refetchOnWindowFocus?: boolean;
    retry?: number;
    retryDelay?: number;
    initialPage?: number;
    pageSize?: number;
    onSuccess?: (data: PaginatedResponse<T>) => void;
    onError?: (error: ApiError) => void;
  } = {}
): {
  data: PaginatedResponse<T> | null;
  isLoading: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
  isValidating: boolean;
  nextPage: () => void;
  previousPage: () => void;
  goToPage: (page: number) => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPage: number;
} {
  const { initialPage = 1, pageSize = 10, ...queryOptions } = options;
  const [currentPage, setCurrentPage] = useState(initialPage);

  const paginatedQueryFn = useCallback(
    () =>
      queryFn(currentPage, pageSize).then(
        (response) =>
          ({
            data: response,
            error: null,
            success: true,
          } as ApiResponse<PaginatedResponse<T>>)
      ),
    [queryFn, currentPage, pageSize]
  );

  const result = useApiQuery<PaginatedResponse<T>>(
    [...queryKey, `page:${currentPage}`, `limit:${pageSize}`],
    paginatedQueryFn,
    queryOptions
  );

  const nextPage = useCallback(() => {
    if (
      result.data?.pagination &&
      currentPage < result.data.pagination.totalPages
    ) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [result.data?.pagination, currentPage]);

  const previousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentPage]);

  const goToPage = useCallback(
    (page: number) => {
      if (
        page >= 1 &&
        result.data?.pagination &&
        page <= result.data.pagination.totalPages
      ) {
        setCurrentPage(page);
      }
    },
    [result.data?.pagination]
  );

  const hasNextPage = result.data?.pagination
    ? currentPage < result.data.pagination.totalPages
    : false;
  const hasPreviousPage = currentPage > 1;

  return {
    ...result,
    nextPage,
    previousPage,
    goToPage,
    hasNextPage,
    hasPreviousPage,
    currentPage,
  };
}

// Utility to invalidate cache
export function invalidateQuery(queryKey: string[]) {
  const cacheKey = queryKey.join(":");
  queryCache.delete(cacheKey);
}

// Utility to clear all cache
export function clearQueryCache() {
  queryCache.clear();
}
