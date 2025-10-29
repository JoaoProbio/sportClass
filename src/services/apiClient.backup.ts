/**
 * Centralized API client wrapper
 *
 * - Uses `process.env.NEXT_PUBLIC_API_BASE` or falls back to empty string (same-origin).
 * - Allows setting/removing an auth token which will be injected as `Authorization: Bearer ...`.
 * - Normalizes error responses and triggers an optional `onUnauthorized` callback when a 401 is received.
 * - When a 404 is encountered, computes alternative candidate paths derived from the request pathname
 *   (even if the original request was an absolute URL) and attempts them before failing.
 *
 * Usage:
 *   import api, { setAuthToken, setOnUnauthorized, ApiError } from 'src/services/apiClient';
 *   setAuthToken(token);
 *   const data = await api.get('/api/games');
 */

type Maybe<T> = T | null | undefined;

/**
 * If NEXT_PUBLIC_API_BASE is provided, requests will be resolved against it.
 * Otherwise requests are relative to the current origin (same-origin).
 */
const BASE = process.env.NEXT_PUBLIC_API_BASE || "";

/**
 * Enable verbose request/response logging when NEXT_PUBLIC_API_DEBUG=true.
 * This is opt-in and intended for troubleshooting 5xx / network issues.
 */
const DEBUG =
  (process.env.NEXT_PUBLIC_API_DEBUG || "").toLowerCase() === "true";

if (DEBUG) {
  // Avoid revealing secrets; just surface the base URL and env for diagnostics.
  /* eslint-disable no-console */
  console.debug("apiClient debug enabled:", {
    BASE: BASE || "<same-origin>",
    NODE_ENV: process.env.NODE_ENV,
  });
  /* eslint-enable no-console */
}

if (process.env.NODE_ENV === "production" && !BASE) {
  console.warn(
    "Warning: NEXT_PUBLIC_API_BASE is not set in a production environment. " +
      "API requests will be sent to the same origin.",
  );
}

let _token: Maybe<string> = null;
let _onUnauthorized: Maybe<() => void> = null;

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const CONNECTION_ERROR_CODES = [
  "ECONNRESET",
  "ENOTFOUND",
  "ECONNREFUSED",
  "ETIMEDOUT",
];
let _token: Maybe<string> = null;
let _onUnauthorized: Maybe<() => void> = null;

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const CONNECTION_ERROR_CODES = [
  "ECONNRESET",
  "ENOTFOUND",
  "ECONNREFUSED",
  "ETIMEDOUT",
];

/**
 * Public API
 */
export function setAuthToken(token: Maybe<string>) {
  _token = token ?? null;
}
export function setOnUnauthorized(cb: Maybe<() => void>) {
  _onUnauthorized = cb ?? null;
}

/**
 * ApiError is thrown for HTTP errors (status != ok) and for network/fetch failures (status === 0).
 */
export interface ApiError extends Error {
  status: number;
  body: any;
}

/**
 * Build headers. If body is FormData, avoid setting Content-Type so browser sets boundary.
 */
function buildHeaders(
  extra: Record<string, string> = {},
  body?: any,
): Record<string, string> {
  const headers: Record<string, string> = { ...extra };

  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;
  if (!isFormData) {
    if (!Object.keys(headers).some((k) => k.toLowerCase() === "content-type")) {
      headers["Content-Type"] = "application/json";
    }
  } else {
    // Remove content-type if present so browser sets it with boundary
    Object.keys(headers).forEach((k) => {
      if (k.toLowerCase() === "content-type") delete headers[k];
    });
  }

  if (_token) {
    headers["Authorization"] = `Bearer ${_token}`;
  }

  return headers;
}

/**
 * Parse the fetch Response, try to parse JSON but fall back to text.
 * For non-ok responses, throw an ApiError.
 */
