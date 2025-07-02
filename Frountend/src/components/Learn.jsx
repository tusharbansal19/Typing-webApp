import React, { useState, useEffect } from 'react';
import { FaKeyboard, FaLightbulb } from "react-icons/fa";

const LearnPage = ({ darkMode }) => {
  const practiceWords = [
    "keyboard", "challenge", "efficiency", "focus", "speed", "accuracy", 
    "perseverance", "typing", "learning", "development", "improvement"
  ];
  
  const images = [
    { src: 'image1.jpg', alt: 'Focus Typing', caption: 'Focus on Accuracy' },
    { src: 'image2.jpg', alt: 'Speed Building', caption: 'Increase Your Speed' },
    { src: 'image3.jpg', alt: 'Typing Techniques', caption: 'Master Typing Techniques' },
  ];

  const [filteredWords, setFilteredWords] = useState(practiceWords);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setFilteredWords(
      practiceWords.filter(word => word.toLowerCase().includes(value))
    );
  };

  return (
    <div className={`${darkMode ? 'bg-gradient-to-br from-black via-blue-900 to-gray-900' : 'bg-gradient-to-br from-blue-200 via-blue-100 to-white'} min-h-screen text-white p-6 md:p-10`}>
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Typing Practice Words Section */}
        <section className={`glass-effect2 space-y-6 p-6 rounded-lg shadow-lg ${darkMode ? '' : ''}`}>
          <h2 className={`text-3xl font-semibold text-center ${darkMode ? 'text-blue-400' : 'text-gradient'}`}>
            <span className="gradient-text text-blue-500">Typing Practice Words</span>
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
        <section className={`glass-effect2 space-y-6 p-6 rounded-lg shadow-lg ${darkMode ? '' : ''}`}>
          <h2 className={`text-3xl font-semibold text-center ${darkMode ? 'text-blue-400' : 'text-gradient'}`}>
            <span className="gradient-text text-orange-600">Typing Tips & Techniques</span>
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
