import React from 'react';
import { useSelector } from 'react-redux';

const TextDisplay = React.memo(({ activeCharRef, textContainerRef }) => {
  const currentText = useSelector((state) => state.match.currentText);
  const inputText = useSelector((state) => state.match.inputText);
  return (
    <div
      ref={textContainerRef}
      className="typing-text-container m-6 max-w-[900px] shadow-lg text-3xl font-semibold text-gray-500 bg-opacity-40 p-10 bg-gradient-to-r rounded-lg min-h-[200px] leading-[1.8]"
      onWheel={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {currentText.split("").map((char, idx) => (
        <span
          key={idx}
          className={
            idx === inputText.length
              ? "text-yellow-500 bg-yellow-200 rounded-sm"
              : idx < inputText.length
              ? inputText[idx] === char
                ? "text-green-500"
                : "text-red-500"
              : ""
          }
          ref={idx === inputText.length ? activeCharRef : null}
        >
          {char}
        </span>
      ))}
    </div>
  );
});

export default TextDisplay; 