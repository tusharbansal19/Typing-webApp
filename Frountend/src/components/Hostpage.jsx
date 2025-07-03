import React, { useState } from 'react';
import { FaGithub, FaTwitter, FaInstagram, FaYoutube, FaDiscord, FaUsers, FaPlus, FaSignInAlt, FaCopy, FaCheck, FaGamepad, FaRocket, FaStar, FaFire, FaTrophy, FaKeyboard } from "react-icons/fa";
import { HiSparkles, HiLightningBolt } from "react-icons/hi";
import { BiGame } from "react-icons/bi";
import { MdGroups, MdSpeed } from "react-icons/md";
import axios from '../api/axiosInstance';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../Context/Socket';

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
  const navigate = useNavigate();
  const { socket } = useSocket();

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
      });
      setCreatedRoom(response.data.roomId);
      setHostName(response.data.hostName);
      setHostEmail(response.data.hostEmail);
      setIsCreating(false);
      // Reset joined group state
      setJoinedRoom(null);
      setJoinCode('');
      setRoomCode('');
      setJoinSuccess(false);
      // Emit joinRoom after successful creation
      if (socket && response.data.roomId) {
        console.log('Emitting joinRoom with roomId (create):', response.data.roomId);
        socket.emit('joinRoom', {
          roomName: response.data.roomId,
          socketId: socket.id,
          email: user?.email,
        });
      }
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
      setRoomCode(joinCode);
      setHostName(response.data.hostName);
      setHostEmail(response.data.hostEmail);
      setJoinedRoom(joinCode);
      setJoinSuccess(true);
      setIsJoining(false);
      // Reset created group state
      setCreatedRoom(null);
      // Emit joinRoom after successful join
      if (socket && joinCode) {
        console.log('Emitting joinRoom with roomId (join):', joinCode);
        socket.emit('joinRoom', {
          roomName: joinCode,
          socketId: socket.id,
          email: user?.email,
        });
      }
    } catch (err) {
      setJoinError(err.response?.data?.message || 'Failed to join room');
    } finally {
      setLoading(false);
    }
  };
  
  // Add participant to match if not host, then navigate
  const handleEnterBattle = async () => {
    const isHost = user?.email && user?.email === hostEmail;
    // Always use the most recent roomId
    const roomId = createdRoom || joinedRoom;
    if (!roomId) return;
    if (!isHost) {
      try {
        setLoading(true);
        await axios.post('/match/add-participant', {
          roomId,
          name: user?.name,
          email: user?.email,
        });
        // Emit joinRoom after add-participant
        if (socket && roomId) {
          console.log('Emitting joinRoom with roomId (add-participant):', roomId);
          socket.emit('joinRoom', {
            roomName: roomId,
            socketId: socket.id,
            email: user?.email,
          });
        }
      } catch (err) {
        // Optionally handle error, but proceed if already exists
      } finally {
        setLoading(false);
      }
    }
    navigate(`/match/${roomId}`);
  };

  return (
    <main className={`min-h-screen transition-all duration-500 ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-50'
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
          
          <h1 className={`text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-extrabold mb-2 md:mb-4 lg:mb-6 ${
            darkMode 
              ? 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent' 
              : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent'
          }`}>
            ⚡ Speed Type Battle ⚡
          </h1>
          
          <p className={`text-sm sm:text-base md:text-lg lg:text-2xl mb-4 md:mb-8 max-w-3xl mx-auto leading-relaxed ${
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
            onClick={() => setIsCreating(!isCreating)}
                disabled={loading}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
                  isCreating
                    ? darkMode
                      ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white'
                      : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white'
                    : darkMode
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  {isCreating ? <FaCheck /> : <FaRocket />}
                  {isCreating ? 'Cancel Creation' : 'Create Battle Room'}
                </div>
          </button>

          {isCreating && (
            <button
                  onClick={handleCreateGroup}
                  disabled={loading}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 ${
                    darkMode
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <HiLightningBolt />}
                    {loading ? 'Creating Room...' : 'Confirm & Create'}
                  </div>
            </button>
          )}

              {createdRoom && (
                <div className={`mt-6 p-6 rounded-2xl border-2 border-dashed transition-all duration-500 ${
                  darkMode ? 'bg-emerald-900/20 border-emerald-400/50' : 'bg-emerald-50 border-emerald-400'
                }`}>
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-2">
                      <FaTrophy className="text-yellow-500 text-2xl" />
                      <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Room Created!
                      </span>
                    </div>
                    
                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-black/20' : 'bg-white/50'}`}>
                      <div className="flex items-center justify-center gap-3 mb-2">
                        <span className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Room Code:</span>
                        <code className={`text-2xl font-mono font-bold px-3 py-1 rounded-lg ${
                          darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                        }`}>
                          {createdRoom}
                        </code>
                        <button
                          onClick={() => handleCopyCode(createdRoom)}
                          className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                            darkMode ? 'hover:bg-white/10' : 'hover:bg-black/10'
                          }`}
                        >
                          {copied ? <FaCheck className="text-green-500" /> : <FaCopy className={darkMode ? 'text-gray-400' : 'text-gray-600'} />}
                        </button>
        </div>

                      <div className={`text-sm space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <div>📧 Host: {hostEmail}</div>
                        <div>👤 Name: {hostName}</div>
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
                        Start Battle!
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {createError && (
                <div className={`p-4 rounded-xl border-l-4 ${
                  darkMode ? 'bg-red-900/20 border-red-400 text-red-300' : 'bg-red-50 border-red-400 text-red-700'
                }`}>
                  ❌ {createError}
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
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
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
    </main>
  );
};

export default Hostpage;