import React, { useState, useEffect, useRef, useCallback } from "react";
import { MdOutlineRestartAlt } from "react-icons/md";

import { Typewriter } from "react-simple-typewriter";
import { useLocation } from "react-router-dom";
import { useSocket } from "../Context/Socket";
import ShowMember from "./ShowMember";
import Rankings from "./RankingComponent";
import AtlastResultsPage from "./AtlastResultsPage";
import { useAuth } from "../Context/AuthContext";
// import AtlastResultsPage from './Atlastresultpage';
import { useSelector, useDispatch } from 'react-redux';
import {
  setRoomName,
  setParticipants,
  setRankings,
  setCountdown,
  setCurrentText,
  setInputText,
  setTimeLeft,
  setIsTyping,
  setUserBit,
  setShowResults,
  setPtr,
  setResultData,
  resetMatch,
} from '../features/matchSlice';
import CountdownTimer from './CountdownTimer';
import TypingArea from './TypingArea';
import ResultsDisplay from './ResultsDisplay';

const GroupComponent = ({ darkMode }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { socket } = useSocket();
  const {
    roomName,
    participants,
    rankings,
    countdown,
    currentText,
    inputText,
    timeLeft,
    isTyping,
    userBit,
    showResults,
    ptr,
    resultData,
  } = useSelector((state) => state.match);
  const timerRef = useRef();
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

  const displayTime = useCallback(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }, [timeLeft]);

  const startTyping = useCallback(async () => {
    if (!isTyping) {
      dispatch(setPtr(0));
      dispatch(setInputText(""));
      dispatch(setIsTyping(true));
      dispatch(setTimeLeft(30));
      await dispatch(setCurrentText(textArray[Math.floor(Math.random() * textArray.length)]));
      if (!timerRef.current) {
        timerRef.current = setInterval(() => {
          dispatch(setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              timerRef.current = null;
              dispatch(setIsTyping(false));
              dispatch(setUserBit(true));
              dispatch(setShowResults(true));
              return 0;
            } else {
              return prev - 1;
            }
          }));
        }, 1000);
      }
    }
  }, [isTyping, dispatch]);

  const matchStartFun = useCallback(() => {
    let counter = 3;
    dispatch(setCountdown(counter));
    const countdownInterval = setInterval(() => {
      counter -= 1;
      dispatch(setCountdown(counter));
      if (counter === 0) {
        clearInterval(countdownInterval);
        dispatch(setCountdown(null));
        if (!userBit) {
          startTyping();
          dispatch(setUserBit(true));
          dispatch(setIsTyping(true));
        }
      }
    }, 1000);
  }, [dispatch, userBit, startTyping]);

  useEffect(() => {
    if (socket) {
      socket.on("all participants", ({ participants, roomName }) => {
        dispatch(setParticipants(participants));
      
        dispatch(setRoomName(roomName));
      });
    }
    return () => {
      if (socket) {
        socket.off("all participants");
      }
    };
  }, [socket, dispatch]);

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
        <CountdownTimer />
        {isTyping && (
          <>
            <p className="text-2xl font-bold text-yellow-500">
              Time Left: {displayTime()}
            </p>
            <TypingArea />
          </>
        )}
        <ResultsDisplay darkMode={darkMode} />
      </div>

      {/* Right Sidebar */}
      <ShowMember darkMode={darkMode} roomName={roomName} />
    </div>
  );
};

export default GroupComponent;