const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

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
  const { text, completed, user } = req.body;
  const newTask = { text, completed, user };

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

// Endpoint to get users
app.get('/users', (req, res) => {
  res.json(users);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
