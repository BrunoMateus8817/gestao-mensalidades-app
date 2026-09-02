import React from 'react';

interface RPLogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
}

export const RPLogo: React.FC<RPLogoProps> = ({ className = "w-12 h-12", size }) => {
  const sizeStyle = size ? { width: size, height: size } : {};

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`} style={sizeStyle}>
      <svg 
        viewBox="0 0 400 480" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          <linearGradient id="shieldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DCC9A6" />
            <stop offset="50%" stopColor="#B08D57" />
            <stop offset="100%" stopColor="#6C5329" />
          </linearGradient>

          <linearGradient id="silverBezel" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E2E8F0" />
            <stop offset="50%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>

          <linearGradient id="redBolt" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="60%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>

          <linearGradient id="beretDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="60%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#DC2626" />
          </radialGradient>
        </defs>

        {/* Outer Military Shield Base */}
        <path
          d="M 50 30 
             L 210 30 
             L 210 380 
             Q 130 360 50 310 
             Z"
          fill="#101418"
          stroke="url(#shieldBorder)"
          strokeWidth="10"
          strokeLinejoin="round"
        />

        {/* Shield Right Side (White/Light) */}
        <path
          d="M 210 30 
             L 370 30 
             L 370 310 
             Q 290 360 210 380 
             Z"
          fill="#F8FAFC"
          stroke="url(#shieldBorder)"
          strokeWidth="10"
          strokeLinejoin="round"
        />

        {/* Central Red Lightning Bolt (Raio RP) */}
        <path
          d="M 195 30 
             L 245 30 
             L 210 160 
             L 255 160 
             L 175 375 
             L 190 220 
             L 155 220 
             Z"
          fill="url(#redBolt)"
          stroke="#7F1D1D"
          strokeWidth="4"
          strokeLinejoin="miter"
        />

        {/* Tactical Crosshairs & 3° BPM Mark */}
        <g transform="translate(290, 80)">
          {/* Target circle */}
          <circle cx="0" cy="0" r="28" stroke="#DC2626" strokeWidth="2.5" fill="none" opacity="0.85" />
          <circle cx="0" cy="0" r="14" stroke="#DC2626" strokeWidth="1.5" fill="none" opacity="0.85" />
          <line x1="-36" y1="0" x2="36" y2="0" stroke="#DC2626" strokeWidth="2" opacity="0.85" />
          <line x1="0" y1="-36" x2="0" y2="36" stroke="#DC2626" strokeWidth="2" opacity="0.85" />
          
          {/* Crossed Pistols symbol */}
          <path d="M -16 6 L -6 -6 L 0 0 L -10 12 Z" fill="#1E293B" />
          <path d="M 16 6 L 6 -6 L 0 0 L 10 12 Z" fill="#1E293B" />
          <text 
            x="0" 
            y="-38" 
            textAnchor="middle" 
            fill="#0F172A" 
            fontWeight="900" 
            fontSize="18" 
            fontFamily="'Chakra Petch', sans-serif"
            letterSpacing="1"
          >
            3º BPM
          </text>
        </g>

        {/* Letter 'R' (White on dark side) */}
        <text
          x="115"
          y="160"
          textAnchor="middle"
          fill="#FFFFFF"
          fontWeight="900"
          fontSize="115"
          fontFamily="'Chakra Petch', sans-serif"
          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
        >
          R
        </text>

        {/* Letter 'P' (Dark on light side) */}
        <text
          x="305"
          y="310"
          textAnchor="middle"
          fill="#101418"
          fontWeight="900"
          fontSize="115"
          fontFamily="'Chakra Petch', sans-serif"
        >
          P
        </text>

        {/* TACTICAL BULLDOG MASCOT OVERLAY */}
        <g transform="translate(140, 150)">
          {/* Spike Collar */}
          <path
            d="M 50 250 Q 130 280 210 250 L 220 280 Q 130 315 40 280 Z"
            fill="#334155"
            stroke="url(#silverBezel)"
            strokeWidth="5"
          />
          {/* Collar Spikes */}
          <polygon points="65,260 70,290 55,275" fill="#E2E8F0" stroke="#475569" strokeWidth="2" />
          <polygon points="100,270 105,305 90,290" fill="#E2E8F0" stroke="#475569" strokeWidth="2" />
          <polygon points="135,275 135,312 125,295" fill="#E2E8F0" stroke="#475569" strokeWidth="2" />
          <polygon points="170,270 165,305 180,290" fill="#E2E8F0" stroke="#475569" strokeWidth="2" />
          <polygon points="205,260 195,290 210,275" fill="#E2E8F0" stroke="#475569" strokeWidth="2" />

          {/* Bulldog Head Base */}
          <path
            d="M 60 100 
               C 50 60, 190 40, 205 95 
               C 225 150, 215 240, 185 255 
               C 145 270, 95 265, 75 240 
               C 55 210, 50 140, 60 100 Z"
            fill="#CBD5E1"
            stroke="#1E293B"
            strokeWidth="6"
          />

          {/* Bulldog Muzzle & Jowls */}
          <path
            d="M 85 165 
               C 70 200, 75 240, 105 245 
               C 130 248, 140 230, 140 210 
               C 140 230, 155 248, 180 245 
               C 210 240, 210 195, 190 165 
               C 165 145, 110 145, 85 165 Z"
            fill="#F1F5F9"
            stroke="#1E293B"
            strokeWidth="5"
          />

          {/* Bulldog Big Nose */}
          <path
            d="M 120 165 Q 140 155 160 165 Q 170 190 140 192 Q 110 190 120 165 Z"
            fill="#0F172A"
          />
          <circle cx="130" cy="178" r="4" fill="#334155" />
          <circle cx="150" cy="178" r="4" fill="#334155" />

          {/* Sharp Canine Teeth */}
          <polygon points="98,215 106,238 114,217" fill="#FFFBEB" stroke="#78350F" strokeWidth="2" />
          <polygon points="166,217 174,238 182,215" fill="#FFFBEB" stroke="#78350F" strokeWidth="2" />
          <polygon points="120,222 125,236 130,223" fill="#FFFBEB" stroke="#78350F" strokeWidth="1.5" />
          <polygon points="150,223 155,236 160,222" fill="#FFFBEB" stroke="#78350F" strokeWidth="1.5" />

          {/* Fierce Glowing Eyes */}
          <path d="M 85 130 Q 105 120 118 135 Q 100 148 85 130 Z" fill="url(#eyeGlow)" stroke="#1E293B" strokeWidth="3" />
          <path d="M 160 135 Q 175 120 195 130 Q 180 148 160 135 Z" fill="url(#eyeGlow)" stroke="#1E293B" strokeWidth="3" />
          <ellipse cx="102" cy="133" rx="3" ry="5" fill="#7F1D1D" />
          <ellipse cx="178" cy="133" rx="3" ry="5" fill="#7F1D1D" />

          {/* Tactical Beret (Boina Militar com Insígnia RP) */}
          <path
            d="M 45 95 
               C 40 40, 120 5, 185 20 
               C 235 30, 245 75, 210 90 
               C 170 100, 100 105, 45 95 Z"
            fill="url(#beretDark)"
            stroke="#020617"
            strokeWidth="5"
          />
          {/* Beret Fold & Leather Band */}
          <path
            d="M 50 92 Q 130 96 205 85"
            stroke="#B08D57"
            strokeWidth="4"
            fill="none"
          />

          {/* Mini RP Badge on Beret */}
          <g transform="translate(95, 40) scale(0.2)">
            <polygon points="30,10 70,10 85,50 50,90 15,50" fill="#101418" stroke="#B08D57" strokeWidth="6" />
            <path d="M45,20 L65,20 L50,45 L62,45 L35,80 L42,52 L30,52 Z" fill="#EF4444" />
            <text x="32" y="48" fill="#FFF" fontWeight="bold" fontSize="24">R</text>
            <text x="56" y="76" fill="#FFF" fontWeight="bold" fontSize="24">P</text>
          </g>
        </g>
      </svg>
    </div>
  );
};
