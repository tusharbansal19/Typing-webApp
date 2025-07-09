import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, Play, Pause, Trophy, Target, Clock, AlertCircle, Keyboard } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Text samples for typing test
const TEXT_SAMPLES = [  
"this is a very extensive string composed of random words and phrases designed to meet your specific length requirement it continues to grow with various vocabulary choices ensuring it surpasses the five hundred character mark without using any punctuation whatsoever only lowercase letters and spaces are present throughout its entirety providing a continuous flow of text for your needs we are carefully adding more words to increase its overall length making sure it remains well above your requested minimum this paragraph demonstrates a large block of text suitable for many applications where a long character sequence without special symbols is desired it keeps going and going with more random words and less meaning sometimes just for the sake of length and character count validation we hope this extended passage serves its purpose effectively this is a very extensive string composed of random words and phrases designed to meet your specific length requirement it continues to grow with various vocabulary choices ensuring it surpasses the five hundred character mark without using any punctuation whatsoever only lowercase letters and spaces are present throughout its entirety providing a continuous flow of text for your needs we are carefully adding more words to increase its overall length making sure it remains well above your requested minimum this paragraph demonstrates a large block of text suitable for many applications where a long character sequence without special symbols is desired it keeps going and going with more random words and less meaning sometimes just for the sake of length and character count validation we hope this extended passage serves its purpose effectively",
,
"learning new things is always an exciting adventure expanding your knowledge and understanding of the world around you every book you read every skill you acquire adds another layer to your personal growth and development the process of discovery can be incredibly rewarding opening up new perspectives and challenging your existing beliefs it encourages critical thinking and creativity allowing you to approach problems from different angles and find innovative solutions practice and persistence are key components in mastering any new subject or ability as consistent effort often leads to significant progress over time embracing mistakes as learning opportunities helps you refine your approach and build resilience the journey of continuous learning is endless with countless subjects and disciplines waiting to be explored it fosters curiosity and a lifelong passion for gaining insights into various fields whether it is science art history or technology there is always something fascinating to delve into and comprehend the more you learn the more you realize how much more there is to know which only fuels your desire for further exploration and intellectual enrichment making life a constant classroom of endless possibilities and exciting discoveries for every curious mind that seeks knowledge and understanding",
"a gentle breeze swept through the tall grass making soft rustling sounds that echoed across the open fields the sky above was a vast expanse of light blue with only a few wispy clouds drifting lazily across the horizon in the distance you could see the faint outline of mountains their peaks touching the edge of the world creating a picturesque backdrop for the tranquil landscape birds chirped happily from the trees their melodies adding to the serene ambiance of the afternoon a small stream meandered through the fields its clear water sparkling under the sunlight inviting creatures to quench their thirst and cool themselves on this warm day the air was filled with the sweet scent of wildflowers blooming in various colors painting the meadows with vibrant hues the world seemed to slow down in this idyllic setting offering a moment of peace and quiet reflection away from the hustle and bustle of everyday life it was a perfect day for contemplation a time to simply exist and appreciate the simple beauty that nature so freely offered to those who took the time to notice and immerse themselves in its calming presence a true escape from the ordinary into something truly extraordinary and profoundly refreshing for the mind body and soul a wonderful experience indeed",
"a gentle breeze swept through the tall grass making soft rustling sounds that echoed across the open fields the sky above was a vast expanse of light blue with only a few wispy clouds drifting lazily across the horizon in the distance you could see the faint outline of mountains their peaks touching the edge of the world creating a picturesque backdrop for the tranquil landscape birds chirped happily from the trees their melodies adding to the serene ambiance of the afternoon a small stream meandered through the fields its clear water sparkling under the sunlight inviting creatures to quench their thirst and cool themselves on this warm day the air was filled with the sweet scent of wildflowers blooming in various colors painting the meadows with vibrant hues the world seemed to slow down in this idyllic setting offering a moment of peace and quiet reflection away from the hustle and bustle of everyday life it was a perfect day for contemplation a time to simply exist and appreciate the simple beauty that nature so freely offered to those who took the time to notice and immerse themselves in its calming presence a true escape from the ordinary into something truly extraordinary and profoundly refreshing for the mind body and soul a wonderful experience indeed"];
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

