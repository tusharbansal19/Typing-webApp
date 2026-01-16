import React from 'react';

const PageLoader = () => {
  const text = "FastFinger";
  // Cosmic palette: Neon Cyan, Electric Purple, Hot Pink, Deep Blue, etc.
  const cosmicStyles = [
    "bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.8)] border-cyan-300",
    "bg-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.8)] border-purple-400",
    "bg-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.8)] border-fuchsia-300",
    "bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)] border-indigo-300",
    "bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] border-blue-300",
    "bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.8)] border-pink-300",
    "bg-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.8)] border-violet-300",
    "bg-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.8)] border-sky-300",
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900 overflow-hidden">
      {/* Background stars effect could be added here if desired, but keeping to the prompt requests */}
      <div className="flex space-x-1 md:space-x-2 perspective-1000">
        {text.split('').map((char, index) => (
          <div
            key={index}
            className={`
              relative w-8 h-12 md:w-12 md:h-16 
              flex items-center justify-center 
              border-2
              text-white text-xl md:text-3xl font-bold font-mono
              transform-gpu
              ${cosmicStyles[index % cosmicStyles.length]}
              animate-char
            `}
            style={{
              '--delay': `${index * 0.1}s`,
              '--wave-delay': `${index * 0.1 + 0.8}s`
            }}
          >
            {char}
          </div>
        ))}
      </div>

      <style jsx>{`
        .animate-char {
          opacity: 0;
          animation: 
            slideIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards,
            wave 2s ease-in-out infinite;
          animation-delay: var(--delay), var(--wave-delay);
        }

        @keyframes slideIn {
          0% {
            opacity: 0;
            transform: translateX(-100vw) rotateY(-180deg);
          }
          60% {
            opacity: 1;
          }
          100% {
            opacity: 1;
            transform: translateX(0) rotateY(0deg);
          }
        }

        @keyframes wave {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
};

export default PageLoader; 