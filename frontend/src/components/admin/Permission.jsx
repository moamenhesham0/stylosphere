import "../../style/mainPageStyle/adminPageStyle/Permission.css";
import React, { useState } from "react";

function Permission() {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [permissionsPopup, setPermissionsPopup] = useState(false);
  const [permissions, setPermissions] = useState({});
  const [emailInput, setEmailInput] = useState("");
  const [email2Input, setEmail2Input] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [permissionLevelInput, setPermissionLevelInput] = useState(""); // Corrected typo
  const [statusMsg, setStatus] = useState("");
  const [status2Msg, setStatus2] = useState("");
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

  const deleteMember = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/customers/delete-admin?email=${encodeURIComponent(emailInput)}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        const data = await response.json();
        setStatus2(data.message || "Admin deleted successfully.");
        setTimeout(() => setStatus2(null), 3000);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "Failed to delete admin."}`);
      }
    } catch (error) {
      console.error("Error sending data to backend:", error);
      alert("An error occurred while sending data.");
    }
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

        <h2>Delete Member</h2>
        <div className="status-msg">{status2Msg}</div>
        <input
          type="text"
          placeholder="Enter member's email"
          value={email2Input}
          onChange={(e) => setEmail2Input(e.target.value)}  // Corrected event handler
        />

        <button onClick={deleteMember}>Delete Member</button>
        
      </div>

    </div>
  );
}

export default Permission;

