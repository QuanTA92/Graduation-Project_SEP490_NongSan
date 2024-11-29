import React, { useState, useEffect } from 'react';
import { Carousel } from "@material-tailwind/react";

export default function CarouselNavbar() {
  const [activeIndex, setActiveIndex] = useState(0);
  const images = [
    "https://img1.kienthucvui.vn/uploads/2019/10/30/hinh-anh-cac-loai-rau-cu_112151407.jpg",
    "https://img1.kienthucvui.vn/uploads/2019/10/30/hinh-anh-rau-cu-qua-dep_112153407.jpg",
    // "https://images.unsplash.com/photo-1518623489648-a173ef7824f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2762&q=80",
  ];

  // Autoplay functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change every 3 seconds
    return () => clearInterval(interval); // Clean up on unmount
  }, [images.length]);

  return (
    <div className="relative w-full h-[400px] overflow-hidden mt-2">
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
    </div>
  );
}
