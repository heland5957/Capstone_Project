import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders the task list title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Task List/i);
  expect(titleElement).toBeInTheDocument();
});

test('adds a new task', () => {
  render(<App />);
  const inputElement = screen.getByPlaceholderText(/Enter a new task/i);
  const addButton = screen.getByTitle('Add Task');

  // Simulate entering a task and clicking the add button
  fireEvent.change(inputElement, { target: { value: 'New Task' } });
  fireEvent.click(addButton);

  // Check if the new task is in the document
  const taskElement = screen.getByText(/New Task/i);
  expect(taskElement).toBeInTheDocument();
});

test('completes a task', () => {
  render(<App />);
  const inputElement = screen.getByPlaceholderText(/Enter a new task/i);
  const addButton = screen.getByTitle('Add Task');

  // Add a new task
  fireEvent.change(inputElement, { target: { value: 'Complete Task' } });
  fireEvent.click(addButton);

  // Mark the task as complete
  const completeButton = screen.getByTitle('Complete Task');
  fireEvent.click(completeButton);

  // Check if the task is marked as complete (line-through style)
  const taskElement = screen.getByText(/Complete Task/i);
  expect(taskElement).toHaveStyle('text-decoration: line-through');
});

test('removes a task', () => {
  render(<App />);
  const inputElement = screen.getByPlaceholderText(/Enter a new task/i);
  const addButton = screen.getByTitle('Add Task');

  // Add a new task
  fireEvent.change(inputElement, { target: { value: 'Remove Task' } });
  fireEvent.click(addButton);

  // Remove the task
  const removeButton = screen.getByTitle('Remove Task');
  fireEvent.click(removeButton);

  // Check if the task is removed from the document
  const taskElement = screen.queryByText(/Remove Task/i);
  expect(taskElement).not.toBeInTheDocument();
});
