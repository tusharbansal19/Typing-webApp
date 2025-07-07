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
  Loader2,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, LabelList } from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, fetchUserMatches, updateUserProfile } from '../features/user/userSlice';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

// CircuitBackground with dual color support
const CircuitBackground = ({ darkMode }) => (
  <div className="absolute inset-0 opacity-30 z-0 pointer-events-none">
    <svg width="100%" height="100%" viewBox="0 0 1000 1000" className="absolute inset-0">
      <defs>
        <pattern id="circuit-dashboard" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M10,10 L90,10 L90,90 L10,90 Z" fill="none" stroke={darkMode ? '#7dd3fc' : '#60a5fa'} strokeWidth="0.5" opacity="0.3"/>
          <circle cx="10" cy="10" r="2" fill={darkMode ? '#a78bfa' : '#60a5fa'} opacity="0.5"/>
          <circle cx="90" cy="10" r="2" fill={darkMode ? '#a78bfa' : '#60a5fa'} opacity="0.5"/>
          <circle cx="90" cy="90" r="2" fill={darkMode ? '#a78bfa' : '#60a5fa'} opacity="0.5"/>
          <circle cx="10" cy="90" r="2" fill={darkMode ? '#a78bfa' : '#60a5fa'} opacity="0.5"/>
          <path d="M30,30 L70,30 L70,70 L30,70 Z" fill="none" stroke={darkMode ? '#818cf8' : '#bae6fd'} strokeWidth="0.3" opacity="0.2"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#circuit-dashboard)"/>
    </svg>
  </div>
);

