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
        socket.on("meJoined", handleUserJoined)
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
        <div className="w-full h-full">
            {joinMessage && (
                <div className="mb-4 p-2 bg-green-200 text-green-800 rounded text-center animate-pulse">{joinMessage}</div>
            )}
            {/* Header with Total Players and Ready Button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                <p className={`text-base sm:text-lg font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Total Players: {participants.length}
                </p>

                {
                    restartButton === 'restart' ?
                        <button onClick={() => navigator("/host")} className="bg-blue-600 text-white py-2 px-4 sm:px-6 rounded-lg font-bold shadow hover:bg-blue-700 transition-all text-sm sm:text-base">Restart</button>
                        :
                        <button
                            onClick={iReady}
                            className={`py-2 px-6 sm:px-8 rounded-lg font-bold shadow-lg transition-all transform hover:scale-105 text-sm sm:text-base ${isReady
                                ? 'bg-red-500 hover:bg-red-600 text-white'
                                : 'bg-green-500 hover:bg-green-600 text-white'
                                }`}
                        >
                            {isReady ? 'Cancel Ready' : 'Ready Up!'}
                        </button>
                }
            </div>

            {participants.length > 0 ? (
                <div className="space-y-4">
                    {participants.map((member) => (
                        <div key={member._id || member.email}
                            className={`group flex items-center justify-between p-4 rounded-xl border-b-2 transition-all hover:translate-x-1 ${darkMode
                                ? 'bg-gray-800/40 border-gray-700 hover:bg-gray-800'
                                : 'bg-white border-gray-100 hover:bg-gray-50'
                                }`}
                        >
                            {/* Left: User Info */}
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${member.ready
                                    ? 'bg-green-500 text-white shadow-green-500/50 shadow-md'
                                    : 'bg-gray-500 text-white'
                                    }`}>
                                    {member.username ? member.username[0].toUpperCase() : '?'}
                                </div>
                                <div>
                                    <p className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                        {member.username || member.email}
                                    </p>
                                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {member.isHost ? '👑 Host' : 'Player'}
                                    </p>
                                </div>
                            </div>

                            {/* Right: Icons/Status */}
                            <div className="flex items-center gap-3">
                                {/* Ready Status Icon (Joystick/Check) */}
                                {member.ready ? (
                                    <div className="bg-green-500/20 p-2 rounded-lg text-green-500" title="Ready">
                                        <Unlock className="w-5 h-5" />
                                    </div>
                                ) : (
                                    <div className="bg-gray-500/20 p-2 rounded-lg text-gray-500" title="Not Ready">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                )}

                                {/* Remove player button (admin only) */}
                                {isAdmin && member.email !== userEmail && (
                                    <button
                                        onClick={() => handleRemovePlayer(member.email)}
                                        disabled={isRemovingPlayer}
                                        className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                                        title="Kick Player"
                                    >
                                        {isRemovingPlayer ? '...' : <X className="w-5 h-5" />}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 opacity-50">
                    <Users className="w-16 h-16 mx-auto mb-4" />
                    <p>No players in the room yet.</p>
                </div>
            )}
        </div>
    );
};

export default ShowMember;
