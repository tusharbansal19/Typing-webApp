import React from "react";
import { FaGithub, FaTwitter, FaInstagram, FaYoutube, FaDiscord } from "react-icons/fa";
import "../css//button.css";

const AboutCard = ({name}) => {
  return (
    <div className="card-wrapper flex flex-col items-center xl:flex-row bg-gradient-to-r from-black  to-blue-950 text-white p-4 rounded-lg max-w-full lg:max-w-lg shadow-lg transform transition-all duration-500">
      <div className="flex flex-col items-center md:w-1/3">
        <div className="w-20 h-20 bg-white rounded-lg mb-2" />
        <span className="font-bold text-lg text-center mb-2 w-full ">{name}</span>
      </div>
      <div className="flex flex-col justify-between md:w-2/3">
        <p className="text-sm w-full  md:text-left mb-4">
          I’m Walter, a multidisciplinary designer who focuses on telling my
          clients' stories visually, through enjoyable and meaningful
          experiences. I specialize in responsive websites and functional user
          interfaces.
        </p>
        <div className="flex justify-center md:justify-start gap-4 ml-0 mb-4">
          <a href="https://github.com" className="text-white hover:text-gray-400 transition-colors">
            <FaGithub size={18} />
          </a>
          <a href="https://twitter.com" className="text-white hover:text-blue-400 transition-colors">
            <FaTwitter size={18} />
          </a>
          <a href="https://instagram.com" className="text-white hover:text-pink-500 transition-colors">
            <FaInstagram size={18} />
          </a>
          <a href="https://youtube.com" className="text-white hover:text-red-500 transition-colors">
            <FaYoutube size={18} />
          </a>
          <a href="https://discord.com" className="text-white hover:text-indigo-500 transition-colors">
            <FaDiscord size={18} />
          </a>
        </div>
     
      </div>
    </div>
  );
};

export default AboutCard;
