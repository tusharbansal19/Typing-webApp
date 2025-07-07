import React, { useState, useEffect, useRef } from 'react';
import { Mail, Phone, MapPin, Send, User, MessageSquare, Shield, Github, Linkedin, Twitter, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const ContactUsPage = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [loader, setLoader] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState('success');
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});

  // Section refs for scroll motion
  const [headerRef, headerInView] = useInView(0.15);
  const [infoRef, infoInView] = useInView(0.15);
  const [formRef, formInView] = useInView(0.15);
  const [mapRef, mapInView] = useInView(0.15);
  const [socialRef, socialInView] = useInView(0.15);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setToastType('error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
    
    setLoader(true);

    try {
      // Simulate API call - Replace with actual API endpoint
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setToastType('success');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      setToastType('error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setLoader(false);
    }
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Animated Background Component
  const AnimatedBackground = () => (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-cyan-900/20" />
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"
             style={{
               top: '10%',
               left: '10%',
               animation: 'float 20s ease-in-out infinite alternate'
             }} />
        
        <div className="absolute w-80 h-80 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl"
             style={{
               bottom: '10%',
               right: '10%',
               animation: 'float 25s ease-in-out infinite alternate-reverse'
             }} />
      </div>
    </div>
  );

  const Toast = ({ type, message, onClose }) => (
    <div className={`fixed top-6 right-6 z-50 p-4 rounded-lg shadow-lg backdrop-blur-sm border transition-all duration-300 transform ${
      showToast ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    } ${type === 'success' 
      ? 'bg-green-500/20 border-green-500/30 text-green-400' 
      : 'bg-red-500/20 border-red-500/30 text-red-400'}`}>
      <div className="flex items-center gap-3">
        {type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
        <span className="font-medium">
          {type === 'success' ? 'Message sent successfully!' : 'Please fix the errors above'}
        </span>
      </div>
    </div>
  );

  const FloatingLabel = ({ label, error, children }) => (
    <div className="relative group">
      {children}
      <label className={`absolute left-4 transition-all duration-300 pointer-events-none ${
        children.props.value 
          ? 'top-2 text-xs text-purple-400' 
          : 'top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:top-2 group-focus-within:text-xs group-focus-within:text-purple-400'
      }`}>
        {label}
      </label>
      {error && (
        <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );

  // CircuitBackground with dual color support
  const CircuitBackground = ({ darkMode }) => (
    <div className="absolute inset-0 opacity-30 z-0 pointer-events-none">
      <svg width="100%" height="100%" viewBox="0 0 1000 1000" className="absolute inset-0">
        <defs>
          <pattern id="circuit-contact" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M10,10 L90,10 L90,90 L10,90 Z" fill="none" stroke={darkMode ? '#7dd3fc' : '#60a5fa'} strokeWidth="0.5" opacity="0.3"/>
            <circle cx="10" cy="10" r="2" fill={darkMode ? '#a78bfa' : '#60a5fa'} opacity="0.5"/>
            <circle cx="90" cy="10" r="2" fill={darkMode ? '#a78bfa' : '#60a5fa'} opacity="0.5"/>
            <circle cx="90" cy="90" r="2" fill={darkMode ? '#a78bfa' : '#60a5fa'} opacity="0.5"/>
            <circle cx="10" cy="90" r="2" fill={darkMode ? '#a78bfa' : '#60a5fa'} opacity="0.5"/>
            <path d="M30,30 L70,30 L70,70 L30,70 Z" fill="none" stroke={darkMode ? '#818cf8' : '#bae6fd'} strokeWidth="0.3" opacity="0.2"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuit-contact)"/>
      </svg>
    </div>
  );

  // useInView hook for scroll-in animation
  function useInView(threshold = 0.15) {
    const ref = useRef();
    const [inView, setInView] = useState(false);
    useEffect(() => {
      const observer = new window.IntersectionObserver(
        ([entry]) => setInView(entry.isIntersecting),
        { threshold }
      );
      if (ref.current) observer.observe(ref.current);
      return () => { if (ref.current) observer.unobserve(ref.current); };
    }, [threshold]);
    return [ref, inView];
  }

  return (
    <div className={`min-h-screen transition-all duration-500 relative overflow-hidden ${
      darkMode
        ? 'bg-gradient-to-br from-blue-950 via-black-900 to-gray-900'
        : 'bg-gradient-to-br from-blue-100 via-white to-blue-200'
    }`}>
      {/* Circuit Background */}
      <CircuitBackground darkMode={darkMode} />
      {/* Animated Background */}
      <AnimatedBackground />
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(20px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.3); }
          50% { box-shadow: 0 0 40px rgba(168, 85, 247, 0.6); }
        }
        .pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .translate-y-10 { transform: translateY(2.5rem); }
        .translate-y-0 { transform: translateY(0); }
        .opacity-0 { opacity: 0; }
        .opacity-100 { opacity: 1; }
      `}</style>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 z-40 p-3 rounded-full backdrop-blur-sm border transition-all duration-300 hover:scale-110 ${
          darkMode ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/50' : 'bg-white/50 border-gray-200 hover:bg-white/80'
        } shadow-lg hover:shadow-xl`}
      >
        {darkMode ? '🌙' : '☀️'}
      </button>

      {/* Toast Notification */}
      <Toast type={toastType} onClose={() => setShowToast(false)} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <header ref={headerRef} className={`text-center space-y-6 mb-16 transform transition-all duration-1000 ${
          headerInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
                Get In Touch
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-4">
              Ready to revolutionize your typing experience?
            </p>
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Join the TypeSpeed Championship community and let's build something amazing together.
            </p>
          </div>
          
          {/* Platform Description */}
          <div className={`max-w-4xl mx-auto p-8 rounded-2xl backdrop-blur-sm border ${
            darkMode ? 'bg-gray-800/30 border-gray-700/50' : 'bg-white/30 border-gray-200/50'
          } shadow-lg`}>
            <h2 className="text-2xl font-bold mb-4 text-purple-400">TypeSpeed Championship</h2>
            <p className={`text-lg leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Experience the future of typing competitions with our real-time multiplayer platform. 
              Built with React, Node.js, and Socket.IO for seamless performance and instant feedback.
            </p>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          
          {/* Contact Information */}
          <div ref={infoRef} className={`space-y-8 transition-all duration-1000 ${infoInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className={`p-8 rounded-2xl backdrop-blur-sm border ${
              darkMode ? 'bg-gray-800/30 border-gray-700/50' : 'bg-white/30 border-gray-200/50'
            } shadow-lg hover:shadow-xl transition-all duration-300`}>
              <h2 className="text-3xl font-bold mb-6 text-purple-400">Our Office</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-cyan-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Address</h3>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      AKGEC, Ghaziabad Delhi<br />
                      Meerut-Delhi Road
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-cyan-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <a href="mailto:FastFinger@akgec.ac.in" 
                       className="text-purple-400 hover:text-purple-300 transition-colors">
                      FastFinger@akgec.ac.in
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-cyan-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <a href="tel:+919719167540" 
                       className="text-purple-400 hover:text-purple-300 transition-colors">
                      +91 9719167540
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Shield className="w-6 h-6 text-cyan-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Business Hours</h3>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Mon - Fri: 9:00 AM - 6:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Founder Card */}
            <div className={`p-8 rounded-2xl backdrop-blur-sm border ${
              darkMode ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50' : 'bg-gradient-to-br from-white/50 to-gray-50/50 border-gray-200/50'
            } shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105`}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl">
                  TB
                </div>
                <div>
                  <h3 className="text-xl font-bold text-purple-400">Tushar Bansal</h3>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Founder & Full Stack Developer
                  </p>
                </div>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                "Building the future of real-time typing competitions with cutting-edge technology."
              </p>
              <div className="flex gap-3">
                <a href="#" className="p-2 rounded-full bg-purple-500/20 hover:bg-purple-500/30 transition-colors">
                  <Github className="w-5 h-5 text-purple-400" />
                </a>
                <a href="#" className="p-2 rounded-full bg-blue-500/20 hover:bg-blue-500/30 transition-colors">
                  <Linkedin className="w-5 h-5 text-blue-400" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div ref={formRef} className={`transition-all duration-1000 ${formInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} p-8 rounded-2xl backdrop-blur-sm border ${
            darkMode ? 'bg-gray-800/30 border-gray-700/50' : 'bg-white/30 border-gray-200/50'
          } shadow-lg`}>
            <h2 className="text-3xl font-bold mb-6 text-center">
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Send Us a Message
              </span>
            </h2>

            {loader ? (
              <div className="flex justify-center items-center py-20">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                  <span className="text-lg">Sending message...</span>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FloatingLabel label="Your Name" error={errors.name}>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full pt-6 pb-2 px-4 rounded-lg backdrop-blur-sm border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        darkMode ? 'bg-gray-800/50 border-gray-700 text-white' : 'bg-white/50 border-gray-200 text-gray-900'
                      } ${errors.name ? 'border-red-500' : ''}`}
                    />
                  </FloatingLabel>
                  
                  <FloatingLabel label="Email Address" error={errors.email}>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pt-6 pb-2 px-4 rounded-lg backdrop-blur-sm border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        darkMode ? 'bg-gray-800/50 border-gray-700 text-white' : 'bg-white/50 border-gray-200 text-gray-900'
                      } ${errors.email ? 'border-red-500' : ''}`}
                    />
                  </FloatingLabel>
                </div>

                <FloatingLabel label="Phone Number (Optional)" error={errors.phone}>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full pt-6 pb-2 px-4 rounded-lg backdrop-blur-sm border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      darkMode ? 'bg-gray-800/50 border-gray-700 text-white' : 'bg-white/50 border-gray-200 text-gray-900'
                    }`}
                  />
                </FloatingLabel>

                <FloatingLabel label="Subject" error={errors.subject}>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full pt-6 pb-2 px-4 rounded-lg backdrop-blur-sm border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      darkMode ? 'bg-gray-800/50 border-gray-700 text-white' : 'bg-white/50 border-gray-200 text-gray-900'
                    } ${errors.subject ? 'border-red-500' : ''}`}
                  />
                </FloatingLabel>

                <FloatingLabel label="Your Message" error={errors.message}>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className={`w-full pt-6 pb-2 px-4 rounded-lg backdrop-blur-sm border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none ${
                      darkMode ? 'bg-gray-800/50 border-gray-700 text-white' : 'bg-white/50 border-gray-200 text-gray-900'
                    } ${errors.message ? 'border-red-500' : ''}`}
                  />
                </FloatingLabel>

                <div className="flex justify-center">
                  <button
                    onClick={handleSubmit}
                    type="button"
                    className="group px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl pulse-glow"
                  >
                    <span className="flex items-center gap-2">
                      <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      Send Message
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Map Section */}
        <div ref={mapRef} className={`mb-16 rounded-2xl overflow-hidden backdrop-blur-sm border transition-all duration-1000 ${mapInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} ${
          darkMode ? 'bg-gray-800/30 border-gray-700/50' : 'bg-white/30 border-gray-200/50'
        } shadow-lg`}>
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-6 text-center">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Find Us
              </span>
            </h2>
          </div>
          <div className="relative h-64 w-full">
            <iframe
              title="Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14014.88252402814!2d77.40994685!3d28.6691564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cf053a6eaa2b7%3A0xf2577dfbaae1ff97!2sGhaziabad%2C%20Uttar%20Pradesh%20201009%2C%20India!5e0!3m2!1sen!2sin!4v1697874999649!5m2!1sen!2sin"
              className="absolute inset-0 w-full h-full"
              allowFullScreen
            />
          </div>
        </div>

        {/* Social Media & CTA Section */}
        <div ref={socialRef} className={`text-center space-y-8 transition-all duration-1000 ${socialInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Let's Build Something Great Together
            </span>
          </h2>
          
          <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Join our community of developers and typing enthusiasts. Follow us on social media for updates and behind-the-scenes content.
          </p>

          <div className="flex justify-center gap-6">
            {[
              { icon: Github, href: 'https://github.com', color: 'hover:text-gray-400' },
              { icon: Linkedin, href: 'https://linkedin.com', color: 'hover:text-blue-400' },
              { icon: Twitter, href: 'https://twitter.com', color: 'hover:text-cyan-400' },
              { icon: Mail, href: 'mailto:FastFinger@akgec.ac.in', color: 'hover:text-purple-400' }
            ].map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-4 rounded-full backdrop-blur-sm border transition-all duration-300 hover:scale-110 hover:shadow-lg ${
                  darkMode ? 'bg-gray-800/50 border-gray-700 text-gray-300' : 'bg-white/50 border-gray-200 text-gray-600'
                } ${social.color}`}
              >
                <social.icon className="w-6 h-6" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;