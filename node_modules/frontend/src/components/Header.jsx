import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import Logo from "../assets/musclecare.jpg";

function Header({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  return (
    <header className="header">
      <div className="containers">
        <nav className="header-nav">
          <Link to="/" className="header-logo">
            <img src={Logo} alt="MuscleCare Logo" />
          </Link>

          <ul className="header-menu">
            <li><Link to="/" className="header-link">Home</Link></li>
            <li><Link to="/about" className="header-link">About</Link></li>
            <li><Link to="/service" className="header-link">Services</Link></li>
            <li><Link to="/contact" className="header-link">Contact</Link></li>
            
            {isLoggedIn ? (
              <>
                <li><Link to="/booking" className="header-link">Booking</Link></li>
                <li><Link to="/feedback" className="header-link">Feedback</Link></li>
                <li>
                  <Link to="/" onClick={handleLogout} className="btnn header-link">
                    Logout
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/register" className="header-link">Register</Link></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