// Virtual keyboard component
const VirtualKeyboard = ({ pressedKey, isCorrect, isIncorrect }) => {
  return (
    <div className="glass-card rounded-xl p-6 shadow-lg mb-8">
      <div className="flex items-center justify-center mb-4">
        <Keyboard className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-200 drop-shadow-lg" />
        <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-500 dark:from-blue-200 dark:to-purple-300 bg-clip-text text-transparent drop-shadow-lg">
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

// Stats card component
const StatsCard = ({ icon: Icon, label, value, color = "blue" }) => {
  const colorClasses = {
    blue: "text-blue-900 bg-blue-200/90 dark:bg-blue-900/40",
    green: "text-green-900 bg-green-200/90 dark:bg-green-900/40",
    red: "text-red-900 bg-red-200/90 dark:bg-red-900/40",
    yellow: "text-yellow-900 bg-yellow-200/90 dark:bg-yellow-900/40",
    purple: "text-purple-900 bg-purple-200/90 dark:bg-purple-900/40"
  };

  return (
    <div className={`glass-card p-4 rounded-xl ${colorClasses[color]} transition-all duration-300 hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-black dark:text-gray-100 drop-shadow-md">{label}</p>
          <p className="text-2xl font-extrabold text-black dark:text-white drop-shadow-md">{value}</p>
        </div>
        <Icon className={`w-8 h-8 ${colorClasses[color].split(' ')[0]} drop-shadow-md`} />
      </div>
    </div>
  );
};

// Main typing interface component
const TypingInterface = ({darkMode}) => {
  // Core state
  const [currentText, setCurrentText] = useState('');
  const [inputText, setInputText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  
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
  const [progressData, setProgressData] = useState([]); // Array of {time, wpm}
  const [intervalStep, setIntervalStep] = useState(0); // Track elapsed time in 5s steps

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
        inline: 'start'
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

  // Track WPM every 5 seconds and at start
  useEffect(() => {
    if (!isActive) return;
    // Add a data point at time 0 when test starts
    if (progressData.length === 0) {
      setProgressData([{ time: 0, wpm: 0 }]);
      setIntervalStep(0);
    }
    const interval = setInterval(() => {
      setIntervalStep(prev => {
        const nextStep = prev + 5;
        // Calculate WPM at this interval
        const elapsed = nextStep;
        const wordsTyped = correctCharsRef.current / 5;
        const currentWpm = elapsed > 0 ? Math.round((wordsTyped / elapsed) * 60) : 0;
        setProgressData(prevData => ([...prevData, { time: nextStep, wpm: currentWpm }]));
        return nextStep;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [isActive]);

  // Reset progress data and interval step on new test
  useEffect(() => {
    if (!isActive && !isStarted) {
      setProgressData([]);
      setIntervalStep(0);
    }
  }, [isActive, isStarted]);

  // Push a final WPM data point and fill missing intervals when the test ends
  useEffect(() => {
    if (isFinished && progressData.length > 0) {
      // Fill in missing intervals up to testDuration
      const last = progressData[progressData.length - 1];
      let filled = [...progressData];
      let t = last.time;
      const wordsTyped = correctCharsRef.current / 5;
      const finalWpm = t > 0 ? Math.round((wordsTyped / t) * 60) : 0;
      while (t < testDuration) {
        t += 5;
        filled.push({ time: t > testDuration ? testDuration : t, wpm: finalWpm });
        if (t >= testDuration) break;
      }
      // Ensure last point is at testDuration
      if (filled[filled.length - 1].time !== testDuration) {
        filled.push({ time: testDuration, wpm: finalWpm });
      }
      setProgressData(filled);
    }
  }, [isFinished]);

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
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-100 via-pink-50 to-indigo-100'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-blue-700 via-fuchsia-500 to-indigo-700 dark:from-blue-200 dark:to-purple-300 bg-clip-text text-transparent drop-shadow-2xl">
            Typing Speed Test
          </h1>
          <p className="text-lg font-semibold text-black dark:text-gray-100 drop-shadow-md">
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
            <option value={10}>10 seconds</option>
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
            className="glass-card rounded-xl p-6 shadow-lg max-h-64"
            style={{
              overflow: 'hidden',
              pointerEvents: 'none',
            }}
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

        {/* Virtual keyboard or Chart */}
        <div className="mb-8">
          {isFinished ? (<>
            <div className="glass-card rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-center bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-200 dark:to-purple-300 bg-clip-text text-transparent drop-shadow-lg">
                Progress Chart (WPM every 5 seconds)
              </h3>
              {(() => {
                // Build x-axis: 0, 5, 10, ..., testDuration
                const interval = 5;
                const times = [];
                for (let t = 0; t <= testDuration; t += interval) times.push(t);
                // Map progressData to a dict for fast lookup
                const wpmMap = {};
                progressData.forEach(d => { wpmMap[d.time] = d.wpm; });
                // Build y-axis: for each time, use the closest previous WPM value
                let lastWpm = 0;
                const wpmPoints = times.map(t => {
                  if (wpmMap.hasOwnProperty(t)) lastWpm = wpmMap[t];
                  return lastWpm;
                });
                // If no data, show message
                if (wpmPoints.length <= 1) {
                  return <div className="text-center text-gray-500 dark:text-gray-300">Not enough data to display chart.</div>;
                }
                return (
                  <Line
                    data={{
                      labels: times.map(t => `${t}s`),
                      datasets: [
                        {
                          label: 'WPM',
                          data: wpmPoints,
                          borderColor: '#3b82f6',
                          backgroundColor: 'rgba(99,102,241,0.2)',
                          pointBackgroundColor: '#a21caf',
                          tension: 0.3,
                          borderWidth: 3,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { display: false },
                        title: { display: false },
                      },
                      scales: {
                        x: {
                          title: { display: true, text: 'Time (s)', color: '#111' },
                          ticks: { color: '#111' },
                          grid: { color: 'rgba(0,0,0,0.07)' },
                        },
                        y: {
                          title: { display: true, text: 'WPM', color: '#111' },
                          ticks: { color: '#111' },
                          grid: { color: 'rgba(0,0,0,0.07)' },
                          beginAtZero: true,
                        },
                      },
                    }}
                    height={220}
                  />
                );
              })()}
            </div>
          </>) : (
            <VirtualKeyboard
              pressedKey={pressedKey}
              isCorrect={isCorrectKey}
              isIncorrect={isIncorrectKey}
            />
          )}
        </div>

        {/* Results */}
        {isFinished && (
          <div className="glass-card rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-extrabold text-center mb-6 bg-gradient-to-r from-green-600 to-blue-700 dark:from-green-200 dark:to-blue-300 bg-clip-text text-transparent drop-shadow-lg">
              Test Complete! 🎉
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-extrabold text-green-900 dark:text-green-200 drop-shadow-lg">{wpm}</div>
                <div className="text-sm text-black dark:text-gray-100">WPM</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-extrabold text-blue-900 dark:text-blue-200 drop-shadow-lg">{accuracy}%</div>
                <div className="text-sm text-black dark:text-gray-100">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-extrabold text-purple-900 dark:text-purple-200 drop-shadow-lg">{correctChars}</div>
                <div className="text-sm text-black dark:text-gray-100">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-extrabold text-red-900 dark:text-red-200 drop-shadow-lg">{mistakes}</div>
                <div className="text-sm text-black dark:text-gray-100">Mistakes</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TypingInterface;

<style jsx global>{`
  .glass-card {
    background: rgba(255,255,255,0.92);
    box-shadow: 0 8px 32px 0 rgba(80,80,180,0.10), 0 2px 8px 0 rgba(0,0,0,0.04);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-radius: 18px;
    border: 1.5px solid rgba(180,180,220,0.18);
  }
  .dark .glass-card {
    background: rgba(30,41,59,0.45);
    border: 1px solid rgba(255,255,255,0.10);
  }
`}</style>