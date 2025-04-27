import React, { useEffect } from 'react';
import { FileCode, GitBranch, GitMerge, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  diagram: React.ReactNode;
}

const FeatureCard = ({ icon, title, description, diagram }: FeatureProps) => {
  return (
    <div className="group relative h-[280px] perspective-1000">
      <div className="absolute inset-0 transition-all duration-500 ease-out preserve-3d group-hover:my-rotate-y-180">
        {/* Front of card */}
        {/* <p>Avradeep Nayak</p> */}
        <div className="absolute inset-0 backface-hidden border border-muted rounded-lg bg-secondary/20 p-6 flex flex-col items-center">
          <div className="mb-4 text-atlas-purple">
            {icon}
          </div>
          <h3 className="text-lg font-medium mb-2">{title}</h3>
          <p className="text-muted-foreground text-center">{description}</p>
        </div>
        
        {/* Back of card */}
        <div className="absolute inset-0 my-rotate-y-180 backface-hidden border border-atlas-purple/30 rounded-lg bg-secondary/40 p-6 flex flex-col items-center justify-center">
          <div className="w-full h-full flex items-center justify-center">
            {diagram}
          </div>
        </div>
      </div>
    </div>
  );
};

// Code Structure Diagram
const CodeStructureDiagram = () => (
  <div className="w-full h-full relative">
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-2 border-atlas-purple rounded-lg flex items-center justify-center mb-2 animate-pulse-slow">
        <FileCode size={28} className="text-atlas-purple" />
      </div>
      <div className="grid grid-cols-3 gap-2 w-full max-w-[200px]">
        {[...Array(3)].map((_, i) => (
          <div 
            key={i} 
            className="h-10 border border-atlas-teal/50 rounded flex items-center justify-center"
          >
            <FileCode size={16} className="text-atlas-teal" />
          </div>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2 w-full max-w-[200px]">
        {[...Array(3)].map((_, i) => (
          <div 
            key={i} 
            className="h-10 border border-atlas-lightBlue/50 rounded flex items-center justify-center"
          >
            <FileCode size={14} className="text-atlas-lightBlue" />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="absolute border-l border-dashed border-atlas-purple/30"
            style={{
              top: '40%',
              left: `${30 + i * 15}%`,
              height: '40%',
              transform: 'rotate(10deg)'
            }}
          ></div>
        ))}
      </div>
    </div>
  </div>
);

// Dependency Mapping Diagram
const DependencyDiagram = () => (
  <div className="w-full h-full relative">
    <svg width="100%" height="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      {/* Connection lines */}
      <line x1="100" y1="40" x2="50" y2="100" stroke="#8B5CF6" strokeWidth="2" strokeDasharray="4" className="animate-pulse-slow" />
      <line x1="100" y1="40" x2="150" y2="100" stroke="#8B5CF6" strokeWidth="2" strokeDasharray="4" className="animate-pulse-slow" />
      <line x1="50" y1="100" x2="100" y2="160" stroke="#8B5CF6" strokeWidth="2" strokeDasharray="4" className="animate-pulse-slow" />
      <line x1="150" y1="100" x2="100" y2="160" stroke="#8B5CF6" strokeWidth="2" strokeDasharray="4" className="animate-pulse-slow" />
      
      {/* Nodes */}
      <circle cx="100" cy="40" r="15" fill="#14B8A6" />
      <circle cx="50" cy="100" r="15" fill="#14B8A6" />
      <circle cx="150" cy="100" r="15" fill="#14B8A6" />
      <circle cx="100" cy="160" r="15" fill="#14B8A6" />
      
      {/* Arrows */}
      <path d="M95,55 L85,85 L90,83 L95,55" fill="#8B5CF6" />
      <path d="M105,55 L115,85 L110,83 L105,55" fill="#8B5CF6" />
      <path d="M65,110 L90,145 L85,140 L65,110" fill="#8B5CF6" />
      <path d="M135,110 L110,145 L115,140 L135,110" fill="#8B5CF6" />
    </svg>
  </div>
);

// Architecture Diagram
const ArchitectureDiagram = () => (
  <div className="w-full h-full relative">
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative w-[200px] h-[150px]">
        {/* Layers */}
        <div className="absolute top-0 left-0 right-0 h-12 border border-atlas-purple rounded bg-atlas-purple/10 flex items-center justify-center z-30">
          UI Layer
        </div>
        <div className="absolute top-[25%] left-[5%] right-[5%] h-12 border border-atlas-teal rounded bg-atlas-teal/10 flex items-center justify-center z-20">
          Business Logic
        </div>
        <div className="absolute top-[50%] left-[10%] right-[10%] h-12 border border-atlas-lightBlue rounded bg-atlas-lightBlue/10 flex items-center justify-center z-10">
          Data Access
        </div>
        <div className="absolute top-[75%] left-[15%] right-[15%] h-12 border border-gray-500 rounded bg-gray-500/10 flex items-center justify-center">
          Database
        </div>
        
        {/* Connecting lines */}
        <div className="absolute left-1/2 top-12 w-0.5 h-[calc(25%-12px)] bg-atlas-purple/30 animate-pulse-slow"></div>
        <div className="absolute left-1/2 top-[37%] w-0.5 h-[calc(13%)] bg-atlas-teal/30 animate-pulse-slow"></div>
        <div className="absolute left-1/2 top-[62%] w-0.5 h-[calc(13%)] bg-atlas-lightBlue/30 animate-pulse-slow"></div>
      </div>
    </div>
  </div>
);

// Interactive Diagram
const InteractiveDiagram = () => (
  <div className="w-full h-full relative">
    <svg width="100%" height="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      {/* Central node */}
      <circle cx="100" cy="100" r="20" fill="#8B5CF6" className="animate-pulse-slow" />
      
      {/* Orbiting nodes */}
      <g className="animate-spin" style={{ transformOrigin: '100px 100px', animationDuration: '20s' }}>
        <circle cx="100" cy="50" r="10" fill="#14B8A6" />
        <circle cx="150" cy="100" r="10" fill="#14B8A6" />
        <circle cx="100" cy="150" r="10" fill="#14B8A6" />
        <circle cx="50" cy="100" r="10" fill="#14B8A6" />
      </g>
      
      {/* Connecting lines */}
      <line x1="100" y1="100" x2="100" y2="50" stroke="#8B5CF6" strokeWidth="1" strokeDasharray="3" />
      <line x1="100" y1="100" x2="150" y2="100" stroke="#8B5CF6" strokeWidth="1" strokeDasharray="3" />
      <line x1="100" y1="100" x2="100" y2="150" stroke="#8B5CF6" strokeWidth="1" strokeDasharray="3" />
      <line x1="100" y1="100" x2="50" y2="100" stroke="#8B5CF6" strokeWidth="1" strokeDasharray="3" />
      
      {/* Interactive elements */}
      <circle cx="100" cy="50" r="15" fill="transparent" stroke="#14B8A6" strokeWidth="1" className="animate-ping" style={{ animationDuration: '3s' }} />
      <circle cx="150" cy="100" r="15" fill="transparent" stroke="#14B8A6" strokeWidth="1" className="animate-ping" style={{ animationDuration: '4s' }} />
      <circle cx="100" cy="150" r="15" fill="transparent" stroke="#14B8A6" strokeWidth="1" className="animate-ping" style={{ animationDuration: '5s' }} />
      <circle cx="50" cy="100" r="15" fill="transparent" stroke="#14B8A6" strokeWidth="1" className="animate-ping" style={{ animationDuration: '6s' }} />
    </svg>
  </div>
);

const Features = () => {
  const features = [
    {
      icon: <FileCode size={28} />,
      title: "Code Structure Analysis",
      description: "Visualize your codebase structure and discover how files are organized and related.",
      diagram: <CodeStructureDiagram />
    },
    {
      icon: <GitBranch size={28} />,
      title: "Dependency Mapping",
      description: "Map out all dependencies between components and modules to understand your code flow.",
      diagram: <DependencyDiagram />
    },
    {
      icon: <Layers size={28} />,
      title: "Architecture Visualization",
      description: "Identify architectural patterns and visualize how your application is structured.",
      diagram: <ArchitectureDiagram />
    },
    {
      icon: <GitMerge size={28} />,
      title: "Interactive Diagrams",
      description: "Navigate through interactive diagrams to explore your codebase at different levels.",
      diagram: <InteractiveDiagram />
    }
  ];

  useEffect(() => {
    const styleId = 'feature-card-styles';
    
    // Only add once
    if (!document.getElementById(styleId)) {
      const styleEl = document.createElement('style');
      styleEl.id = styleId;
      styleEl.innerHTML = `
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .preserve-3d {
          transform-style: preserve-3d;
        }
        
        .backface-hidden {
          backface-visibility: hidden;
        }
        
        .my-rotate-y-180 {
          transform: rotateY(180deg);
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-spin {
          animation: spin 20s linear infinite;
        }
      `;
      document.head.appendChild(styleEl);
    }
  }, []);

  return (
    <section className="py-16 px-4">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-4 gradient-text">Powerful Visualization Tools</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Hover over each feature to see a visual representation of what Source Code Atlas can do for your codebase.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
