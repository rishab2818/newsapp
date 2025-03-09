import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = ({ handleHomeClick, toggle, setToggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Toggle the navbar when clicking the hamburger button
  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Close the navbar when clicking any nav item
  const closeNavbar = () => {
    setIsCollapsed(true);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        {/* Home Button */}
        <Link
          to="/"
          className="navbar-brand"
          onClick={() => {
            handleHomeClick();
            closeNavbar();
          }}
        >
          🏠 Home
        </Link>

        {/* Mobile Toggle Button */}
        <button className="navbar-toggler" type="button" onClick={handleToggle}>
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Items */}
        <div
          className={`collapse navbar-collapse ${isCollapsed ? "" : "show"}`}
          id="navbarNav"
        >
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link
                to="/claim-coins"
                className="nav-link text-warning"
                onClick={closeNavbar}
              >
                💰 Claim Coins
              </Link>
            </li>
            <li className="nav-item">
              <button
                className="btn btn-primary mx-2"
                data-bs-toggle="modal"
                data-bs-target="#postModal"
                onClick={closeNavbar}
              >
                📝 Add Post
              </button>
            </li>
            <li className="nav-item">
              <button
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#upscModal"
                onClick={closeNavbar}
              >
                📚 UPSC
              </button>
            </li>
            <li className="nav-item">
              <button
                className="btn btn-outline-info mx-2"
                onClick={() => {
                  setToggle(toggle === "news" ? "upsc" : "news");
                  closeNavbar();
                }}
              >
                Toggle {toggle === "news" ? "UPSC" : "OpEds"}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
