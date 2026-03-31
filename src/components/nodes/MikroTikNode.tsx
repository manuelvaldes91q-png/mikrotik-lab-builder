import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Router } from "lucide-react";

const MikroTikNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div
      className={`relative flex flex-col items-center gap-2 rounded-lg border bg-card p-4 transition-all ${
        selected ? "border-mikrotik glow-mikrotik" : "border-border hover:border-mikrotik/50"
      }`}
      style={{ minWidth: 140 }}
    >
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-mikrotik !border-card" />
      <Handle type="target" position={Position.Left} id="left" className="!w-3 !h-3 !bg-mikrotik !border-card" />

      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-mikrotik/10">
        <Router className="h-6 w-6 text-mikrotik" />
      </div>
      <div className="text-center">
        <p className="font-mono text-xs font-semibold text-mikrotik">{(data as any).label}</p>
        <p className="font-mono text-[10px] text-muted-foreground">CHR RouterOS</p>
      </div>
      {(data as any).port && (
        <div className="rounded bg-secondary px-2 py-0.5">
          <p className="font-mono text-[10px] text-muted-foreground">
            Winbox: <span className="text-warning">{(data as any).port}</span>
          </p>
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-mikrotik !border-card" />
      <Handle type="source" position={Position.Right} id="right" className="!w-3 !h-3 !bg-mikrotik !border-card" />
    </div>
  );
});

MikroTikNode.displayName = "MikroTikNode";
export default MikroTikNode;
