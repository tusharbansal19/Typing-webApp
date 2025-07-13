import React, { useState, useEffect, useRef } from 'react';
import { Github, Linkedin, Download, Award, Code, Zap, Users, Target, Globe, Sparkles, ArrowRight } from 'lucide-react';

// Helper hook for scroll-in-view animation
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

const AboutUs = ({darkMode}) => {
  const [ setdarkMode] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const toggleTheme = () => {
    setdarkMode(!darkMode);
  };

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

  const AnimatedBadge = ({ text, icon: Icon, delay = 0 }) => (
    <div 
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold
        ${darkMode ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white border border-purple-500/30' 
                 : 'bg-gradient-to-r from-purple-100 to-cyan-100 text-purple-800 border border-purple-200'}
        backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105
        animate-pulse`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <Icon className="w-3 h-3" />
      {text}
    </div>
  );

  const SkillChip = ({ skill, index }) => (
    <span 
      className={`inline-block px-3 py-1 rounded-full text-sm font-medium transition-all duration-300
        ${darkMode ? 'bg-gray-800/50 text-gray-300 border border-gray-700/50 hover:bg-gray-700/50 hover:border-gray-600' 
                 : 'bg-white/50 text-gray-700 border border-gray-200 hover:bg-white/80 hover:border-gray-300'}
        backdrop-blur-sm hover:scale-105 cursor-default`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {skill}
    </span>
  );

  // Section refs for scroll motion
  const [heroRef, heroInView] = useInView(0.2);
  const [missionRef, missionInView] = useInView(0.15);
  const [storyRef, storyInView] = useInView(0.15);
  const [founderRef, founderInView] = useInView(0.15);
  const [connectRef, connectInView] = useInView(0.15);

  return (
    <div className={`min-h-screen transition-all duration-500 relative overflow-hidden
      ${
      darkMode
        ? 'bg-gradient-to-br from-blue-950 via-black-900 to-gray-900'
        : 'bg-gradient-to-br from-blue-100 via-white to-blue-200'
    }
    `
    }>
      

      {/* Background Elements */}
      <FloatingOrbs />
      <CircuitBackground />

      {/* Hero Section */}
      <section ref={heroRef} className={`relative min-h-screen flex items-center justify-center px-6 transition-all duration-1000
        ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
      `}>
        <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="text-center max-w-6xl mx-auto">
            {/* Main Heading */}
            <div className="mb-8">
              <h1 className="text-6xl md:text-8xl font-bold mb-6">
                <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
                  TypeSpeed
                </span>
                <br />
                <span className="text-3xl md:text-5xl font-normal">
                  Championship
                </span>
              </h1>
              <p className={`text-xl md:text-2xl mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Where typing meets innovation. Real-time competition, endless possibilities.
              </p>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <AnimatedBadge text="Real-Time Engine" icon={Zap} delay={0} />
              <AnimatedBadge text="Global Leaderboards" icon={Globe} delay={200} />
              <AnimatedBadge text="Performance Analytics" icon={Target} delay={400} />
              <AnimatedBadge text="Multiplayer Ready" icon={Users} delay={600} />
            </div>

            {/* CTA Button */}
            <button className={`group px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300
              bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600
              text-white shadow-lg hover:shadow-xl transform hover:scale-105`}>
              <span className="flex items-center gap-2">
                Explore the Platform
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section ref={missionRef} className={`py-20 px-6 transition-all duration-1000 ${missionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Our Mission
            </span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Code,
                title: "Innovation First",
                description: "Pushing the boundaries of real-time web applications with cutting-edge technology and seamless user experiences."
              },
              {
                icon: Users,
                title: "Community Driven",
                description: "Building a global community of typing enthusiasts who compete, learn, and grow together in real-time."
              },
              {
                icon: Target,
                title: "Performance Excellence",
                description: "Delivering lightning-fast, accurate typing analytics that help users track progress and achieve their goals."
              }
            ].map((item, index) => (
              <div key={index} className={`p-8 rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:transform hover:scale-105
                ${darkMode ? 'bg-gray-800/30 border-gray-700/50 hover:bg-gray-800/50' : 'bg-white/30 border-gray-200/50 hover:bg-white/50'}
                shadow-lg hover:shadow-xl`}>
                <item.icon className="w-12 h-12 text-purple-500 mb-6" />
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        </section>

      {/* Our Story Section */}
      <section ref={storyRef} className={`py-20 px-6 relative transition-all duration-1000 ${storyInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <FloatingOrbs />
        <CircuitBackground />
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-16">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Our Story
            </span>
          </h2>
          <div className={`p-8 rounded-2xl backdrop-blur-sm border
            ${darkMode ? 'bg-gray-800/30 border-gray-700/50' : 'bg-white/30 border-gray-200/50'}
            shadow-lg`}>
            <p className={`text-lg leading-relaxed mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Born from a passion for both technology and the art of typing, TypeSpeed Championship emerged as a vision to revolutionize how we think about typing competitions. What started as a simple idea has evolved into a comprehensive platform that combines real-time multiplayer functionality with advanced performance analytics.
            </p>
            <p className={`text-lg leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Built with modern web technologies and powered by Socket.IO for real-time communication, our platform delivers an unparalleled typing experience that connects users worldwide in competitive, engaging, and educational ways.
            </p>
          </div>
        </div>
        </section>

      {/* Meet the Founder Section */}
      <section ref={founderRef} className={`py-20 px-6 transition-all duration-1000 relative ${founderInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <FloatingOrbs />
        <CircuitBackground />
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Meet the Founder
            </span>
          </h2>
          {/* Founder Profile Card */}
          <div className="max-w-4xl mx-auto">
            <div className={`relative group flex flex-col md:flex-row items-center md:items-stretch gap-8 p-8 rounded-3xl backdrop-blur-sm border transition-all duration-500
              ${darkMode ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50' : 'bg-gradient-to-br from-white/50 to-gray-50/50 border-gray-200/50'}
              shadow-2xl hover:shadow-3xl hover:scale-[1.02] hover:rotate-1`}>
              {/* Glowing Border Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {/* Founder Badge */}
              <div className="absolute -top-4 left-8 z-20">
                <div className={`px-6 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg animate-pulse`}>
                  <Sparkles className="w-4 h-4 inline mr-2" />
                  Founder & Visionary
                </div>
              </div>
              {/* Profile Image or Avatar */}
              <div className="flex-shrink-0 flex items-center justify-center md:justify-start w-full md:w-56">
                {/* If you have a founder image, replace the src below. Otherwise, show avatar fallback. */}
                {/* <img src="/path/to/founder.jpg" alt="Tushar Bansal" className="w-40 h-40 md:w-48 md:h-48 object-cover rounded-2xl border-4 border-gradient-to-r from-purple-500 to-cyan-500 shadow-xl" /> */}
                <div className="w-40 h-40 md:w-48 md:h-48 rounded-2xl border-4 border-gradient-to-r from-purple-500 to-cyan-500 bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-6xl font-bold text-white shadow-xl">
                  TB
                </div>
                {/* Top Developer Badge */}
                <div className="absolute -bottom-2 left-1/2 md:left-auto md:-right-2 transform -translate-x-1/2 md:translate-x-0">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    <Award className="w-3 h-3 inline mr-1" />
                    Top Developer
                  </div>
                </div>
              </div>
              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left flex flex-col justify-center">
                <h3 className="text-4xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    Tushar Bansal
                  </span>
                </h3>
                <p className="text-xl text-purple-500 font-semibold mb-4">
                  Founder & Full Stack Developer
                </p>
                <p className={`text-lg mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Passionate about creating real-time web experiences that push the boundaries of modern technology. Specializing in full-stack development with a focus on performance and user experience.</p>
                {/* Skills */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold mb-3">Technical Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'Node.js', 'Socket.IO', 'MongoDB', 'MERN Stack', 'Web Performance', 'Real-Time Systems', 'Tailwind CSS'].map((skill, index) => (
                      <SkillChip key={skill} skill={skill} index={index} />
                    ))}
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <button className={`group flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300
                    ${darkMode ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700' : 'bg-white hover:bg-gray-50 border border-gray-200'}
                    shadow-lg hover:shadow-xl transform hover:scale-105`}>
                    <Github className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    GitHub
                  </button>
                  <button className={`group flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300
                    bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700
                    text-white shadow-lg hover:shadow-xl transform hover:scale-105`}>
                    <Linkedin className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    LinkedIn
                  </button>
                  <button className={`group flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300
                    bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700
                    text-white shadow-lg hover:shadow-xl transform hover:scale-105`}>
                    <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                    Resume
                  </button>
                </div>
              </div>
            </div>
          </div>
          </div>
        </section>

        {/* Connect With Us Section */}
      <section ref={connectRef} className={`py-20 px-6 transition-all duration-1000 ${connectInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-16">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Connect With Us
            </span>
          </h2>
          
          <div className={`p-8 rounded-2xl backdrop-blur-sm border
            ${darkMode ? 'bg-gray-800/30 border-gray-700/50' : 'bg-white/30 border-gray-200/50'}
            shadow-lg mb-8`}>
            <p className={`text-lg leading-relaxed mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              We're always excited to connect with fellow developers, typing enthusiasts, and innovators. 
              Whether you have feedback, ideas, or just want to say hello, we'd love to hear from you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className={`group px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300
                bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600
                text-white shadow-lg hover:shadow-xl transform hover:scale-105`}>
                <span className="flex items-center gap-2">
                  Join the Community
                  <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </span>
              </button>
              <button className={`group px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300
                ${darkMode ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700' : 'bg-white hover:bg-gray-50 border border-gray-200'}
                shadow-lg hover:shadow-xl transform hover:scale-105`}>
                <span className="flex items-center gap-2">
                  Get Support
                  <Target className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </span>
              </button>
            </div>
          </div>
          </div>
        </section>

      {/* Footer */}
      <footer className={`py-12 px-6 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-6xl mx-auto text-center">
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            © 2025 TypeSpeed Championship. Built with passion, powered by innovation.
          </p>
      </div>
      </footer>
      {/* Internal CSS for smooth motion (for browsers that don't support Tailwind's translate-y-10) */}
      <style>{`
        .translate-y-10 { transform: translateY(2.5rem); }
        .translate-y-0 { transform: translateY(0); }
        .opacity-0 { opacity: 0; }
        .opacity-100 { opacity: 1; }
      `}</style>
    </div>
  );
};

export default AboutUs;