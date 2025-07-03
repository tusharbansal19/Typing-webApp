import React from 'react';
import { Clock, RotateCcw } from 'lucide-react';

const Controls = ({ testDuration, setTestDuration, setTimeLeft, isActive, resetTest }) => (
  <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
    <div className="flex items-center gap-2">
      <Clock className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      <select
        value={testDuration}
        onChange={(e) => {
          setTestDuration(Number(e.target.value));
          setTimeLeft(Number(e.target.value));
        }}
        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
        disabled={isActive}
      >
        <option value={10}>10 seconds</option>
        <option value={30}>30 seconds</option>
        <option value={60}>1 minute</option>
        <option value={120}>2 minutes</option>
        <option value={300}>5 minutes</option>
      </select>
    </div>
    <button
      onClick={resetTest}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
    >
      <RotateCcw className="w-4 h-4" />
      Reset
    </button>
  </div>
);

export default Controls; 