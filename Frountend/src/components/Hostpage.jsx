import React, { useState, useContext, useEffect } from 'react';
import io from 'socket.io-client';
import { FaGithub, FaTwitter, FaInstagram, FaYoutube, FaDiscord } from "react-icons/fa";
import "../App.css"
import { useSocket } from '../Context/Socket';
import { useNavigate } from 'react-router-dom';
// Replace with your server URL or use environment variable


const Hostpage = ({ darkMode }) => {
 let navigator =useNavigate();
  let { socket, typingUsers }=useSocket();
  const [groupName, setGroupName] = useState('');
  const [joinName, setJoinName]=useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
useEffect(() =>{

console.log('Connecting to'+typingUsers)


},[])
useEffect(() => {
  if(socket){

    // Listen for any responses from the server if needed
    socket.on('createGroupToJoin', (response) => {
      console.log('Group created:', response);
    });
    
    
    return () => {
      socket.off('groupCreated'); // Cleanup the listener
    };
  }
}, [socket]);

  // Handle group creation
  

  // Handle group joining
  const handleJoinGroup = () => {
    let x="";
    if(!groupName)
      x=joinName
    else{
      x=groupName
    }
    console.log("group created :"+x)

     // Emit 'joinGroup' event
     console.log(`Creating group: ${x}`);
     socket.emit('createGroup',{roomName:x})
     
     setIsJoining(false);
     navigator("/hostgame", {state:{roomName:x}})
    
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
          <input
            type="text"
            placeholder="Enter group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full p-3 rounded-md text-black"
          />
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
          >
            {isCreating ? 'Cancel' : 'Create Group'}
          </button>
          {isCreating && (
            <button
              onClick={handleJoinGroup}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition-colors"
            >
              Confirm Creation
            </button>
          )}
        </div>

        {/* Group Joining Section */}
        <div className="glass-effect2 p-6 rounded-lg shadow-lg flex flex-col items-center space-y-4 md:space-y-6">
          <h2 className={`${darkMode ? 'text-blue-400' : 'text-blue-700'} text-3xl font-semibold`}>Join an Existing Group</h2>
          <input
            type="text"
            placeholder="Enter group name to join"
            value={joinName}
            onChange={(e) => setJoinName(e.target.value)}
            className="w-full p-3 rounded-md text-black"
          />
          <button
            onClick={() => setIsJoining(!isJoining)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
          >
            {isJoining ? 'Cancel' : 'Join Group'}
          </button>
          {isJoining && (
            <button
              onClick={handleJoinGroup}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition-colors"
            >
              Confirm Join
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hostpage;
