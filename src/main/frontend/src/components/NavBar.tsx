import React from "react";
import "./Navbar.css";

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo">
        <img src="./logo.png" alt="Logo" />
        <span>Brand</span>
      </div>

      {/* Search */}
      <div className="search">
        <input type="text" placeholder="Search..." />
      </div>

      {/* Right Menu */}
      <div className="menu">
        <a href="#">Home</a>
        <a href="#">Lang</a>
        <a href="#">Cart</a>
        <a href="#">Login</a>
      </div>
    </nav>
  );
};

export default Navbar;
