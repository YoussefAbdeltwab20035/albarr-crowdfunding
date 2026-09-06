import { useEffect } from 'react';

export default function Confetti() {
  useEffect(() => {
    // محاكاة تأثير قصاصات احتفالية عبر عناصر خفيفة
    const container = document.getElementById('confetti-container');
    if (!container) return;

    const colors = ['#059669', '#10b981', '#34d399', '#f59e0b', '#3b82f6', '#ec4899'];
    for (let i = 0; i < 40; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = `${Math.random() * 0.5}s`;
      piece.style.transform = `rotate(${Math.random() * 360}deg)`;
      container.appendChild(piece);
    }
  }, []);

  return (
    <>
      <style>{`
        #confetti-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: 9999;
          overflow: hidden;
        }
        .confetti-piece {
          position: absolute;
          width: 8px;
          height: 14px;
          top: -20px;
          opacity: 0.9;
          border-radius: 2px;
          animation: dropConfetti 3s ease-out forwards;
        }
        @keyframes dropConfetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
      <div id="confetti-container" />
    </>
  );
}