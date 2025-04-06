import { Link } from "react-router-dom";
import "./index.css";

const Header = () => (
  <header className="header">
    <div className="logo">🌱 FarmDirect</div>
    <nav className="nav">
      <Link to="/" className="nav-link">Home</Link>
      <Link to="/about" className="nav-link">About</Link>
      <Link to="/Dashbooard" className="nav-link">Dashboard</Link>
    </nav>
  </header>
);

export default Header;
