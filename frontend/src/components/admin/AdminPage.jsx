import '../../style/mainPageStyle/adminPageStyle/AdminPageStyle.css';
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ProductHandler from "../admin/ProductHandler";
import Permission from "../admin/Permission";
import Dash from "../admin/Dash";
import ProfileAdmin from "../admin/ProfileAdmin";




function AdminPage() {
  const [sidebarWidth, setSidebarWidth] = useState(250); // Initial sidebar width
  const minSidebarWidth = 100; // Minimum width for sidebar
  const maxSidebarWidth = 400; // Maximum width for sidebar

  const handleMouseDown = (e) => {
    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const handleMouseMove = (e) => {
      const newWidth = startWidth + (e.clientX - startX);
      if (newWidth >= minSidebarWidth && newWidth <= maxSidebarWidth) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div>
      <Router>
        <div className="app">
          <div
            className="sidebar"
            style={{ width: `${sidebarWidth}px` }}
          >
             <div className="profile-image">
            <img src="https://via.placeholder.com/100" alt="Profile Picture" />
            </div>

            <nav>
              <ul>
                <li>
                  <Link to="/admin/ProfileAdmin">Profile</Link>
                </li>
                <li>
                  <Link to="/admin/ProductHandler">Your Products</Link>
                </li>
                <li>
                  <Link to="/admin/Permission">Permission</Link>
                </li>
                <li>
                  <Link to="/admin/Dash">Dash Board</Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Resizer element */}
          <div
            className="resizer"
            onMouseDown={handleMouseDown}
          ></div>

          {/* Main Content */}
          <div className="content">
            <Routes>
              <Route path="/admin/ProfileAdmin" element={<ProfileAdmin />} />
              <Route path="/admin/ProductHandler" element={<ProductHandler/>} />
              <Route path="/admin/Permission" element={<Permission />} />
              <Route path="/admin/Dash" element={<Dash />} />
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
}


export default AdminPage;