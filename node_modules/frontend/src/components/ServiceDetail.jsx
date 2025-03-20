import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/api"; // Import API utility
import { ArrowLeft, Calendar, Clock, Star } from "lucide-react";
import "./ServiceDetail.css";
import serviceImage from "../assets/eye-exam.jpeg"; // Fallback image

function ServiceDetail() {
  const { id } = useParams(); // Get service ID from URL
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await api.get(`/admin/services/${id}`); // Fetch service details
        setService(response.data);
      } catch (err) {
        console.error("Error fetching service details:", err);
        setError("Service not found. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  if (loading) {
    return (
      <div className="container service-detail-container">
        <p>Loading service details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container service-detail-container">
        <h2>{error}</h2>
        <Link to="/service" className="back-to-services">
          <ArrowLeft size={16} />
          Back to Services
        </Link>
      </div>
    );
  }

  return (
    <div className="container service-detail-container">
      
      <Link to="/service" className="back-to-services">
        <ArrowLeft size={16} />
        Back to Services
      </Link>
      <div className="extra">
        {service.extra && (
            <div className="service-detail-extras">
              <h3>{service.extra} is given with this </h3>
              
            </div>
          )}
        </div>
      <div className="service-detail-content">
        <div className="service-detail-image-container">
          <img src={service.imageUrl || serviceImage} alt={service.name} className="service-detail-image" />
          <div className="service-detail-rating">
            <Star className="star-icon" fill="#FFD700" color="#FFD700" />
            <span>{service.rating}/5</span>
          </div>
        </div>

        <div className="service-detail-info">
        <h1 className="service-detail-title">{service.name}</h1>
        {/* ✅ Only show "Extras" if the service has extras */}
       
          <div className="service-meta">
            <div className="service-meta-item">
              <Clock size={18} />
              <span>{service.duration} minutes</span>
            </div>
            <div className="service-meta-item">
              <span className="service-price">Lkr {service.price}</span>
            </div>
          </div>

          <div className="service-description-full">
            <h3>Description</h3>
            <p>{service.fullDescription}</p>
          </div>

          <div className="service-benefits">
            <h3>Benefits</h3>
            <ul>
              {service.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>

          <div className="service-booking">
            <Link to={`/booking?service=${service._id}`} className="book-service-button">
              <Calendar size={18} />
              Book This Service
            </Link>
          </div>
        </div>
      
      </div>
    </div>
  );
}

export default ServiceDetail;
