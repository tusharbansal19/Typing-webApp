import React from 'react';
import { useSelector } from 'react-redux';
import Rankings from './RankingComponent';
import AtlastResultsPage from './AtlastResultsPage';

const ResultsDisplay = React.memo(({ darkMode }) => {
  const showResults = useSelector((state) => state.match.showResults);
  if (!showResults) return null;
  return (
    <>
      <Rankings darkMode={darkMode} />
      <AtlastResultsPage darkMode={darkMode} />
    </>
  );
});

export default ResultsDisplay; 