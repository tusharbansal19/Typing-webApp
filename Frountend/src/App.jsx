import { useState, useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import AboutUsPage from './components/AboutUs';
import ContactUsPage from './components/ContactsUs';
import UserDashboard from './components/DashBoard';
import Home from './components/Home';
import LoginPage from './components/Login';
import OtpPage from './components/Otp';
import SignUpPage from './components/Signin';
import { AuthProvider } from './Context/AuthContext';
import ComppProtect from './components/ProtectedRoute';
import ProtectLogin from './components/Protectroutes';
import Navbar from './components/navbar';
// import TypingPage from './MatchComponents/MenuSections';
import ContestSection from './components/Contest';
import LearnPage from './components/Learn';
import { SocketProvider } from './Context/Socket';
import HostPage from './components/Hostpage';
import PageLoader from './components/PageLoader';
import { useSelector, useDispatch } from 'react-redux';
import { checkAuth } from './features/user/userSlice';
import TypingInterface from './SimpleTyping/typingComponent';
import MatchInterface from './ComplexTyping.jsx/MatchInterface';
import { MatchProvider } from './Context/MatchContext';
import MainLayout from './components/MainLayout';


function App() {
  const [darkMode, setDarkMode] = useState(true);
  const dispatch = useDispatch();
  const isAuthLoading = useSelector((state) => state.user.isAuthLoading);

  // Persist login on reload
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isAuthLoading) {
    return <PageLoader />;
  }

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth pages: no navbar/footer */}
          <Route path="/signup" element={<ProtectLogin><SignUpPage /></ProtectLogin>} />
          <Route path="/login" element={<ProtectLogin><LoginPage /></ProtectLogin>} />
          <Route path="/otp" element={<ProtectLogin><OtpPage /></ProtectLogin>} />

          {/* All other pages: with navbar/footer */}
          <Route path='/'  element={<MainLayout darkMode={darkMode}  setDarkMode={setDarkMode} />}>
            <Route path="/" element={<Home darkMode={darkMode}/>} />
            <Route path="/typing" element={<TypingInterface darkMode={darkMode} setDarkMode={setDarkMode} />} />
            <Route path="/host" element={<ComppProtect><HostPage darkMode={darkMode} setDarkMode={setDarkMode} /></ComppProtect>} />
            <Route path="/dashboard" element={<ComppProtect><UserDashboard darkMode={darkMode} /></ComppProtect>} />
            <Route path="/match/:roomName" element={<ComppProtect><MatchProvider><SocketProvider><MatchInterface darkMode={darkMode} setDarkMode={setDarkMode} /></SocketProvider></MatchProvider></ComppProtect>} />
            <Route path="/contact" element={<ContactUsPage darkMode={darkMode} />} />
            <Route path="/about" element={<AboutUsPage darkMode={darkMode}/>} />
            <Route path="/contest" element={<ContestSection darkMode={darkMode} />} />
            <Route path="/learn" element={<LearnPage darkMode={darkMode}/>} />
            <Route path="/*" element={<h1>not reachable</h1>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
