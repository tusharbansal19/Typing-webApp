import React from 'react';
import LogoCard from './LogoCard';
import { FaGithub, FaTwitter, FaInstagram, FaYoutube, FaDiscord } from "react-icons/fa";
 import '../App.css'
const UserDashboard = ({ darkMode, toggleDarkMode }) => {
  // Sample user data (replace with actual data as needed)
  const user = {
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+123 456 7890",
    rank: "Gold",
    profilePhoto: "https://via.placeholder.com/150", // Sample profile photo URL
    activity: [
      "User signed in",
      "Updated profile settings",
      "Checked notifications",
    ],
    notifications: [
      "You have 3 new messages.",
      "Your profile was updated successfully.",
      "Don't forget to check our latest offers!",
    ],
  };

  return (
    <div className={`${darkMode ? 'bg-gradient-to-br from-black via-blue-900 to-gray-900' : 'bg-gradient-to-br from-blue-200 to-white'} min-h-screen text-white p-6 md:p-10`}>
      <div className="max-w-7xl mx-auto space-y-12 mt-12">
        
        {/* Header Section */}
        <header className="text-center space-y-4">
          <h1 className={`${darkMode ? 'text-blue-400' : 'text-blue-700'} text-4xl md:text-5xl font-bold`}>User Dashboard</h1>
          <p className={`${darkMode ? 'text-gray-300' : 'text-orange-800'} text-lg md:text-xl`}>
            Welcome to your dashboard! Here you can manage your profile, view notifications, and more.
          </p>
          {/* Dark/Light Mode Toggle Button */}
         
        </header>

        {/* User Info Section */}
        <section className={`glass-effect2 space-y-6 p-6 rounded-lg shadow-lg ${darkMode ? '' : ''}`}>
          <h2 className={`${darkMode ? 'text-blue-400' : 'text-blue-700'} text-3xl font-semibold`}>User Information</h2>
          <div className="flex items-center justify-between space-x-4">
          
            <div className="space-y-2">
              <p className={`${darkMode ? 'text-gray-300' : 'text-black'} text-lg`}>
                Name: {user.name}
              </p>
              <p className={`${darkMode ? 'text-gray-300' : 'text-black'} text-lg`}>
                Email: {user.email}
              </p>
              <p className={`${darkMode ? 'text-gray-300' : 'text-black'} text-lg`}>
                Phone: {user.phone}
              </p>
              <p className={`${darkMode ? 'text-gray-300' : 'text-black'} text-lg`}>
                Rank: <span className={`${user.rank === 'Gold' ? 'text-yellow-500' : 'text-gray-300'}`}>{user.rank}</span>
              </p>
              </div>
              <img 
              src={user.profilePhoto} 
              alt={`${user.name}'s profile`} 
              className="w-40 h-40 ml-20 hover:rounded-md transition-all    duration-200 rounded-full border-2 border-blue-400" 
            />
          </div>
        </section>

        {/* Activity Section */}
        <section className={`glass-effect2 space-y-6 p-6 rounded-lg shadow-lg ${darkMode ? '' : ''}`}>
          <h2 className={`${darkMode ? 'text-blue-400' : 'text-blue-700'} text-3xl font-semibold`}>Recent Activity</h2>
          <ul className={`list-disc list-inside ${darkMode ? 'text-gray-300' : 'text-black'}`}>
            {user.activity.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Settings Section */}
       

        {/* Notifications Section */}
        <section className={`glass-effect2 space-y-6 p-6 rounded-lg shadow-lg ${darkMode ? '' : ''}`}>
          <h2 className={`${darkMode ? 'text-blue-400' : 'text-blue-700'} text-3xl font-semibold`}>Notifications</h2>
          <ul className={`list-disc list-inside ${darkMode ? 'text-gray-300' : 'text-black'}`}>
            {user.notifications.map((notification, index) => (
              <li key={index}>{notification}</li>
            ))}
          </ul>
        </section>

        {/* Connect With Us Section */}
        <section className={`glass-effect2 space-y-6 text-center p-6 rounded-lg shadow-lg ${darkMode ? '' : ''}`}>
          <h2 className={`${darkMode ? 'text-blue-400' : 'text-blue-700'} text-2xl font-semibold`}>Connect With Us</h2>
          <div className="flex justify-center space-x-6">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={`${darkMode ? 'text-blue-400' : 'text-black'} hover:text-blue-500`}>
              <i className="fab fa-facebook-f text-2xl"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={`${darkMode ? 'text-blue-400' : 'text-black'} hover:text-blue-500`}>
              <i className="fab fa-twitter text-2xl"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={`${darkMode ? 'text-blue-400' : 'text-black'} hover:text-blue-500`}>
              <i className="fab fa-instagram text-2xl"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={`${darkMode ? 'text-blue-400' : 'text-black'} hover:text-blue-500`}>
              <i className="fab fa-linkedin-in text-2xl"></i>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserDashboard;
