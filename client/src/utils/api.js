// utils/api.js
import Cookies from 'js-cookie';

/**
 * Highly customizable fetch wrapper with automatic auth headers
 * @param {string} url - The endpoint URL
 * @param {object} options - Configuration options
 * @param {'GET'|'POST'|'PUT'|'DELETE'|'PATCH'} [options.method='GET'] - HTTP method
 * @param {object} [options.body] - Request body (automatically stringified if object)
 * @param {object} [options.headers] - Additional headers
 * @param {boolean} [options.stringifyBody=true] - Whether to JSON.stringify the body
 * @param {boolean} [options.includeAuth=true] - Whether to include auth token
 * @param {boolean} [options.credentials=true] - Whether to include credentials/cookies
 * @param {string} [options.responseType='json'] - Expected response type ('json', 'text', 'blob', etc)
 * @param {number} [options.timeout=8000] - Request timeout in ms
 * @returns {Promise} Resolves with response data or rejects with error
 */
export const customFetch = async (url, {
  method = 'GET',
  body,
  headers = {},
  stringifyBody = true,
  includeAuth = true,
  credentials = true,
  responseType = 'json',
  timeout = 8000,
  ...otherOptions
} = {}) => {
  // Get auth token if needed
  const token = includeAuth ? Cookies.get('accessToken') : null;
  
  // Prepare headers
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
  
  // Prepare body
  let processedBody = body;
  if (body && typeof body === 'object' && stringifyBody) {
    processedBody = JSON.stringify(body);
  }
  
  // Create controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      method,
      headers: {
        ...defaultHeaders,
        ...headers,
      },
      body: processedBody,
      credentials: credentials ? 'include' : 'omit',
      signal: controller.signal,
      ...otherOptions,
    });
    
    clearTimeout(timeoutId);
    
    // Handle error responses
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: `HTTP error! status: ${response.status}` };
      }
      throw errorData;
    }
    
    // Handle different response types
    switch (responseType) {
      case 'json':
        return await response.json();
      case 'text':
        return await response.text();
      case 'blob':
        return await response.blob();
      case 'arrayBuffer':
        return await response.arrayBuffer();
      case 'formData':
        return await response.formData();
      default:
        return response;
    }
  } catch (error) {
    clearTimeout(timeoutId);
    
    // Handle specific error types
    if (error.name === 'AbortError') {
      throw { message: 'Request timeout', isTimeout: true };
    }
    
    throw error;
  }
};