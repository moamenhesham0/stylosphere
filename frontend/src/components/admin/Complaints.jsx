import "../../style/mainPageStyle/adminPageStyle/Permission.css";
import React, { useState, useEffect } from "react";

function Complaints() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await fetch("http://localhost:8080/complaints/all");
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        setComplaints(data);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    };

    fetchComplaints();
  }, []);

  return (
    <div className="admin-page">
      <h1>Complaints</h1>
      <div className="section">
        {complaints.map((complaint, index) => (
          <React.Fragment key={index}>
            <div className="complaint">
              <p><strong>Email:</strong> {complaint.senderEmail}</p>
              <p><strong>Name:</strong> {complaint.name}</p>
              <p><strong>Complaint:</strong> {complaint.complain}</p>
            </div>
            <hr />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default Complaints;

