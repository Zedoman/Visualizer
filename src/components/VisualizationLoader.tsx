
import React from 'react';

const VisualizationLoader = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="animate-pulse">
        <div className="flex flex-col items-center">
          <svg className="w-32 h-32 opacity-80" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#14B8A6" />
              </linearGradient>
            </defs>
            <g fill="none" stroke="url(#gradient)" strokeWidth="1">
              <circle cx="50" cy="50" r="20" />
              <circle cx="50" cy="50" r="30" />
              <circle cx="50" cy="50" r="40" />
              <line x1="30" y1="50" x2="70" y2="50" />
              <line x1="50" y1="30" x2="50" y2="70" />
              <line x1="35" y1="35" x2="65" y2="65" />
              <line x1="35" y1="65" x2="65" y2="35" />
            </g>
            <g fill="#14B8A6">
              <circle cx="30" cy="50" r="3">
                <animate attributeName="r" values="3;4;3" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="50" cy="30" r="3">
                <animate attributeName="r" values="3;4;3" dur="2s" repeatCount="indefinite" begin="0.2s" />
              </circle>
              <circle cx="70" cy="50" r="3">
                <animate attributeName="r" values="3;4;3" dur="2s" repeatCount="indefinite" begin="0.4s" />
              </circle>
              <circle cx="50" cy="70" r="3">
                <animate attributeName="r" values="3;4;3" dur="2s" repeatCount="indefinite" begin="0.6s" />
              </circle>
              <circle cx="35" cy="35" r="3">
                <animate attributeName="r" values="3;4;3" dur="2s" repeatCount="indefinite" begin="0.8s" />
              </circle>
              <circle cx="65" cy="35" r="3">
                <animate attributeName="r" values="3;4;3" dur="2s" repeatCount="indefinite" begin="1s" />
              </circle>
              <circle cx="35" cy="65" r="3">
                <animate attributeName="r" values="3;4;3" dur="2s" repeatCount="indefinite" begin="1.2s" />
              </circle>
              <circle cx="65" cy="65" r="3">
                <animate attributeName="r" values="3;4;3" dur="2s" repeatCount="indefinite" begin="1.4s" />
              </circle>
            </g>
          </svg>
          <p className="text-muted-foreground mt-4">Loading visualization...</p>
          <p className="text-xs text-muted-foreground mt-2">Analyzing repository structure</p>
        </div>
      </div>
    </div>
  );
};

export default VisualizationLoader;