import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Import CSS for the visualization
import { RepositoryData } from '../services/githubService';

// Define node types for better type safety
type NodeData = {
  label: string;
  type: string;
  selected?: boolean;
};

type RepoGraphVisualizationProps = {
  repoData: RepositoryData;
  visualizationType: 'structure' | 'dependencies';
  selectedFile?: string;
  onNodeClick?: (node: Node) => void;
};

const RepoGraphVisualization = ({ 
  repoData, 
  visualizationType,
  selectedFile,
  onNodeClick
}: RepoGraphVisualizationProps) => {
  // Initialize states for nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Function to handle connections between nodes
  const onConnect = useCallback((params: any) => {
    setEdges((eds) => addEdge({ ...params, animated: true }, eds));
  }, [setEdges]);

  // Handle node click
  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (onNodeClick) {
      onNodeClick(node);
    }
  }, [onNodeClick]);

  // Generate nodes and edges based on the repository data
  useEffect(() => {
    if (!repoData || !repoData.structure) return;

    // Generate nodes and edges differently based on visualization type
    if (visualizationType === 'structure') {
      generateStructureVisualization(repoData.structure);
    } else {
      generateDependencyVisualization(repoData);
    }
  }, [repoData, visualizationType, selectedFile]);

  // Generate a visualization of the repository file structure
  const generateStructureVisualization = (structure: any[]) => {
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    
    // Create the root node with improved text visibility
    newNodes.push({
      id: 'root',
      data: { 
        label: `${repoData.owner}/${repoData.repo}`, 
        type: 'root',
        selected: false
      },
      position: { x: 250, y: 0 },
      style: { 
        background: 'linear-gradient(to right, rgba(139, 92, 246, 0.3), rgba(20, 184, 166, 0.3))',
        borderColor: '#8B5CF6', 
        borderWidth: 2,
        borderRadius: '8px',
        width: 180,
        padding: '10px',
        color: '#FFFFFF', // Bright white text for visibility
        fontWeight: 'bold',
        textShadow: '1px 1px 2px rgba(0,0,0,0.5)' // Added text shadow for contrast
      },
    });

    // Increased node/level spacing for better readability
    const addNodesAndEdges = (items: any[], parentId: string, startY: number = 120, startX: number = 0, level: number = 0) => {
      const nodeSpacing = 230; // was 180, now increased
      const levelSpacing = 120; // was 100, now increased
      
      const levelWidth = items.length * nodeSpacing;
      const startingX = startX - levelWidth / 2 + nodeSpacing / 2;
      
      items.forEach((item, index) => {
        const nodeId = item.path || `${parentId}-${index}`;
        const isSelected = selectedFile === item.path;
        
        let nodeStyle = {};
        if (item.type === 'directory') {
          nodeStyle = {
            background: isSelected ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.1)',
            borderColor: isSelected ? '#8B5CF6' : '#8B5CF6',
            borderWidth: isSelected ? 2 : 1,
            borderRadius: '8px',
            width: 160,
            padding: '10px',
            color: '#FFFFFF', // Bright white text
            fontWeight: 'bold',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)' // Text shadow for contrast
          };
        } else {
          // Color selection based on file type
          let color = '#94A3B8'; // Default color
          let textColor = '#FFFFFF'; // Default text color
          if (item.name.endsWith('.js') || item.name.endsWith('.jsx')) {
            color = '#F59E0B'; // Yellow for JS
            textColor = '#000000'; // Black text for better readability
          } else if (item.name.endsWith('.ts') || item.name.endsWith('.tsx')) {
            color = '#3B82F6'; // Blue for TS
          } else if (item.name.endsWith('.css') || item.name.endsWith('.scss')) {
            color = '#EC4899'; // Pink for CSS
          } else if (item.name.endsWith('.json')) {
            color = '#10B981'; // Green for JSON
          } else if (item.name.endsWith('.md')) {
            color = '#6366F1'; // Indigo for MD
          } else if (item.name.endsWith('.py')) {
            color = '#3B82F6'; // Blue for Python
          } else if (item.name.endsWith('.rb')) {
            color = '#EF4444'; // Red for Ruby
          }
          
          nodeStyle = {
            borderColor: color,
            borderWidth: isSelected ? 3 : 1,
            backgroundColor: isSelected ? `${color}15` : 'transparent',
            boxShadow: isSelected ? `0 0 0 2px ${color}40` : 'none',
            borderRadius: '4px',
            width: 140,
            padding: '10px',
            color: textColor, // Text color for better visibility
            fontWeight: 'bold',
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)' // Subtle text shadow
          };
        }
        
        const xPos = startingX + index * nodeSpacing;
        const yPos = startY + level * levelSpacing;
        
        newNodes.push({
          id: nodeId,
          data: { label: item.name, type: item.type, selected: isSelected },
          position: { x: xPos, y: yPos },
          style: nodeStyle,
        });
        
        newEdges.push({
          id: `e-${parentId}-${nodeId}`,
          source: parentId,
          target: nodeId,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 15,
            height: 15,
          },
          style: { 
            stroke: isSelected ? '#8B5CF6' : '#CBD5E1',
            strokeWidth: isSelected ? 2 : 1,
          },
        });
        
        if (item.children && item.children.length > 0) {
          addNodesAndEdges(item.children, nodeId, startY, xPos, level + 1);
        }
      });
    };
    
    if (structure && structure.length > 0) {
      addNodesAndEdges(structure, 'root');
    }
    
    setNodes(newNodes);
    setEdges(newEdges);
  };

  // Generate a visualization of the dependencies
  const generateDependencyVisualization = (repoData: RepositoryData) => {
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    
    // Create central node for the repo
    newNodes.push({
      id: 'main',
      data: { label: `${repoData.owner}/${repoData.repo}`, type: 'main', selected: false },
      position: { x: 250, y: 250 },
      style: { 
        background: 'linear-gradient(to right, rgba(139, 92, 246, 0.3), rgba(20, 184, 166, 0.3))',
        borderColor: '#8B5CF6', 
        borderWidth: 2,
        borderRadius: '50%',
        width: 150,
        height: 150,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '10px',
        color: '#FFFFFF', // Bright white text
        fontWeight: 'bold',
        textShadow: '1px 1px 2px rgba(0,0,0,0.5)' // Text shadow for contrast
      },
    });
    
    const fileTypes = repoData.fileTypes;
    const totalFileTypes = fileTypes.length || 8;
    
    fileTypes.forEach((ext, index) => {
      const angle = (index * 360 / totalFileTypes) * Math.PI / 180;
      const radius = 250;
      const x = 250 + radius * Math.cos(angle);
      const y = 250 + radius * Math.sin(angle);
      
      let color = '#94A3B8'; // Default gray
      let textColor = '#FFFFFF'; // Default text color
      if (['js', 'jsx'].includes(ext)) {
        color = '#F59E0B'; // Yellow for JS
        textColor = '#000000'; // Black text for better readability
      } else if (['ts', 'tsx'].includes(ext)) {
        color = '#3B82F6'; // Blue for TS
      } else if (['css', 'scss', 'less'].includes(ext)) {
        color = '#EC4899'; // Pink for CSS
      } else if (ext === 'json') {
        color = '#10B981'; // Green for JSON
      } else if (ext === 'md') {
        color = '#6366F1'; // Indigo for MD
      } else if (ext === 'py') {
        color = '#3B82F6'; // Blue for Python
      } else if (ext === 'rb') {
        color = '#EF4444'; // Red for Ruby
      } else if (['html', 'htm'].includes(ext)) {
        color = '#F97316'; // Orange for HTML
      }
      
      const isSelected = selectedFile && selectedFile.endsWith(`.${ext}`);
      
      newNodes.push({
        id: ext,
        data: { label: `.${ext}`, type: 'dependency', selected: isSelected },
        position: { x, y },
        style: {
          background: isSelected ? `${color}20` : 'rgba(20, 184, 166, 0.1)',
          borderColor: color,
          borderWidth: isSelected ? 3 : 1,
          boxShadow: isSelected ? `0 0 0 2px ${color}40` : 'none',
          borderRadius: '8px',
          width: 120,
          padding: '10px',
          color: textColor, // Text color for better visibility
          fontWeight: 'bold',
          textShadow: '1px 1px 2px rgba(0,0,0,0.3)' // Subtle text shadow
        }
      });
      
      newEdges.push({
        id: `e-main-${ext}`,
        source: 'main',
        target: ext,
        animated: true,
        style: { 
          stroke: isSelected ? color : '#8B5CF6',
          strokeWidth: isSelected ? 2 : 1,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
      });
    });
    
    setNodes(newNodes);
    setEdges(newEdges);
  };

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        fitView
        attributionPosition="bottom-right"
      >
        <Controls />
        <MiniMap />
        <Background color="#f8f8f8" gap={16} />
      </ReactFlow>
    </div>
  );
};

export default RepoGraphVisualization;