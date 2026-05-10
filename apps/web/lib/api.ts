import { getStoredAccessToken } from "./session";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
  details?: unknown;
};

type ApiRequestOptions = RequestInit & {
  auth?: boolean;
};

export function createApiHeaders(headers: HeadersInit = {}, auth = true) {
  const headerEntries = new Headers(headers);

  if (auth) {
    const accessToken = typeof window !== "undefined" ? getStoredAccessToken() : null;

    if (accessToken && !headerEntries.has("Authorization")) {
      headerEntries.set("Authorization", `Bearer ${accessToken}`);
    }
  }

  if (!headerEntries.has("Content-Type")) {
    headerEntries.set("Content-Type", "application/json");
  }

  return headerEntries;
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}) {
  const { auth = true, headers, ...requestOptions } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: createApiHeaders(headers, auth),
    ...requestOptions
  });

  const body = (await response
    .json()
    .catch(() => ({}))) as ApiResponse<T>;

  if (!response.ok) {
    throw new Error(body.message ?? "Request failed");
  }

  return body;
}