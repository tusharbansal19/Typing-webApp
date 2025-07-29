import React, { useState, useEffect, useCallback } from 'react';
import { MdOutlineRestartAlt } from "react-icons/md";
import { X, Users, Lock, Unlock } from "lucide-react";

import { useSocket } from '../Context/Socket';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../Context/AuthContext';

const ShowMember = ({ darkMode }) => {

    const { socket } = useSocket();
    const navigator = useNavigate();
    const roomName = useSelector(state => state.matchRealtime.roomName);
    const participants = useSelector(state => state.matchRealtime.participants);
    const [readyPlayers, setReadyPlayers] = useState([]);
    const [joinMessage, setJoinMessage] = useState("");
    const [restartButton, setrestartButton] = useState(false);
    const { userEmail } = useAuth();
    
    // Admin state
    const [isAdmin, setIsAdmin] = useState(false);
    const [allowNewPlayers, setAllowNewPlayers] = useState(true);
    const [isRoomClosed, setIsRoomClosed] = useState(false);
    const [isRemovingPlayer, setIsRemovingPlayer] = useState(false);
    const [isTogglingAccess, setIsTogglingAccess] = useState(false);
    const [isTogglingRoomClosure, setIsTogglingRoomClosure] = useState(false);
    const [showAdminControls, setShowAdminControls] = useState(false);
    
    // Find the current user in the group
    const me = participants.find(m => m.email === userEmail);
    const isReady = !!(me && me.ready);

    // Check if current user is admin
    useEffect(() => {
        if (!socket || !roomName || !userEmail) return;

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
                const response = await fetch(`/api/match/info/${roomName}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setAllowNewPlayers(data.allowNewPlayers);
                }
            } catch (error) {
                console.error('Error checking room state:', error);
            }
        };

        checkRoomState();
    }, [socket, roomName, userEmail, participants]);

    // Admin functions
    const handleRemovePlayer = (participantEmail) => {
        if (participantEmail === userEmail) return; // Can't remove yourself
        
        setIsRemovingPlayer(true);
        try {
            socket.emit('adminRemovePlayer', {
                roomName: roomName,
                participantEmail: participantEmail,
                adminEmail: userEmail
            });
        } catch (error) {
            console.error('Error removing player:', error);
        } finally {
            setIsRemovingPlayer(false);
        }
    };

    const handleToggleNewPlayers = () => {
        setIsTogglingAccess(true);
        try {
            socket.emit('adminToggleNewPlayers', {
                roomName: roomName,
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
                roomName: roomName,
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
            // Redux will handle participant updates
        };

        const handleNewPlayersToggled = ({ message, allowNewPlayers }) => {
            setAllowNewPlayers(allowNewPlayers);
        };

        const handleRoomClosureToggled = ({ message, isClosed }) => {
            setIsRoomClosed(isClosed);
        };

        const handleAdminError = ({ message }) => {
            console.error('Admin action error:', message);
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

    useEffect(() => {
      if (!socket) return;
      // Listen for all participants event
      const handleAllParticipants = ({ participants, roomName: eventRoomName }) => {
        // Redux will update participants, so no need to set local state
      };
      socket.on('all participants', handleAllParticipants);


      // Listen for userJoined event
      const handleUserJoined = ({ user, participants, roomName: eventRoomName }) => {
          if (eventRoomName === roomName) {
              setJoinMessage(`${user.username || user.email} joined!`);
              setTimeout(() => setJoinMessage(""), 3000);
            }
        };
        socket.on('userJoined', handleUserJoined);
        socket.on("meJoined",handleUserJoined)
      // Listen for userLeft event
      const handleUserLeft = ({ user, participants, roomName: eventRoomName }) => {
        if (eventRoomName === roomName) {
          setJoinMessage(`${user.username || user.email} left!`);
          setTimeout(() => setJoinMessage(""), 3000);
        }
      };
      socket.on('userLeft', handleUserLeft);
      // Other events
      socket.on('addNewMember', ({ members, readyPlayersList }) => {
        setReadyPlayers(readyPlayersList);
      });
      socket.on('showRanks', (rankplayer) => {
        setrestartButton("restart");
        socket.emit('playerReady', { roomName, isReady: false });
      });
      socket.on('showReadyPlayers', (readyPlayersList) => {
        setReadyPlayers(readyPlayersList);
      });
      return () => {
        socket.off('all participants', handleAllParticipants);
        socket.off('userJoined', handleUserJoined);
        socket.off('userLeft', handleUserLeft);
        socket.off('addNewMember');
        socket.off('showReadyPlayers');
      };
    }, [socket, roomName]);
  
    const iReady = useCallback(() => {
      if (!userEmail) return;
      socket.emit('changeStatus', { roomName, email: userEmail });
    }, [socket, roomName, userEmail]);
 
    useEffect(() => {
        if (!socket) return;
        // Listen for statusUpdated event
        const handleStatusUpdated = ({ participants, roomName: eventRoomName }) => {
          // Redux will update participants, so no need to set local state
        };
        socket.on('statusUpdated', handleStatusUpdated);
        return () => {
            socket.off('statusUpdated', handleStatusUpdated);
        };
    }, [socket, roomName]);

    return (
        <div className={`w-full min-h-screen lg:mt-0 lg:ml-6 p-6 mt-12 rounded-lg shadow-lg ${darkMode ? 'bg-gradient-to-br text-white from-black to-blue-900' : 'bg-gradient-to-br from-blue-200 to-white'}`}>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold mt-12">Room name: {roomName}</h2>
                
                {/* Admin Controls Button */}
                {isAdmin && (
                    <div className="relative">
                        <button
                            onClick={() => setShowAdminControls(!showAdminControls)}
                            className={`p-2 rounded-lg shadow-lg border ${
                                darkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-200'
                            }`}
                        >
                            <span className="text-sm font-medium">⚙️ Admin</span>
                        </button>
                        
                        {/* Admin Controls Panel */}
                        {showAdminControls && (
                            <div className={`absolute top-12 right-0 z-50 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg border p-4 min-w-64`}>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Admin Controls</h3>
                                    <button
                                        onClick={() => setShowAdminControls(false)}
                                        className={`p-1 rounded ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
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
                                            className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-1 ${
                                                allowNewPlayers
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-red-500 text-white'
                                            }`}
                                        >
                                            {isTogglingAccess ? '...' : (
                                                <>
                                                    {allowNewPlayers ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                                                    {allowNewPlayers ? 'ON' : 'OFF'}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    
                                    {/* Toggle room closure */}
                                    <div className="flex items-center justify-between">
                                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            Room Closure
                                        </span>
                                        <button
                                            onClick={handleToggleRoomClosure}
                                            disabled={isTogglingRoomClosure}
                                            className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-1 ${
                                                isRoomClosed
                                                    ? 'bg-red-500 text-white'
                                                    : 'bg-green-500 text-white'
                                            }`}
                                        >
                                            {isTogglingRoomClosure ? '...' : (
                                                <>
                                                    {isRoomClosed ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                                                    {isRoomClosed ? 'ON' : 'OFF'}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    
                                    {/* Entry status indicator */}
                                    <div className={`text-xs p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                        <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            Entry Status: {allowNewPlayers ? 'Open' : 'Closed'}
                                        </span>
                                    </div>
                                    
                                    {/* Room closure status indicator */}
                                    <div className={`text-xs p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                        <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            Room Status: {isRoomClosed ? 'Closed' : 'Open'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            
            {joinMessage && (
                <div className="mb-4 p-2 bg-green-200 text-green-800 rounded text-center animate-pulse">{joinMessage}</div>
            )}
            
            <p className="text-lg mb-6">Total Players: {participants.length}</p>
            {
                restartButton === 'restart' ? 
                <button onClick={() => navigator("/host")} className="bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-700">Restart Game</button> 
                :
                <button onClick={iReady} className="bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-700">
                    {isReady ? 'Not Ready' : 'Ready'}
                </button>
            }
            
            {participants.length > 0 ? (
                <ul className="space-y-3 pt-4">
                    {participants.map((member) => (
                        <li key={member._id || member.email} className={`p-3 bg-gray-700 rounded-lg shadow-md flex items-center justify-between`}>
                            <div>
                                <span className={`font-medium ${member.ready ? 'text-green-400' : 'text-red-400'}`}>{member.username || member.email}</span>
                                <p className={`text-sm ${member.ready ? 'text-green-300' : 'text-red-300'}`}>Email: {member.email}</p>
                                <p className="text-xs text-gray-400">ID: {member._id}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`ml-2 px-3 py-1 rounded-full text-sm font-bold ${member.ready ? 'bg-green-500 text-white' : 'bg-red-500 text-white'} transition-colors duration-300`}>
                                    {member.ready ? 'Ready' : 'Not Ready'}
                                </span>
                                
                                {/* Remove player button (admin only) */}
                                {isAdmin && member.email !== userEmail && (
                                    <button
                                        onClick={() => handleRemovePlayer(member.email)}
                                        disabled={isRemovingPlayer}
                                        className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 flex items-center gap-1"
                                        title="Remove player"
                                    >
                                        {isRemovingPlayer ? '...' : <X className="w-3 h-3" />}
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-400">No players in the room yet.</p>
            )}
        </div>
    );
};

export default ShowMember;
