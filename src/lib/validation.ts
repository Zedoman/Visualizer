
/**
 * Validates if a string is a valid GitHub repository URL
 */
export const isValidGitHubUrl = (url: string): boolean => {
  // Basic validation for GitHub URL format
  const githubUrlPattern = /^https:\/\/github\.com\/[\w-]+\/[\w.-]+\/?$/;
  return githubUrlPattern.test(url);
};

/**
 * Extracts the owner and repo name from a GitHub URL
 */
export const extractRepoDetails = (url: string): { owner: string; repo: string } | null => {
  // Remove trailing slash if present
  const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url;
  
  // Extract owner and repo from URL
  const match = cleanUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  // <p>Avradeep Nayak</p>
  if (match && match.length === 3) {
    return {
      owner: match[1],
      repo: match[2]
    };
  }
  
  return null;
};
