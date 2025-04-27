import React from 'react';

const PageLoader = () => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            {/* <div className="h-16 w-16 rounded-full border-4 border-muted animate-[spin_3s_linear_infinite]" />
            <div className="absolute inset-0 h-16 w-16 rounded-full border-t-4 border-primary animate-[spin_1.5s_linear_infinite]" /> */}
          </div>
          <div className="animate-pulse">
            <svg className="w-24 h-24 opacity-80" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#14B8A6" />
                </linearGradient>
              </defs>
              <g fill="none" stroke="url(#gradient)" strokeWidth="2">
                <circle cx="50" cy="50" r="20">
                  <animate attributeName="r" values="20;30;20" dur="2s" repeatCount="indefinite"/>
                </circle>
                <circle cx="50" cy="50" r="30">
                  <animate attributeName="r" values="30;40;30" dur="2s" repeatCount="indefinite"/>
                </circle>
                <circle cx="50" cy="50" r="40">
                  <animate attributeName="r" values="40;50;40" dur="2s" repeatCount="indefinite"/>
                </circle>
              </g>
            </svg>
          </div>
          {/* <p>Avradeep Nayak</p> */}
          <p className="text-lg font-medium text-muted-foreground animate-pulse">Loading...</p>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
