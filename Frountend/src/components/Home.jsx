import { useEffect, useState, useCallback } from 'react';
import { Link } from "react-router-dom";
import { Typewriter } from 'react-simple-typewriter';
import { ChevronUp,ChevronDown  } from 'lucide-react';
import {
  // Keyboard,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  Brain,
  Users,
  BarChart3,
  Shield,
  Trophy,
  Play,
  CheckCircle,
  Award,
  BookOpen,
  HelpCircle,
  MessageSquare,
  Github,
  Mail,
  Twitter,
  Zap,
  Star,
  Target,
  Clock,
  TrendingUp,
  Globe,
  Gamepad2,
  Settings,
  Crown,
  Flame,
  Sparkles,
  Rocket,
  Heart,
  MousePointer,
  Keyboard,
  Timer,
  BarChart,
  Activity,
  Coffee,
  Medal,
  Gift,
  Percent,
  AlertCircle
} from 'lucide-react';
import React from 'react';

// Reusable FloatingOrbs and CircuitBackground components (from AboutUs.jsx)
const FloatingOrbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-20 left-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
    <div className="absolute top-40 right-32 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
    <div className="absolute bottom-40 left-1/4 w-56 h-56 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-2000" />
    <div className="absolute bottom-20 right-20 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-3000" />
  </div>
);

const CircuitBackground = () => (
  <div className="absolute inset-0 opacity-30">
    <svg width="100%" height="100%" viewBox="0 0 1000 1000" className="absolute inset-0">
      <defs>
        <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M10,10 L90,10 L90,90 L10,90 Z" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
          <circle cx="10" cy="10" r="2" fill="currentColor" opacity="0.5"/>
          <circle cx="90" cy="10" r="2" fill="currentColor" opacity="0.5"/>
          <circle cx="90" cy="90" r="2" fill="currentColor" opacity="0.5"/>
          <circle cx="10" cy="90" r="2" fill="currentColor" opacity="0.5"/>
          <path d="M30,30 L70,30 L70,70 L30,70 Z" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.2"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#circuit)"/>
    </svg>
  </div>
);

// Add glassmorphism utility class
const glassCard = (darkMode) =>
  darkMode
    ? 'bg-[rgba(30,41,59,0.45)] border border-[rgba(255,255,255,0.10)] backdrop-blur-xl shadow-xl'
    : 'bg-[rgba(255,255,255,0.92)] border border-[rgba(180,180,220,0.18)] backdrop-blur-xl shadow-xl';

// Add a second orb background for more visual depth
const DualOrbs = () => (
  <>
    <div className="absolute top-10 left-10 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse z-0" />
    <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse z-0" />
  </>
);

// --- Keyboard Layout for Hero Section ---
const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];
// Update GLOW_COLORS to match site palette
const GLOW_COLORS = [
  'shadow-[0_0_24px_6px_rgba(59,130,246,0.7)] bg-blue-400/80',    // blue-500
  'shadow-[0_0_24px_6px_rgba(168,139,250,0.7)] bg-purple-400/80', // purple-400
  'shadow-[0_0_24px_6px_rgba(236,72,153,0.7)] bg-pink-400/80',    // pink-500
  'shadow-[0_0_24px_6px_rgba(34,211,238,0.7)] bg-cyan-400/80',    // cyan-400
  'shadow-[0_0_24px_6px_rgba(250,204,21,0.7)] bg-yellow-300/80',  // yellow-300
];

