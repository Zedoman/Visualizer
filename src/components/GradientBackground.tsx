
import React from 'react';

const GradientBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Light theme has a softer white background */}
      <div className="absolute inset-0 bg-background transition-colors duration-300"></div>
      
      {/* Gradient elements - adjusted opacity for light/dark modes */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-atlas-purple opacity-10 dark:opacity-10 blur-[100px] rounded-full animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-atlas-teal opacity-5 dark:opacity-10 blur-[100px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-2/3 left-1/3 w-64 h-64 bg-atlas-lightBlue opacity-5 dark:opacity-10 blur-[100px] rounded-full animate-pulse-slow" style={{ animationDelay: '4s' }}></div>
      
      {/* Pattern overlay */}
      <div className="absolute inset-0 code-pattern opacity-20 dark:opacity-30"></div>
    </div>
  );
};

export default GradientBackground;
