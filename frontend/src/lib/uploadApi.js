import api from './api';

/**
 * Upload single image
 * @param {File} file - Image file to upload
 * @returns {Promise<string>} - Image URL
 */
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data?.data?.url || response.data?.url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Upload multiple images
 * @param {File[]} files - Array of image files to upload
 * @returns {Promise<string[]>} - Array of image URLs
 */
export const uploadMultipleImages = async (files) => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });

  try {
    const response = await api.post('/upload/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data?.data?.urls || response.data?.urls || [];
  } catch (error) {
    console.error('Error uploading images:', error);
    throw error;
  }
};

/**
 * Validate image file before upload
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @param {number} options.maxSize - Max file size in bytes (default: 10MB)
 * @param {string[]} options.allowedTypes - Allowed MIME types
 * @returns {Object} - Validation result { valid: boolean, error: string }
 */
export const validateImageFile = (file, options = {}) => {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  } = options;

  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Please upload an image file.' };
  }

  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
    return { valid: false, error: `File size must not exceed ${maxSizeMB}MB` };
  }

  return { valid: true };
};

export default {
  uploadImage,
  uploadMultipleImages,
  validateImageFile
};
