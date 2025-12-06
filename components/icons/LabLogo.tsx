'use client';

interface LabLogoProps {
  className?: string;
  animated?: boolean;
}

export const LabLogo = ({
  className = 'w-8 h-8',
  animated = true,
}: LabLogoProps) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    fill="none"
    role="img"
    aria-label="ToolsLab logo"
  >
    {/* Provetta principale */}
    <rect
      x="35"
      y="20"
      width="30"
      height="60"
      rx="4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />

    {/* Collo della provetta */}
    <rect
      x="42"
      y="15"
      width="16"
      height="8"
      rx="2"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />

    {/* Liquido che bolle dentro */}
    <path
      d="M 37 50 Q 50 45 63 50 L 63 76 Q 50 71 37 76 Z"
      fill="url(#labGradient)"
      opacity="0.8"
    >
      {animated && (
        <animate
          attributeName="d"
          values="M 37 50 Q 50 45 63 50 L 63 76 Q 50 71 37 76 Z;
                         M 37 48 Q 50 53 63 48 L 63 76 Q 50 73 37 76 Z;
                         M 37 50 Q 50 45 63 50 L 63 76 Q 50 71 37 76 Z"
          dur="3s"
          repeatCount="indefinite"
        />
      )}
    </path>

    {/* Bolle che salgono */}
    {animated && (
      <>
        <circle r="2" fill="rgba(255,255,255,0.8)">
          <animate
            attributeName="cy"
            from="70"
            to="30"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="cx"
            values="45;48;45"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0;1;0"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
        <circle r="1.5" fill="rgba(255,255,255,0.6)">
          <animate
            attributeName="cy"
            from="65"
            to="25"
            dur="2.5s"
            repeatCount="indefinite"
            begin="0.5s"
          />
          <animate
            attributeName="cx"
            values="52;55;52"
            dur="2.5s"
            repeatCount="indefinite"
            begin="0.5s"
          />
          <animate
            attributeName="opacity"
            values="0;1;0"
            dur="2.5s"
            repeatCount="indefinite"
            begin="0.5s"
          />
        </circle>
        <circle r="1" fill="rgba(255,255,255,0.4)">
          <animate
            attributeName="cy"
            from="60"
            to="20"
            dur="3s"
            repeatCount="indefinite"
            begin="1s"
          />
          <animate
            attributeName="cx"
            values="50;47;50"
            dur="3s"
            repeatCount="indefinite"
            begin="1s"
          />
          <animate
            attributeName="opacity"
            values="0;1;0"
            dur="3s"
            repeatCount="indefinite"
            begin="1s"
          />
        </circle>
      </>
    )}

    {/* Simboli di codice galleggianti */}
    <text
      x="40"
      y="45"
      fontSize="6"
      fill="rgba(255,255,255,0.9)"
      fontFamily="monospace"
    >
      {`{}`}
      {animated && (
        <animate
          attributeName="opacity"
          values="0.5;1;0.5"
          dur="4s"
          repeatCount="indefinite"
        />
      )}
    </text>
    <text
      x="52"
      y="60"
      fontSize="4"
      fill="rgba(255,255,255,0.7)"
      fontFamily="monospace"
    >
      {'</>'}
      {animated && (
        <animate
          attributeName="opacity"
          values="1;0.5;1"
          dur="3s"
          repeatCount="indefinite"
          begin="1s"
        />
      )}
    </text>

    {/* Gradient definition */}
    <defs>
      <linearGradient id="labGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
        <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.7" />
      </linearGradient>
    </defs>
  </svg>
);

export default LabLogo;
