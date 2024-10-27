import React, { useState, useEffect } from 'react';
import { FaUser, FaTasks, FaEye } from 'react-icons/fa';
import Tasks from './Tasks';
import LandingPage from './LandingPage';
import Login from './Login';
import './App.css';

// Utility function to generate a random color
const generateRandomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
};

function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [user, setUser] = useState('');
  const [sortByUser, setSortByUser] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState('');
  const [userColors, setUserColors] = useState({}); // Store user color mappings

  // Load tasks from the server on initial render
  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch('http://localhost:5000/tasks');
      const data = await response.json();
      setTasks(data);
    };

    fetchTasks();
  }, []);

  const addTask = async () => {
    if (newTask.trim()) {
      const assignedUser = user || 'None';

      // Assign a color if the user doesn't already have one
      if (!userColors[assignedUser]) {
        setUserColors((prevColors) => ({
          ...prevColors,
          [assignedUser]: generateRandomColor(),
        }));
      }

      const newTaskData = { text: newTask, completed: false, user: assignedUser };
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
      setUser('');
    }
  };

  const toggleTaskCompletion = async (index) => {
    const updatedTask = { ...tasks[index], completed: !tasks[index].completed };
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

  const getUserTaskCounts = () => {
    const userCounts = {};
    tasks.forEach(task => {
      if (task.user) {
        userCounts[task.user] = (userCounts[task.user] || 0) + 1;
      }
    });
    return userCounts;
  };

  const handleViewAssignedUsers = () => {
    if (isLoggedIn) {
      setIsPopupOpen(true);
    } else {
      alert('Please log in to view assigned users.');
    }
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
            <button onClick={handleViewAssignedUsers} className="red-btn">
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
            userColors={userColors} // Pass the user color map to Tasks component
          />

          {isPopupOpen && (
            <div className="popup">
              <h3>Assigned Users</h3>
              <p>Logged-In As: {loggedInUser}</p>
              <ul>
                {Object.entries(getUserTaskCounts()).map(([userName, count]) => (
                  <li key={userName} style={{ color: userColors[userName] }}>
                    {userName} - {count}
                  </li>
                ))}
              </ul>
              <button onClick={() => setIsPopupOpen(false)} className="close-btn">X</button>
            </div>
          )}

          <Login onLogin={(username) => {
            setIsLoggedIn(true);
            setLoggedInUser(username);
          }} />
        </>
      )}
    </div>
  );
}

export default App;
