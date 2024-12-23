import "../../style/mainPageStyle/adminPageStyle/Permission.css";
import React, { useState } from "react";

function Permission() {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [permissionsPopup, setPermissionsPopup] = useState(false);
  const [permissions, setPermissions] = useState({});
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [permissionLevelInput, setPermissionLevelInput] = useState(""); // Corrected typo
  const [statusMsg, setStatus] = useState("");
  const [products] = useState([
    { name: "Product A", sales: 120 },
    { name: "Product B", sales: 95 },
    { name: "Product C", sales: 30 },
    { name: "Product D", sales: 200 },
  ]);

  // Add Member Handler
  const addMemberHandler = () => {
    const execute = async () => {
      try {
        // Await the response from the API
        const response = await addMemberAPI();
  
        // Assuming response is a string (e.g., "user added successfully")
        setStatus(response);
  
        // Clear the status after 1 second
        setTimeout(() => setStatus(null), 3000);
      } catch (error) {
        // Handle errors in the execution flow
        console.error("Error adding member:", error);
        setStatus("Failed to add member"); // Optionally, show an error message
      }
    };
  
    execute(); // Call the async execute function
  };
  

  const addMemberAPI = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/customers/add-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailInput,
          password: passwordInput,
          adminLevel: permissionLevelInput,
        }),
      });
  
      // Handle response
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      return data.status;  // Assuming backend returns a JSON response with 'status' key
    } catch (error) {
      console.error("Error sending data to backend:", error);
      alert("An error occurred while sending data.");
    }
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
        <div className="status-msg">{statusMsg}</div>
        <input
          type="text"
          placeholder="Enter member's email"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}  // Corrected event handler
        />

        <input
          type="password"
          placeholder="Enter member's password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}  // Corrected event handler
        />

        <input
          type="text"
          placeholder="Enter member's role"
          value={permissionLevelInput}
          onChange={(e) => setPermissionLevelInput(e.target.value)}  // Corrected event handler
        />

        <button onClick={addMemberHandler}>Add Member</button>
        
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
        {/* Removed sendToBackend button */}
      </div>

      {/* Product Review Section */}

      {permissionsPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Manage Permissions for {selectedMember.name}</h3>
            <ul className="permissions-list">
              {["makeAdmin", "View", "Delete", "allowed to add"].map(
                (perm, index) => (
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
                )
              )}
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

