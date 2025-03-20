"use client"

import { useState, useEffect } from "react"
import FeedbackForm from "../../components/feedbackComponents/FeedbackForm"
import api from "../../utils/api"
import "./FeedBack.css"
import DP from '../../assets/Dr.jpg'
import FeedbackList from "../../components/feedbackComponents/Feedbacklist"
import ContentContainer from "../../components/ContentContainer"

function Feedback({ onFeedbackSubmitted }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

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
    <div className="feedback-page">

        <div className="feedback-content">
        <h1 className="feedback-title">Your Opinion Matters</h1>
        <p className="feedback-description">We value your feedback to improve our services</p>

          <div className="left">
          <FeedbackForm isLoggedIn={isLoggedIn} onFeedbackSubmitted={onFeedbackSubmitted} />    

          <ContentContainer /> 
          </div>
        </div>
      <FeedbackList feedbacks={feedbacks} loading={loading} error={error} />

      </div>
      </div>
      // </div>
  )
}

export default Feedback
