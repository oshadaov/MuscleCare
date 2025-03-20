"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import api from "../../utils/api";
import "./Feedbacklist.css";

function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await api.get("/feedback");
      setFeedbacks(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch feedback. Please try again later.");
      setLoading(false);
    }
  };
  return (
    <section className="feedback-section">
      <div className="container">
        <h2 className="feedback-title">What Our Users Say</h2>

        {loading ? (
          <div className="feedback-loading">Loading feedback...</div>
        ) : error ? (
          <div className="feedback-error">{error}</div>
        ) : feedbacks.length === 0 ? (
          <p className="feedback-empty">No feedback available at the moment.</p>
        ) : (
          <div className="feedback-list">
            {feedbacks.map((feedback) => (
              <div key={feedback._id} className="feedback-item">
                <div className="feedback-header">
                  <div className="feedback-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={star <= feedback.rating ? "star-filled" : "star-empty"}
                      />
                    ))}
                  </div>
                  
                </div>
                <p className="feedback-comment">{feedback.comment}</p>
                <p className="feedback-user">- {feedback.username}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default FeedbackList;
