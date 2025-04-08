import { useState, useEffect } from 'react';

/**
 * Query result interface
 */
interface QueryResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for data fetching
 * Provides loading, error, and data states for API calls
 */
export function useQuery<T>(
  key: string,
  fetchFn: () => Promise<T>,
  deps: any[] = []
): QueryResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error(`Error fetching data for ${key}:`, err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on mount and when dependencies change
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, ...deps]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
}