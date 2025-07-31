import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, Play, Pause, Trophy, Target, Clock, AlertCircle, Keyboard, Palette, X, Bot } from 'lucide-react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useAuth } from '../Context/AuthContext';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

// Theme definitions
const THEMES = {
  light: {
    name: 'Light',
    bg: 'bg-gradient-to-br from-blue-100 via-pink-50 to-indigo-100',
    text: 'text-black',
    card: 'bg-white/92',
    cardBorder: 'border-white/50',
    glassCard: 'bg-white/92',
    glassCardDark: 'bg-white/92',
    title: 'bg-gradient-to-r from-blue-700 via-fuchsia-500 to-indigo-700',
    subtitle: 'text-black',
    statsText: 'text-black',
    statsValue: 'text-black',
    chartText: '#111',
    chartGrid: 'rgba(0,0,0,0.07)',
    correctText: 'bg-green-200 text-green-800',
    incorrectText: 'bg-red-200 text-red-800',
    incompleteText: 'text-black',
    currentChar: 'bg-blue-500 text-white animate-pulse'
  },
  dark: {
    name: 'Dark',
    bg: ' bg-gradient-to-br from-blue-950 via-black-900 to-gray-900 ',
    text: 'text-white',
    card: 'bg-blue-800/90',
    cardBorder: 'border-gray-500/30',
    glassCard: 'rgba(10, 37, 80, 0.45)',
    glassCardDark: 'rgba(6, 58, 141, 0.45)',
    title: 'bg-gradient-to-r from-blue-300 via-fuchsia-500 to-blue-200',
    subtitle: 'text-white',
    statsText: 'text-white',
    statsValue: 'text-white',
    chartText: '#111',
    chartGrid: 'rgba(233, 242, 234, 0.07)',
    correctText: 'bg-green-200 text-green-800',
    incorrectText: 'bg-red-200 text-red-800',
    incompleteText: 'text-white',
    currentChar: 'bg-blue-500 text-white animate-pulse'
  },
  hacker: {
    name: 'Hacker',
    bg: 'bg-black',
    text: 'text-green-400',
    card: 'bg-black/80',
    cardBorder: 'border-green-500/50',
    glassCard: 'rgba(0,0,0,0.8)',
    glassCardDark: 'rgba(0,0,0,0.8)',
    title: 'bg-gradient-to-r from-green-400 via-cyan-400 to-green-300',
    subtitle: 'text-green-400',
    statsText: 'text-green-400',
    statsValue: 'text-green-300',
    chartText: '#10b981',
    chartGrid: 'rgba(16,185,129,0.1)',
    correctText: 'bg-green-800 text-green-200',
    incorrectText: 'bg-red-800 text-red-200',
    incompleteText: 'text-green-400',
    currentChar: 'bg-green-500/30 text-green-400 animate-pulse'
  },
  neon: {
    name: 'Neon',
    bg: 'bg-gradient-to-br from-purple-900 via-pink-900 to-cyan-900',
    text: 'text-pink-300',
    card: 'bg-purple-900/80',
    cardBorder: 'border-pink-500/50',
    glassCard: 'rgba(147,51,234,0.8)',
    glassCardDark: 'rgba(147,51,234,0.8)',
    title: 'bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400',
    subtitle: 'text-pink-300',
    statsText: 'text-pink-300',
    statsValue: 'text-pink-200',
    chartText: '#ec4899',
    chartGrid: 'rgba(236,72,153,0.1)',
    correctText: 'bg-pink-800 text-pink-200',
    incorrectText: 'bg-red-800 text-red-200',
    incompleteText: 'text-pink-300',
    currentChar: 'bg-pink-500/30 text-pink-300 animate-pulse'
  }
};

// Bot difficulty levels and their characteristics
const BOT_DIFFICULTIES = {
  easy: {
    name: 'Easy Bot',
    avatar: '🤖',
    color: 'text-green-500',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/50',
    wpmRange: [30, 50],
    accuracyRange: [85, 95],
    description: 'Perfect for beginners',
    delayRange: [200, 400], // milliseconds between characters
    startDelay: 2000 // Start typing after 2 seconds
  },
  medium: {
    name: 'Medium Bot',
    avatar: '⚡',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-500/50',
    wpmRange: [50, 80],
    accuracyRange: [90, 98],
    description: 'Challenging but fair',
    delayRange: [150, 300],
    startDelay: 1500
  },
  hard: {
    name: 'Hard Bot',
    avatar: '🔥',
    color: 'text-red-500',
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-500/50',
    wpmRange: [80, 120],
    accuracyRange: [95, 99],
    description: 'For experienced typists',
    delayRange: [100, 200],
    startDelay: 1000
  },
  expert: {
    name: 'Expert Bot',
    avatar: '👑',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/50',
    wpmRange: [120, 180],
    accuracyRange: [98, 100],
    description: 'Ultimate challenge',
    delayRange: [50, 150],
    startDelay: 500
  }
};

