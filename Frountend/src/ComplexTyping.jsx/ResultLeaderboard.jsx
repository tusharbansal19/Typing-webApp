import React, { useEffect } from 'react';
import { FaMedal, FaTrophy, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const colorMap = [
  'from-yellow-400 to-yellow-600 text-yellow-900', // Gold
  'from-gray-300 to-gray-500 text-gray-900',      // Silver
  'from-orange-400 to-orange-700 text-orange-900',// Bronze
  'from-blue-300 to-blue-500 text-blue-900',      // 4th
  'from-purple-300 to-purple-500 text-purple-900', // 5th
];

const iconMap = [
  <FaTrophy className="text-yellow-400 drop-shadow-lg" size={32} />,
  <FaMedal className="text-gray-400 drop-shadow-lg" size={28} />,
  <FaMedal className="text-orange-500 drop-shadow-lg" size={28} />,
  <FaStar className="text-blue-400 drop-shadow-lg" size={24} />,
  <FaStar className="text-purple-400 drop-shadow-lg" size={24} />,
];

const ResultLeaderboard = ({ ranked = [] }) => {


  console.log("this is rank ",ranked);
  const navigate = useNavigate();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/host');
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="w-full max-w-2xl mx-auto my-8 p-6 rounded-2xl shadow-2xl bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700">
      <h2 className="text-3xl font-extrabold text-center mb-8 bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
        🏆 Top 5 Typing Champions
      </h2>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {ranked.map((user, idx) => (
          <li
            key={user.email}
            className={`flex items-center justify-between py-4 px-2 md:px-6 rounded-xl mb-2 bg-gradient-to-r ${colorMap[idx] || 'from-gray-100 to-gray-300 text-gray-800'} shadow-lg transition-all duration-300`}
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                {iconMap[idx] || <FaStar className="text-gray-400" size={20} />}
              </div>
              <div>
                <div className="text-lg md:text-2xl font-bold">
                  {user.name || user.email}
                </div>
                <div className="text-xs md:text-sm text-gray-700 dark:text-gray-300 font-mono">{user.email}</div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-2xl md:text-3xl font-extrabold tracking-wider">
                {user.wpm} <span className="text-base font-semibold">WPM</span>
              </span>
              <span className="mt-1 px-3 py-1 rounded-full text-sm font-bold bg-white/80 dark:bg-gray-900/80 border border-gray-300 dark:border-gray-700 shadow">
                #{user.position}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResultLeaderboard; 