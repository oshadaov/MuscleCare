import React from 'react'
import './ContentContainer.css'
import img1 from '../assets/Dr.jpg'
import img2 from '../assets/Dr.jpg'
import img3 from '../assets/Dr.jpg'
import img4 from '../assets/Dr.jpg'


const ContentContainer = () => {
    return (
      <div className="content-grid">
        <div className="content-gridMini">
        </div>
        <div className="content-gridMini">
        </div>
        <div className="content-gridMini">
        </div>
        <div className="content-gridMini">
        </div>
        <div className="content-gridMini">
        <img src={img1} alt="Image 1" />
        </div>
        <div className="content-gridMini">
        </div>
        <div className="content-gridMini">
        </div>
        <div className="content-gridMini">
        </div>
        <div className="content-gridMini">
        </div>
        
      </div>
    );
  };
  
  export default ContentContainer;