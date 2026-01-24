import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, Play, Pause, Trophy, Target, Clock, AlertCircle, Keyboard, TrendingUp, X, Users, Lock, Unlock, Share2 } from 'lucide-react';
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
const MatchInterface = ({ darkMode }) => {
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

  // Admin and viewer state
  const [isAdmin, setIsAdmin] = useState(false);
  const [isViewer, setIsViewer] = useState(false);
  const [isParticipant, setIsParticipant] = useState(false);
  const [allowNewPlayers, setAllowNewPlayers] = useState(true);
  const [isRoomClosed, setIsRoomClosed] = useState(false);
  const [adminPresent, setAdminPresent] = useState(false);
  const [viewers, setViewers] = useState([]);
  const [showAdminControls, setShowAdminControls] = useState(false);
  const [isReloading, setIsReloading] = useState(false);

  const [isTogglingAccess, setIsTogglingAccess] = useState(false);
  const [isTogglingRoomClosure, setIsTogglingRoomClosure] = useState(false);
  const [showShareNotification, setShowShareNotification] = useState(false);
  const [showShareDropdown, setShowShareDropdown] = useState(false);

  const handleShareRoom = async () => {
    setShowShareDropdown(!showShareDropdown);
  };

  const handleCopyLink = async () => {
    const roomUrl = `${window.location.origin}/match/${roomName}`;
    try {
      await navigator.clipboard.writeText(roomUrl);
      setShowShareNotification(true);
      setShowShareDropdown(false);
      setTimeout(() => setShowShareNotification(false), 3000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSharePlatform = (platform) => {
    const roomUrl = `${window.location.origin}/match/${roomName}`;
    const text = `Join my typing match room: ${roomName}`;

    let shareUrl = '';
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + roomUrl)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(roomUrl)}&text=${encodeURIComponent(text)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(roomUrl)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent('Join My Typing Match')}&body=${encodeURIComponent(text + '\n\n' + roomUrl)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank');
      setShowShareDropdown(false);
    }
  };

  const handleMatchAlreadyStarted = ({ message }) => {
    console.log('Match already started:', message);
    setShowMatchStartedPopup(true);
    setSocketReady(false);
    setCountdown(5);
  };

  const handleToggleNewPlayers = () => {
    setIsTogglingAccess(true);
    try {
      socket.emit('adminToggleNewPlayers', {
        roomName: urlRoomName || roomName, // handle both cases
        adminEmail: userEmail
      });
    } catch (error) {
      console.error('Error toggling new players:', error);
    } finally {
      setIsTogglingAccess(false);
    }
  };

  const handleToggleRoomClosure = () => {
    setIsTogglingRoomClosure(true);
    try {
      socket.emit('adminToggleRoomClosure', {
        roomName: urlRoomName || roomName,
        adminEmail: userEmail
      });
    } catch (error) {
      console.error('Error toggling room closure:', error);
    } finally {
      setIsTogglingRoomClosure(false);
    }
  };

  // Listen for admin action responses
  useEffect(() => {
    if (!socket) return;
    const handleNewPlayersToggled = ({ message, allowNewPlayers }) => {
      setAllowNewPlayers(allowNewPlayers);
    };
    const handleRoomClosureToggled = ({ message, isClosed }) => {
      setIsRoomClosed(isClosed);
    };
    socket.on('newPlayersToggled', handleNewPlayersToggled);
    socket.on('roomClosureToggled', handleRoomClosureToggled);
    return () => {
      socket.off('newPlayersToggled', handleNewPlayersToggled);
      socket.off('roomClosureToggled', handleRoomClosureToggled);
    };
  }, [socket]);

  // Check initial room state
  useEffect(() => {
    if (!urlRoomName && !roomName) return;
    const targetRoom = urlRoomName || roomName;

    const checkRoomState = async () => {
      try {
        const response = await fetch(`/api/match/info/${targetRoom}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setAllowNewPlayers(data.allowNewPlayers);
          // Assume api might return isRoomClosed too if updated, otherwise default false
        }
      } catch (error) {
        console.error('Error checking room state:', error);
      }
    };
    checkRoomState();
  }, [urlRoomName, roomName]);

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
        if (socket && !isViewer) {
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

  // Listen for 'matchStateSync' event - handles reload scenarios
  React.useEffect(() => {
    if (!socket) return;
    const handleMatchStateSync = (matchState) => {
      console.log('Received match state sync:', matchState);

      if (matchState.isStarted) {
        // Sync with current match state
        if (matchState.mode) dispatch(setMode(matchState.mode));
        if (matchState.timeLimit) dispatch(setTimeLimit(matchState.timeLimit));
        if (matchState.wordList) {
          dispatch(setWordList(matchState.wordList));
          setCurrentText(matchState.wordList);
        }
        dispatch(setStarted(true));

        // Check if match is finished
        if (matchState.results && matchState.results.length > 0) {
          setLeaderboardData({ ranked: matchState.results });
          setIsFinished(true);
          setIsActive(false);
          setIsTypingActive(false);
        } else {
          // Match is ongoing
          if (matchState.isParticipant && !matchState.isViewer && matchState.adminPresent) {
            setIsTypingActive(true);
            setIsActive(true);
            setIsStarted(true);

            // Calculate remaining time
            if (matchState.startTime) {
              const startTime = new Date(matchState.startTime).getTime();
              const now = Date.now();
              const elapsed = Math.floor((now - startTime) / 1000);
              const remaining = Math.max(0, (matchState.timeLimit || 60) - elapsed);

              if (remaining > 0) {
                setTimeLeft(remaining);
                setTestDuration(matchState.timeLimit || 60);
              } else {
                setIsFinished(true);
                setIsActive(false);
                setIsTypingActive(false);
              }
            }
          } else {
            setIsTypingActive(false);
            setIsActive(false);
            setIsStarted(false);
          }
        }
      }
    };

    socket.on('matchStateSync', handleMatchStateSync);
    return () => {
      socket.off('matchStateSync', handleMatchStateSync);
    };
  }, [socket, dispatch]);

  // Initialize text
  useEffect(() => {
    resetTest();
  }, []);

  // Handle page unload warning during active match
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isActive && !isFinished) {
        e.preventDefault();
        e.returnValue = 'You are in the middle of a typing match. Are you sure you want to leave?';
        return 'You are in the middle of a typing match. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isActive, isFinished]);

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

  // Timer logic with cross-browser compatibility
  useEffect(() => {
    // Clear any existing timer first
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Only start timer if we have time left and the test has started
    if (timeLeft > 0 && isStarted) {
      const startTime = Date.now();
      const targetTime = startTime + (timeLeft * 1000);

      timerRef.current = setInterval(() => {
        const currentTime = Date.now();
        const remainingTime = Math.max(0, Math.ceil((targetTime - currentTime) / 1000));

        setTimeLeft(remainingTime);

        if (remainingTime <= 0) {
          setIsActive(false);
          setIsFinished(true);
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }, 100); // Check more frequently for better accuracy
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [timeLeft, isStarted]);

  // Update stats regularly
  useEffect(() => {
    calculateStats();
  }, [inputText, calculateStats]);

  // Emit current user's stats to other participants with debouncing
  useEffect(() => {
    if (socket && isTypingActive && isActive && userEmail && roomName && !isViewer) {
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
  }, [socket, isTypingActive, isActive, userEmail, wpm, accuracy, roomName, isViewer]);

  // Track WPM every 5 seconds and at start
  useEffect(() => {
    if (!isStarted) return;
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
  }, [isStarted]);

  // Reset progress data and interval step on new test
  useEffect(() => {
    if (!isStarted) {
      setProgressData([]);
      setIntervalStep(0);
    }
  }, [isStarted]);

  // Handle visibility changes and focus events for cross-browser compatibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      // Ensure timer continues when tab becomes visible again
      if (!document.hidden && isStarted && timeLeft > 0 && !isFinished) {
        // Force a re-render of the timer
        setTimeLeft(prev => prev);
      }
    };

    const handleFocus = () => {
      // Ensure timer continues when window regains focus
      if (isStarted && timeLeft > 0 && !isFinished) {
        // Force a re-render of the timer
        setTimeLeft(prev => prev);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [isStarted, timeLeft, isFinished]);

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
        // Force timer to start immediately
        setTimeLeft(prev => prev);
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
            setIsFinished(true);
            // Don't stop the timer - let it continue until time is up
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
          setIsFinished(true);
          // Don't stop the timer - let it continue until time is up
        }
      }

      // Clear key press visual feedback
      setTimeout(() => {
        setPressedKey('');
        setIsCorrectKey(false);
        setIsIncorrectKey(false);
      }, 150);
    };

    // Prevent paste, copy, cut, and drop
    const handlePaste = (e) => e.preventDefault();
    const handleCopy = (e) => e.preventDefault();
    const handleCut = (e) => e.preventDefault();
    const handleDrop = (e) => e.preventDefault();

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('paste', handlePaste);
    window.addEventListener('copy', handleCopy);
    window.addEventListener('cut', handleCut);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('paste', handlePaste);
      window.removeEventListener('copy', handleCopy);
      window.removeEventListener('cut', handleCut);
      window.removeEventListener('drop', handleDrop);
    };
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

  // Check user role and permissions
  useEffect(() => {
    if (!socket || !urlRoomName || !userEmail) return;

    // Check if current user is admin (host) based on participants data
    const currentUser = participants.find(p => p.email === userEmail);

    if (currentUser) {
      const isHostUser = currentUser.isHost || false;
      setIsAdmin(isHostUser);
    } else {
      setIsAdmin(false);
    }

    // Also check allowNewPlayers from room state
    const checkRoomState = async () => {
      try {
        const response = await fetch(`/api/match/info/${urlRoomName}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setIsViewer(data.isViewer || false);
          setIsParticipant(data.isParticipant || false);
          setAllowNewPlayers(data.allowNewPlayers !== false);
          setViewers(data.viewers || []);
          setIsRoomClosed(data.isRoomClosed || false);
          setAdminPresent(data.adminPresent || false);

          // If user is only a viewer, disable typing functionality
          if (data.isViewer && !data.isParticipant) {
            setIsTypingActive(false);
            setIsActive(false);
            setIsStarted(false);
            setIsFinished(false);
          }
        }
      } catch (error) {
        console.error('Error checking room state:', error);
        // Set default values on error
        setIsViewer(false);
        setIsParticipant(false);
        setAllowNewPlayers(true);
        setViewers([]);
        setIsRoomClosed(false);
        setAdminPresent(false);
      }
    };

    checkRoomState();
  }, [socket, urlRoomName, userEmail, participants]);

  // Handle page reload - recover match state
  useEffect(() => {
    if (!socket || !urlRoomName || !userEmail || !socketReady) return;

    const handleReload = async () => {
      setIsReloading(true);
      try {
        // Check if there's an ongoing match
        const response = await fetch(`/api/match/info/${urlRoomName}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          const data = await response.json();

          // If match is already started, sync with current state
          if (data.isStarted) {
            console.log('Match already in progress, syncing state...');

            // Set match state from server
            if (data.mode) dispatch(setMode(data.mode));
            if (data.timeLimit) dispatch(setTimeLimit(data.timeLimit));
            if (data.wordList) {
              dispatch(setWordList(data.wordList));
              setCurrentText(data.wordList);
            }
            dispatch(setStarted(true));

            // Check if match is finished
            if (data.results && data.results.length > 0) {
              // Match is finished, show results
              setLeaderboardData({ ranked: data.results });
              setIsFinished(true);
              setIsActive(false);
              setIsTypingActive(false);
            } else {
              // Match is ongoing, check if user should be typing
              if (data.isParticipant && !data.isViewer && data.adminPresent) {
                // User should be typing
                setIsTypingActive(true);
                setIsActive(true);
                setIsStarted(true);

                // Calculate remaining time
                if (data.startTime) {
                  const startTime = new Date(data.startTime).getTime();
                  const now = Date.now();
                  const elapsed = Math.floor((now - startTime) / 1000);
                  const remaining = Math.max(0, (data.timeLimit || 60) - elapsed);

                  if (remaining > 0) {
                    setTimeLeft(remaining);
                    setTestDuration(data.timeLimit || 60);
                  } else {
                    // Time is up
                    setIsFinished(true);
                    setIsActive(false);
                    setIsTypingActive(false);
                  }
                }
              } else {
                // User is viewer or admin not present
                setIsTypingActive(false);
                setIsActive(false);
                setIsStarted(false);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error handling reload:', error);
        // Set default states on error
        setIsTypingActive(false);
        setIsActive(false);
        setIsStarted(false);
        setIsFinished(false);
      } finally {
        setIsReloading(false);
      }
    };

    // Only handle reload if socket is ready and we have room info
    if (socketReady) {
      handleReload();
    }
  }, [socket, urlRoomName, userEmail, socketReady, dispatch]);

  // Handle viewer mode - disable typing for viewers
  useEffect(() => {
    if (isViewer && !isParticipant) {
      // Disable all typing functionality for viewers
      setIsTypingActive(false);
      setIsActive(false);
      setIsStarted(false);
      setIsFinished(false);
    }
  }, [isViewer, isParticipant]);

  // Handle admin presence - only allow typing when admin is present
  useEffect(() => {
    if (!adminPresent && isParticipant) {
      // Disable typing if admin is not present
      setIsTypingActive(false);
      setIsActive(false);
      setIsStarted(false);
      setIsFinished(false);
    }
  }, [adminPresent, isParticipant]);

  // Admin controls component
  const AdminControls = () => {
    const [isRemovingPlayer, setIsRemovingPlayer] = useState(false);
    const [isTogglingAccess, setIsTogglingAccess] = useState(false);
    const [isTogglingRoomClosure, setIsTogglingRoomClosure] = useState(false);

    const handleRemovePlayer = async (participantEmail) => {
      if (participantEmail === userEmail) return; // Can't remove yourself

      setIsRemovingPlayer(true);
      try {
        // Use socket event instead of API call
        socket.emit('adminRemovePlayer', {
          roomName: urlRoomName,
          participantEmail: participantEmail,
          adminEmail: userEmail
        });
      } catch (error) {
        console.error('Error removing player:', error);
      } finally {
        setIsRemovingPlayer(false);
      }
    };

    const handleToggleNewPlayers = async () => {
      setIsTogglingAccess(true);
      try {
        // Use socket event instead of API call
        socket.emit('adminToggleNewPlayers', {
          roomName: urlRoomName,
          adminEmail: userEmail
        });
      } catch (error) {
        console.error('Error toggling new players:', error);
      } finally {
        setIsTogglingAccess(false);
      }
    };

    const handleToggleRoomClosure = async () => {
      setIsTogglingRoomClosure(true);
      try {
        // Use socket event instead of API call
        socket.emit('adminToggleRoomClosure', {
          roomName: urlRoomName,
          adminEmail: userEmail
        });
      } catch (error) {
        console.error('Error toggling room closure:', error);
      } finally {
        setIsTogglingRoomClosure(false);
      }
    };

    // Listen for admin action responses
    useEffect(() => {
      if (!socket) return;

      const handlePlayerRemoved = ({ message, participants }) => {
        console.log('Player removed:', message);
        // Redux will handle participant updates
      };

      const handleNewPlayersToggled = ({ message, allowNewPlayers }) => {
        console.log('New players toggled:', message);
        setAllowNewPlayers(allowNewPlayers);
      };

      const handleRoomClosureToggled = ({ message, isRoomClosed }) => {
        console.log('Room closure toggled:', message);
        setIsRoomClosed(isRoomClosed);
      };

      const handleAdminError = ({ message }) => {
        console.error('Admin action error:', message);
        // Could show a toast notification here
      };

      socket.on('playerRemoved', handlePlayerRemoved);
      socket.on('newPlayersToggled', handleNewPlayersToggled);
      socket.on('roomClosureToggled', handleRoomClosureToggled);
      socket.on('adminError', handleAdminError);

      return () => {
        socket.off('playerRemoved', handlePlayerRemoved);
        socket.off('newPlayersToggled', handleNewPlayersToggled);
        socket.off('roomClosureToggled', handleRoomClosureToggled);
        socket.off('adminError', handleAdminError);
      };
    }, [socket]);

    return (
      <div className={`fixed top-16 right-4 z-40 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg border p-4`}>
        <div className="mb-4">
          <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Admin Controls</h3>
        </div>

        <div className="space-y-3">
          {/* Toggle new players */}
          <div className="flex items-center justify-between">
            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Allow New Players
            </span>
            <button
              onClick={handleToggleNewPlayers}
              disabled={isTogglingAccess}
              className={`px-3 py-1 rounded text-xs font-medium ${allowNewPlayers
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
                }`}
            >
              {isTogglingAccess ? '...' : (allowNewPlayers ? 'ON' : 'OFF')}
            </button>
          </div>

          {/* Toggle Room Closure */}
          <div className="flex items-center justify-between">
            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Room Closure
            </span>
            <button
              onClick={handleToggleRoomClosure}
              disabled={isTogglingRoomClosure}
              className={`px-3 py-1 rounded text-xs font-medium ${isRoomClosed
                ? 'bg-red-500 text-white'
                : 'bg-green-500 text-white'
                }`}
            >
              {isTogglingRoomClosure ? '...' : (isRoomClosed ? 'CLOSED' : 'OPEN')}
            </button>
          </div>

          {/* Remove players */}
          <div>
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Remove Players:
            </span>
            <div className="mt-2 space-y-1">
              {participants.map((participant) => (
                participant.email !== userEmail && (
                  <div key={participant.email} className="flex items-center justify-between">
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {participant.username}
                    </span>
                    <button
                      onClick={() => handleRemovePlayer(participant.email)}
                      disabled={isRemovingPlayer}
                      className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                    >
                      {isRemovingPlayer ? '...' : 'Remove'}
                    </button>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Viewer mode component
  const ViewerMode = () => {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className={`text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          <h2 className="text-3xl font-bold mb-4">Spectator Mode</h2>
          <p className="text-lg mb-6">You are watching this match as a spectator.</p>

          {/* Show viewers list */}
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <h3 className="font-semibold mb-2">Spectators ({viewers.length})</h3>
            <div className="space-y-1">
              {viewers.map((viewer, index) => (
                <div key={index} className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  👁️ {viewer.username}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen w-full transition-colors duration-300 ${darkMode
      ? 'bg-gradient-to-br from-blue-950 via-black-900 to-gray-900'
      : 'bg-gradient-to-br from-blue-100 via-white to-blue-200'
      }`}>

      <div className="w-full mx-auto px-4 py-8">
        {/* Loader until socket is ready or during reload */}
        {!socketReady || isReloading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <div className="loader mb-4"></div>
            <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">
              {isReloading ? 'Recovering match state...' : 'Connecting to match room...'}
            </p>
          </div>
        ) : (
          <>
            {/* Admin Controls - Floating button (Only during match) */}
            {isAdmin && (isTypingActive || cooldown) && (
              <div className="fixed top-4 right-4 z-40">
                <button
                  onClick={() => setShowAdminControls(!showAdminControls)}
                  className={`p-3 rounded-lg shadow-lg border ${darkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-200'
                    }`}
                >
                  <span className="text-sm font-medium">⚙️ Admin</span>
                </button>
                {showAdminControls && <AdminControls />}
              </div>
            )}

            {/* Reload Recovery Indicator */}
            {isReloading && (
              <div className="fixed top-4 left-4 z-40">
                <div className={`px-4 py-2 rounded-lg shadow-lg border ${darkMode ? 'bg-blue-900 text-blue-200 border-blue-600' : 'bg-blue-100 text-blue-800 border-blue-300'
                  }`}>
                  <span className="text-sm font-medium">🔄 Recovering match state...</span>
                </div>
              </div>
            )}

            {/* Viewer Mode */}
            {isViewer && !isParticipant ? (
              <ViewerMode />
            ) : !adminPresent && isParticipant ? (
              <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className={`text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  <h2 className="text-3xl font-bold mb-4">⏸️ Waiting for Admin</h2>
                  <p className="text-lg mb-6">Typing is disabled because the admin is not present in the room.</p>
                  <p className="text-sm text-gray-500">Only the admin can start the match.</p>
                </div>
              </div>
            ) : (
              <>
                {/* New Layout System */}
                {isFinished && leaderboardData ? (
                  <div className='w-full min-h-screen animate-fadeIn'>
                    <div className="max-w-4xl mx-auto">
                      <ResultLeaderboard ranked={leaderboardData.ranked} />
                    </div>
                    <div className="w-full flex flex-col items-center justify-center mt-8">
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
                  <>
                    {!isTypingActive && !cooldown ? (
                      /* --- CENTRAL LOBBY VIEW --- */
                      <div className="relative w-full max-w-7xl mx-auto animate-fadeIn flex flex-col justify-center min-h-[calc(100vh-150px)] px-4">
                        {/* Vertical Divider (Desktop Only) - Single continuous line */}
                        <div className={`hidden lg:block absolute left-[33.33%] top-10 bottom-10 w-[1px] -translate-x-1/2 pointer-events-none bg-gradient-to-b ${darkMode ? 'from-indigo-500/30 via-purple-500/50 to-pink-500/30' : 'from-indigo-400/40 via-purple-400/60 to-pink-400/40'}`}></div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

                          {/* LEFT COLUMN: GAME INFO & SETTINGS */}
                          <div className="flex flex-col space-y-6">
                            <div className="flex items-center gap-4 mb-2">
                              <h2 className={`text-xl font-bold uppercase tracking-widest ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                Game Info
                              </h2>
                              <div className="h-[2px] flex-grow rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                            </div>

                            {/* Room Details */}
                            <div className={`p-4 md:p-6 rounded-xl border-l-4 shadow-sm transition-all hover:translate-x-1 ${darkMode
                              ? 'bg-gray-800/50 border-orange-500 text-gray-200'
                              : 'bg-white border-orange-500 text-gray-700'
                              }`}>
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                                <h3 className="text-lg sm:text-xl md:text-2xl font-bold truncate max-w-full md:max-w-md" title={roomName}>
                                  {roomName}
                                </h3>
                                <div className="relative">
                                  <button
                                    onClick={handleShareRoom}
                                    className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg font-bold text-xs md:text-sm transition-all ${darkMode
                                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/50 hover:bg-indigo-500 hover:text-white'
                                      : 'bg-indigo-500/10 text-indigo-600 border border-indigo-500/50 hover:bg-indigo-500 hover:text-white'
                                      }`}
                                  >
                                    <Share2 className="w-4 h-4" />
                                    Share Room
                                  </button>

                                  {/* Share Dropdown */}
                                  {showShareDropdown && (
                                    <div className={`absolute left-0 md:right-0 md:left-auto top-12 z-50 w-56 rounded-lg shadow-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                                      }`}>
                                      <div className="p-2 space-y-1">
                                        {/* WhatsApp */}
                                        <button
                                          onClick={() => handleSharePlatform('whatsapp')}
                                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${darkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-100 text-gray-700'
                                            }`}
                                        >
                                          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                            </svg>
                                          </div>
                                          <span className="font-medium">WhatsApp</span>
                                        </button>

                                        {/* Telegram */}
                                        <button
                                          onClick={() => handleSharePlatform('telegram')}
                                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${darkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-100 text-gray-700'
                                            }`}
                                        >
                                          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                                            </svg>
                                          </div>
                                          <span className="font-medium">Telegram</span>
                                        </button>

                                        {/* Twitter/X */}
                                        <button
                                          onClick={() => handleSharePlatform('twitter')}
                                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${darkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-100 text-gray-700'
                                            }`}
                                        >
                                          <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                            </svg>
                                          </div>
                                          <span className="font-medium">Twitter / X</span>
                                        </button>

                                        {/* Email */}
                                        <button
                                          onClick={() => handleSharePlatform('email')}
                                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${darkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-100 text-gray-700'
                                            }`}
                                        >
                                          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                          </div>
                                          <span className="font-medium">Email</span>
                                        </button>

                                        <div className={`h-px my-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>

                                        {/* Copy Link */}
                                        <button
                                          onClick={handleCopyLink}
                                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${darkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-100 text-gray-700'
                                            }`}
                                        >
                                          <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                          </div>
                                          <span className="font-medium">Copy Link</span>
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                                <span className={`flex items-center gap-2 text-lg sm:text-xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                  <Users className="w-4 sm:w-5 h-4 sm:h-5" /> {participants.length} Players
                                </span>
                                <span className={`flex items-center gap-2 text-lg sm:text-xl font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                                  <Clock className="w-4 sm:w-5 h-4 sm:h-5" /> {testDuration}s
                                </span>
                              </div>

                              {/* Share Notification */}
                              {showShareNotification && (
                                <div className="mt-3 p-2 bg-green-500/20 border border-green-500/50 rounded-lg text-green-500 text-sm font-medium text-center animate-pulse">
                                  ✓ Room link copied to clipboard!
                                </div>
                              )}
                            </div>

                            {/* Admin Settings Panel (Only for Admin) */}
                            {isAdmin && (
                              <div className="mt-8">
                                <div className="flex items-center gap-4 mb-4">
                                  <h3 className={`text-xl font-bold uppercase tracking-widest ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                    Settings
                                  </h3>
                                  <div className="h-[2px] flex-grow rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                                </div>

                                <div className={`p-6 rounded-xl border-l-4 shadow-sm transition-all hover:translate-x-1 ${darkMode ? 'bg-gray-800/50 border-blue-500' : 'bg-white border-blue-500'} shadow-sm`}>
                                  <div className="grid grid-cols-2 gap-3">
                                    {/* Toggle New Players */}
                                    <button
                                      onClick={handleToggleNewPlayers}
                                      disabled={isTogglingAccess}
                                      className={`w-full py-2 px-3 rounded-lg font-bold flex flex-col items-center justify-center gap-1 transition-all text-xs ${allowNewPlayers
                                        ? 'bg-green-500/10 text-green-500 border border-green-500/50 hover:bg-green-500 hover:text-white'
                                        : 'bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white'
                                        }`}
                                    >
                                      <div className="flex items-center gap-1">
                                        {allowNewPlayers ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                                        <span>New Players</span>
                                      </div>
                                      <span className="uppercase tracking-wider opacity-75">{allowNewPlayers ? 'Allowed' : 'Locked'}</span>
                                    </button>

                                    {/* Toggle Room Closure */}
                                    <button
                                      onClick={handleToggleRoomClosure}
                                      disabled={isTogglingRoomClosure}
                                      className={`w-full py-2 px-3 rounded-lg font-bold flex flex-col items-center justify-center gap-1 transition-all text-xs ${isRoomClosed
                                        ? 'bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white'
                                        : 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/50 hover:bg-indigo-500 hover:text-white'
                                        }`}
                                    >
                                      <div className="flex items-center gap-1">
                                        {isRoomClosed ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                                        <span>Room Status</span>
                                      </div>
                                      <span className="uppercase tracking-wider opacity-75">{isRoomClosed ? 'Closed' : 'Open'}</span>
                                    </button>
                                  </div>

                                  <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-xs text-yellow-600 dark:text-yellow-400">
                                    <p>Only the host can start the game.</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* RIGHT COLUMN: PLAYERS LIST */}
                          <div className="flex flex-col space-y-6 lg:col-span-2">
                            <div className="flex items-center gap-4 mb-2">
                              <h2 className={`text-xl font-bold uppercase tracking-widest ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                Players
                              </h2>
                              <div className="h-[2px] flex-grow rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                            </div>

                            <div className="flex-1">
                              <ShowMember darkMode={darkMode} />
                            </div>
                          </div>

                        </div>
                      </div>
                    ) : (
                      /* --- ACTIVE MATCH VIEW --- */
                      <div className="flex flex-col lg:flex-row lg:items-start w-full gap-8 animate-fadeIn">
                        {/* Main Typing Area */}
                        <div className="flex-1 w-full relative">

                          {/* Countdown Overlay */}
                          {cooldown && (
                            <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-3xl">
                              <div className="flex flex-col items-center animate-bounce">
                                <span className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-500 to-purple-600 drop-shadow-2xl">
                                  {cooldownValue}
                                </span>
                                <span className="text-2xl font-bold text-gray-800 dark:text-white mt-4">Get Ready!</span>
                              </div>
                            </div>
                          )}

                          <Header />

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <StatsCard icon={Clock} label="Time Left" value={formatTime(timeLeft)} color="blue" />
                            <StatsCard icon={TrendingUp} label="WPM" value={wpm} color="green" />
                            <StatsCard icon={Trophy} label="Accuracy" value={`${accuracy}%`} color="purple" />
                            <StatsCard icon={AlertCircle} label="Mistakes" value={mistakes} color="red" />
                          </div>

                          <TextDisplay
                            currentText={currentText}
                            inputText={inputText}
                            currentIndex={currentIndex}
                            activeCharRef={activeCharRef}
                            darkMode={darkMode}
                            getCharStyle={getCharStyle}
                          />

                          <TypingChartOrKeyboard
                            pressedKey={pressedKey}
                            isCorrectKey={isCorrectKey}
                            isIncorrectKey={isIncorrectKey}
                          />

                          {/* Mobile Leaderboard */}
                          <div className="block lg:hidden mt-8">
                            <RealTimeLeaderboard
                              darkMode={darkMode}
                              isTypingActive={isTypingActive}
                              currentUserWpm={wpm}
                              currentUserAccuracy={accuracy}
                            />
                          </div>
                        </div>

                        {/* Sidebar: Real-Time Leaderboard */}
                        <div className="hidden lg:block w-80 shrink-0">
                          <div className="sticky top-24">
                            <RealTimeLeaderboard
                              darkMode={darkMode}
                              isTypingActive={isTypingActive}
                              currentUserWpm={wpm}
                              currentUserAccuracy={accuracy}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}

          </>
        )}
      </div>

      {/* Match Already Started Popup */}
      {showMatchStartedPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className={`relative max-w-md w-full mx-4 p-6 rounded-2xl shadow-2xl transform transition-all duration-300 animate-scaleIn ${darkMode
            ? 'bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 border border-gray-600'
            : 'bg-gradient-to-br from-white via-gray-50 to-white border border-gray-200'
            }`}>
            {/* Close button */}
            <button
              onClick={handleClosePopup}
              className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-200 hover:scale-110 ${darkMode
                ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className={`p-4 rounded-full ${darkMode
                ? 'bg-red-900/30 text-red-400'
                : 'bg-red-100 text-red-600'
                }`}>
                <AlertCircle className="w-12 h-12" />
              </div>
            </div>

            {/* Content */}
            <div className="text-center">
              <h3 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                Match Already Started!
              </h3>
              <p className={`text-lg mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                This typing match has already begun. You cannot join a match that's in progress.
              </p>

              {/* Countdown Timer */}
              <div className={`mb-6 p-3 rounded-lg ${darkMode
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
                  className={`w-full py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 ${darkMode
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl'
                    }`}
                >
                  Go Back to Host
                </button>

                <button
                  onClick={handleClosePopup}
                  className={`w-full py-2 px-6 rounded-lg font-medium text-sm transition-all duration-200 ${darkMode
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
