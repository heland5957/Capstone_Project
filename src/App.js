import React, { useState } from 'react';
import { FaUser, FaTasks } from 'react-icons/fa'; // Import the icons
import Tasks from './Tasks';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [user, setUser] = useState('');
  const [sortByUser, setSortByUser] = useState(false);

  const addTask = () => {
    if (newTask.trim()) {
      const updatedTasks = [...tasks, { text: newTask, completed: false, user: user || 'None' }];
      setTasks(updatedTasks);
      setNewTask('');
    }
  };

  const toggleTaskCompletion = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const removeTask = (index) => {
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

  return (
    <div className="App">
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
    </div>
  );
}

export default App;
