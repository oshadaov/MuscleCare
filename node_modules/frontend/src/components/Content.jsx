"use client"

import { useState, useEffect } from "react"
import "./ImageRotator.css"

const Content = ({ images, interval = 3000 }) => {
  const [positions, setPositions] = useState([0, 1, 2, 3,4,5,6,7,8])

  useEffect(() => {
    // Ensure we have exactly 4 images
    if (!images || images.length !== 9) {
      console.error("ImageRotator requires exactly 4 images")
      return
    }

    // Set up the rotation interval
    const timer = setInterval(() => {
      // Rotate positions: [0,1,2,3] -> [3,0,1,2]
      setPositions((prevPositions) => {
        const lastPosition = prevPositions[8]
        return [lastPosition, ...prevPositions.slice(0, 8)]
      })
    }, interval)

    // Clean up the interval on component unmount
    return () => clearInterval(timer)
  }, [images, interval])

  if (!images || images.length !== 9) {
    return <div className="image-rotator-error">Please provide exactly 4 images</div>
  }

  return (
    <div className="image-rotator-container">
      {positions.map((imageIndex, divIndex) => (
        <div key={divIndex} className={`image-rotator-item position-${divIndex}`}>
          <div className="image-rotator-card">
            <img
              src={images[imageIndex] }
              alt={`Image ${imageIndex + 1}`}
              className="image-rotator-img"
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default Content

