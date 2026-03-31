import { useState, useCallback } from "react";
import type { Node, Edge } from "@xyflow/react";
import Sidebar from "@/components/Sidebar";
import TopologyCanvas from "@/components/TopologyCanvas";
import DeployPanel from "@/components/DeployPanel";

const Index = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const handleTopologyChange = useCallback((newNodes: Node[], newEdges: Edge[]) => {
    setNodes(newNodes);
    setEdges(newEdges);
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1">
        <TopologyCanvas onTopologyChange={handleTopologyChange} />
      </main>
      <DeployPanel nodes={nodes} edges={edges} />
    </div>
  );
};

export default Index;
