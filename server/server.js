const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid'); // UUID library for generating unique IDs
const rateLimit = require('express-rate-limit'); // Rate limiting middleware
const helmet = require('helmet'); // Helmet for setting HTTP headers

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(helmet()); // Enable security headers

// DDoS protection: Limit each IP to 100 requests per 15 minutes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests
  message: "Too many requests, please try again later."
});

// Apply rate limiting to all requests
app.use(apiLimiter);

let tasks = []; // Array to hold tasks
let users = []; // Array to hold users

// Function to validate task data
const validateTask = (task) => {
  const { text, completed, user } = task;
  if (typeof text !== 'string' || text.trim() === '') {
    return 'Task text must be a non-empty string.';
  }
  if (typeof completed !== 'undefined' && typeof completed !== 'boolean') {
    return 'Completed must be a boolean.';
  }
  if (user && typeof user !== 'string') {
    return 'User must be a string.';
  }
  return null; // Return null if valid
};

// Endpoint to get tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// Endpoint to create a new task
app.post('/tasks', (req, res) => {
  const validationError = validateTask(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

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
  const validationError = validateTask(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

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
