import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MdOutlineRestartAlt } from "react-icons/md";

import { useSocket } from '../Context/Socket';
import { useNavigate } from 'react-router-dom';

const ShowMember = ({ darkMode, roomName }) => {

    const { socket } = useSocket();
const navigator=useNavigate();
    const [groupMembers, setGroupMembers] = useState([]);
    const [readyCount, setReadyCount] = useState(0);
    const [readyPlayers, setReadyPlayers] = useState([]);
    const [isReady, setIsReady] = useState(false);
    const [emails, setEmails]=useState([]);
    useEffect(() => {
      if (!socket) return;
      console.log(localStorage.getItem('email'));
      let email = localStorage.getItem('email') 
      socket.emit('joinRoom', { roomName, socketId:socket.id,email,
       });
      socket.on('addNewMember', ({members,emails, readyPlayersList}) => {
        setGroupMembers(members);
        setEmails(emails);
        console.log('emails',emails, readyPlayers);

        setReadyPlayers(readyPlayersList);

      });
      socket.on('showRanks',(rankplayer)=>{
        setrestartButton("restart")
        console.log("kqwdnwadcwaocnj")
        socket.emit('playerReady', { roomName, isReady:false });
        setIsReady(false);
      }) 
      socket.on('showReadyPlayers', (readyPlayersList) => {
          setReadyPlayers(readyPlayersList);
      });
  
      return () => {
        socket.off('addNewMember');
        socket.off('showReadyPlayers');
      };
    }, [socket, roomName]);
  
    const iReady = useCallback(() => {
        socket.emit('playerReady', { roomName, isReady:!isReady });
        setIsReady(!isReady);
    }, [socket, roomName, isReady]);
  const [restartButton, setrestartButton] = useState(false)
 
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
            {groupMembers.map((member, index) => (
                <li key={member || index} className={`p-3 bg-gray-700 rounded-lg shadow-md ${readyPlayers.includes(member)? ' text-green-500 ': 'text-red-600'}`}>
                        <span className="font-medium">{ `User ${index + 1}`}</span>
                        <p className="text-sm text-gray-400">ID: {emails[index]}</p>
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
