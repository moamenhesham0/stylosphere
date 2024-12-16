import '../../style/mainPageStyle/adminPageStyle/AdminProfileStyle.css';
import React, { useEffect, useState } from "react";
function ProfileAdmin() {
    const [adminName, setAdminName] = useState("user name");
    const [aboutAdmin, setAboutAdmin] = useState("full stack");
    const [adminAdress, setAdminAdress] = useState("Bay Area, San Francisco, CA");
    const [adminEmail, setAdminEmail] = useState("username@gmail.com");
    const [adminphone, setAdminAdminPhone] = useState("(239) 816-9029");
    const [adminmobile, setAdminMobile] = useState("(320) 380-4539");
    
    const [progress, setProgress] = useState([  //example
        { name: "Monthly Target", progress: 90 },
        { name: "page population", progress: 70 },
        { name: "Good Rates", progress: 3 },
        { name: "Bad Rates", progress: 100 },
      ]);

      const [links, setLinks] = useState({
        website: "https://www.youtube.com/watch?v=H6JjSdO0XWA&feature=youtu.be",
        github: "https://www.youtube.com/watch?v=H6JjSdO0XWA&feature=youtu.be",
        twitter: "https://www.youtube.com/watch?v=H6JjSdO0XWA&feature=youtu.be",
        instagram: "https://www.youtube.com/watch?v=H6JjSdO0XWA&feature=youtu.be",
        facebook: "https://www.youtube.com/watch?v=H6JjSdO0XWA&feature=youtu.be",
      });
    
    const handleProgressChange = (index, newProgress) => { //will use backend for it
        // const updatedprogress = [...progress];
        // updatedprogress[index].progress = newProgress;
        // setProgress(updatedprogress);
      };

    return(
    <div className="profile-container">
        {/* <!-- Left Section --> */}
        <div className="profile-left">
        <div className="profile-image">
            <img src="https://via.placeholder.com/100" alt="Profile Picture" />
        </div>
        <h2>{adminName}</h2>
        <p>{aboutAdmin}</p>
        <p>{adminAdress}</p>
        
        <div class="social-links">
        <a href={links.website} className="link">
            <img src="https://img.icons8.com/ios-filled/50/000000/domain.png" alt="Website" className="icon" />
            Website
        </a>
        <a href={links.website} className="link">
            <img src="https://img.icons8.com/ios-filled/50/000000/github.png" alt="Github" className="icon" />
            Github
        </a>
        <a href={links.website}className="link">
            <img src="https://img.icons8.com/ios-filled/50/000000/twitter.png" alt="Twitter" className="icon" />
            Twitter
        </a>
        <a href={links.website} className="link">
            <img src="https://img.icons8.com/ios-filled/50/000000/instagram-new.png" alt="Instagram" className="icon" />
            Instagram
        </a>
        <a href={links.website}className="link">
            <img src="https://img.icons8.com/ios-filled/50/000000/facebook-new.png" alt="Facebook" className="icon" />
            Facebook
        </a>
        </div>

        </div>

        {/* <!-- Right Section --> */}
        <div className="profile-right">
        {/* <!-- User Info --> */}
        <div className="user-info">
            <h3>Full Name</h3>
            <p>{adminName}</p>
            <h3>Email</h3>
            <p>{adminEmail}</p>
            <h3>Phone</h3>
            <p>{adminphone}</p>
            <h3>Mobile</h3>
            <p>{adminmobile}</p>
            <h3>Address</h3>
            <p>{adminAdress}</p>
        </div>
        
        {/* <!-- Project Status --> */}
        <div className="project-status">
        <h3>Status</h3>
        {progress.map((project, index) => (
          <div className="progress-bar" key={index}>
            <span>{project.name}</span>
            <div className="progress">
              <div
                className="progress-fill"
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
            <input
              type="number"
              value={project.progress}
              className="progress-input"
            />
          </div>
        ))}
      </div>
        </div>
    </div>
    );
}
export default ProfileAdmin;