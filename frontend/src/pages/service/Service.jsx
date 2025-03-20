
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import "./Service.css";
import serviceImage from "../../assets/eye-exam.jpeg"; // Example fallback image

function Service() {
  const [servicesList, setServicesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get("/admin/services?sort=createdAt");
        setServicesList(response.data);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Failed to load services. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) return <div className="container">Loading services...</div>;
  if (error) return <div className="container text-red-600">{error}</div>;

  return (

    <div className="container">
    <div className="section">

      <h2 className="services-title">Our Services</h2>
      <div className="services-grid">
        {servicesList.map((service, index) => (
          <div key={service._id || index} className="service-card">
            <img src={service.imageUrl || serviceImage} alt={service.name} className="service-image" />
            <h3 className="service-name">{service.name}</h3>
            <h3 className="service-extra">{service.extra}</h3>
            <p className="service-description">{service.description}</p>
            <div className="service-actions">
            <Link to={`/service/${service._id}`} className="view-details-button">
              View Details
             </Link>

              <Link to={`/booking?service=${service._id}`} className="book-button btn btn-primary">
                Book Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}

export default Service;