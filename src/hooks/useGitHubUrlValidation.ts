
import { useState } from 'react';
import { isValidGitHubUrl, extractRepoDetails } from "@/lib/validation";

interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
  repoDetails: { owner: string; repo: string } | null;
}

/**
 * A hook to validate GitHub repository URLs
 * @param url The GitHub URL to validate
 * @returns Validation result with error message and repo details
 */
export const useGitHubUrlValidation = (url: string): ValidationResult => {
  // Check if the URL is empty
  if (!url.trim()) {
    return {
      isValid: false,
      errorMessage: "Please enter a GitHub repository URL",
      repoDetails: null
    };
  }

  // Validate URL format
  if (!isValidGitHubUrl(url)) {
    return {
      isValid: false,
      errorMessage: "Please enter a valid GitHub repository URL (e.g., https://github.com/owner/repo)",
      repoDetails: null
    };
  }

  // Extract repository details
  const repoDetails = extractRepoDetails(url);
  
  if (!repoDetails) {
    return {
      isValid: false,
      errorMessage: "Could not extract repository details from the URL",
      repoDetails: null
    };
  }

  // URL is valid and details were extracted successfully
  return {
    isValid: true,
    errorMessage: null,
    repoDetails
  };
};
