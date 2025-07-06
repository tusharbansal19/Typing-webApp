import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Trophy, TrendingUp, Clock, User } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useAuth } from '../Context/AuthContext';
import { useSocket } from '../Context/Socket';
import axiosInstance from '../api/axiosInstance';

const RealTimeLeaderboard = ({ darkMode, isTypingActive, currentUserWpm = 0, currentUserAccuracy = 100 }) => {
  const participants = useSelector(state => state.matchRealtime.participants);
  const roomName = useSelector(state => state.matchRealtime.roomName);
  const { userEmail } = useAuth();
  const { socket } = useSocket();
  const [participantStats, setParticipantStats] = useState({});
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [fallbackMode, setFallbackMode] = useState(false);

  // Initialize participant stats when participants change (with cleanup)
  useEffect(() => {
    const initialStats = {};
    participants.forEach(participant => {
      initialStats[participant.email] = {
        wpm: 0,
        accuracy: 100,
        progress: 0,
        lastUpdate: Date.now()
      };
    });
    setParticipantStats(initialStats);
    
    // Cleanup function to reset stats when component unmounts or participants change
    return () => {
      setParticipantStats({});
      setLastUpdate(Date.now());
      setFallbackMode(false);
    };
  }, [participants]);

  // Update current user's stats with throttling
  useEffect(() => {
    if (userEmail && isTypingActive) {
      const timeoutId = setTimeout(() => {
        setParticipantStats(prev => {
          const currentStats = prev[userEmail];
          // Only update if WPM or accuracy has changed significantly
          if (!currentStats || 
              Math.abs((currentStats.wpm || 0) - currentUserWpm) >= 1 ||
              Math.abs((currentStats.accuracy || 100) - currentUserAccuracy) >= 1) {
            return {
              ...prev,
              [userEmail]: {
                ...prev[userEmail],
                wpm: currentUserWpm,
                accuracy: currentUserAccuracy,
                lastUpdate: Date.now()
              }
            };
          }
          return prev;
        });
        setLastUpdate(Date.now());
      }, 1000); // Throttle updates to 1 second

      return () => clearTimeout(timeoutId);
    }
  }, [currentUserWpm, currentUserAccuracy, userEmail, isTypingActive]);

  // Monitor connection status (separate effect to avoid re-registration)
  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      setConnectionStatus('connected');
      setFallbackMode(false);
    };

    const handleDisconnect = () => {
      setConnectionStatus('disconnected');
      setFallbackMode(true);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, [socket]);

  // Listen for real-time updates from other participants
  useEffect(() => {
    if (!socket || !isTypingActive || !roomName) return;

    const handleParticipantUpdate = (data) => {
      const { email, wpm, accuracy, timestamp } = data;
      if (email !== userEmail) { // Don't update current user's stats from socket
        setParticipantStats(prev => ({
          ...prev,
          [email]: {
            ...prev[email],
            wpm: wpm || 0,
            accuracy: accuracy || 100,
            lastUpdate: timestamp || Date.now()
          }
        }));
        setLastUpdate(Date.now());
      }
    };

    const handleAllParticipantStats = (data) => {
      const { participantStats: allStats } = data;
      const newStats = { ...participantStats };
      
      allStats.forEach(stat => {
        if (stat.email !== userEmail) {
          newStats[stat.email] = {
            wpm: stat.wpm || 0,
            accuracy: stat.accuracy || 100,
            progress: 0,
            lastUpdate: stat.timestamp || Date.now()
          };
        }
      });
      
      setParticipantStats(newStats);
      setLastUpdate(Date.now());
    };

    // Request initial stats only once when typing becomes active
    socket.emit('requestParticipantStats', roomName);

    socket.on('participantUpdate', handleParticipantUpdate);
    socket.on('allParticipantStats', handleAllParticipantStats);

    return () => {
      socket.off('participantUpdate', handleParticipantUpdate);
      socket.off('allParticipantStats', handleAllParticipantStats);
    };
  }, [socket, isTypingActive, roomName, userEmail]); // Removed participantStats from dependencies

  // Separate effect for periodic stats refresh with optimized intervals
  useEffect(() => {
    if (!isTypingActive || !roomName) return;

    let statsInterval;
    let retryCount = 0;
    const maxRetries = 3;

    const fetchStats = async () => {
      try {
        if (connectionStatus === 'connected' && socket) {
          socket.emit('requestParticipantStats', roomName);
          retryCount = 0; // Reset retry count on success
        } else {
          // Use REST API as fallback
          setFallbackMode(true);
          const response = await axiosInstance.get(`/match/stats/${roomName}`);
          if (response.data.success) {
            const { participantStats: allStats } = response.data;
            const newStats = { ...participantStats };
            
            allStats.forEach(stat => {
              if (stat.email !== userEmail) {
                newStats[stat.email] = {
                  wpm: stat.wpm || 0,
                  accuracy: stat.accuracy || 100,
                  progress: 0,
                  lastUpdate: stat.timestamp || Date.now()
                };
              }
            });
            
            setParticipantStats(newStats);
            setLastUpdate(Date.now());
            retryCount = 0; // Reset retry count on success
          }
        }
      } catch (error) {
        retryCount++;
        console.error(`Stats fetch failed (attempt ${retryCount}):`, error);
        
        if (retryCount >= maxRetries) {
          console.log('Max retries reached, stopping stats fetch');
          return;
        }
      }
    };

    // Adaptive interval: faster when active, slower when idle
    const interval = isTypingActive ? 8000 : 15000; // 8s when active, 15s when idle
    
    statsInterval = setInterval(fetchStats, interval);

    return () => {
      if (statsInterval) {
        clearInterval(statsInterval);
      }
    };
  }, [isTypingActive, roomName, connectionStatus, socket, userEmail]); // Removed participantStats from dependencies

  // Memoized sorted participants to prevent unnecessary re-renders
  const sortedParticipants = useMemo(() => {
    return participants
      .map(participant => ({
        ...participant,
        stats: participantStats[participant.email] || { wpm: 0, accuracy: 100, progress: 0 }
      }))
      .sort((a, b) => (b.stats.wpm || 0) - (a.stats.wpm || 0));
  }, [participants, participantStats]);

  const getPositionColor = useCallback((position) => {
    switch (position) {
      case 1: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 2: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 3: return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  }, []);

  const getPositionIcon = useCallback((position) => {
    switch (position) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `${position}`;
    }
  }, []);

  return (
    <div className={`w-full rounded-xl shadow-lg overflow-hidden ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-700' 
        : 'bg-gradient-to-br from-white/90 to-blue-50/90 border border-blue-200'
    }`}>
      {/* Header */}
      <div className={`p-4 border-b ${
        darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-blue-50/50'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Trophy className={`w-5 h-5 ${
              darkMode ? 'text-yellow-400' : 'text-yellow-600'
            }`} />
            <h3 className={`font-bold text-lg ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Live Leaderboard
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              isTypingActive 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-gray-500/20 text-gray-400'
            }`}>
              {isTypingActive ? 'Active' : 'Waiting'}
            </div>
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected' 
                ? 'bg-green-500' 
                : 'bg-red-500 animate-pulse'
            }`} title={connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}></div>
          </div>
        </div>
      </div>

      {/* Participants List */}
      <div className="max-h-96 overflow-y-auto">
        {sortedParticipants.length > 0 ? (
          <div className="p-4 space-y-3">
            {sortedParticipants.map((participant, index) => {
              const position = index + 1;
              const isCurrentUser = participant.email === userEmail;
              const stats = participant.stats;
              
              return (
                <div
                  key={participant.email}
                  className={`relative p-4 rounded-lg border transition-all duration-300 hover:scale-105 ${
                    isCurrentUser 
                      ? 'ring-2 ring-blue-500/50 shadow-lg' 
                      : 'shadow-md'
                  } ${
                    darkMode 
                      ? 'bg-gray-700/50 border-gray-600' 
                      : 'bg-white/80 border-gray-200'
                  }`}
                >
                  {/* Position Badge */}
                  <div className={`absolute -top-2 -left-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                    getPositionColor(position)
                  }`}>
                    {getPositionIcon(position)}
                  </div>

                  {/* Current User Indicator */}
                  {isCurrentUser && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      {/* Username */}
                      <div className="flex items-center space-x-2 mb-1">
                        <User className={`w-4 h-4 ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <span className={`font-semibold truncate ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {participant.username || participant.email}
                        </span>
                        {isCurrentUser && (
                          <span className="text-xs px-2 py-1 bg-blue-500 text-white rounded-full">
                            You
                          </span>
                        )}
                      </div>

                      {/* Stats Row */}
                      <div className="flex items-center space-x-4 text-sm">
                        {/* WPM */}
                        <div className="flex items-center space-x-1">
                          <TrendingUp className={`w-4 h-4 ${
                            darkMode ? 'text-green-400' : 'text-green-600'
                          }`} />
                          <span className={`font-bold ${
                            darkMode ? 'text-green-400' : 'text-green-600'
                          }`}>
                            {stats.wpm || 0} WPM
                          </span>
                        </div>

                        {/* Accuracy */}
                        <div className="flex items-center space-x-1">
                          <Clock className={`w-4 h-4 ${
                            darkMode ? 'text-purple-400' : 'text-purple-600'
                          }`} />
                          <span className={`font-medium ${
                            darkMode ? 'text-purple-400' : 'text-purple-600'
                          }`}>
                            {stats.accuracy || 100}%
                          </span>
                        </div>

                        {/* Stale Data Indicator */}
                        {isTypingActive && (Date.now() - stats.lastUpdate) > 10000 && (
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                            <span className={`text-xs ${
                              darkMode ? 'text-yellow-400' : 'text-yellow-600'
                            }`}>
                              Stale
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Progress Bar */}
                      {isTypingActive && (
                        <div className="mt-2">
                          <div className={`w-full bg-gray-200 rounded-full h-2 ${
                            darkMode ? 'bg-gray-600' : 'bg-gray-200'
                          }`}>
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${
                                position === 1 
                                  ? 'bg-yellow-500' 
                                  : position === 2 
                                    ? 'bg-gray-400' 
                                    : position === 3 
                                      ? 'bg-orange-500' 
                                      : 'bg-blue-500'
                              }`}
                              style={{ 
                                width: `${Math.min((stats.wpm || 0) / 100 * 100, 100)}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Status Indicator */}
                    <div className={`ml-4 px-3 py-1 rounded-full text-xs font-medium ${
                      participant.ready 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {participant.ready ? 'Ready' : 'Not Ready'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={`p-8 text-center ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No participants yet</p>
            <p className="text-sm mt-2">Waiting for players to join...</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={`p-3 border-t text-center text-xs ${
        darkMode 
          ? 'border-gray-700 bg-gray-800/50 text-gray-400' 
          : 'border-gray-200 bg-blue-50/50 text-gray-500'
      }`}>
        {isTypingActive ? (
          <div className="flex items-center justify-center space-x-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              fallbackMode ? 'bg-yellow-500' : 'bg-green-500'
            }`}></div>
            <span>
              {fallbackMode ? 'Fallback mode' : 'Live updates'} • 
              Last: {new Date(lastUpdate).toLocaleTimeString()} •
              {isTypingActive ? '8s interval' : '15s interval'}
            </span>
          </div>
        ) : (
          'Updates when typing starts'
        )}
      </div>
    </div>
  );
};

export default RealTimeLeaderboard; 