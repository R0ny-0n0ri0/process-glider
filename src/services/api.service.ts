
import { toast } from "sonner";

const API_BASE_URL = 'https://localhost:7115/api';

// Generic API request function with error handling
async function apiRequest<T>(
  url: string, 
  method: string = 'GET', 
  data?: any
): Promise<T> {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies if needed
  };

  if (data && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, options);
    
    // Handle non-2xx responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `Error: ${response.status} ${response.statusText}`;
      
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
    
    // For DELETE requests that might not return content
    if (method === 'DELETE') {
      return {} as T;
    }
    
    // Parse JSON response (or return empty object if no content)
    return await response.json().catch(() => ({})) as T;
  } catch (error) {
    console.error('API request failed:', error);
    
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error('Failed to connect to API server');
    }
    
    throw error;
  }
}

export default apiRequest;
