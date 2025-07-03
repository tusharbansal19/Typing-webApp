import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, Play, Pause, Trophy, Target, Clock, AlertCircle, Keyboard } from 'lucide-react';

// Text samples for typing test
const TEXT_SAMPLES = [  
"this is a very extensive string composed of random words and phrases designed to meet your specific length requirement it continues to grow with various vocabulary choices ensuring it surpasses the five hundred character mark without using any punctuation whatsoever only lowercase letters and spaces are present throughout its entirety providing a continuous flow of text for your needs we are carefully adding more words to increase its overall length making sure it remains well above your requested minimum this paragraph demonstrates a large block of text suitable for many applications where a long character sequence without special symbols is desired it keeps going and going with more random words and less meaning sometimes just for the sake of length and character count validation we hope this extended passage serves its purpose effectively this is a very extensive string composed of random words and phrases designed to meet your specific length requirement it continues to grow with various vocabulary choices ensuring it surpasses the five hundred character mark without using any punctuation whatsoever only lowercase letters and spaces are present throughout its entirety providing a continuous flow of text for your needs we are carefully adding more words to increase its overall length making sure it remains well above your requested minimum this paragraph demonstrates a large block of text suitable for many applications where a long character sequence without special symbols is desired it keeps going and going with more random words and less meaning sometimes just for the sake of length and character count validation we hope this extended passage serves its purpose effectively",
];

// Virtual keyboard layout
const KEYBOARD_LAYOUT = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm']
];

