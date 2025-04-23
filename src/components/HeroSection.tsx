
import React, { useState } from 'react';
import RepoForm from './RepoForm';
import RepoPreviewVisualization from './RepoPreviewVisualization';
import { RepositoryData } from '@/services/githubService';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [previewRepoData, setPreviewRepoData] = useState<RepositoryData | null>(null);
  const [ownerRepo, setOwnerRepo] = useState<{ owner: string; repo: string } | null>(null);
  const navigate = useNavigate();

  // Callback passed to RepoForm
  const handlePreviewData = (repoData: RepositoryData) => {
    setPreviewRepoData(repoData);
    setOwnerRepo({ owner: repoData.owner, repo: repoData.repo });
  };

  const handleGoToFullVis = () => {
    if (ownerRepo) {
      navigate(`/visualization/${ownerRepo.owner}/${ownerRepo.repo}`);
    }
  };

  return (
    <section className="relative py-20 flex items-center min-h-[70vh]">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="gradient-text">Source Code Atlas</span>
          </h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium mb-8 text-gray-200">
            Map & Visualize GitHub Repositories
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Transform complex codebases into clear, interactive visualizations.
            Understand structure, dependencies, and relationships at a glance.
          </p>
          
          <div className="flex justify-center mb-12">
            <RepoForm onPreview={handlePreviewData} />
          </div>
          
          <div className="relative">
            <div className="border border-muted rounded-lg overflow-hidden p-2 bg-secondary/20 shadow-xl">
              <div className="aspect-video relative rounded overflow-hidden flex flex-col items-center justify-center min-h-[340px]">
                {previewRepoData ? (
                  <>
                    <RepoPreviewVisualization repoData={previewRepoData} />
                    <Button 
                      className="mt-6 bg-gradient-to-r from-atlas-purple to-atlas-teal"
                      onClick={handleGoToFullVis}
                    >
                      Go to Full Visualization
                    </Button>
                  </>
                ) : (
                  <div className="absolute inset-0 bg-atlas-navy flex items-center justify-center">
                    <div className="text-center max-w-md">
                      <div className="animate-float">
                        <svg className="mx-auto w-48 h-48 opacity-80" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                          <g fill="none" stroke="#8B5CF6" strokeWidth="1">
                            <circle cx="50" cy="50" r="20" />
                            <circle cx="50" cy="50" r="30" />
                            <circle cx="50" cy="50" r="40" />
                            <line x1="30" y1="50" x2="70" y2="50" />
                            <line x1="50" y1="30" x2="50" y2="70" />
                            <line x1="35" y1="35" x2="65" y2="65" />
                            <line x1="35" y1="65" x2="65" y2="35" />
                          </g>
                          <g fill="#14B8A6">
                            <circle cx="30" cy="50" r="3" />
                            <circle cx="50" cy="30" r="3" />
                            <circle cx="70" cy="50" r="3" />
                            <circle cx="50" cy="70" r="3" />
                            <circle cx="35" cy="35" r="3" />
                            <circle cx="65" cy="35" r="3" />
                            <circle cx="35" cy="65" r="3" />
                            <circle cx="65" cy="65" r="3" />
                          </g>
                        </svg>
                      </div>
                      <p className="text-gray-400 mt-4">Visualization preview will appear here</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;