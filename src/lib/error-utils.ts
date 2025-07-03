import axios from 'axios';

/**
 * Extract error message from backend response
 */
export const getBackendErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    // Try to get message from response data
    const responseData = error.response?.data as Record<string, unknown>;
    const backendMessage =
      responseData.message ?? responseData.detail ?? responseData.error;

    if (typeof backendMessage === 'string' && backendMessage) {
      return backendMessage;
    }

    // Fallback to status text
    if (error.response?.statusText) {
      return `${error.response.status}: ${error.response.statusText}`;
    }
  }

  // Fallback to error message or generic message
  return error instanceof Error ? error.message : 'Unknown error occurred';
};
