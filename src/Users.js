import React, { useState, useEffect } from 'react';
import './Users.css'; // Create this CSS file to style the Users component

const Users = ({ onBack }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('http://localhost:5000/users');
      const data = await response.json();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  return (
    <div className="users-page">
      <button onClick={onBack} className="back-btn">Back</button>
      <div className="logo-container">
        <img src={require('./logo.png')} alt="Task Tracker Logo" className="logo" />
      </div>
      <h2>User List</h2>
      <table className="users-table">
        <thead>
          <tr>
            <th>User Name</th>
            <th>Tasks Assigned</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.name}</td>
              <td>{user.taskCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
