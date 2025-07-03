import React from 'react';

const Results = ({ isFinished, wpm, accuracy, correctChars, mistakes }) => (
  isFinished ? (
    <div className="glass-card rounded-xl p-6 shadow-lg">
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
    </div>
  ) : null
);

export default Results; 