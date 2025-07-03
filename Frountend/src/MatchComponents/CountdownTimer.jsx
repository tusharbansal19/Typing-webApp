import React from 'react';
import { useSelector } from 'react-redux';

const CountdownTimer = React.memo(() => {
  const countdown = useSelector((state) => state.match.countdown);
  if (countdown === null) return null;
  return (
    <div className="relative w-full flex justify-center items-center">
      <div className="relative">
        <p className="absolute text-[4rem] font-bold text-yellow-500">{countdown}</p>
      </div>
    </div>
  );
});

export default CountdownTimer; 