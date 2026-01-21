// API Configuration - uses environment variable with fallback
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:3000/v1";

// Store API URL with token to detect environment changes
const TOKEN_API_URL_KEY = "authTokenApiUrl";

/**
 * Clear auth tokens if API URL has changed (switching environments)
 */
const checkAndClearTokensIfNeeded = () => {
  const storedApiUrl = localStorage.getItem(TOKEN_API_URL_KEY);
  if (storedApiUrl && storedApiUrl !== API_BASE_URL) {
    // API URL changed, clear old tokens
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.setItem(TOKEN_API_URL_KEY, API_BASE_URL);
  } else if (!storedApiUrl) {
    // First time, store current API URL
    localStorage.setItem(TOKEN_API_URL_KEY, API_BASE_URL);
  }
};

// Check on module load
checkAndClearTokensIfNeeded();

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Get auth token from localStorage if available
  const token = localStorage.getItem("authToken");
  if (token) {
    defaultHeaders["Authorization"] = token;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    // Check if response is JSON before parsing
    const contentType = response.headers.get("content-type");
    let data;
    
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      // If response is not JSON (e.g., HTML error page), return a generic error
      const text = await response.text();
      return {
        error: response.status === 400 ? "Please enter a valid email" : "Something went wrong. Please try again.",
        status: response.status,
      };
    }

    if (!response.ok) {
      // Handle 401 Unauthorized - token is invalid, clear it
      if (response.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        // Optionally trigger sign out in auth context
        window.dispatchEvent(new CustomEvent("auth:unauthorized"));
      }
      
      return {
        error: data.message || (response.status === 400 ? "Please enter a valid email" : "Something went wrong"),
        status: response.status,
      };
    }

    return {
      data,
      status: response.status,
    };
  } catch (error) {
    // Handle JSON parse errors and other network errors
    if (error instanceof SyntaxError && error.message.includes("JSON")) {
      return {
        error: "Please enter a valid email",
        status: 400,
      };
    }
    return {
      error: error instanceof Error ? error.message : "Network error",
      status: 0,
    };
  }
}

/**
 * API request without authentication (for public endpoints)
 */
export async function apiRequestPublic<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    const contentType = response.headers.get("content-type");
    let data;
    
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      return {
        error: "Something went wrong. Please try again.",
        status: response.status,
      };
    }

    if (!response.ok) {
      return {
        error: data.message || "Something went wrong",
        status: response.status,
      };
    }

    return {
      data,
      status: response.status,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Network error",
      status: 0,
    };
  }
}

