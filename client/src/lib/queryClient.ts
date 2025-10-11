import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorData;
    try {
      // Try to parse JSON first to get structured error data
      const text = await res.text();
      errorData = JSON.parse(text);
    } catch {
      // Fall back to status text if not JSON
      errorData = { message: res.statusText };
    }
    
    // Create error with structured data
    const error = new Error(`${res.status}: ${errorData.message || res.statusText}`);
    (error as any).response = {
      status: res.status,
      data: errorData
    };
    throw error;
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

export async function apiRequestWithPage(
  method: string,
  url: string,
  options?: {
    params?: Record<string, any>;
    body?: unknown;
  }
): Promise<Response> {
  let finalUrl = url;

  // Handle query params
  if (options?.params) {
    const searchParams = new URLSearchParams();
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    finalUrl += `?${searchParams.toString()}`;
  }

  const res = await fetch(finalUrl, {
    method,
    headers: options?.body ? { "Content-Type": "application/json" } : {},
    body: options?.body ? JSON.stringify(options.body) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res.json();
}


export async function apiRequestJson(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res.json();
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes cache
      gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
      retry: (failureCount, error: any) => {
        // Retry up to 2 times for network errors, but not for 4xx errors
        if (failureCount >= 2) return false;
        if (error?.message?.includes('4')) return false; // Don't retry 4xx errors
        return true;
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    },
    mutations: {
      retry: (failureCount, error: any) => {
        // Only retry mutations for network errors, not validation errors
        if (failureCount >= 1) return false;
        if (error?.message?.includes('4')) return false; // Don't retry 4xx errors
        return true;
      },
    },
  },
});
