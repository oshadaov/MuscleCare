import DPP from '../../assets/Bg.jpg'
import './AboutContent.css'
function AboutContent() {
    return (
      
      <section className="about-section">
        <h1 className="about-title">About Us</h1>
        <div className="about-content">
          <div className="about-image">
            <img src={DPP} alt="Medical facility" />
          </div>
          <div className="about-text">
            <p>
              We are dedicated to providing easy and efficient medical treatment booking services. Our platform connects
              patients with healthcare providers, ensuring timely and quality medical care.
            </p>
            <p>
            About Muscle Care
At Muscle Care, we are committed to revolutionizing the way you access healthcare. Our platform seamlessly connects patients with trusted healthcare providers, making it easier than ever to book medical appointments quickly and efficiently.

            </p>
          </div>
        </div>
       
      </section>
   

    )
  }
  
  export default AboutContent
  
  