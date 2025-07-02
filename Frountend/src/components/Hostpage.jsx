import React, { useState } from 'react';
import { FaGithub, FaTwitter, FaInstagram, FaYoutube, FaDiscord } from "react-icons/fa";
import "../App.css"
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
  const [joinError, setJoinError] = useState('');
  const [createError, setCreateError] = useState('');
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      setHostName(response.data.hostName || user?.name || 'You');
      setHostEmail(response.data.hostEmail || user?.email || '');
      setIsCreating(false);
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
      setHostName(response.data.hostName || 'Host');
      setHostEmail(response.data.hostEmail || '');
      setJoinSuccess(true);
      setIsJoining(false);
    } catch (err) {
      setJoinError(err.response?.data?.message || 'Failed to join room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gradient-to-br from-black via-blue-900 to-gray-900' : 'bg-gradient-to-br from-blue-300 to-white'} min-h-screen p-6 md:p-10 flex items-center justify-center`}>
      <div className="max-w-7xl w-full grid md:grid-cols-2 gap-10 items-start text-white">
        {/* Header Section */}
        <div className="text-center space-y-4 md:space-y-6 md:col-span-2">
          <h1 className={`${darkMode ? 'text-blue-400' : 'text-blue-700'} text-4xl md:text-5xl font-bold`}>Group Typing Contest</h1>
          <p className={`${darkMode ? 'text-gray-300' : 'text-yellow-800'} text-lg md:text-xl`}>
            Create or join a group to compete in a real-time typing contest!
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <a href="https://github.com" className={`${darkMode ? 'text-white' : 'text-black'} hover:text-gray-400 transition-colors`}>
              <FaGithub size={24} />
            </a>
            <a href="https://twitter.com" className={`${darkMode ? 'text-white' : 'text-black'} hover:text-blue-400 transition-colors`}>
              <FaTwitter size={24} />
            </a>
            <a href="https://instagram.com" className={`${darkMode ? 'text-white' : 'text-black'} hover:text-pink-500 transition-colors`}>
              <FaInstagram size={24} />
            </a>
            <a href="https://youtube.com" className={`${darkMode ? 'text-white' : 'text-black'} hover:text-red-500 transition-colors`}>
              <FaYoutube size={24} />
            </a>
            <a href="https://discord.com" className={`${darkMode ? 'text-white' : 'text-black'} hover:text-indigo-500 transition-colors`}>
              <FaDiscord size={24} />
            </a>
          </div>
        </div>

        {/* Group Creation Section */}
        <div className="glass-effect2 p-6 rounded-lg shadow-lg flex flex-col items-center space-y-4 md:space-y-6">
          <h2 className={`${darkMode ? 'text-blue-400' : 'text-blue-700'} text-3xl font-semibold`}>Start a New Group</h2>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
            disabled={loading}
          >
            {isCreating ? 'Cancel' : 'Create Group'}
          </button>
          {isCreating && (
            <button
              onClick={handleCreateGroup}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition-colors"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Confirm Creation'}
            </button>
          )}
          {createdRoom && (
            <div className="mt-4 text-center">
              <div className="text-lg font-bold">Room Code: <span className="text-blue-300">{createdRoom}</span></div>
              <div className="text-md">Host: <span className="text-green-300">{hostName}</span></div>
              <div className="text-md">Host Email: <span className="text-green-200">{hostEmail}</span></div>
              <button
                className="mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-colors"
                onClick={() => navigate('/match')}
              >
                Go to Match
              </button>
            </div>
          )}
          {createError && <div className="text-red-400 mt-2">{createError}</div>}
        </div>

        {/* Group Joining Section */}
        <div className="glass-effect2 p-6 rounded-lg shadow-lg flex flex-col items-center space-y-4 md:space-y-6">
          <h2 className={`${darkMode ? 'text-blue-400' : 'text-blue-700'} text-3xl font-semibold`}>Join an Existing Group</h2>
          <input
            type="text"
            placeholder="Enter room code to join"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            className="w-full p-3 rounded-md text-black"
            disabled={loading}
          />
          <button
            onClick={() => setIsJoining(!isJoining)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
            disabled={loading}
          >
            {isJoining ? 'Cancel' : 'Join Group'}
          </button>
          {isJoining && (
            <button
              onClick={handleJoinGroup}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition-colors"
              disabled={loading || !joinCode}
            >
              {loading ? 'Joining...' : 'Confirm Join'}
            </button>
          )}
          {joinSuccess && (
            <div className="mt-4 text-center">
              <div className="text-lg font-bold">Joined Room: <span className="text-blue-300">{joinCode}</span></div>
              <div className="text-md">Host: <span className="text-green-300">{hostName}</span></div>
              <div className="text-md">Host Email: <span className="text-green-200">{hostEmail}</span></div>
              <button
                className="mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-colors"
                onClick={() => navigate('/match')}
              >
                Go to Match
              </button>
            </div>
          )}
          {joinError && <div className="text-red-400 mt-2">{joinError}</div>}
        </div>
      </div>
    </div>
  );
};

export default Hostpage;
