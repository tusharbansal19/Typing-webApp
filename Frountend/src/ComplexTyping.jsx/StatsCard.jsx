import React from 'react';

const StatsCard = ({ icon: Icon, label, value, color = "blue" }) => {
  const colorClasses = {
    blue: "text-blue-900 bg-blue-200/90 dark:bg-blue-900/40",
    green: "text-green-900 bg-green-200/90 dark:bg-green-900/40",
    red: "text-red-900 bg-red-200/90 dark:bg-red-900/40",
    yellow: "text-yellow-900 bg-yellow-200/90 dark:bg-yellow-900/40",
    purple: "text-purple-900 bg-purple-200/90 dark:bg-purple-900/40"
  };

  return (
    <div className={`glass-card p-4 rounded-xl ${colorClasses[color]} transition-all duration-300 hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-black dark:text-gray-100 drop-shadow-md">{label}</p>
          <p className="text-2xl font-extrabold text-black dark:text-white drop-shadow-md">{value}</p>
        </div>
        <Icon className={`w-8 h-8 ${colorClasses[color].split(' ')[0]} drop-shadow-md`} />
      </div>
    </div>
  );
};

export default StatsCard; 