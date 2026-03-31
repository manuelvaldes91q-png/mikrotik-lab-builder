import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Globe } from "lucide-react";

const WanNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div
      className={`relative flex flex-col items-center gap-2 rounded-lg border bg-card p-4 transition-all ${
        selected ? "border-warning glow-wan" : "border-border hover:border-warning/50"
      }`}
      style={{ minWidth: 140 }}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/10">
        <Globe className="h-6 w-6 text-warning animate-pulse-glow" />
      </div>
      <div className="text-center">
        <p className="font-mono text-xs font-bold text-warning">{(data as any).label}</p>
        <p className="font-mono text-[10px] text-muted-foreground">NAT Gateway</p>
      </div>

      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-warning !border-card" />
      <Handle type="source" position={Position.Right} id="right" className="!w-3 !h-3 !bg-warning !border-card" />
      <Handle type="source" position={Position.Left} id="left" className="!w-3 !h-3 !bg-warning !border-card" />
    </div>
  );
});

WanNode.displayName = "WanNode";
export default WanNode;