// Text samples for typing test
const TEXT_SAMPLES = [  
"this is a very extensive string composed of random words and phrases designed to meet your specific length requirement it continues to grow with various vocabulary choices ensuring it surpasses the five hundred character mark without using any punctuation whatsoever only lowercase letters and spaces are present throughout its entirety providing a continuous flow of text for your needs we are carefully adding more words to increase its overall length making sure it remains well above your requested minimum this paragraph demonstrates a large block of text suitable for many applications where a long character sequence without special symbols is desired it keeps going and going with more random words and less meaning sometimes just for the sake of length and character count validation we hope this extended passage serves its purpose effectively this is a very extensive string composed of random words and phrases designed to meet your specific length requirement it continues to grow with various vocabulary choices ensuring it surpasses the five hundred character mark without using any punctuation whatsoever only lowercase letters and spaces are present throughout its entirety providing a continuous flow of text for your needs we are carefully adding more words to increase its overall length making sure it remains well above your requested minimum this paragraph demonstrates a large block of text suitable for many applications where a long character sequence without special symbols is desired it keeps going and going with more random words and less meaning sometimes just for the sake of length and character count validation we hope this extended passage serves its purpose effectively",
"learning new things is always an exciting adventure expanding your knowledge and understanding of the world around you every book you read every skill you acquire adds another layer to your personal growth and development the process of discovery can be incredibly rewarding opening up new perspectives and challenging your existing beliefs it encourages critical thinking and creativity allowing you to approach problems from different angles and find innovative solutions practice and persistence are key components in mastering any new subject or ability as consistent effort often leads to significant progress over time embracing mistakes as learning opportunities helps you refine your approach and build resilience the journey of continuous learning is endless with countless subjects and disciplines waiting to be explored it fosters curiosity and a lifelong passion for gaining insights into various fields whether it is science art history or technology there is always something fascinating to delve into and comprehend the more you learn the more you realize how much more there is to know which only fuels your desire for further exploration and intellectual enrichment making life a constant classroom of endless possibilities and exciting discoveries for every curious mind that seeks knowledge and understanding",
"a gentle breeze swept through the tall grass making soft rustling sounds that echoed across the open fields the sky above was a vast expanse of light blue with only a few wispy clouds drifting lazily across the horizon in the distance you could see the faint outline of mountains their peaks touching the edge of the world creating a picturesque backdrop for the tranquil landscape birds chirped happily from the trees their melodies adding to the serene ambiance of the afternoon a small stream meandered through the fields its clear water sparkling under the sunlight inviting creatures to quench their thirst and cool themselves on this warm day the air was filled with the sweet scent of wildflowers blooming in various colors painting the meadows with vibrant hues the world seemed to slow down in this idyllic setting offering a moment of peace and quiet reflection away from the hustle and bustle of everyday life it was a perfect day for contemplation a time to simply exist and appreciate the simple beauty that nature so freely offered to those who took the time to notice and immerse themselves in its calming presence a true escape from the ordinary into something truly extraordinary and profoundly refreshing for the mind body and soul a wonderful experience indeed",
"a gentle breeze swept through the tall grass making soft rustling sounds that echoed across the open fields the sky above was a vast expanse of light blue with only a few wispy clouds drifting lazily across the horizon in the distance you could see the faint outline of mountains their peaks touching the edge of the world creating a picturesque backdrop for the tranquil landscape birds chirped happily from the trees their melodies adding to the serene ambiance of the afternoon a small stream meandered through the fields its clear water sparkling under the sunlight inviting creatures to quench their thirst and cool themselves on this warm day the air was filled with the sweet scent of wildflowers blooming in various colors painting the meadows with vibrant hues the world seemed to slow down in this idyllic setting offering a moment of peace and quiet reflection away from the hustle and bustle of everyday life it was a perfect day for contemplation a time to simply exist and appreciate the simple beauty that nature so freely offered to those who took the time to notice and immerse themselves in its calming presence a true escape from the ordinary into something truly extraordinary and profoundly refreshing for the mind body and soul a wonderful experience indeed"];
// AI Bot class to simulate realistic typing
class BotAI {
  constructor(difficulty, name) {
    this.difficulty = difficulty;
    this.name = name;
    this.currentIndex = 0;
    this.mistakes = 0;
    this.startTime = null;
    this.isActive = false;
    this.typingSpeed = this.getTypingSpeed();
    this.accuracy = this.getAccuracy();
    this.delay = this.getDelay();
    this.startDelay = BOT_DIFFICULTIES[difficulty].startDelay;
    this.hasStarted = false;
    this.hasStarted = false;
  }

  getTypingSpeed() {
    const range = BOT_DIFFICULTIES[this.difficulty].wpmRange;
    return Math.random() * (range[1] - range[0]) + range[0];
  }

  getAccuracy() {
    const range = BOT_DIFFICULTIES[this.difficulty].accuracyRange;
    return Math.random() * (range[1] - range[0]) + range[0];
  }

  getDelay() {
    const range = BOT_DIFFICULTIES[this.difficulty].delayRange;
    return Math.random() * (range[1] - range[0]) + range[0];
  }

  startTyping(text) {
    this.startTime = Date.now();
    this.isActive = true;
    this.currentIndex = 0;
    this.mistakes = 0;
    this.hasStarted = false;
    
    // Start typing after the specified delay
    setTimeout(() => {
      this.hasStarted = true;
    }, this.startDelay);
  }

  getNextChar(text) {
    if (!this.isActive || this.currentIndex >= text.length || !this.hasStarted) {
      return null;
    }

    const currentChar = text[this.currentIndex];
    const shouldMakeMistake = Math.random() > this.accuracy / 100;
    
    if (shouldMakeMistake && this.currentIndex < text.length - 1) {
      this.mistakes++;
      // Make more realistic mistakes (similar characters)
      const similarChars = {
        'a': 's', 's': 'a', 'e': 'r', 'r': 'e', 't': 'y', 'y': 't',
        'i': 'o', 'o': 'i', 'p': 'o', 'd': 'f', 'f': 'd', 'g': 'h',
        'h': 'g', 'j': 'k', 'k': 'j', 'l': 'k', 'z': 'x', 'x': 'z',
        'c': 'v', 'v': 'c', 'b': 'v', 'n': 'm', 'm': 'n'
      };
      
      const similarChar = similarChars[currentChar] || 'a';
      return similarChar;
    }

    this.currentIndex++;
    return currentChar;
  }

  getProgress() {
    return this.currentIndex;
  }

  getWPM(text) {
    if (!this.startTime || !this.hasStarted) return 0;
    const elapsedMinutes = (Date.now() - this.startTime) / 60000;
    const wordsTyped = this.currentIndex / 5;
    return elapsedMinutes > 0 ? Math.round(wordsTyped / elapsedMinutes) : 0;
  }

  getAccuracy() {
    if (this.currentIndex === 0) return 100;
    const accuracy = Math.round(((this.currentIndex - this.mistakes) / this.currentIndex) * 100);
    return Math.max(0, Math.min(100, accuracy)); // Ensure accuracy is between 0-100
  }

  isFinished(text) {
    return this.currentIndex >= text.length;
  }
}

