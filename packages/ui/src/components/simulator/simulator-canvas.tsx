"use client";

import {
  Background,
  type Edge,
  MiniMap,
  type Node,
  Panel,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useFileSystem } from "../../hooks/use-file-system";
import { useHasMounted } from "../../hooks/use-has-mounted";
import { useSettingsStore } from "../../hooks/use-settings-store";
import { useSimulatorLogic } from "../../hooks/use-simulator-logic";
import type { GateNodeProps } from "@gately/core/types";
import { nodeTypes } from "../../node-types";
import { Toolbar } from "./toolbar";
import { PropertiesPanel } from "./properties-panel";

export function SimulatorCanvas() {
  const hasMounted = useHasMounted();
  const { settings } = useSettingsStore();
  const { currentFileId, updateFileContent, ready, getCurrentFile } = useFileSystem();

  const [nodes, setNodes, onNodesChange] = useNodesState<Node<GateNodeProps>>([]);
  const [edges, setEdges, _onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedNode, setSelectedNode] = useState<Node<GateNodeProps> | null>(null);
  
  const { onConnectEdge, onNodeClick, onEdgesChangeWithSimulation, onDrop, onDragOver } = useSimulatorLogic(
    setNodes,
    setEdges,
  );

  // Handler to update node properties
  const handleUpdateNode = useCallback((nodeId: string, data: Partial<GateNodeProps['data']>) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                ...data,
              },
            }
          : node
      )
    );
  }, [setNodes]);

  // Wrapper for onNodeClick to also set the selected node state
  const handleNodeClick = useCallback((_: React.MouseEvent, node: Node<GateNodeProps>) => {
    setSelectedNode(node);
    onNodeClick(node);
  }, [onNodeClick]);

  // Save the current nodes and edges to the file system whenever they change
  useEffect(() => {
    if (currentFileId && (nodes.length > 0 || edges.length > 0)) {
      const saveTimeout = setTimeout(() => {
        console.debug("Saving file", currentFileId);
        updateFileContent(currentFileId, { nodes, edges });
      }, 1000);

      return () => clearTimeout(saveTimeout);
    }
  }, [nodes, edges, currentFileId, updateFileContent]);

  useEffect(() => {
    if (!ready) return;
    const currentFile = getCurrentFile();
    console.debug("Loading file", currentFileId);

    if (currentFile?.data) {
      setNodes(currentFile.data.nodes);
      setEdges(currentFile.data.edges);
    } else {
      setNodes([]);
      setEdges([]);
    }
  }, [currentFileId, ready, getCurrentFile, setEdges, setNodes]);

  // Cleanup selection when clicking on the background
  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  if (!hasMounted) {
    return (
      <div className="flex items-center justify-center w-full h-full text-xl text-muted-foreground">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 h-full flex">
      <div className="flex-1">
        <ReactFlow<Node<GateNodeProps>, Edge>
          className="bg-background"
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChangeWithSimulation}
          onConnect={onConnectEdge}
          onDrop={onDrop}
          onDragOver={onDragOver}
          snapToGrid={settings.snapToGrid}
          snapGrid={[20, 20]}
          nodeTypes={nodeTypes}
          onNodeClick={handleNodeClick}
          onPaneClick={handlePaneClick}
          fitView
        >
          <Panel position="top-left">
            <Toolbar />
          </Panel>
          {settings.showMinimap && <MiniMap className="bg-card" />}
          {settings.showGrid && <Background gap={12} size={1} />}
        </ReactFlow>
      </div>
      
      <PropertiesPanel
        selectedNode={selectedNode}
        onUpdateNode={handleUpdateNode}
      />
    </div>
  );
}