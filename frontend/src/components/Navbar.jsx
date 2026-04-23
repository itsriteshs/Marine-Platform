import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <div className="logo-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6.5 12c.94-3.46 4.03-6 7.5-6 3.47 0 6.56 2.54 7.5 6-.94 3.46-4.03 6-7.5 6-3.47 0-6.56-2.54-7.5-6Z" />
            <path d="M18 12c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1Z" />
            <path d="M2 12s5-7 12-7h0a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h0c-7 0-12-7-12-7Z" />
          </svg>
        </div>

        <span className="logo-text">MarinePlatform</span>
      </div>
      <div className="navbar-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/taxonomy" className="nav-link">Taxonomy</Link>
        <Link to="/analysis" className="nav-link">Analysis</Link>
        <Link to="/search" className="nav-link">Search</Link>
        <Link to="/modules" className="nav-link">
          Visualizations
        </Link>
      </div>
      <div className="navbar-actions">
        <button className="support-btn">
          Contact Support
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

