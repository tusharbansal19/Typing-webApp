import React from 'react';

const KeyboardKey = ({ keyChar, isPressed, isCorrect, isIncorrect }) => {
  const getKeyStyle = () => {
    if (isPressed) {
      if (isCorrect) return 'bg-green-500/90 text-white shadow-[0_0_12px_4px_rgba(34,197,94,0.3)] dark:shadow-[0_0_12px_4px_rgba(255,255,255,0.7)] transform scale-95';
      if (isIncorrect) return 'bg-red-500/90 text-white shadow-[0_0_12px_4px_rgba(239,68,68,0.3)] dark:shadow-[0_0_12px_4px_rgba(255,255,255,0.7)] transform scale-95';
      return 'bg-yellow-400/90 text-black shadow-[0_0_12px_4px_rgba(253,224,71,0.3)] dark:shadow-[0_0_12px_4px_rgba(255,255,255,0.7)] transform scale-95';
    }
    return 'bg-white/90 dark:bg-gray-700/60 hover:bg-white/100 dark:hover:bg-gray-600/80 backdrop-blur-md border border-white/50 dark:border-gray-500/30';
  };

  return (
    <div
      className={`
        flex items-center justify-center w-10 h-10 m-1 rounded-lg font-semibold
        transition-all duration-150 ease-in-out cursor-pointer
        ${getKeyStyle()}
      `}
    >
      {keyChar.toUpperCase()}
    </div>
  );
};

export default KeyboardKey; 