
import React from "react";
import { RepositoryData } from "@/services/githubService";
import ReactFlow, { Background, MiniMap, useNodesState, useEdgesState, Edge, MarkerType } from "reactflow";
import "reactflow/dist/style.css";

interface RepoPreviewVisualizationProps {
  repoData: RepositoryData;
}

// Define a custom node data type to match what we're using
type NodeData = {
  label: string;
};

const RepoPreviewVisualization: React.FC<RepoPreviewVisualizationProps> = ({ repoData }) => {
  // We'll do very basic tree root display: root node + direct children only
  const [nodes] = useNodesState([
    {
      id: "root",
      data: { label: `${repoData.owner}/${repoData.repo}` } as NodeData,
      position: { x: 250, y: 0 },
      style: {
        background: "linear-gradient(to right, rgba(139,92,246,0.3), rgba(20,184,166,0.3))",
        borderColor: "#8B5CF6",
        borderWidth: 2,
        borderRadius: "8px",
        width: 170,
        padding: "8px",
        color: "#fff",
        fontWeight: "bold",
        fontSize: 18,
        textShadow: "1px 1px 2px #000a"
      }
    },
    ...(repoData.structure.slice(0, 6).map((item, idx) => ({
      id: `item-${idx}`,
      data: { label: item.name } as NodeData,
      position: { x: 80 + idx * 75, y: 110 },
      style: {
        borderColor: "#CBD5E1",
        borderWidth: 1,
        background: "rgba(139,92,246,0.15)",
        borderRadius: "6px",
        width: 95,
        padding: "7px",
        color: "#fff",
        fontWeight: "bold",
        textShadow: "1px 1px 2px #0008",
        fontSize: 14,
        overflow: "hidden"
      }
    })))
  ]);

  const [edges] = useEdgesState(
    repoData.structure.slice(0, 6).map((item, idx) => ({
      id: `e-root-item-${idx}`,
      source: "root",
      target: `item-${idx}`,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: {
        stroke: "#8B5CF6",
        strokeWidth: 1.5
      }
    }))
  );

  return (
    <div className="w-full h-64">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        zoomOnScroll={false}
        panOnScroll={false}
        panOnDrag={false}
        attributionPosition="bottom-right"
      >
        <MiniMap />
        <Background color="#232a41" gap={16} />
      </ReactFlow>
    </div>
  );
};

export default RepoPreviewVisualization;