import React, { useState, useRef, useEffect } from 'react';

const DropdownMenu = ({ recommendedOptions, onSelect, darkMode }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);
  const closeDropdown = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  };
  const handleOptionClick = (option,key) => {
    onSelect(key);
    // console.log(key)

    setSearchTerm(key);
    setDropdownOpen(false);
  };

  useEffect(() => {
    document.addEventListener('mousedown', closeDropdown);
    return () => document.removeEventListener('mousedown', closeDropdown);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => { if(e.target.value==''){onSelect('');}setSearchTerm(e.target.value)}}
        onClick={toggleDropdown}
        placeholder="Search contest..."
        className={`w-full p-2 border ${darkMode ? 'border-gray-600 bg-gray-800 text-blue-950' : 'border-gray-300 bg-white text-gray-900'} rounded`}
      />
      {isDropdownOpen && (
        <div className={`absolute mt-2 w-full ${darkMode ? 'bg-gray-700' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-300'} rounded shadow-lg`}>
          {recommendedOptions
            .filter((option) => option.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((option) => (
              <div
                key={option}
                className={`px-4 py-2 cursor-pointer text-black ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-blue-100'}`}
                onClick={(e)=>handleOptionClick(e,option)}
              >
                {option}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
