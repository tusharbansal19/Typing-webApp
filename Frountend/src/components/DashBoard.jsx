import React, { useState, useEffect } from 'react';
import { 
  User, 
  Settings, 
  Trophy, 
  Target, 
  BarChart3, 
  Menu, 
  X, 
  Moon, 
  Sun, 
  Edit3,
  Award,
  Zap,
  TrendingUp,
  Clock,
  Check,
  Github,
  Linkedin,
  Mail,
  Calendar,
  Activity,
  Loader2
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, fetchUserMatches, updateUserProfile } from '../features/user/userSlice';
import { useAuth } from '../Context/AuthContext';

const DashBoard = ({ darkMode = false }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [showEditForm, setShowEditForm] = useState(false);

  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const { 
    profileData, 
    profileLoading, 
    profileError, 
    matchHistory 
  } = useSelector((state) => state.user);

  // Fetch user profile data on component mount
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserProfile());
      dispatch(fetchUserMatches({ page: 1, limit: 10 }));
    }
  }, [dispatch, isAuthenticated]);

  // Set edit name when profile data is loaded
  useEffect(() => {
    if (profileData?.user?.name) {
      setEditName(profileData.user.name);
    }
  }, [profileData]);

  // Generate performance data from recent matches (last 7 days)
  const generatePerformanceData = () => {
    if (!recentMatches || recentMatches.length === 0) {
      return [];
    }

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const performanceData = [];

    // Generate data for last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayName = days[date.getDay()];
      
      // Find matches for this day
      const dayMatches = recentMatches.filter(match => {
        if (!match.startedAt) return false;
        const matchDate = new Date(match.startedAt);
        return matchDate.toDateString() === date.toDateString();
      });

      if (dayMatches.length > 0) {
        // Calculate average WPM and accuracy for the day
        const avgWpm = Math.round(dayMatches.reduce((sum, match) => sum + match.wpm, 0) / dayMatches.length);
        const avgAccuracy = Math.round(dayMatches.reduce((sum, match) => sum + match.accuracy, 0) / dayMatches.length);
        
        performanceData.push({
          day: dayName,
          wpm: avgWpm,
          accuracy: avgAccuracy
        });
      } else {
        // No matches for this day
        performanceData.push({
          day: dayName,
          wpm: 0,
          accuracy: 0
        });
      }
    }

    return performanceData;
  };

  const performanceData = generatePerformanceData();

  // Use real data from API or fallback to defaults
  const userData = profileData?.user || {
    name: "Loading...",
    email: "loading@example.com",
    avatarUrl: "https://ui-avatars.com/api/?name=User&background=random",
    joinDate: new Date(),
    status: "Available for Challenge"
  };

  const stats = profileData?.stats || {
    totalMatches: 0,
    wins: 0,
    winRate: 0,
    personalBest: { wpm: 0, accuracy: 0 },
    currentStreak: 0
  };

  const recentMatches = profileData?.recentMatches || [];

  // Generate achievements based on real user data
  const generateAchievements = () => {
    const achievements = [
      { 
        id: 1, 
        name: 'Speed Demon', 
        description: 'Achieved 90+ WPM', 
        icon: '🚀', 
        unlocked: stats.personalBest.wpm >= 90 
      },
      { 
        id: 2, 
        name: 'Accuracy Master', 
        description: 'Maintained 95%+ accuracy', 
        icon: '🎯', 
        unlocked: stats.personalBest.accuracy >= 95 
      },
      { 
        id: 3, 
        name: 'Streak Champion', 
        description: '10 wins in a row', 
        icon: '🔥', 
        unlocked: stats.currentStreak >= 10 
      },
      { 
        id: 4, 
        name: 'Century Club', 
        description: '100+ matches played', 
        icon: '💯', 
        unlocked: stats.totalMatches >= 100 
      },
      { 
        id: 5, 
        name: 'Perfectionist', 
        description: 'Achieve 100% accuracy', 
        icon: '⭐', 
        unlocked: stats.personalBest.accuracy >= 100 
      },
      { 
        id: 6, 
        name: 'First Victory', 
        description: 'Win your first match', 
        icon: '🏆', 
        unlocked: stats.wins >= 1 
      },
      { 
        id: 7, 
        name: 'Consistent Player', 
        description: 'Play 10 matches', 
        icon: '🎮', 
        unlocked: stats.totalMatches >= 10 
      },
      { 
        id: 8, 
        name: 'Speed Racer', 
        description: 'Achieved 70+ WPM', 
        icon: '⚡', 
        unlocked: stats.personalBest.wpm >= 70 
      }
    ];

    return achievements;
  };

  const achievements = generateAchievements();

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'stats', label: 'Statistics', icon: TrendingUp },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'matches', label: 'Match History', icon: Clock },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const motivationalQuotes = [
    "The expert in anything was once a beginner.",
    "Practice makes perfect, but perfect practice makes champions.",
    "Speed is nothing without accuracy.",
    "Every keystroke counts towards greatness."
  ];

  const [currentQuote] = useState(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleEditProfile = () => {
    setShowEditForm(true);
    setEditName(userData.name);
  };

  const handleSaveProfile = async () => {
    if (editName.trim()) {
      await dispatch(updateUserProfile({ name: editName.trim() }));
      setShowEditForm(false);
      setEditMode(false);
    }
  };

  const handleCancelEdit = () => {
    setShowEditForm(false);
    setEditMode(false);
    setEditName(userData.name);
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, color = "blue" }) => {
    const getCardGradient = () => {
      switch (color) {
        case 'yellow':
          return darkMode 
            ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30' 
            : 'bg-gradient-to-br from-yellow-100/70 to-orange-100/70 border-yellow-200/50';
        case 'green':
          return darkMode 
            ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30' 
            : 'bg-gradient-to-br from-green-100/70 to-emerald-100/70 border-green-200/50';
        case 'purple':
          return darkMode 
            ? 'bg-gradient-to-br from-purple-500/20 to-violet-500/20 border-purple-500/30' 
            : 'bg-gradient-to-br from-purple-100/70 to-violet-100/70 border-purple-200/50';
        case 'red':
          return darkMode 
            ? 'bg-gradient-to-br from-red-500/20 to-pink-500/20 border-red-500/30' 
            : 'bg-gradient-to-br from-red-100/70 to-pink-100/70 border-red-200/50';
        default:
          return darkMode 
            ? 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border-blue-500/30' 
            : 'bg-gradient-to-br from-blue-100/70 to-indigo-100/70 border-blue-200/50';
      }
    };

    return (
      <div className={`${getCardGradient()} backdrop-blur-sm border rounded-xl p-4 sm:p-6 hover:transform hover:scale-105 transition-all duration-300`}>
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{title}</p>
            <p className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} truncate`}>{value}</p>
            {subtitle && <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>{subtitle}</p>}
          </div>
          <div className={`p-2 sm:p-3 rounded-full bg-gradient-to-br from-${color}-500 to-${color}-600 flex-shrink-0 ml-2`}>
            <Icon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-4 sm:space-y-6">
            {/* Stats Grid */}
            {stats.totalMatches > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <StatCard 
                  title="Best WPM" 
                  value={stats.personalBest.wpm} 
                  subtitle="Personal Record"
                  icon={Zap} 
                  color="yellow" 
                />
                <StatCard 
                  title="Accuracy" 
                  value={`${stats.personalBest.accuracy}%`} 
                  subtitle="Best Performance"
                  icon={Target} 
                  color="green" 
                />
                <StatCard 
                  title="Win Rate" 
                  value={`${stats.winRate}%`} 
                  subtitle={`${stats.wins}/${stats.totalMatches} matches`}
                  icon={Trophy} 
                  color="purple" 
                />
                <StatCard 
                  title="Current Streak" 
                  value={stats.currentStreak} 
                  subtitle="Consecutive wins"
                  icon={Activity} 
                  color="red" 
                />
              </div>
            ) : (
              <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No Stats Available</p>
                <p className="text-sm mb-4">Play your first match to see your statistics!</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-2xl mx-auto">
                  <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'} backdrop-blur-sm border rounded-xl p-4 text-center`}>
                    <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                    <p className="text-sm font-medium">Best WPM</p>
                    <p className="text-lg font-bold">0</p>
                  </div>
                  <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'} backdrop-blur-sm border rounded-xl p-4 text-center`}>
                    <Target className="w-8 h-8 mx-auto mb-2 text-green-500" />
                    <p className="text-sm font-medium">Accuracy</p>
                    <p className="text-lg font-bold">0%</p>
                  </div>
                  <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'} backdrop-blur-sm border rounded-xl p-4 text-center`}>
                    <Trophy className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                    <p className="text-sm font-medium">Win Rate</p>
                    <p className="text-lg font-bold">0%</p>
                  </div>
                  <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'} backdrop-blur-sm border rounded-xl p-4 text-center`}>
                    <Activity className="w-8 h-8 mx-auto mb-2 text-red-500" />
                    <p className="text-sm font-medium">Streak</p>
                    <p className="text-lg font-bold">0</p>
                  </div>
                </div>
              </div>
            )}

            {/* Performance Chart */}
            <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gradient-to-br from-white/80 to-sky-50/80 border-sky-200/50'} backdrop-blur-sm border rounded-xl p-4 sm:p-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Weekly Performance
              </h3>
              {performanceData.length > 0 && performanceData.some(data => data.wpm > 0) ? (
                <div className="w-full overflow-x-auto">
                  <ResponsiveContainer width="100%" height={300} minWidth={400}>
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                      <XAxis dataKey="day" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                      <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                          border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                          borderRadius: '8px'
                        }}
                      />
                      <Line type="monotone" dataKey="wpm" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No Performance Data</p>
                  <p className="text-sm">Play some matches to see your weekly performance chart!</p>
                </div>
              )}
            </div>

            {/* Motivational Quote */}
            <div className={`${darkMode ? 'bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-700' : 'bg-gradient-to-r from-white/80 to-sky-100/80 border-sky-200/50'} backdrop-blur-sm border rounded-xl p-4 sm:p-6`}>
              <div className="text-center">
                {stats.totalMatches > 0 ? (
                  <>
                    <p className={`text-base sm:text-lg font-medium italic ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      "{currentQuote}"
                    </p>
                    <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Daily Motivation
                    </p>
                  </>
                ) : (
                  <>
                    <p className={`text-base sm:text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Ready to start your typing journey?
                    </p>
                    <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Join a match and see your stats grow!
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        );

      case 'achievements':
        return (
          <div className="space-y-4 sm:space-y-6">
            <h2 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Achievements</h2>
            {achievements.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className={`${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gradient-to-br from-white/80 to-sky-50/80 border-sky-200/50'} backdrop-blur-sm border rounded-xl p-4 sm:p-6 ${achievement.unlocked ? 'opacity-100' : 'opacity-50'}`}>
                    <div className="text-center">
                      <div className="text-3xl sm:text-4xl mb-2">{achievement.icon}</div>
                      <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{achievement.name}</h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{achievement.description}</p>
                      {achievement.unlocked && (
                        <div className="mt-2">
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No Achievements Available</p>
                <p className="text-sm">Start playing matches to unlock achievements!</p>
              </div>
            )}
          </div>
        );

      case 'matches':
        return (
          <div className="space-y-4 sm:space-y-6">
            <h2 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Recent Matches</h2>
            {profileLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <span className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading matches...</span>
              </div>
            ) : recentMatches.length > 0 ? (
              <div className="space-y-4">
                {recentMatches.map((match) => (
                  <div key={match.id} className={`${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gradient-to-br from-white/80 to-sky-50/80 border-sky-200/50'} backdrop-blur-sm border rounded-xl p-4`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${
                          match.mode === 'multiplayer' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                        }`}>
                          {match.mode}
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {match.wpm} WPM • {match.accuracy}% Accuracy
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          match.result === 'win' ? 'bg-green-500/20 text-green-400' :
                          match.result === 'loss' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {match.result === 'pb' ? 'PB' : match.result}
                        </div>
                        <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          {match.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No matches played yet.</p>
                <p className="text-sm mt-2">Start typing to see your match history here!</p>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="space-y-4 sm:space-y-6">
            <h2 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Content for {activeTab} will be implemented here.
            </p>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-white via-sky-50 to-blue-50'} transition-colors duration-300`}>
    

      <div className="flex">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 min-h-screen fixed lg:static inset-y-0 left-0 z-50 w-64 ${darkMode ? 'bg-gray-800/50' : 'bg-white/80'} backdrop-blur-sm border-r ${darkMode ? 'border-gray-700' : 'border-sky-200/50'} transition-transform duration-300`}>
          <div className="p-4 h-full overflow-y-auto">
            <div className="flex items-center justify-between lg:justify-center mb-6">
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Profile</h2>
              <button 
                onClick={toggleSidebar}
                className={`lg:hidden p-2 rounded-lg hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'text-gray-600'} transition-colors`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* User Info */}
            <div className="mb-6 text-center">
              {profileLoading ? (
                <div className="flex flex-col items-center">
                  <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse mb-3"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24 animate-pulse mb-2"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-32 animate-pulse"></div>
                </div>
              ) : (
                <>
                  <div className="relative inline-block">
                    <img 
                      src={userData.avatarUrl} 
                      alt={userData.name}
                      className="w-16 sm:w-20 h-16 sm:h-20 rounded-full mx-auto mb-3 border-4 border-blue-500/20"
                    />
                    <button 
                      onClick={handleEditProfile}
                      className="absolute bottom-0 right-0 p-1 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors"
                    >
                      <Edit3 className="w-3 h-3 text-white" />
                    </button>
                  </div>
                  {showEditForm ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg text-sm border ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="Enter new name"
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSaveProfile}
                          disabled={profileLoading}
                          className="flex-1 px-3 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                          {profileLoading ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : 'Save'}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex-1 px-3 py-1 text-xs bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} text-sm sm:text-base`}>
                        {userData.name}
                      </h3>
                      <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Member since {new Date(userData.joinDate).toLocaleDateString()}
                      </p>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Navigation */}
            <nav className="space-y-2 mb-6">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${
                    activeTab === item.id 
                      ? `${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}` 
                      : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
                  }`}
                >
                  <item.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Social Links */}
            <div className="border-t pt-4 border-gray-200 dark:border-gray-700">
              <p className={`text-xs sm:text-sm font-medium mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Connect
              </p>
              <div className="flex space-x-2">
                <button className={`p-2 rounded-lg hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'text-gray-600'} transition-colors`}>
                  <Github className="w-4 h-4" />
                </button>
                <button className={`p-2 rounded-lg hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'text-gray-600'} transition-colors`}>
                  <Linkedin className="w-4 h-4" />
                </button>
                <button className={`p-2 rounded-lg hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'text-gray-600'} transition-colors`}>
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0 min-w-0">
          <main className="p-4 sm:p-6">
            {profileLoading && activeTab === 'dashboard' ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
                  <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Loading your dashboard...
                  </p>
                </div>
              </div>
            ) : profileError ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className={`text-lg ${darkMode ? 'text-red-400' : 'text-red-600'} mb-4`}>
                    Error loading profile data
                  </div>
                  <button
                    onClick={() => dispatch(fetchUserProfile())}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : (
              renderContent()
            )}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className={`${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-sky-200/50'} backdrop-blur-sm border-t mt-8 sm:mt-12`}>
        <div className="px-4 sm:px-6 py-4 text-center">
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            © 2025 TypeSpeed Pro. Built for speed enthusiasts.
          </p>
        </div>
      </footer>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default DashBoard;