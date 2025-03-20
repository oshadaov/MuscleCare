"use client"

import { useState, useEffect } from "react"
import api from "../utils/api"
import { toast } from "react-toastify"
import "./YouTubeVideos.css"
import ImageRotator from "../components/ImageRotator"
import DP from "../assets/dental.jpeg"
import EYE from "../assets/Dr.jpg"
import DP1 from "../assets/general-checkup.jpg"


const YouTubeVideos = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const rotatorImages = [DP,EYE,EYE,DP1]
  const rotatorImages1 = [DP,EYE,DP1,EYE]

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      setLoading(true)
      const response = await api.get("/videos")
      setVideos(response.data.videos.filter(video => video.active)) // Show only active videos
    } catch (err) {
      setError("Failed to load videos")
      toast.error("Failed to load videos")
    } finally {
      setLoading(false)
    }
  }

  const getYouTubeId = (url) => {
    if (!url) return null
  
    const regExp = /(?:youtu\.be\/|youtube\.com\/(?:.*v(?:\/|=)|.*[?&]v=))([\w-]{11})/ 
    const match = url.match(regExp)
  
    return match && match[1] ? match[1] : null
  }
  

  if (loading) return <div className="youtube-loading">Loading videos...</div>
  if (error) return <div className="youtube-error">{error}</div>
  if (!videos.length) return <div className="youtube-error">No active videos available</div>

 return (
  <div className="container">

      <section className="youtube-section">

        <div className="youtube-container">
          <h2 className="youtube-title">Featured Videos</h2>
          <div className="youtube-grid">
            {videos.map((video) => {
              const videoId = getYouTubeId(video.url)
              if (!videoId) return null
  
              return (
                <div key={video._id} className="youtube-card">
                  <div className="youtube-video-container">
                  <iframe
                    width="410"
                    height="230"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&disablekb=1&rel=0&playsinline=1&loop=1&playlist=${videoId}&fs=0&iv_load_policy=3&showinfo=0`}
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
></iframe>



                  

                  </div>
                  
                </div>
              )
            })}
          </div>
      </div>
      <ImageRotator images={rotatorImages1}/>
      </section>

          </div>

    )
  }
  
  export default YouTubeVideos
  
