import { Link } from "react-router-dom"
import DP from '../../assets/front.jpg'

function HomeHero({ isLoggedIn }) {
  return (
    <div className="home-hero">
      <div className="home-hero-content">
        <h1 className="home-title">Muscle Care</h1>
        <p className="home-subtitle">
          FOR COMFORTABLE MOVEMENT
          </p>
          <p>
        Our holistic approach ensures that you don’t just feel better today, but thrive in the long run.</p>
        {isLoggedIn ? (
          <Link to="/booking" className="btn btn-primary home-cta">
            Book an Appointment
          </Link>



        ) : (
          <div className="home-cta">
            <p>Please log in to book appointments</p>
            <Link to="/login" className="btn btn-primary">
              Log In
            </Link>
          </div>
        )}
      </div>
      <div className="home-hero-image">
      <img src={DP} alt="Medical professionals" width={800} height={400} />

        
      </div>
      
    </div>
  )
}

export default HomeHero

