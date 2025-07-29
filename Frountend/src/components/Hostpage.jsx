import React, { useState } from 'react';
import { FaGithub, FaTwitter, FaInstagram, FaYoutube, FaDiscord, FaUsers, FaPlus, FaSignInAlt, FaCopy, FaCheck, FaGamepad, FaRocket, FaStar, FaFire, FaTrophy, FaKeyboard } from "react-icons/fa";
import { HiSparkles, HiLightningBolt } from "react-icons/hi";
import { BiGame } from "react-icons/bi";
import { MdGroups, MdSpeed } from "react-icons/md";
import axios from '../api/axiosInstance';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Hostpage = ({ darkMode }) => {
  const { user } = useSelector((state) => state.user);
  const [roomCode, setRoomCode] = useState('');
  const [createdRoom, setCreatedRoom] = useState(null);
  const [hostName, setHostName] = useState('');
  const [hostEmail, setHostEmail] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [joinedRoom, setJoinedRoom] = useState(null);
  const [joinError, setJoinError] = useState('');
  const [createError, setCreateError] = useState('');
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Room creation modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomConfig, setRoomConfig] = useState({
    playerLimit: 4,
    timer: 60,
    difficulty: 'normal',
    mode: 'multiplayer',
    isPrivate: false,
    allowSpectators: true
  });
  
  const navigate = useNavigate();
  

  // Handle copy room code
  const handleCopyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Handle group creation
  const handleCreateGroup = async () => {
    setCreateError('');
    setLoading(true);
    try {
      const response = await axios.post('/match/create', {
        name: user?.name,
        email: user?.email,
        roomConfig: roomConfig
      });
      setCreatedRoom(response.data.roomId);
      setHostName(response.data.hostName);
      setHostEmail(response.data.hostEmail);
      setIsCreating(false);
      setShowCreateModal(false);
      // Reset joined group state
      setJoinedRoom(null);
      setJoinCode(response.data.roomId);
      setRoomCode(response.data.roomId);
      setJoinSuccess(false);
      // Emit joinRoom after successful creation
  
    } catch (err) {
      setCreateError(err.response?.data?.message || 'Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  // Handle group joining
  const handleJoinGroup = async () => {
    setJoinError('');
    setJoinSuccess(false);
    setLoading(true);
    try {
      const response = await axios.post('/match/join', {
        roomId: joinCode,
        name: user?.name,
        email: user?.email,
      });
      
      // Check if user was added as viewer due to closed room
      if (response.data.isViewer) {
        setJoinError('Room is closed by admin. You have been added as a spectator.');
        setJoinSuccess(false);
      } else {
        setRoomCode(joinCode);
        setHostName(response.data.hostName);
        setHostEmail(response.data.hostEmail);
        setJoinedRoom(joinCode);
        setJoinSuccess(true);
        setIsJoining(false);
        setJoinCode(joinCode);
        // Reset created group state
        setCreatedRoom('');
        console.log("createdRoom of handleJoinGroup", createdRoom);
      }
    } catch (err) {
      setJoinError(err.response?.data?.message || 'Failed to join room');
    } finally {
      setLoading(false);
    }
  };
  
  
  // Add participant to match if not host, then navigate
  const handleEnterBattle = async () => {
    const isHost = user?.email;
    const roomId = createdRoom || joinedRoom;
    if (!roomId) return;
    if (isHost) {
      try {
        setLoading(true);
        await axios.post('/match/add-participant', {
          roomId,
          name: user?.name,
          email: user?.email,
        });
      
      } catch (err) {
        console.log("err of handleEnterBattle", err);
        // Optionally handle error, but proceed if already exists
      } finally {
        setLoading(false);
        navigate(`/match/${roomId}`);
      }
    }
  };

  // Room creation modal component
  const RoomCreationModal = () => {
    if (!showCreateModal) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowCreateModal(false)}
        ></div>
        
        {/* Modal */}
        <div className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
          darkMode 
            ? 'bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700' 
            : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200'
        }`}>
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Create Battle Room
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Configure your battle room settings
            </p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Player Limit */}
            <div>
              <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                Player Limit
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[2, 4, 6, 8, 10, 12].map((limit) => (
                  <button
                    key={limit}
                    onClick={() => setRoomConfig(prev => ({ ...prev, playerLimit: limit }))}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      roomConfig.playerLimit === limit
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{limit}</div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Players</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Timer */}
            <div>
              <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                Time Limit (seconds)
              </label>
              <div className="grid grid-cols-4 gap-3">
                {[30, 60, 120, 180, 300, 600].map((time) => (
                  <button
                    key={time}
                    onClick={() => setRoomConfig(prev => ({ ...prev, timer: time }))}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      roomConfig.timer === time
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{time}</div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>sec</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'easy', label: 'Easy', color: 'green' },
                  { value: 'normal', label: 'Normal', color: 'blue' },
                  { value: 'hard', label: 'Hard', color: 'red' }
                ].map(({ value, label, color }) => (
                  <button
                    key={value}
                    onClick={() => setRoomConfig(prev => ({ ...prev, difficulty: value }))}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      roomConfig.difficulty === value
                        ? `border-${color}-500 bg-${color}-50 dark:bg-${color}-900/20 text-${color}-700 dark:text-${color}-300`
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Mode */}
            <div>
              <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                Game Mode
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'multiplayer', label: 'Multiplayer', icon: '👥' },
                  { value: 'tournament', label: 'Tournament', icon: '🏆' }
                ].map(({ value, label, icon }) => (
                  <button
                    key={value}
                    onClick={() => setRoomConfig(prev => ({ ...prev, mode: value }))}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      roomConfig.mode === value
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="text-2xl mb-1">{icon}</div>
                    <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                    Private Room
                  </label>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Only invited players can join
                  </p>
                </div>
                <button
                  onClick={() => setRoomConfig(prev => ({ ...prev, isPrivate: !prev.isPrivate }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    roomConfig.isPrivate 
                      ? 'bg-blue-600' 
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    roomConfig.isPrivate ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                    Allow Spectators
                  </label>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Others can watch without playing
                  </p>
                </div>
                <button
                  onClick={() => setRoomConfig(prev => ({ ...prev, allowSpectators: !prev.allowSpectators }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    roomConfig.allowSpectators 
                      ? 'bg-green-600' 
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    roomConfig.allowSpectators ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
            <button
              onClick={() => setShowCreateModal(false)}
              className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                darkMode 
                  ? 'border-gray-600 text-gray-300 hover:border-gray-500 hover:text-gray-200' 
                  : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleCreateGroup}
              disabled={loading}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 ${
                darkMode
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <FaRocket />
                  Create Room
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className={`min-h-screen transition-all duration-500 ${
      darkMode
      ? 'bg-gradient-to-br from-blue-950 via-black-900 to-gray-900'
      : 'bg-gradient-to-br from-blue-100 via-white to-blue-200'
  }`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-10 left-2 w-40 h-40 md:w-72 md:h-72 ${darkMode ? 'bg-blue-500/10' : 'bg-purple-200/20'} rounded-full blur-3xl animate-pulse`}></div>
        <div className={`absolute bottom-10 right-2 w-52 h-52 md:w-96 md:h-96 ${darkMode ? 'bg-purple-500/10' : 'bg-blue-200/20'} rounded-full blur-3xl animate-pulse delay-1000`}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-64 md:h-64 ${darkMode ? 'bg-indigo-500/5' : 'bg-indigo-200/15'} rounded-full blur-3xl animate-pulse delay-500`}></div>
      </div>

      <div className="relative z-10 container mx-auto px-2 py-4 md:px-4 md:py-8 lg:py-12">
        {/* Header Section */}
        <header className="text-center mb-8 md:mb-12 lg:mb-16">
          <div className="flex justify-center items-center gap-2 md:gap-4 mb-4 md:mb-6">
            <div className={`p-2 md:p-4 rounded-2xl ${darkMode ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gradient-to-r from-blue-500 to-indigo-600'} shadow-2xl transform hover:scale-110 transition-all duration-300`}>
              <FaKeyboard className="text-white text-2xl md:text-4xl lg:text-5xl" />
            </div>
            <HiSparkles className={`${darkMode ? 'text-yellow-400' : 'text-yellow-500'} text-xl md:text-3xl animate-bounce`} />
          </div>
          
          <h1 className={`text-lg xs:text-xl sm:text-2xl md:text-4xl lg:text-5xl font-extrabold mb-2 md:mb-4 lg:mb-6 ${
            darkMode 
              ? 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent' 
              : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent'
          }`}>
            ⚡ Speed Type Battle ⚡
          </h1>
          
          <p className={`text-xs sm:text-sm md:text-base lg:text-lg mb-4 md:mb-8 max-w-3xl mx-auto leading-relaxed ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Create epic typing battles with friends! <FaTrophy className="inline text-yellow-500 mx-1 md:mx-2" />
            Test your speed, accuracy, and compete in real-time!
          </p>

          {/* Social Links */}
          <div className="flex justify-center gap-2 md:gap-4 lg:gap-6 mb-4 md:mb-8">
            {[
              { icon: FaGithub, href: "https://github.com", color: "hover:text-gray-600" },
              { icon: FaTwitter, href: "https://twitter.com", color: "hover:text-blue-400" },
              { icon: FaInstagram, href: "https://instagram.com", color: "hover:text-pink-500" },
              { icon: FaYoutube, href: "https://youtube.com", color: "hover:text-red-500" },
              { icon: FaDiscord, href: "https://discord.com", color: "hover:text-indigo-500" }
            ].map(({ icon: Icon, href, color }) => (
              <a
                key={href}
                href={href}
                className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} ${color} transform hover:scale-125 transition-all duration-300 p-3 rounded-full ${darkMode ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon size={28} />
              </a>
            ))}
          </div>

          {/* Stats/Features */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-6 max-w-4xl mx-auto">
            {[
              { icon: FaUsers, label: "Multiplayer", count: "10+" },
              { icon: MdSpeed, label: "Real-time", count: "0ms" },
              { icon: FaFire, label: "Active Users", count: "1K+" },
              { icon: FaStar, label: "Rating", count: "4.9★" }
            ].map(({ icon: Icon, label, count }) => (
              <div key={label} className={`p-4 rounded-xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
                darkMode 
                  ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20' 
                  : 'bg-white/40 border-white/20 hover:bg-white/60 hover:border-white/40'
              }`}>
                <Icon className={`mx-auto mb-2 text-2xl ${darkMode ? 'text-blue-400' : 'text-indigo-600'}`} />
                <div className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>{count}</div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{label}</div>
              </div>
            ))}
          </div>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Create Group Section */}
          <section className={`backdrop-blur-lg rounded-2xl md:rounded-3xl p-3 md:p-6 lg:p-8 shadow-2xl border transition-all duration-500 hover:shadow-3xl ${
            darkMode 
              ? 'bg-gradient-to-br from-white/10 to-white/5 border-white/20 hover:from-white/15 hover:to-white/10' 
              : 'bg-gradient-to-br from-white/70 to-white/50 border-white/30 hover:from-white/80 hover:to-white/60'
          }`}>
            <div className="text-center mb-4 md:mb-6">
              <div className={`inline-flex items-center gap-2 md:gap-3 p-2 md:p-4 rounded-2xl mb-2 md:mb-4 ${
                darkMode ? 'bg-gradient-to-r from-emerald-600 to-blue-600' : 'bg-gradient-to-r from-emerald-500 to-blue-500'
              } shadow-xl transform hover:scale-105 transition-all duration-300`}>
                <FaPlus className="text-white text-lg md:text-2xl" />
                <MdGroups className="text-white text-xl md:text-3xl" />
              </div>
              <h2 className={`text-lg md:text-2xl lg:text-3xl font-bold mb-1 md:mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Start New Battle
              </h2>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-xs md:text-base`}>
                Create a room and invite friends to compete!
              </p>
        </div>

            <div className="space-y-2 md:space-y-4">
          <button
            onClick={() => setShowCreateModal(true)}
            disabled={loading}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
              darkMode
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <FaRocket />
              Create Battle Room
            </div>
          </button>

          {createdRoom && (
  <div className={`mt-4 p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl border-2 border-dashed transition-all duration-500 ${
    darkMode ? 'bg-emerald-900/20 border-emerald-400/50' : 'bg-emerald-50 border-emerald-400'
  }`}>
    <div className="text-center space-y-3 sm:space-y-4">
      <div className="flex items-center justify-center gap-2">
        <FaTrophy className="text-yellow-500 text-lg sm:text-xl md:text-2xl" />
        <span className={`text-base sm:text-lg md:text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Room Created!
        </span>
      </div>
      
      <div className={`p-7 rounded-lg sm:rounded-xl ${darkMode ? 'bg-black/20' : 'bg-white/50'}`}>
          <span className={`text-sm sm:text-base md:text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Room Code:
          </span>
            <button
              onClick={() => handleCopyCode(createdRoom)}
              className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                darkMode ? 'hover:bg-white/10' : 'hover:bg-black/10'
              }`}
            >
              {copied ? 
                <FaCheck className="text-green-500 text-sm sm:text-base" /> : 
                <FaCopy className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm sm:text-base`} />
              }
            </button>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-2">
          <div className="flex items-center gap-2">
            <code className={`text-sm sm:text-base md:text-lg font-mono font-bold px-2 sm:px-3 py-1 rounded-lg ${
              darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
            }`}>
              {createdRoom}
            </code>
          </div>
        </div>

        <div className={`text-xs sm:text-sm space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <div className="flex items-center justify-center gap-1">
            <span>📧</span>
            <span className="truncate">Host: {hostEmail}</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <span>👤</span>
            <span className="truncate">Name: {hostName}</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleEnterBattle}
        disabled={loading}
        className={`w-full py-2 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
          darkMode
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
            : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
        }`}
      >
        <div className="flex items-center justify-center gap-2">
          <BiGame className="text-base sm:text-lg md:text-xl" />
          <span>Start Battle!</span>
        </div>
      </button>
    </div>
  </div>
)}

