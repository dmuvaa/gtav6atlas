/**
 * Map-mark logo: GTA 6 inside a folded Leonida-style atlas sheet.
 */
export function AtlasLogo({
  size = 44,
  className = "",
  showPin = true,
}: {
  size?: number;
  className?: string;
  showPin?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient
          id="atlas-map-stroke"
          x1="8"
          y1="8"
          x2="72"
          y2="72"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#ff5cad" />
          <stop offset="0.5" stopColor="#ff2d95" />
          <stop offset="1" stopColor="#e91e8c" />
        </linearGradient>
        <linearGradient
          id="atlas-map-fill"
          x1="16"
          y1="12"
          x2="64"
          y2="68"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2a1535" />
          <stop offset="1" stopColor="#120a18" />
        </linearGradient>
        <linearGradient
          id="atlas-water"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop stopColor="#3ee9c7" stopOpacity="0.35" />
          <stop offset="1" stopColor="#3ee9c7" stopOpacity="0.08" />
        </linearGradient>
        <filter id="atlas-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Soft pink halo */}
      <ellipse
        cx="40"
        cy="40"
        rx="36"
        ry="34"
        fill="#ff2d95"
        opacity="0.12"
      />

      {/* Folded map sheet — skewed atlas page */}
      <path
        d="M14 18 L66 12 C69 12 71 14 71 18 L67 64 C67 67 64 69 61 68 L15 62 C12 61 10 58 11 55 L14 18Z"
        fill="url(#atlas-map-fill)"
        stroke="url(#atlas-map-stroke)"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Center fold crease */}
      <path
        d="M26 16 L22 64"
        stroke="#ff5cad"
        strokeOpacity="0.35"
        strokeWidth="1.25"
        strokeLinecap="round"
      />

      {/* Coastline / Leonida shoreline (abstract) */}
      <path
        d="M28 46 C34 40 42 44 48 42 C54 40 58 46 62 44"
        stroke="url(#atlas-water)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M30 52 Q42 58 58 50"
        stroke="#3ee9c7"
        strokeOpacity="0.25"
        strokeWidth="1"
        fill="none"
      />

      {/* Map grid */}
      <g stroke="#9d8ec7" strokeOpacity="0.2" strokeWidth="0.75">
        <line x1="22" y1="28" x2="62" y2="26" />
        <line x1="24" y1="38" x2="60" y2="36" />
        <line x1="26" y1="48" x2="58" y2="46" />
        <line x1="34" y1="22" x2="32" y2="58" />
        <line x1="46" y1="20" x2="44" y2="56" />
      </g>

      {showPin ? (
        <circle cx="54" cy="30" r="3" fill="#ff2d95" filter="url(#atlas-glow)" />
      ) : null}
      {showPin ? (
        <path
          d="M54 33 L54 38 L52 40 L56 40 Z"
          fill="#ff2d95"
        />
      ) : null}

      {/* Wordmark inside map */}
      <text
        x="40"
        y="35"
        textAnchor="middle"
        fill="#ff7cc4"
        fontSize="11"
        fontWeight="700"
        fontFamily="var(--font-oswald), Oswald, Arial Narrow, sans-serif"
        letterSpacing="0.12em"
      >
        GTA
      </text>
      <text
        x="40"
        y="54"
        textAnchor="middle"
        fill="#f8f6ff"
        fontSize="24"
        fontWeight="700"
        fontFamily="var(--font-oswald), Oswald, Arial Narrow, sans-serif"
      >
        6
      </text>
    </svg>
  );
}