// Vertical Dashboard Component
const VerticalDashboard = ({ darkMode, bots, selectedDifficulty, theme, isStarted, isFinished, currentText }) => {
  // Ensure theme is valid, fallback to 'light' if not
  const currentTheme = THEMES[theme] ? theme : 'light';
  const themeObj = THEMES[currentTheme];
  
  return (
    <div className={`fixed right-4 top-1/2 transform -translate-y-1/2 w-80 glass-card rounded-xl p-4 shadow-lg z-50 hidden lg:block`} data-theme={currentTheme}>
      <h3 className={`text-lg font-bold mb-4 text-center bg-clip-text text-transparent drop-shadow-lg ${themeObj.title}`}>
        <Trophy className="inline w-5 h-5 mr-2" />
        Live Dashboard
      </h3>
      
      {selectedDifficulty && bots.length > 0 && (
        <div className="space-y-4">
          {/* Bot Progress */}
          {bots.map((bot, index) => (
            <div key={bot.name} className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-800/50 border-gray-600/30' : 'bg-gray-100/50 border-gray-200/30'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{BOT_DIFFICULTIES[selectedDifficulty]?.avatar}</span>
                  <span className={`font-semibold text-sm ${themeObj.text}`}>{bot.name}</span>
                </div>
                <span className={`text-xs font-bold ${BOT_DIFFICULTIES[selectedDifficulty]?.color}`}>
                  {bot.getWPM(currentText)} WPM
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700 mb-1">
                <div 
                  className={`h-1.5 rounded-full transition-all duration-300 ${BOT_DIFFICULTIES[selectedDifficulty]?.color.replace('text-', 'bg-')}`}
                  style={{ width: `${(bot.getProgress() / currentText.length) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs">
                <span className={themeObj.text}>
                  {Math.round((bot.getProgress() / currentText.length) * 100)}%
                </span>
                <span className={themeObj.text}>
                  {bot.getAccuracy()}% acc
                </span>
              </div>
            </div>
          ))}
          
          {/* Difficulty Info */}
                      <div className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-800/50 border-gray-600/30' : 'bg-gray-100/50 border-gray-200/30'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`font-semibold text-sm ${themeObj.text}`}>Difficulty</span>
                <span className={`text-xs font-bold ${BOT_DIFFICULTIES[selectedDifficulty]?.color}`}>
                  {selectedDifficulty.toUpperCase()}
                </span>
              </div>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className={themeObj.text}>WPM Range:</span>
                  <span className={themeObj.text}>
                    {BOT_DIFFICULTIES[selectedDifficulty]?.wpmRange[0]}-{BOT_DIFFICULTIES[selectedDifficulty]?.wpmRange[1]}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={themeObj.text}>Accuracy:</span>
                  <span className={themeObj.text}>
                    {BOT_DIFFICULTIES[selectedDifficulty]?.accuracyRange[0]}%-{BOT_DIFFICULTIES[selectedDifficulty]?.accuracyRange[1]}%
                  </span>
                </div>
              </div>
            </div>
        </div>
      )}
    </div>
  );
};

// Real-time Leaderboard Component
const RealTimeLeaderboard = ({ darkMode, bots, selectedDifficulty, theme, isStarted, isFinished, currentText, userWpm, userAccuracy, userProgress }) => {
  // Ensure theme is valid, fallback to 'light' if not
  const currentTheme = THEMES[theme] ? theme : 'light';
  const themeObj = THEMES[currentTheme];
  
  if (!isStarted) return null;
  
  const userResult = {
    name: 'You',
    avatar: '👤',
    wpm: userWpm,
    accuracy: userAccuracy,
    progress: userProgress,
    isUser: true
  };
  
  const botResults = bots.map(bot => ({
    name: bot.name,
    avatar: BOT_DIFFICULTIES[selectedDifficulty]?.avatar,
    wpm: bot.getWPM(currentText),
    accuracy: bot.getAccuracy(),
    progress: (bot.getProgress() / currentText.length) * 100,
    isUser: false
  }));
  
  const allResults = [...botResults, userResult].sort((a, b) => b.wpm - a.wpm);
  
  return (
    <div className={`w-full max-w-2xl mx-auto glass-card rounded-xl p-4 shadow-lg mb-6`} data-theme={currentTheme}>
      <h3 className={`text-lg font-bold mb-4 text-center bg-clip-text text-transparent drop-shadow-lg ${themeObj.title}`}>
        <Trophy className="inline w-5 h-5 mr-2" />
        Live Leaderboard
      </h3>
      
      <div className="space-y-3">
        {allResults.map((result, index) => (
          <div key={result.name} className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
            index === 0 ? 'bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 border border-yellow-500/50' :
            index === 1 ? 'bg-gradient-to-r from-gray-400/20 to-gray-600/20 border border-gray-500/50' :
            darkMode ? 'bg-gray-700/50 border border-gray-600/30' : 'bg-gray-100/50 border border-gray-200/30'
          }`}>
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">{result.avatar}</span>
                <div>
                  <p className={`font-semibold text-sm ${themeObj.text}`}>
                    {result.name}
                    {result.isUser && <span className="ml-1 text-blue-500">(You)</span>}
                  </p>
                  <p className={`text-xs ${themeObj.text}`}>
                    {result.accuracy}% accuracy
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-lg font-bold ${themeObj.statsValue}`}>
                {result.wpm} WPM
              </p>
              <p className={`text-xs ${themeObj.text}`}>
                {Math.round(result.progress)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Mobile Dashboard Component
const MobileDashboard = ({ darkMode, bots, selectedDifficulty, theme, isStarted, isFinished, currentText }) => {
  // Ensure theme is valid, fallback to 'light' if not
  const currentTheme = THEMES[theme] ? theme : 'light';
  const themeObj = THEMES[currentTheme];
  
  return (
    <div className={`lg:hidden glass-card rounded-xl p-4 shadow-lg mb-4`} data-theme={currentTheme}>
      <h3 className={`text-lg font-bold mb-3 text-center bg-clip-text text-transparent drop-shadow-lg ${themeObj.title}`}>
        <Trophy className="inline w-5 h-5 mr-2" />
        Live Progress
      </h3>
      
      {selectedDifficulty && bots.length > 0 && (
        <div className="space-y-3">
          {/* Bot Progress */}
          {bots.map((bot, index) => (
            <div key={bot.name} className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-800/50 border-gray-600/30' : 'bg-gray-100/50 border-gray-200/30'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{BOT_DIFFICULTIES[selectedDifficulty]?.avatar}</span>
                  <span className={`font-semibold text-sm ${themeObj.text}`}>{bot.name}</span>
                </div>
                <span className={`text-xs font-bold ${BOT_DIFFICULTIES[selectedDifficulty]?.color}`}>
                  {bot.getWPM(currentText)} WPM
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 mb-1">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${BOT_DIFFICULTIES[selectedDifficulty]?.color.replace('text-', 'bg-')}`}
                  style={{ width: `${(bot.getProgress() / currentText.length) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs">
                <span className={themeObj.text}>
                  Progress: {Math.round((bot.getProgress() / currentText.length) * 100)}%
                </span>
                <span className={themeObj.text}>
                  Accuracy: {bot.getAccuracy()}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Bot Leaderboard Component
const BotLeaderboard = ({ darkMode, botResults, userResult, theme }) => {
  const allResults = [...botResults, userResult].filter(result => result).sort((a, b) => b.wpm - a.wpm);
  
  return (
    <div className={`w-full max-w-2xl mx-auto glass-card rounded-xl p-6 shadow-lg relative`} data-theme={theme}>
      <h3 className={`text-2xl font-bold mb-4 text-center bg-clip-text text-transparent drop-shadow-lg ${THEMES[theme].title}`}>
        <Trophy className="inline w-6 h-6 mr-2" />
        Challenge Results
      </h3>
      
      <div className="space-y-3">
        {allResults.map((result, index) => (
          <div key={result.name} className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
            index === 0 ? 'bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 border border-yellow-500/50' :
            index === 1 ? 'bg-gradient-to-r from-gray-400/20 to-gray-600/20 border border-gray-500/50' :
            darkMode ? 'bg-gray-700/50 border border-gray-600/30' : 'bg-gray-100/50 border border-gray-200/30'
          }`}>
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">
                {index + 1}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{result.avatar}</span>
                <div>
                  <p className={`font-semibold ${THEMES[theme].text}`}>
                    {result.name}
                    {result.isUser && <span className="ml-2 text-blue-500">(You)</span>}
                  </p>
                  <p className={`text-sm ${THEMES[theme].text}`}>
                    {result.difficulty} • {result.accuracy}% accuracy
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-xl font-bold ${THEMES[theme].statsValue}`}>
                {result.wpm} WPM
              </p>
              <p className={`text-sm ${THEMES[theme].text}`}>
                {result.time}s
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Difficulty Selection Component
const DifficultySelector = ({ darkMode, selectedDifficulty, onDifficultySelect, theme }) => {
  return (
    <div className={`w-full max-w-4xl mx-auto glass-card rounded-xl p-6 shadow-lg`} data-theme={theme}>
      <h2 className={`text-3xl font-bold mb-6 text-center bg-clip-text text-transparent drop-shadow-lg ${THEMES[theme].title}`}>
        Choose Your Challenge
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(BOT_DIFFICULTIES).map(([key, difficulty]) => (
          <div
            key={key}
            onClick={() => onDifficultySelect(key)}
            className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
              selectedDifficulty === key
                ? `${difficulty.borderColor} ${difficulty.bgColor}`
                : darkMode
                ? 'border-gray-600/30 bg-gray-700/30 hover:bg-gray-600/30'
                : 'border-gray-200/50 bg-gray-100/30 hover:bg-gray-200/50'
            }`}
          >
            <div className="text-center">
              <div className="text-4xl mb-3">{difficulty.avatar}</div>
              <h3 className={`text-xl font-bold mb-2 ${difficulty.color}`}>
                {difficulty.name}
              </h3>
              <p className={`text-sm ${THEMES[theme].text}`}>
                {difficulty.description}
              </p>
              <div className="mt-3 text-xs">
                <p className={THEMES[theme].text}>
                  WPM: {difficulty.wpmRange[0]}-{difficulty.wpmRange[1]}
                </p>
                <p className={THEMES[theme].text}>
                  Accuracy: {difficulty.accuracyRange[0]}%-{difficulty.accuracyRange[1]}%
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Virtual keyboard layout
const KEYBOARD_LAYOUT = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm']
];

// Key component for virtual keyboard
const KeyboardKey = ({ keyChar, isPressed, isCorrect, isIncorrect, theme }) => {
  const getKeyStyle = () => {
    if (isPressed) {
      if (isCorrect) return 'bg-green-500/90 text-white shadow-[0_0_12px_4px_rgba(34,197,94,0.3)] transform scale-95';
      if (isIncorrect) return 'bg-red-500/90 text-white shadow-[0_0_12px_4px_rgba(239,68,68,0.3)] transform scale-95';
      return 'bg-yellow-400/90 text-black shadow-[0_0_12px_4px_rgba(253,224,71,0.3)] transform scale-95';
    }
    
    // Theme-specific key styles
    switch (theme) {
      case 'hacker':
        return 'bg-black/90 hover:bg-green-900/100 backdrop-blur-md border border-green-500/50 text-green-400';
      case 'neon':
        return 'bg-purple-900/90 hover:bg-pink-900/100 backdrop-blur-md border border-pink-500/50 text-pink-300';
      case 'dark':
        return 'bg-gray-700/60 hover:bg-gray-600/80 backdrop-blur-md border border-gray-500/30 text-white';
      default: // light
        return 'bg-white/90 hover:bg-white/100 backdrop-blur-md border border-white/50 text-black';
    }
  };

  return (
    <div
      className={`
        flex items-center justify-center w-5 sm:w-10 h-5 sm:h-10 m-1 rounded-lg font-semibold
        transition-all duration-150 ease-in-out cursor-pointer
        ${getKeyStyle()}
      `}
    >
      {keyChar.toUpperCase()}
    </div>
  );
};

// Virtual keyboard component
const VirtualKeyboard = ({ pressedKey, isCorrect, isIncorrect, theme }) => {
  const getSpacebarStyle = () => {
    if (pressedKey === ' ') {
      if (isCorrect) return 'bg-green-400/80 text-white shadow-[0_0_8px_2px_rgba(34,197,94,0.7)]';
      if (isIncorrect) return 'bg-red-400/80 text-white shadow-[0_0_8px_2px_rgba(239,68,68,0.7)]';
      return 'bg-yellow-300/80 text-black shadow-[0_0_8px_2px_rgba(253,224,71,0.7)]';
    }
    
    // Theme-specific spacebar styles
    switch (theme) {
      case 'hacker':
        return 'bg-black/60 hover:bg-green-900/80 backdrop-blur-md border border-green-500/30 text-green-400';
      case 'neon':
        return 'bg-purple-900/60 hover:bg-pink-900/80 backdrop-blur-md border border-pink-500/30 text-pink-300';
      case 'dark':
        return 'bg-gray-700/60 hover:bg-gray-600/80 backdrop-blur-md border border-gray-500/30 text-white';
      default: // light
        return 'bg-white/60 hover:bg-white/80 backdrop-blur-md border border-white/30 text-black';
    }
  };

  return (
    <div className="glass-card rounded-xl p-6 shadow-lg mb-8" data-theme={theme}>
      <div className="flex items-center justify-center mb-4">
        <Keyboard className={`w-6 h-6 mr-2 ${theme === 'hacker' ? 'text-green-400' : theme === 'neon' ? 'text-pink-400' : theme === 'dark' ? 'text-blue-200' : 'text-blue-600'} drop-shadow-lg`} />
        <h3 className={`text-lg font-bold bg-clip-text text-transparent drop-shadow-lg ${
          theme === 'hacker' ? 'bg-gradient-to-r from-green-400 to-cyan-400' :
          theme === 'neon' ? 'bg-gradient-to-r from-pink-400 to-cyan-400' :
          theme === 'dark' ? 'bg-gradient-to-r from-blue-200 to-purple-300' :
          'bg-gradient-to-r from-blue-600 to-purple-500'
        }`}>
          Virtual Keyboard
        </h3>
      </div>
      <div className="flex flex-col  items-center space-y-2">
        {KEYBOARD_LAYOUT.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center ">
            {row.map((key) => (
              <KeyboardKey
                key={key}
                keyChar={key}
                isPressed={pressedKey === key}
                isCorrect={isCorrect}
                isIncorrect={isIncorrect}
                theme={theme}
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
              ${getSpacebarStyle()}
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
const StatsCard = ({ theme, icon: Icon, label, value, color = "blue" }) => {
  const getThemeStyles = () => {
    switch (theme) {
      case 'hacker':
        return {
          card: 'bg-black/80 border border-green-500/30',
          text: 'text-green-400',
          value: 'text-green-300',
          icon: 'text-green-400'
        };
      case 'neon':
        return {
          card: 'bg-purple-900/80 border border-pink-500/30',
          text: 'text-pink-300',
          value: 'text-pink-200',
          icon: 'text-pink-400'
        };
      case 'dark':
        return {
          card: 'bg-gray-800/90 border border-gray-500/30',
          text: 'text-white',
          value: 'text-white',
          icon: 'text-blue-200'
        };
      default: // light
        return {
          card: 'bg-white/92 border border-white/50',
          text: 'text-gray-500',
          value: 'text-black',
          icon: 'text-blue-600'
        };
    }
  };

  const styles = getThemeStyles();

  return (
    <div className={`glass-card p-4 rounded-xl ${styles.card} transition-all duration-300 hover:scale-105`} data-theme={theme}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-semibold drop-shadow-md ${styles.text}`}>{label}</p>
          <p className={`text-2xl font-extrabold drop-shadow-md ${styles.value}`}>{value}</p>
        </div>
        <Icon className={`w-8 h-8 drop-shadow-md ${styles.icon}`} />
      </div>
    </div>
  );
};

// Theme drawer component
const ThemeDrawer = ({ isOpen, onClose, currentTheme, onThemeChange }) => {
  const themes = Object.keys(THEMES);

  return (
    <>
      {/* Theme button container */}
      <div className="fixed top-32 left-4 z-50">
        {/* Main theme button */}
        <button
          onClick={() => onClose(!isOpen)}
          className="w-12 h-12 rounded-full glass-card shadow-lg hover:scale-110 transition-all duration-300 flex items-center justify-center"
          data-theme={currentTheme}
        >
          <Palette className="w-6 h-6 text-blue-600" />
        </button>

        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute top-14 left-0 mt-2 w-32 glass-card bg-white text-black rounded-lg shadow-xl border border-gray-200 dark:border-gray-700" data-theme={currentTheme}>
            <div className="py-2">
              {themes.map((themeKey) => {
                const theme = THEMES[themeKey];
                const isActive = currentTheme === themeKey;
                
                return (
                  <button
                    key={themeKey}
                    onClick={() => {
                      onThemeChange(themeKey);
                      onClose(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-sm font-medium transition-colors  text-black duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      isActive 
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{theme.name}</span>
                      {isActive && (
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => onClose(false)} />
      )}
    </>
  );
};

// Main typing interface component
const BotTypingInterface = ({darkMode}) => {
  const { userEmail, userName } = useAuth();
  
  // Theme state
  const [currentTheme, setCurrentTheme] = useState(darkMode ? 'dark' : 'light');
  const [isThemeDrawerOpen, setIsThemeDrawerOpen] = useState(false);

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
  
  // Bot state
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [bots, setBots] = useState([]);
  const [botResults, setBotResults] = useState([]);
  const [userResult, setUserResult] = useState(null);
  const [showDifficultySelector, setShowDifficultySelector] = useState(true);
  
  // Refs
  const timerRef = useRef(null);
  const textRef = useRef(null);
  const activeCharRef = useRef(null);
  const mistakesRef = useRef(0);
  const correctCharsRef = useRef(0);
  const startTimeRef = useRef(null);
  const targetTimeRef = useRef(null);
  const botTimerRef = useRef(null);
  const [progressData, setProgressData] = useState([]); // Array of {time, wpm}
  const [intervalStep, setIntervalStep] = useState(0); // Track elapsed time in 5s steps
  const [resetTrigger, setResetTrigger] = useState(0); // Trigger for reset
  const hiddenInputRef = useRef(null);

  // Get current theme object
  const theme = THEMES[currentTheme];

  // Focus the hidden input on mount and when the main area is clicked/tapped
  useEffect(() => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
    }
  }, []);

  // Helper to focus input on tap/click
  const focusInput = () => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
    }
  };

  // Handle input from the hidden input (for mobile)
  const handleInputChange = (e) => {
    const value = e.target.value;
    if (isFinished) return;
    // Only process the new character(s)
    let newChar = value.slice(inputText.length);
    if (!isStarted && newChar) {
      setIsStarted(true);
      setIsActive(true);
      startTimeRef.current = Date.now();
      // Start bot typing when user starts
      if (selectedDifficulty && bots.length > 0) {
        startBotTyping(currentText);
      }
    }
    // Simulate key presses for each new character
    for (let i = 0; i < newChar.length; i++) {
      const key = newChar[i];
      // Only allow typing up to the text length
      if (currentIndex < currentText.length) {
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
        if (currentIndex + 1 === currentText.length) {
          finishTest();
        }
        setTimeout(() => {
          setPressedKey('');
          setIsCorrectKey(false);
          setIsIncorrectKey(false);
        }, 150);
      }
    }
  };

  // Initialize bots based on difficulty
  const initializeBots = useCallback((difficulty) => {
    const botCount = 1; // Only 1 bot + 1 user = 2 total
    const newBots = [];
    
    for (let i = 0; i < botCount; i++) {
      const botName = `AI Bot`;
      const bot = new BotAI(difficulty, botName);
      newBots.push(bot);
    }
    
    setBots(newBots);
  }, []);

  // Start bot typing simulation
  const startBotTyping = useCallback((text) => {
    bots.forEach(bot => bot.startTyping(text));
    
    botTimerRef.current = setInterval(() => {
      setBots(prevBots => {
        const updatedBots = prevBots.map(bot => {
          if (!bot.isFinished(text)) {
            // Simulate realistic typing with delays
            const shouldType = Math.random() < 0.3; // 30% chance to type each interval
            if (shouldType) {
              bot.getNextChar(text);
            }
          }
          return bot;
        });
        
        const allFinished = updatedBots.every(bot => bot.isFinished(text));
        if (allFinished) {
          clearInterval(botTimerRef.current);
        }
        
        return updatedBots;
      });
    }, 100); // Update every 100ms for more responsive typing
  }, [bots]);

  // Finish the test and show results
  const finishTest = useCallback(() => {
    setIsActive(false);
    setIsFinished(true);
    clearInterval(timerRef.current);
    clearInterval(botTimerRef.current);
    
    const totalTime = (Date.now() - startTimeRef.current) / 1000;
    const wordsTyped = correctChars / 5;
    const finalWpm = Math.round((wordsTyped / totalTime) * 60);
    const finalAccuracy = Math.round(((correctChars - mistakes) / correctChars) * 100) || 100;
    
    const userResultData = {
      name: userName || 'You',
      avatar: '👤',
      wpm: finalWpm,
      accuracy: finalAccuracy,
      time: Math.round(totalTime),
      difficulty: selectedDifficulty,
      isUser: true
    };
    
    const botResultsData = bots.map(bot => ({
      name: bot.name,
      avatar: BOT_DIFFICULTIES[selectedDifficulty].avatar,
      wpm: bot.getWPM(currentText),
      accuracy: bot.getAccuracy(),
      time: Math.round((Date.now() - bot.startTime) / 1000),
      difficulty: selectedDifficulty,
      isUser: false
    }));
    
    setUserResult(userResultData);
    setBotResults(botResultsData);
    setShowLeaderboard(true);
  }, [bots, correctChars, mistakes, selectedDifficulty, currentText]);

  // Initialize text
  useEffect(() => {
    if (selectedDifficulty) {
      resetTest();
    }
  }, [selectedDifficulty]);

  // Auto-scroll to active character with improved positioning
  useEffect(() => {
    if (activeCharRef.current && isStarted) {
      const container = textRef.current;
      const activeElement = activeCharRef.current;
      
      if (container && activeElement) {
        const containerRect = container.getBoundingClientRect();
        const elementRect = activeElement.getBoundingClientRect();
        
        const elementCenter = elementRect.left + elementRect.width / 2;
        const containerCenter = containerRect.left + containerRect.width / 2;
        const offset = elementCenter - containerCenter;
        
        container.scrollLeft += offset;
      }
    }
  }, [currentIndex, isStarted]);

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

  // Timer cleanup effect
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  // Initialize timer when test starts
  useEffect(() => {
    if (isStarted && timeLeft > 0 && !timerRef.current) {
      const startTime = Date.now();
      targetTimeRef.current = startTime + (timeLeft * 1000);
      
      console.log('Timer started:', { startTime, targetTime: targetTimeRef.current, timeLeft });
      
      timerRef.current = setInterval(() => {
        const currentTime = Date.now();
        const remainingTime = Math.max(0, Math.ceil((targetTimeRef.current - currentTime) / 1000));
        
        setTimeLeft(remainingTime);
        
        if (remainingTime <= 0) {
          console.log('Timer finished');
          setIsActive(false);
          setIsFinished(true);
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }, 100);
    }
  }, [isStarted, timeLeft, resetTrigger]);

  // Handle timer cleanup on reset
  useEffect(() => {
    if (resetTrigger > 0) {
      // Clear any existing timer when reset is triggered
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      targetTimeRef.current = null;
    }
  }, [resetTrigger]);

  // Update stats regularly
  useEffect(() => {
    calculateStats();
  }, [inputText, calculateStats]);

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
        // Start bot typing when user starts
        if (selectedDifficulty && bots.length > 0) {
          startBotTyping(currentText);
        }
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
          finishTest();
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
    console.log('Reset triggered');
    clearInterval(timerRef.current);
    clearInterval(botTimerRef.current);
    timerRef.current = null;
    botTimerRef.current = null;
    
    const randomText = TEXT_SAMPLES[Math.floor(Math.random() * TEXT_SAMPLES.length)];
    setCurrentText(randomText);
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
    setShowLeaderboard(false);
    setBotResults([]);
    setUserResult(null);
    mistakesRef.current = 0;
    correctCharsRef.current = 0;
    startTimeRef.current = null;
    targetTimeRef.current = null;
    setPressedKey('');
    setIsCorrectKey(false);
    setIsIncorrectKey(false);
    setResetTrigger(prev => prev + 1); // Trigger timer reset
    
    // Initialize bots if difficulty is selected
    if (selectedDifficulty) {
      initializeBots(selectedDifficulty);
      // Don't start bot typing automatically - wait for user to start
    }
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
        return theme.incorrectText;
      }
      return inputText[index] === currentText[index] 
        ? theme.correctText
        : theme.incorrectText;
    }
    if (index === currentIndex) {
      return theme.currentChar;
    }
    return theme.incompleteText;
  };

  // Show difficulty selector if no difficulty is selected
  if (!selectedDifficulty) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${theme.bg}`}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className={`text-4xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent drop-shadow-2xl ${theme.title}`}>
              🤖 AI Bot Typing Challenge
            </h1>
            <p className={`text-lg font-semibold drop-shadow-md ${theme.subtitle}`}>
              Compete against AI bots with different difficulty levels
            </p>
          </div>
          
          <DifficultySelector 
            darkMode={darkMode} 
            selectedDifficulty={selectedDifficulty} 
            onDifficultySelect={setSelectedDifficulty}
            theme={currentTheme}
          />
        </div>
      </div>
    );
  }

  // Show leaderboard if test is finished
  if (showLeaderboard) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${theme.bg}`}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className={`text-4xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent drop-shadow-2xl ${theme.title}`}>
              🏆 Challenge Results
            </h1>
          </div>
         
          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={resetTest}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Try Again
            </button>
            <button
              onClick={() => {
                setSelectedDifficulty(null);
                setShowLeaderboard(false);
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 flex items-center"
            >
              <X className="w-5 h-5 mr-2" />
              New Challenge
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme.bg}`}>
      {/* Theme Drawer */}
      <ThemeDrawer
        isOpen={isThemeDrawerOpen}
        onClose={setIsThemeDrawerOpen}
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
      />

      {/* Visually hidden input for mobile typing */}
      <input
        ref={hiddenInputRef}
        type="text"
        inputMode="text"
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        value={inputText}
        onChange={handleInputChange}
        style={{
          position: 'absolute',
          opacity: 0,
          pointerEvents: 'none',
          width: 1,
          height: 1,
          zIndex: -1,
        }}
        tabIndex={-1}
        aria-hidden="true"
      />

      <div className="flex">
        {/* Main Content Area */}
        <div className="flex-1 lg:mr-80">
          <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className={`text-3xl font-bold bg-clip-text text-transparent drop-shadow-lg ${theme.title}`}>
                {BOT_DIFFICULTIES[selectedDifficulty]?.name} Challenge
              </h1>
              <div className="flex items-center justify-center mt-2">
                <span className="text-2xl mr-2">{BOT_DIFFICULTIES[selectedDifficulty]?.avatar}</span>
                <span className={`font-semibold ${BOT_DIFFICULTIES[selectedDifficulty]?.color}`}>
                  {selectedDifficulty.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <Clock className={`w-5 h-5 ${theme.text}`} />
                <select
                  value={testDuration}
                  onChange={(e) => {
                    const newDuration = Number(e.target.value);
                    setTestDuration(newDuration);
                    setTimeLeft(newDuration);
                    if (timerRef.current) {
                      clearInterval(timerRef.current);
                      timerRef.current = null;
                    }
                    targetTimeRef.current = null;
                  }}
                  className={`px-3 py-2 rounded-lg border ${theme.cardBorder} ${theme.card} ${theme.text}`}
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
              <StatsCard theme={currentTheme} icon={Clock} label="Time Left" value={formatTime(timeLeft)} color="blue" />
              <StatsCard theme={currentTheme} icon={Target} label="WPM" value={wpm} color="green" />
              <StatsCard theme={currentTheme} icon={Trophy} label="Accuracy" value={`${accuracy}%`} color="purple" />
              <StatsCard theme={currentTheme} icon={AlertCircle} label="Mistakes" value={mistakes} color="red" />
            </div>

            {/* Start prompt */}
            {!isStarted && (
              <div className="text-center mb-8">
                <p className={`text-2xl animate-pulse ${theme.text}`}>
                  Press any key to start typing...
                </p>
              </div>
            )}

            {/* Text display */}
            <div className="mb-8">
              <div
                ref={textRef}
                className="glass-card rounded-xl p-6 shadow-lg max-h-64 overflow-x-auto"
                data-theme={currentTheme}
                style={{
                  pointerEvents: 'none',
                }}
              >
                <div className="text-xl md:text-2xl leading-relaxed font-mono text-center whitespace-nowrap">
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
                {/* Progress Chart */}
                <div className="glass-card rounded-xl p-6 shadow-lg md:max-w-[700px] mx-auto mb-6" data-theme={currentTheme}>
                  <h3 className={`text-xl font-bold mb-4 text-center bg-clip-text text-transparent drop-shadow-lg ${theme.title}`}>
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
                      return <div className={`text-center ${theme.text}`}>Not enough data to display chart.</div>;
                    }
                    return (
                      <Line
                        data={{
                          labels: times.map(t => `${t}s`),
                          datasets: [
                            {
                              label: 'WPM',
                              data: wpmPoints,
                              borderColor: theme.chartText,
                              backgroundColor: theme.chartGrid,
                              pointBackgroundColor: theme.chartText,
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
                                title: { display: true, text: 'Time (s)', color: theme.chartText },
                              ticks: { color: theme.chartText },
                              grid: { color: theme.chartGrid },
                            },
                            y: {
                              title: { display: true, text: 'WPM', color: theme.chartText },
                              ticks: { color: theme.chartText },
                              grid: { color: theme.chartGrid },
                              beginAtZero: true,
                            },
                          },
                        }}
                        height={220}
                      />
                    );
                  })()}
                </div>

                {/* Performance Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Bar Chart - Performance Metrics */}
                  <div className="glass-card rounded-xl p-6 shadow-lg" data-theme={currentTheme}>
                    <h3 className={`text-lg font-bold mb-4 text-center bg-clip-text text-transparent drop-shadow-lg ${theme.title}`}>
                      Performance Metrics
                    </h3>
                    <Bar
                      data={{
                        labels: ['WPM', 'Accuracy', 'Correct', 'Mistakes'],
                        datasets: [
                          {
                            label: 'Score',
                            data: [wpm, accuracy, correctChars, mistakes],
                            backgroundColor: [
                              theme.chartText,
                              theme.chartText,
                              theme.chartText,
                              theme.chartText,
                            ],
                            borderColor: theme.chartText,
                            borderWidth: 2,
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
                            ticks: { color: theme.chartText },
                            grid: { color: theme.chartGrid },
                          },
                          y: {
                            ticks: { color: theme.chartText },
                            grid: { color: theme.chartGrid },
                            beginAtZero: true,
                          },
                        },
                      }}
                      height={200}
                    />
                  </div>

                  {/* Pie Chart - Accuracy Breakdown */}
                  <div className="glass-card rounded-xl p-6 shadow-lg" data-theme={currentTheme}>
                    <h3 className={`text-lg font-bold mb-4 text-center bg-clip-text text-transparent drop-shadow-lg ${theme.title}`}>
                      Accuracy Breakdown
                    </h3>
                    <Pie
                      data={{
                        labels: ['Correct', 'Incorrect'],
                        datasets: [
                          {
                            data: [correctChars, mistakes],
                            backgroundColor: [
                              theme.chartText,
                              '#ef4444', // Red for mistakes
                            ],
                            borderColor: theme.chartText,
                            borderWidth: 2,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            display: true,
                            position: 'bottom',
                            labels: {
                              color: theme.chartText,
                              font: {
                                size: 12,
                              },
                            },
                          },
                          title: { display: false },
                        },
                      }}
                      height={200}
                    />
                  </div>
                </div>
              </>) : (
                <VirtualKeyboard
                  pressedKey={pressedKey}
                  isCorrect={isCorrectKey}
                  isIncorrect={isIncorrectKey}
                  theme={currentTheme}
                />
              )}
            </div>

            {/* Results */}
            {isFinished && (
              <div className="glass-card rounded-xl p-6 shadow-lg" data-theme={currentTheme}>
                <h2 className={`text-2xl font-extrabold text-center mb-6 bg-clip-text text-transparent drop-shadow-lg ${theme.title}`}>
                  Test Complete! 🎉
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className={`text-3xl font-extrabold drop-shadow-lg ${theme.statsValue}`}>{wpm}</div>
                    <div className={`text-sm ${theme.text}`}>WPM</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-3xl font-extrabold drop-shadow-lg ${theme.statsValue}`}>{accuracy}%</div>
                    <div className={`text-sm ${theme.text}`}>Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-3xl font-extrabold drop-shadow-lg ${theme.statsValue}`}>{correctChars}</div>
                    <div className={`text-sm ${theme.text}`}>Correct</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-3xl font-extrabold drop-shadow-lg ${theme.statsValue}`}>{mistakes}</div>
                    <div className={`text-sm ${theme.text}`}>Mistakes</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Leaderboard - Fixed on right side */}
        <div className="hidden lg:block fixed right-4 top-1/2 transform -translate-y-1/2 w-80 z-50">
          {selectedDifficulty && bots.length > 0 && isStarted && !isFinished && (
            <RealTimeLeaderboard 
              darkMode={darkMode}
              bots={bots}
              selectedDifficulty={selectedDifficulty}
              theme={currentTheme}
              isStarted={isStarted}
              isFinished={isFinished}
              currentText={currentText}
              userWpm={wpm}
              userAccuracy={accuracy}
              userProgress={(currentIndex / currentText.length) * 100}
            />
          )}
        </div>
      </div>

      {/* Mobile Leaderboard - Fixed at bottom */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-4">
        {selectedDifficulty && bots.length > 0 && isStarted && !isFinished && (
          <RealTimeLeaderboard 
            darkMode={darkMode}
            bots={bots}
            selectedDifficulty={selectedDifficulty}
            theme={currentTheme}
            isStarted={isStarted}
            isFinished={isFinished}
            currentText={currentText}
            userWpm={wpm}
            userAccuracy={accuracy}
            userProgress={(currentIndex / currentText.length) * 100}
          />
        )}
      </div>
    </div>
  );
};

export default BotTypingInterface;

<style jsx global>{`
  .glass-card {
    background: rgba(255,255,255,0.92);
    box-shadow: 0 8px 32px 0 rgba(80,80,180,0.10), 0 2px 8px 0 rgba(0,0,0,0.04);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-radius: 18px;
    border: 1.5px solid rgba(180,180,220,0.18);
  }
  
  /* Theme-specific glass card styles */
  .glass-card[data-theme="hacker"] {
    background: rgba(0,0,0,0.8);
    border: 1.5px solid rgba(16,185,129,0.3);
    box-shadow: 0 8px 32px 0 rgba(16,185,129,0.15), 0 2px 8px 0 rgba(0,0,0,0.1);
  }
  
  .glass-card[data-theme="neon"] {
    background: rgba(147,51,234,0.8);
    border: 1.5px solid rgba(236,72,153,0.3);
    box-shadow: 0 8px 32px 0 rgba(236,72,153,0.15), 0 2px 8px 0 rgba(0,0,0,0.1);
  }
  
  .glass-card[data-theme="dark"] {
    background: rgba(30,41,59,0.45);
    border: 1px solid rgba(255,255,255,0.10);
    box-shadow: 0 8px 32px 0 rgba(59,130,246,0.15), 0 2px 8px 0 rgba(0,0,0,0.1);
  }

  /* Dropdown animation */
  .glass-card[data-theme] {
    animation: dropdownFadeIn 0.2s ease-out;
  }

  @keyframes dropdownFadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`}</style>