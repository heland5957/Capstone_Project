import React from 'react';
import './LandingPage.css'; 

const LandingPage = ({ onNavigateToTasks, onNavigateToUsers }) => {
  return (
    <div className="landing-page">
      <img src={require('./logo.png')} alt="Task Tracker Logo" className="large-logo" />
      <h2>Welcome to Tracker App</h2>
      <p>This is a Task Tracking App for Productivity<br/>Use the buttons below to view, add, remove and mark tasks as complete<br/>Or view assigned users</p>      
      <div className="button-container">
        <button onClick={onNavigateToTasks} className="navigate-btn">Go to Tasks</button>
        <button onClick={onNavigateToUsers} className="navigate-btn">View Users</button>
      </div>
    </div>
  );
};

export default LandingPage;
