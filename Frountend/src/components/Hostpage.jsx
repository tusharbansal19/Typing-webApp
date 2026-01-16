import React, { useState } from 'react';
import { FaPlus, FaSignInAlt, FaCopy, FaCheck } from "react-icons/fa";
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
        setCreatedRoom(null);
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
    const roomId = createdRoom || joinedRoom;
    if (!roomId) {
      console.error('No room ID available for navigation');
      return;
    }

    try {
      setLoading(true);
      await axios.post('/match/add-participant', {
        roomId,
        name: user?.name,
        email: user?.email,
      });

    } catch (err) {
      console.log("err of handleEnterBattle", err);
      // If it's a 403 (already exists) or 200 (success), proceed anyway
      if (err.response?.status === 403 && err.response?.data?.message?.includes('already exists')) {
        console.log('User already exists in room, proceeding...');
      } else if (err.response?.status === 403 && err.response?.data?.message?.includes('not allowed')) {
        console.log('New players not allowed, proceeding...');
      } else {
        console.error('Error adding participant:', err);
      }
    } finally {
      setLoading(false);
      navigate(`/match/${roomId}`);
    }
  };

  // Room creation modal component
  const RoomCreationModal = () => {
    if (!showCreateModal) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={() => setShowCreateModal(false)}
        />

        <div className={`relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl ${darkMode
          ? 'bg-gray-900 border border-gray-800'
          : 'bg-white border border-gray-200'
          }`}>
          {/* Header */}
          <div className={`px-6 py-4 border-b flex items-center justify-between ${darkMode ? 'border-gray-800' : 'border-gray-200'
            }`}>
            <div>
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Match Configuration
              </h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Setup your room settings
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(false)}
              className={`p-2 rounded-lg transition-colors ${darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'
                }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Player Limit */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Max Players
              </label>
              <div className="grid grid-cols-6 gap-2">
                {[2, 4, 6, 8, 10, 12].map((limit) => (
                  <button
                    key={limit}
                    onClick={() => setRoomConfig(prev => ({ ...prev, playerLimit: limit }))}
                    className={`p-2.5 rounded-lg text-sm font-medium transition-all ${roomConfig.playerLimit === limit
                      ? 'bg-indigo-600 text-white shadow-md'
                      : darkMode
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                      }`}
                  >
                    {limit}
                  </button>
                ))}
              </div>
            </div>

            {/* Timer */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Duration
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[30, 60, 120, 180].map((time) => (
                  <button
                    key={time}
                    onClick={() => setRoomConfig(prev => ({ ...prev, timer: time }))}
                    className={`p-3 rounded-lg border transition-all ${roomConfig.timer === time
                      ? 'border-indigo-600 bg-indigo-600 text-white shadow-md'
                      : darkMode
                        ? 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600 hover:bg-gray-700'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-gray-100'
                      }`}
                  >
                    <div className="font-medium">{time}</div>
                    <div className={`text-xs mt-0.5 ${roomConfig.timer === time
                      ? 'text-indigo-100'
                      : darkMode ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                      Seconds
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Difficulty
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['easy', 'normal', 'hard'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setRoomConfig(prev => ({ ...prev, difficulty: level }))}
                    className={`p-3 rounded-lg border transition-all ${roomConfig.difficulty === level
                      ? 'border-indigo-600 bg-indigo-600 text-white shadow-md'
                      : darkMode
                        ? 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600 hover:bg-gray-700'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-gray-100'
                      }`}
                  >
                    <div className="font-medium">{level.charAt(0).toUpperCase() + level.slice(1)}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className={`flex flex-col gap-4 p-4 rounded-lg ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-50 border border-gray-200'
              }`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    Private Room
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Requires invite code to join
                  </div>
                </div>
                <button
                  onClick={() => setRoomConfig(prev => ({ ...prev, isPrivate: !prev.isPrivate }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${roomConfig.isPrivate ? 'bg-indigo-600' : darkMode ? 'bg-gray-600' : 'bg-gray-300'
                    }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${roomConfig.isPrivate ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    Spectators
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Allow others to watch
                  </div>
                </div>
                <button
                  onClick={() => setRoomConfig(prev => ({ ...prev, allowSpectators: !prev.allowSpectators }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${roomConfig.allowSpectators ? 'bg-indigo-600' : darkMode ? 'bg-gray-600' : 'bg-gray-300'
                    }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${roomConfig.allowSpectators ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={`p-6 border-t flex gap-3 ${darkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50'
            }`}>
            <button
              onClick={() => setShowCreateModal(false)}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${darkMode
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
            >
              Cancel
            </button>
            <button
              onClick={handleCreateGroup}
              disabled={loading}
              className="flex-1 py-2.5 px-4 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <span>Create Room</span>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className={`min-h-screen py-12 transition-all duration-500 relative overflow-hidden ${darkMode
        ? 'bg-gradient-to-br from-blue-950 via-black-900 to-gray-900'
        : 'bg-gradient-to-br from-blue-100 via-white to-blue-200'
      }`}>
      {/* Animated background elements - matching Home page */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-10 left-10 w-80 h-80 rounded-full blur-3xl animate-pulse ${darkMode ? 'bg-purple-500/20' : 'bg-purple-200/20'
          }`} />
        <div className={`absolute bottom-10 right-10 w-72 h-72 rounded-full blur-3xl animate-pulse ${darkMode ? 'bg-blue-400/20' : 'bg-blue-200/20'
          }`} style={{ animationDelay: '1s' }} />
        <div className={`absolute top-1/2 left-1/4 w-56 h-56 rounded-full blur-3xl animate-pulse ${darkMode ? 'bg-cyan-500/20' : 'bg-cyan-200/15'
          }`} style={{ animationDelay: '2s' }} />
      </div>

      {/* Circuit Background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 1000 1000" className="absolute inset-0">
          <defs>
            <pattern id="circuit-host" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M10,10 L90,10 L90,90 L10,90 Z" fill="none" stroke={darkMode ? '#7dd3fc' : '#60a5fa'} strokeWidth="0.5" opacity="0.3" />
              <circle cx="10" cy="10" r="2" fill={darkMode ? '#a78bfa' : '#818cf8'} opacity="0.5" />
              <circle cx="90" cy="10" r="2" fill={darkMode ? '#a78bfa' : '#818cf8'} opacity="0.5" />
              <circle cx="90" cy="90" r="2" fill={darkMode ? '#a78bfa' : '#818cf8'} opacity="0.5" />
              <circle cx="10" cy="90" r="2" fill={darkMode ? '#a78bfa' : '#818cf8'} opacity="0.5" />
              <path d="M30,30 L70,30 L70,70 L30,70 Z" fill="none" stroke={darkMode ? '#818cf8' : '#a5b4fc'} strokeWidth="0.3" opacity="0.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit-host)" />
        </svg>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className={`text-3xl md:text-4xl font-bold mb-4 tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'
            }`}>
            Multiplayer Arena
          </h1>
          <p className={`text-lg max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
            Create a private lobby to challenge friends or join an existing match using your invite code.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* Host Card */}
          <section className={`p-8 rounded-2xl border transition-all duration-300 ${darkMode
            ? 'bg-gray-900 border-gray-800 hover:border-gray-700'
            : 'bg-white border-gray-200 shadow-sm hover:shadow-md'
            }`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors ${darkMode ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
              }`}>
              <FaPlus size={20} />
            </div>

            <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Host a Match
            </h2>
            <p className={`mb-8 text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Configure game rules, duration, and difficulty. Then invite players to your private lobby.
            </p>

            <button
              onClick={() => setShowCreateModal(true)}
              disabled={loading || createdRoom}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${darkMode
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white disabled:bg-gray-800 disabled:text-gray-500'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-gray-100 disabled:text-gray-400'
                }`}
            >
              {loading ? 'Processing...' : 'Create New Room'}
            </button>

            {/* Created Room Details */}
            {createdRoom && (
              <div className={`mt-6 p-5 rounded-xl border ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
                }`}>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Room Ready
                  </span>
                  <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <code className={`flex-1 p-3 rounded-lg font-mono text-center font-bold tracking-wider ${darkMode ? 'bg-black/30 text-indigo-400' : 'bg-white text-indigo-600 border border-gray-200'
                    }`}>
                    {createdRoom}
                  </code>
                  <button
                    onClick={() => handleCopyCode(createdRoom)}
                    className={`p-3 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'
                      }`}
                  >
                    {copied ? <FaCheck size={18} className="text-green-500" /> : <FaCopy size={18} />}
                  </button>
                </div>

                <div className={`space-y-3 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex justify-between items-center text-xs">
                    <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>Host</span>
                    <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{hostName}</span>
                  </div>

                  <button
                    onClick={handleEnterBattle}
                    className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${darkMode
                      ? 'bg-green-600 hover:bg-green-500 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                  >
                    Start Game
                  </button>
                </div>
              </div>
            )}

            {createError && (
              <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                {createError}
              </div>
            )}
          </section>

          {/* Join Card */}
          <section className={`p-8 rounded-2xl border transition-all duration-300 ${darkMode
            ? 'bg-gray-900 border-gray-800 hover:border-gray-700'
            : 'bg-white border-gray-200 shadow-sm hover:shadow-md'
            }`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors ${darkMode ? 'bg-pink-500/10 text-pink-400' : 'bg-pink-50 text-pink-600'
              }`}>
              <FaSignInAlt size={20} />
            </div>

            <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Join Match
            </h2>
            <p className={`mb-8 text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Enter a valid room code to jump into an existing game lobby.
            </p>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter Room Code"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  disabled={loading || joinSuccess}
                  className={`w-full p-3 pl-4 rounded-lg outline-none border transition-all ${darkMode
                    ? 'bg-gray-800 border-gray-700 text-white focus:border-pink-500'
                    : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-pink-500 focus:bg-white'
                    }`}
                />
              </div>

              {!joinSuccess ? (
                <button
                  onClick={handleJoinGroup}
                  disabled={loading || !joinCode}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${darkMode
                    ? 'bg-pink-600 hover:bg-pink-500 text-white disabled:bg-gray-800 disabled:text-gray-500'
                    : 'bg-pink-600 hover:bg-pink-700 text-white disabled:bg-gray-100 disabled:text-gray-400'
                    }`}
                >
                  {loading ? 'Joining...' : 'Join Room'}
                </button>
              ) : (
                <div className={`p-5 rounded-xl border ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
                  }`}>
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-2">
                      <FaCheck size={14} />
                    </div>
                    <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Joined Successfully</h3>
                  </div>

                  <div className={`py-3 px-4 rounded-lg mb-4 text-sm flex justify-between ${darkMode ? 'bg-black/20 text-gray-300' : 'bg-white border border-gray-100 text-gray-600'}`}>
                    <span>Host:</span>
                    <span className="font-medium">{hostName}</span>
                  </div>

                  <button
                    onClick={handleEnterBattle}
                    className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${darkMode
                      ? 'bg-green-600 hover:bg-green-500 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                  >
                    Enter Battle
                  </button>
                </div>
              )}

              {joinError && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                  {joinError}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Minimal Footer */}
        <footer className={`mt-16 text-center text-sm ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
          <p>© FastFinger Battle Arena</p>
        </footer>

      </div>
      {showCreateModal && <RoomCreationModal />}
    </main>
  );
};

export default Hostpage;