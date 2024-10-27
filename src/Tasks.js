import React, { useMemo } from 'react';
import { FaCheck, FaUndo, FaTrash } from 'react-icons/fa';

const Tasks = ({ tasks, toggleTaskCompletion, removeTask, currentUser }) => {
  // Generate and memoize a color map for each unique user
  const userColors = useMemo(() => {
    const colors = {};
    let colorIndex = 0;

    // Predefined color palette
    const colorPalette = [
      '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#33FFF6',
      '#FF8F33', '#8F33FF', '#FF3333', '#33FF8F', '#FF5733'
    ];

    tasks.forEach(task => {
      if (task.user && !colors[task.user]) {
        colors[task.user] = colorPalette[colorIndex % colorPalette.length];
        colorIndex++;
      }
    });

    return colors;
  }, [tasks]);

  return (
    <ul>
      {tasks.map((task, index) => (
        <li
          key={index}
          className={`task-item ${task.completed ? 'completed' : ''}`}
        >
          <span>
            {task.text} -{' '}
            <span style={{ color: userColors[task.user] }}>{task.user}</span>
          </span>
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
