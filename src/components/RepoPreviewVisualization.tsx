import React from "react";
import { RepositoryData } from "@/services/githubService";
import ReactFlow, { 
  Background, 
  MiniMap, 
  useNodesState, 
  useEdgesState, 
  Edge, 
  MarkerType,
  BackgroundVariant,
  Node
} from "reactflow";
import "reactflow/dist/style.css";

interface RepoPreviewVisualizationProps {
  repoData: RepositoryData;
}

type NodeData = {
  label: string;
  type?: string;
};

const RepoPreviewVisualization: React.FC<RepoPreviewVisualizationProps> = ({ repoData }) => {
  const fileExtensions = {
    js: { color: '#facc15', bg: 'rgba(250, 204, 21, 0.1)' },
    ts: { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
    jsx: { color: '#facc15', bg: 'rgba(250, 204, 21, 0.1)' },
    tsx: { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
    css: { color: '#ec4899', bg: 'rgba(236, 72, 153, 0.1)' },
    scss: { color: '#ec4899', bg: 'rgba(236, 72, 153, 0.1)' },
    json: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
    md: { color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
    default: { color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)' }
  };

  const getFileStyle = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const fileType = extension && fileExtensions[extension as keyof typeof fileExtensions] 
      ? extension 
      : 'default';
    return fileExtensions[fileType as keyof typeof fileExtensions] || fileExtensions.default;
  };

  // Calculate exact width needed for the text
  const calculateTextWidth = (text: string, fontSize: number, padding: number) => {
    // Approximate width calculation based on character count and font size
    const avgCharWidth = fontSize * 0.6; // Rough approximation
    return Math.ceil(text.length * avgCharWidth + padding * 2);
  };

  const repoName = `${repoData.owner}/${repoData.repo}`;
  const rootNodeWidth = calculateTextWidth(repoName, 16, 24); // fontSize 16, padding 24 (12px each side)

  const initialNodes: Node<NodeData>[] = [
    {
      id: "root",
      data: { 
        label: repoName,
        type: 'root'
      },
      position: { x: 250, y: 0 },
      style: {
        background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(20,184,166,0.3))',
        border: '2px solid #8b5cf6',
        borderRadius: "12px",
        width: rootNodeWidth,
        padding: 12,
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: 16,
        textAlign: 'center' as const,
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        whiteSpace: 'nowrap' as const
      }
    },
    ...repoData.structure.slice(0, 6).map((item, idx) => {
      const isDir = item.type === 'directory';
      const fileStyle = isDir ? { color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' } : getFileStyle(item.name);
      const label = item.name.length > 12 ? `${item.name.substring(0, 9)}...` : item.name;
      const childWidth = calculateTextWidth(label, 12, 16); // fontSize 12, padding 16 (8px each side)
      
      return {
        id: `item-${idx}`,
        data: { 
          label: label,
          type: isDir ? 'directory' : 'file'
        },
        position: { x: 50 + idx * 100, y: 120 },
        style: {
          border: `2px solid ${fileStyle.color}`,
          background: fileStyle.bg,
          borderRadius: "8px",
          width: childWidth,
          padding: 8,
          color: fileStyle.color,
          fontWeight: "500",
          fontSize: 12,
          textAlign: 'center' as const,
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap" as const
        }
      };
    })
  ];

  const initialEdges: Edge[] = repoData.structure.slice(0, 6).map((item, idx) => ({
    id: `e-root-item-${idx}`,
    source: "root",
    target: `item-${idx}`,
    markerEnd: { 
      type: MarkerType.ArrowClosed,
      width: 12,
      height: 12,
      color: '#8b5cf6'
    },
    style: {
      stroke: '#8b5cf6',
      strokeWidth: 2,
      strokeDasharray: '4 2'
    }
  }));

  const [nodes] = useNodesState(initialNodes);
  const [edges] = useEdgesState(initialEdges);

  return (
    <div className="w-full h-64 relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        fitViewOptions={{ padding: 0.5 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        zoomOnScroll={false}
        panOnScroll={false}
        panOnDrag={false}
        attributionPosition="bottom-right"
      >
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
        <Background 
          variant={BackgroundVariant.Dots} 
          color="#3b82f6" 
          gap={24} 
          size={1}
        />
      </ReactFlow>
    </div>
  );
};

export default RepoPreviewVisualization;