const DashBoard = ({ darkMode = false , setDarkMode} ) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const { 
    profileData, 
    profileLoading, 
    profileError, 
    matchHistory,
    matchPagination 
  } = useSelector((state) => state.user);

  // Check if there are more matches to load
  const hasMoreMatches = matchPagination ? 
    (matchPagination.page * matchPagination.limit) < matchPagination.total : 
    false;

  // Fetch user profile data on component mount
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserProfile());
      dispatch(fetchUserMatches({ page: 1, limit: 50 })); // Fetch more matches initially
    }
  }, [dispatch, isAuthenticated]);

  // Set edit name when profile data is loaded
  useEffect(() => {
    if (profileData?.user?.name) {
      setEditName(profileData.user.name);
    }
  }, [profileData]);

  // Recalculate stats when matchHistory changes
  useEffect(() => {
    // This will trigger recalculation of stats and performance data
    // when matchHistory is updated
  }, [matchHistory]);

  // Calculate real performance data from match history
  const calculatePerformanceData = () => {
    // Use full matchHistory instead of limited profileData.recentMatches
    const allMatches = matchHistory.length > 0 ? matchHistory : (profileData?.recentMatches || []);
    
    if (allMatches.length === 0) {
      return [
        { date: 'No Data', wpm: 0, accuracy: 0 }
      ];
    }

    // Get more matches to ensure we have data from multiple dates
    const recentMatches = allMatches.slice(0, 50);
    
    // Group matches by actual date
    const dateMap = {};

    recentMatches.forEach(match => {
      if (match.startedAt) {
        const date = new Date(match.startedAt);
        const dateKey = date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
        
        if (!dateMap[dateKey]) {
          dateMap[dateKey] = { wpm: [], accuracy: [] };
        }
        
        dateMap[dateKey].wpm.push(match.wpm);
        dateMap[dateKey].accuracy.push(match.accuracy);
      }
    });

    // Calculate averages for each date and sort by date
    let performanceData = Object.entries(dateMap)
      .map(([date, data]) => {
      const avgWpm = data.wpm.length > 0 ? Math.round(data.wpm.reduce((a, b) => a + b, 0) / data.wpm.length) : 0;
      const avgAccuracy = data.accuracy.length > 0 ? Math.round(data.accuracy.reduce((a, b) => a + b, 0) / data.accuracy.length) : 0;
      
      return {
          date,
          wpm: avgWpm,
          accuracy: avgAccuracy,
          matchCount: data.wpm.length,
          rawWpm: data.wpm,
          rawAccuracy: data.accuracy
        };
      })
      .sort((a, b) => {
        // Sort by actual date (convert back to Date for comparison)
        const dateA = new Date(a.date + ', ' + new Date().getFullYear());
        const dateB = new Date(b.date + ', ' + new Date().getFullYear());
        return dateA - dateB;
      });

    // If we have very few dates, try to get more matches to find different dates
    if (performanceData.length <= 2 && allMatches.length > 50) {
      // Look at more matches to find different dates
      const extendedMatches = allMatches.slice(0, 100);
      const extendedDateMap = {};

      extendedMatches.forEach(match => {
        if (match.startedAt) {
          const date = new Date(match.startedAt);
          const dateKey = date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          });
          
          if (!extendedDateMap[dateKey]) {
            extendedDateMap[dateKey] = { wpm: [], accuracy: [] };
          }
          
          extendedDateMap[dateKey].wpm.push(match.wpm);
          extendedDateMap[dateKey].accuracy.push(match.accuracy);
        }
      });

      performanceData = Object.entries(extendedDateMap)
        .map(([date, data]) => {
          const avgWpm = data.wpm.length > 0 ? Math.round(data.wpm.reduce((a, b) => a + b, 0) / data.wpm.length) : 0;
          const avgAccuracy = data.accuracy.length > 0 ? Math.round(data.accuracy.reduce((a, b) => a + b, 0) / data.accuracy.length) : 0;
          
          return {
            date,
        wpm: avgWpm,
        accuracy: avgAccuracy,
        matchCount: data.wpm.length
      };
        })
        .sort((a, b) => {
          const dateA = new Date(a.date + ', ' + new Date().getFullYear());
          const dateB = new Date(b.date + ', ' + new Date().getFullYear());
          return dateA - dateB;
        });
    }

    // If we still only have one date, show individual matches instead
    if (performanceData.length === 1) {
      const singleDate = performanceData[0];
      const individualMatches = recentMatches.slice(0, 7).map((match, index) => ({
        date: `Match ${index + 1}`,
        wpm: match.wpm || 0,
        accuracy: match.accuracy || 0,
        matchCount: 1
      }));
      return individualMatches;
    }

    // Limit to last 7 dates for better visualization
    const finalData = performanceData.slice(-7);
    
    // Debug logging
    console.log('Performance Data Debug:', {
      totalMatches: allMatches.length,
      uniqueDates: performanceData.length,
      finalDataPoints: finalData.length,
      data: finalData.map(d => ({
        date: d.date,
        avgWpm: d.wpm,
        avgAccuracy: d.accuracy,
        matchCount: d.matchCount,
        rawWpm: d.rawWpm,
        rawAccuracy: d.rawAccuracy
      }))
    });
    
    return finalData;
  };

  const performanceData = calculatePerformanceData();

  // Use real data from API or fallback to defaults
  const userData = profileData?.user || {
    name: "Loading...",
    email: "loading@example.com",
    avatarUrl: "https://ui-avatars.com/api/?name=User&background=random",
    joinDate: new Date(),
    status: "Available for Challenge"
  };

  // Calculate real-time stats from full match history
  const calculateRealTimeStats = () => {
    const allMatches = matchHistory.length > 0 ? matchHistory : (profileData?.recentMatches || []);
    
    if (allMatches.length === 0) {
      return {
    totalMatches: 0,
    wins: 0,
    winRate: 0,
    personalBest: { wpm: 0, accuracy: 0 },
    currentStreak: 0
  };
    }

    let totalMatches = allMatches.length;
    let wins = 0;
    let personalBest = { wpm: 0, accuracy: 0 };
    let currentStreak = 0;

    // Calculate stats from all matches
    allMatches.forEach(match => {
      // Count wins
      if (match.result === 'win') {
        wins++;
      }

      // Update personal best
      if (match.wpm > personalBest.wpm) {
        personalBest.wpm = match.wpm;
      }
      if (match.accuracy > personalBest.accuracy) {
        personalBest.accuracy = match.accuracy;
      }
    });

    // Calculate win rate
    const winRate = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;

    // Calculate current streak (consecutive wins from most recent)
    let streak = 0;
    for (let i = 0; i < allMatches.length; i++) {
      if (allMatches[i].result === 'win') {
        streak++;
      } else {
        break;
      }
    }
    currentStreak = streak;

    return {
      totalMatches,
      wins,
      winRate,
      personalBest,
      currentStreak
    };
  };

  const stats = calculateRealTimeStats();

  // Use matchHistory from Redux store instead of profileData.recentMatches
  const recentMatches = matchHistory.length > 0 ? matchHistory : (profileData?.recentMatches || []);

  // Calculate achievements based on real user performance
  const calculateAchievements = () => {
    const personalBestWpm = stats.personalBest.wpm || 0;
    const personalBestAccuracy = stats.personalBest.accuracy || 0;
    const totalMatches = stats.totalMatches || 0;
    const wins = stats.wins || 0;
    const winRate = stats.winRate || 0;

    return [
      { 
        id: 1, 
        name: 'Speed Demon', 
        description: 'Achieved 90+ WPM', 
        icon: '🚀', 
        unlocked: personalBestWpm >= 90,
        progress: Math.min(personalBestWpm, 90),
        target: 90
      },
      { 
        id: 2, 
        name: 'Accuracy Master', 
        description: 'Maintained 95%+ accuracy', 
        icon: '🎯', 
        unlocked: personalBestAccuracy >= 95,
        progress: Math.min(personalBestAccuracy, 95),
        target: 95
      },
      { 
        id: 3, 
        name: 'Win Streak', 
        description: 'Achieved 70%+ win rate', 
        icon: '🔥', 
        unlocked: winRate >= 70,
        progress: Math.min(winRate, 70),
        target: 70
      },
      { 
        id: 4, 
        name: 'Century Club', 
        description: '100+ matches played', 
        icon: '💯', 
        unlocked: totalMatches >= 100,
        progress: Math.min(totalMatches, 100),
        target: 100
      },
      { 
        id: 5, 
        name: 'Perfectionist', 
        description: 'Achieve 100% accuracy', 
        icon: '⭐', 
        unlocked: personalBestAccuracy >= 100,
        progress: Math.min(personalBestAccuracy, 100),
        target: 100
      },
      { 
        id: 6, 
        name: 'Speed Racer', 
        description: 'Achieved 120+ WPM', 
        icon: '⚡', 
        unlocked: personalBestWpm >= 120,
        progress: Math.min(personalBestWpm, 120),
        target: 120
      }
    ];
  };

  const achievements = calculateAchievements();

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

  const navigator  = useNavigate();
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

  const handleLoadMoreMatches = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    dispatch(fetchUserMatches({ page: nextPage, limit: 20 }));
  };

  const handleRefreshData = () => {
    dispatch(fetchUserProfile());
    dispatch(fetchUserMatches({ page: 1, limit: 50 }));
    setCurrentPage(1);
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
            {/* Data Source Info */}
            <div className={`${darkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50/80 border-blue-200/50'} backdrop-blur-sm border rounded-xl p-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-sm font-medium ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                    Live Data from {matchHistory.length} Matches
                  </h3>
                  <p className={`text-xs ${darkMode ? 'text-blue-400' : 'text-blue-600'} mt-1`}>
                    Stats and graphs update automatically with your match history
                  </p>
                </div>
                <button
                  onClick={handleRefreshData}
                  disabled={profileLoading}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-800' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white disabled:bg-blue-400'
                  } disabled:opacity-50`}
                >
                  <RefreshCw className={`w-4 h-4 ${profileLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Stats Grid */}
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

            {/* Performance Chart */}
            <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gradient-to-br from-white/80 to-sky-50/80 border-sky-200/50'} backdrop-blur-sm border rounded-xl p-4 sm:p-6`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {performanceData.length > 0 && performanceData[0].date.startsWith('Match') ? 'Recent Matches Performance' : 'Performance by Date'}
              </h3>
                {performanceData.length > 0 && performanceData[0].date !== 'No Data' && (
                  <div className="text-right">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {performanceData.length} {performanceData[0].date.startsWith('Match') ? 'matches' : 'date' + (performanceData.length !== 1 ? 's' : '')} • {performanceData.reduce((total, day) => total + day.matchCount, 0)} total
                    </span>
                    <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} mt-1`}>
                      Avg: {Math.round(performanceData.reduce((sum, d) => sum + d.wpm, 0) / performanceData.length)} WPM • {Math.round(performanceData.reduce((sum, d) => sum + d.accuracy, 0) / performanceData.length)}% Accuracy
                    </div>
                  </div>
                )}
              </div>
              {performanceData.length > 0 && performanceData[0].date !== 'No Data' ? (
                <div className="w-full overflow-x-auto">
                  <ResponsiveContainer width="100%" height={350} minWidth={400}>
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                      <XAxis dataKey="date" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                      <YAxis 
                        yAxisId="left"
                        stroke={darkMode ? '#9ca3af' : '#6b7280'} 
                        label={{ value: 'WPM', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: darkMode ? '#9ca3af' : '#6b7280' } }}
                        domain={[0, 'dataMax + 10']}
                      />
                      <YAxis 
                        yAxisId="right"
                        orientation="right"
                        stroke={darkMode ? '#9ca3af' : '#6b7280'} 
                        label={{ value: 'Accuracy %', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fill: darkMode ? '#9ca3af' : '#6b7280' } }}
                        domain={[0, 100]}
                      />
                      <Tooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const matchIndex = recentMatches.length - parseInt(label.split(' ')[1]);
                            const match = recentMatches[matchIndex];
                            const wpmData = payload.find(p => p.dataKey === 'wpm');
                            const accuracyData = payload.find(p => p.dataKey === 'accuracy');
                            
                            return (
                              <div className={`${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'} border rounded-lg shadow-lg p-4 max-w-xs`}>
                                <div className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3 text-center`}>
                                  🎯 {label}
                                </div>
                                <div className="space-y-3">
                                  {wpmData && (
                                    <div className="space-y-1">
                                      <div className="flex items-center justify-between">
                                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                          ⚡ WPM:
                                        </span>
                                        <span className={`text-sm font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                          {wpmData.value} WPM
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                  {accuracyData && (
                                    <div className="space-y-1">
                                      <div className="flex items-center justify-between">
                                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                          🎯 Accuracy:
                                        </span>
                                        <span className={`text-sm font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                                          {accuracyData.value}%
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                  {match && (
                                    <div className="space-y-2 pt-2 border-t border-gray-300 dark:border-gray-600">
                                      <div className="flex items-center justify-between">
                                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                          📅 Date:
                                        </span>
                                        <span className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                          {match.startedAt ? new Date(match.startedAt).toLocaleDateString('en-US', { 
                                            year: 'numeric',
                                            month: 'short', 
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                          }) : 'N/A'}
                                        </span>
                                      </div>
                                   
                                      {match.duration && (
                                        <div className="flex items-center justify-between">
                                          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            ⏱️ Duration:
                                          </span>
                                          <span className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {Math.round(match.duration / 1000)}s
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="wpm" 
                        stroke="#3b82f6" 
                        strokeWidth={3} 
                        dot={{ 
                          r: 6, 
                          fill: '#3b82f6', 
                          stroke: '#ffffff', 
                          strokeWidth: 2,
                          fillOpacity: 0.8
                        }}
                        activeDot={{ 
                          r: 8, 
                          fill: '#3b82f6', 
                          stroke: '#ffffff', 
                          strokeWidth: 3 
                        }}
                        name="WPM"
                      >
                        <LabelList 
                          dataKey="wpm" 
                          position="top" 
                          offset={10}
                          style={{ 
                            fontSize: '10px', 
                            fill: darkMode ? '#3b82f6' : '#1e40af',
                            fontWeight: 'bold'
                          }}
                          formatter={(value) => `${value} WPM`}
                        />
                      </Line>
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="accuracy" 
                        stroke="#10b981" 
                        strokeWidth={3} 
                        dot={{ 
                          r: 6, 
                          fill: '#10b981', 
                          stroke: '#ffffff', 
                          strokeWidth: 2,
                          fillOpacity: 0.8
                        }}
                        activeDot={{ 
                          r: 8, 
                          fill: '#10b981', 
                          stroke: '#ffffff', 
                          strokeWidth: 3 
                        }}
                        name="Accuracy"
                      >
                        <LabelList 
                          dataKey="accuracy" 
                          position="bottom" 
                          offset={10}
                          style={{ 
                            fontSize: '10px', 
                            fill: darkMode ? '#10b981' : '#059669',
                            fontWeight: 'bold'
                          }}
                          formatter={(value) => `${value}%`}
                        />
                      </Line>
                      <Legend 
                        verticalAlign="top" 
                        height={36}
                        wrapperStyle={{
                          paddingTop: '10px'
                        }}
                        formatter={(value) => {
                          if (value === 'wpm') return 'Average WPM';
                          if (value === 'accuracy') return 'Average Accuracy %';
                          return value;
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <TrendingUp className={`w-16 h-16 mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                  <p className={`text-lg font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    No performance data yet
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Complete some typing matches to see your performance trends
                  </p>
                </div>
              )}
            </div>

            {/* Motivational Quote */}
            <div className={`${darkMode ? 'bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-700' : 'bg-gradient-to-r from-white/80 to-sky-100/80 border-sky-200/50'} backdrop-blur-sm border rounded-xl p-4 sm:p-6`}>
              <div className="text-center">
                <p className={`text-base sm:text-lg font-medium italic ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  "{currentQuote}"
                </p>
                <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Daily Motivation
                </p>
              </div>
            </div>
          </div>
        );

      case 'achievements':
        return (
          <div className="space-y-4 sm:space-y-6">
            <h2 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Achievements</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => {
                const progressPercentage = (achievement.progress / achievement.target) * 100;
                return (
                  <div key={achievement.id} className={`${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gradient-to-br from-white/80 to-sky-50/80 border-sky-200/50'} backdrop-blur-sm border rounded-xl p-4 sm:p-6 transition-all duration-300 ${achievement.unlocked ? 'opacity-100 scale-105' : 'opacity-70 hover:opacity-90'}`}>
                    <div className="text-center">
                      <div className={`text-3xl sm:text-4xl mb-2 ${achievement.unlocked ? 'animate-bounce' : ''}`}>
                        {achievement.icon}
                      </div>
                      <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {achievement.name}
                      </h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                        {achievement.description}
                      </p>
                      
                      {/* Progress Bar */}
                      <div className="mb-2">
                        <div className={`w-full bg-gray-200 rounded-full h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              achievement.unlocked 
                                ? 'bg-gradient-to-r from-green-400 to-green-600' 
                                : 'bg-gradient-to-r from-blue-400 to-blue-600'
                            }`}
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs mt-1">
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                            {achievement.progress}
                          </span>
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                            {achievement.target}
                          </span>
                        </div>
                      </div>
                      
                      {achievement.unlocked && (
                        <div className="mt-2">
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                          <p className="text-xs text-green-500 font-medium mt-1">Unlocked!</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'matches':
        return (
          <div className="space-y-4 sm:space-y-6">
            <h2 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Match History</h2>
            {profileLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <span className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading matches...</span>
              </div>
            ) : recentMatches.length > 0 ? (
              <div className="space-y-4">
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                  Showing {recentMatches.length} of {matchPagination?.total || recentMatches.length} matches
                </div>
                {recentMatches.map((match) => {
                  // Format the date
                  const matchDate = match.startedAt ? new Date(match.startedAt) : new Date();
                  const formattedDate = matchDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });
                  
                  // Determine match result based on win/loss
                  const getResultDisplay = (result) => {
                    if (result === 'win') return { text: 'WIN', class: 'bg-green-500/20 text-green-400' };
                    if (result === 'loss') return { text: 'LOSS', class: 'bg-red-500/20 text-red-400' };
                    return { text: 'N/A', class: 'bg-gray-500/20 text-gray-400' };
                  };
                  
                  const result = getResultDisplay(match.result);
                  
                  return (
                    <div key={match._id || match.id} className={`${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gradient-to-br from-white/80 to-sky-50/80 border-sky-200/50'} backdrop-blur-sm border rounded-xl p-4 hover:scale-105 transition-all duration-300`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          <div className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${
                            match.mode === 'multiplayer' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                          }`}>
                            {match.mode || 'multiplayer'}
                          </div>
                          <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            <span className="font-semibold">{match.wpm || 0} WPM</span> • 
                            <span className="font-semibold"> {match.accuracy || 0}%</span> Accuracy
                            {match.errors && <span> • {match.errors} errors</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`px-2 py-1 rounded text-xs font-medium ${result.class}`}>
                            {result.text}
                          </div>
                          <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            {formattedDate}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {/* Load More Button */}
                {hasMoreMatches && (
                  <div className="flex justify-center pt-4">
                    <button
                      onClick={handleLoadMoreMatches}
                      disabled={profileLoading}
                      className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        darkMode 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-600' 
                          : 'bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-400'
                      } disabled:opacity-50`}
                    >
                      {profileLoading ? (
                        <div className="flex items-center">
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Loading...
                        </div>
                      ) : (
                        'Load More Matches'
                      )}
                    </button>
                  </div>
                )}
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

      case 'stats':
        return (
          <div className="space-y-4 sm:space-y-6">
            <h2 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Detailed Statistics</h2>
            
            {/* Overall Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <StatCard 
                title="Total Matches" 
                value={stats.totalMatches || 0} 
                subtitle="All time"
                icon={Activity} 
                color="blue" 
              />
              <StatCard 
                title="Total Wins" 
                value={stats.wins || 0} 
                subtitle={`${stats.winRate || 0}% win rate`}
                icon={Trophy} 
                color="yellow" 
              />
              <StatCard 
                title="Current Streak" 
                value={stats.currentStreak || 0} 
                subtitle="Consecutive wins"
                icon={Zap} 
                color="green" 
              />
              <StatCard 
                title="Best Performance" 
                value={`${stats.personalBest?.wpm || 0} WPM`} 
                subtitle={`${stats.personalBest?.accuracy || 0}% accuracy`}
                icon={Target} 
                color="purple" 
              />
            </div>

            {/* Performance Analysis */}
            {recentMatches.length > 0 && (
              <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gradient-to-br from-white/80 to-sky-50/80 border-sky-200/50'} backdrop-blur-sm border rounded-xl p-4 sm:p-6`}>
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Performance Analysis
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* WPM Distribution */}
                  <div>
                    <h4 className={`font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>WPM Distribution</h4>
                    <div className="space-y-2">
                      {(() => {
                        const wpmRanges = [
                          { range: '0-30', label: 'Beginner', color: 'bg-red-500' },
                          { range: '31-50', label: 'Intermediate', color: 'bg-yellow-500' },
                          { range: '51-70', label: 'Advanced', color: 'bg-blue-500' },
                          { range: '71-90', label: 'Expert', color: 'bg-green-500' },
                          { range: '90+', label: 'Master', color: 'bg-purple-500' }
                        ];
                        
                        const wpmCounts = wpmRanges.map(range => {
                          const [min, max] = range.range === '90+' ? [90, Infinity] : range.range.split('-').map(Number);
                          const count = recentMatches.filter(match => {
                            const wpm = match.wpm || 0;
                            return range.range === '90+' ? wpm >= min : wpm >= min && wpm <= max;
                          }).length;
                          return { ...range, count };
                        });
                        
                        return wpmCounts.map((range, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full ${range.color}`}></div>
                              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {range.label} ({range.range})
                              </span>
                            </div>
                            <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {range.count}
                            </span>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>

                  {/* Accuracy Analysis */}
                  <div>
                    <h4 className={`font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Accuracy Analysis</h4>
                    <div className="space-y-2">
                      {(() => {
                        const accuracyRanges = [
                          { range: '0-80%', label: 'Needs Improvement', color: 'bg-red-500' },
                          { range: '81-90%', label: 'Good', color: 'bg-yellow-500' },
                          { range: '91-95%', label: 'Very Good', color: 'bg-blue-500' },
                          { range: '96-99%', label: 'Excellent', color: 'bg-green-500' },
                          { range: '100%', label: 'Perfect', color: 'bg-purple-500' }
                        ];
                        
                        const accuracyCounts = accuracyRanges.map(range => {
                          const [min, max] = range.range === '100%' ? [100, 100] : range.range.replace('%', '').split('-').map(Number);
                          const count = recentMatches.filter(match => {
                            const accuracy = match.accuracy || 0;
                            return range.range === '100%' ? accuracy === 100 : accuracy >= min && accuracy <= max;
                          }).length;
                          return { ...range, count };
                        });
                        
                        return accuracyCounts.map((range, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full ${range.color}`}></div>
                              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {range.label} ({range.range})
                              </span>
                            </div>
                            <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {range.count}
                            </span>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Performance Trend */}
            {recentMatches.length > 0 && (
              <div className={`${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gradient-to-br from-white/80 to-sky-50/80 border-sky-200/50'} backdrop-blur-sm border rounded-xl p-4 sm:p-6`}>
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Recent Performance Trend
                </h3>
                <div className="w-full overflow-x-auto">
                  <ResponsiveContainer width="100%" height={300} minWidth={400}>
                    <BarChart data={recentMatches.slice(0, 20).reverse().map((match, index) => ({
                      match: `Match ${recentMatches.length - index}`,
                      wpm: match.wpm || 0,
                      accuracy: match.accuracy || 0,
                      date: match.startedAt ? new Date(match.startedAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'N/A'
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                      <XAxis dataKey="match" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                      <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                      <Tooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const matchIndex = recentMatches.length - parseInt(label.split(' ')[1]);
                            const match = recentMatches[matchIndex];
                            const wpmData = payload.find(p => p.dataKey === 'wpm');
                            const accuracyData = payload.find(p => p.dataKey === 'accuracy');
                            
                            return (
                              <div className={`${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'} border rounded-lg shadow-lg p-4 max-w-xs`}>
                                <div className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3 text-center`}>
                                  🎯 {label}
                                </div>
                                <div className="space-y-3">
                                  {wpmData && (
                                    <div className="space-y-1">
                                      <div className="flex items-center justify-between">
                                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                          ⚡ WPM:
                                        </span>
                                        <span className={`text-sm font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                          {wpmData.value} WPM
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                  {accuracyData && (
                                    <div className="space-y-1">
                                      <div className="flex items-center justify-between">
                                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                          🎯 Accuracy:
                                        </span>
                                        <span className={`text-sm font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                                          {accuracyData.value}%
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                  {match && (
                                    <div className="space-y-2 pt-2 border-t border-gray-300 dark:border-gray-600">
                                      <div className="flex items-center justify-between">
                                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                          📅 Date:
                                        </span>
                                        <span className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                          {match.startedAt ? new Date(match.startedAt).toLocaleDateString('en-US', { 
                                            year: 'numeric',
                                            month: 'short', 
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                          }) : 'N/A'}
                                        </span>
                                      </div>
                                     
                                      {match.duration && (
                                        <div className="flex items-center justify-between">
                                          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            ⏱️ Duration:
                                          </span>
                                          <span className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {Math.round(match.duration / 1000)}s
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="wpm" fill="#3b82f6" name="WPM" />
                      <Bar dataKey="accuracy" fill="#10b981" name="Accuracy" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {recentMatches.length === 0 && (
              <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No statistics available</p>
                <p className="text-sm mt-2">Complete some typing matches to see detailed statistics</p>
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
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-white via-sky-50 to-blue-50'} transition-colors duration-300 relative overflow-hidden`}>
      <CircuitBackground darkMode={darkMode} />
      {/* Scrollable Header */}
      <header className={`sticky top-0 md:z-[100] ${darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700' : 'bg-gradient-to-r from-blue-500 to-purple-600 border-blue-400'} backdrop-blur-sm border-b shadow-lg`}>
        <div className="flex items-center justify-between px-4 py-7">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={toggleSidebar}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'text-white hover:bg-gray-700' 
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-lg ${darkMode ? 'bg-white/20' : 'bg-white/30'} flex items-center justify-center`}>
                <Zap className={`w-5 h-5 ${darkMode ? 'text-yellow-400' : 'text-yellow-300'}`} />
              </div>
              <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-white'} truncate`}>
                TypeSpeed Pro
              </h1>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center space-x-6">
            <button  onClick={() => navigator("/")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                darkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                  : 'text-white/90 hover:text-white hover:bg-white/20'
              }`}
            >
              Home
            </button>
            <button  onClick={() => navigator("/contest")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                darkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                  : 'text-white/90 hover:text-white hover:bg-white/20'
              }`}
            >
              Contest
            </button>
            <button  onClick={() => navigator("/typing")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                darkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                  : 'text-white/90 hover:text-white hover:bg-white/20'
              }`}
            >
              Typing
            </button>
          </nav>

          {/* User Status and Theme Toggle */}
          <div className="flex items-center space-x-3">
            <button 
              className={`p-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'text-white hover:bg-gray-700' 
                  : 'text-white hover:bg-white/20'
              }`}
              onClick={handleRefreshData}
              disabled={profileLoading}
            >
              <RefreshCw className={`w-5 h-5 ${profileLoading ? 'animate-spin' : ''}`} />
            </button>
            <div className={`hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
              darkMode 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-white/20 text-white border border-white/30'
            }`}>
              <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
              <span className="hidden md:inline">Online</span>
            </div>
            <button 
              className={`p-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'text-white hover:bg-gray-700' 
                  : 'text-white hover:bg-white/20'
              }`}
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden  border-t border-white/20">
          <nav className="flex items-center justify-around px-4 py-2">
            <button 
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                darkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                  : 'text-white/90 hover:text-white hover:bg-white/20'
              }`}
            >
              Home
            </button>
            <button 
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                darkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                  : 'text-white/90 hover:text-white hover:bg-white/20'
              }`}
            >
              Contest
            </button>
            <button 
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                darkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                  : 'text-white/90 hover:text-white hover:bg-white/20'
              }`}
            >
              Typing
            </button>
          </nav>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 ${darkMode ? 'bg-gray-800/50' : 'bg-white/80'} backdrop-blur-sm border-r ${darkMode ? 'border-gray-700' : 'border-sky-200/50'} transition-transform duration-300`}>
          <div className="p-4 h-full  pt-20 lg:pt-4">
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
          <main className="p-4 sm:p-6 pt-20 lg:pt-6">
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
      <footer className={`${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-sky-200/50'} backdrop-blur-sm border-t relative overflow-hidden`}>
  {/* Background decoration */}
  <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-r from-blue-600/5 to-purple-600/5' : 'bg-gradient-to-r from-sky-500/5 to-blue-500/5'}`}></div>
  
  <div className="relative px-4 sm:px-6 py-8">
    {/* Main footer content */}
    <div className="max-w-6xl mx-auto">
      {/* Top section with links */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand section */}
        <div className="col-span-1 md:col-span-2">
          <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
            TypeSpeed Pro
          </h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4 max-w-md`}>
            Master the art of typing with our advanced speed testing platform. Track your progress, compete with others, and become a typing champion.
          </p>
          {/* Social links */}
          <div className="flex space-x-4">
            <a 
              href="#" 
              className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors duration-200`}
              aria-label="Twitter"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
              </svg>
            </a>
            <a 
              href="#" 
              className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors duration-200`}
              aria-label="GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a 
              href="#" 
              className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors duration-200`}
              aria-label="Discord"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.369a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h4 className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-900'} mb-3`}>
            Quick Links
          </h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className={`text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors duration-200`}>
                Speed Test
              </a>
            </li>
            <li>
              <a href="#" className={`text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors duration-200`}>
                Leaderboard
              </a>
            </li>
            <li>
              <a href="#" className={`text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors duration-200`}>
                Practice
              </a>
            </li>
            <li>
              <a href="#" className={`text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors duration-200`}>
                Statistics
              </a>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-900'} mb-3`}>
            Support
          </h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className={`text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors duration-200`}>
                Help Center
              </a>
            </li>
            <li>
              <a href="#" className={`text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors duration-200`}>
                Contact Us
              </a>
            </li>
            <li>
              <a href="#" className={`text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors duration-200`}>
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className={`text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors duration-200`}>
                Terms of Service
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} mb-6`}></div>

      {/* Bottom section */}
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        {/* Copyright */}
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          © 2025 TypeSpeed Pro. Built for speed enthusiasts.
        </p>

        {/* Additional info */}
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-green-400' : 'bg-green-500'}`}></div>
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              All systems operational
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Made with ❤️ for typists
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Decorative elements */}
  <div className={`absolute top-0 left-0 w-full h-px ${darkMode ? 'bg-gradient-to-r from-transparent via-blue-500/20 to-transparent' : 'bg-gradient-to-r from-transparent via-sky-500/20 to-transparent'}`}></div>
</footer>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default DashBoard;