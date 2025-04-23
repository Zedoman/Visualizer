
import React from 'react';
import GradientBackground from '@/components/GradientBackground';
import HeroSection from '@/components/HeroSection';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import CtaSection from '@/components/CtaSection';
import Logo from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <GradientBackground />
      
      <header className="py-4 px-4 border-b border-muted backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Logo />
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </a>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        <HeroSection />
        <div id="features">
          <Features />
        </div>
        <HowItWorks />
        <CtaSection />
      </main>
      
      <footer className="py-8 px-4 border-t border-muted">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Logo className="mb-4 md:mb-0" />
            <div className="flex gap-6">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Features</a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors text-sm">How It Works</a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors text-sm">GitHub</a>
            </div>
            <div className="text-muted-foreground text-sm mt-4 md:mt-0">
              <p>© {new Date().getFullYear()} Source Code Atlas • Map your code like never before</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
