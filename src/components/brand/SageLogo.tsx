import React from 'react';

export default function SageLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer botanical circle border */}
      <circle
        cx="50"
        cy="50"
        r="46"
        stroke="#2C3E2D"
        strokeWidth="2.5"
        strokeDasharray="4 2"
        opacity="0.8"
      />
      {/* Inner terracotta accent ring */}
      <circle
        cx="50"
        cy="50"
        r="41"
        fill="#F4EFE6"
        stroke="#C46849"
        strokeWidth="1.2"
      />
      {/* Botanical Organic Sage Leaves */}
      <path
        d="M50 22C42 32 36 44 38 56C39.5 65 47 74 50 78C53 74 60.5 65 62 56C64 44 58 32 50 22Z"
        fill="#2C3E2D"
      />
      <path
        d="M50 28V72M50 36C46 40 43 45 42 50M50 48C46 52 44 56 44 60M50 38C54 42 57 47 58 52M50 50C54 54 56 58 56 62"
        stroke="#CADAC9"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* Organic Seed / Sun Accent */}
      <circle cx="50" cy="18" r="2.5" fill="#C46849" />
    </svg>
  );
}
