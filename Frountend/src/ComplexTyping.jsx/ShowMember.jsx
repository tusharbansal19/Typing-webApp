import React, { useState, useEffect, useCallback } from 'react';
import { MdOutlineRestartAlt } from "react-icons/md";

import { useSocket } from '../Context/Socket';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../Context/AuthContext';

const ShowMember = ({ darkMode }) => {

    const { socket } = useSocket();
const navigator=useNavigate();
const roomName = useSelector(state => state.matchRealtime.roomName);
const participants = useSelector(state => state.matchRealtime.participants);
    const [readyPlayers, setReadyPlayers] = useState([]);
 
    const [joinMessage, setJoinMessage] = useState("");
    const [restartButton, setrestartButton] = useState(false);
    const {userEmail} = useAuth();
    
console.log("userEmail",userEmail);
    // Find the current user in the group
    const me = participants.find(m => m.email === userEmail);
    const isReady = !!(me && me.ready);

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
        <div className={`w-full min-h-screen  lg:mt-0 lg:ml-6 p-6 mt-12 rounded-lg shadow-lg ${darkMode ? 'bg-gradient-to-br text-white from-black to-blue-900' : 'bg-gradient-to-br from-blue-200 to-white'}`}>
        <h2 className="text-xl font-semibold mt-12 mb-4"> Room name : {roomName}</h2>
        
        {joinMessage && (
          <div className="mb-4 p-2 bg-green-200 text-green-800 rounded text-center animate-pulse">{joinMessage}</div>
        )}
        
        <p className="text-lg mb-6">Total Players: {participants.length}</p>
       {
        restartButton ==='restart'? <button onClick={()=>navigator("/host")} className="bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-700">Restart Game</button> 
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
                    <span className={`ml-2 px-3 py-1 rounded-full text-sm font-bold ${member.ready ? 'bg-green-500 text-white' : 'bg-red-500 text-white'} transition-colors duration-300`}>
                        {member.ready ? 'Ready' : 'Not Ready'}
                    </span>
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
