import React, { createContext, useContext, useState } from 'react';

const MatchContext = createContext();

export const useMatch = () => useContext(MatchContext);

export const MatchProvider = ({ children }) => {
  const [match, setMatch] = useState({
    roomName: '',
    participants: [],
    mode: 'multiplayer',
    timeLimit: 60,
    wordList: [],
    startedAt: null,
    endedAt: null,
    isStarted: false,
    winnerId: null,
  });

  return (
    <MatchContext.Provider value={{ match, setMatch }}>
      {children}
    </MatchContext.Provider>
  );
}; 