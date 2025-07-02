import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { FaCheckCircle, FaTimesCircle, FaChartLine, FaPrayingHands } from 'react-icons/fa';
import '../App.css';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { useSocket } from '../Context/Socket';
  
  // Register necessary components
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  
  

  
  const AtlastResultsPage = ({roomName ,darkMode, inputText,currentText}) => {
    const { socket } = useSocket();
    const [resultData, setResults]=useState();
    const [isShowing,setIsShowing] = useState(false);

    useEffect(()=>{

        console.log(" nkcncvlsejlv ->>"+
        inputText, currentText, roomName
        )
        const inputWords = inputText.trim().split(" ");
        const currentWords = currentText.trim().split(" ");
      
        let correctWords = 0;
        let mistakes = 0;
        inputWords.forEach((word, index) => {
            if (word === currentWords[index]) {
              correctWords++;}})
           
      let ib=0;
        inputText.split("").forEach((e, index) => {
          if (e !== currentText[index]) {
            mistakes++;
          }
          else{
ib++;
          }
        });
      
        const totalWords = currentText.length;
        const speed = correctWords; // Speed is measured in correct words per minute (or second if scaled).
        const accuracy = ((ib / totalWords) * 100).toFixed(2);
      
        setResults({
          speed,
          accuracy: isNaN(accuracy) ? 0 : accuracy, // Avoid NaN for empty input
          mistakes,
          points: correctWords,
          roomName, // Points can be equivalent to correct words
        })
        console.log("result data " +resultData )

          setIsShowing(true);
        if (socket) {

            socket.emit('submitResult',{
                speed,
                accuracy: isNaN(accuracy) ? 0 : accuracy, // Avoid NaN for empty input
               
                roomName,
                email:localStorage.getItem("email")// Points can be equivalent to correct words
              });
            // socket.emit('submitResult', {roomName, accuracy, speed:getSpeed()});
        }


    },[])



  
   
      
      
    // Data and options for the progress chart
    
 
  
    return (
      
      <div className={`p-6 max-w-3xl mx-auto rounded-lg backdrop-blur-md transition-colors ${darkMode ? 'bg- /70 text-gray-200' : 'bg-white/10 text-gray-800'}`}>
        {/* Header Section */}
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-black to-blue-400 text-transparent bg-clip-text">
          Typing Test Results
        </h1>
  
        {/* Details Section */}
       {isShowing&&<>
         <div className="flex flex-wrap justify-between gap-5 mb-8">
          <div className="flex-1 min-w-[150px] p-6 rounded-lg text-center bg-white/10 shadow-lg transition-transform hover:translate-y-[-0.5rem] hover:shadow-xl">
            <FaCheckCircle className="text-3xl text-green-500 mb-2" />
            <p>Speed: {resultData.speed} WPM</p>
          </div>
          <div className="flex-1 min-w-[150px] p-6 rounded-lg text-center bg-white/10 shadow-lg transition-transform hover:translate-y-[-0.5rem] hover:shadow-xl">
            <FaTimesCircle className="text-3xl text-red-500 mb-2" />
            <p>Mistakes: {resultData.mistakes}</p>
          </div>
          <div className="flex-1 min-w-[150px] p-6 rounded-lg text-center bg-white/10 shadow-lg transition-transform hover:translate-y-[-0.5rem] hover:shadow-xl">
            <FaChartLine className="text-3xl text-blue-500 mb-2" />
            <p>Accuracy: {resultData.accuracy}%</p>
          </div>
          <div className="flex-1 min-w-[150px] p-6 rounded-lg text-center bg-white/10 shadow-lg transition-transform hover:translate-y-[-0.5rem] hover:shadow-xl">
            <FaChartLine className="text-3xl text-orange-500 mb-2" />
            <p>Points: {resultData.points}</p>
          </div>
        </div>
  
       
        </>}
      </div>
    );
  };
  
  export default AtlastResultsPage;
  