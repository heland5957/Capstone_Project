import React from 'react';
import { FaCheck, FaUndo, FaTrash } from 'react-icons/fa'; // Import the icons

const Tasks = ({ tasks, toggleTaskCompletion, removeTask, currentUser }) => {
  return (
    <ul>
      {tasks.map((task, index) => (
        <li
          key={index}
          className={`task-item ${task.completed ? 'completed' : ''}`}
        >
          <span>{task.text} - {task.user}</span>
          <div className="task-buttons">
            {/* Conditionally render Complete or Undo button */}
            {!task.completed && (
              <button
                onClick={() => toggleTaskCompletion(index)}
                className="complete-btn"
              >
                <FaCheck />
              </button>
            )}
            {task.completed && (
              <button
                onClick={() => toggleTaskCompletion(index)}
                className="undo-btn"
              >
                <FaUndo />
              </button>
            )}
            {/* Always show the Remove button */}
            <button
              onClick={() => removeTask(index)}
              className="remove-btn"
            >
              <FaTrash />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default Tasks;
