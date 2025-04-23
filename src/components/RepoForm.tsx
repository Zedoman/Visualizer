import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useGitHubUrlValidation } from "@/hooks/useGitHubUrlValidation";
import { fetchRepoStructure } from '@/services/githubService';

type RepoFormProps = {
  onPreview?: (repoData: any) => void;
};

const safeLocalStorage = {
  setItem: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error("localStorage error:", error);
      return false;
    }
  },
  
  getItem: (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error("localStorage error:", error);
      return null;
    }
  },
  
  setLargeItem: (key: string, value: any) => {
    try {
      const simplifiedData = {
        owner: value.owner,
        repo: value.repo,
        fileTypes: value.fileTypes,
        structure: value.structure.map((item: any) => ({
          name: item.name,
          path: item.path,
          type: item.type,
          size: item.size || 0,
          children: item.children ? 
            item.children.map((child: any) => ({
              name: child.name,
              path: child.path,
              type: child.type,
              size: child.size || 0,
            })) : []
        }))
      };
      try {
        const serialized = JSON.stringify(simplifiedData);
        localStorage.setItem(key, serialized);
        return "localStorage";
      } catch (e) {
        const serialized = JSON.stringify(simplifiedData);
        sessionStorage.setItem(key, serialized);
        localStorage.setItem(`${key}_storage`, "session");
        return "sessionStorage";
      }
    } catch (error) {
      console.error("Storage error:", error);
      return false;
    }
  }
};

const RepoForm: React.FC<RepoFormProps> = ({ onPreview }) => {
  const [repoUrl, setRepoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);
  
  const validation = useGitHubUrlValidation(repoUrl);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowValidationError(true);
    if (!validation.isValid) {
      toast({
        title: "Validation Error",
        description: validation.errorMessage,
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    try {
      const { owner, repo } = validation.repoDetails!;
      const repoData = await fetchRepoStructure(owner, repo);
      if (repoData) {
        // Same storage logic
        const storageType = safeLocalStorage.setLargeItem('repoData', repoData);

        if (onPreview) {
          onPreview(repoData);
        }

        if (storageType) {
          toast({
            title: "Repository analyzed",
            description: `Successfully analyzed ${owner}/${repo}. Visualization preview generated below.`,
          });
        } else {
          throw new Error("Failed to store repository data");
        }
      } else {
        throw new Error("Failed to analyze repository");
      }
    } catch (error) {
      console.error("Error analyzing repository:", error);
      toast({
        title: "Error",
        description: "Repository too large to analyze in browser. Try a smaller repository.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setShowValidationError(false);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRepoUrl(e.target.value);
    if (showValidationError) {
      setShowValidationError(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl">
      <div className="flex flex-col sm:flex-row w-full gap-2 sm:gap-4">
        <div className="flex-grow">
          <Input
            type="text"
            placeholder="https://github.com/facebook/react"
            value={repoUrl}
            onChange={handleUrlChange}
            className={`bg-secondary/50 border-1 border-secondary w-full ${
              showValidationError && !validation.isValid 
                ? 'border-red-500 focus-visible:ring-red-500' 
                : ''
            }`}
          />
          {showValidationError && !validation.isValid && (
            <p className="text-red-500 text-sm mt-1">{validation.errorMessage}</p>
          )}
        </div>
        <Button 
          type="submit" 
          className="bg-gradient-to-r from-atlas-purple to-atlas-teal hover:opacity-90 transition-opacity"
          disabled={isLoading}
        >
          {isLoading ? "Analyzing..." : "Visualize Repo"}
        </Button>
      </div>
      <p className="text-muted-foreground mt-2 text-sm">
        Enter a public GitHub repository URL to generate a visualization
      </p>
    </form>
  );
};

export default RepoForm;