import React, { useState, useEffect } from 'react';
import { FaUser, FaTasks, FaEye } from 'react-icons/fa'; // Import the icons
import Tasks from './Tasks';
import LandingPage from './LandingPage';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('landing'); // Track the current view
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [user, setUser] = useState('');
  const [sortByUser, setSortByUser] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State for controlling popup visibility

  // Load tasks from the server on initial render
  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch('http://localhost:5000/tasks');
      const data = await response.json();
      setTasks(data);
    };

    fetchTasks();
  }, []);

  // Add a new task using the server
  const addTask = async () => {
    if (newTask.trim()) {
      const newTaskData = { text: newTask, completed: false, user: user || 'None' };
      const response = await fetch('http://localhost:5000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTaskData),
      });

      const addedTask = await response.json();
      setTasks([...tasks, addedTask]);
      setNewTask('');
    }
  };

  const toggleTaskCompletion = async (index) => {
    const updatedTask = { ...tasks[index], completed: !tasks[index].completed };

    // Update the task on the server
    await fetch(`http://localhost:5000/tasks/${index}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTask),
    });

    const updatedTasks = tasks.map((task, i) => (i === index ? updatedTask : task));
    setTasks(updatedTasks);
  };

  const removeTask = async (index) => {
    // Delete the task from the server
    await fetch(`http://localhost:5000/tasks/${index}`, {
      method: 'DELETE',
    });

    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const handleSortToggle = () => {
    setSortByUser(!sortByUser);
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortByUser) {
      return a.user.localeCompare(b.user);
    } else {
      return a.text.localeCompare(b.text);
    }
  });

  const navigateToTasks = () => {
    setCurrentView('tasks');
  };

  const navigateToLanding = () => {
    setCurrentView('landing');
  };

  // Function to get user task counts
  const getUserTaskCounts = () => {
    const userCounts = {};
    tasks.forEach(task => {
      if (task.user) {
        userCounts[task.user] = (userCounts[task.user] || 0) + 1;
      }
    });
    return userCounts;
  };

  return (
    <div className="App">
      {currentView === 'landing' && (
        <LandingPage onNavigateToTasks={navigateToTasks} />
      )}
      {currentView === 'tasks' && (
        <>
          <button onClick={navigateToLanding} className="back-btn">Back</button>
          <div className="logo-progress-container">
            <img src={require('./logo.png')} alt="Task Tracker Logo" className="logo" />
          </div>
          <div className="input-container">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter a new task"
            />
            <button onClick={addTask} className="add-btn"></button>
            <input
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="Assign user"
              className="user-assign-input"
            />
            <button onClick={() => setIsPopupOpen(true)} className="red-btn">
              <FaEye size={24} />
            </button>
            <button onClick={handleSortToggle} className="sort-btn">
              {sortByUser ? <FaTasks size={24} /> : <FaUser size={24} />}
            </button>
          </div>

          <Tasks
            tasks={sortedTasks}
            toggleTaskCompletion={toggleTaskCompletion}
            removeTask={removeTask}
            currentUser={user}
          />

          {isPopupOpen && (
            <div className="popup">
              <h3>Assigned Users</h3>
              <ul>
                {Object.entries(getUserTaskCounts()).map(([userName, count]) => (
                  <li key={userName}>{userName} - {count}</li>
                ))}
              </ul>
              <button onClick={() => setIsPopupOpen(false)} className="close-btn">X</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
