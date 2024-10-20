const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory storage for tasks
let tasks = [];

// Get tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// Add a new task
app.post('/tasks', (req, res) => {
  const { text, completed, user } = req.body;
  const newTask = { text, completed, user };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Update a task
app.put('/tasks/:index', (req, res) => {
  const index = req.params.index;
  tasks[index] = req.body;
  res.json(tasks[index]);
});

// Delete a task
app.delete('/tasks/:index', (req, res) => {
  const index = req.params.index;
  tasks.splice(index, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
