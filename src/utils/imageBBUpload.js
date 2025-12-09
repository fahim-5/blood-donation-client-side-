/**
 * ImageBB Upload Utility
 * Handles image uploads to ImageBB free image hosting service
 */

const IMAGEBB_API_KEY = process.env.REACT_APP_IMAGEBB_API_KEY;
const IMAGEBB_API_URL = 'https://api.imgbb.com/1/upload';

/**
 * Upload image to ImageBB
 * @param {File} imageFile - Image file to upload
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} - Upload response
 */
export const uploadImageToImageBB = async (imageFile, options = {}) => {
  try {
    if (!IMAGEBB_API_KEY) {
      throw new Error('ImageBB API key is not configured');
    }

    if (!imageFile) {
      throw new Error('No image file provided');
    }

    // Validate file size (ImageBB free limit is 32MB)
    const maxSize = options.maxSize || 32 * 1024 * 1024; // 32MB
    if (imageFile.size > maxSize) {
      throw new Error(`File size should be less than ${maxSize / 1024 / 1024}MB`);
    }

    // Validate file type
    const allowedTypes = options.allowedTypes || [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/webp',
    ];
    
    if (!allowedTypes.includes(imageFile.type)) {
      throw new Error(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
    }

    // Create form data
    const formData = new FormData();
    formData.append('key', IMAGEBB_API_KEY);
    formData.append('image', imageFile);

    // Add optional parameters
    if (options.name) {
      formData.append('name', options.name);
    }

    if (options.expiration) {
      formData.append('expiration', options.expiration); // in seconds
    }

    // Make API request
    const response = await fetch(IMAGEBB_API_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `Upload failed with status ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error?.message || 'Upload failed');
    }

    return {
      success: true,
      data: {
        id: data.data.id,
        url: data.data.url,
        display_url: data.data.display_url,
        thumb: data.data.thumb?.url,
        delete_url: data.data.delete_url,
        size: data.data.size,
        width: data.data.width,
        height: data.data.height,
        expiration: data.data.expiration,
        filename: imageFile.name,
        uploadedAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error('ImageBB Upload Error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Upload multiple images to ImageBB
 * @param {Array<File>} imageFiles - Array of image files
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} - Upload results
 */
export const uploadMultipleImagesToImageBB = async (imageFiles, options = {}) => {
  try {
    if (!Array.isArray(imageFiles) || imageFiles.length === 0) {
      throw new Error('No image files provided');
    }

    const results = [];
    const uploadPromises = imageFiles.map(file => 
      uploadImageToImageBB(file, options)
    );

    const uploadResults = await Promise.allSettled(uploadPromises);

    uploadResults.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value.success) {
        results.push({
          success: true,
          file: imageFiles[index].name,
          data: result.value.data,
        });
      } else {
        results.push({
          success: false,
          file: imageFiles[index].name,
          error: result.reason?.message || result.value?.error || 'Upload failed',
        });
      }
    });

    const successfulUploads = results.filter(r => r.success);
    const failedUploads = results.filter(r => !r.success);

    return {
      success: successfulUploads.length > 0,
      results,
      successful: successfulUploads,
      failed: failedUploads,
      total: imageFiles.length,
      successfulCount: successfulUploads.length,
      failedCount: failedUploads.length,
    };
  } catch (error) {
    console.error('Multiple ImageBB Upload Error:', error);
    return {
      success: false,
      error: error.message,
      results: [],
      successful: [],
      failed: [],
      total: 0,
      successfulCount: 0,
      failedCount: 0,
    };
  }
};

/**
 * Delete image from ImageBB
 * @param {string} deleteUrl - Delete URL from upload response
 * @returns {Promise<Object>} - Delete response
 */
export const deleteImageFromImageBB = async (deleteUrl) => {
  try {
    if (!deleteUrl) {
      throw new Error('Delete URL is required');
    }

    const response = await fetch(deleteUrl, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Delete failed with status ${response.status}`);
    }

    return {
      success: true,
      message: 'Image deleted successfully',
    };
  } catch (error) {
    console.error('ImageBB Delete Error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Validate image file
 * @param {File} file - Image file to validate
 * @param {Object} options - Validation options
 * @returns {Object} - Validation result
 */
export const validateImageFile = (file, options = {}) => {
  const errors = [];
  const maxSize = options.maxSize || 32 * 1024 * 1024; // 32MB
  const allowedTypes = options.allowedTypes || [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/bmp',
    'image/webp',
  ];

  if (!file) {
    errors.push('No file selected');
    return { isValid: false, errors };
  }

  // Check file size
  if (file.size > maxSize) {
    errors.push(`File size should be less than ${maxSize / 1024 / 1024}MB`);
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Compress image before upload
 * @param {File} imageFile - Original image file
 * @param {Object} options - Compression options
 * @returns {Promise<File>} - Compressed image file
 */
export const compressImage = (imageFile, options = {}) => {
  return new Promise((resolve, reject) => {
    const maxWidth = options.maxWidth || 1200;
    const maxHeight = options.maxHeight || 1200;
    const quality = options.quality || 0.8;
    const outputFormat = options.outputFormat || 'image/jpeg';

    const reader = new FileReader();
    
    reader.onload = (event) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas to Blob conversion failed'));
              return;
            }

            // Create new file from blob
            const compressedFile = new File([blob], imageFile.name, {
              type: outputFormat,
              lastModified: Date.now(),
            });

            resolve(compressedFile);
          },
          outputFormat,
          quality
        );
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = event.target.result;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(imageFile);
  });
};

/**
 * Get image preview URL
 * @param {File} file - Image file
 * @returns {Promise<string>} - Data URL for preview
 */
export const getImagePreview = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (event) => {
      resolve(event.target.result);
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Generate filename for upload
 * @param {string} originalName - Original filename
 * @param {string} prefix - Filename prefix
 * @returns {string} - Generated filename
 */
export const generateFilename = (originalName, prefix = 'avatar') => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop();
  
  return `${prefix}_${timestamp}_${randomString}.${extension}`;
};

/**
 * Calculate image dimensions
 * @param {File} file - Image file
 * @returns {Promise<Object>} - Image dimensions
 */
export const getImageDimensions = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const img = new Image();
      
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
          aspectRatio: img.width / img.height,
        });
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = event.target.result;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Check if ImageBB API is available
 * @returns {Promise<boolean>} - API availability status
 */
export const checkImageBBAvailability = async () => {
  try {
    if (!IMAGEBB_API_KEY) {
      return false;
    }

    // Test with a small image
    const testImage = new Blob([''], { type: 'image/png' });
    const testFile = new File([testImage], 'test.png', { type: 'image/png' });

    const result = await uploadImageToImageBB(testFile, {
      maxSize: 1024, // 1KB
    });

    return result.success;
  } catch (error) {
    console.error('ImageBB Availability Check Error:', error);
    return false;
  }
};

/**
 * Get ImageBB upload limits
 * @returns {Object} - Upload limits
 */
export const getImageBBLimits = () => {
  return {
    maxFileSize: 32 * 1024 * 1024, // 32MB
    allowedFormats: ['jpeg', 'png', 'gif', 'bmp', 'webp'],
    maxExpiration: 15552000, // 180 days in seconds
    maxImagesPerHour: 100, // Free tier limit
  };
};

export default {
  uploadImageToImageBB,
  uploadMultipleImagesToImageBB,
  deleteImageFromImageBB,
  validateImageFile,
  compressImage,
  getImagePreview,
  generateFilename,
  getImageDimensions,
  checkImageBBAvailability,
  getImageBBLimits,
};