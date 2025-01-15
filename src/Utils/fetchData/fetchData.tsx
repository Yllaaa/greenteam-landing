/* eslint-disable @typescript-eslint/no-explicit-any */

export interface FetchDataResponse<T> {
  data: T | null;
  error: string | null;
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface FetchDataParams {
  endpoint: string;
  method?: HttpMethod;
  body?: Record<string, any>;
}

export async function fetchData<T>({
  endpoint,
  method = "GET",
  body,
}: FetchDataParams): Promise<FetchDataResponse<T>> {
  try {
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
      options.body = JSON.stringify(body);
    }

    const res = await fetch(`${endpoint}`, {
      ...options,
      cache: "no-store",
    });

    if (!res.ok) throw new Error(`Failed to ${method} data`);

    const data = await res.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error: (error as Error).message };
  }
}
