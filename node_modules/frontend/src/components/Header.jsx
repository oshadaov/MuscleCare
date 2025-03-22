import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Header.css";
import Logo from "../assets/musclecare.jpg";

function Header({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate("/");
    setMenuOpen(false); // Close menu after logout
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".header-nav")) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="containers">
        <nav className="header-nav">
          <Link to="/" className="header-logo">
            <img src={Logo} alt="MuscleCare Logo" />
          </Link>

          {/* Hamburger Button */}
          <button className={`menu-toggle ${menuOpen ? "open" : ""}`} onClick={toggleMenu}>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </button>

          <ul className={`header-menu ${menuOpen ? "active" : ""}`}>
            <li><Link to="/" className="header-link" onClick={toggleMenu}>Home</Link></li>
            <li><Link to="/about" className="header-link" onClick={toggleMenu}>About</Link></li>
            <li><Link to="/service" className="header-link" onClick={toggleMenu}>Services</Link></li>
            <li><Link to="/contact" className="header-link" onClick={toggleMenu}>Contact</Link></li>

            {isLoggedIn ? (
              <>
                <li><Link to="/booking" className="header-link" onClick={toggleMenu}>Booking</Link></li>
                <li><Link to="/feedback" className="header-link" onClick={toggleMenu}>Feedback</Link></li>
                <li>
                  <Link to="/" onClick={handleLogout} className="btnn header-link">
                    Logout
                  </Link>
                </li>
              </>
            ) : (
              <li><Link to="/register" className="header-link" onClick={toggleMenu}>Register</Link></li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
