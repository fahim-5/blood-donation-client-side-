import { useState, useCallback } from 'react';
import imageBBUpload from '../utils/imageBBUpload';

const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);

  const uploadImage = useCallback(async (imageFile, options = {}) => {
    try {
      setUploading(true);
      setProgress(0);
      setError(null);
      setUploadedImage(null);

      // Validate file
      if (!imageFile) {
        throw new Error('No image file provided');
      }

      // Check file size (default 5MB)
      const maxSize = options.maxSize || 5 * 1024 * 1024;
      if (imageFile.size > maxSize) {
        throw new Error(`File size should be less than ${maxSize / 1024 / 1024}MB`);
      }

      // Check file type
      const allowedTypes = options.allowedTypes || ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(imageFile.type)) {
        throw new Error(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
      }

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Upload to ImageBB
      const uploadResult = await imageBBUpload.upload(imageFile, options);
      
      clearInterval(progressInterval);
      setProgress(100);

      if (uploadResult.success) {
        const imageData = {
          url: uploadResult.data.url,
          display_url: uploadResult.data.display_url,
          thumb: uploadResult.data.thumb?.url,
          delete_url: uploadResult.data.delete_url,
          filename: imageFile.name,
          size: imageFile.size,
          type: imageFile.type,
          uploadedAt: new Date().toISOString()
        };

        setUploadedImage(imageData);
        
        // Reset progress after success
        setTimeout(() => setProgress(0), 1000);
        
        return {
          success: true,
          data: imageData
        };
      } else {
        throw new Error(uploadResult.message || 'Upload failed');
      }
    } catch (err) {
      setError(err.message);
      setProgress(0);
      return {
        success: false,
        error: err.message
      };
    } finally {
      setUploading(false);
    }
  }, []);

  const uploadMultiple = useCallback(async (imageFiles, options = {}) => {
    try {
      setUploading(true);
      setProgress(0);
      setError(null);

      if (!Array.isArray(imageFiles) || imageFiles.length === 0) {
        throw new Error('No image files provided');
      }

      const results = [];
      const totalFiles = imageFiles.length;
      let completed = 0;

      for (const file of imageFiles) {
        try {
          const result = await uploadImage(file, options);
          if (result.success) {
            results.push(result.data);
          } else {
            results.push({ error: result.error, file: file.name });
          }
        } catch (err) {
          results.push({ error: err.message, file: file.name });
        }

        completed++;
        setProgress(Math.round((completed / totalFiles) * 100));
      }

      const successfulUploads = results.filter(r => !r.error);
      setUploadedImage(successfulUploads.length > 0 ? successfulUploads[0] : null);

      return {
        success: successfulUploads.length > 0,
        data: results,
        successful: successfulUploads,
        failed: results.filter(r => r.error)
      };
    } catch (err) {
      setError(err.message);
      return {
        success: false,
        error: err.message
      };
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  }, [uploadImage]);

  const validateImage = useCallback((file, options = {}) => {
    const errors = [];

    // Check if file exists
    if (!file) {
      errors.push('No file selected');
      return { isValid: false, errors };
    }

    // Check file size
    const maxSize = options.maxSize || 5 * 1024 * 1024;
    if (file.size > maxSize) {
      errors.push(`File size should be less than ${maxSize / 1024 / 1024}MB`);
    }

    // Check file type
    const allowedTypes = options.allowedTypes || ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      errors.push(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
    }

    // Check dimensions if needed
    if (options.minWidth || options.minHeight || options.maxWidth || options.maxHeight) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          if (options.minWidth && img.width < options.minWidth) {
            errors.push(`Image width should be at least ${options.minWidth}px`);
          }
          if (options.minHeight && img.height < options.minHeight) {
            errors.push(`Image height should be at least ${options.minHeight}px`);
          }
          if (options.maxWidth && img.width > options.maxWidth) {
            errors.push(`Image width should be at most ${options.maxWidth}px`);
          }
          if (options.maxHeight && img.height > options.maxHeight) {
            errors.push(`Image height should be at most ${options.maxHeight}px`);
          }
          resolve({ isValid: errors.length === 0, errors, dimensions: { width: img.width, height: img.height } });
        };
        img.onerror = () => {
          errors.push('Invalid image file');
          resolve({ isValid: false, errors });
        };
        img.src = URL.createObjectURL(file);
      });
    }

    return Promise.resolve({ isValid: errors.length === 0, errors });
  }, []);

  const compressImage = useCallback((file, options = {}) => {
    return new Promise((resolve, reject) => {
      const maxWidth = options.maxWidth || 1200;
      const maxHeight = options.maxHeight || 1200;
      const quality = options.quality || 0.8;
      const outputFormat = options.outputFormat || 'image/jpeg';

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
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

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Canvas to Blob conversion failed'));
                return;
              }

              const compressedFile = new File([blob], file.name, {
                type: outputFormat,
                lastModified: Date.now()
              });

              resolve(compressedFile);
            },
            outputFormat,
            quality
          );
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }, []);

  const getImagePreview = useCallback((file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('No file provided'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const reset = useCallback(() => {
    setUploading(false);
    setProgress(0);
    setError(null);
    setUploadedImage(null);
  }, []);

  return {
    // State
    uploading,
    progress,
    error,
    uploadedImage,
    
    // Methods
    uploadImage,
    uploadMultiple,
    validateImage,
    compressImage,
    getImagePreview,
    reset,
    
    // Helpers
    isUploading: uploading,
    hasError: !!error,
    hasImage: !!uploadedImage
  };
};

export default useImageUpload;