
import React from 'react';
import { cn } from '@/lib/utils';
import { 
  GitBranch, 
  FileCode, 
  Database, 
  Code,
  Layers3
} from 'lucide-react';

interface StepProps {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  isLast?: boolean;
}

const Step: React.FC<StepProps> = ({ 
  number, 
  title, 
  description, 
  icon,
  isLast = false 
}) => {
  return (
    <div className="flex">
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-atlas-purple bg-atlas-purple/10 text-white relative z-10">
          {icon}
        </div>
        {!isLast && (
          <div className="w-0.5 grow bg-gradient-to-b from-atlas-purple to-atlas-purple/0 mt-2"></div>
        )}
      </div>
      <div className="ml-6 pb-12">
        <div className="flex items-baseline mb-2">
          <span className="text-atlas-purple font-bold mr-2">Step {number}</span>
          <h3 className="text-xl font-medium">{title}</h3>
        </div>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

const ProcessVisualization = () => {
  return (
    <div className="relative w-full h-full min-h-[300px] border border-muted rounded-lg p-6 bg-secondary/20">
      <div className="absolute inset-0 overflow-hidden rounded-lg">
        {/* Flow lines */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M100,40 C170,40 170,110 100,110 C30,110 30,180 100,180" 
            fill="none" 
            stroke="url(#purpleGradient)" 
            strokeWidth="2" 
            strokeDasharray="6,3"
            className="flow-path-animation"
          />
          <defs>
            <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#14B8A6" />
            </linearGradient>
          </defs>
        </svg>

        {/* Process steps */}
        <div className="absolute top-[10%] left-[10%] transform -translate-y-1/2 flex items-center">
          <div className="process-node">
            <div className="w-10 h-10 rounded-full bg-atlas-purple flex items-center justify-center">
              <GitBranch size={20} className="text-white" />
            </div>
            <span className="ml-2 font-medium text-white">Input GitHub URL</span>
          </div>
        </div>

        <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 flex items-center">
          <div className="process-node">
            <div className="w-10 h-10 rounded-full bg-atlas-purple flex items-center justify-center">
              <Database size={20} className="text-white" />
            </div>
            <span className="ml-2 font-medium text-white">Fetch Repository</span>
          </div>
        </div>

        <div className="absolute top-[70%] left-[90%] transform -translate-x-full -translate-y-1/2 flex items-center">
          <div className="process-node">
            <div className="w-10 h-10 rounded-full bg-atlas-purple flex items-center justify-center">
              <Code size={20} className="text-white" />
            </div>
            <span className="ml-2 font-medium text-white">Parse Code</span>
          </div>
        </div>

        <div className="absolute top-[90%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 flex items-center">
          <div className="process-node">
            <div className="w-10 h-10 rounded-full bg-atlas-teal flex items-center justify-center">
              <Layers3 size={20} className="text-white" />
            </div>
            <span className="ml-2 font-medium text-white">Generate Visualization</span>
          </div>
        </div>

        {/* Moving dot animation */}
        <div className="flow-dot"></div>
      </div>
    </div>
  );
};

const HowItWorks = () => {
  // Add necessary styles for animations
  React.useEffect(() => {
    const styleId = 'how-it-works-styles';
    
    if (!document.getElementById(styleId)) {
      const styleEl = document.createElement('style');
      styleEl.id = styleId;
      styleEl.innerHTML = `
        .process-node {
          display: flex;
          align-items: center;
          padding: 0.5rem 0.75rem;
          background-color: rgba(10, 25, 47, 0.7);
          border-radius: 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          backdrop-filter: blur(4px);
        }
        
        @keyframes flowPathAnimation {
          0% {
            stroke-dashoffset: 200;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        
        .flow-path-animation {
          stroke-dashoffset: 200;
          animation: flowPathAnimation 6s linear infinite;
        }
        
        @keyframes flowDotAnimation {
          0% {
            offset-distance: 0%;
          }
          100% {
            offset-distance: 100%;
          }
        }
        
        .flow-dot {
          width: 8px;
          height: 8px;
          background-color: #14B8A6;
          border-radius: 50%;
          box-shadow: 0 0 8px 2px rgba(20, 184, 166, 0.6);
          position: absolute;
          offset-path: path('M100,40 C170,40 170,110 100,110 C30,110 30,180 100,180');
          offset-distance: 0%;
          animation: flowDotAnimation 6s linear infinite;
        }
      `;
      document.head.appendChild(styleEl);
    }
  }, []);

  return (
    <section className="py-16 px-4 relative overflow-hidden" id="how-it-works">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-4 gradient-text">How It Works</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Source Code Atlas simplifies the process of understanding complex codebases through visualization.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-2">
            <Step 
              number={1} 
              title="Input GitHub Repository" 
              description="Enter the URL of any public GitHub repository you want to analyze. Our system validates the URL and prepares for processing."
              icon={<GitBranch size={24} />}
            />
            
            <Step 
              number={2} 
              title="Fetch & Clone Repository" 
              description="We securely fetch the repository content using the GitHub API or clone it to our system for deeper analysis."
              icon={<Database size={24} />}
            />
            
            <Step 
              number={3} 
              title="Parse Code Structure" 
              description="Our engine analyzes the codebase, identifying files, folders, dependencies, and relationships between components."
              icon={<Code size={24} />}
            />
            
            <Step 
              number={4} 
              title="Generate Interactive Visualization" 
              description="The analysis results are transformed into interactive diagrams that help you understand the codebase structure at a glance."
              icon={<Layers3 size={24} />}
              isLast
            />
          </div>
          
          <ProcessVisualization />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
