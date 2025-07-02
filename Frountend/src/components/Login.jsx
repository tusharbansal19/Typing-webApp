import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Loader.css';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../features/user/userSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, accessToken } = useSelector((state) => state.user);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [showPopup, setShowPopup] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      setSuccessMsg('Login successful! Redirecting...');
      setTimeout(() => {
        setSuccessMsg('');
        navigate('/');
      }, 1200);
    }
  }, [isAuthenticated, accessToken, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) setShowPopup(true);
  }, [error]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateForm = () => {
    let valid = true;
    let newErrors = { email: '', password: '' };
    if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
      valid = false;
    }
    if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowPopup(false);
    setSuccessMsg('');
    if (!validateForm()) return;
    await dispatch(loginUser({ email, password }));
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-[url('/Images/362445.jpg')]`}>
      <div className={`p-6 md:p-8 lg:p-10 rounded-lg glass-effect shadow-xl w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg space-y-6 backdrop-blur-lg bg-opacity-20`}>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-black">
          Login
        </h2>
        {showPopup && error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-2 text-center">
            {error}
            <button className="absolute top-0 right-0 px-2 py-1" onClick={() => { setShowPopup(false); dispatch(clearError()); }}>x</button>
          </div>
        )}
        {successMsg && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-2 text-center">
            {successMsg}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {loading ? (
            <div className="w-full my-20 flex justify-center items-center">
              <div className="loader mx-auto"></div>
            </div>
          ) : (
            <>
              {/* Email Input */}
              <div className="relative">
                <input
                  type="text"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors({ ...errors, email: '' });
                  }}
                  className={`w-full bg-transparent text-white border-b-2 py-2 px-4 outline-none ${errors.email ? 'border-red-500' : 'border-white'} focus:border-white text-[1.5rem] py-2 text-blue-700 transition-all duration-300`}
                  required
                />
                <label htmlFor="email" className={`absolute left-4 top-0 transition-all duration-300 text-lg text-white ${email && '-top-4 text-xs'}`}>
                  Email
                </label>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              {/* Password Input */}
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors({ ...errors, password: '' });
                  }}
                  className={`w-full bg-transparent text-white border-b-2 py-2 px-4 outline-none ${errors.password ? 'border-red-500' : 'border-white'} focus:border-white text-[1.5rem] py-2 text-blue-700 transition-all duration-300`}
                  required
                />
                <label htmlFor="password" className={`absolute left-4 top-0 transition-all duration-300 text-lg text-white ${password && '-top-4 text-xs'}`}>
                  Password
                </label>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>
              {/* Forgot Password Link */}
              <div className="text-right mb-2">
                <Link to="/forgot-password" className="text-blue-400 underline text-sm hover:text-blue-600">Forgot password?</Link>
              </div>
              {/* Sign Up Link */}
              <div className='text-white'>Don't have an account? <Link className='text-red-700 underline' to="/signup">Sign Up</Link></div>
              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-black text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                Login
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
