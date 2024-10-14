import React from 'react';
import './Users.css'; // Create this CSS file to style the Users component

const Users = ({ users, onBack }) => {
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
