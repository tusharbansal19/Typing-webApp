import React from "react";
import { FaEnvelope, FaFacebook, FaInstagram, FaMapMarkerAlt, FaPhoneAlt, FaTwitter } from 'react-icons/fa';
import "../backtoTop.css";
import { useNavigate } from "react-router-dom";

const Footer = ({  darkMode,scrollToTop, }) => {
  const navigator = useNavigate();

  return (
    <footer className={`min-h-screen bg-gradient-to-br ${darkMode ? 'to-blue-950  text-white from-black' : 'from-white to-blue-200'} flex items-center justify-center flex-col`}>
      <div className="w-full justify-center flex mb-7 items-center text-blue-500">
      <button  onClick={scrollToTop} className="self-center text-blue-900 bold hover:text-red-700 2"> GO to TOP</button>
      </div>
      <div className="container mx-auto px-6 md:flex md:justify-between md:items-start">
        {/* Company Info Section */}
        <div className="md:w-1/2">
          <h2 className="text-2xl font-bold text-blue-400 mb-6">Company Info</h2>
          <ul>
            <li className="flex items-center mb-4">
              <FaMapMarkerAlt className="text-blue-400 mr-3" />
              <span>Akgec Ghaziabad, Delhi, India</span>
            </li>
            <li className="flex items-center mb-4">
              <FaPhoneAlt className="text-blue-400 mr-3" />
              <span>+91 9719167540</span>
            </li>
            <li className="flex items-center mb-4">
              <FaEnvelope className="text-blue-400 mr-3" />
              <span>contact@hottestfood.com</span>
            </li>
          </ul>
        </div>

        {/* Follow Us Section */}
        <div className="md:w-1/2 mt-8 md:mt-0">
          <h2 className="text-2xl font-bold text-blue-400 mb-6">Follow Us</h2>
          <div className="flex">
            <a
              href="#"
              className={`flex items-center ${darkMode ? 'text-white' : 'text-gray-800'} hover:text-blue-400 mr-6`}
            >
              <FaInstagram className="text-blue-400 mr-3" />
              Instagram
            </a>
            <a
              href="#"
              className={`flex items-center ${darkMode ? 'text-white' : 'text-gray-800'} hover:text-blue-400 mr-6`}
            >
              <FaFacebook className="text-blue-400 mr-3" />
              Facebook
            </a>
            <a
              href="#"
              className={`flex items-center ${darkMode ? 'text-white' : 'text-gray-800'} hover:text-blue-400`}
            >
              <FaTwitter className="text-blue-400 mr-3" />
              Twitter
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="container mx-auto text-center mt-12">
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          &copy; {new Date().getFullYear()} Hottest Food. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
