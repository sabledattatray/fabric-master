import React from 'react';

export function FabricMasterLogo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="2" y="4" width="9" height="16" rx="2" fill="currentColor" fillOpacity="0.8" />
      <rect x="13" y="4" width="9" height="7" rx="2" fill="currentColor" fillOpacity="0.4" />
      <rect x="13" y="13" width="9" height="7" rx="2" fill="#58a6ff" />
      <path d="M2 6C2 4.89543 2.89543 4 4 4H11V20H4C2.89543 20 2 19.1046 2 18V6Z" fill="url(#grad1)" />
      
      <defs>
        <linearGradient id="grad1" x1="2" y1="4" x2="11" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#bc8cff" />
          <stop offset="1" stopColor="#58a6ff" />
        </linearGradient>
      </defs>
    </svg>
  );
}
