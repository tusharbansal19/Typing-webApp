import React, { useState } from 'react';
import DropdownMenu from './Dropdown';
import CarouselComponent from './CrousaelContest';
import ContestCard from './ContestCard';

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
    <div
      className={`min-h-screen flex flex-col  pt-20 items-center transition-all duration-300 ${
        darkMode
          ? 'bg-gradient-to-b from-gray-900 via-black to-gray-800 text-white'
          : 'bg-gradient-to-b from-blue-200 via-blue-100 to-white text-gray-900'
      } p-8`}
    >
      {/* Toggle Dark Mode Button */}
      

      {/* Title */}
      <h1 className="text-4xl font-bold mb-8 mt-12 text-blue-500  ">Contests</h1>

      {/* Carousel */}
      <div className="w-full  mb-4">
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
  );
};

export default ContestContext;
