import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, Play, Pause, Trophy, Target, Clock, AlertCircle, Keyboard, TrendingUp, X } from 'lucide-react';
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
import Header from './Header.jsx';
import Controls from './Controls.jsx';
import TextDisplay from './TextDisplay.jsx';
import Results from './Results.jsx';
import TypingChartOrKeyboard from './TypingChartOrKeyboard.jsx';
import ShowMember from './ShowMember.jsx';
import { useSocket } from '../Context/Socket';
import { useAuth } from '../Context/AuthContext';
import { useSelector, useDispatch } from 'react-redux';
import { setRoomName, setParticipants, setMode, setTimeLimit, setWordList, setStarted } from '../features/matchRealtimeSlice';
import ResultLeaderboard from './ResultLeaderboard.jsx';
import RealTimeLeaderboard from './RealTimeLeaderboard.jsx';
import { useNavigate, useParams } from 'react-router-dom';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Text samples for typing test
const TEXT_SAMPLES = [
  "a gentle breeze swept through the tall grass making soft rustling sounds that echoed across the open fields the sky above was a vast expanse of light blue with only a few wispy clouds drifting lazily across the horizon in the distance you could see the faint outline of mountains their peaks touching the edge of the world creating a picturesque backdrop for the tranquil landscape birds chirped happily from the trees their melodies adding to the serene ambiance of the afternoon a small stream meandered through the fields its clear water sparkling under the sunlight inviting creatures to quench their thirst and cool themselves on this warm day the air was filled with the sweet scent of wildflowers blooming in various colors painting the meadows with vibrant hues the world seemed to slow down in this idyllic setting offering a moment of peace and quiet reflection away from the hustle and bustle of everyday life it was a perfect day for contemplation a time to simply exist and appreciate the simple beauty that nature so freely offered to those who took the time to notice and immerse themselves in its calming presence a true escape from the ordinary into something truly extraordinary and profoundly refreshing for the mind body and soul a wonderful experience indeed",
];

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
const MatchInterface = ({darkMode}) => {
  // simple typing test................................................................................
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
  const { socket } = useSocket();
  const { userEmail, userName } = useAuth();
  const dispatch = useDispatch();
  const roomName = useSelector(state => state.matchRealtime.roomName);
  const participants = useSelector(state => state.matchRealtime.participants);
  const [isTypingActive, setIsTypingActive] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [cooldownValue, setCooldownValue] = useState(3);
  const matchFinishTimeoutRef = useRef(null);
  // Add refs for latest stats
  const wpmRef = useRef(0);
  const accuracyRef = useRef(100);
  const mistakesStateRef = useRef(0);
  const correctCharsStateRef = useRef(0);
  // Leaderboard state
  const [leaderboardData, setLeaderboardData] = useState(null);
  const { roomName: urlRoomName } = useParams();
  const [socketReady, setSocketReady] = useState(false);
  const navigate = useNavigate();
  const [showMatchStartedPopup, setShowMatchStartedPopup] = useState(false);
  const [countdown, setCountdown] = useState(5);
  
  const handleMatchAlreadyStarted = ({message}) => {
    console.log('Match already started:', message);
    setShowMatchStartedPopup(true);
    setSocketReady(false);
    setCountdown(5);
  };

  const handleClosePopup = () => {
    setShowMatchStartedPopup(false);
    navigate('/host');
  };

  const handleGoBack = () => {
    setShowMatchStartedPopup(false);
    navigate('/host');
  };

  // Auto-navigate after 5 seconds
  useEffect(() => {
    if (showMatchStartedPopup && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showMatchStartedPopup && countdown === 0) {
      navigate('/host');
    }
  }, [showMatchStartedPopup, countdown, navigate]);

  useEffect(() => {
    if (!socket || !urlRoomName || !userEmail) return;
    if (socket.connected) {
      socket.emit('joinRoom', {
        roomName: urlRoomName,
        socketId: socket.id,
        email: userEmail,
      });
      setSocketReady(true);
    } else {
      // Wait for socket to connect
      const onConnect = () => {
        socket.emit('joinRoom', {
          roomName: urlRoomName,
          socketId: socket.id,
          email: userEmail,
        });
        setSocketReady(true);
      };
      socket.on('connect', onConnect);
      return () => socket.off('connect', onConnect);
    }
  }, [socket, urlRoomName, userEmail]);

  // Listen for 'all participants' event and update Redux
  React.useEffect(() => {
    if (!socket) return;
    const handleAllParticipants = ({ roomName, participants }) => {
      dispatch(setRoomName(roomName));
      dispatch(setParticipants(participants));
    };
    socket.on('matchAlreadyStarted', handleMatchAlreadyStarted);
    socket.on('all participants', handleAllParticipants);
    return () => {
      socket.off('all participants', handleAllParticipants);
    };
  }, [socket, dispatch]);

  // Listen for 'matchStart' event and update Redux
  React.useEffect(() => {
    if (!socket) return;
    const handleMatchStart = ({ roomName, participants, mode, timeLimit, wordList, isStarted = true }) => {
      dispatch(setMode(mode));
      dispatch(setTimeLimit(timeLimit));
      dispatch(setWordList(wordList));
      dispatch(setStarted(true));
      setCooldown(true);
      setIsTypingActive(false);
      setCooldownValue(3);
      setCurrentText(wordList);
      mistakesRef.current = 0;
      correctCharsRef.current = 0;
      startTimeRef.current = null;
      setPressedKey('');
      setIsCorrectKey(false);
      setIsIncorrectKey(false);
      let countdown = 3;
      setCooldownValue(countdown);

      // Simple setTimeout for matchFinish event
      const totalTime = (timeLimit || 60) + 3;
      matchFinishTimeoutRef.current = setTimeout(() => {
        if (socket) {
          const userStats = {
            name: userName || 'Anonymous',
            email: userEmail || 'anonymous@example.com',
            roomName: roomName,
            wpm: wpmRef.current,
            accuracy: accuracyRef.current,
            mistakes: mistakesStateRef.current,
            correctChars: correctCharsStateRef.current,
            totalTime: timeLimit || 60
          };
          console.log('Emitting matchFinish with stats:', userStats);
          socket.emit('matchFinish', userStats);
        }
      }, totalTime * 1000);

      const interval = setInterval(() => {
        countdown--;
        setCooldownValue(countdown);
        if (countdown <= 0) {
          clearInterval(interval);
          setCooldown(false);
          setTestDuration(timeLimit || 60);
          setIsTypingActive(true);
          setTimeLeft(timeLimit || 60);
          setIsActive(true); // Start timer immediately after cooldown
          setInputText('');
          setCurrentIndex(0);
          setIsStarted(true);
          setIsFinished(false);
        }
      }, 1000);
    };
    socket.on('matchStart', handleMatchStart);
    return () => {
      socket.off('matchStart', handleMatchStart);
      if (matchFinishTimeoutRef.current) {
        clearTimeout(matchFinishTimeoutRef.current);
      }
    };
  }, [socket, dispatch]);

  // Listen for 'statusUpdated' event and update Redux participants
  React.useEffect(() => {
    if (!socket) return;
    const handleStatusUpdated = ({ participants, roomName: eventRoomName }) => {
      dispatch(setParticipants(participants));
    };
    socket.on('statusUpdated', handleStatusUpdated);
    return () => {
      socket.off('statusUpdated', handleStatusUpdated);
    };
  }, [socket, dispatch]);

  // Listen for 'matchResult' event and update leaderboard state
  React.useEffect(() => {
    if (!socket) return;
    const handleMatchResult = (rankedArray) => {
      setLeaderboardData(rankedArray);
    };
    socket.on('matchResult', handleMatchResult);
    return () => {
      socket.off('matchResult', handleMatchResult);
    };
  }, [socket]);

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
    // Update refs for latest stats
    wpmRef.current = currentWpm;
    accuracyRef.current = currentAccuracy;
    mistakesStateRef.current = mistakesRef.current;
    correctCharsStateRef.current = correctCharsRef.current;
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

  // Emit current user's stats to other participants with debouncing
  useEffect(() => {
    if (socket && isTypingActive && isActive && userEmail && roomName) {
      let lastEmittedWpm = 0;
      let lastEmittedAccuracy = 0;
      let emitTimeout = null;

      const emitStats = () => {
        try {
          // Only emit if stats have changed significantly
          if (Math.abs(wpm - lastEmittedWpm) >= 2 || Math.abs(accuracy - lastEmittedAccuracy) >= 2) {
            socket.emit('participantUpdate', {
              email: userEmail,
              wpm: wpm,
              accuracy: accuracy,
              roomName: roomName
            });
            lastEmittedWpm = wpm;
            lastEmittedAccuracy = accuracy;
          }
        } catch (error) {
          console.error('Error emitting participant stats:', error);
        }
      };

      // Debounced emission - only emit after 3 seconds of no changes
      const debouncedEmit = () => {
        if (emitTimeout) {
          clearTimeout(emitTimeout);
        }
        emitTimeout = setTimeout(emitStats, 3000);
      };

      // Emit initial stats immediately with current accuracy
      socket.emit('participantUpdate', {
        email: userEmail,
        wpm: wpm,
        accuracy: accuracy,
        roomName: roomName
      });
      lastEmittedWpm = wpm;
      lastEmittedAccuracy = accuracy;

      // Set up periodic emission every 5 seconds (reduced from 2 seconds)
      const interval = setInterval(debouncedEmit, 5000);
      
      return () => {
        clearInterval(interval);
        if (emitTimeout) {
          clearTimeout(emitTimeout);
        }
      };
    }
  }, [socket, isTypingActive, isActive, userEmail, wpm, accuracy, roomName]);

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
    <div className={`min-h-screen w-full transition-colors duration-300 ${
      darkMode
      ? 'bg-gradient-to-br from-blue-950 via-black-900 to-gray-900'
      : 'bg-gradient-to-br from-blue-100 via-white to-blue-200'
  }`}>
 
      <div className="w-full mx-auto px-4 py-8">
        {/* Loader until socket is ready */}
        {!socketReady ? (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <div className="loader mb-4"></div>
            <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">Connecting to match room...</p>
          </div>
        ) : (
          <>
            {/* Responsive layout: main + sidebar */}
            {/* Leaderboard */}
            {isFinished && leaderboardData ? (
              <div className='w-full min-h-screem'>
                <ResultLeaderboard ranked={leaderboardData.ranked} />
                <div className="w-full flex flex-col items-center justify-center">
                  <Results
                    isFinished={isFinished}
                    wpm={wpm}
                    accuracy={accuracy}
                    correctChars={correctChars}
                    mistakes={mistakes}
                    testDuration={testDuration}
                    progressData={progressData}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row lg:items-start w-full">
                {/* Main content */}
                <div className="flex-1 w-full lg:ml-6">
                  {cooldown || !isTypingActive ? (<>
                <div className="block lg:hidden mt-4">
                        <ShowMember darkMode={darkMode} />
                      </div>

                    <div className="fixed flex flex-col items-center justify-center min-h-[300px] relative">
                      <h2 className="text-3xl font-bold text-center mt-12">Get Ready...</h2>
                      {cooldown && (
                        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <span className="text-7xl font-extrabold text-yellow-400 drop-shadow-lg animate-pulse">{cooldownValue > 0 ? cooldownValue : ''}</span>
                        </div>
                      )}
                     
                    </div>
                      </>
                  ) : (
                    <>
                      {/* Header */}
                      <Header />
                      {/* Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <StatsCard icon={Clock} label="Time Left" value={formatTime(timeLeft)} color="blue" />
                        <StatsCard icon={TrendingUp} label="WPM" value={wpm} color="green" />
                        <StatsCard icon={Trophy} label="Accuracy" value={`${accuracy}%`} color="purple" />
                        <StatsCard icon={AlertCircle} label="Mistakes" value={mistakes} color="red" />
                      </div>
                      {/* Start prompt */}
                      {!isStarted && (
                        <div className="text-center mb-8">
                          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                            Press any key to start typing!
                          </p>
                        </div>
                      )}
                      {/* Text display */}
                      <TextDisplay
                        currentText={currentText}
                        inputText={inputText}
                        currentIndex={currentIndex}
                        activeCharRef={activeCharRef}
                        darkMode={darkMode}
                        getCharStyle={getCharStyle}
                      />
                      {/* Virtual keyboard or Chart */}
                      <TypingChartOrKeyboard
                        pressedKey={pressedKey}
                        isCorrectKey={isCorrectKey}
                        isIncorrectKey={isIncorrectKey}
                      />
                      
                      {/* Mobile Real-time Leaderboard */}
                      <div className="block lg:hidden mt-6">
                        <RealTimeLeaderboard 
                          darkMode={darkMode} 
                          isTypingActive={isTypingActive} 
                          currentUserWpm={wpm}
                          currentUserAccuracy={accuracy}
                        />
                      </div>
                    </>
                  )}
                </div>
                {/* Sidebar on large screens */}

                  <div className="hidden lg:block lg:w-1/4 lg:ml-6">
                  {cooldown || !isTypingActive ? (
                    <ShowMember darkMode={darkMode} />
                  ) : (
                    <RealTimeLeaderboard 
                      darkMode={darkMode} 
                      isTypingActive={isTypingActive} 
                      currentUserWpm={wpm}
                      currentUserAccuracy={accuracy}
                    />
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Match Already Started Popup */}
      {showMatchStartedPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className={`relative max-w-md w-full mx-4 p-6 rounded-2xl shadow-2xl transform transition-all duration-300 animate-scaleIn ${
            darkMode 
              ? 'bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 border border-gray-600' 
              : 'bg-gradient-to-br from-white via-gray-50 to-white border border-gray-200'
          }`}>
            {/* Close button */}
            <button
              onClick={handleClosePopup}
              className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                darkMode 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className={`p-4 rounded-full ${
                darkMode 
                  ? 'bg-red-900/30 text-red-400' 
                  : 'bg-red-100 text-red-600'
              }`}>
                <AlertCircle className="w-12 h-12" />
              </div>
            </div>

            {/* Content */}
            <div className="text-center">
              <h3 className={`text-2xl font-bold mb-3 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Match Already Started!
              </h3>
              <p className={`text-lg mb-4 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                This typing match has already begun. You cannot join a match that's in progress.
              </p>
              
              {/* Countdown Timer */}
              <div className={`mb-6 p-3 rounded-lg ${
                darkMode 
                  ? 'bg-yellow-900/20 text-yellow-400 border border-yellow-600/30' 
                  : 'bg-yellow-100 text-yellow-700 border border-yellow-300'
              }`}>
                <p className="text-sm font-medium">Redirecting in:</p>
                <p className="text-2xl font-bold">{countdown} seconds</p>
              </div>
              
              {/* Action buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleGoBack}
                  className={`w-full py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 ${
                    darkMode
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl'
                  }`}
                >
                  Go Back to Host
                </button>
                
                <button
                  onClick={handleClosePopup}
                  className={`w-full py-2 px-6 rounded-lg font-medium text-sm transition-all duration-200 ${
                    darkMode
                      ? 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchInterface;
