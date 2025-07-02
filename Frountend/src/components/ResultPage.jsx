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
  
  

  
  const ResultsPage = ({ darkMode, speed, mistakes, points, accuracy, progressData, inputText,currentText}) => {

    const [isShowing,setIsShowing] = useState(false);
    const progressFunction= () => {
      let speed=0
      let cyrAarray=currentText.split(" ");
      let inpArray=inputText.split(" ");
      for(let i=0;i<inpArray.length;i++) {
        if(inpArray[i]===cyrAarray[i]) {
          console.log(speed+"cncbnosbdvbs")
          speed+=1
        }
      }
     

    
    setIsShowing(true);
    return speed;
    }
    const dataProgressPoints=()=>{
      let datapoints=[];
      let l=Math.ceil(progressData.length/10);
      datapoints.push(progressData[0]);
      // console.log("daa points "+ progressData)
      for(let i=l;i<progressData.length;i=i+l) {

      datapoints.push(progressData[i]-progressData[i-l]);
      console.log("the dataponst at "+i+" : "+progressData[i]+'  ' +(progressData[i]-progressData[i-l]))
       } 
       console.log("data points"+datapoints)
      return datapoints;
      }
      
      
    // Data and options for the progress chart
    const data = {
      labels: dataProgressPoints().map((_, index) => `${index * 5} Sec.`),
      datasets: [
        {
          label: 'Typing Speed (WPM)',
          data: progressData,
          borderColor: darkMode ? '#ff6347' : '#007acc',
          backgroundColor: darkMode ? 'rgba(255,99,71,0.2)' : 'rgba(0,122,204,0.2)',
          fill: true,
          tension: 0.2,
        },
      ],
    };
  
    const options = {
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          grid: {
            color: darkMode ? '#555' : '#ccc',
          },
          ticks: {
            beginAtZero: true,
            stepSize: 10,
          },
        },
      },
      plugins: {
        legend: {
          display: true,
          labels: {
            color: darkMode ? '#ff6347' : '#007acc',
          },
        },
      },
    };

    useEffect(()=>{
      let cyrAarray=currentText.split(" ");
      let inpArray=inputText.split(" ");
      for(let i=0;i<inpArray.length;i++) {
        if(inpArray[i]===cyrAarray[i]) {
          console.log(speed+"cncbnosbdvbs")
          speed+=1
        }
      }

       progressFunction();

      return ;
    },[speed])
  
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
            <p>Speed: {speed} WPM</p>
          </div>
          <div className="flex-1 min-w-[150px] p-6 rounded-lg text-center bg-white/10 shadow-lg transition-transform hover:translate-y-[-0.5rem] hover:shadow-xl">
            <FaTimesCircle className="text-3xl text-red-500 mb-2" />
            <p>Mistakes: {mistakes}</p>
          </div>
          <div className="flex-1 min-w-[150px] p-6 rounded-lg text-center bg-white/10 shadow-lg transition-transform hover:translate-y-[-0.5rem] hover:shadow-xl">
            <FaChartLine className="text-3xl text-blue-500 mb-2" />
            <p>Accuracy: {accuracy}%</p>
          </div>
          <div className="flex-1 min-w-[150px] p-6 rounded-lg text-center bg-white/10 shadow-lg transition-transform hover:translate-y-[-0.5rem] hover:shadow-xl">
            <FaChartLine className="text-3xl text-orange-500 mb-2" />
            <p>Points: {points}</p>
          </div>
        </div>
  
        {/* Progress Graph */}
        <div className="p-6 rounded-lg bg-white/20 backdrop-blur-md shadow-lg transition-shadow hover:shadow-xl">
          <Line data={data} options={options} />
        </div>
        </>}
      </div>
    );
  };
  
  export default ResultsPage;
  