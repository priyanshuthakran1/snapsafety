import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-brand">SafetySnap</div>
      <div className="nav-links">
        <Link to="/" className={location.pathname === "/" ? "active" : ""}>
          Upload
        </Link>
        <Link
          to="/history"
          className={location.pathname === "/history" ? "active" : ""}
        >
          History
        </Link>
        <Link
          to="/analytics"
          className={location.pathname === "/analytics" ? "active" : ""}
        >
          Analytics
        </Link>
      </div>
    </nav>
  );
}