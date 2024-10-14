import React, { useEffect, useRef } from 'react';
import ProgressBar from 'progressbar.js';
import './ProgressBarComponent.css'; // Ensure you have styles if needed

const ProgressBarComponent = ({ progress, totalTasks }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      // Clean up the previous progress bar instance if it exists
      if (containerRef.current.progressBar) {
        containerRef.current.progressBar.destroy();
      }

      const bar = new ProgressBar.SemiCircle(containerRef.current, {
        strokeWidth: 5,
        color: '#FFEA82',
        trailColor: '#eee',
        trailWidth: 5,
        easing: 'easeInOut',
        duration: 1400,
        svgStyle: null,
        text: {
          value: '',
          alignToBottom: false
        },
        from: { color: '#FFEA82' },
        to: { color: '#ED6A5A' },
        step: (state, bar) => {
          bar.path.setAttribute('stroke', state.color);
          // Update the text to show the fraction
          const fraction = `${Math.round(bar.value() * totalTasks)}/${totalTasks}`;
          bar.setText(fraction);
          bar.text.style.color = state.color;
        }
      });

      containerRef.current.progressBar = bar; // Save the progress bar instance
      bar.animate(progress / 100); // Progress is between 0 and 100
    }
  }, [progress, totalTasks]);

  return <div ref={containerRef} className="progress-bar-container" />;
};

export default ProgressBarComponent;