async function parseResponse(res: Response) {
  const text = await res.text();
  let body: any = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  if (!res.ok) {
    // Debug/logging: surface server response details to help diagnose 5xx or other errors.
    if (DEBUG) {
      try {
        if (res.status >= 500) {
          // log as error for server-side issues
          console.error("apiClient parseResponse - server error", {
            url: res.url,
            status: res.status,
            statusText: res.statusText,
            body,
          });
        } else {
          // lower-severity non-ok responses
          console.debug("apiClient parseResponse - non-ok response", {
            url: res.url,
            status: res.status,
            statusText: res.statusText,
            body,
          });
        }
      } catch (logErr) {
        // ignore logging errors
      }
    }

    if (res.status === 401 && _onUnauthorized) {
      try {
        _onUnauthorized();
      } catch {
        // ignore errors in the callback
      }
    }

    const err: ApiError = new Error(
      (body && (body.message || body.error)) || res.statusText || "API error",
    ) as ApiError;
    err.status = res.status;
    err.body = body;
    throw err;
  }

  return body;
}

/**
 * Build URL:
 * - If `path` is an absolute URL (http(s)), return as-is.
 * - If BASE is present, append path to BASE (ensuring slashes).
 * - If BASE is empty, ensure path starts with "/" and return relative path for same-origin.
 */
function buildUrl(path: string) {
  const trimmed = String(path || "").trim();
  if (!trimmed) return BASE || "";

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  // If running in the browser, prefer same-origin relative requests for API paths.
  // This avoids the browser performing a cross-origin request to the configured BASE
  // (which can be blocked by CORS). Next.js rewrites (or a same-origin proxy) can
  // forward `/api/...` requests to the remote backend in development.
  if (typeof window !== "undefined" && trimmed.startsWith("/api")) {
    return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  }

  if (BASE) {
    const baseNoTrailing = BASE.replace(/\/+$/, "");
    return `${baseNoTrailing}${trimmed.startsWith("/") ? trimmed : `/${trimmed}`}`;
  }

  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

/**
 * Compute a set of candidate alternative paths when an endpoint returned 404.
 *
 * Important:
 * - If the originalPath is an absolute URL, we derive the pathname+search+hash and compute
 *   alternatives from that, so alternatives are meaningful even for absolute requests.
 * - The returned alternatives are relative paths (starting with '/'), suitable for feeding into buildUrl.
 */
function compute404Alternatives(originalPath: string): string[] {
  if (!originalPath) return [];

  // Extract the pathname/search/hash from originalPath even if it's absolute
  let pathPortion = String(originalPath || "").trim();
  try {
    if (/^https?:\/\//i.test(pathPortion)) {
      // Keep pathname + search + hash
      const parsed = new URL(pathPortion);
      pathPortion = `${parsed.pathname}${parsed.search || ""}${parsed.hash || ""}`;
    }
  } catch {
    // If URL parsing fails, fall back to using the original string
  }

  // Normalize a base form: leading slash, no trailing slash (except root '/')
  if (!pathPortion.startsWith("/")) pathPortion = `/${pathPortion}`;
  if (pathPortion.length > 1 && pathPortion.endsWith("/"))
    pathPortion = pathPortion.slice(0, -1);

  const candidates: string[] = [];

  // If starts with /api, try removing that segment
  if (/^\/api(\/|$)/i.test(pathPortion)) {
    const withoutApi = pathPortion.replace(/^\/api/i, "") || "/";
    candidates.push(withoutApi.startsWith("/") ? withoutApi : `/${withoutApi}`);

    // For auth-related endpoints, try replacing /api with /auth
    if (/^\/api\/auth(\/|$)/i.test(pathPortion)) {
      const authReplace = pathPortion.replace(/^\/api/i, "/auth");
      candidates.push(
        authReplace.startsWith("/") ? authReplace : `/${authReplace}`,
      );
    }

    // Try removing version-ish segment: /api/v1/... -> /v1/...
    const vReplace = pathPortion.replace(/^\/api\/v(\d+)/i, "/v$1");
    if (vReplace !== pathPortion) candidates.push(vReplace);
  } else {
    // If it doesn't start with /api, try adding /api prefix
    candidates.push(`/api${pathPortion}`);
  }

  // Try trailing slash variants
  if (pathPortion.endsWith("/")) {
    candidates.push(path
