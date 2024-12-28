import '../../style/mainPageStyle/adminPageStyle/AdminPageStyle.css';
import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { useUser } from "../user/UserContext";

function AdminPage() {
  const { user } = useUser(); // Access user data from context
  const [sidebarWidth, setSidebarWidth] = useState(250); // Initial sidebar width
  const minSidebarWidth = 100; // Minimum width for sidebar
  const maxSidebarWidth = 400; // Maximum width for sidebar

  const handleMouseDown = (e) => {
    console.log(user.adminLevel);
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
          <img
            src={user?.image ? `data:image/jpeg;base64,${user.image}` : "https://via.placeholder.com/100"}
            alt="Profile Picture"
          />
        </div>

        <nav>
          <ul>
            <li>
              <Link to="ProfileAdmin">Profile</Link>
            </li>
            {user.adminLevel === "superAdmin" && (
            <li>
              <Link to="Permission">Permission</Link>
            </li>
            )}
            <li>
              <Link to="Dash">Dash Board</Link>
            </li>
            <li>
              <Link to="ProductHandler">Product Management</Link>
            </li>
            <div className="logo-admin">
              <Link to="/" >
                <img src="/assets/brandIcon.svg" alt="StyloSphere Logo" />
              </Link>
            </div> 
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

