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
  Gift
} from 'lucide-react';

const Home = ({ darkMode, setDarkMode }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('global');
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 text-gray-100' : 'bg-gradient-to-br from-sky-100 via-white to-blue-200 text-gray-900'}`}>

      {/* Dark/Light Mode Toggle - Assuming it's elsewhere or added here */}
      {/* Example: */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`fixed top-4 right-4 p-3 rounded-full shadow-lg z-50 transition-colors duration-300
          ${darkMode ? 'bg-gray-800 text-yellow-300 hover:bg-gray-700' : 'bg-white text-blue-600 hover:bg-gray-100'}`}
        aria-label="Toggle dark mode"
      >
        {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </button>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute w-96 h-96 rounded-full opacity-20 animate-pulse ${
            darkMode ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gradient-to-r from-blue-400 to-purple-400'
          }`} style={{ 
            left: mousePosition.x / 50, 
            top: mousePosition.y / 50,
            transform: 'translate(-50%, -50%)'
          }}></div>
          <div className={`absolute w-64 h-64 rounded-full opacity-15 animate-bounce ${
            darkMode ? 'bg-gradient-to-r from-pink-600 to-red-600' : 'bg-gradient-to-r from-pink-400 to-red-400'
          }`} style={{ 
            right: mousePosition.x / 80, 
            bottom: mousePosition.y / 80 
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="container mx-auto flex flex-col lg:flex-row items-center gap-12">

            {/* Enhanced Text Section */}
            <div className="w-full lg:w-1/2">
              <div className={`backdrop-blur-2xl rounded-3xl p-8 border-2 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] group ${
                darkMode 
                  ? 'bg-gray-800/40 border-purple-500/30 hover:border-purple-400/50 text-gray-100' 
                  : 'bg-white/60 border-blue-300/40 hover:border-blue-400/60 text-gray-900'
              }`}>
                <div className="flex items-center gap-3 mb-4">
                  <Keyboard className={`w-8 h-8 ${darkMode ? 'text-purple-400' : 'text-blue-600'} animate-pulse`} />
                  <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                    darkMode ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-700'
                  }`}>
                    ⚡ #1 Typing Platform
                  </span>
                </div>

                <h1 className={`text-4xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight leading-tight ${
                  darkMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400' 
                  : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600'
                }`}>
                  Master Typing.<br />
                  <span className="relative">
                    Dominate Speed.
                    <Sparkles className="absolute -top-4 -right-4 w-8 h-8 text-yellow-400 animate-spin" />
                  </span>
                </h1>

                <div className="text-2xl font-bold mb-6 h-16 flex items-center">
                  <MousePointer className={`w-6 h-6 mr-3 ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`} />
                  <div className={`${
                    darkMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400' 
                    : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600'
                  }`}>
                    <Typewriter
                      words={[
                        'Type at Lightning Speed! ⚡',
                        'Compete Globally! 🌍',
                        'Track Every Keystroke! 📊',
                        'Become a Typing Legend! 👑'
                      ]}
                      loop
                      cursor
                      cursorStyle=" |"
                      typeSpeed={60}
                      deleteSpeed={40}
                    />
                  </div>
                </div>

                <p className={`mb-8 text-lg leading-relaxed ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  🚀 Join the ultimate typing revolution! Battle players worldwide, track your progress with AI-powered analytics, and transform your productivity forever.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
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

                <div className="mt-6 flex items-center gap-6">
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
            </div>

            {/* Enhanced Stats Card */}
            <div className="w-full lg:w-1/2">
              <div className={`backdrop-blur-2xl rounded-3xl p-8 border-2 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] group ${
                darkMode 
                  ? 'bg-gray-800/40 border-cyan-500/30 hover:border-cyan-400/50 text-gray-100' 
                  : 'bg-white/60 border-purple-300/40 hover:border-purple-400/60 text-gray-900'
              }`}>
                <div className="text-center">
                  <div className="text-6xl mb-4 animate-bounce">⌨️</div>
                  <h3 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Live Performance Dashboard
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`backdrop-blur-xl rounded-2xl p-4 transition-all duration-300 hover:scale-105 hover:rotate-1 transform ${
                      darkMode ? 'bg-blue-700/20 hover:bg-blue-700/30 text-blue-300' : 'bg-blue-200/50 hover:bg-blue-300/60 text-blue-800'
                    }`}>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Timer className="w-5 h-5 text-blue-400" />
                        <div className="text-3xl font-black text-blue-400">127</div>
                      </div>
                      <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Words/Min</div>
                      <div className="text-xs text-green-400 font-semibold">↑ +12 WPM</div>
                    </div>
                    
                    <div className={`backdrop-blur-xl rounded-2xl p-4 transition-all duration-300 hover:scale-105 hover:-rotate-1 transform ${
                      darkMode ? 'bg-green-700/20 hover:bg-green-700/30 text-green-300' : 'bg-green-200/50 hover:bg-green-300/60 text-green-800'
                    }`}>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Target className="w-5 h-5 text-green-400" />
                        <div className="text-3xl font-black text-green-400">98.7%</div>
                      </div>
                      <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Accuracy</div>
                      <div className="text-xs text-green-400 font-semibold">↑ +2.1%</div>
                    </div>
                    
                    <div className={`backdrop-blur-xl rounded-2xl p-4 transition-all duration-300 hover:scale-105 hover:rotate-1 transform ${
                      darkMode ? 'bg-yellow-700/20 hover:bg-yellow-700/30 text-yellow-300' : 'bg-yellow-200/50 hover:bg-yellow-300/60 text-yellow-800'
                    }`}>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Crown className="w-5 h-5 text-yellow-400" />
                        <div className="text-3xl font-black text-yellow-400">#847</div>
                      </div>
                      <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Global Rank</div>
                      <div className="text-xs text-green-400 font-semibold">↑ +156</div>
                    </div>
                    
                    <div className={`backdrop-blur-xl rounded-2xl p-4 transition-all duration-300 hover:scale-105 hover:-rotate-1 transform ${
                      darkMode ? 'bg-orange-700/20 hover:bg-orange-700/30 text-orange-300' : 'bg-orange-200/50 hover:bg-orange-300/60 text-orange-800'
                    }`}>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Flame className="w-5 h-5 text-orange-400" />
                        <div className="text-3xl font-black text-orange-400">23</div>
                      </div>
                      <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Day Streak</div>
                      <div className="text-xs text-green-400 font-semibold">🔥 Hot!</div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-2xl border border-yellow-400/30">
                    <div className="flex items-center justify-center gap-2">
                      <Gift className="w-5 h-5 text-yellow-400 animate-bounce" />
                      <span className={`text-sm font-semibold ${darkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
                        Daily Challenge: +500 XP Available!
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Carousel */}
      <section className="py-8 md:py-16 px-3 md:px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 md:mb-12 ${darkMode ? 'text-blue-300' : 'text-[#0a2540]'}`}>
            Powerful Features
          </h2>

          <div className="relative">
            <div className={`backdrop-blur-md ${darkMode ? 'bg-gray-800/80 border-gray-700/70 text-gray-100' : 'bg-white/80 border-blue-200/70 text-gray-900'} rounded-2xl md:rounded-3xl p-4 md:p-8 border shadow-xl`}>
              <div className="text-center">
                <div className="text-4xl md:text-6xl mb-4 md:mb-6">{featureSlides[currentSlide].emoji}</div>
                <h3 className={`text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
                  {featureSlides[currentSlide].title}
                </h3>
                <p className="text-sm md:text-base lg:text-lg text-gray-700 dark:text-gray-300 mb-4 md:mb-8 max-w-2xl mx-auto">
                  {featureSlides[currentSlide].description}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 max-w-3xl mx-auto">
                  {featureSlides[currentSlide].features.map((f, i) => (
                    <div key={i} className={`backdrop-blur-md ${darkMode ? 'bg-gray-700/40 text-gray-100' : 'bg-white/40 text-gray-900'} rounded-lg p-2 md:p-3 text-xs md:text-sm font-medium`}>
                      <CheckCircle className="w-3 h-3 md:w-4 md:h-4 inline mr-1 text-green-500" />
                      <span className={`text-sm md:text-base ${darkMode ? 'text-blue-200' : 'text-[#0a2540]'}`}>{f}</span>
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
      <section className="py-8 md:py-16 px-3 md:px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 md:mb-12 ${darkMode ? 'text-blue-300' : 'text-[#0a2540]'}`}>
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            <div className={`text-center backdrop-blur-md ${darkMode ? 'bg-gray-800/80 border-gray-700/70 text-gray-100' : 'bg-white/80 border-blue-200/70 text-gray-900'} rounded-2xl p-4 md:p-6 border shadow-xl`}>
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-lg md:text-2xl font-bold shadow-lg">
                1
              </div>
              <h3 className={`text-lg md:text-xl font-semibold mb-2 md:mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Sign In or Join as Guest</h3>
              <p className={`text-sm md:text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Create an account or join as a guest to start your typing journey instantly.</p>
            </div>
            <div className={`text-center backdrop-blur-md ${darkMode ? 'bg-gray-800/80 border-gray-700/70 text-gray-100' : 'bg-white/80 border-blue-200/70 text-gray-900'} rounded-2xl p-4 md:p-6 border shadow-xl`}>
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-lg md:text-2xl font-bold shadow-lg">
                2
              </div>
              <h3 className={`text-lg md:text-xl font-semibold mb-2 md:mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Choose Mode</h3>
              <p className={`text-sm md:text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Select from Solo practice, Live contests, Word challenges, or Paragraph tests.</p>
            </div>
            <div className={`text-center backdrop-blur-md ${darkMode ? 'bg-gray-800/80 border-gray-700/70 text-gray-100' : 'bg-white/80 border-blue-200/70 text-gray-900'} rounded-2xl p-4 md:p-6 border shadow-xl`}>
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-6 bg-gradient-to-r from-pink-600 to-red-600 rounded-full flex items-center justify-center text-white text-lg md:text-2xl font-bold shadow-lg">
                3
              </div>
              <h3 className={`text-lg md:text-xl font-semibold mb-2 md:mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Type Fast & Track Results</h3>
              <p className={`text-sm md:text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Start typing, compete with others, and watch your skills improve with detailed analytics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard Preview */}
      <section className="py-8 md:py-16 px-3 md:px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 md:mb-12 ${darkMode ? 'text-blue-300' : 'text-[#0a2540]'}`}>
            🏆 Global Leaderboard
          </h2>
          <div className={`backdrop-blur-md ${darkMode ? 'bg-gray-800/80 border-gray-700/70 text-gray-100' : 'bg-white/80 border-blue-200/70 text-gray-900'} rounded-2xl md:rounded-3xl p-4 md:p-6 border shadow-xl`}>
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
                          <div className={`font-semibold text-sm md:text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
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
      <section className="py-8 md:py-16 px-3 md:px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 md:mb-12 ${darkMode ? 'text-blue-300' : 'text-[#0a2540]'}`}>
            What Our Users Say
          </h2>
          <div className="flex overflow-x-auto snap-x snap-mandatory pb-4 space-x-4 md:space-x-6 scroll-smooth no-scrollbar">
            {testimonials.map((testimonial, index) => (
              <div key={index} className={`flex-shrink-0 w-80 min-w-[75%] sm:min-w-[50%] md:min-w-[30%] lg:min-w-[25%] snap-center backdrop-blur-md ${darkMode ? 'bg-gray-800/80 border-gray-700/70 text-gray-100' : 'bg-white/80 border-blue-200/70 text-gray-900'} rounded-2xl p-4 md:p-6 border shadow-xl hover:bg-white/90 dark:hover:bg-gray-700/90 transition-all duration-300 transform hover:scale-105`}>
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
                    <div className={`font-semibold text-sm md:text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
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
      <section className="py-8 md:py-16 px-3 md:px-4">
        <div className="max-w-6xl mx-auto">
          <div className={`backdrop-blur-md ${darkMode ? 'bg-gray-800/80 border-gray-700/70 text-gray-100' : 'bg-white/80 border-blue-200/70 text-gray-900'} rounded-2xl md:rounded-3xl p-4 md:p-8 border shadow-xl`}>
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
      <section className="py-8 md:py-16 px-3 md:px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-6 ${darkMode ? 'text-blue-300' : 'text-[#0a2540]'}`}>
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
      <section className="py-8 md:py-16 px-3 md:px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 md:mb-12 ${darkMode ? 'text-blue-300' : 'text-[#0a2540]'}`}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <details className={`group rounded-2xl p-4 md:p-6 cursor-pointer border shadow-md transition-all duration-300 ${
              darkMode ? 'bg-gray-800/80 border-gray-700/70' : 'bg-white/80 border-blue-200/70'
            }`}>
              <summary className={`flex justify-between items-center font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
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
              <summary className={`flex justify-between items-center font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
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
              <summary className={`flex justify-between items-center font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
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
      <footer className={`py-10 px-4 ${darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>TypeMaster</h4>
            <p className="text-sm">Master your typing, dominate the leaderboard.</p>
            <div className="flex space-x-4 mt-4">
              <a href="#" aria-label="Github"><Github className={`w-5 h-5 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`} /></a>
              <a href="#" aria-label="Twitter"><Twitter className={`w-5 h-5 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`} /></a>
              <a href="#" aria-label="Mail"><Mail className={`w-5 h-5 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`} /></a>
            </div>
          </div>
          <div>
            <h4 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/typing" className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>Start Test</Link></li>
              <li><Link to="/dashboard" className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>Dashboard</Link></li>
              <li><Link to="/leaderboard" className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>Leaderboard</Link></li>
              <li><Link to="/challenges" className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>Challenges</Link></li>
            </ul>
          </div>
          <div>
            <h4 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/faq" className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>FAQ</Link></li>
              <li><Link to="/contact" className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>Contact Us</Link></li>
              <li><Link to="/privacy" className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>Privacy Policy</Link></li>
              <li><Link to="/terms" className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Stay Connected</h4>
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