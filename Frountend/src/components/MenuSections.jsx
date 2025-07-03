import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MdOutlineRestartAlt } from "react-icons/md";
import ResultsPage from '../MatchComponents/ResultPage';
import { Typewriter } from 'react-simple-typewriter';
import "../App.css"
const TypingPage = ({ darkMode }) => {
  const [currentText, setCurrentText] = useState('');
  const [inputText, setInputText] = useState('');
  const [timeLeft, setTimeLeft] = useState(30); // 60 seconds timer
  const [isTyping, setIsTyping] = useState(false);
  const [userBit, setUserBit] = useState(false);
  const [showResults, setShowResults] = useState(false);
  let currentTextArray=useRef([]);
  const [cyrAarray,setcyrArray]=useState([]);
let activeCharRef  =useRef(null);
let textContainerRef =useRef(null);
  
  let mistakes=useRef(0);
  const timerRef = useRef();
  const [ptr, setptr]=useState(0);
  const [incorrectArray,setIncorrectArray]=useState([]);
  const [correctArray, setCorrectArray]=useState([]);
  const resultData = {
  
    points: 0,
    accuracy: 0,
   
  };
// Scroll to the bottom when new text is added
useEffect(() => {
  if (activeCharRef.current) {
    activeCharRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }
}, [inputText]);// This will run every time inputText changes

  const textArray = [
    "Na blogu bomo danes govorili o Pokemonih. Pokemoni so priljubljena skupina bitij iz istoimenske franšize, ki jo je leta 1996 ustvarila Satoshi Tajiri. Med najbolj znanimi Pokemoni so Pikachu, Charizard in Bulbasaur. Pokémoni so postali priljubljeni po celem svetu in imajo tudi različne videoigre, animirane serije ter filme. Z veseljem bomo odkrivali več o tem izjemno priljubljenem svetu.Na blogu bomo danes govorili o Pokemonih. Pokemoni so priljubljena skupina bitij iz istoimenske franšize, ki jo je leta 1996 ustvarila Satoshi Tajiri. Med najbolj znanimi Pokemoni so Pikachu, Charizard in Bulbasaur. Pokémoni so postali priljubljeni po celem svetu in imajo tudi različne videoigre, animirane serije ter filme. Z veseljem bomo odkrivali več o tem izjemno priljubljenem svetu.Na blogu bomo danes govorili o Pokemonih. Pokemoni so priljubljena skupina bitij iz istoimenske franšize, ki jo je leta 1996 ustvarila Satoshi Tajiri. Med najbolj znanimi Pokemoni so Pikachu, Charizard in Bulbasaur. Pokémoni so postali priljubljeni po celem svetu in imajo tudi različne videoigre, animirane serije ter filme. Z veseljem bomo odkrivali več o tem izjemno priljubljenem svetu.Na blogu bomo danes govorili o Pokemonih. Pokemoni so priljubljena skupina bitij iz istoimenske franšize, ki jo je leta 1996 ustvarila Satoshi Tajiri. Med najbolj znanimi Pokemoni so Pikachu, Charizard in Bulbasaur. Pokémoni so postali priljubljeni po celem svetu in imajo tudi različne videoigre, animirane serije ter filme. Z veseljem bomo odkrivali več o tem izjemno priljubljenem svetu.Na blogu bomo danes govorili o Pokemonih. Pokemoni so priljubljena skupina bitij iz istoimenske franšize, ki jo je leta 1996 ustvarila Satoshi Tajiri. Med najbolj znanimi Pokemoni so Pikachu, Charizard in Bulbasaur. Pokémoni so postali priljubljeni po celem svetu in imajo tudi različne videoigre, animirane serije ter filme. Z veseljem bomo odkrivali več o tem izjemno priljubljenem svetu.  "
  ];
  
  const countMistakes=useCallback(()=>{
    let mistake=0;
    for(let i=0;i<inputText.length;i++){
if(inputText[i]!=currentText[i])
  mistake++;
    }
    return mistake;
  },[inputText])

  const startTyping = async() => {
    if (!isTyping) {
      setptr(0);
      setInputText('');
      setCorrectArray([]);
      setIncorrectArray([]);
      currentTextArray.current=[];
      console.log("input text"+inputText+" is correct"+correctArray+" in"+incorrectArray)
      setIsTyping(true);
      mistakes.current=0;
      setTimeLeft(30); // Reset to 60 seconds
      await setCurrentText(textArray[Math.floor(Math.random() * textArray.length)]);
      setcyrArray(currentText.split(' ')); 

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsTyping(false);
            setUserBit(true);
            setShowResults(true);
            return 0;
          }
          else{
           
            return prev - 1;
          }
        });
      }, 1000);
    }
  };
  const getSpeed=useCallback(()=>{
   
      let speed=0;
      let inpArray=inputText.split(" ");
      if(inpArray.length){
      let cyrAarray=currentText.split(" ");
      // console.log(cyrAarray)

        for(let i=0;i<inpArray.length;i++) {
          if(inpArray[i]===cyrAarray[i]) 
            speed+=1
          
        }
      }
      return 6*speed;
    
  },[timeLeft,inputText,currentText]);

  const restartTyping = ()=> {
    clearInterval(timerRef.current);
    setUserBit(false);
    setIsTyping(false);
    startTyping();
    setShowResults(false);
   
    
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      console.log(event.key)
     
      if (!userBit){
        startTyping();
        setUserBit(true);
      }
      if (!isTyping) return;
      if(ptr>=currentText.length){
        clearInterval(timerRef.current);
        // setUserBit(false);
        setIsTyping(false);
        // setPromptText('');
        setShowResults(true);

      }
      if(ptr<0)
        return;
      if(event.key === ' '){
        let s='',i=ptr, len=currentText.length;
        console.log("ptr value: "+ptr);
        console.log("currentText value :"+currentText);
        console.log("curent text length: "+len);
        while(currentText[i]!=' '&&i<len) 
        {
          incorrectArray.push(i);
          s=s+'&';
          i++;
        }
        mistakes.current++;
        console.log('mistakes :'+mistakes)
        s=s+' ';
        i++;
        setptr(i);
        setInputText(pre=>pre+s);        
      }

      else if (event.key === 'Backspace'&&inputText[ptr-1] !== " "&&ptr!=0) {
        setInputText((prevText) => prevText.slice(0, -1));
        setptr(prv=>prv-1);

      } else if (/^[a-zA-Z\s]$/.test(event.key)||event.key=='.') {
        const updatedText = inputText + event.key;
        setInputText(updatedText);
        if(event.key !== currentText[ptr]){
         mistakes.current++;
          incorrectArray.push(ptr);
          console.log(incorrectArray)}
          else{
            correctArray.push(ptr);
            console.log(correctArray)
          }
          
          setptr(prv=>prv+1);
        }

      if (inputText === currentText) {
        clearInterval(timerRef.current);
        setIsTyping(false);
        setShowResults(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [inputText, currentText, mistakes, isTyping, userBit,ptr]);

  const displayTime = useCallback(() => {
    if(timeLeft%5==0){
      console.log(timeLeft);
       currentTextArray.current.push(getSpeed());
      console.log("this is progress datas  "+timeLeft+"  in  "+currentTextArray.current);
    }
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }, [timeLeft]);

  return (
    <div
      className={`min-h-screen flex items-center justify-center flex-col ${darkMode ? 'bg-gradient-to-br from-black to-blue-900' : 'bg-gradient-to-br from-blue-300 to-white'} gap-y-4`}
    >
      <h2 className="text-4xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-black">
        Typing Speed Test
      </h2>

      {!userBit && (
        <p className="text-xl font-semibold text-gray-400">
         
          <Typewriter className="typewriter-effect"
        words={[
          'press any key to start',
         
        ]}
        loop
        cursor
        cursorStyle="  |"
        typeSpeed={70}
        deleteSpeed={50}
        delaySpeed={1000}

      />
        </p>
      )}

{isTyping && (
  <div className="space-y-3">
    <p className="text-2xl font-bold text-yellow-500">Time Left: {displayTime()}</p>

    <div
      ref={textContainerRef}
      className="typing-text-container m-6 max-w-[900px] shadow-lg text-3xl font-semibold text-gray-500 bg-opacity-40 p-10 bg-gradient-to-r rounded-lg overflow-hidden min-h-[200px]" // Replace `overflow-y-auto` with `overflow-hidden`
      onWheel={(e) => {
        // Stop default scrolling behavior
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {currentText.split('').map((char, idx) => (
        <span
          key={idx}
          className={
            idx === inputText.length
              ? 'text-yellow-500 bg-yellow-200 rounded-sm' // Pointer at current character
              : idx < inputText.length
              ? inputText[idx] === char
                ? 'text-green-500'
                : 'text-red-500'
              : ''
          }
          ref={idx === inputText.length ? activeCharRef : null} // Reference for the current character
        >
          {char}
        </span>
      ))}
    </div>
  </div>
)}

      {showResults && (
        <ResultsPage
          darkMode={darkMode}
          speed={getSpeed()}
          points={resultData.points}
          inputText={inputText}
          currentTextArray={currentTextArray.current}
          currentText={currentText}
          accuracy={Math.ceil((correctArray.length*100)/(incorrectArray.length+correctArray.length))}
          progressData={currentTextArray.current}
          mistakes={countMistakes()}
        />
      )}

      {(isTyping || showResults) && (
        <div
          onClick={restartTyping}
          className="flex w-[40px] h-[40px] text-center justify-center p-3  items-center  bg-blue-500 text-white font-bold text-xl rounded-lg shadow-2xl  hover:shadow-4xl hover:bg-red-600 transition-all duration-300 cursor-pointer mt-6"
        >
          <MdOutlineRestartAlt className="height-[20px]" />
     
        </div>
      )}
    </div>
  );
};

export default TypingPage;
