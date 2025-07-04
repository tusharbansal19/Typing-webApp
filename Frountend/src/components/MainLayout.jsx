import React from "react";
import Navbar from "./navbar";
// import Footer from "./Footer"; // Uncomment if you have a Footer

const MainLayout = ({ children, darkMode, setDarkMode }) => (
  <>
    <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
    {children}
    {/* <Footer /> */}
  </>
);

export default MainLayout; 