function KeyboardGrid({ glowingKey, darkMode }) {
  return (
    <div className="flex flex-col items-end md:items-center gap-2">
      {KEYBOARD_ROWS.map((row, rowIdx) => (
        <div key={rowIdx} className="flex justify-center gap-2">
          {row.map((key, colIdx) => {
            const idx = rowIdx * 10 + colIdx;
            const isGlowing = glowingKey === idx;
            return (
              <button
                key={key}
                className={`w-10 h-12 md:w-12 md:h-16 rounded-lg font-bold text-lg md:text-2xl border border-white/30 transition-all duration-200
                  ${isGlowing ? GLOW_COLORS[Math.floor(Math.random() * GLOW_COLORS.length)] :
                    darkMode ? 'bg-indigo-900/60 text-white' : 'bg-white/80 text-gray-900'}
                  focus:outline-none select-none`}
                style={{ boxShadow: isGlowing ? undefined : '0 2px 8px 0 rgba(0,0,0,0.04)' }}
                tabIndex={-1}
                aria-label={key}
              >
                {key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// --- Animated Background and Circuit SVG from ContactUs.jsx ---
const AnimatedBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0">
    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-cyan-900/20" />
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"
           style={{ top: '10%', left: '10%', animation: 'float 20s ease-in-out infinite alternate' }} />
      <div className="absolute w-80 h-80 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl"
           style={{ bottom: '10%', right: '10%', animation: 'float 25s ease-in-out infinite alternate-reverse' }} />
    </div>
  </div>
);

const CircuitBackgroundContact = () => (
  <div className="absolute inset-0 opacity-30 z-0 pointer-events-none">
    <svg width="100%" height="100%" viewBox="0 0 1000 1000" className="absolute inset-0">
      <defs>
        <pattern id="circuit-contact" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M10,10 L90,10 L90,90 L10,90 Z" fill="none" stroke="#7dd3fc" strokeWidth="0.5" opacity="0.3"/>
          <circle cx="10" cy="10" r="2" fill="#a78bfa" opacity="0.5"/>
          <circle cx="90" cy="10" r="2" fill="#a78bfa" opacity="0.5"/>
          <circle cx="90" cy="90" r="2" fill="#a78bfa" opacity="0.5"/>
          <circle cx="10" cy="90" r="2" fill="#a78bfa" opacity="0.5"/>
          <path d="M30,30 L70,30 L70,70 L30,70 Z" fill="none" stroke="#818cf8" strokeWidth="0.3" opacity="0.2"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#circuit-contact)"/>
    </svg>
  </div>
);

// --- Stat Cards for Hero Section ---
const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className={`flex items-center gap-3 mb-3 px-4 py-3 rounded-xl shadow-lg backdrop-blur-sm border ${
    color === 'blue' ? 'bg-blue-100/80 border-blue-300 text-blue-900' :
    color === 'green' ? 'bg-green-100/80 border-green-300 text-green-900' :
    color === 'red' ? 'bg-red-100/80 border-red-300 text-red-900' :
    'bg-white/80 border-gray-200 text-gray-900'
  }`}>
    <Icon className={`w-6 h-6 ${
      color === 'blue' ? 'text-blue-500' :
      color === 'green' ? 'text-green-500' :
      color === 'red' ? 'text-red-500' :
      'text-gray-500'
    }`} />
    <div>
      <div className="text-lg font-bold leading-tight">{value}</div>
      <div className="text-xs font-medium opacity-80">{label}</div>
    </div>
  </div>
);

const Home = ({ darkMode, setDarkMode }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('global');
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [glowingKey, setGlowingKey] = useState(null);

  // Add state for random stats
  const [heroWpm, setHeroWpm] = useState(0);
  const [heroAcc, setHeroAcc] = useState(0);
  const [heroMistakes, setHeroMistakes] = useState(0);

  // Carousel data for feature showcase
  const featureSlides = [
    {
      icon: <Brain className="w-6 h-6 md:w-8 md:h-8" />,
      emoji: "🧠",
      title: "Word-level Accuracy Detection",
      description: "Advanced AI-powered detection tracks every keystroke with precision analytics.",
      features: ["Real-time Error Detection", "Character-level Analysis", "Accuracy Heatmaps", "Progress Tracking"]
    },
    {
      icon: <Users className="w-6 h-6 md:w-8 md:h-8" />,
      emoji: "🎮",
      title: "Real-time Multiplayer Battles",
      description: "Compete against players worldwide in live typing competitions.",
      features: ["Live Matchmaking", "Private Rooms", "Tournament Mode", "Instant Results"]
    },
    {
      icon: <BarChart3 className="w-6 h-6 md:w-8 md:h-8" />,
      emoji: "📊",
      title: "Live Stats & Match History",
      description: "Comprehensive analytics dashboard with detailed performance insights.",
      features: ["WPM Trends", "Accuracy Charts", "Heat Maps", "Performance Reports"]
    },
    {
      icon: <Shield className="w-6 h-6 md:w-8 md:h-8" />,
      emoji: "🔐",
      title: "Google/Email Authentication",
      description: "Secure login with multiple authentication methods and data protection.",
      features: ["OAuth Integration", "Data Encryption", "Privacy Controls", "Account Sync"]
    }
  ];

  // Dummy leaderboard data (can be replaced with API calls)
  const leaderboardData = [
    { rank: 1, name: "TypeMaster_Pro", wpm: 158, accuracy: 99.2, avatar: "🔥", country: "🇺🇸" },
    { rank: 2, name: "KeyboardNinja", wpm: 152, accuracy: 98.7, avatar: "⚡", country: "🇬🇧" },
    { rank: 3, name: "SpeedDemon", wpm: 147, accuracy: 97.9, avatar: "👑", country: "🇯🇵" },
    { rank: 4, name: "QuickFingers", wpm: 143, accuracy: 98.5, avatar: "💨", country: "🇩🇪" },
    { rank: 5, name: "WordWarrior", wpm: 140, accuracy: 97.3, avatar: "⚔️", country: "🇨🇦" }
  ];

  // Testimonials data
  const testimonials = [
    {
      name: "Alex Chen",
      text: "Improved my typing speed by 40 WPM in just 6 weeks! This platform is a game-changer.",
      rating: 5,
      role: "Software Developer",
      avatar: "👨‍💻"
    },
    {
      name: "Sarah Williams",
      text: "The multiplayer battles are incredibly engaging and fun! I love competing with friends.",
      rating: 5,
      role: "Content Writer",
      avatar: "👩‍✍️"
    },
    {
      name: "Mike Johnson",
      text: "Best typing platform I've used. Love the detailed analytics and progress tracking!",
      rating: 5,
      role: "Data Analyst",
      avatar: "👨‍📊"
    },
    {
      name: "Emily White",
      text: "I appreciate the accuracy detection feature; it really helps pinpoint weaknesses. Highly recommended!",
      rating: 4,
      role: "Student",
      avatar: "👩‍🎓"
    },
    {
      name: "David Lee",
      text: "The diverse practice modes keep things fresh. My WPM has steadily increased since I started.",
      rating: 5,
      role: "Gamer",
      avatar: "👨‍🎤"
    },
    {
      name: "Priya Sharma",
      text: "Joining the live matches boosted my motivation. My accuracy has never been better!",
      rating: 5,
      role: "Student",
      avatar: "👩‍🎓"
    },
    {
      name: "Carlos Ruiz",
      text: "The heatmaps are fantastic for identifying problem keys. A truly insightful tool for typists.",
      rating: 4,
      role: "Journalist",
      avatar: "✍️"
    },
  ];

  // Memoized carousel navigation functions
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % featureSlides.length);
  }, [featureSlides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + featureSlides.length) % featureSlides.length);
  }, [featureSlides.length]);

  // Automatic carousel advance
  useEffect(() => {
    const autoAdvance = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    return () => clearInterval(autoAdvance);
  }, [nextSlide]);

  // Scroll to top functionality
  const handleScroll = useCallback(() => {
    if (window.scrollY > 300) {
      setShowScrollToTop(true);
    } else {
      setShowScrollToTop(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // --- Randomly glow keys in hero section ---
  useEffect(() => {
    let timeout;
    function glowNext() {
      const totalKeys = 10 + 9 + 7; // 26
      setGlowingKey(Math.floor(Math.random() * totalKeys));
      timeout = setTimeout(glowNext, 250 + Math.random() * 400);
    }
    glowNext();
    return () => clearTimeout(timeout);
  }, []);

  // Add state for random stats
  useEffect(() => {
    function randomizeStats() {
      setHeroWpm(Math.floor(Math.random() * 80) + 60); // 60-140
      setHeroAcc(Math.floor(Math.random() * 10) + 90); // 90-99
      setHeroMistakes(Math.floor(Math.random() * 10) + 1); // 1-10
    }
    randomizeStats();
    const interval = setInterval(randomizeStats, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen transition-all duration-500 relative overflow-hidden ${darkMode
      ? 'bg-gradient-to-br from-blue-950 via-black-900 to-gray-900'
      : 'bg-gradient-to-br from-blue-100 via-white to-blue-200'}`}>
      {/* Contact page style backgrounds */}
      <CircuitBackground />
      <AnimatedBackground />

      {/* Dark/Light Mode Toggle - Assuming it's elsewhere or added here */}
      {/* Example: */}
   

      {/* --- HERO SECTION --- */}
      <section
        className="relative min-h-screen flex flex-col md:flex-row items-center justify-center px-4 md:px-8 py-12"
      >
      <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left relative z-10">
         
          <h1 className={`text-2xl md:text-4xl lg:text-4xl font-black mb-6 tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-fade-in`}
            style={{ animation: 'fadeIn 1.2s ease' }}>
            FastFinger.<br />
            
                </h1>
          <div className="text-2xl font-bold mb-6 h-16 flex items-center animate-fade-in" style={{ animation: 'fadeIn 1.8s ease' }}>
                  <MousePointer className={`w-6 h-6 mr-3 ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`} />
            <div className={`text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400`}>
                    <Typewriter
                      words={[
                        'Type at Lightning Speed! ⚡',
                        'Compete Globally! 🌍',
                        'Track Every Keystroke! 📊',
          'Become a Typing Legend! 👑',
                      ]}
        loop={true}
                      cursor
        cursorStyle="|"
                      typeSpeed={60}
                      deleteSpeed={40}
        delaySpeed={100}
                    />
                  </div>
                </div>
          <p className={`mb-8 text-lg leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'} animate-fade-in`} style={{ animation: 'fadeIn 2.2s ease' }}>
                  🚀 Join the ultimate typing revolution! Battle players worldwide, track your progress with AI-powered analytics, and transform your productivity forever.
                </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animation: 'fadeIn 2.6s ease' }}>
                  <Link to="/typing">
                    <button className={`group px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-3xl transform hover:-translate-y-1 ${
                      darkMode 
                        ? 'bg-gradient-to-r from-blue-600 via-green-600 to-yellow-600 hover:from-blue-500 hover:via-green-500 hover:to-yellow-500 text-white' 
                        : 'bg-gradient-to-r from-blue-600 via-green-600 to-yellow-600 hover:from-blue-500 hover:via-green-500 hover:to-yellow-500 text-white'
                    }`}>
                      <div className="flex items-center gap-3">
                        <Rocket className="w-5 h-5 group-hover:animate-bounce" />
                        Start Typing Now
                        <Flame className="w-5 h-5 group-hover:animate-pulse" />
                      </div>
                    </button>
                  </Link>
                  <button className={`group px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-3xl transform hover:-translate-y-1 border-2 ${
                    darkMode 
                      ? 'bg-transparent border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-300' 
                      : 'bg-transparent border-blue-600 text-blue-600 hover:bg-blue-600/10 hover:border-blue-500'
                  }`}>
                    <div className="flex items-center gap-3">
                      <Crown className="w-5 h-5 group-hover:animate-bounce" />
                      Join Tournament
                      <Trophy className="w-5 h-5 group-hover:animate-pulse" />
                    </div>
                  </button>
                </div>
          <div className="mt-6 flex items-center gap-6 animate-fade-in" style={{ animation: 'fadeIn 3s ease' }}>
                  <Link to="/dashboard">
                    <button className={`group flex items-center gap-2 text-sm font-semibold transition-all duration-300 hover:scale-105 ${
                      darkMode ? 'text-purple-400 hover:text-purple-300' : 'text-blue-600 hover:text-purple-600'
                    }`}>
                      <BarChart className="w-4 h-4 group-hover:animate-pulse" />
                      View Dashboard
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-400 to-pink-400 border-2 border-white"></div>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 border-2 border-white"></div>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 border-2 border-white"></div>
                    </div>
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      50K+ active typists
                    </span>
                  </div>
                </div>
              </div>
        {/* Left: Keyboard Grid */}
        <div className="w-full md:w-1/2 flex justify-center items-center mb-12 md:mb-0">
          <div className="relative z-10">
         {/* Stat Cards */}
         <div className="w-full flex flex-row items-center justify-center gap-4 mb-6">
            <StatCard icon={TrendingUp} label="WPM" value={heroWpm} color="blue" />
            <StatCard icon={Percent} label="Accuracy" value={`${heroAcc}%`} color="green" />
            <StatCard icon={AlertCircle} label="Mistakes" value={heroMistakes} color="red" />
          </div>
            <KeyboardGrid glowingKey={glowingKey} darkMode={darkMode} />
          </div>
        </div>
        {/* Right: Headline and CTA */}
        
      </section>

      {/* Feature Highlights Carousel */}
      <section className="relative py-8 md:py-16 px-3 md:px-4">
        <CircuitBackgroundContact />
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 md:mb-12 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            Powerful Features
          </h2>

          <div className="relative">
            <div className={`backdrop-blur-md ${darkMode ? 'bg-gray-800/30 border-gray-700/50' : 'bg-white/30 border-gray-200/50'} rounded-2xl md:rounded-3xl p-4 md:p-8 border shadow-xl`}>
              <div className="text-center">
                <div className="text-4xl md:text-6xl mb-4 md:mb-6">{featureSlides[currentSlide].emoji}</div>
                <h3 className={`text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  {featureSlides[currentSlide].title}
                </h3>
                <p className="text-sm md:text-base lg:text-lg text-gray-700 dark:text-gray-300 mb-4 md:mb-8 max-w-2xl mx-auto">
                  {featureSlides[currentSlide].description}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 max-w-3xl mx-auto">
                  {featureSlides[currentSlide].features.map((f, i) => (
                    <div key={i} className={`backdrop-blur-md ${darkMode ? 'bg-gray-800/30 border-gray-700/50' : 'bg-white/30 border-gray-200/50'} rounded-lg p-2 md:p-3 text-xs md:text-sm font-medium`}>
                      <CheckCircle className="w-3 h-3 md:w-4 md:h-4 inline mr-1 text-green-500" />
                      <span className={`text-sm md:text-base ${darkMode ? 'text-gray-200' : 'text-[#0a2540]'}`}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Carousel Controls */}
            <button
              onClick={prevSlide}
              className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 p-2 md:p-3 rounded-full backdrop-blur-md bg-white/40 dark:bg-gray-800/40 border border-white/60 dark:border-gray-700/60 hover:bg-white/60 dark:hover:bg-gray-700/60 transition-all duration-200 z-10"
              aria-label="Previous feature"
            >
              <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-gray-900 dark:text-white" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 p-2 md:p-3 rounded-full backdrop-blur-md bg-white/40 dark:bg-gray-800/40 border border-white/60 dark:border-gray-700/60 hover:bg-white/60 dark:hover:bg-gray-700/60 transition-all duration-200 z-10"
              aria-label="Next feature"
            >
              <ChevronRight className="w-4 h-4 md:w-6 md:h-6 text-gray-900 dark:text-white" />
            </button>

            {/* Carousel Indicators */}
            <div className="flex justify-center mt-4 md:mt-6 space-x-2">
              {featureSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-200 ${
                    index === currentSlide
                      ? 'bg-blue-600 dark:bg-blue-400'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  aria-label={`Go to feature slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-8 md:py-16 px-3 md:px-4">
        <FloatingOrbs />
        <CircuitBackgroundContact />
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 md:mb-12 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            <div className={`text-center backdrop-blur-md ${darkMode ? 'bg-gray-800/30 border-gray-700/50' : 'bg-white/30 border-gray-200/50'} rounded-2xl p-4 md:p-6 border shadow-xl`}>
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-lg md:text-2xl font-bold shadow-lg">
                1
              </div>
              <h3 className={`text-lg md:text-xl font-semibold mb-2 md:mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Sign In or Join as Guest</h3>
              <p className={`text-sm md:text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Create an account or join as a guest to start your typing journey instantly.</p>
            </div>
            <div className={`text-center backdrop-blur-md ${darkMode ? 'bg-gray-800/30 border-gray-700/50' : 'bg-white/30 border-gray-200/50'} rounded-2xl p-4 md:p-6 border shadow-xl`}>
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-lg md:text-2xl font-bold shadow-lg">
                2
              </div>
              <h3 className={`text-lg md:text-xl font-semibold mb-2 md:mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Choose Mode</h3>
              <p className={`text-sm md:text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Select from Solo practice, Live contests, Word challenges, or Paragraph tests.</p>
            </div>
            <div className={`text-center backdrop-blur-md ${darkMode ? 'bg-gray-800/30 border-gray-700/50' : 'bg-white/30 border-gray-200/50'} rounded-2xl p-4 md:p-6 border shadow-xl`}>
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-6 bg-gradient-to-r from-pink-600 to-red-600 rounded-full flex items-center justify-center text-white text-lg md:text-2xl font-bold shadow-lg">
                3
              </div>
              <h3 className={`text-lg md:text-xl font-semibold mb-2 md:mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Type Fast & Track Results</h3>
              <p className={`text-sm md:text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Start typing, compete with others, and watch your skills improve with detailed analytics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard Preview */}
      <section className="relative py-8 md:py-16 px-3 md:px-4">
        {/* Both backgrounds for a strong effect */}
        <FloatingOrbs />
        <CircuitBackground />
        <CircuitBackgroundContact />
        <div className="max-w-4xl mx-auto">
          <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 md:mb-12 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            🏆 Global Leaderboard
          </h2>
          <div className={`backdrop-blur-md ${darkMode ? 'bg-gray-800/30 border-gray-700/50' : 'bg-white/30 border-gray-200/50'} rounded-2xl md:rounded-3xl p-4 md:p-6 border shadow-xl`}>
            <div className="flex justify-center mb-4 md:mb-6">
              <div className={`flex backdrop-blur-md ${darkMode ? 'bg-gray-700/40' : 'bg-white/40'} rounded-lg p-1`}>
                <button
                  onClick={() => setActiveTab('global')}
                  className={`px-3 py-1 md:px-4 md:py-2 rounded-md text-xs md:text-sm font-medium transition-all duration-200 ${
                    activeTab === 'global'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-600/20'
                  }`}
                  aria-controls="leaderboard-global"
                  aria-selected={activeTab === 'global'}
                  role="tab"
                >
                  Global
                </button>
                <button
                  onClick={() => setActiveTab('personal')}
                  className={`px-3 py-1 md:px-4 md:py-2 rounded-md text-xs md:text-sm font-medium transition-all duration-200 ${
                    activeTab === 'personal'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-600/20'
                  }`}
                  aria-controls="leaderboard-personal"
                  aria-selected={activeTab === 'personal'}
                  role="tab"
                >
                  Personal Best
                </button>
              </div>
            </div>
            <div role="tabpanel" id={`leaderboard-${activeTab}`}>
              {activeTab === 'global' ? (
                <div className="space-y-2 md:space-y-3">
                  {leaderboardData.map((row) => (
                    <div key={row.rank} className={`flex items-center justify-between p-3 md:p-4 backdrop-blur-md ${darkMode ? 'bg-gray-700/40' : 'bg-white/40'} rounded-lg hover:bg-white/60 dark:hover:bg-gray-700/60 transition-all duration-200`}>
                      <div className="flex items-center space-x-3 md:space-x-4">
                        <div className="flex items-center space-x-2">
                          <div className="text-lg md:text-2xl">{row.avatar}</div>
                          <div className={`text-sm md:text-base ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{row.country}</div>
                        </div>
                        <div>
                          <div className={`font-semibold text-sm md:text-base ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                            #{row.rank} {row.name}
                          </div>
                          <div className={`text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {row.accuracy}% accuracy
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg md:text-xl font-bold text-blue-600 dark:text-blue-400">
                          {row.wpm} WPM
                        </div>
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          <Trophy className="w-3 h-3 inline mr-1" />
                          Rank #{row.rank}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-700 dark:text-gray-300">
                  <p className="text-lg mb-4">Log in to view your personal best records!</p>
                  <Link to="/login">
                    <button className={`px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-200 ${
                      darkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}>
                      Login / Register
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel with Horizontal Scroll */}
      <section className="relative py-8 md:py-16 px-3 md:px-4">
        <CircuitBackground />
        <CircuitBackgroundContact />
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 md:mb-12 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            What Our Users Say
          </h2>
          <div className="flex overflow-x-auto snap-x snap-mandatory pb-4 space-x-4 md:space-x-6 scroll-smooth no-scrollbar">
            {testimonials.map((testimonial, index) => (
              <div key={index} className={`flex-shrink-0 w-80 min-w-[75%] sm:min-w-[50%] md:min-w-[30%] lg:min-w-[25%] snap-center backdrop-blur-md ${darkMode ? 'bg-gray-800/30 border-gray-700/50' : 'bg-white/30 border-gray-200/50'} rounded-2xl p-4 md:p-6 border shadow-xl hover:bg-white/90 dark:hover:bg-gray-700/90 transition-all duration-300 transform hover:scale-105`}>
                <div className="flex mb-3 md:mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-current" aria-hidden="true" />
                  ))}
                </div>
                <p className={`text-sm md:text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-3 md:mb-4 italic`}>
                  "{testimonial.text}"
                </p>
                <div className="flex items-center space-x-3">
                  <div className="text-xl md:text-2xl">{testimonial.avatar}</div>
                  <div>
                    <div className={`font-semibold text-sm md:text-base ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      {testimonial.name}
                    </div>
                    <div className={`text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-8 md:py-16 px-3 md:px-4">
        <FloatingOrbs />
        <CircuitBackgroundContact />
        <div className="max-w-6xl mx-auto">
          <div className={`backdrop-blur-md ${darkMode ? 'bg-gray-800/30 border-gray-700/50' : 'bg-white/30 border-gray-200/50'} rounded-2xl md:rounded-3xl p-4 md:p-8 border shadow-xl`}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
              <div>
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-1 md:mb-2">50K+</div>
                <div className={`text-xs md:text-sm lg:text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Active Users</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-1 md:mb-2">2M+</div>
                <div className={`text-xs md:text-sm lg:text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Tests Completed</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-green-600 dark:text-green-400 mb-1 md:mb-2">150+</div>
                <div className={`text-xs md:text-sm lg:text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>WPM Achieved</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-yellow-600 dark:text-yellow-400 mb-1 md:mb-2">99%</div>
                <div className={`text-xs md:text-sm lg:text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Accuracy Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative py-8 md:py-16 px-3 md:px-4">
        <CircuitBackground />
        <CircuitBackgroundContact />
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-6 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            Ready to Unleash Your Typing Potential?
          </h2>
          <p className={`text-lg md:text-xl mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Join thousands of typists improving their speed and accuracy every day. It's free, fun, and highly effective!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/typing">
              <button className={`group px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-3xl transform hover:-translate-y-1 ${
                darkMode 
                  ? 'bg-yellow-600 hover:bg-yellow-500 text-gray-900' 
                  : 'bg-yellow-500 hover:bg-yellow-600 text-white'
              }`}>
                <div className="flex items-center gap-3">
                  <Play className="w-5 h-5 group-hover:animate-ping" />
                  Start a Free Test
                </div>
              </button>
            </Link>
            <Link to="/register">
              <button className={`group px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-3xl transform hover:-translate-y-1 border-2 ${
                darkMode 
                  ? 'bg-transparent border-blue-400 text-blue-400 hover:bg-blue-400/10' 
                  : 'bg-transparent border-green-600 text-green-600 hover:bg-green-600/10'
              }`}>
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 group-hover:animate-bounce" />
                  Create an Account
                </div>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-8 md:py-16 px-3 md:px-4">
        <FloatingOrbs />
        <CircuitBackgroundContact />
        <div className="max-w-4xl mx-auto">
          <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 md:mb-12 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <details className={`group rounded-2xl p-4 md:p-6 cursor-pointer border shadow-md transition-all duration-300 ${
              darkMode ? 'bg-gray-800/80 border-gray-700/70' : 'bg-white/80 border-blue-200/70'
            }`}>
              <summary className={`flex justify-between items-center font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                How does the accuracy detection work?
                <ChevronDown className="group-open:rotate-180 transition-transform duration-300" />
              </summary>
              <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Our platform uses an advanced AI algorithm to analyze your keystrokes in real-time, identifying errors down to the character level. It provides instant feedback and highlights areas for improvement.
              </p>
            </details>
            <details className={`group rounded-2xl p-4 md:p-6 cursor-pointer border shadow-md transition-all duration-300 ${
              darkMode ? 'bg-gray-800/80 border-gray-700/70' : 'bg-white/80 border-blue-200/70'
            }`}>
              <summary className={`flex justify-between items-center font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                Can I compete with my friends?
                <ChevronDown className="group-open:rotate-180 transition-transform duration-300" />
              </summary>
              <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Yes! Our real-time multiplayer feature allows you to create private rooms and challenge your friends, or join public matches to compete against players worldwide.
              </p>
            </details>
            <details className={`group rounded-2xl p-4 md:p-6 cursor-pointer border shadow-md transition-all duration-300 ${
              darkMode ? 'bg-gray-800/80 border-gray-700/70' : 'bg-white/80 border-blue-200/70'
            }`}>
              <summary className={`flex justify-between items-center font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                What kind of stats does the dashboard track?
                <ChevronDown className="group-open:rotate-180 transition-transform duration-300" />
              </summary>
              <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                The dashboard offers comprehensive analytics including Words Per Minute (WPM) trends, accuracy percentage, error heatmaps, character-specific problem areas, and overall progress reports.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-10 px-4 ${darkMode ? 'bg-gradient-to-br from-blue-950 via-black-900 to-gray-900 text-gray-300' : 'bg-gradient-to-br from-blue-100 via-white to-blue-200 text-gray-700'}`}>
        <CircuitBackgroundContact />
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className={`font-bold mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>TypeMaster</h4>
            <p className="text-sm">Master your typing, dominate the leaderboard.</p>
            <div className="flex space-x-4 mt-4">
              <a href="#" aria-label="Github"><Github className={`w-5 h-5 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`} /></a>
              <a href="#" aria-label="Twitter"><Twitter className={`w-5 h-5 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`} /></a>
              <a href="#" aria-label="Mail"><Mail className={`w-5 h-5 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`} /></a>
            </div>
          </div>
          <div>
            <h4 className={`font-bold mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/typing" className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>Start Test</Link></li>
              <li><Link to="/dashboard" className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>Dashboard</Link></li>
              <li><Link to="/leaderboard" className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>Leaderboard</Link></li>
              <li><Link to="/challenges" className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>Challenges</Link></li>
            </ul>
          </div>
          <div>
            <h4 className={`font-bold mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/faq" className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>FAQ</Link></li>
              <li><Link to="/contact" className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>Contact Us</Link></li>
              <li><Link to="/privacy" className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>Privacy Policy</Link></li>
              <li><Link to="/terms" className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className={`font-bold mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Stay Connected</h4>
            <p className="text-sm mb-4">Subscribe to our newsletter for updates!</p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className={`p-2 rounded-l-md w-full ${darkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-gray-200 text-gray-900 placeholder-gray-500'}`} 
              />
              <button 
                type="submit" 
                className={`p-2 rounded-r-md font-semibold transition-colors duration-200 ${darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className={`text-center mt-10 pt-8 border-t ${darkMode ? 'border-gray-700 text-gray-500' : 'border-gray-300 text-gray-500'}`}>
          &copy; {new Date().getFullYear()} TypeMaster. All rights reserved.
        </div>
      </footer>


      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-6 right-6 p-3 rounded-full shadow-lg transition-all duration-300 ${
            darkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default Home;