// Key component for virtual keyboard
const KeyboardKey = ({ keyChar, isPressed, isCorrect, isIncorrect }) => {
  const getKeyStyle = () => {
    if (isPressed) {
      if (isCorrect) return 'bg-green-500 text-white transform scale-95';
      if (isIncorrect) return 'bg-red-500 text-white transform scale-95';
      return 'bg-yellow-500 text-black transform scale-95';
    }
    return 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600';
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

// Virtual keyboard component
const VirtualKeyboard = ({ pressedKey, isCorrect, isIncorrect }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-center mb-4">
        <Keyboard className="w-6 h-6 mr-2 text-gray-600 dark:text-gray-300" />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Virtual Keyboard
        </h3>
      </div>
      
      <div className="flex flex-col items-center space-y-2">
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
        <div className="flex justify-center mt-2">
          <div
            className={`
              flex items-center justify-center w-40 h-10 rounded-lg font-semibold
              transition-all duration-150 ease-in-out
              ${pressedKey === ' ' 
                ? isCorrect 
                  ? 'bg-green-500 text-white transform scale-95'
                  : isIncorrect 
                    ? 'bg-red-500 text-white transform scale-95'
                    : 'bg-yellow-500 text-black transform scale-95'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
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

// Stats card component
const StatsCard = ({ icon: Icon, label, value, color = "blue" }) => {
  const colorClasses = {
    blue: "text-blue-500 bg-blue-50 dark:bg-blue-900/20",
    green: "text-green-500 bg-green-50 dark:bg-green-900/20",
    red: "text-red-500 bg-red-50 dark:bg-red-900/20",
    yellow: "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20",
    purple: "text-purple-500 bg-purple-50 dark:bg-purple-900/20"
  };

  return (
    <div className={`p-4 rounded-xl ${colorClasses[color]} transition-all duration-300 hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{label}</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
        </div>
        <Icon className={`w-8 h-8 ${colorClasses[color].split(' ')[0]}`} />
      </div>
    </div>
  );
};

// Main typing interface component
const TypingInterface = () => {
  // Core state
  const [currentText, setCurrentText] = useState('');
  const [inputText, setInputText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(60);
  const [testDuration, setTestDuration] = useState(60);
  
  // Statistics state
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [mistakes, setMistakes] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  
  // Keyboard state
  const [pressedKey, setPressedKey] = useState('');
  const [isCorrectKey, setIsCorrectKey] = useState(false);
  const [isIncorrectKey, setIsIncorrectKey] = useState(false);
  
  // Refs
  const timerRef = useRef(null);
  const textRef = useRef(null);
  const activeCharRef = useRef(null);
  const mistakesRef = useRef(0);
  const correctCharsRef = useRef(0);
  const startTimeRef = useRef(null);

  // Initialize text
  useEffect(() => {
    resetTest();
  }, []);

  // Auto-scroll to active character
  useEffect(() => {
    if (activeCharRef.current) {
      activeCharRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
    }
  }, [currentIndex]);

  // Calculate WPM and accuracy
  const calculateStats = useCallback(() => {
    const timeElapsed = testDuration - timeLeft;
    const wordsTyped = correctCharsRef.current / 5; // Standard: 5 characters = 1 word
    const currentWpm = timeElapsed > 0 ? Math.round((wordsTyped / timeElapsed) * 60) : 0;
    const totalChars = correctCharsRef.current + mistakesRef.current;
    const currentAccuracy = totalChars > 0 ? Math.round((correctCharsRef.current / totalChars) * 100) : 100;
    
    setWpm(currentWpm);
    setAccuracy(currentAccuracy);
    setMistakes(mistakesRef.current);
    setCorrectChars(correctCharsRef.current);
  }, [timeLeft, testDuration]);

  // Timer logic
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsActive(false);
            setIsFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

  // Update stats regularly
  useEffect(() => {
    calculateStats();
  }, [inputText, calculateStats]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (isFinished) return;
      
      const key = event.key;
      setPressedKey(key);
      
      // Start test on first keypress
      if (!isStarted) {
        setIsStarted(true);
        setIsActive(true);
        startTimeRef.current = Date.now();
      }
      
      // Handle special keys
      if (key === 'Backspace') {
        event.preventDefault();
        if (currentIndex > 0 && currentText[currentIndex - 1] !== ' ') {
          setCurrentIndex(prev => prev - 1);
          setInputText(prev => prev.slice(0, -1));
          // Adjust counters for backspace
          if (inputText[currentIndex - 1] === currentText[currentIndex - 1]) {
            correctCharsRef.current = Math.max(0, correctCharsRef.current - 1);
          } else {
            mistakesRef.current = Math.max(0, mistakesRef.current - 1);
          }
        }
        return;
      }
      
      // Handle spacebar for skipping words
      if (key === ' ' && currentIndex < currentText.length) {
        event.preventDefault();
        // Find the end of the current word
        let wordEnd = currentIndex;
        while (wordEnd < currentText.length && currentText[wordEnd] !== ' ') {
          wordEnd++;
        }
        // If already at a space, just move to next char
        if (currentText[currentIndex] === ' ') {
          setInputText(prev => prev + ' ');
          setCurrentIndex(prev => prev + 1);
        } else {
          // Skipped chars in the word
          const skippedCount = wordEnd - currentIndex;
          setInputText(prev => prev + '$'.repeat(skippedCount));
          let nextIndex = wordEnd;
          // Move past any spaces to the next word's first character
          while (nextIndex < currentText.length && currentText[nextIndex] === ' ') {
            setInputText(prev => prev + ' ');
            nextIndex++;
          }
          setCurrentIndex(nextIndex);
          mistakesRef.current += skippedCount;
          // Check if test is complete
          if (nextIndex >= currentText.length) {
            setIsActive(false);
            setIsFinished(true);
          }
        }
        setIsCorrectKey(false);
        setIsIncorrectKey(true);
        setTimeout(() => {
          setPressedKey('');
          setIsCorrectKey(false);
          setIsIncorrectKey(false);
        }, 150);
        return;
      }
      
      // Handle printable characters
      if (key.length === 1 && currentIndex < currentText.length) {
        event.preventDefault();
        const expectedChar = currentText[currentIndex];
        const isCorrect = key === expectedChar;
        
        setInputText(prev => prev + key);
        setCurrentIndex(prev => prev + 1);
        
        if (isCorrect) {
          correctCharsRef.current++;
          setIsCorrectKey(true);
          setIsIncorrectKey(false);
        } else {
          mistakesRef.current++;
          setIsCorrectKey(false);
          setIsIncorrectKey(true);
        }
        
        // Check if test is complete
        if (currentIndex + 1 === currentText.length) {
          setIsActive(false);
          setIsFinished(true);
        }
      }
      
      // Clear key press visual feedback
      setTimeout(() => {
        setPressedKey('');
        setIsCorrectKey(false);
        setIsIncorrectKey(false);
      }, 150);
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, currentText, inputText, isFinished, isStarted]);

  // Reset test
  const resetTest = () => {
    clearInterval(timerRef.current);
    setCurrentText(TEXT_SAMPLES[Math.floor(Math.random() * TEXT_SAMPLES.length)]);
    setInputText('');
    setCurrentIndex(0);
    setIsActive(false);
    setIsStarted(false);
    setIsFinished(false);
    setTimeLeft(testDuration);
    setWpm(0);
    setAccuracy(100);
    setMistakes(0);
    setCorrectChars(0);
    mistakesRef.current = 0;
    correctCharsRef.current = 0;
    startTimeRef.current = null;
    setPressedKey('');
    setIsCorrectKey(false);
    setIsIncorrectKey(false);
  };

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get character style
  const getCharStyle = (index) => {
    if (index < inputText.length) {
      if (inputText[index] === '$') {
        return 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200';
      }
      return inputText[index] === currentText[index] 
        ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200' 
        : 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200';
    }
    if (index === currentIndex) {
      return 'bg-blue-500 text-white animate-pulse';
    }
    return 'text-gray-700 dark:text-gray-300';
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Typing Speed Test
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Test your typing speed and accuracy
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <select
              value={testDuration}
              onChange={(e) => {
                setTestDuration(Number(e.target.value));
                setTimeLeft(Number(e.target.value));
              }}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              disabled={isActive}
            >
              <option value={30}>30 seconds</option>
              <option value={60}>1 minute</option>
              <option value={120}>2 minutes</option>
              <option value={300}>5 minutes</option>
            </select>
          </div>
          
          <button
            onClick={resetTest}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatsCard icon={Clock} label="Time Left" value={formatTime(timeLeft)} color="blue" />
          <StatsCard icon={Target} label="WPM" value={wpm} color="green" />
          <StatsCard icon={Trophy} label="Accuracy" value={`${accuracy}%`} color="purple" />
          <StatsCard icon={AlertCircle} label="Mistakes" value={mistakes} color="red" />
        </div>

        {/* Start prompt */}
        {!isStarted && (
          <div className="text-center mb-8">
            <p className="text-2xl text-gray-600 dark:text-gray-300 animate-pulse">
              Press any key to start typing...
            </p>
          </div>
        )}

        {/* Text display */}
        <div className="mb-8">
          <div
            ref={textRef}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg max-h-64 overflow-y-auto"
          >
            <div className="text-xl md:text-2xl leading-relaxed font-mono">
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

        {/* Virtual keyboard */}
        <div className="mb-8">
          <VirtualKeyboard
            pressedKey={pressedKey}
            isCorrect={isCorrectKey}
            isIncorrect={isIncorrectKey}
          />
        </div>

        {/* Results */}
        {isFinished && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-200">
              Test Complete! 🎉
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{wpm}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">WPM</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{accuracy}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{correctChars}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{mistakes}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Mistakes</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TypingInterface;