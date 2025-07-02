import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

// Loader Component
const Loader = () => (
  <div className="loader mx-auto"></div>
);

const OtpPage = () => {
  const location = useLocation();
  const {login}=useAuth();
  const email = location.state;
  const navigator=useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(120); // 2 minutes (120 seconds)
  const [isTimerExpired, setIsTimerExpired] = useState(false);
  const [isOtpResent, setIsOtpResent] = useState(false);

  // Start the countdown timer when the component mounts

  const otpValidation =async ()=>{
    let Otp;
    // console.log("data to otp"+email,"jdioehjiof",otp.join(""));
    try{
          Otp = await axios.post(
            'https://foodappbackend-chw3.onrender.com/api/eVerify/verify-otp',
            {
              
              "email": email,
              "otp":otp.join("")
              
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                api_key: 'f2d9c3e5b28347763fcb57db43a24bca',
              },
            }
          );
          
          
          if (!Otp.ok) {
         
         console.log("Error")
         throw new Error("not valid")
         }
         console.log("otp responce"+Otp);
         localStorage.setItem("email", email);
         login();
         navigator("/")
        }
              catch(err) {
                console.error('Error:', err.messsage);
              
                setServerError('Network error. Please try again later.');
              }
              finally{
                setLoading(false)
              }
  }
  


  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(countdown);
            setIsTimerExpired(true); // Disable inputs when timer expires
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(countdown); // Clean up on unmount
    }
  }, [timer]);

  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? `0${secs}` : secs}`;
  };



  const handleKeyDown = (e, index) => {
 let value=e.key;
 
    if(value>='0'&&value<='9') {
let i=0;
if(otp[index]!='')
{
  otp[index] =value;

}
while(otp[i]&&i<=index){
  i++;
}
index=i;
if(index<=5){

  const newOtp = [...otp];
  newOtp[index] = value;
  setOtp(newOtp);
  
}
  // Automatically move to the next input
      if (index < 5) {
        const nextInput = document.getElementById(`otp-input-${index + 1}`);
        if (nextInput) nextInput.focus();
      
      }
    }


 

if(e.key === 'Backspace'&&otp[index+1]!=''&&index<5)
{
  let i=index;
  while(i<5&&(!!otp[i+1])){
    i++;
  }
   if(i<5){
    document.getElementById(`otp-input-${i}`).focus();
   }
   return;
}

     
    if (e.key === 'Backspace' && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      const newOtp = [...otp];
      newOtp[index] = ''; // Clear current field
      setOtp(newOtp);
      prevInput.focus();
    }
    if (e.key === 'Backspace' && index == 0) {
      const prevInput = document.getElementById(`otp-input-${index}`);
      const newOtp = [...otp];
      newOtp[index] = ''; // Clear current field
      setOtp(newOtp);
      prevInput.focus();
    }
    
    if (e.key === 'Enter' && index === 5) {
      handleSubmit(e); // Submit form when last input is entered
    }





  };
  
const validateForm =()=>{
  let x=otp.join('');
  if(x.length!=6)
    return false;
  else
  return true;
}

  const handleSubmit = async (e) => {
    e.preventDefault();
       
       if (!validateForm()) {
         (false); 
         return;
        }
        try{
        setLoading(true);
let rspp=await otpValidation();


if(rspp){ 
  navigator("/");
}
      }
      catch(err){
       console.error('Error:', err);
      }
      finally{
        setLoading(false);
      }
      }
 const otpFunction=async ()=>{
  
  let responseOtp;
  // console.log("Data to otp");
 
  try{
        responseOtp = await axios.post(
          'https://foodappbackend-chw3.onrender.com/api/eVerify/send-otp',
          {
            
            "email": email,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              api_key: 'f2d9c3e5b28347763fcb57db43a24bca',
            },
          }
        );
        
        
        if (!responseOtp.ok) {
          setServerError( 'An error occurred. Please try again.');}
          
          navigator("/otp",{ state: email });
          
          
          
        }
            catch(err) {
              console.error('Error:', err);
              setServerError('Network error. Please try again later.');
      
            }
            finally{
              setLoader(false)
              // setLoader(false)
            }
}



  const handleResendOtp = () => {
    setIsTimerExpired(false); // Enable inputs again
    setTimer(120); // Reset timer
    otpFunction();
    setOtp(['', '', '', '', '', '']); // Clear previous OTP
    setIsOtpResent(true); 


    setTimeout(() => {
     
      setIsOtpResent(false); // Reset the resend status after completion
    }, 1000); // Simulate a short delay for OTP resend
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-orange-900">
      <div className="p-6 md:p-8 lg:p-10 bg-gradient-to-br from-[#001F3F] to-[#000000] rounded-lg shadow-xl text-orange-400 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg space-y-6">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center">Verify OTP</h2>
        <p className="text-red-600">You have {formatTime(timer)} to verify your OTP.</p>

        {loading ? (
          <div className="w-full flex justify-center my-4">
            <Loader />
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="flex space-x-4 sm:space-x-5 w-full max-w-[100%] justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  value={digit}
                 onChange={()=>{}}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={`w-5 h-10 sm:w-10 sm:h-14 text-center bg-transparent border-2 border-orange-400 focus:outline-none focus:border-orange-600 text-white placeholder-gray-500 rounded-md ${
                    isTimerExpired ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  placeholder="0"
                  maxLength="1"
                  disabled={isTimerExpired} // Disable input if timer has expired
                />
              ))}
            </form>

            <button
              type="submit"
              onClick={handleSubmit}
              className={`md:ml-4 m-1 py-2 px-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300 ${
                isTimerExpired ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isTimerExpired} // Disable button if timer has expired
            >
              Verify
            </button>

            {isTimerExpired && (
              <button
              // onChange={()=>{}}
                onClick={handleResendOtp}
                className={`mt-4 py-2 px-4 bg-transparent border-2 border-orange-400 text-orange-400 rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-300 ${
                  isOtpResent ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isOtpResent} // Disable button if OTP is being resent
              >
                {isOtpResent ? 'Resending...' : 'Resend OTP'}
              </button>
            )}

            {isTimerExpired && (
              <p className="text-red-600 text-center mt-2">The OTP session has expired. You can resend a new OTP.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OtpPage;
