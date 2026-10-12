import React, { useEffect, useState } from 'react';
import { SnapActionLogo } from './SnapActionLogo';

interface OpeningSplashScreenProps {
  onLoaded: () => void;
}

export const OpeningSplashScreen: React.FC<OpeningSplashScreenProps> = ({ onLoaded }) => {
  const [progress, setProgress] = useState(12);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 1600; // 1.6s smooth cinematic load

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawPct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(rawPct);

      if (rawPct >= 100) {
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const exitTimer = setTimeout(() => {
        setIsFadingOut(true);
        const finishTimer = setTimeout(() => {
          onLoaded();
        }, 280);
        return () => clearTimeout(finishTimer);
      }, 200);

      return () => clearTimeout(exitTimer);
    }
  }, [progress, onLoaded]);

  // Allow clicking anywhere or pressing any key to skip immediately
  const handleInstantDismiss = () => {
    setIsFadingOut(true);
    setTimeout(onLoaded, 120);
  };

  useEffect(() => {
    const handleKeyDown = () => handleInstantDismiss();
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getStatusText = (pct: number) => {
    if (pct < 35) return 'INITIALIZING AI VISION';
    if (pct < 75) return 'CALIBRATING ACTION SCHEMAS';
    if (pct < 100) return 'PREPARING WORKSPACE';
    return 'READY';
  };

  return (
    <div
      id="opening-splash-screen"
      onClick={handleInstantDismiss}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#05070D] text-[#EDEDED] select-none cursor-pointer transition-opacity duration-300 ease-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Subtle ambient radial glow backdrop */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-blue-600/[0.08] blur-[120px] pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] rounded-full bg-cyan-500/[0.05] blur-[80px] pointer-events-none" />

      {/* Main minimalist brand identity container */}
      <div className="relative flex flex-col items-center text-center space-y-7 z-10 animate-fadeIn max-w-sm px-6">
        {/* Brand Logo Emblem with Electric Glow */}
        <div className="relative flex items-center justify-center transform transition-transform duration-500 hover:scale-105">
          <SnapActionLogo size="xl" withGlow={true} />
        </div>

        {/* Wordmark in the exact brand typography */}
        <div className="space-y-1.5">
          <h1 className="font-bold tracking-tight text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-100 to-neutral-400 select-none font-sans">
            SnapAction
          </h1>
        </div>

        {/* Minimalist hairline loading bar */}
        <div className="w-52 sm:w-60 space-y-2.5 pt-1">
          <div className="w-full h-[2.5px] bg-[#111726] rounded-full overflow-hidden relative border border-blue-900/30">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-[#E0F2FE] rounded-full transition-all duration-75 ease-out shadow-[0_0_12px_rgba(56,189,248,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Minimalist micro status indicators */}
          <div className="flex items-center justify-between text-[10px] font-mono text-[#666] tracking-widest uppercase">
            <div className="flex items-center space-x-1.5">
              <span
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                  progress === 100 ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-cyan-400 animate-pulse shadow-[0_0_6px_#38bdf8]'
                }`}
              />
              <span className="text-[#888] font-sans font-medium text-[10px] tracking-wider">
                {getStatusText(progress)}
              </span>
            </div>
            <span className="text-[#888] font-mono font-medium">{progress}%</span>
          </div>
        </div>

        {/* Quiet skip hint */}
        <span className="text-[10px] text-[#555] tracking-wide pt-2 opacity-80 hover:text-[#888] transition-colors">
          Click anywhere to skip
        </span>
      </div>
    </div>
  );
};
