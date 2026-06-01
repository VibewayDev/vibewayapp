interface LogoProps {
  size?: number;
  className?: string;
}

export default function Logo({ size = 44, className = '' }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="64" height="64" rx="14" fill="url(#logoBg)" />

      {/* Radar rings */}
      <circle cx="18" cy="18" r="4"  fill="url(#logoGold)" />
      <circle cx="18" cy="18" r="9"  stroke="url(#logoGold)" strokeWidth="1.2" fill="none" opacity="0.6" />
      <circle cx="18" cy="18" r="15" stroke="url(#logoGold)" strokeWidth="0.8" fill="none" opacity="0.3" />

      {/* VW wave — white neon */}
      <path
        d="M 22 21 L 29 43 L 37 21 M 35 21 L 40 36 L 45 25 L 50 36 L 55 21"
        stroke="url(#logoWave)"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter="url(#logoGlow)"
      />

      <defs>
        <linearGradient id="logoBg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#04091a" />
          <stop offset="100%" stopColor="#0a1530" />
        </linearGradient>
        <linearGradient id="logoGold" x1="10" y1="10" x2="30" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#f5a623" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id="logoWave" x1="22" y1="32" x2="55" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#ffffff" />
          <stop offset="100%" stopColor="#fde68a" />
        </linearGradient>
        <filter id="logoGlow" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}
