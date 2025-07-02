import React from 'react';

const PageLoader = () => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 dark:from-gray-900 dark:via-blue-950 dark:to-gray-900">
    <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-500 dark:border-blue-400 mb-6"></div>
    <div className="text-2xl font-bold text-blue-700 dark:text-blue-300 tracking-wide animate-pulse">Loading...</div>
  </div>
);

export default PageLoader; 