const DEFAULT_HEADERS: HeadersInit = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

const resolveBaseUrl = () => {
  if (typeof process !== 'undefined' && process.env.REACT_APP_API_BASE_URL) {
    return process.env.REACT_APP_API_BASE_URL.replace(/\/$/, '');
  }

  if (typeof window !== 'undefined') {
    const runtimeBaseUrl = (window as any).__API_BASE_URL__ as string | undefined;
    if (runtimeBaseUrl) {
      return runtimeBaseUrl.replace(/\/$/, '');
    }
  }

  return 'http://localhost:3000';
};

const API_BASE_URL = resolveBaseUrl();

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

const buildUrl = (path: string, params?: RequestOptions['params']) => {
  const url = new URL(`${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
};

export async function httpRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, ...rest } = options;
  const url = buildUrl(path, params);

  const response = await fetch(url, {
    headers: {
      ...DEFAULT_HEADERS,
      ...headers,
    },
    ...rest,
  });

  if (!response.ok) {
    const errorBody = await safeParseJSON(response);
    const error = new Error(errorBody?.message || 'Request failed');
    (error as any).status = response.status;
    (error as any).details = errorBody;
    throw error;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

async function safeParseJSON(response: Response) {
  try {
    return await response.json();
  } catch (error) {
    return undefined;
  }
}

export { API_BASE_URL };
