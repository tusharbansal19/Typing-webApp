import React from 'react';
import KeyboardKey from './KeyboardKey.jsx';
import { Keyboard } from 'lucide-react';

const KEYBOARD_LAYOUT = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm']
];

const VirtualKeyboard = ({ pressedKey, isCorrect, isIncorrect }) => {
  return (
    <div className="glass-card rounded-xl p-3 md:p-6 shadow-lg mb-4 md:mb-8">
      <div className="flex items-center justify-center mb-3 md:mb-4">
        <Keyboard className="w-5 h-5 md:w-6 md:h-6 mr-2 text-blue-600 dark:text-blue-200 drop-shadow-lg" />
        <h3 className="text-base md:text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-500 dark:from-blue-200 dark:to-purple-300 bg-clip-text text-transparent drop-shadow-lg">
          Virtual Keyboard
        </h3>
      </div>
      <div className="flex flex-col items-center space-y-1 md:space-y-2">
        {KEYBOARD_LAYOUT.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center">
            {row.map((key) => (
              <KeyboardKey
                key={key}
                keyChar={key}
                isPressed={pressedKey === key}
                isCorrect={isCorrect}
                isIncorrect={isIncorrect}
              />
            ))}
          </div>
        ))}
        {/* Spacebar */}
        <div className="flex justify-center mt-1 md:mt-2">
          <div
            className={`
              flex items-center justify-center w-32 md:w-40 h-8 md:h-10 rounded-lg font-semibold text-xs md:text-base
              transition-all duration-500 ease-in-out
              ${pressedKey === ' '
                ? isCorrect
                  ? 'bg-green-400/80 text-white shadow-[0_0_8px_2px_rgba(34,197,94,0.7)] dark:shadow-[0_0_12px_4px_rgba(255,255,255,0.7)]'
                  : isIncorrect
                    ? 'bg-red-400/80 text-white shadow-[0_0_8px_2px_rgba(239,68,68,0.7)] dark:shadow-[0_0_12px_4px_rgba(255,255,255,0.7)]'
                    : 'bg-yellow-300/80 text-black shadow-[0_0_8px_2px_rgba(253,224,71,0.7)] dark:shadow-[0_0_12px_4px_rgba(255,255,255,0.7)]'
                : 'bg-white/60 dark:bg-gray-700/60 hover:bg-white/80 dark:hover:bg-gray-600/80 backdrop-blur-md border border-white/30 dark:border-gray-500/30'
              }
            `}
          >
            SPACE
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualKeyboard; 