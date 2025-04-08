import { useState } from "react";
import "./index.css";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="header">
      <div className="logo">🌾 Sri Lakshmi Narasimha Fertilizers</div>

      <button
        className="menu-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? "✖" : "☰"}
      </button>

      <nav className={`nav ${isOpen ? "open" : ""}`}>
        <a href="/" className="nav-link" onClick={() => setIsOpen(false)}>Home</a>
        <a href="/about" className="nav-link" onClick={() => setIsOpen(false)}>మా గురించి</a>
        <a href="tel:919390315670" className="nav-link" onClick={() => setIsOpen(false)}>📞సమాచారము కొరకు ఫోన్ చెయ్యండి</a>
      </nav>
    </header>
  );
};

export default Header;

