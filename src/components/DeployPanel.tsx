import { useState } from "react";
import { Rocket, Terminal, Copy, Check, Server, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Node, Edge } from "@xyflow/react";

interface DeployPanelProps {
  nodes: Node[];
  edges: Edge[];
}

const DeployPanel = ({ nodes, edges }: DeployPanelProps) => {
  const [deployed, setDeployed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showJson, setShowJson] = useState(false);

  const mikrotikNodes = nodes.filter((n) => n.type === "mikrotik");
  const clientNodes = nodes.filter((n) => n.type === "client");

  const topology = {
    nodes: nodes.map((n) => ({
      id: n.id,
      type: n.type,
      label: (n.data as any).label,
      position: n.position,
      ...(n.type === "mikrotik" ? { winbox_port: (n.data as any).port } : {}),
    })),
    edges: edges.map((e) => ({
      source: e.source,
      target: e.target,
      vlan_ready: true,
    })),
    vpn: { protocol: "L2TP", auto_setup: true },
  };

  const API_URL = "http://77.110.123.57:8000";

  const handleDeploy = async () => {
    if (mikrotikNodes.length === 0) {
      toast.error("Agrega al menos un MikroTik al lienzo");
      return;
    }
    try {
      toast.loading("Desplegando laboratorio...", { id: "deploy" });
      const res = await fetch(`${API_URL}/api/deploy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(topology),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Error en el despliegue");
      }
      const data = await res.json();
      setDeployed(true);
      toast.success("¡Laboratorio desplegado!", {
        id: "deploy",
        description: `${data.containers?.length} contenedores creados`,
      });
    } catch (e: any) {
      toast.error(e.message || "Error al conectar con el backend", { id: "deploy" });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(topology, null, 2));
    setCopied(true);
    toast.success("JSON copiado al portapapeles");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex w-80 flex-col border-l border-border bg-card">
      <div className="border-b border-border p-4">
        <h2 className="font-display text-sm font-bold text-foreground">Panel de Despliegue</h2>
        <p className="font-mono text-[10px] text-muted-foreground">Configurar y lanzar laboratorio</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 border-b border-border p-4">
        <div className="rounded-lg border border-mikrotik/20 bg-mikrotik/5 p-3 text-center">
          <Server className="mx-auto mb-1 h-4 w-4 text-mikrotik" />
          <p className="font-mono text-lg font-bold text-mikrotik">{mikrotikNodes.length}</p>
          <p className="font-mono text-[10px] text-muted-foreground">Routers</p>
        </div>
        <div className="rounded-lg border border-client/20 bg-client/5 p-3 text-center">
          <Wifi className="mx-auto mb-1 h-4 w-4 text-client" />
          <p className="font-mono text-lg font-bold text-client">{clientNodes.length}</p>
          <p className="font-mono text-[10px] text-muted-foreground">Clientes</p>
        </div>
      </div>

      {/* Winbox Ports */}
      {mikrotikNodes.length > 0 && (
        <div className="border-b border-border p-4">
          <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Puertos Winbox
          </p>
          <div className="flex flex-col gap-1.5">
            {mikrotikNodes.map((n) => (
              <div key={n.id} className="flex items-center justify-between rounded bg-secondary px-3 py-1.5">
                <span className="font-mono text-[11px] text-mikrotik">{(n.data as any).label}</span>
                <span className="font-mono text-[11px] text-warning">{(n.data as any).port}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VPN Info */}
      <div className="border-b border-border p-4">
        <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Acceso VPN (WinXP)
        </p>
        <div className="rounded-lg border border-warning/20 bg-warning/5 p-3">
          <p className="font-mono text-[10px] text-warning">Protocolo: L2TP/PPTP</p>
          <p className="font-mono text-[10px] text-muted-foreground mt-1">
            Túnel auto-configurado al desplegar. Conecta Winbox vía IP del VPS.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 p-4">
        <Button
          onClick={handleDeploy}
          className="w-full gap-2 bg-mikrotik font-mono text-xs font-bold text-primary-foreground hover:bg-mikrotik/90"
        >
          <Rocket className="h-4 w-4" />
          {deployed ? "Re-Deploy" : "Deploy Lab"}
        </Button>

        <Button
          variant="outline"
          onClick={() => setShowJson(!showJson)}
          className="w-full gap-2 border-border font-mono text-xs"
        >
          <Terminal className="h-4 w-4" />
          {showJson ? "Ocultar JSON" : "Ver JSON"}
        </Button>
      </div>

      {/* JSON Output */}
      {showJson && (
        <div className="relative mx-4 mb-4 max-h-60 overflow-auto rounded-lg border border-border bg-background p-3">
          <button
            onClick={handleCopy}
            className="absolute right-2 top-2 rounded p-1 text-muted-foreground hover:text-foreground"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-mikrotik" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
          <pre className="font-mono text-[10px] text-muted-foreground">{JSON.stringify(topology, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default DeployPanel;
