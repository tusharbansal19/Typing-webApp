import React, { useState, useEffect } from 'react';
import { FaKeyboard, FaLightbulb } from "react-icons/fa";

// CircuitBackground with dual color support
const CircuitBackground = ({ darkMode }) => (
  <div className="absolute inset-0 opacity-30 z-0 pointer-events-none">
    <svg width="100%" height="100%" viewBox="0 0 1000 1000" className="absolute inset-0">
      <defs>
        <pattern id="circuit-learn" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M10,10 L90,10 L90,90 L10,90 Z" fill="none" stroke={darkMode ? '#7dd3fc' : '#60a5fa'} strokeWidth="0.5" opacity="0.3"/>
          <circle cx="10" cy="10" r="2" fill={darkMode ? '#a78bfa' : '#60a5fa'} opacity="0.5"/>
          <circle cx="90" cy="10" r="2" fill={darkMode ? '#a78bfa' : '#60a5fa'} opacity="0.5"/>
          <circle cx="90" cy="90" r="2" fill={darkMode ? '#a78bfa' : '#60a5fa'} opacity="0.5"/>
          <circle cx="10" cy="90" r="2" fill={darkMode ? '#a78bfa' : '#60a5fa'} opacity="0.5"/>
          <path d="M30,30 L70,30 L70,70 L30,70 Z" fill="none" stroke={darkMode ? '#818cf8' : '#bae6fd'} strokeWidth="0.3" opacity="0.2"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#circuit-learn)"/>
    </svg>
  </div>
);

// --- Animated Background and Circuit SVG from ContactsUs.jsx ---
const AnimatedBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0">
    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-cyan-900/20" />
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"
           style={{ top: '10%', left: '10%', animation: 'float 20s ease-in-out infinite alternate' }} />
      <div className="absolute w-80 h-80 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl"
           style={{ bottom: '10%', right: '10%', animation: 'float 25s ease-in-out infinite alternate-reverse' }} />
    </div>
  </div>
);

