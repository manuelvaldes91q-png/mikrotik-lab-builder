import { Router, Monitor, Globe, Cable } from "lucide-react";

const nodeTypes = [
  {
    type: "mikrotik",
    label: "MikroTik CHR",
    description: "RouterOS virtual",
    icon: Router,
    colorClass: "text-mikrotik border-mikrotik/30 bg-mikrotik/5 hover:bg-mikrotik/10 hover:border-mikrotik/50",
  },
  {
    type: "client",
    label: "PC Cliente",
    description: "Alpine Linux",
    icon: Monitor,
    colorClass: "text-client border-client/30 bg-client/5 hover:bg-client/10 hover:border-client/50",
  },
  {
    type: "wan",
    label: "Router WAN",
    description: "NAT Gateway",
    icon: Globe,
    colorClass: "text-warning border-warning/30 bg-warning/5 hover:bg-warning/10 hover:border-warning/50",
  },
];

const Sidebar = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="flex w-64 flex-col border-r border-border bg-card">
      <div className="border-b border-border p-4">
        <div className="flex items-center gap-2">
          <Cable className="h-5 w-5 text-mikrotik" />
          <h1 className="font-display text-base font-bold text-foreground">
            MikroTik <span className="text-mikrotik">Lab</span>
          </h1>
        </div>
        <p className="mt-1 font-mono text-[10px] text-muted-foreground">Cloud Orchestrator v1.0</p>
      </div>

      <div className="flex-1 p-4">
        <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Componentes
        </p>
        <div className="flex flex-col gap-2">
          {nodeTypes.map((node) => (
            <div
              key={node.type}
              className={`flex cursor-grab items-center gap-3 rounded-lg border p-3 transition-all ${node.colorClass}`}
              draggable
              onDragStart={(e) => onDragStart(e, node.type)}
            >
              <node.icon className="h-5 w-5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold">{node.label}</p>
                <p className="text-[10px] opacity-60">{node.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-lg border border-border bg-secondary/50 p-3">
          <p className="font-mono text-[10px] font-semibold text-muted-foreground">💡 Tip</p>
          <p className="mt-1 font-mono text-[10px] text-muted-foreground">
            Arrastra componentes al lienzo. Conecta los nodos arrastrando entre los puntos de conexión.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
