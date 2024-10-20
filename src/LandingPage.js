import React from 'react';
import './LandingPage.css'; 

const LandingPage = ({ onNavigateToTasks, onNavigateToUsers }) => {
  return (
    <div className="landing-page">
      <img src={require('./logo.png')} alt="Task Tracker Logo" className="large-logo" />
      <h1>Welcome to Tracker App</h1>
      <h2>This is a Task Tracking App for Productivity<br/>Use the button below to view, add, remove and mark tasks as complete</h2>      
      <div className="button-container">
        <button onClick={onNavigateToTasks} className="navigate-btn">Go to Tasks</button>        
      </div>
    </div>
  );
};

export default LandingPage;
