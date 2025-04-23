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

type RepositoryData = {
  owner: string;
  repo: string;
  structure: any[];
  fileTypes: string[];
  fileCount?: number;
  dirCount?: number;
  dependencies?: Array<{ name: string; version?: string }>;
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
  }, [repoData, visualizationType, selectedFile]);

  const generateStructureVisualization = (structure: any[]) => {
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    
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
        background: 'linear-gradient(to right, rgba(139, 92, 246, 0.3), rgba(20, 184, 166, 0.3))',
        border: '2px solid #8B5CF6',
        borderRadius: '8px',
        width: rootNodeWidth,
        padding: 12,
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center' as const,
        textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
        whiteSpace: 'nowrap' as const
      },
    });

    const addNodesAndEdges = (items: any[], parentId: string, startY: number = 120, startX: number = 0, level: number = 0) => {
      const nodeSpacing = 330;
      const levelSpacing = 150;
      
      const levelWidth = items.length * nodeSpacing;
      const startingX = startX - levelWidth / 2 + nodeSpacing / 2;
      
      items.forEach((item, index) => {
        const nodeId = item.path || `${parentId}-${index}`;
        const isSelected = selectedFile === item.path;
        const childWidth = calculateTextWidth(item.name, 12, 16); // fontSize 12, padding 16 (8px each side)
        
        let nodeStyle = {};
        if (item.type === 'directory') {
          nodeStyle = {
            background: isSelected ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.1)',
            borderColor: isSelected ? '#8B5CF6' : '#8B5CF6',
            borderWidth: isSelected ? 2 : 1,
            borderRadius: '8px',
            width: childWidth,
            padding: 8,
            color: '#FFFFFF',
            fontWeight: 'bold',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
            whiteSpace: 'nowrap' as const
          };
        } else {
          let color = '#94A3B8';
          let textColor = '#FFFFFF';
          if (item.name.endsWith('.js') || item.name.endsWith('.jsx')) {
            color = '#F59E0B';
            textColor = '#FFFFFF';
          } else if (item.name.endsWith('.ts') || item.name.endsWith('.tsx')) {
            color = '#3B82F6';
          } else if (item.name.endsWith('.css') || item.name.endsWith('.scss')) {
            color = '#EC4899';
          } else if (item.name.endsWith('.json')) {
            color = '#10B981';
          } else if (item.name.endsWith('.md')) {
            color = '#6366F1';
          } else if (item.name.endsWith('.py')) {
            color = '#3B82F6';
          } else if (item.name.endsWith('.rb')) {
            color = '#EF4444';
          }
          
          nodeStyle = {
            borderColor: color,
            borderWidth: isSelected ? 3 : 1,
            backgroundColor: isSelected ? `${color}15` : 'transparent',
            boxShadow: isSelected ? `0 0 0 2px ${color}40` : 'none',
            borderRadius: '4px',
            width: childWidth,
            padding: 8,
            color: textColor,
            fontWeight: 'bold',
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
            whiteSpace: 'nowrap' as const
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
        background: 'linear-gradient(to right, rgba(139, 92, 246, 0.3), rgba(20, 184, 166, 0.3))',
        border: '2px solid #8B5CF6',
        borderRadius: '50%',
        width: rootNodeWidth,
        height: rootNodeWidth,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center' as const,
        padding: 12,
        color: '#FFFFFF',
        fontWeight: 'bold',
        textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
        whiteSpace: 'nowrap' as const
      },
    });
    
    const fileTypes = repoData.fileTypes;
    const totalFileTypes = fileTypes.length || 8;
    
    fileTypes.forEach((ext, index) => {
      const angle = (index * 360 / totalFileTypes) * Math.PI / 180;
      const radius = 250;
      const x = 250 + radius * Math.cos(angle);
      const y = 250 + radius * Math.sin(angle);
      const extWidth = calculateTextWidth(`.${ext}`, 12, 16);
      
      let color = '#94A3B8';
      let textColor = '#FFFFFF';
      if (['js', 'jsx'].includes(ext)) {
        color = '#F59E0B';
        textColor = '#000000';
      } else if (['ts', 'tsx'].includes(ext)) {
        color = '#3B82F6';
      } else if (['css', 'scss', 'less'].includes(ext)) {
        color = '#EC4899';
      } else if (ext === 'json') {
        color = '#10B981';
      } else if (ext === 'md') {
        color = '#6366F1';
      } else if (ext === 'py') {
        color = '#3B82F6';
      } else if (ext === 'rb') {
        color = '#EF4444';
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
          width: extWidth,
          padding: 8,
          color: textColor,
          fontWeight: 'bold',
          textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
          whiteSpace: 'nowrap' as const
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
        <MiniMap 
          style={{
            backgroundColor: 'rgba(35, 42, 65, 0.8)',
            borderRadius: '8px'
          }}
          nodeColor={(n) => {
            if (n.id === 'root') return '#8b5cf6';
            if (n.data?.type === 'directory') return '#7c3aed';
            return '#3b82f6';
          }}
        />
        <Background color="#f8f8f8" gap={16} variant={BackgroundVariant.Dots} />
      </ReactFlow>
    </div>
  );
};

export default RepoGraphVisualization;