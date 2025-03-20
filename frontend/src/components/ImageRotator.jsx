"use client";

import { useState, useEffect } from "react";
import api from "../utils/api"; // Import API utility for fetching data
import "./ImageRotator.css";

const ImageRotator = ({ interval = 3000 }) => {
  const [images, setImages] = useState([]);
  const [positions, setPositions] = useState([0, 1, 2, 3]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch images from backend API
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await api.get("/rotator-images"); // API endpoint for fetching images
        setImages(response.data.map((img) => img.image)); // Extract only image URLs
        setLoading(false);
      } catch (err) {
        console.error("Error fetching images:", err);
        setError("Failed to load images");
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Ensure we have exactly 4 images before starting rotation
  useEffect(() => {
    if (images.length === 4) {
      const timer = setInterval(() => {
        setPositions((prevPositions) => {
          const lastPosition = prevPositions[3];
          return [lastPosition, ...prevPositions.slice(0, 3)];
        });
      }, interval);

      return () => clearInterval(timer);
    }
  }, [images, interval]);

  if (loading) return <div className="image-rotator-loading">Loading images...</div>;
  if (error) return <div className="image-rotator-error">{error}</div>;
  if (images.length !== 4) return <div className="image-rotator-error">Please upload exactly 4 images</div>;

  return (
    <div className="image-rotator-container">
      {positions.map((imageIndex, divIndex) => (
        <div key={divIndex} className={`image-rotator-item position-${divIndex}`}>
          <div className="image-rotator-card">
            <img
              src={images[imageIndex]}
              alt={`Image ${imageIndex + 1}`}
              className="image-rotator-img"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageRotator;
