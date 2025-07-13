import React, { useState } from 'react';
import DropdownMenu from './Dropdown';
import CarouselComponent from './CrousaelContest';
import ContestCard from './ContestCard';

// --- Animated Background and Circuit SVG from ContactUs.jsx ---
const AnimatedBackground = ({ darkMode }) => (
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

const CircuitBackground = ({ darkMode }) => (
  <div className="absolute inset-0 opacity-30 z-0 pointer-events-none">
    <svg width="100%" height="100%" viewBox="0 0 1000 1000" className="absolute inset-0">
      <defs>
        <pattern id="circuit-contest" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M10,10 L90,10 L90,90 L10,90 Z" fill="none" stroke={darkMode ? '#7dd3fc' : '#60a5fa'} strokeWidth="0.5" opacity="0.3"/>
          <circle cx="10" cy="10" r="2" fill={darkMode ? '#a78bfa' : '#60a5fa'} opacity="0.5"/>
          <circle cx="90" cy="10" r="2" fill={darkMode ? '#a78bfa' : '#60a5fa'} opacity="0.5"/>
          <circle cx="90" cy="90" r="2" fill={darkMode ? '#a78bfa' : '#60a5fa'} opacity="0.5"/>
          <circle cx="10" cy="90" r="2" fill={darkMode ? '#a78bfa' : '#60a5fa'} opacity="0.5"/>
          <path d="M30,30 L70,30 L70,70 L30,70 Z" fill="none" stroke={darkMode ? '#818cf8' : '#bae6fd'} strokeWidth="0.3" opacity="0.2"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#circuit-contest)"/>
    </svg>
  </div>
);

const ContestContext = ({darkMode}) => {
  // const [, setdarkMode] = useState(false);
  const [contests, setContests] = useState([
    { id: 1, title: 'Design Contest', date: '2024-11-10', description: 'Create an amazing design', img:"https://th.bing.com/th/id/OIP.6KiJM0-6hQCngXw2pgz9wQHaKe?rs=1&pid=ImgDetMain" },
    { id: 2, title: 'Coding Marathon', date: '2024-12-01', description: 'Show your coding skills',img:"https://th.bing.com/th/id/OIP.6KiJM0-6hQCngXw2pgz9wQHaKe?rs=1&pid=ImgDetMain" },
    { id: 3, title: 'Quiz Bowl', date: '2024-12-01', description: 'Show your coding skills',img:"https://th.bing.com/th/id/OIP.6KiJM0-6hQCngXw2pgz9wQHaKe?rs=1&pid=ImgDetMain" },
    { id: 4, title: 'Hackathon', date: '2024-12-01', description: 'Show your coding skills',img:"https://th.bing.com/th/id/OIP.6KiJM0-6hQCngXw2pgz9wQHaKe?rs=1&pid=ImgDetMain" },
    
    // Add more contests as needed
  ]);
  const [selectedContest, setSelectedContest] = useState(contests);

  const recommendedOptions = ['Design Contest', 'Coding Marathon', 'Quiz Bowl', 'Hackathon'];

  const handleSelectContest = (contestTitle) => {
    if(contestTitle === '')
      setSelectedContest(contests)
    else{

      const selected = [contests.find((contest) => contest.title === contestTitle)];
      console.log("contstt"+contestTitle+selected);
      setSelectedContest(selected.length ? selected:contests);
    }
  };

 

  return (
    <div className={`min-h-screen relative overflow-hidden transition-all duration-500 ${
      darkMode
        ? 'bg-gradient-to-br from-blue-950 via-black-900 to-gray-900'
        : 'bg-gradient-to-br from-blue-100 via-white to-blue-200'
    }`}
    >
      {/* Circuit and Animated Backgrounds */}
      <CircuitBackground darkMode={darkMode} />
      <AnimatedBackground darkMode={darkMode} />
      {/* CSS Animations for orbs */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(20px); }
        }
      `}</style>
      <div className="relative z-10 flex flex-col pt-20 items-center transition-all duration-300 p-8">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-8 mt-12 bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg">Contests</h1>
        {/* Carousel */}
        <div className="w-full mb-4">
          <CarouselComponent darkMode={darkMode} contest={contests} />
        </div>
        {/* Search Dropdown */}
        <div className="w-full max-w-lg mb-8">
          <DropdownMenu recommendedOptions={recommendedOptions} onSelect={handleSelectContest} />
        </div>
        {/* Contest Cards */}
        <div className="w-full max-w-[1200px] grid grid-cols-1 md:grid-cols-2 gap-6">
          <ContestCard key={1} hostnavigate={1} darkMode={darkMode} />
          {selectedContest.map((contest) => (
            <ContestCard key={contest.id} {...contest} darkMode={darkMode} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContestContext;
