import React, { useState, useEffect } from 'react';
import { FaUser, FaTasks } from 'react-icons/fa'; // Import the icons
import Tasks from './Tasks';
import LandingPage from './LandingPage';
import Users from './Users'; // Import the Users component
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('landing'); // Track the current view
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [user, setUser] = useState('');
  const [sortByUser, setSortByUser] = useState(false);

  const users = [
    { name: 'Admin', taskCount: 1 },
    { name: 'User1', taskCount: 1 },
    { name: 'User2', taskCount: 1 }
  ]; // Sample users, replace with actual user data

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

  const navigateToUsers = () => {
    setCurrentView('users');
  };

  const navigateToLanding = () => {
    setCurrentView('landing');
  };

  return (
    <div className="App">
      {currentView === 'landing' && (
        <LandingPage onNavigateToTasks={navigateToTasks} onNavigateToUsers={navigateToUsers} />
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
        </>
      )}
      {currentView === 'users' && (
        <>
          <button onClick={navigateToTasks} className="back-btn">Tasks</button>
          <Users users={users} onBack={navigateToLanding} />
        </>
      )}
    </div>
  );
}

export default App;
