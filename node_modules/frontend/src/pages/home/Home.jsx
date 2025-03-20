"use client"

import { useState, useEffect } from "react"
import api from "../../utils/api"
import HomeHero from "../../components/homeComponents/HomeHero"
import RecentBookings from "../../components/RecentBooking"
import "./Home.css"
import Services from "../service/Service"
import About from "../about/About"
import Contact from "../contact/Contact"
import Therapists from "../therapist/Therapist"
import YouTubeVideos from "../../components/YouTubeVideos"

function Home({ isLoggedIn }) {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (isLoggedIn) {
      fetchBookings()
    } else {
      setLoading(false)
    }
  }, [isLoggedIn])

  const fetchBookings = async () => {
    try {
      const response = await api.get("/booking")
      setBookings(response.data)
      setLoading(false)
    } catch (err) {
      setError("Failed to fetch bookings. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="container1">
    <div className="container">
      <div className="upper">
      <HomeHero isLoggedIn={isLoggedIn} />

      </div>
      {/* <div className="down">
      {isLoggedIn && <RecentBookings bookings={bookings} loading={loading} error={error} />}

      </div> */}
      </div>
      <YouTubeVideos/>
      <Services/>
      <About/>
      <Therapists/>
      <Contact/>
    </div>
  )
}

export default Home

