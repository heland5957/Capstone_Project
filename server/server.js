const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid'); // UUID library for generating unique IDs

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

let tasks = []; // Array to hold tasks
let users = []; // Array to hold users

// Endpoint to get tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// Endpoint to create a new task
app.post('/tasks', (req, res) => {
  const { text, completed = false, user } = req.body;
  const newTask = { id: uuidv4(), text, completed, user };

  // Add user to users array if not already present
  if (user) {
    const existingUser = users.find(u => u.name === user);
    if (!existingUser) {
      users.push({ name: user, taskCount: 1 }); // Initialize new user with task count
    } else {
      existingUser.taskCount += 1; // Increment task count for existing user
    }
  }

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Endpoint to update a task
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { text, completed, user } = req.body;
  const taskIndex = tasks.findIndex(task => task.id === id);

  if (taskIndex !== -1) {
    tasks[taskIndex] = { ...tasks[taskIndex], text, completed, user };
    res.status(200).json(tasks[taskIndex]);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

// Endpoint to delete a task
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const taskIndex = tasks.findIndex(task => task.id === id);

  if (taskIndex !== -1) {
    const removedTask = tasks[taskIndex];
    tasks.splice(taskIndex, 1);

    // Update user task count
    if (removedTask.user) {
      const userObj = users.find(u => u.name === removedTask.user);
      if (userObj) {
        userObj.taskCount -= 1;
        if (userObj.taskCount === 0) {
          users = users.filter(u => u.name !== removedTask.user); // Remove user if no tasks remain
        }
      }
    }

    res.status(200).json({ message: 'Task deleted' });
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

// Endpoint to get users
app.get('/users', (req, res) => {
  res.json(users);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
