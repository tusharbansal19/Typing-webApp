
      {/* <div className="card w-[80vw] bg-[url('')] cover h-[70vh] md:w-[20vw] md:h-[40vh] lg:w-[40vw]  relative lg:h-[55vh]"> */}
      import React from 'react';
import styled from 'styled-components';

const ChampCard = () => {
  return (
    <StyledWrapper>
      <div className="results-summary-container">
        <div className="confetti">
          <div className="confetti-piece" />
          <div className="confetti-piece" />
          <div className="confetti-piece" />
          <div className="confetti-piece" />
          <div className="confetti-piece" />
          <div className="confetti-piece" />
          <div className="confetti-piece" />
          <div className="confetti-piece" />
          <div className="confetti-piece" />
          <div className="confetti-piece" />
          <div className="confetti-piece" />
          <div className="confetti-piece" />
          <div className="confetti-piece" />
          <div className="confetti-piece" />
          <div className="confetti-piece" />
          <div className="confetti-piece" />
          <div className="confetti-piece" />
          <div className="confetti-piece" />
          <div className="confetti-piece" />
        </div>
        <div className="results-summary-container__result">
          <div className="heading-tertiary">World Fastest Typist</div>
          <div className="result-box">
           <img src=".\public\Images\champ.jpg" alt="" />
          </div>
          <div className="result-text-box">
            <div className="heading-secondary flex text-[40px] w-full ">Barbara Blackburn</div>
            <p className="paragraph">
            She holds the official record for typing the fastest on a computer, with a top typing speed of 212 words per minute (wpm).
            </p>
          </div>
          <div className="summary__cta">
            <a href="https://www.bing.com/search?q=barbara+blackburn&filters=ufn%3a%22Barbara+Blackburn+(typist)%22+sid%3a%224007ede8-719a-4256-83cc-f7612e0e8d7b%22&asbe=AS&qs=MB&pq=barbara+black&sc=10-13&cvid=E3308847008941438B30EAA7BF2D408B&FORM=QBRE&sp=1&ghc=1&lq=0">
            <button className="btn text-[20px] p-0 h-[40px] w-[100px] ">Know more
            </button>
            </a>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .results-summary-container {
    font-family: "Hanken Grotesk", sans-serif;
    display: flex;
    width: 400px;
    border-radius: 30px;
    box-shadow: 10px 20px 20px rgba(120, 87, 255, 0.3);
    backface-visibility: hidden;
  }

  .heading-primary,
  .heading-secondary,
  .heading-tertiary {
    color: #ffffff;
    text-transform: capitalize;
    margin-bottom: 10px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .heading-primary {
    font-size: 36px;
    font-weight: 600;
    background-image: linear-gradient(to right, #f7bb97, #dd5e89);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    transform: scale(1.6);
  }

  .heading-secondary {
    font-size: 24px;
    font-weight: 600;
    margin-top: 20px;
    letter-spacing: 2px;
  }

  .heading-tertiary {
    font-size: 20px;
    font-weight: 500;
    color: hsl(221, 100%, 96%);
  }

  .paragraph {
    font-size: 17px;
    line-height: 1.4;
    color: hsl(221, 100%, 96%);
  }

  .paragraph-text-box {
    width: 100%;
  }

  .text-center {
    text-align: center;
  }

  .margin-1 {
    margin-bottom: 10px;
  }

  .results-summary-container__result {
    width: 100%;
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
    justify-content: center;
    padding: 20px;
    border-radius: 30px;
    background-image: linear-gradient(to bottom, #734b6d, #42275a);
    animation: gradient 9s infinite alternate linear;
    .result-box {
    width: 160px;
    height: 160px;
    border-radius: 50%;
    background-image: linear-gradient(-45deg, #ef629f, #42275a);
    background-color: #56ab2f;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    animation: gradient 9s linear infinite;
  }

  .result {
    margin-top: -8px;
    font-size: 16px;
    font-weight: 400;
    color: hsl(241, 100%, 89%);
  }
  }

  .btn {
    width: 240px;
    padding: 10px;
    color: #ffffff;
    background-image: linear-gradient(to right, #aa076b, #61045f);
    border: none;
    border-radius: 100px;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 3px;
    font-weight: 500;
    cursor: pointer;
    margin: 20px 0 2px 0;
    transition: all 0.3s;
  }

  .btn:hover {
    transform: translateY(5px);
    background-image: linear-gradient(to left, #aa076b, #61045f);
  }

  @keyframes gradient {
    0% {
      background-position: 0% 50%;
      background-image: linear-gradient(-45deg, #ef629f, #42275a);
    }

    50% {
      background-position: 100% 50%;
      background-image: linear-gradient(to bottom, #aa076b, #61045f);
    }

    100% {
      background-position: 0% 50%;
      background-image: linear-gradient(to top, #ef629f, #42275a);
    }
  }

  .confetti {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    width: 300px;
    height: 60%;
    overflow: hidden;
    z-index: 1000;
  }

  .confetti-piece {
    position: absolute;
    width: 10px;
    height: 20px;
    background-color: hsl(39, 100%, 56%);
    top: 0;
    opacity: 0;
    animation: makeItRain 3000ms infinite linear;
  }

  .confetti-piece:nth-child(1) {
    left: 7%;
    transform: rotate(-10deg);
    animation-delay: 182ms;
    animation-duration: 2000ms;
  }

  .confetti-piece:nth-child(2) {
    left: 14%;
    transform: rotate(20deg);
    animation-delay: 161ms;
    animation-duration: 2076ms;
  }

  .confetti-piece:nth-child(3) {
    left: 21%;
    transform: rotate(-51deg);
    animation-delay: 481ms;
    animation-duration: 2103ms;
  }

  .confetti-piece:nth-child(4) {
    left: 28%;
    transform: rotate(61deg);
    animation-delay: 334ms;
    animation-duration: 1008ms;
  }

  .confetti-piece:nth-child(5) {
    left: 35%;
    transform: rotate(-52deg);
    animation-delay: 302ms;
    animation-duration: 1776ms;
  }

  .confetti-piece:nth-child(6) {
    left: 42%;
    transform: rotate(38deg);
    animation-delay: 180ms;
    animation-duration: 1168ms;
  }

  .confetti-piece:nth-child(7) {
    left: 49%;
    transform: rotate(11deg);
    animation-delay: 395ms;
    animation-duration: 1200ms;
  }

  .confetti-piece:nth-child(8) {
    left: 56%;
    transform: rotate(49deg);
    animation-delay: 14ms;
    animation-duration: 1887ms;
  }

  .confetti-piece:nth-child(9) {
    left: 63%;
    transform: rotate(-72deg);
    animation-delay: 149ms;
    animation-duration: 1805ms;
  }

  .confetti-piece:nth-child(10) {
    left: 70%;
    transform: rotate(10deg);
    animation-delay: 351ms;
    animation-duration: 2059ms;
  }

  .confetti-piece:nth-child(11) {
    left: 77%;
    transform: rotate(4deg);
    animation-delay: 307ms;
    animation-duration: 1132ms;
  }

  .confetti-piece:nth-child(12) {
    left: 84%;
    transform: rotate(42deg);
    animation-delay: 464ms;
    animation-duration: 1776ms;
  }

  .confetti-piece:nth-child(13) {
    left: 91%;
    transform: rotate(-72deg);
    animation-delay: 429ms;
    animation-duration: 1818ms;
  }

  .confetti-piece:nth-child(14) {
    left: 94%;
    transform: rotate(-72deg);
    animation-delay: 429ms;
    animation-duration: 818ms;
  }

  .confetti-piece:nth-child(15) {
    left: 96%;
    transform: rotate(-72deg);
    animation-delay: 429ms;
    animation-duration: 2818ms;
  }

  .confetti-piece:nth-child(16) {
    left: 98%;
    transform: rotate(-72deg);
    animation-delay: 429ms;
    animation-duration: 2818ms;
  }

  .confetti-piece:nth-child(17) {
    left: 50%;
    transform: rotate(-72deg);
    animation-delay: 429ms;
    animation-duration: 2818ms;
  }

  .confetti-piece:nth-child(18) {
    left: 60%;
    transform: rotate(-72deg);
    animation-delay: 429ms;
    animation-duration: 1818ms;
  }

  .confetti-piece:nth-child(odd) {
    background-color: hsl(0, 100%, 67%);
  }

  .confetti-piece:nth-child(even) {
    z-index: 1;
  }

  .confetti-piece:nth-child(4n) {
    width: 6px;
    height: 14px;
    animation-duration: 4000ms;
    background-color: #c33764;
  }

  .confetti-piece:nth-child(5n) {
    width: 3px;
    height: 10px;
    animation-duration: 4000ms;
    background-color: #b06ab3;
  }

  .confetti-piece:nth-child(3n) {
    width: 4px;
    height: 12px;
    animation-duration: 2500ms;
    animation-delay: 3000ms;
    background-color: #dd2476;
  }

  .confetti-piece:nth-child(3n-7) {
    background-color: hsl(166, 100%, 37%);
  }

  @keyframes makeItRain {
    from {
      opacity: 0;
    }

    50% {
      opacity: 1;
    }

    to {
      transform: translateY(250px);
    }
  }`;

export default ChampCard;
