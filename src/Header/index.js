import { useState } from "react";
import "./index.css";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="header">
      <div className="logo">🌾 Sri Lakshmi Narasimha</div>

      <button
        className="menu-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? "✖" : "☰"}
      </button>

      <nav className={`nav ${isOpen ? "open" : ""}`}>
        <a href="/" className="nav-link" onClick={() => setIsOpen(false)}>Home</a>
        
        <a href="/about" className="nav-link" onClick={() => setIsOpen(false)}>About</a>
      </nav>
    </header>
  );
};

export default Header;
