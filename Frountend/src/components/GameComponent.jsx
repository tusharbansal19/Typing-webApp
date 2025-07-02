import React, { useState, useEffect, useRef, useCallback } from "react";
import { MdOutlineRestartAlt } from "react-icons/md";
import ResultsPage from "./ResultPage";
import { Typewriter } from "react-simple-typewriter";
import { useLocation } from "react-router-dom";
import { useSocket } from "../Context/Socket";
import ShowMember from "./ShowMember";
import Rankings from "./RankingComponent";
import AtlastResultsPage from "./AtlastResultsPage";
// import AtlastResultsPage from './Atlastresultpage';

const GroupComponent = ({ darkMode }) => {
  const [rankingList, setranklist] = useState([]);
  const location = useLocation();
  const { roomName } = location.state || "";
  const [countdown, setCountdown] = useState(null);
  const { socket } = useSocket();
  const [currentText, setCurrentText] = useState("");
  const [inputText, setInputText] = useState("");
  const [timeLeft, setTimeLeft] = useState(30); // 60 seconds timer
  const [isTyping, setIsTyping] = useState(false);
  const [userBit, setUserBit] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const timerRef = useRef();
  const [ptr, setptr] = useState(0);

  const resultData = useRef({
    points: 45,
  });
  let activeCharRef = useRef(null);
  let textContainerRef = useRef(null);

  useEffect(() => {
    if (activeCharRef.current) {
      activeCharRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [inputText]);

  const textArray = [
    "In the modern era of technological advancement, the digital landscape continues to reshape how we interact, communicate, and conduct business. The rapid integration of artificial intelligence, machine learning, and blockchain technology has transformed industries by streamlining operations and enhancing productivity. These technologies offer immense potential in automating mundane tasks, analyzing complex datasets, and fostering innovation across various sectors. For instance, artificial intelligence is redefining healthcare through predictive diagnostics, while blockchain is securing financial transactions with unmatched transparency and security. However, the widespread adoption of these technologies raises concerns about ethical implications, such as data privacy, algorithmic bias, and the displacement of jobs due to automation. Balancing technological progress with ethical considerations remains a critical challenge as society navigates this digital revolution. Policymakers, businesses, and individuals must collaborate to create frameworks that ensure responsible and equitable implementation.",
  ];

  const startTyping = async () => {
    if (!isTyping) {
      setptr(0);
      setInputText("");

      setIsTyping(true);
      setTimeLeft(30); // Reset to 60 seconds
      await setCurrentText(
        textArray[Math.floor(Math.random() * textArray.length)]
      );

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsTyping(false);
            setUserBit(true);
            endMatch();
            setShowResults(true);
            return 0;
          } else {
            return prev - 1;
          }
        });
      }, 1000);
    }
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      event.preventDefault();
      if (inputText.length === currentText.length) {
        return;
      }
      if (!isTyping) return;
      if (ptr >= currentText.length) {
        clearInterval(timerRef.current);
        setIsTyping(false);
        setUserBit(false);
        setShowResults(true);
      }
      if (ptr < 0) return;
      if (event.key === " ") {
        let s = "",
          i = ptr,
          len = currentText.length;
        while (currentText[i] != " " && i < len) {
          s = s + "&";
          i++;
        }

        s = s + " ";
        i++;
        setptr(i);
        setInputText((pre) => pre + s);
        console.log("input  : " + inputText);
      } else if (event.key === "Backspace" && inputText[ptr - 1] !== " ") {
        setInputText((prevText) => prevText.slice(0, -1));
        setptr((prv) => prv - 1);
      } else if (/^[a-zA-Z\s]$/.test(event.key) || event.key == ".") {
        const updatedText = inputText + event.key;
        setInputText(updatedText);
        setptr((prv) => prv + 1);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [inputText, currentText, isTyping, ptr]);

  const displayTime = useCallback(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }, [timeLeft]);

  const endMatch = useCallback(() => {
    setShowResults(true);
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("showRanks", (rankedPlayers) => {
        console.log("rank paklyer ", rankedPlayers);
        setranklist(rankedPlayers);
      });

      socket.on("readyStatus", ({ readyCount, totalPlayers }) => {
        setReadyCount(readyCount);
        setAllReady(readyCount === totalPlayers);
      });

      socket.on("startMatch", () => {
        matchStartFun();
      });

      socket.on("updateGroupMembers", (members) => setGroupMembers(members));
      return () => {
        socket.off("updateGroupMembers");
        socket.off("readyStatus");
      };
    }
  }, [socket]);

  const matchStartFun = () => {
    let counter = 3;
    setCountdown(counter);
    const countdownInterval = setInterval(() => {
      counter -= 1;
      setCountdown(counter);
      if (counter === 0) {
        clearInterval(countdownInterval);
        setCountdown(null);
        if (!userBit) {
          startTyping();
          setUserBit(true);
          setIsTyping(true);
        }
      }
    }, 1000);
  };

  return (
    <div
      className={`flex flex-col lg:flex-row min-h-screen bg-gradient-to-b p-6 rounded-lg ${
        darkMode
          ? "bg-gradient-to-br from-black to-blue-900"
          : "bg-gradient-to-br from-blue-200 to-white"
      } shadow-lg`}
    >
      {/* Main Typing Section */}
      <div
        className={`w-full min-w-[80%] max-h-[60%] mt-12  flex items-center justify-start pt-12 flex-col ${
          darkMode
            ? "bg-gradient-to-br from-black to-blue-900"
            : "bg-gradient-to-br from-blue-200 to-white"
        } gap-y-4`}
      >
        <h2 className="text-4xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-black">
          Typing Speed Test
        </h2>
        {!isTyping && (
          <div className="flex space-x-4 mt-6">
            <Typewriter
              className="typewriter-effect"
              words={["{    waiting for all to Ready"]}
              loop
              cursor
              cursorStyle="}"
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={1000}
            />
          </div>
        )}
        {!isTyping && (
          <div className="relative w-full  flex justify-center items-center">
            <div className=" relative ">
              {countdown !== null && (
                <p className=" absolute text-[4rem] font-bold text-yellow-500">
                  {countdown}
                </p>
              )}
            </div>
          </div>
        )}

        {isTyping && (
          <div className="space-y-3">
            <p className="text-2xl font-bold text-yellow-500">
              Time Left: {displayTime()}
            </p>

            <div
              ref={textContainerRef}
              className="typing-text-container m-6 max-w-[900px] shadow-lg text-3xl font-semibold text-gray-500 bg-opacity-40 p-10 bg-gradient-to-r rounded-lg  min-h-[200px] leading-[1.8]" // Replace `
              onWheel={(e) => {
                // Stop default scrolling behavior
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              {currentText.split("").map((char, idx) => (
                <span
                  key={idx}
                  className={
                    idx === inputText.length
                      ? "text-yellow-500 bg-yellow-200 rounded-sm" // Pointer at current character
                      : idx < inputText.length
                      ? inputText[idx] === char
                        ? "text-green-500"
                        : "text-red-500"
                      : ""
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
          <>
            (
            <Rankings rankings={rankingList} darkMode={darkMode} />
            <AtlastResultsPage
              roomName={roomName}
              darkMode={darkMode}
              points={resultData.points}
              inputText={inputText}
              currentText={currentText}
            />
            )
          </>
        )}
      </div>

      {/* Right Sidebar */}
      <ShowMember darkMode={darkMode} roomName={roomName} />
    </div>
  );
};

export default GroupComponent;
