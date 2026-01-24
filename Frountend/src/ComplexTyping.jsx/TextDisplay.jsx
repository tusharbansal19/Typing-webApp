import React from 'react';

const TextDisplay = ({ currentText, inputText, currentIndex, textRef, activeCharRef, getCharStyle, darkMode }) => (
  <div className="mb-4">
    <div
      ref={textRef}
      className="glass-card rounded-xl p-4 md:p-6 shadow-lg"
      style={{
        height: '180px', // Fixed height for exactly 3 lines
        overflow: 'auto',
        pointerEvents: 'none',
      }}
    >
      <div
        className="text-base sm:text-lg md:text-xl lg:text-2xl font-mono text-left w-full"
        style={{
          lineHeight: '2.5rem', // Fixed line height for consistent display
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
        }}
      >
        {currentText.split('').map((char, index) => (
          <span
            key={index}
            ref={index === currentIndex ? activeCharRef : null}
            className={`${getCharStyle(index)} px-0.5 rounded transition-colors duration-150`}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default TextDisplay; 