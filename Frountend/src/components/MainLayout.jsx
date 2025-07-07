import React from "react";
import Navbar from "./navbar";
import { Outlet } from "react-router-dom";
// import Footer from "./Footer"; // Uncomment if you have a Footer

const MainLayout = ({ darkMode, setDarkMode }) => (
  <>
    <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
    <div className="mt-16">

    {<Outlet />}
    </div>
    {/* <Footer /> */}
  </>
);

export default MainLayout; 