import React from "react";
import MapEmbed from "./MapEmbed"; // Import the reusable component
import "./FindUs.css";

const FindUs = () => {
  return (
    <div className="find-us-container">
      <h2 className="find-us-title">Find Us</h2>

      <div className="maps-container">
        <MapEmbed 
          title="Ravana's Cave" 
          mapSrc="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14338.757646322994!2d81.03704728953034!3d6.865330194109672!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae465b6ac01dd45%3A0xcde9780165d3824!2sRavana&#39;s%20Cave!5e1!3m2!1sen!2slk!4v1741889897591!5m2!1sen!2slk"
        />
        <MapEmbed 
          title="Muscle Care" 
          mapSrc="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3585.7965631796137!2d80.7836978744816!3d6.716751420888505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae38b00490c083b%3A0xb721f049e78a3f00!2sMuscle%20Care!5e1!3m2!1sen!2slk!4v1741880927735!5m2!1sen!2slk"
        />
      </div>
    </div>
  );
};

export default FindUs;
