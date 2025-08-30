import React, { useEffect } from 'react';

interface AnimatedBackgroundProps {
  children: React.ReactNode;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ children }) => {
  useEffect(() => {
    let animationId: number;
    let isActive = true;
    
    const initStars = () => {
      try {
        const container = document.querySelector('.starry-background');
        if (!container || !isActive) return;
        
        container.innerHTML = '';
        
        const starCount = window.innerWidth < 768 ? 3000 : 3000;
        
        for (let i = 0; i < starCount; i++) {
          if (!isActive) break;
          
          const star = document.createElement('div');
          const size = Math.random();
          
          if (size > 0.95) {
            star.className = 'star large';
          } else if (size > 0.85) {
            star.className = 'star medium';
          } else {
            star.className = 'star';
          }
          
          star.style.left = Math.random() * 100 + '%';
          star.style.top = Math.random() * 100 + '%';
          star.style.animationDelay = Math.random() * 4 + 's';
          star.style.animationDuration = (Math.random() * 3 + 3) + 's';
          
          container.appendChild(star);
        }
      } catch (error) {
        console.warn('Star animation failed:', error);
      }
    };
    
    animationId = requestAnimationFrame(initStars);
    
    return () => {
      isActive = false;
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      const container = document.querySelector('.starry-background');
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return (
    <>
      <style>{`
        .animated-container {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          min-height: 100vh;
          position: relative;
          overflow: hidden;
        }
        
        .starry-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: 0;
          will-change: auto;
          contain: layout style paint;
        }
        
        .animated-container > * {
          position: relative;
          z-index: 1;
        }
        
        .star {
          position: absolute;
          background: white;
          border-radius: 50%;
          width: 1px;
          height: 1px;
          box-shadow: 0 0 2px rgba(255, 255, 255, 0.6);
          animation: twinkle 3s infinite ease-in-out;
          will-change: opacity, transform;
          transform: translateZ(0);
        }
        
        .star.medium {
          width: 1.5px;
          height: 1.5px;
          box-shadow: 0 0 3px rgba(255, 255, 255, 0.7);
          animation: twinkle 4s infinite ease-in-out;
        }
        
        .star.large {
          width: 2px;
          height: 2px;
          box-shadow: 0 0 4px rgba(255, 255, 255, 0.8);
          animation: twinkle 5s infinite ease-in-out;
        }
        
        @keyframes twinkle {
          0%, 100% { 
            opacity: 0.3;
            transform: translateZ(0) scale(0.9);
          }
          50% { 
            opacity: 1;
            transform: translateZ(0) scale(1.1);
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          .star { 
            animation: none;
            opacity: 0.5;
          }
        }
        
        @media (max-width: 768px) {
          .star {
            animation-duration: 4s;
          }
          .star.medium {
            animation-duration: 5s;
          }
          .star.large {
            animation-duration: 6s;
          }
        }
      `}</style>
      
      <div className="animated-container">
        <div className="starry-background"></div>
        {children}
      </div>
    </>
  );
};

export default AnimatedBackground;