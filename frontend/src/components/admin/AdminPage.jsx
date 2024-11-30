import '../../style/mainPageStyle/adminPageStyle/AdminPageStyle.css';
import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";

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
              <Link to="ProfileAdmin">Profile</Link>
            </li>
            <li>
              <Link to="Permission">Permission</Link>
            </li>
            <li>
              <Link to="Dash">Dash Board</Link>
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
        <Outlet /> {/* Render child routes here */}
      </div>
    </div>
  );
}

export default AdminPage;
