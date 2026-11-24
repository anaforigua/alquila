import React from 'react';

// =============================================================================
// ICONOS Y COMPONENTES VECTORIALES SVG (SIN EMOJIS, 100% PROFESIONALES)
// =============================================================================

export const IconLogoSena: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width="40" height="40">
    <rect width="48" height="48" rx="14" fill="url(#grad_logo)" />
    <path d="M12 18C12 15.7909 13.7909 14 16 14H32C34.2091 14 36 15.7909 36 18V28C36 30.2091 34.2091 32 32 32H16C13.7909 32 12 30.2091 12 28V18Z" stroke="#064E3B" strokeWidth="2.5" />
    <path d="M16 36H32M24 32V36" stroke="#064E3B" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="24" cy="23" r="3" fill="#047857" />
    <defs>
      <linearGradient id="grad_logo" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#A7F3D0" />
        <stop offset="0.5" stopColor="#C4B5FD" />
        <stop offset="1" stopColor="#BAE6FD" />
      </linearGradient>
    </defs>
  </svg>
);

export const IconComputer: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

export const IconCalendar: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

export const IconCalendarPlus: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <line x1="19" y1="16" x2="19" y2="22" />
    <line x1="16" y1="19" x2="22" y2="19" />
  </svg>
);

export const IconSpeaker: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
);

export const IconPrinter: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" />
  </svg>
);

export const IconArrowRight: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export const IconArrowLeft: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

export const IconCheck: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// =============================================================================
// ILUSTRACIONES VECTORIALES PASTEL PARA LOS 3 SERVICIOS (SIN EMOJIS)
// =============================================================================

export const ImageServiceCity: React.FC = () => (
  <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="68" height="68" rx="18" fill="url(#city_bg)" />
    <rect x="14" y="24" width="12" height="30" rx="3" fill="#BAE6FD" stroke="#0284C7" strokeWidth="2" />
    <rect x="29" y="16" width="14" height="38" rx="3" fill="#A7F3D0" stroke="#059669" strokeWidth="2" />
    <rect x="46" y="28" width="10" height="26" rx="3" fill="#DDD6FE" stroke="#7C3AED" strokeWidth="2" />
    <line x1="18" y1="29" x2="22" y2="29" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
    <line x1="18" y1="36" x2="22" y2="36" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
    <line x1="34" y1="22" x2="38" y2="22" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
    <line x1="34" y1="30" x2="38" y2="30" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
    <line x1="34" y1="38" x2="38" y2="38" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
    <defs>
      <linearGradient id="city_bg" x1="0" y1="0" x2="68" y2="68" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F0F9FF" />
        <stop offset="1" stopColor="#E0F2FE" />
      </linearGradient>
    </defs>
  </svg>
);

export const ImageServiceDelivery: React.FC = () => (
  <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="68" height="68" rx="18" fill="url(#truck_bg)" />
    <path d="M12 24C12 21.7909 13.7909 20 16 20H38V42H16C13.7909 42 12 40.2091 12 38V24Z" fill="#DDD6FE" stroke="#6D28D9" strokeWidth="2" />
    <path d="M38 27H47.5858C48.6466 27 49.664 27.4214 50.4142 28.1716L54.8284 32.5858C55.5786 33.336 56 34.3534 56 35.4142V40C56 41.1046 55.1046 42 54 42H38V27Z" fill="#FBCFE8" stroke="#DB2777" strokeWidth="2" />
    <circle cx="23" cy="44" r="5" fill="#FFFFFF" stroke="#6D28D9" strokeWidth="3" />
    <circle cx="47" cy="44" r="5" fill="#FFFFFF" stroke="#DB2777" strokeWidth="3" />
    <line x1="18" y1="28" x2="32" y2="28" stroke="#6D28D9" strokeWidth="2" strokeLinecap="round" />
    <defs>
      <linearGradient id="truck_bg" x1="0" y1="0" x2="68" y2="68" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FDF4FF" />
        <stop offset="1" stopColor="#F5F3FF" />
      </linearGradient>
    </defs>
  </svg>
);

export const ImageServiceCampus: React.FC = () => (
  <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="68" height="68" rx="18" fill="url(#campus_bg)" />
    <path d="M34 14L16 24V28H52V24L34 14Z" fill="#A7F3D0" stroke="#047857" strokeWidth="2" strokeLinejoin="round" />
    <rect x="20" y="28" width="6" height="18" fill="#F0FDF4" stroke="#047857" strokeWidth="2" />
    <rect x="31" y="28" width="6" height="18" fill="#F0FDF4" stroke="#047857" strokeWidth="2" />
    <rect x="42" y="28" width="6" height="18" fill="#F0FDF4" stroke="#047857" strokeWidth="2" />
    <rect x="14" y="46" width="40" height="6" rx="2" fill="#BAE6FD" stroke="#0284C7" strokeWidth="2" />
    <defs>
      <linearGradient id="campus_bg" x1="0" y1="0" x2="68" y2="68" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ECFDF5" />
        <stop offset="1" stopColor="#D1FAE5" />
      </linearGradient>
    </defs>
  </svg>
);
