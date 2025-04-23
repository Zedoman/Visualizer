import React from "react";
import { cn } from "@/lib/utils";

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
            viewBox="0 0 35 35" // Match image size
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
          >
            <image
              xlinkHref="/logo.png"
              x="0" 
              y="0" 
              width="35"
              height="35"
            />
          </svg>
        </div>

        {/* Subtle glow effect */}
        <div className="absolute inset-0 rounded-full bg-atlas-black opacity-40 blur-sm animate-pulse-slow"></div>
      </div>

      <span className="font-semibold text-lg tracking-tight">
        Source Code Atlas
      </span>
    </div>
  );
};

export default Logo;