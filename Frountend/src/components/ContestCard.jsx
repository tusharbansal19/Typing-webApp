import React from 'react';
import { useNavigate } from 'react-router-dom';

const ContestCard = ({hostnavigate, title, date, description, darkMode }) => {
  const navigator=useNavigate();
  const handleReady = () => {
    navigator('/host');
  };
  return (
    <div
      className={`p-4 rounded-lg shadow-lg transition-all duration-300 min-h-[200px] hover:shadow-2xl backdrop-blur-sm border ${
        darkMode
          ? 'bg-gray-800/30 border-gray-700/50 text-white'
          : 'bg-white/30 border-gray-200/50 text-gray-800'
      }`}
    >
      {hostnavigate== 1?<>
      
        <h2 className="text-2xl font-semibold text-blue-500 ">{"Costom Player"}</h2>
        <p className="mt-2">{"Join with your friend to make your joirney smart and fast"}</p>

        <button onClick={handleReady} className="bg-blue-500 text-white mt-5 rounded shadow hover:bg-blue-700">
            {'Room'}
          </button>
      </>:<>

      

      <h2 className="text-2xl font-semibold text-blue-500 ">{title}</h2>
      <p className="text-gray-500">{date}</p>
      <p className="mt-2">{description}</p>
      </>
      }
    </div>
  );
};

export default ContestCard;
