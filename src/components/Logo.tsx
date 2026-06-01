interface LogoProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

export default function Logo({ size = 48, className = '', animated = false }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background square with rounded corners */}
      <rect width="64" height="64" rx="14" fill="url(#bgGradient)" />

      {/* Subtle inner glow overlay */}
      <rect width="64" height="64" rx="14" fill="url(#innerGlow)" opacity="0.6" />

      {/* Concentric radio waves from upper-left dot */}
      <circle
        cx="13"
        cy="13"
        r="3.5"
        fill="#f3d1fe"
        className={animated ? 'animate-pulse-slow' : ''}
      />
      <circle
        cx="13"
        cy="13"
        r="7"
        stroke="#d8b4fe"
        strokeWidth="1.2"
        fill="none"
        opacity="0.7"
        className={animated ? 'animate-ping' : ''}
        style={animated ? { animationDuration: '2s' } : undefined}
      />
      <circle
        cx="13"
        cy="13"
        r="11"
        stroke="#c084fc"
        strokeWidth="0.9"
        fill="none"
        opacity="0.45"
      />
      <circle
        cx="13"
        cy="13"
        r="15"
        stroke="#a855f7"
        strokeWidth="0.7"
        fill="none"
        opacity="0.25"
      />

      {/* VW neon wave path — traces a V shape then a W shape */}
      <path
        d="M 22 20 L 30 44 L 38 20 M 36 20 L 41 36 L 46 24 L 51 36 L 56 20"
        stroke="url(#waveGradient)"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter="url(#neonGlow)"
      />

      <defs>
        <linearGradient id="bgGradient" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6d28d9" />
          <stop offset="50%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#9333ea" />
        </linearGradient>

        <radialGradient id="innerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#4c1d95" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="waveGradient" x1="22" y1="32" x2="56" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f9fafb" />
          <stop offset="50%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e9d5ff" />
        </linearGradient>

        <filter id="neonGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}
