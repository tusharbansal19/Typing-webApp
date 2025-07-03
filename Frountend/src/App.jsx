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


function App() {
  const [darkMode, setDarkMode] = useState(false);
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
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <Routes>
          <Route path="/signup" element={<ProtectLogin>
            <SignUpPage />
          </ProtectLogin>
            } />
          <Route path="/login" element={<ProtectLogin>
            <LoginPage />
          </ProtectLogin>
            } />
          <Route path='/otp' element={<ProtectLogin>
            <OtpPage />
          </ProtectLogin>
            } />
          <Route path="/" element={<ComppProtect>
            <Home darkMode={darkMode}/>
          </ComppProtect>
            } />
          <Route path="/typing" element={<ComppProtect>
            <TypingInterface darkMode={darkMode} setDarkMode={setDarkMode} />
          </ComppProtect>
            } />
          <Route path="/host" element={
            <ComppProtect>
              <SocketProvider>
                <HostPage darkMode={darkMode} setDarkMode={setDarkMode} />
              </SocketProvider>
            </ComppProtect>
          } />
          <Route path='/dashboard' element={<ComppProtect>
            <UserDashboard darkMode={darkMode} />
          </ComppProtect>
            } />
            
          <Route path='/match/:roomName' element={<ComppProtect>
            <MatchProvider>
            <SocketProvider>
              <MatchInterface darkMode={darkMode} setDarkMode={setDarkMode} />
            </SocketProvider>
            </MatchProvider>
          </ComppProtect>
            } />
          <Route path='/contact' element={<ComppProtect>
            <ContactUsPage  darkMode={darkMode} />
          </ComppProtect>
            } />
          <Route path ="/about" element={<ComppProtect>
            <AboutUsPage darkMode={darkMode}/>
          </ComppProtect>
            } />
          <Route path='/contest' element={<ComppProtect>
            <ContestSection darkMode={darkMode} />
          </ComppProtect>
            } />
          <Route path='/learn' element={<ComppProtect>
            <LearnPage darkMode={darkMode}/>
          </ComppProtect>
            }/>
          <Route path='/*' element={
            <h1>not reachable</h1>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
