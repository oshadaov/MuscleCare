import "./Therapist.css";
import { useState } from "react";
import therapist1 from "../../assets/Dr.jpg";
import therapist2 from "../../assets/Dr.jpg";
import therapist3 from "../../assets/Dr.jpg";

const therapists = [
  {
    name: "Dr. John Smith",
    specialty: "Chiropractic Specialist",
    image: therapist1,
    bio: "With over 10 years of experience, Dr. Smith helps clients achieve pain relief and better mobility.",
    details: "Dr. Smith specializes in spinal alignment, posture correction, and pain management therapies for all ages."
  },
  {
    name: "Dr. Emily Johnson",
    specialty: "Physical Therapist",
    image: therapist2,
    bio: "Dr. Johnson specializes in rehabilitation therapy, focusing on muscle recovery and flexibility.",
    details: "Her expertise includes sports rehabilitation, post-surgical recovery, and strength training programs tailored for individuals."
  },
  {
    name: "Dr. Michael Lee",
    specialty: "Sports Injury Expert",
    image: therapist3,
    bio: "Dr. Lee has worked with professional athletes, helping them recover from injuries and enhance performance.",
    details: "Dr. Lee's treatment focuses on muscle therapy, injury prevention, and performance optimization for athletes."
  }
];

function Therapists() {
  const [selectedTherapist, setSelectedTherapist] = useState(null);

  return (
    <div className="container">
    <section className="therapists-section">
      
        <h2 className="therapists-title">Meet Our Expert Therapists</h2>
        <div className="therapists-grid">
          {therapists.map((therapist, index) => (
            <div
              key={index}
              className="therapist-card"
              onClick={() => setSelectedTherapist(therapist)}
            >
              <img src={therapist.image} alt={therapist.name} className="therapist-image" />
              <h3 className="therapist-name">{therapist.name}</h3>
              <p className="therapist-specialty">{therapist.specialty}</p>
              <p className="therapist-bio">{therapist.bio}</p>
            </div>
          ))}
        </div>

        {selectedTherapist && (
          <div className="therapist-details-modal">
            <div className="modal-content">
              <span className="close-button" onClick={() => setSelectedTherapist(null)}>&times;</span>
              <img src={selectedTherapist.image} alt={selectedTherapist.name} className="therapist-image" />
              <h3 className="therapist-name">{selectedTherapist.name}</h3>
              <p className="therapist-specialty">{selectedTherapist.specialty}</p>
              <p className="therapist-details">{selectedTherapist.details}</p>
            </div>
          </div>
        )}
    </section>
      </div>
  );
}

export default Therapists;
