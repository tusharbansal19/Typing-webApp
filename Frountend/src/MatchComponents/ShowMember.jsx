import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MdOutlineRestartAlt } from "react-icons/md";

import { useSocket } from '../Context/Socket';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ShowMember = ({ darkMode }) => {

    const { socket } = useSocket();
const navigator=useNavigate();
    const [groupMembers, setGroupMembers] = useState([]);
    const [readyCount, setReadyCount] = useState(0);
    const [readyPlayers, setReadyPlayers] = useState([]);
    const [isReady, setIsReady] = useState(false);
    const roomName = useSelector((state) => state.match.roomName);
    const [joinMessage, setJoinMessage] = useState("");
    const [restartButton, setrestartButton] = useState(false);

    useEffect(() => {
      if (!socket) return;
      // Listen for all participants event
      const handleAllParticipants = ({ participants, roomName: eventRoomName }) => {
        if (eventRoomName === roomName) setGroupMembers(participants);
      };
      socket.on('all participants', handleAllParticipants);


      // Listen for userJoined event
      const handleUserJoined = ({ user, participants, roomName: eventRoomName }) => {
          if (eventRoomName === roomName) {
              setJoinMessage(`${user.username || user.email} joined!`);
              setGroupMembers(participants);
              setTimeout(() => setJoinMessage(""), 3000);
            }
        };
        socket.on('userJoined', handleUserJoined);
        socket.on("meJoined",handleUserJoined)
      // Listen for userLeft event
      const handleUserLeft = ({ user, participants, roomName: eventRoomName }) => {
        if (eventRoomName === roomName) {
          setJoinMessage(`${user.username || user.email} left!`);
          setGroupMembers(participants);
          setTimeout(() => setJoinMessage(""), 3000);
        }
      };
      socket.on('userLeft', handleUserLeft);
      // Other events
      socket.on('addNewMember', ({ members, readyPlayersList }) => {
        setGroupMembers(members);
        setReadyPlayers(readyPlayersList);
      });
      socket.on('showRanks', (rankplayer) => {
        setrestartButton("restart");
        socket.emit('playerReady', { roomName, isReady: false });
        setIsReady(false);
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
        socket.emit('playerReady', { roomName, isReady:!isReady });
        setIsReady(!isReady);
    }, [socket, roomName, isReady]);
 
    useEffect(() => {
        if (socket) {
        

            socket.on('readyStatus', ({ readyCount, totalPlayers }) => {
                setReadyCount(readyCount);
                setAllReady(readyCount === totalPlayers);
            });


            
            socket.on('readyStatus', ({ readyCount, totalPlayers }) => {
                setReadyCount(readyCount);
                setAllReady(readyCount === totalPlayers);
            });
            socket.on('updateGroupMembers', (members) =>{

                setGroupMembers(members);
                console.log("members insertrd =",members)
            } 
        );
            return () => {
                socket.off('updateGroupMembers');
                socket.off('readyStatus');
            };
        }
    }, [socket]);

    return (
        <div className={`w-full lg:w-1/4  lg:mt-0 lg:ml-6 p-6 mt-12 rounded-lg shadow-lg ${darkMode ? 'bg-gradient-to-br text-white from-black to-blue-900' : 'bg-gradient-to-br from-blue-200 to-white'}`}>
        <h2 className="text-xl font-semibold mt-12 mb-4"> Room name : {roomName}</h2>
        
        {joinMessage && (
          <div className="mb-4 p-2 bg-green-200 text-green-800 rounded text-center animate-pulse">{joinMessage}</div>
        )}
        
        <p className="text-lg mb-6">Total Players: {groupMembers.length}</p>
        <p className="text-lg mb-6">Ready Players: {readyCount}</p>
       {
        restartButton ==='restart'? <button onClick={()=>navigator("/host")} className="bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-700">Restart Game</button> 
        :

    
       <button onClick={iReady} className="bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-700">
                        {isReady ? 'Cancel' : 'Ready'}
                    </button>
        }
        {groupMembers.length > 0 ? (
            <ul className="space-y-3 pt-4">
            {groupMembers.map((member) => (
                <li key={member._id || member.email} className={`p-3 bg-gray-700 rounded-lg shadow-md`}>
                        <span className="font-medium">{member.username || member.email}</span>
                        <p className="text-sm text-gray-400">Email: {member.email}</p>
                        <p className="text-xs text-gray-400">ID: {member._id}</p>
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
