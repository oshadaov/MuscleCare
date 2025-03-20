import React from "react";
import PropTypes from "prop-types";
import "./MapEmbed.css";

const MapEmbed = ({ title, mapSrc }) => {
  return (
    <div className="map-container">
      <h3>{title}</h3>
      <iframe
        title={title}
        src={mapSrc}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

MapEmbed.propTypes = {
  title: PropTypes.string.isRequired,
  mapSrc: PropTypes.string.isRequired,
};

export default MapEmbed;
