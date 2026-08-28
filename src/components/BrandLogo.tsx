'use client';

import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', showText = true }) => {
  const dimMap = {
    sm: { icon: 'w-7 h-7', text: 'text-base' },
    md: { icon: 'w-9 h-9', text: 'text-lg' },
    lg: { icon: 'w-11 h-11', text: 'text-xl' },
  };

  const { icon, text } = dimMap[size];

  return (
    <a href="/" className="flex items-center space-x-2.5 shrink-0 hover:opacity-90 transition-opacity">
      {/* Layered Crest Vector Icon matching favicon */}
      <div className={`${icon} rounded-xl bg-[#1e293b] border border-slate-700/80 p-1 flex items-center justify-center shadow-md shadow-blue-500/10`}>
        <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
          <path d="M16 6L6 11.5L16 17L26 11.5L16 6Z" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 16.5L16 22L26 16.5" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 21.5L16 27L26 21.5" stroke="#c084fc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {showText && (
        <span className={`${text} font-extrabold text-white tracking-tight`}>
          SaaS<span className="text-[#3b82f6]">Pro</span>
        </span>
      )}
    </a>
  );
};
