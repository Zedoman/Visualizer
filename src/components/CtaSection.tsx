
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CtaSection = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const styleId = 'cta-section-styles';
    
    if (!document.getElementById(styleId)) {
      const styleEl = document.createElement('style');
      styleEl.id = styleId;
      styleEl.innerHTML = `
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(139, 92, 246, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.05) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `;
      document.head.appendChild(styleEl);
    }
  }, []);

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-atlas-navy opacity-90"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-atlas-purple opacity-20 blur-[100px]"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-atlas-teal opacity-20 blur-[100px]"></div>
      </div>

      <div className="container max-w-5xl mx-auto">
        <div className="bg-secondary/20 border border-atlas-purple/20 rounded-2xl p-8 sm:p-12 backdrop-blur-sm relative overflow-hidden shadow-lg">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-atlas-purple opacity-10 blur-3xl rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-atlas-teal opacity-10 blur-3xl rounded-full"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-center gradient-text">
              Ready to Map Your Codebase?
            </h2>
            
            <p className="text-lg text-center max-w-2xl mx-auto mb-8">
              Gain insights into your repository structure, visualize dependencies, and understand your code architecture in minutes.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                onClick={scrollToTop}
                className="bg-gradient-to-r from-atlas-purple to-atlas-teal hover:opacity-90 transition-opacity px-8 py-6 text-lg"
              >
                Start Visualizing
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                className="border-muted-foreground/30 hover:bg-secondary/50 transition-colors px-8 py-6 text-lg"
              >
                View Examples
              </Button>
            </div>
            
            <div className="mt-8 text-center text-muted-foreground">
              <p>No account required. Just paste a GitHub URL to get started.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;

