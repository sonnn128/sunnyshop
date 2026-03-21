import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const ProductImageGallery = ({ images, productName }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images?.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images?.length) % images?.length);
  };

  const openFullscreen = () => {
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative bg-muted rounded-lg overflow-hidden aspect-square">
          <Image
            src={images?.[currentImageIndex]}
            alt={`${productName} - Hình ${currentImageIndex + 1}`}
            className="w-full h-full object-cover cursor-zoom-in"
            onClick={openFullscreen}
          />
          
          {/* Navigation Arrows */}
          {images?.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-elegant transition-smooth"
              >
                <Icon name="ChevronLeft" size={20} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-elegant transition-smooth"
              >
                <Icon name="ChevronRight" size={20} />
              </button>
            </>
          )}

          {/* Zoom Icon */}
          <button
            onClick={openFullscreen}
            className="absolute top-2 right-2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-elegant transition-smooth"
          >
            <Icon name="ZoomIn" size={16} />
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-sm">
            {currentImageIndex + 1} / {images?.length}
          </div>
        </div>

        {/* Thumbnail Navigation */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {images?.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-smooth ${
                index === currentImageIndex
                  ? 'border-accent' :'border-transparent hover:border-border'
              }`}
            >
              <Image
                src={image}
                alt={`${productName} - Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <div className="relative max-w-4xl max-h-full p-4">
            <Image
              src={images?.[currentImageIndex]}
              alt={`${productName} - Fullscreen`}
              className="max-w-full max-h-full object-contain"
            />
            
            {/* Close Button */}
            <button
              onClick={closeFullscreen}
              className="absolute top-2 right-2 w-10 h-10 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-smooth"
            >
              <Icon name="X" size={20} />
            </button>

            {/* Navigation in Fullscreen */}
            {images?.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-smooth"
                >
                  <Icon name="ChevronLeft" size={24} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-smooth"
                >
                  <Icon name="ChevronRight" size={24} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductImageGallery;