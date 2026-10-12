import React from 'react';

interface SnapActionLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  withGlow?: boolean;
}

export const SnapActionLogo: React.FC<SnapActionLogoProps> = ({
  size = 'md',
  className = '',
  withGlow = false,
}) => {
  const sizeMap = {
    xs: 'w-4 h-4',
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-14 h-14',
    xl: 'w-24 h-24',
    '2xl': 'w-32 h-32',
  };

  const dim = sizeMap[size] || sizeMap.md;

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      {/* Ambient Breathing Neon Glow Effect */}
      {withGlow && (
        <div className="absolute -inset-2.5 bg-gradient-to-tr from-blue-600/30 via-cyan-400/25 to-blue-500/20 rounded-3xl blur-xl opacity-80 animate-pulse pointer-events-none" />
      )}

      {/* Official SnapAction Squircle App Icon & Viewfinder Arrow */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${dim} relative z-10 transition-transform duration-300 drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]`}
      >
        <defs>
          {/* Deep obsidian squircle background */}
          <linearGradient id="snapSquircleBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0F1424" />
            <stop offset="45%" stopColor="#080C16" />
            <stop offset="100%" stopColor="#04060C" />
          </linearGradient>

          {/* Squircle outer rim stroke highlight */}
          <linearGradient id="snapSquircleRim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.75" />
            <stop offset="35%" stopColor="#1E293B" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0F172A" stopOpacity="0.6" />
          </linearGradient>

          {/* Viewfinder brackets vibrant electric blue gradient */}
          <linearGradient id="snapBracketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#67E8F9" />
            <stop offset="40%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>

          {/* Upper Illuminated Body (Electric Cyan-Blue) */}
          <linearGradient id="snapArrowLightWing" x1="20%" y1="20%" x2="90%" y2="90%">
            <stop offset="0%" stopColor="#A5F3FC" />
            <stop offset="25%" stopColor="#38BDF8" />
            <stop offset="70%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>

          {/* Lower Aerodynamic Shadow Fold (Deep Royal/Cobalt Blue) */}
          <linearGradient id="snapArrowShadowWing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E40AF" />
            <stop offset="50%" stopColor="#172554" />
            <stop offset="100%" stopColor="#0B132B" />
          </linearGradient>

          {/* Radial Center Aura Glow */}
          <radialGradient id="snapCenterAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.32" />
            <stop offset="50%" stopColor="#0284C7" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
          </radialGradient>

          {/* Neon Glow Filter */}
          <filter id="snapNeonFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. App Icon Squircle Container */}
        <rect
          x="4"
          y="4"
          width="92"
          height="92"
          rx="22"
          fill="url(#snapSquircleBg)"
          stroke="url(#snapSquircleRim)"
          strokeWidth="1.75"
        />

        {/* 2. Soft Ambient Radial Glow Behind Elements */}
        <circle cx="50" cy="50" r="32" fill="url(#snapCenterAura)" />

        {/* 3. Four Rounded Viewfinder Brackets */}
        {/* Top-Left Bracket */}
        <path
          d="M 19 33 L 19 26.5 C 19 22.35 22.35 19 26.5 19 L 33 19"
          stroke="url(#snapBracketGrad)"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Top-Right Bracket */}
        <path
          d="M 67 19 L 73.5 19 C 77.65 19 81 22.35 81 26.5 L 81 33"
          stroke="url(#snapBracketGrad)"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Bottom-Right Bracket */}
        <path
          d="M 81 67 L 81 73.5 C 81 77.65 77.65 81 73.5 81 L 67 81"
          stroke="url(#snapBracketGrad)"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Bottom-Left Bracket */}
        <path
          d="M 33 81 L 26.5 81 C 22.35 81 19 77.65 19 73.5 L 19 67"
          stroke="url(#snapBracketGrad)"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 4. Central Origami / Aerodynamic Action Dart */}
        <g filter="url(#snapNeonFilter)">
          {/* Lower / Shadow Fold Wing */}
          <path
            d="M 65 33 L 45 52 L 55 64 Z"
            fill="url(#snapArrowShadowWing)"
            stroke="#1E40AF"
            strokeWidth="0.75"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Upper / Illuminated Body Wing */}
          <path
            d="M 65 33 L 33 41 L 45 52 Z"
            fill="url(#snapArrowLightWing)"
            stroke="#67E8F9"
            strokeWidth="0.75"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Origami Central Crease Ridge Highlight */}
          <line
            x1="45"
            y1="52"
            x2="65"
            y2="33"
            stroke="#F0F9FF"
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity="0.95"
          />

          {/* Apex Focus Spark */}
          <circle cx="65" cy="33" r="1.6" fill="#FFFFFF" opacity="0.95" />
        </g>
      </svg>
    </div>
  );
};
