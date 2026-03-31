import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Monitor } from "lucide-react";

const ClientNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div
      className={`relative flex flex-col items-center gap-2 rounded-lg border bg-card p-3 transition-all ${
        selected ? "border-client glow-client" : "border-border hover:border-client/50"
      }`}
      style={{ minWidth: 120 }}
    >
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-client !border-card" />

      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-client/10">
        <Monitor className="h-5 w-5 text-client" />
      </div>
      <div className="text-center">
        <p className="font-mono text-xs font-semibold text-client">{(data as any).label}</p>
        <p className="font-mono text-[10px] text-muted-foreground">Alpine Linux</p>
      </div>

      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-client !border-card" />
    </div>
  );
});

ClientNode.displayName = "ClientNode";
export default ClientNode;
