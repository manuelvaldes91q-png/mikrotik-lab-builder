import { useCallback, useRef, useState, useMemo } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  type Node,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import MikroTikNode from "./nodes/MikroTikNode";
import ClientNode from "./nodes/ClientNode";
import WanNode from "./nodes/WanNode";

let idCounter = 0;
const getId = (type: string) => `${type}_${++idCounter}`;

const initialNodes: Node[] = [
  {
    id: "wan_0",
    type: "wan",
    position: { x: 400, y: 50 },
    data: { label: "WAN Gateway" },
  },
];

interface TopologyCanvasProps {
  onTopologyChange?: (nodes: Node[], edges: Edge[]) => void;
}

const TopologyCanvasInner = ({ onTopologyChange }: TopologyCanvasProps) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const nodeTypes = useMemo(
    () => ({
      mikrotik: MikroTikNode,
      client: ClientNode,
      wan: WanNode,
    }),
    []
  );

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdges = addEdge(
        {
          ...params,
          style: { stroke: "hsl(270 60% 60%)", strokeWidth: 2 },
          animated: true,
        },
        edges
      );
      setEdges(newEdges);
      onTopologyChange?.(nodes, newEdges);
    },
    [edges, nodes, setEdges, onTopologyChange]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
      if (!type || !reactFlowInstance) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const portBase = type === "mikrotik" ? 18291 + idCounter : undefined;
      const labels: Record<string, string> = {
        mikrotik: `MikroTik-${idCounter + 1}`,
        client: `PC-${idCounter + 1}`,
        wan: "WAN Gateway",
      };

      const newNode: Node = {
        id: getId(type),
        type,
        position,
        data: {
          label: labels[type] || type,
          ...(portBase ? { port: portBase } : {}),
        },
      };

      const newNodes = [...nodes, newNode];
      setNodes(newNodes);
      onTopologyChange?.(newNodes, edges);
    },
    [reactFlowInstance, nodes, edges, setNodes, onTopologyChange]
  );

  return (
    <div ref={reactFlowWrapper} className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        className="bg-canvas"
        defaultEdgeOptions={{
          style: { stroke: "hsl(270 60% 60%)", strokeWidth: 2 },
          animated: true,
        }}
      >
        <Controls className="!bg-card !border-border !rounded-lg [&>button]:!bg-card [&>button]:!border-border [&>button]:!text-foreground [&>button:hover]:!bg-secondary" />
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="hsl(220 15% 12%)" />
      </ReactFlow>
    </div>
  );
};

const TopologyCanvas = (props: TopologyCanvasProps) => (
  <ReactFlowProvider>
    <TopologyCanvasInner {...props} />
  </ReactFlowProvider>
);

export default TopologyCanvas;