const LearnPage = ({ darkMode }) => {
  const practiceWords = [
    "keyboard", "challenge", "efficiency", "focus", "speed", "accuracy", 
    "perseverance", "typing", "learning", "development", "improvement"
  ];
  
  // Update images array to have 18 unique cards
  const images = [
    { src: 'https://media.gettyimages.com/id/1422478091/photo/close-up-of-a-hands-on-a-laptop-keyboard.jpg?s=612x612&w=gi&k=20&c=C4yAFsTwUQ90sHNCiCB3EtOaCvcv2usfaGWh5NiXWG4=', alt: 'Focus Typing', caption: 'Focus on Accuracy' },
    { src: 'https://images.pexels.com/photos/374720/pexels-photo-374720.jpeg?cs=srgb&dl=pexels-burst-374720.jpg&fm=jpg', alt: 'Speed Building', caption: 'Increase Your Speed' },
    { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUxmHcLg_k98eDPQiDnAXMd3FLxLpVIMrL-g&s', alt: 'Typing Techniques', caption: 'Master Typing Techniques' },
    { src: 'https://media.gettyimages.com/id/1422478091/photo/close-up-of-a-hands-on-a-laptop-keyboard.jpg?s=612x612&w=gi&k=20&c=C4yAFsTwUQ90sHNCiCB3EtOaCvcv2usfaGWh5NiXWG4=', alt: 'Finger Placement', caption: 'Perfect Finger Placement' },
    { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUxmHcLg_k98eDPQiDnAXMd3FLxLpVIMrL-g&s', alt: 'Consistency', caption: 'Practice Consistently' },
    { src: 'https://images.pexels.com/photos/374720/pexels-photo-374720.jpeg?cs=srgb&dl=pexels-burst-374720.jpg&fm=jpg', alt: 'Posture', caption: 'Maintain Good Posture' },
    { src: 'https://images.pexels.com/photos/374720/pexels-photo-374720.jpeg?cs=srgb&dl=pexels-burst-374720.jpg&fm=jpg', alt: 'Breaks', caption: 'Take Regular Breaks' },
    { src: 'https://media.gettyimages.com/id/1422478091/photo/close-up-of-a-hands-on-a-laptop-keyboard.jpg?s=612x612&w=gi&k=20&c=C4yAFsTwUQ90sHNCiCB3EtOaCvcv2usfaGWh5NiXWG4=', alt: 'Home Row', caption: 'Use the Home Row' },
    { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUxmHcLg_k98eDPQiDnAXMd3FLxLpVIMrL-g&s', alt: 'Shortcuts', caption: 'Learn Keyboard Shortcuts' },
    { src: 'https://images.pexels.com/photos/374720/pexels-photo-374720.jpeg?cs=srgb&dl=pexels-burst-374720.jpg&fm=jpg', alt: 'Motivation', caption: 'Stay Motivated!' },
    { src: 'https://media.gettyimages.com/id/1422478091/photo/close-up-of-a-hands-on-a-laptop-keyboard.jpg?s=612x612&w=gi&k=20&c=C4yAFsTwUQ90sHNCiCB3EtOaCvcv2usfaGWh5NiXWG4=', alt: 'Accuracy', caption: 'Aim for Accuracy First' },
    { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUxmHcLg_k98eDPQiDnAXMd3FLxLpVIMrL-g&s', alt: 'Speed Drills', caption: 'Practice Speed Drills' },
    { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUxmHcLg_k98eDPQiDnAXMd3FLxLpVIMrL-g&s', alt: 'Finger Strength', caption: 'Build Finger Strength' },
    { src: 'https://media.gettyimages.com/id/1422478091/photo/close-up-of-a-hands-on-a-laptop-keyboard.jpg?s=612x612&w=gi&k=20&c=C4yAFsTwUQ90sHNCiCB3EtOaCvcv2usfaGWh5NiXWG4=', alt: 'Discipline', caption: 'Be Consistent and Disciplined' },
    { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUxmHcLg_k98eDPQiDnAXMd3FLxLpVIMrL-g&s', alt: 'Healthy Hands', caption: 'Take Care of Your Hands' },
    { src: 'https://images.pexels.com/photos/374720/pexels-photo-374720.jpeg?cs=srgb&dl=pexels-burst-374720.jpg&fm=jpg', alt: 'Typing Games', caption: 'Play Typing Games' },
    { src: 'https://media.gettyimages.com/id/1422478091/photo/close-up-of-a-hands-on-a-laptop-keyboard.jpg?s=612x612&w=gi&k=20&c=C4yAFsTwUQ90sHNCiCB3EtOaCvcv2usfaGWh5NiXWG4=', alt: 'Track Progress', caption: 'Track Your Progress' },
    { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUxmHcLg_k98eDPQiDnAXMd3FLxLpVIMrL-g&s', alt: 'Challenge Yourself', caption: 'Challenge Yourself Regularly' },
  ];

  const [filteredWords, setFilteredWords] = useState(practiceWords);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setFilteredWords(
      practiceWords.filter(word => word.toLowerCase().includes(value))
    );
  };

  return (
    <div className={`relative min-h-screen transition-all duration-500 overflow-hidden ${darkMode
      ? 'bg-gradient-to-br from-blue-950 via-black-900 to-gray-900'
      : 'bg-gradient-to-br from-blue-100 via-white to-blue-200'}`}
    >
      <AnimatedBackground />
      <CircuitBackground darkMode={darkMode} />
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Typing Practice Words Section */}
        <section className={`${darkMode ? 'bg-gray-900/80 border-gray-700/80' : 'bg-white/90 border-gray-200/80'} space-y-6 p-6 rounded-2xl shadow-lg`}> 
          <h2 className={`text-3xl font-bold text-center mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">Typing Practice Words</span>
          </h2>
          <input 
            type="text" 
            placeholder="Search practice words..." 
            onChange={handleSearch} 
            className={`p-2 rounded-lg w-full border ${darkMode ? 'bg-gray-800 text-gray-300 border-gray-600' : 'bg-gray-200 text-black border-gray-300'} focus:ring-2 focus:ring-blue-400`}
          />
          <div className="flex flex-wrap gap-4 justify-center mt-4">
            {filteredWords.map((word, index) => (
              <span 
                key={index} 
                className={`px-4 py-2 rounded-lg transform transition-transform duration-300 ${darkMode ? 'bg-blue-700 text-white' : 'bg-blue-200 text-blue-900'} hover:scale-105 hover:shadow-lg cursor-pointer`}
              >
                {word}
              </span>
            ))}
          </div>
        </section>

        {/* Instructional Images Section */}
        <section className={`${darkMode ? 'bg-gray-900/80 border-gray-700/80' : 'bg-white/90 border-gray-200/80'} space-y-6 p-6 rounded-2xl shadow-lg`}>
          <h2 className={`text-3xl font-bold text-center mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            <span className="bg-gradient-to-r from-orange-400 to-cyan-400 bg-clip-text text-transparent">Typing Tips & Techniques</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((img, index) => (
              <div 
                key={index} 
                className={`flex flex-col p-4 rounded-lg shadow-md transition-all transform ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-black'} hover:scale-105 hover:shadow-xl`}
              >
                <img src={img.src} alt={img.alt} className="rounded-lg mb-4 w-full h-48 object-cover hover:opacity-80 transition-opacity" />
                <h3 className={`text-xl font-bold text-center ${darkMode ? 'text-blue-400' : 'text-gradient'}`}>
                  <span className="gradient-text">{img.caption}</span>
                </h3>
                <p className={`mt-2 text-center ${darkMode ? 'text-gray-400' : 'text-gray-700'} hover:text-blue-500`}>
                  Learn to improve your typing speed with our techniques.
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default LearnPage;
