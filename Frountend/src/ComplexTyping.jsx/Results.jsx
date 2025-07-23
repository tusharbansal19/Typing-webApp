import React from 'react';
import { Line } from 'react-chartjs-2';

const Results = ({ isFinished, wpm, accuracy, correctChars, mistakes, testDuration, progressData }) => (
  isFinished ? (
    <div className="glass-card rounded-xl p-6 shadow-lg w-full h-full">
      <h2 className="text-2xl font-extrabold text-center mb-6 bg-gradient-to-r from-green-600 to-blue-700 dark:from-green-200 dark:to-blue-300 bg-clip-text text-transparent drop-shadow-lg">
        Test Complete! 🎉
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-3xl font-extrabold text-green-900 dark:text-green-200 drop-shadow-lg">{wpm}</div>
          <div className="text-sm text-black dark:text-gray-100">WPM</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-extrabold text-blue-900 dark:text-blue-200 drop-shadow-lg">{accuracy}%</div>
          <div className="text-sm text-black dark:text-gray-100">Accuracy</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-extrabold text-purple-900 dark:text-purple-200 drop-shadow-lg">{correctChars}</div>
          <div className="text-sm text-black dark:text-gray-100">Correct</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-extrabold text-red-900 dark:text-red-200 drop-shadow-lg">{mistakes}</div>
          <div className="text-sm text-black dark:text-gray-100">Mistakes</div>
        </div>
      </div>
      {/* Progress Chart (moved from TypingChartOrKeyboard) */}
      {isFinished && progressData && progressData.length > 1 && (
        (() => {
          const interval = 20;
          const times = [];
          for (let t = 0; t <= testDuration; t += interval) times.push(t);
          const wpmMap = {};
          progressData.forEach(d => { wpmMap[d.time] = d.wpm; });
          let lastWpm = 0;
          const wpmPoints = times.map(t => {
            if (wpmMap.hasOwnProperty(t)) lastWpm = wpmMap[t];
            return lastWpm;
          });
          if (wpmPoints.length <= 1) {
            return <div className="text-center text-gray-500 dark:text-gray-300 mb-8">Not enough data to display chart.</div>;
          }
          return (
            <div className="glass-card rounded-xl p-6 shadow-lg mb-8 mx-auto md:max-w-[700px]">
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
        })()
      )}
    </div>
  ) : null
);

export default Results; 