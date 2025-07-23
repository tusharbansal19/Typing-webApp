import React from 'react';

const TextDisplay = ({ currentText, inputText, currentIndex, textRef, activeCharRef, getCharStyle }) => (
  <div className="mb-8">
    <div
      ref={textRef}
      className="glass-card rounded-xl p-6 shadow-lg max-h-64"
      style={{
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <div className="text-xl md:text-2xl leading-relaxed font-monoz">
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