{createError && (
  <div className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-l-4 ${
    darkMode ? 'bg-red-900/20 border-red-400 text-red-300' : 'bg-red-50 border-red-400 text-red-700'
  }`}>
    <div className="flex items-start gap-2">
      <span className="text-sm sm:text-base">❌</span>
      <span className="text-sm sm:text-base">{createError}</span>
    </div>
  </div>
)}
            </div>
          </section>

          {/* Join Group Section */}
          <section className={`backdrop-blur-lg rounded-2xl md:rounded-3xl p-3 md:p-6 lg:p-8 shadow-2xl border transition-all duration-500 hover:shadow-3xl ${
            darkMode 
              ? 'bg-gradient-to-br from-white/10 to-white/5 border-white/20 hover:from-white/15 hover:to-white/10' 
              : 'bg-gradient-to-br from-white/70 to-white/50 border-white/30 hover:from-white/80 hover:to-white/60'
          }`}>
            <div className="text-center mb-4 md:mb-6">
              <div className={`inline-flex items-center gap-2 md:gap-3 p-2 md:p-4 rounded-2xl mb-2 md:mb-4 ${
                darkMode ? 'bg-gradient-to-r from-orange-600 to-red-600' : 'bg-gradient-to-r from-orange-500 to-red-500'
              } shadow-xl transform hover:scale-105 transition-all duration-300`}>
                <FaSignInAlt className="text-white text-lg md:text-2xl" />
                <FaGamepad className="text-white text-xl md:text-3xl" />
              </div>
              <h2 className={`text-lg md:text-2xl lg:text-3xl font-bold mb-1 md:mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Join Battle
              </h2>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-xs md:text-base`}>
                Enter a room code to join an existing battle!
              </p>
            </div>

            <div className="space-y-2 md:space-y-4">
              <div className="relative">
          <input
            type="text"
                  placeholder="Enter room code (e.g. ABC123)"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  disabled={loading}
                  className={`w-full py-4 px-6 rounded-xl text-lg font-mono transition-all duration-300 focus:ring-4 focus:outline-none disabled:opacity-50 ${
                    darkMode 
                      ? 'bg-black/30 text-white placeholder-gray-400 border-2 border-white/20 focus:border-blue-400 focus:ring-blue-400/25'
                      : 'bg-white/80 text-gray-800 placeholder-gray-500 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500/25'
                  }`}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <FaKeyboard className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
              </div>

          <button
            onClick={() => setIsJoining(!isJoining)}
                disabled={loading}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 ${
                  isJoining
                    ? darkMode
                      ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white'
                      : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white'
                    : darkMode
                      ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white'
                      : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  {isJoining ? <FaCheck /> : <FaSignInAlt />}
                  {isJoining ? 'Cancel Join' : 'Join Battle Room'}
                </div>
          </button>

          {isJoining && (
            <button
              onClick={handleJoinGroup}
                  disabled={loading || !joinCode}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 ${
                    darkMode
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <HiLightningBolt />}
                    {loading ? 'Joining Room...' : 'Confirm & Join'}
                  </div>
            </button>
          )}

              {joinSuccess && (
                <div className={`mt-6 p-6 rounded-2xl border-2 border-dashed transition-all duration-500 ${
                  darkMode ? 'bg-emerald-900/20 border-emerald-400/50' : 'bg-emerald-50 border-emerald-400'
                }`}>
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-2">
                      <FaCheck className="text-green-500 text-2xl" />
                      <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Successfully Joined!
                      </span>
                    </div>
                    
                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-black/20' : 'bg-white/50'}`}>
                      <div className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Room: <span className={`px-2 py-1 rounded ${darkMode ? 'bg-orange-600 text-white' : 'bg-orange-500 text-white'}`}>{joinCode}</span>
                      </div>
                      <div className={`text-sm space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <div>📧 Host: {hostEmail}</div>
                        <div>👤 Host Name: {hostName}</div>
                      </div>
                    </div>

                    <button
                      onClick={handleEnterBattle}
                      className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                        darkMode
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                          : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <BiGame className="text-xl" />
                        Enter Battle!
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {joinError && (
                <div className={`p-4 rounded-xl border-l-4 ${
                  darkMode ? 'bg-red-900/20 border-red-400 text-red-300' : 'bg-red-50 border-red-400 text-red-700'
                }`}>
                  ❌ {joinError}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="text-center mt-8 md:mt-16 lg:mt-20">
          <div className={`inline-flex items-center gap-1 md:gap-2 px-3 md:px-6 py-2 md:py-3 rounded-full ${
            darkMode ? 'bg-white/10 text-gray-400' : 'bg-white/30 text-gray-600'
          }`}>
            <span>Made with</span>
            <span className="text-red-500 animate-pulse">❤️</span>
            <span>for typing enthusiasts</span>
          </div>
        </footer>
      </div>
      {showCreateModal && <RoomCreationModal />}
    </main>
  );
};

export default Hostpage;