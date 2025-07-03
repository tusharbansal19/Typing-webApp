// import React  from 'react';{ useEffect } from 'react';
import React, {useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setInputText, setPtr } from '../features/matchSlice';

const TypingInput = React.memo(() => {
  const dispatch = useDispatch();
  const isTyping = useSelector((state) => state.match.isTyping);
  const inputText = useSelector((state) => state.match.inputText);
  const currentText = useSelector((state) => state.match.currentText);
  const ptr = useSelector((state) => state.match.ptr);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!isTyping) return;
      event.preventDefault();
      if (inputText.length === currentText.length) return;
      if (ptr >= currentText.length) return;
      if (ptr < 0) return;
      if (event.key === ' ') {
        let s = '', i = ptr, len = currentText.length;
        while (currentText[i] !== ' ' && i < len) {
          s += '&';
          i++;
        }
        s += ' ';
        i++;
        dispatch(setPtr(i));
        dispatch(setInputText(inputText + s));
      } else if (event.key === 'Backspace' && inputText[ptr - 1] !== ' ') {
        dispatch(setInputText(inputText.slice(0, -1)));
        dispatch(setPtr(ptr - 1));
      } else if (/^[a-zA-Z\s]$/.test(event.key) || event.key === '.') {
        dispatch(setInputText(inputText + event.key));
        dispatch(setPtr(ptr + 1));
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isTyping, inputText, currentText, ptr, dispatch]);
  return null;
});

export default TypingInput; 