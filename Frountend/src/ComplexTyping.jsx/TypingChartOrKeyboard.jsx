import React from 'react';
import { Line } from 'react-chartjs-2';
import VirtualKeyboard from './VirtualKeyboard.jsx';

const TypingChartOrKeyboard = ({ isFinished, testDuration, progressData, pressedKey, isCorrectKey, isIncorrectKey }) => {
  if (isFinished) {
    // Build x-axis: 0, 5, 10, ..., testDuration
    const interval = 5;
    const times = [];
    for (let t = 0; t <= testDuration; t += interval) times.push(t);
    // Map progressData to a dict for fast lookup
    const wpmMap = {};
    progressData.forEach(d => { wpmMap[d.time] = d.wpm; });
    // Build y-axis: for each time, use the closest previous WPM value
    let lastWpm = 0;
    const wpmPoints = times.map(t => {
      if (wpmMap.hasOwnProperty(t)) lastWpm = wpmMap[t];
      return lastWpm;
    });
    // If no data, show message
    if (wpmPoints.length <= 1) {
      return <div className="text-center text-gray-500 dark:text-gray-300 mb-8">Not enough data to display chart.</div>;
    }
    return (
      <div className="glass-card rounded-xl p-6 shadow-lg mb-8">
        <h3 className="text-xl font-bold mb-4 text-center bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-200 dark:to-purple-300 bg-clip-text text-transparent drop-shadow-lg">
          Progress Chart (WPM every 5 seconds)
        </h3>
        <Line
          data={{
            labels: times.map(t => `${t}s`),
            datasets: [
              {
                label: 'WPM',
                data: wpmPoints,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(99,102,241,0.2)',
                pointBackgroundColor: '#a21caf',
                tension: 0.3,
                borderWidth: 3,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              title: { display: false },
            },
            scales: {
              x: {
                title: { display: true, text: 'Time (s)', color: '#111' },
                ticks: { color: '#111' },
                grid: { color: 'rgba(0,0,0,0.07)' },
              },
              y: {
                title: { display: true, text: 'WPM', color: '#111' },
                ticks: { color: '#111' },
                grid: { color: 'rgba(0,0,0,0.07)' },
                beginAtZero: true,
              },
            },
          }}
          height={220}
        />
      </div>
    );
  }
  return (
    <VirtualKeyboard
      pressedKey={pressedKey}
      isCorrect={isCorrectKey}
      isIncorrect={isIncorrectKey}
    />
  );
};

export default TypingChartOrKeyboard; 