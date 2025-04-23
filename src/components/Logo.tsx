
import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative w-8 h-8">
        {/* Logo mark - stylized "SC" for Source Code */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-atlas-purple to-atlas-teal flex items-center justify-center">
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
          >
            <path 
              d="M13 4L7 20M19 8L4 16" 
              stroke="white" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <circle 
              cx="8" 
              cy="16" 
              r="2" 
              fill="white"
            />
            <circle 
              cx="16" 
              cy="8" 
              r="2" 
              fill="white"
            />
          </svg>
        </div>
        
        {/* Subtle glow effect */}
        <div className="absolute inset-0 rounded-full bg-atlas-purple opacity-40 blur-sm animate-pulse-slow"></div>
      </div>
      
      <span className="font-semibold text-lg tracking-tight">Source Code Atlas</span>
    </div>
  );
};

export default Logo;
