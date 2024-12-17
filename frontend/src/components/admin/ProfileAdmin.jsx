import '../../style/mainPageStyle/adminPageStyle/AdminProfileStyle.css';
import React, { useEffect, useState } from "react";
import { useUser } from "../user/UserContext";

function ProfileAdmin() {
    const { user, updateUser } = useUser();
    const [adminName, setAdminName] = useState("user name");
    const [aboutAdmin, setAboutAdmin] = useState("full stack");
    const [adminAdress, setAdminAdress] = useState("Bay Area, San Francisco, CA");
    const [adminEmail, setAdminEmail] = useState("username@gmail.com");
    const [adminphone, setAdminPhone] = useState("(239) 816-9029");
    const [adminmobile, setAdminMobile] = useState("(320) 380-4539");
    const [adminImage, setAdminImage] = useState(null);
    const [progress, setProgress] = useState([
        { name: "Monthly Target", progress: 90 },
        { name: "Page Population", progress: 70 },
        { name: "Good Rates", progress: 3 },
        { name: "Bad Rates", progress: 100 },
    ]);

    useEffect(() => {
        if (user) {
            setAdminName(user.name);
            setAdminEmail(user.email);
            setAdminImage(user.image);
        }
    }, [user]);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64Image = reader.result.split(',')[1];
                sendImageToBackend(base64Image);
                setAdminImage(base64Image);
                updateUser({
                    ...user,
                    image: base64Image,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const sendImageToBackend = (base64Image) => {
        fetch('http://localhost:8080/api/customers/photo-upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: adminEmail,
                image: base64Image,
            }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const handleProgressChange = (index, newProgress) => {
        const updatedProgress = [...progress];
        updatedProgress[index].progress = newProgress;
        setProgress(updatedProgress);
        // Add logic here to send progress updates to the backend if needed
    };

    return (
        <div className="profile-container">
            {/* Left Section */}
            <div className="profile-left">
                <div
                    className="profile_image"
                    
                >
                    <img className='profile-image-left'
                        src={adminImage ? `data:image/jpeg;base64,${adminImage}` : "https://via.placeholder.com/100"}
                        alt="Profile Picture" onClick={() => document.getElementById('imageUpload').click()}
                    />
                </div>
                <h2>{adminName}</h2>
                <p>{aboutAdmin}</p>
                <p>{adminAdress}</p>

                {/* Hidden file input for image upload */}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    id="imageUpload"
                />

                <div className="social-links">
                    {/* Social Links */}
                    {/* Replace links dynamically if needed */}
                    <a href="#" className="link">
                        <img src="https://img.icons8.com/ios-filled/50/000000/domain.png" alt="Website" className="icon" />
                        Website
                    </a>
                    <a href="#" className="link">
                        <img src="https://img.icons8.com/ios-filled/50/000000/github.png" alt="Github" className="icon" />
                        Github
                    </a>
                    <a href="#" className="link">
                        <img src="https://img.icons8.com/ios-filled/50/000000/twitter.png" alt="Twitter" className="icon" />
                        Twitter
                    </a>
                    <a href="#" className="link">
                        <img src="https://img.icons8.com/ios-filled/50/000000/instagram-new.png" alt="Instagram" className="icon" />
                        Instagram
                    </a>
                    <a href="#" className="link">
                        <img src="https://img.icons8.com/ios-filled/50/000000/facebook-new.png" alt="Facebook" className="icon" />
                        Facebook
                    </a>
                </div>
            </div>

            {/* Right Section */}
            <div className="profile-right">
                {/* Admin Info */}
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

                {/* Project Status */}
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
                                onChange={(e) => handleProgressChange(index, Number(e.target.value))}
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
