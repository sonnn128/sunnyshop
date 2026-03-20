import React, { useState, useRef } from 'react';
import { uploadImage, uploadMultipleImages, validateImageFile } ;
import Icon ;
import Button ;

/**
 * ImageUpload Component
 *
 * Props:
 * - multiple: boolean - Allow multiple file selection
 * - value: string | string[] - Current image URL(s)
 * - onChange: (url: string | string[]) => void - Callback when upload completes
 * - onError: (error: string) => void - Callback when error occurs
 * - maxFiles: number - Maximum number of files (for multiple mode)
 * - className: string - Additional CSS classes
 */
const ImageUpload = ({
  multiple = false,
  value,
  onChange,
  onError,
  maxFiles = 5,
  className = ''
}) => {
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState(() => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  });
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Validate files
    const invalidFile = files.find(file => {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        onError?.(validation.error);
        return true;
      }
      return false;
    });

    if (invalidFile) return;

    // Check max files limit
    if (multiple && previews.length + files.length > maxFiles) {
      onError?.(`Maximum ${maxFiles} files allowed`);
      return;
    }

    try {
      setUploading(true);

      if (multiple) {
        const urls = await uploadMultipleImages(files);
        const newPreviews = [...previews, ...urls];
        setPreviews(newPreviews);
        onChange?.(newPreviews);
      } else {
        const url = await uploadImage(files[0]);
        setPreviews([url]);
        onChange?.(url);
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      onError?.(error.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (index) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    onChange?.(multiple ? newPreviews : (newPreviews[0] || ''));
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-wrap gap-4">
        {previews.map((url, index) => (
          <div key={index} className="relative group">
            <img
              src={url}
              alt={`Preview ${index + 1}`}
              className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Icon name="x" className="w-4 h-4" />
            </button>
          </div>
        ))}

        {(!multiple || previews.length < maxFiles) && (
          <button
            type="button"
            onClick={handleClick}
            disabled={uploading}
            className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <Icon name="loader" className="w-8 h-8 text-gray-400 animate-spin" />
                <span className="text-sm text-gray-500 mt-2">Uploading...</span>
              </>
            ) : (
              <>
                <Icon name="upload" className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-500 mt-2">Upload</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />

      {multiple && (
        <p className="text-sm text-gray-500">
          {previews.length} / {maxFiles} files uploaded
        </p>
      )}
    </div>
  );
};

export default ImageUpload;
