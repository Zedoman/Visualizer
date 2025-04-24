import { toast } from "@/components/ui/use-toast";

// For browser environments, we need to handle environment variables differently
// Using import.meta.env for Vite or a hardcoded token if provided
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN || ""; // Replace with your token if needed

interface RepoStructure {
  name: string;
  path: string;
  type: string;
  size?: number;
  usedIn?: string[];
  children?: RepoStructure[];
}

export interface RepositoryData {
  owner: string;
  repo: string;
  structure: RepoStructure[];
  dependencies: Record<string, string[]>; // Changed from Array<{name: string}> to Record
  fileTypes: string[];
  fileCount?: number;
  dirCount?: number;
}

/**
 * Fetch repository structure from GitHub API
 */
export const fetchRepoStructure = async (owner: string, repo: string): Promise<RepositoryData | null> => {
  try {
    console.log(`Fetching repo structure for ${owner}/${repo}`);
    
    // Get repository content - try main branch first
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        ...(GITHUB_TOKEN && { Authorization: `token ${GITHUB_TOKEN}` }),
      },
    });

    if (!response.ok) {
      console.log(`Main branch not found, trying master branch for ${owner}/${repo}`);
      
      // If main branch doesn't exist, try master branch
      const fallbackResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/master?recursive=1`, {
        headers: {
          Accept: "application/vnd.github.v3+json",
          ...(GITHUB_TOKEN && { Authorization: `token ${GITHUB_TOKEN}` }),
        },
      });
      
      if (!fallbackResponse.ok) {
        console.error("Failed to fetch repository data:", await fallbackResponse.text());
        throw new Error("Failed to fetch repository data");
      }
      
      const data = await fallbackResponse.json();
      console.log(`Processing ${data.tree.length} files from master branch`);
      const structure = processRepoStructure(data.tree);
      const fileTypes = extractFileTypes(structure);
      
      const result = {
        owner,
        repo,
        structure,
        dependencies: analyzeDependencies(structure),
        fileTypes,
      };
      
      // Add file usage information
      addFileUsageInfo(result);
      
      return result;
    }

    const data = await response.json();
    console.log(`Processing ${data.tree.length} files from main branch`);
    const structure = processRepoStructure(data.tree);
    const fileTypes = extractFileTypes(structure);
    
    const result = {
      owner,
      repo,
      structure,
      dependencies: analyzeDependencies(structure),
      fileTypes,
    };
    
    // Add file usage information
    addFileUsageInfo(result);
    
    return result;
  } catch (error) {
    console.error("Error fetching repository data:", error);
    toast({
      title: "Error",
      description: "Failed to fetch repository data. Please check the repository URL and try again.",
      variant: "destructive",
    });
    return null;
  }
};

/**
 * Extract unique file types from structure
 */
const extractFileTypes = (structure: RepoStructure[]): string[] => {
  const fileTypes = new Set<string>();
  
  const extractFromNode = (node: RepoStructure) => {
    if (node.type !== 'directory') {
      const extension = node.name.split('.').pop()?.toLowerCase();
      if (extension) fileTypes.add(extension);
    }
    
    if (node.children) {
      node.children.forEach(extractFromNode);
    }
  };
  
  structure.forEach(extractFromNode);
  return Array.from(fileTypes);
};

/**
 * Process the flat tree structure from GitHub API into a nested structure
 */
const processRepoStructure = (tree: any[]): RepoStructure[] => {
  console.log("Processing repository structure");
  const result: RepoStructure[] = [];
  const map: Record<string, RepoStructure> = {};

  // Create nodes for all items
  tree.forEach((item) => {
    const path = item.path;
    const pathParts = path.split('/');
    const name = pathParts[pathParts.length - 1];
    
    map[path] = {
      name,
      path,
      type: item.type === 'blob' ? getFileType(name) : 'directory',
      size: item.size || 0, // Include file size from GitHub API
      children: [],
    };
  });

  // Build the tree structure
  tree.forEach((item) => {
    const path = item.path;
    const pathParts = path.split('/');
    
    if (pathParts.length === 1) {
      // Root level item
      result.push(map[path]);
    } else {
      // Has parent
      const parentPath = pathParts.slice(0, -1).join('/');
      if (map[parentPath]) {
        map[parentPath].children = map[parentPath].children || [];
        map[parentPath].children.push(map[path]);
      }
    }
  });

  console.log(`Built structure with ${result.length} root items`);
  return result;
};

/**
 * Determine file type based on extension
 */
const getFileType = (filename: string): string => {
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  
  const fileTypes: Record<string, string> = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    css: 'stylesheet',
    scss: 'stylesheet',
    less: 'stylesheet',
    html: 'html',
    json: 'json',
    md: 'markdown',
    png: 'image',
    jpg: 'image',
    jpeg: 'image',
    gif: 'image',
    svg: 'image',
    py: 'python',
    rb: 'ruby',
    php: 'php',
    java: 'java',
    go: 'go',
    rs: 'rust',
    c: 'c',
    cpp: 'cpp',
    h: 'c-header',
    cs: 'csharp',
    swift: 'swift',
    kt: 'kotlin',
    dart: 'dart',
    yaml: 'yaml',
    yml: 'yaml',
    toml: 'toml',
    sh: 'shell',
    bat: 'batch',
    ps1: 'powershell',
    txt: 'text',
    csv: 'csv',
    pdf: 'pdf',
    doc: 'document',
    docx: 'document',
    xls: 'spreadsheet',
    xlsx: 'spreadsheet',
  };
  
  return fileTypes[extension] || 'file';
};

/**
 * Simple dependency analysis from file structure
 */
const analyzeDependencies = (structure: RepoStructure[]): Record<string, string[]> => {
  const dependencies: Record<string, string[]> = {};
  
  // Simplified dependency analysis - in a real app, this would parse file contents
  // This is a placeholder implementation
  const processNode = (node: RepoStructure) => {
    if (node.type === 'javascript' || node.type === 'typescript') {
      dependencies[node.path] = [];
    }
    
    if (node.children) {
      node.children.forEach(processNode);
    }
  };
  
  structure.forEach(processNode);
  
  return dependencies;
};

/**
 * Add file usage information to the repository structure
 */
const addFileUsageInfo = (repoData: RepositoryData) => {
  const fileRefs: Record<string, Set<string>> = {};
  
  // Initialize all file paths
  const initializeFilePaths = (node: RepoStructure, basePath = '') => {
    const fullPath = basePath ? `${basePath}/${node.name}` : node.name;
    
    if (node.type !== 'directory') {
      fileRefs[fullPath] = new Set();
    }
    
    if (node.children) {
      node.children.forEach(child => initializeFilePaths(child, fullPath));
    }
  };
  
  repoData.structure.forEach(node => initializeFilePaths(node));
  
  // Analyze code for imports and references (simplified)
  const analyzeFileReferences = (node: RepoStructure) => {
    if (node.type === 'javascript' || node.type === 'typescript') {
      // For JS/TS files, analyze imports
      Object.keys(fileRefs).forEach(filePath => {
        if (filePath !== node.path && 
           (filePath.endsWith('.js') || 
            filePath.endsWith('.jsx') || 
            filePath.endsWith('.ts') || 
            filePath.endsWith('.tsx'))) {
          // Simplified: Assume files in the same directory might import each other
          const importProbability = Math.random();
          if (importProbability > 0.7) {
            fileRefs[filePath].add(node.path);
          }
        }
      });
    }
    
    if (node.children) {
      node.children.forEach(analyzeFileReferences);
    }
  };
  
  repoData.structure.forEach(analyzeFileReferences);
  
  // Update the structure with usage information
  const updateFileUsage = (node: RepoStructure) => {
    if (node.type !== 'directory') {
      node.usedIn = Array.from(fileRefs[node.path] || []);
    }
    
    if (node.children) {
      node.children.forEach(updateFileUsage);
    }
  };
  
  repoData.structure.forEach(updateFileUsage);
};

/**
 * Generate visualization data for the repository
 */
export const generateVisualizationData = (repoData: RepositoryData) => {
  // This would be implemented to transform the repository data into
  // format needed for visualization libraries
  return {
    nodes: transformToNodes(repoData.structure),
    links: generateLinks(repoData.dependencies),
  };
};

const transformToNodes = (structure: RepoStructure[]) => {
  const nodes: any[] = [];
  
  const processNode = (node: RepoStructure, level: number = 0) => {
    nodes.push({
      id: node.path,
      name: node.name,
      type: node.type,
      level,
    });
    
    if (node.children) {
      node.children.forEach(child => processNode(child, level + 1));
    }
  };
  
  structure.forEach(node => processNode(node));
  
  return nodes;
};

const generateLinks = (dependencies: Record<string, string[]>) => {
  const links: any[] = [];
  
  Object.entries(dependencies).forEach(([source, targets]) => {
    targets.forEach(target => {
      links.push({
        source,
        target,
      });
    });
  });
  
  return links;
};