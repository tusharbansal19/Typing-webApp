import React, { useState } from 'react';
import LogoCard from './LogoCard';
import { FaGithub, FaTwitter, FaInstagram, FaYoutube, FaDiscord } from "react-icons/fa";

const AboutUsPage = ({darkMode}) => {
  // const [darkMode, setdarkMode] = useState(true); // Default to dark mode

  const toggleDarkMode = () => {
   
  };

  return (
    <div className={`${darkMode ? 'bg-gradient-to-br  from-black via-blue-900 to-gray-900' : 'bg-gradient-to-br from-blue-300 to-white'}  min-h-screen text-white p-6 md:p-10`}>
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Section */}
        <header className="text-center space-y-4  mt-12">
          <h1 className={`${darkMode ? 'text-blue-400' : 'text-blue-700'} text-4xl md:text-5xl font-bold`}>About Us</h1>
          <div className="flex w-full justify-center gap-4 mb-4">
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
          <p className={`${darkMode ? 'text-gray-300' : 'text-yellow-800'} text-lg md:text-xl`}>
            Discover who we are, what we do, and how we strive to make a difference.
          </p>
          
        
        </header>

        {/* Mission Section */}
        <section className={`glass-effect2 space-y-6 p-6 rounded-lg shadow-lg ${darkMode ? '' : ''}`}>
          <h2 className={`${darkMode ? 'text-blue-400' : 'text-blue-600'} text-3xl font-semibold`}>Our Mission</h2>
          <p className={`${darkMode ? 'text-gray-300' : 'text-black'} text-lg`}>
       Our Aim to diliver a open and collaborative environment free for all the indians.
          </p>
        </section>

        {/* Story Section */}
        <section className={`glass-effect2 space-y-6 p-6 rounded-lg shadow-lg ${darkMode ? '' : ''}`}>
          <h2 className={`${darkMode ? 'text-blue-400' : 'text-blue-700'} text-3xl font-semibold`}>Our Story</h2>
          <p className={`${darkMode ? 'text-gray-300' : 'text-black'} text-lg`}>
          Tushar had always been the curious type. As a child, he took apart remote controls just to see what was inside, and as a teenager, he spent hours tinkering with his computer, trying to figure out how everything worked. But there was one thing that always eluded him: coding. It seemed like some secret language — one that only the elite programmers spoke. Tushar admired developers and often dreamed of building his own apps, websites, or even video games. But he never knew where to start.
          </p>
        </section>

        {/* Team Section */}
        <section className={`glass-effect2 space-y-6 p-6 rounded-lg shadow-lg ${darkMode ? '' : ''}`}>
          <h2 className={`${darkMode ? 'text-blue-400' : 'text-blue-700'} text-3xl font-semibold`}>Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <LogoCard name={"Tushar Bansal"}/>
            <LogoCard name ={"yash"}/>
          </div>
        </section>

        {/* Connect With Us Section */}
        <section className={`glass-effect2 space-y-6 text-center p-6 rounded-lg shadow-lg ${darkMode ? '' : ''}`}>
          <h2 className={`${darkMode ? 'text-blue-400' : 'text-blue-700'} text-2xl font-semibold`}>Connect With Us</h2>
          <p className={`${darkMode ? 'text-gray-300' : 'text-black'} text-lg`}>
            We would love to hear from you! Reach out to us with any questions, feedback, or concerns.
          </p>
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

export default AboutUsPage;
