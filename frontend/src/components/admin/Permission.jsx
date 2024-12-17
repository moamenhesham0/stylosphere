import "../../style/mainPageStyle/adminPageStyle/Permission.css";
import React, { useState } from "react";

function Permission() {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [permissionsPopup, setPermissionsPopup] = useState(false);
  const [permissions, setPermissions] = useState({});

  const [products] = useState([
    { name: "Product A", sales: 120 },
    { name: "Product B", sales: 95 },
    { name: "Product C", sales: 30 },
    { name: "Product D", sales: 200 },
  ]);

  const [newMemberName, setNewMemberName] = useState("");


  const addMember = () => {
    if (newMemberName.trim() === "") return alert("Member name is required.");
    setMembers([...members, { name: newMemberName, permissions: {} }]);
    setNewMemberName("");
  };

  const openPermissionsPopup = (member) => {
    setSelectedMember(member);
    setPermissions(member.permissions || {}); 
    setPermissionsPopup(true);
  };


  const togglePermission = (permission) => {
    setPermissions((prev) => ({
      ...prev,
      [permission]: !prev[permission], 
    }));
  };


  const savePermissions = () => {
    setMembers((prev) =>
      prev.map((member) =>
        member.name === selectedMember.name
          ? { ...member, permissions: permissions } 
          : member
      )
    );
    setPermissionsPopup(false); 
    setSelectedMember(null);
  };

  
  const sendToBackend = async () => {
    try {
      const response = await fetch("https://8080", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(members), 
      });
      if (response.ok) {
        alert("Members and permissions sent successfully!");
      } else {
        alert("Failed to send data. Please try again.");
      }
    } catch (error) {
      console.error("Error sending data to backend:", error);
      alert("An error occurred while sending data.");
    }
  };

  const mostSellingProduct = products.reduce((max, p) =>
    p.sales > max.sales ? p : max
  );
  const leastSellingProduct = products.reduce((min, p) =>
    p.sales < min.sales ? p : min
  );

  return (
    <div className="admin-page">
      <h1>Permissions</h1>

      {/* Add New Member Section */}
      <div className="section">
        <h2>Add New Member</h2>
        <input
          type="text"
          placeholder="Enter member's email"
          value={newMemberName}
          onChange={(e) => setNewMemberName(e.target.value)}
        />
        <button onClick={addMember}>Add Member</button>
      </div>

      {/* Manage Member Permissions Section */}
      <div className="section">
        <h2>Manage Member Permissions</h2>
        <ul>
          {members.map((member, index) => (
            <li key={index}>
              {member.name}{" "}
              <button onClick={() => openPermissionsPopup(member)}>
                Manage Permissions
              </button>
            </li>
          ))}
        </ul>
        <button onClick={sendToBackend}>Save</button>
      </div>

      {/* Product Review Section */}


      {permissionsPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Manage Permissions for {selectedMember.name}</h3>
            <ul className="permissions-list">
              {["makeAdmin", "View", "Delete", "alowed to add"].map((perm, index) => (
                <li key={index}>
                  <label>
                    <input
                      type="checkbox"
                      checked={permissions[perm] || false}
                      onChange={() => togglePermission(perm)}
                    />
                    {perm}
                  </label>
                </li>
              ))}
            </ul>
            <button onClick={savePermissions}>Save</button>
            <button onClick={() => setPermissionsPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Permission;
