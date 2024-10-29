import React from 'react';

const AdminLogin = () => {
  const handleViewAssignedUsers = () => {
    // Show a notification prompting for login
    const isAdmin = window.confirm("Please log in to view assigned users. Are you an admin?");

    if (isAdmin) {
      // Add your admin login logic here
      const password = prompt("Please enter your admin password:");
      // Check the password (you can implement your own logic)
      if (password === 'yourAdminPassword') {
        // Redirect or show assigned users if the password is correct
        alert("Access granted to view assigned users.");
        // You can call a function here to open the users popup
      } else {
        alert("Incorrect password. Access denied.");
      }
    }
  };

  return (
    <button onClick={handleViewAssignedUsers} className="red-btn">
      <FaEye size={24} />
    </button>
  );
};

export default AdminLogin;
