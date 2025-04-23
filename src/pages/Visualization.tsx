
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Filter, ZoomIn, ZoomOut, Maximize, FileText, FileImage, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RepositoryData, fetchRepoStructure } from '@/services/githubService';
import { toast } from '@/components/ui/use-toast';
import VisualizationLoader from '@/components/VisualizationLoader';
import RepoGraphVisualization from '@/components/RepoGraphVisualization';
import CodeBlock from "@/components/CodeBlock";

const Visualization = () => {
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  const [repoData, setRepoData] = useState<RepositoryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('structure');
  const [selectedFile, setSelectedFile] = useState<RepoStructure | null>(null);
  const [fileCode, setFileCode] = useState<string | null>(null);
  const [isCodeLoading, setIsCodeLoading] = useState(false);
  const graphRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      if (!owner || !repo) {
        toast({
          title: "Error",
          description: "Missing repository information",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      setIsLoading(true);
      
      const storedData = localStorage.getItem('repoData');
      
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData) as RepositoryData;
          if (parsedData.owner === owner && parsedData.repo === repo) {
            console.log("Using cached repository data");
            setRepoData(parsedData);
            setIsLoading(false);
            return;
          }
        } catch (error) {
          console.error("Error parsing stored repository data:", error);
        }
      }
      
      try {
        console.log(`Fetching fresh data for ${owner}/${repo}`);
        const data = await fetchRepoStructure(owner, repo);
        
        if (data) {
          setRepoData(data);
          localStorage.setItem('repoData', JSON.stringify(data));
        } else {
          toast({
            title: "Error",
            description: "Failed to load repository data",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error loading repository data:", error);
        toast({
          title: "Error",
          description: "Failed to load repository data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [owner, repo, navigate]);

  const handleBackClick = () => {
    navigate('/');
  };

  // Make sure we're properly handling the case when graphRef is not available
  const exportAsPNG = async () => {
    console.log("Exporting as PNG, graph ref:", graphRef.current);
    if (!graphRef.current) {
      toast({
        title: "Error",
        description: "Visualization element not found",
        variant: "destructive",
      });
      return;
    }
    try {
      // Import html2canvas dynamically
      const html2canvasModule = await import('html2canvas');
      const html2canvas = html2canvasModule.default;
      
      // Create a canvas from the graph element
      const canvas = await html2canvas(graphRef.current, {
        backgroundColor: null,
        scale: 2,
      });
      
      // Create a download link
      const link = document.createElement('a');
      link.download = `${owner}-${repo}-visualization.png`;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Success",
        description: "Visualization exported as PNG",
      });
    } catch (error) {
      console.error('Error exporting as PNG:', error);
      toast({
        title: "Error",
        description: `Failed to export visualization as PNG: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const exportAsPDF = async () => {
    console.log("Exporting as PDF, graph ref:", graphRef.current);
    if (!graphRef.current) {
      toast({
        title: "Error",
        description: "Visualization element not found",
        variant: "destructive",
      });
      return;
    }
    try {
      // Import html2canvas and jsPDF dynamically
      const html2canvasModule = await import('html2canvas');
      const html2canvas = html2canvasModule.default;
      const jsPDFModule = await import('jspdf');
      
      // Create a canvas from the graph element
      const canvas = await html2canvas(graphRef.current, {
        backgroundColor: null,
        scale: 2,
      });
      
      // Create a new PDF document
      const pdf = new jsPDFModule.jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      
      // Save the PDF
      pdf.save(`${owner}-${repo}-visualization.pdf`);
      
      toast({
        title: "Success",
        description: "Visualization exported as PDF",
      });
    } catch (error) {
      console.error('Error exporting as PDF:', error);
      toast({
        title: "Error",
        description: `Failed to export visualization as PDF: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const exportAsMarkdown = async () => {
    if (!repoData) return;
    
    try {
      const repoName = `${owner}/${repo}`;
      let markdown = `# Repository Structure: ${repoName}\n\n`;
      
      markdown += `Generated on: ${new Date().toLocaleString()}\n\n`;
      
      markdown += `## File Structure\n\n\`\`\`\n`;
      
      const formatStructure = (items: RepoStructure[], indent = 0): string => {
        let result = '';
        items.forEach(item => {
          const indentation = ' '.repeat(indent * 2);
          result += `${indentation}${item.name}${item.type === 'directory' ? '/' : ''}\n`;
          
          if (item.children && item.children.length > 0) {
            result += formatStructure(item.children, indent + 1);
          }
        });
        return result;
      };
      
      markdown += formatStructure(repoData.structure);
      markdown += `\`\`\`\n\n`;
      
      markdown += `## File Statistics\n\n`;
      const fileTypes = repoData.fileTypes;
      markdown += `Total file types: ${fileTypes.length}\n\n`;
      markdown += `File types: ${fileTypes.join(', ')}\n\n`;
      
      const blob = new Blob([markdown], { type: 'text/markdown' });
      const link = document.createElement('a');
      link.download = `${owner}-${repo}-visualization.md`;
      link.href = URL.createObjectURL(blob);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Success",
        description: "Visualization exported as Markdown",
      });
    } catch (error) {
      console.error('Error exporting as Markdown:', error);
      toast({
        title: "Error",
        description: "Failed to export visualization",
        variant: "destructive",
      });
    }
  };

  const exportAsMermaid = async () => {
    if (!repoData) return;
    let mermaid = '```mermaid\ngraph TD\n  root["' + owner + '/' + repo + '"]\n';

    const walk = (items, parentId) => {
      items.forEach((item, idx) => {
        const currId = `${parentId}_${idx}`;
        mermaid += `  ${parentId} --> ${currId}["${item.name.replace(/"/g, '\\"')}"]\n`;
        if (item.children && item.children.length > 0) {
          walk(item.children, currId);
        }
      });
    };
    walk(repoData.structure, 'root');
    mermaid += '```\n';

    const blob = new Blob([mermaid], { type: 'text/markdown' });
    const link = document.createElement('a');
    link.download = `${owner}-${repo}-visualization.mmd.md`;
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Success",
      description: "Visualization exported as Mermaid code",
    });
  };

  const handleExport = (format: 'png' | 'pdf' | 'md' | 'mermaid') => {
    const filename = `${owner}-${repo}-visualization.${format}`;
    toast({
      title: "Export initiated",
      description: `Exporting visualization as ${format.toUpperCase()} (${filename})`,
    });

    switch (format) {
      case 'png':
        exportAsPNG();
        break;
      case 'pdf':
        exportAsPDF();
        break;
      case 'md':
        exportAsMarkdown();
        break;
      case 'mermaid':
        exportAsMermaid();
        break;
    }
  };

  const handleFileClick = (file: RepoStructure) => {
    setSelectedFile(file);
  };

  const fetchFileCode = async (file: RepoStructure) => {
    if (!owner || !repo || file.type === "directory") {
      setFileCode(null);
      return;
    }
    setIsCodeLoading(true);
    setFileCode(null);
    const tryRawUrl = async (branch: string) => {
      const encodedPath = encodeURIComponent(file.path).replace(/%2F/g, '/');
      return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${encodedPath}`;
    };
    let branches = ["main", "master"];
    let rawUrl = "";
    let code: string | null = null;
    for (let branch of branches) {
      try {
        const url = await tryRawUrl(branch);
        const response = await fetch(url);
        if (response.ok) {
          code = await response.text();
          rawUrl = url;
          break;
        }
      } catch (error) {
        continue;
      }
    }
    setIsCodeLoading(false);
    if (code) {
      setFileCode(code);
    } else {
      setFileCode("// Unable to fetch file content.\n// It may be a binary file or does not exist in raw format.");
    }
  };

  useEffect(() => {
    if (selectedFile && selectedFile.type !== "directory") {
      fetchFileCode(selectedFile);
    } else {
      setFileCode(null);
    }
    // eslint-disable-next-line
  }, [selectedFile]);

  const formatFileSize = (bytes: number | undefined): string => {
    if (bytes === undefined) return 'Unknown size';
    
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderFileTree = (structure: RepoStructure[] = []) => {
    return (
      <ul className="space-y-1 text-sm">
        {structure.map((item) => (
          <li key={item.path} className="pl-2">
            <div 
              className={`flex items-center py-1 px-2 rounded cursor-pointer ${selectedFile?.path === item.path ? 'bg-secondary' : 'hover:bg-secondary/20'}`}
              onClick={() => handleFileClick(item)}
            >
              <span className={`mr-2 h-4 w-4 ${getIconForType(item.type)}`}></span>
              <span>{item.name}</span>
              {item.type !== 'directory' && (
                <span className="ml-auto text-xs text-muted-foreground">
                  {formatFileSize(item.size)}
                </span>
              )}
            </div>
            {item.children && item.children.length > 0 && (
              <ul className="pl-4 space-y-1 mt-1">
                {renderFileTree(item.children)}
              </ul>
            )}
          </li>
        ))}
      </ul>
    );
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'directory':
        return 'text-blue-500';
      case 'javascript':
        return 'text-yellow-500';
      case 'typescript':
        return 'text-blue-400';
      case 'stylesheet':
        return 'text-pink-500';
      case 'markdown':
        return 'text-green-500';
      case 'json':
        return 'text-orange-500';
      case 'python':
        return 'text-blue-600';
      case 'ruby':
        return 'text-red-500';
      case 'html':
        return 'text-orange-600';
      default:
        return 'text-gray-500';
    }
  };

  const uniqueFileTypes = repoData?.fileTypes?.length
    ? repoData.fileTypes
    : (
      repoData?.structure
        ?.flatMap(function extract(node): string[] {
          if (node.type === "directory" && node.children?.length)
            return node.children.flatMap(extract);
          if (node.type !== "directory") {
            const ext = node.name.includes('.') ? node.name.split('.').pop()!.toLowerCase() : node.type;
            return [ext];
          }
          return [];
        })
        .filter(Boolean) ?? []
    );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <VisualizationLoader />
          <h1 className="text-xl font-medium mt-4">Loading visualization...</h1>
          <Button onClick={handleBackClick} variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  if (!repoData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No repository data found</h1>
          <p className="mb-4 text-muted-foreground">
            We couldn't find or load data for this repository.
          </p>
          <Button onClick={handleBackClick} variant="default">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="py-4 px-4 border-b border-muted backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button onClick={handleBackClick} variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-bold">
              {owner}/{repo}
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-1 flex">
        <div className="w-64 border-r border-muted p-4 hidden md:block">
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">File Explorer</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search files..."
                className="w-full p-2 pl-8 bg-secondary/20 rounded-md border border-muted text-sm"
              />
              <svg
                className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2 flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </h3>
            <label className="flex items-center text-sm mb-2">
              <input type="checkbox" className="mr-2" />
              Show entry points only
            </label>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">File Types</h3>
            <div className="space-y-1 text-sm max-h-36 overflow-y-auto">
              {uniqueFileTypes.length > 0
                ? uniqueFileTypes.map((ext) => (
                  <label key={ext} className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    .{ext}
                  </label>
                ))
                : <span className="text-xs text-muted-foreground">No file types found</span>
              }
            </div>
          </div>

          <div className="mt-4 overflow-auto max-h-[calc(100vh-300px)]">
            {repoData?.structure && renderFileTree(repoData.structure)}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="border-b border-muted p-4">
            <Tabs defaultValue="structure" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="structure">Structure</TabsTrigger>
                <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex-1 p-4 relative">
            <div className="absolute top-4 right-4 flex space-x-2 z-10">
              <Button variant="outline" size="sm">
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Maximize className="h-4 w-4" />
              </Button>
            </div>

            {/* Important: Add the ref to this div that contains the visualization */}
            <div ref={graphRef} className="w-full h-full bg-secondary/10 rounded-lg border border-muted">
              {repoData && (
                <RepoGraphVisualization 
                  repoData={repoData} 
                  visualizationType={activeTab as 'structure' | 'dependencies'} 
                  selectedFile={selectedFile?.path}
                  onNodeClick={(node) => {
                    const findFile = (structure: RepoStructure[], path: string): RepoStructure | null => {
                      for (const item of structure) {
                        if (item.path === path) {
                          return item;
                        }
                        if (item.children) {
                          const found = findFile(item.children, path);
                          if (found) return found;
                        }
                      }
                      return null;
                    };
                    
                    const file = findFile(repoData.structure, node.id);
                    if (file) {
                      setSelectedFile(file);
                    }
                  }}
                />
              )}
            </div>
          </div>

          <div className="border-t border-muted p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-background">
            <div>
              <h2 className="text-lg font-semibold mb-4">Details</h2>
              {selectedFile ? (
                <div className="border border-muted rounded-md p-4 bg-secondary/10">
                  <h3 className="text-base font-medium mb-2">{selectedFile.name}</h3>
                  <div className="space-y-3 mt-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">File Type</p>
                      <p className="text-sm">{selectedFile.type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Size</p>
                      <p className="text-sm">{formatFileSize(selectedFile.size)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Path</p>
                      <p className="text-sm break-all">{selectedFile.path}</p>
                    </div>
                    {selectedFile.usedIn && selectedFile.usedIn.length > 0 ? (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Used In</p>
                        <ul className="text-sm space-y-1 max-h-32 overflow-y-auto">
                          {selectedFile.usedIn.map((file) => (
                            <li key={file} className="break-all">{file}</li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Used In</p>
                        <p className="text-sm italic">Not referenced in other files</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="border border-muted rounded-md p-4 bg-secondary/10">
                  <div className="flex justify-center items-center h-32">
                    <div className="text-center">
                      <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Select a file in the visualization to view details
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-4">Code</h2>
              {selectedFile && selectedFile.type !== "directory" ? (
                isCodeLoading ? (
                  <div className="flex items-center justify-center h-40">
                    <span className="animate-pulse text-muted-foreground">Loading code...</span>
                  </div>
                ) : (
                  fileCode ? (
                    <CodeBlock code={fileCode} language={selectedFile.type} />
                  ) : (
                    <span className="text-xs text-muted-foreground">No preview available.</span>
                  )
                )
              ) : (
                <span className="text-xs text-muted-foreground">Select a file to preview its code.</span>
              )}
            </div>
          </div>

          <div className="border-t border-muted p-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Export Visualization</h3>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleExport('png')}>
                  <FileImage className="h-4 w-4 mr-2" />
                  PNG
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
                  <File className="h-4 w-4 mr-2" />
                  PDF
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleExport('md')}>
                  <FileText className="h-4 w-4 mr-2" />
                  MD
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleExport('mermaid')}>
                  <Download className="h-4 w-4 mr-2" />
                  Mermaid
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

interface RepoStructure {
  name: string;
  path: string;
  type: string;
  size?: number;
  usedIn?: string[];
  children?: RepoStructure[];
}

export default Visualization;
