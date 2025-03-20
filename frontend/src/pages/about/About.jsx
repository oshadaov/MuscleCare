"use client"

import { useState, useEffect } from "react"
import api from "../../utils/api"
import AboutContent from "../../components/aboutComponents/AboutContent"
import "./About.css"
import Mission from "../../components/aboutComponents/Vision"
import WhyChooseUs from "../../components/aboutComponents/WhyChooseUs"
import FindUs from "../../components/location/FindUs"


function About({images}) {
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)


  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)
    fetchFeedbacks()
  }, [])

  const fetchFeedbacks = async () => {
    try {
      const response = await api.get("/feedback")
      setFeedbacks(response.data)
      setLoading(false)
    } catch (err) {
      setError("Failed to fetch feedback. Please try again later.")
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <FindUs/>
    
      <AboutContent />
      <Mission/>
      <WhyChooseUs/>
    </div>
  )
}

export default About

