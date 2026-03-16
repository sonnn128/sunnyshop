/**
 * Helper utility to handle API error responses
 */

/**
 * Process API response and handle errors
 * @param {Response} response - Fetch API response
 * @returns {Promise<Object>} - JSON response data or error
 */
export const handleApiError = async (response) => {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  
  // Parse response based on content type
  const data = isJson ? await response.json() : await response.text();
  
  if (!response.ok) {
    // Format error message based on response format
    const errorMessage = isJson && data.message 
      ? data.message 
      : (isJson && data.error 
          ? data.error 
          : `Error: ${response.status} ${response.statusText}`);
    
    // Create error object with details
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  
  return data;
};

/**
 * Format validation errors from API
 * @param {Object} error - Error object from API
 * @returns {Object} - Formatted validation errors
 */
export const formatValidationErrors = (error) => {
  if (!error || !error.data || !error.data.errors) {
    return {};
  }
  
  const formattedErrors = {};
  
  error.data.errors.forEach(err => {
    formattedErrors[err.param] = err.msg;
  });
  
  return formattedErrors;
};