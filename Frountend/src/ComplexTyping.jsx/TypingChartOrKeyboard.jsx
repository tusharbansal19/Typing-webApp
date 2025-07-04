import React from 'react';
import VirtualKeyboard from './VirtualKeyboard.jsx';

const TypingChartOrKeyboard = ({ pressedKey, isCorrectKey, isIncorrectKey }) => {
  return (
    <VirtualKeyboard
      pressedKey={pressedKey}
      isCorrect={isCorrectKey}
      isIncorrect={isIncorrectKey}
    />
  );
};

export default TypingChartOrKeyboard; 