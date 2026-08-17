const API_BASE_URL = 'http://127.0.0.1:8000';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>;
}

export async function request<T = any>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('balingasag_session_token');
  const userId = localStorage.getItem('balingasag_session_user_id');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (userId) {
    headers['X-Session-Id'] = userId;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const data = await res.json();
    if (!res.ok && data.success === undefined) {
      return {
        success: false,
        message: data.message || `HTTP Error ${res.status}: ${res.statusText}`,
      };
    }
    return data;
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Unable to connect to the backend library API server.',
    };
  }
}
