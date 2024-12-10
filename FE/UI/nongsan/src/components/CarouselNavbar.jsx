import React, { useState, useEffect } from "react";
import { Carousel } from "@material-tailwind/react";
import axios from "axios";

export default function CarouselNavbar() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [images, setImages] = useState([]);
  const apiBase = "http://localhost:8080/api/carousel/get";

  // Fetch carousel images
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(apiBase);
        // Assuming the API returns an array of carousel objects with a field `imageCarousel` containing the URL
        const imageUrls = response.data.map((item) => item.imageCarousel);
        setImages(imageUrls);
      } catch (error) {
        console.error("Error fetching carousel images:", error);
      }
    };

    fetchImages();
  }, []);

  // Autoplay functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change every 3 seconds
    return () => clearInterval(interval); // Clean up on unmount
  }, [images.length]);

  return (
    <div className="relative w-full h-[400px] overflow-hidden mt-2">
      {/* Check if images are loaded */}
      {images.length > 0 ? (
        <>
          {/* Carousel with one image at a time */}
          <div className="w-full h-full">
            {images.map((src, index) => (
              <div
                key={index}
                className={`absolute top-0 left-0 w-full h-full ${index === activeIndex ? "block" : "hidden"}`}
              >
                <img src={src} alt={`Advertisement ${index + 1}`} className="w-full h-full object-contain" />
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
            onClick={() => setActiveIndex((activeIndex - 1 + images.length) % images.length)}
          >
            ❮
          </button>
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
            onClick={() => setActiveIndex((activeIndex + 1) % images.length)}
          >
            ❯
          </button>
        </>
      ) : (
        <p className="text-center text-gray-500 mt-4">Đang tải ảnh...</p>
      )}
    </div>
  );
}
