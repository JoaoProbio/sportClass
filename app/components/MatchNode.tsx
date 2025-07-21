import { memo } from "react";
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { cn } from "@/lib/utils";
import { Shield } from "lucide-react";

// Estrutura de dados para um time dentro do nó
interface TeamData {
  name: string;
  score?: number;
  isWinner?: boolean;
}

// Estrutura de dados esperada pelo nosso nó de partida
interface MatchNodeData extends Record<string, unknown> {
  teams: [TeamData, TeamData];
  round: string;
}

type MatchNodeType = Node<MatchNodeData, "matchNode">;

function MatchNode({ data }: NodeProps<MatchNodeType>) {
  // O nó terá duas entradas (target) e uma saída (source)
  return (
    <div
      className={cn(
        "rounded-xl bg-card shadow-lg w-60 font-sans border border-border-default",
      )}
    >
      {/* Handles de entrada para os dois times */}
      <Handle
        type="target"
        position={Position.Left}
        id="team-0"
        className="!left-[-6px] !top-[35%] !w-3 !h-3"
      />
       <Handle
        type="target"
        position={Position.Left}
        id="team-1"
        className="!left-[-6px] !top-[65%] !w-3 !h-3"
      />

      <div className="text-xs p-3">
        {data.teams.map((team: TeamData, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center justify-between gap-2 py-2 group-not-last:border-b border-dashed",
              team.isWinner === false ? "opacity-50" : ""
            )}
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent-primary" aria-label="Equipe" />
              <span className="truncate font-medium">{team.name || 'A definir'}</span>
            </div>
            <span className="text-muted-foreground/80 font-bold text-sm">{team.score ?? ''}</span>
          </div>
        ))}
      </div>
      
      {/* Handle de saída para o vencedor */}
      <Handle
        type="source"
        position={Position.Right}
        id="winner"
        className="!right-[-6px] !top-1/2 !w-3 !h-3"
      />
    </div>
  );
}

export default memo(MatchNode); 