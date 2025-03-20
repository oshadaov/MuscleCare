"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Home from "./pages/home/Home"
import About from "./pages/about/About"
import Contact from "./pages/contact/Contact"
import Login from "./pages/login/Login"
import Register from "./pages/register/Register"
import Booking from "./pages/booking/Booking"
import Feedback from "./pages/fedback/FeedBack"
import Service from "./pages/service/Service"
import ServiceDetail from "./components/ServiceDetail"
import Therapist from "./pages/therapist/Therapist"
import FindUs from "./components/location/Findus"
import YouTubeVideos from "./components/YouTubeVideos" 
import useAutoRefresh from "./hooks/useAutoRefresh"


const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("token")
  return isAuthenticated ? children : <Navigate to="/login" />
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  useAutoRefresh(60000) // 60000ms = 1 minute

  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    setIsLoggedIn(false)
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/service" element={<Service />} />
            <Route path="/service/:id" element={<ServiceDetail />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/therapist" element={<Therapist/>} />
            <Route path="/findus" element={<FindUs/>} />
            <Route path="/videos" element={<YouTubeVideos/>} />
            <Route
              path="/booking"
              element={
                <PrivateRoute>
                  <Booking />
                </PrivateRoute>
              }
            />
            <Route
              path="/feedback"
              element={
                <PrivateRoute>
                  <Feedback />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App

