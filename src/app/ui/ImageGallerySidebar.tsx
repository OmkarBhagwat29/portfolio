"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import { LuCircleChevronLeft, LuCircleChevronRight } from "react-icons/lu";

interface ImageGallerySidebarProps {
  images: string[];
  onImageSelect?: (imagePath: string) => void;
  imageFolderPath: string;
}

const ImageGallerySidebar: React.FC<ImageGallerySidebarProps> = ({
  images,
  onImageSelect,
  imageFolderPath,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoScrollTimeout = useRef<number | null>(null);

  // 1. Auto-scroll animation on load
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Initial position at top
    container.scrollTop = 0;

    // Animate scroll downward
    const scrollHeight = container.scrollHeight;
    const duration = 2000; // 2 seconds
    let startTime: number;

    const animateScroll = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;

      // Ease-out scrolling
      const ease = 1 - Math.pow(1 - Math.min(progress / duration, 1), 3);
      container.scrollTop = ease * (scrollHeight / 3);

      if (progress < duration) {
        autoScrollTimeout.current = requestAnimationFrame(animateScroll);
      }
    };

    autoScrollTimeout.current = requestAnimationFrame(animateScroll);

    return () => {
      if (autoScrollTimeout.current) {
        cancelAnimationFrame(autoScrollTimeout.current);
      }
    };
  }, []);

  // 3. Center selected image
  const centerSelectedImage = (index: number) => {
    const container = containerRef.current;
    if (!container) return;

    const item = container.children[0].children[index] as HTMLElement;

    const itemTop = item.offsetTop;
    const itemHeight = item.offsetHeight;
    const containerHeight = container.offsetHeight;

    container.scrollTo({
      top: itemTop - containerHeight / 2 + itemHeight / 2,
      behavior: "smooth",
    });
  };

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle modal close
  const closeModal = useCallback(() => {
    setSelectedImage(null);
    document.body.classList.remove("overflow-hidden");
  }, []);

  const handleNextImage = useCallback(() => {
    //console.log("handleNextImage is caleld");
    let nextIndex = selectedIndex + 1;
    if (nextIndex === images.length) {
      nextIndex = 0;
    }

    setSelectedIndex(nextIndex);
    setSelectedImage(`/${imageFolderPath}/${images[nextIndex]}`);
  }, [imageFolderPath, images, selectedIndex]);

  const handlePreviousImage = useCallback(() => {
    //console.log("handlePreviousImage is caleld");
    let previousIndex = selectedIndex - 1;

    if (previousIndex < 0) {
      previousIndex = images.length - 1;
    }

    setSelectedIndex(previousIndex);
    setSelectedImage(`/${imageFolderPath}/${images[previousIndex]}`);
  }, [imageFolderPath, images, selectedIndex]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
      else if (e.key === "ArrowRight") handleNextImage();
      else if (e.key === "ArrowLeft") handlePreviousImage();
    };

    if (selectedImage) {
      document.addEventListener("keydown", handleKeyDown);

      document.body.classList.add("overflow-hidden");
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      document.body.classList.remove("overflow-hidden");
    };
  }, [selectedImage, closeModal, handleNextImage, handlePreviousImage]);

  // Modal component
  const ImageModal = () => {
    if (!selectedImage) return null;
    //console.log(selectedImage);
    return (
      <>
        <div
          className="absolute w-full h-screen bg-white/10
       backdrop-blur-lg z-40 flex items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
            closeModal();
          }}
        >
          <div ref={modalRef} className="w-2/3 h-2/3 border-red-700">
            {/* Image container */}
            <div
              className="relative w-full h-full rounded-xl overflow-hidden"
              onContextMenu={(e) => {
                e.preventDefault();
              }}
            >
              <Image
                src={selectedImage}
                alt="Enlarged view"
                fill
                className="object-contain select-none"
                quality={100}
                priority
              />
            </div>
          </div>

          <FiX
            className="bg-white rounded-full absolute w-8 h-8 top-28 right-32 hover:bg-red-600 cursor-pointer"
            onClick={closeModal}
          />

          <LuCircleChevronRight
            className="bg-white rounded-full absolute p-1 w-8 h-8 top-1/2 right-32 hover:bg-red-600 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleNextImage();
            }}
          />

          <LuCircleChevronLeft
            className="bg-white rounded-full p-1 absolute w-8 h-8 top-1/2 left-32 hover:bg-red-600 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();

              handlePreviousImage();
            }}
          />
        </div>
      </>
    );
  };

  const handleImageDoubleClick = (imagePath: string) => {
    setSelectedImage(imagePath);
    document.body.classList.add("overflow-hidden");
  };

  return (
    <>
      <div
        className={`no-scrollbar fixed left-0 top-1/2 -translate-y-1/2 bg-white/25 rounded-r-2xl transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-6 top-1/2 -translate-y-1/2 bg-white backdrop-blur-sm p-2 rounded-full shadow-lg hover:scale-110 transition-transform z-10"
        >
          {isCollapsed ? (
            <FiChevronRight className="w-5 h-5" />
          ) : (
            <FiChevronLeft className="w-5 h-5" />
          )}
        </button>

        {!isCollapsed && (
          <div className="h-[70vh] flex flex-col p-4">
            <div
              ref={containerRef}
              className="relative flex-1 overflow-y-scroll no-scrollbar"
            >
              {/* <EdgeBlurOverlay /> */}

              <div className="space-y-6">
                {images.map((image, index) => (
                  <div
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      handleImageDoubleClick(`/${imageFolderPath}/${image}`);
                    }}
                    key={index}
                    className={`group relative cursor-pointer transition-transform duration-300 ${
                      selectedIndex === index ? "scale-105 z-10" : "scale-100"
                    }`}
                    onClick={() => {
                      onImageSelect?.(`/${imageFolderPath}/${image}`);
                      setSelectedIndex(index);
                      centerSelectedImage(index);
                    }}
                  >
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden border-4 border-transparent group-hover:border-blue-200 transition-all">
                      <Image
                        src={`/${imageFolderPath}/${image}`}
                        alt={`Gallery item ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 256px"
                        priority
                      />
                    </div>

                    {selectedIndex === index && (
                      <div className="absolute inset-0.5 border-4 border-pink-600 rounded-xl pointer-events-none animate-pulse" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <ImageModal />
    </>
  );
};

export default ImageGallerySidebar;
