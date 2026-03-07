import { useState } from "react";
import { ChevronLeft, ChevronRight } from "react-feather";
import Skeleton from "react-loading-skeleton";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

export default function GalleryDesktop({ profileData }) {
  const [loadedImages, setLoadedImages] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleImageLoad = (index) => {
    setLoadedImages((prev) => ({ ...prev, [index]: true }));
  };

  const photos = profileData?.photos || [];
  const hasMultiplePhotos = photos.length > 1;

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  return (
    <PhotoProvider>
      <div className="gallery" style={{ position: "relative" }}>
        {photos.map((src, i) => {
          const isLoaded = loadedImages[i];
          const isActive = i === currentIndex;
          return (
            <div key={i} style={{ display: isActive ? "block" : "none" }}>
              {!isLoaded && <Skeleton height={800} width={470} />}
              <PhotoView src={src}>
                <img
                  src={src}
                  alt={`photo-${i}`}
                  onLoad={() => handleImageLoad(i)}
                  className={`thumb ${isLoaded ? "visible" : "hidden"}`}
                />
              </PhotoView>
            </div>
          );
        })}
        <div className="gallery-dots">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`gallery-dot ${i === currentIndex ? "active" : ""}`}
              aria-label={`Go to photo ${i + 1}`}
            />
          ))}
        </div>
        {hasMultiplePhotos && (
          <>
            <button
              onClick={handlePrevious}
              className="gallery-arrow gallery-arrow-left"
              aria-label="Previous photo"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNext}
              className="gallery-arrow gallery-arrow-right"
              aria-label="Next photo"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}
      </div>
    </PhotoProvider>
  );
}
