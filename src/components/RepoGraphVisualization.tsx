
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
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useTheme } from '@/components/ThemeProvider';

type RepositoryData = {
  owner: string;
  repo: string;
  structure: any[];
  fileTypes: string[];
  fileCount?: number;
  dirCount?: number;
  dependencies: Record<string, string[]>; // Updated to match githubService
};

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
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const onConnect = useCallback((params: any) => {
    setEdges((eds) => addEdge({ ...params, animated: true }, eds));
  }, [setEdges]);

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (onNodeClick) {
      onNodeClick(node);
    }
  }, [onNodeClick]);

  // Calculate width based on text length
  const calculateTextWidth = (text: string, fontSize: number, padding: number) => {
    // Approximate width calculation based on character count and font size
    const avgCharWidth = fontSize * 0.6; // Rough approximation
    return Math.ceil(text.length * avgCharWidth + padding * 2);
  };

  useEffect(() => {
    if (!repoData || !repoData.structure) return;

    if (visualizationType === 'structure') {
      generateStructureVisualization(repoData.structure);
    } else {
      generateDependencyVisualization(repoData);
    }
  }, [repoData, visualizationType, selectedFile, isDarkMode]);

  const generateStructureVisualization = (structure: any[]) => {
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    
    // Calculate optimal node spacing based on structure size
    const nodeCount = countTotalNodes(structure);
    const baseNodeSpacing = Math.max(150, 800 / Math.max(1, Math.sqrt(nodeCount / 2)));
    const levelSpacing = 100;
    
    const repoName = `${repoData.owner}/${repoData.repo}`;
    const rootNodeWidth = calculateTextWidth(repoName, 16, 24); // fontSize 16, padding 24 (12px each side)

    newNodes.push({
      id: 'root',
      data: { 
        label: repoName, 
        type: 'root',
        selected: false
      },
      position: { x: 250, y: 0 },
      style: { 
        background: isDarkMode 
          ? 'linear-gradient(to right, rgba(139, 92, 246, 0.3), rgba(20, 184, 166, 0.3))' 
          : 'linear-gradient(to right, rgba(139, 92, 246, 0.7), rgba(20, 184, 166, 0.7))',
        border: isDarkMode ? '2px solid #8B5CF6' : '2px solid #6D28D9',
        borderRadius: '8px',
        width: rootNodeWidth,
        padding: 12,
        color: isDarkMode ? '#FFFFFF' : '#1F2937',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center' as const,
        textShadow: isDarkMode ? '1px 1px 2px rgba(0,0,0,0.5)' : '1px 1px 2px rgba(255,255,255,0.5)',
        whiteSpace: 'nowrap' as const
      },
    });

    // Function to count the total number of nodes in a structure
    function countTotalNodes(items: any[]): number {
      let count = items.length;
      for (const item of items) {
        if (item.children && item.children.length > 0) {
          count += countTotalNodes(item.children);
        }
      }
      return count;
    }

    const addNodesAndEdges = (items: any[], parentId: string, startY: number = 120, startX: number = 0, level: number = 0) => {
      const nodeSpacing = baseNodeSpacing - (level * 10); // Reduce spacing for deeper levels
      
      const itemsWidth = items.length * nodeSpacing;
      const startingX = startX - itemsWidth / 2 + nodeSpacing / 2;
      
      for (let index = 0; index < items.length; index++) {
        const item = items[index];
        const nodeId = item.path || `${parentId}-${index}`;
        const isSelected = selectedFile === item.path;
        const childWidth = calculateTextWidth(item.name, 12, 16); // fontSize 12, padding 16 (8px each side)
        
        let nodeStyle = {};
        if (item.type === 'directory') {
          nodeStyle = {
            background: isSelected 
              ? (isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.5)') 
              : (isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.2)'),
            borderColor: isSelected ? '#8B5CF6' : (isDarkMode ? '#8B5CF6' : '#6D28D9'),
            borderWidth: isSelected ? 2 : 1,
            borderRadius: '8px',
            width: childWidth,
            padding: 8,
            color: isDarkMode ? '#FFFFFF' : '#1F2937',
            fontWeight: 'bold',
            textShadow: isDarkMode ? '1px 1px 2px rgba(0,0,0,0.5)' : 'none',
            whiteSpace: 'nowrap' as const
          };
        } else {
          let color = isDarkMode ? '#94A3B8' : '#64748B';
          let textColor = isDarkMode ? '#FFFFFF' : '#1F2937';
          if (item.name.endsWith('.js') || item.name.endsWith('.jsx')) {
            color = isDarkMode ? '#F59E0B' : '#D97706';
            textColor = isDarkMode ? '#FFFFFF' : '#1F2937';
          } else if (item.name.endsWith('.ts') || item.name.endsWith('.tsx')) {
            color = isDarkMode ? '#3B82F6' : '#2563EB';
          } else if (item.name.endsWith('.css') || item.name.endsWith('.scss')) {
            color = isDarkMode ? '#EC4899' : '#DB2777';
          } else if (item.name.endsWith('.json')) {
            color = isDarkMode ? '#10B981' : '#059669';
          } else if (item.name.endsWith('.md')) {
            color = isDarkMode ? '#6366F1' : '#4F46E5';
          } else if (item.name.endsWith('.py')) {
            color = isDarkMode ? '#3B82F6' : '#2563EB';
          } else if (item.name.endsWith('.rb')) {
            color = isDarkMode ? '#EF4444' : '#DC2626';
          } else if (item.name.endsWith('.sol')) {
            color = isDarkMode ? '#6D28D9' : '#4C1D95';
          }
          
          nodeStyle = {
            borderColor: color,
            borderWidth: isSelected ? 3 : 1,
            backgroundColor: isSelected ? `${color}15` : (isDarkMode ? 'transparent' : `${color}05`),
            boxShadow: isSelected ? `0 0 0 2px ${color}40` : 'none',
            borderRadius: '4px',
            width: childWidth,
            padding: 8,
            color: textColor,
            fontWeight: 'bold',
            textShadow: isDarkMode ? '1px 1px 2px rgba(0,0,0,0.3)' : 'none',
            whiteSpace: 'nowrap' as const
          };
        }
        
        // Calculate position with fan-out layout
        const itemsAtThisLevel = items.length;
        const horizontalMultiplier = itemsAtThisLevel > 1 ? index - (itemsAtThisLevel - 1) / 2 : 0;
        const xPos = startX + horizontalMultiplier * nodeSpacing;
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
            stroke: isSelected 
              ? '#8B5CF6' 
              : (isDarkMode ? '#CBD5E1' : '#94A3B8'),
            strokeWidth: isSelected ? 2 : 1,
          },
        });
        
        if (item.children && item.children.length > 0) {
          // With this recursive approach each parent's children are centered under it
          addNodesAndEdges(item.children, nodeId, startY + levelSpacing, xPos, level + 1);
        }
      }
    };
    
    if (structure && structure.length > 0) {
      addNodesAndEdges(structure, 'root');
    }
    
    setNodes(newNodes);
    setEdges(newEdges);
  };

  const generateDependencyVisualization = (repoData: RepositoryData) => {
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    
    const repoName = `${repoData.owner}/${repoData.repo}`;
    const rootNodeWidth = calculateTextWidth(repoName, 16, 24);

    newNodes.push({
      id: 'main',
      data: { label: repoName, type: 'main', selected: false },
      position: { x: 175, y: 100 },
      style: { 
        background: isDarkMode 
          ? 'linear-gradient(to right, rgba(139, 92, 246, 0.3), rgba(20, 184, 166, 0.3))' 
          : 'linear-gradient(to right, rgba(139, 92, 246, 0.7), rgba(20, 184, 166, 0.7))',
        border: isDarkMode ? '2px solid #8B5CF6' : '2px solid #6D28D9',
        borderRadius: '50%',
        width: rootNodeWidth,
        height: rootNodeWidth,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center' as const,
        padding: 12,
        color: isDarkMode ? '#FFFFFF' : '#1F2937',
        fontWeight: 'bold',
        textShadow: isDarkMode ? '1px 1px 2px rgba(0,0,0,0.5)' : 'none',
        whiteSpace: 'nowrap' as const
      },
    });
    
    const fileTypes = repoData.fileTypes;
    const totalFileTypes = fileTypes.length || 8;
    
    // Spread the file types in a larger circle to avoid overlaps
    const radius = Math.max(250, 100 + totalFileTypes * 10);
    
    fileTypes.forEach((ext, index) => {
      const angle = (index * 360 / totalFileTypes) * Math.PI / 180;
      const x = 250 + radius * Math.cos(angle);
      const y = 250 + radius * Math.sin(angle);
      const extWidth = calculateTextWidth(`.${ext}`, 12, 16);
      
      let color = isDarkMode ? '#94A3B8' : '#64748B';
      let textColor = isDarkMode ? '#FFFFFF' : '#1F2937';
      let bgColor = 'rgba(20, 184, 166, 0.1)';
      
      if (['js', 'jsx'].includes(ext)) {
        color = isDarkMode ? '#F59E0B' : '#D97706';
        bgColor = isDarkMode ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.2)';
        textColor = isDarkMode ? '#FFFFFF' : '#1F2937';
      } else if (['ts', 'tsx'].includes(ext)) {
        color = isDarkMode ? '#3B82F6' : '#2563EB';
        bgColor = isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.2)';
      } else if (['css', 'scss', 'less'].includes(ext)) {
        color = isDarkMode ? '#EC4899' : '#DB2777';
        bgColor = isDarkMode ? 'rgba(236, 72, 153, 0.1)' : 'rgba(236, 72, 153, 0.2)';
      } else if (ext === 'json') {
        color = isDarkMode ? '#10B981' : '#059669';
        bgColor = isDarkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.2)';
      } else if (ext === 'md') {
        color = isDarkMode ? '#6366F1' : '#4F46E5';
        bgColor = isDarkMode ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.2)';
      } else if (ext === 'py') {
        color = isDarkMode ? '#3B82F6' : '#2563EB';
        bgColor = isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.2)';
      } else if (ext === 'rb') {
        color = isDarkMode ? '#EF4444' : '#DC2626';
        bgColor = isDarkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.2)';
      } else if (ext === 'sol') {
        color = isDarkMode ? '#6D28D9' : '#4C1D95';
        bgColor = isDarkMode ? 'rgba(109, 40, 217, 0.1)' : 'rgba(109, 40, 217, 0.2)';
      }
      
      const isSelected = selectedFile && selectedFile.endsWith(`.${ext}`);
      
      newNodes.push({
        id: ext,
        data: { label: `.${ext}`, type: 'dependency', selected: isSelected },
        position: { x, y },
        style: {
          background: isSelected ? `${color}20` : bgColor,
          borderColor: color,
          borderWidth: isSelected ? 3 : 1,
          boxShadow: isSelected ? `0 0 0 2px ${color}40` : 'none',
          borderRadius: '8px',
          width: extWidth,
          padding: 8,
          color: textColor,
          fontWeight: 'bold',
          textShadow: isDarkMode ? '1px 1px 2px rgba(0,0,0,0.3)' : 'none',
          whiteSpace: 'nowrap' as const
        }
      });
      
      newEdges.push({
        id: `e-main-${ext}`,
        source: 'main',
        target: ext,
        animated: true,
        style: { 
          stroke: isSelected ? color : (isDarkMode ? '#8B5CF6' : '#6D28D9'),
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
    <div className="w-full h-full react-flow-graph-visualization">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        fitView
        attributionPosition="bottom-right"
        className="react-flow-export-target"
      >
        <Controls />
        <MiniMap 
          style={{
            backgroundColor: isDarkMode ? 'rgba(35, 42, 65, 0.8)' : 'rgba(241, 245, 249, 0.8)',
            borderRadius: '8px',
            border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)'
          }}
          nodeColor={(n) => {
            if (n.id === 'root' || n.id === 'main') return isDarkMode ? '#8b5cf6' : '#6D28D9';
            if (n.data?.type === 'directory') return isDarkMode ? '#7c3aed' : '#6D28D9';
            return isDarkMode ? '#3b82f6' : '#2563EB';
          }}
        />
        <Background 
          color={isDarkMode ? "#f8f8f8" : "#64748B"} 
          gap={16} 
          variant={BackgroundVariant.Dots} 
        />
      </ReactFlow>
    </div>
  );
};

export default RepoGraphVisualization;