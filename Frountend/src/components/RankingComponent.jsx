import React from 'react';

const Rankings = ({ rankings, darkMode }) => {
  return (
    <div
      className={`w-full max-w-2xl mx-auto p-6 mt-8 rounded-lg shadow-lg ${darkMode ? 'bg-gradient-to-br from-gray-800 to-black text-white' : 'bg-white text-gray-900'}`}
    >
      <h2 className="text-2xl font-semibold text-center mb-6">
        🏆 Top Rankings
      </h2>

      {rankings.length ? (
        <ul className="space-y-4">
          {rankings.map((player, index) => (
            <li
              key={player.id}
              className={`flex items-center justify-between p-4 rounded-lg shadow-md ${
                index === 0
                  ? 'bg-yellow-400 text-black font-bold'
                  : index === 1
                  ? 'bg-gray-400 text-white font-semibold'
                  : index === 2
                  ? 'bg-yellow-200 text-black font-semibold'
                  : darkMode
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <div className="flex items-center space-x-4">
                <span className="text-2xl font-semibold">{index + 1}</span>
                <div>
                  <p className="text-lg font-medium">{player.email.split("@")[0]}</p>
                  <p className="text-sm">{player.speed} WPM, {player.accuracy}% Accuracy</p>
                </div>
              </div>
              <span className="text-lg font-bold">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : ''}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">
          Rankings will be displayed here after the match ends.
        </p>
      )}
    </div>
  );
};

export default Rankings;
