import React, { useRef, useEffect } from 'react';
import TextDisplay from './TextDisplay';
import TypingInput from './TypingInput';

const TypingArea = React.memo(() => {
  const activeCharRef = useRef(null);
  const textContainerRef = useRef(null);

  useEffect(() => {
    if (activeCharRef.current) {
      activeCharRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeCharRef.current]);

  return (
    <div>
      <TextDisplay activeCharRef={activeCharRef} textContainerRef={textContainerRef} />
      <TypingInput />
    </div>
  );
});

export default TypingArea; 