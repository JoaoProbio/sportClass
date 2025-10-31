// TournamentBracket.tsx
// Componente para exibir o chaveamento (bracket) e tabela de confrontos de um torneio esportivo.
// Usa dados mockados e permite alternar entre visualização de chaveamento e tabela.

"use client";

import { useMemo, useState, useCallback } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  BackgroundVariant,
  ConnectionLineType,
} from "@xyflow/react";
import { cn } from "@/lib/utils";
import { useSport } from "../providers/SportContext";
import {
  Shield,
  Trophy,
  Calendar,
  Clock,
  MapPin,
  Palette,
  Grid,
  Sparkles,
} from "lucide-react";
import {
  generateBracket,
  generateLayout,
  generateHierarchicalData,
  calculateTournamentStats,
  getTournamentWinner,
  type TournamentData,
  type Team,
  type Match,
  type Round,
} from "@/lib/bracket-utils";
import * as d3 from "d3";
import BracketEdge from "./BracketEdge";
// Enhanced view modes with statistics
const viewModes = [
  { key: "bracket", label: "Chaveamento", icon: Shield },
  { key: "hierarchy", label: "Hierarquia", icon: Trophy },
  { key: "stats", label: "Estatísticas", icon: Calendar },
];

// Background options
const backgroundOptions = [
  {
    key: "default",
    label: "Padrão",
    icon: Grid,
    className: "bg-background",
    pattern: "dots",
  },
  {
    key: "gradient",
    label: "Gradiente",
    icon: Palette,
    className:
      "bg-gradient-to-br from-background via-background-elevated to-background-card",
    pattern: "lines",
  },
  {
    key: "sport",
    label: "Esportivo",
    icon: Sparkles,
    className:
      "bg-gradient-to-br from-orange-900/20 via-orange-800/10 to-orange-700/5",
    pattern: "cross",
  },
  {
    key: "dark",
    label: "Escuro",
    icon: Grid,
    className: "bg-gradient-to-br from-gray-900 via-gray-800 to-black",
    pattern: "dots",
  },
  {
    key: "arena",
    label: "Arena",
    icon: Trophy,
    className: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700",
    pattern: "grid",
  },
];

// Enhanced team data with more details
const mockTeams = [
  {
    id: "1a-agro",
    name: "1º Agro A",
    division: "agro",
    year: 1,
    color: "#ff6b35",
  },
  {
    id: "1b-agro",
    name: "1º Agro B",
    division: "agro",
    year: 1,
    color: "#ff8c42",
  },
  {
    id: "1c-agro",
    name: "1º Agro C",
    division: "agro",
    year: 1,
    color: "#ffa726",
  },
  {
    id: "2a-agro",
    name: "2º Agro A",
    division: "agro",
    year: 2,
    color: "#e65100",
  },
  {
    id: "2b-agro",
    name: "2º Agro B",
    division: "agro",
    year: 2,
    color: "#f57c00",
  },
  {
    id: "2c-agro",
    name: "2º Agro C",
    division: "agro",
    year: 2,
    color: "#ff8f00",
  },
  {
    id: "3a-agro",
    name: "3º Agro A",
    division: "agro",
    year: 3,
    color: "#ffab00",
  },
  {
    id: "3b-agro",
    name: "3º Agro B",
    division: "agro",
    year: 3,
    color: "#ffc400",
  },
  {
    id: "1a-meio",
    name: "1º Meio A",
    division: "meio",
    year: 1,
    color: "#ffb74d",
  },
  {
    id: "1b-meio",
    name: "1º Meio B",
    division: "meio",
    year: 1,
    color: "#ffcc02",
  },
  {
    id: "2a-meio",
    name: "2º Meio A",
    division: "meio",
    year: 2,
    color: "#ff6f00",
  },
  {
    id: "2b-meio",
    name: "2º Meio B",
    division: "meio",
    year: 2,
    color: "#ff9100",
  },
  {
    id: "1a-info",
    name: "1º Info A",
    division: "info",
    year: 1,
    color: "#ff5722",
  },
  {
    id: "1b-info",
    name: "1º Info B",
    division: "info",
    year: 1,
    color: "#ff7043",
  },
  {
    id: "2a-info",
    name: "2º Info A",
    division: "info",
    year: 2,
    color: "#ffc107",
  },
  {
    id: "2b-info",
    name: "2º Info B",
    division: "info",
    year: 2,
    color: "#ffca28",
  },
];

interface TournamentBracketProps {
  teams?: any[];
  sportData?: any;
}

// Custom Background Component
function CustomBackground({
  pattern,
  className,
}: {
  pattern: string;
  className: string;
}) {
  const getPatternStyle = () => {
    switch (pattern) {
      case "dots":
        return {
          backgroundImage: `radial-gradient(circle, rgba(255, 107, 53, 0.1) 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        };
      case "lines":
        return {
          backgroundImage: `linear-gradient(45deg, rgba(255, 107, 53, 0.05) 25%, transparent 25%), linear-gradient(-45deg, rgba(255, 107, 53, 0.05) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(255, 107, 53, 0.05) 75%), linear-gradient(-45deg, transparent 75%, rgba(255, 107, 53, 0.05) 75%)`,
          backgroundSize: "40px 40px",
          backgroundPosition: "0 0, 0 20px, 20px -20px, -20px 0px",
        };
      case "cross":
        return {
          backgroundImage: `linear-gradient(rgba(255, 107, 53, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 107, 53, 0.1) 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
        };
      case "grid":
        return {
          backgroundImage: `linear-gradient(rgba(255, 107, 53, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 107, 53, 0.2) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        };
      default:
        return {};
    }
  };

  return (
    <div
      className={cn("absolute inset-0 -z-10", className)}
      style={getPatternStyle()}
    />
  );
}

// Enhanced Match Node Component
function EnhancedMatchNode({ data }: { data: any }) {
  const { teams, round, status, date, time, court } = data;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "text-accent-live bg-accent-live/10 border-accent-live/20";
      case "completed":
        return "text-accent-success bg-accent-success/10 border-accent-success/20";
      case "upcoming":
        return "text-accent-secondary bg-accent-secondary/10 border-accent-secondary/20";
      case "postponed":
        return "text-accent-warning bg-accent-warning/10 border-accent-warning/20";
      default:
        return "text-text-secondary bg-background-card border-border-default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "live":
        return "🔴";
      case "completed":
        return "✅";
      case "upcoming":
        return "⏳";
      case "postponed":
        return "⏸️";
      default:
        return "📋";
    }
  };

  return (
    <div className="bg-background-card/95 backdrop-blur-sm border border-border-default rounded-lg p-4 shadow-lg min-w-[280px] hover:shadow-xl transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-accent-primary" />
          <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
            {round}
          </span>
        </div>
        <div
          className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border",
            getStatusColor(status),
          )}
        >
          <span>{getStatusIcon(status)}</span>
          <span className="capitalize">{status}</span>
        </div>
      </div>

      {/* Teams */}
      <div className="space-y-2">
        {teams.map((team: any, index: number) => (
          <div
            key={team.id || index}
            className={cn(
              "flex items-center justify-between p-2 rounded-md transition-colors",
              team.isWinner
                ? "bg-accent-primary/10 border border-accent-primary/20"
                : "bg-background-elevated/50 border border-border-muted",
            )}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: team.color || "#666" }}
              />
              <span
                className={cn(
                  "text-sm font-medium",
                  team.isWinner ? "text-text-primary" : "text-text-secondary",
                )}
              >
                {team.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {team.score !== undefined && (
                <span
                  className={cn(
                    "text-sm font-bold min-w-[20px] text-center",
                    team.isWinner
                      ? "text-accent-primary"
                      : "text-text-secondary",
                  )}
                >
                  {team.score}
                </span>
              )}
              {team.isWinner && (
                <Trophy className="w-4 h-4 text-accent-primary" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Match Details */}
      {(date || time || court) && (
        <div className="mt-3 pt-3 border-t border-border-muted">
          <div className="flex items-center gap-4 text-xs text-text-muted">
            {date && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{date}</span>
              </div>
            )}
            {time && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{time}</span>
              </div>
            )}
            {court && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{court}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Hierarchy Visualization Component
function HierarchyView({ tournamentData }: { tournamentData: TournamentData }) {
  const width = 800;
  const height = 600;
  const margin = { top: 20, right: 90, bottom: 30, left: 90 };

  // Simplified hierarchy data structure
  const hierarchyData = useMemo(() => {
    const root = {
      name: tournamentData.sport,
      children: tournamentData.rounds.map((round) => ({
        name: round.name,
        children: round.matches.map((match) => ({
          name: match.id,
          children: match.teams.map((team) => ({
            name: team.name,
            value: team.isWinner ? 1 : 0,
          })),
        })),
      })),
    };
    return d3.hierarchy(root);
  }, [tournamentData]);

  const tree = d3
    .tree()
    .size([
      height - margin.top - margin.bottom,
      width - margin.right - margin.left,
    ]);
  const treeData = tree(hierarchyData as any);

  return (
    <div className="w-full overflow-auto relative">
      <CustomBackground
        pattern="dots"
        className="bg-gradient-to-br from-orange-900/10 via-orange-800/5 to-transparent"
      />
      <svg width={width} height={height} className="mx-auto relative z-10">
        <g transform={`translate(${margin.left},${margin.top})`}>
          {/* Links */}
          {treeData.links().map((link, i) => (
            <path
              key={`link-${i}`}
              fill="none"
              stroke="#ff6b35"
              strokeWidth="2"
              opacity="0.6"
              d={
                d3
                  .linkHorizontal()
                  .x((d: any) => d.y)
                  .y((d: any) => d.x)(link as any) as string
              }
            />
          ))}

          {/* Nodes */}
          {treeData.descendants().map((node, i) => (
            <g
              key={`node-${i}-${(node.data as any).name}`}
              transform={`translate(${node.y},${node.x})`}
            >
              <circle
                r={6}
                fill={(node.data as any).value ? "#ff6b35" : "#666"}
                stroke="#fff"
                strokeWidth="2"
              />
              <text
                dy=".31em"
                x={node.children ? -8 : 8}
                textAnchor={node.children ? "end" : "start"}
                className="text-xs fill-current"
                style={{ fontSize: "12px", fill: "#fff" }}
              >
                {(node.data as any).name}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

// Statistics View Component
function StatisticsView({
  tournamentData,
}: {
  tournamentData: TournamentData;
}) {
  const stats = useMemo(
    () => calculateTournamentStats(tournamentData),
    [tournamentData],
  );
  const winner = useMemo(
    () => getTournamentWinner(tournamentData),
    [tournamentData],
  );

  return (
    <div className="space-y-6 relative">
      <CustomBackground
        pattern="lines"
        className="bg-gradient-to-br from-orange-900/5 via-orange-800/3 to-transparent"
      />

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
        <div className="bg-background-card/95 backdrop-blur-sm border border-border-default rounded-lg p-4 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-accent-primary" />
            <span className="text-sm font-medium text-text-secondary">
              Total de Jogos
            </span>
          </div>
          <span className="text-2xl font-bold text-text-primary">
            {stats.totalMatches}
          </span>
        </div>

        <div className="bg-background-card/95 backdrop-blur-sm border border-border-default rounded-lg p-4 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-full bg-accent-success flex items-center justify-center">
              <span className="text-xs text-white">✓</span>
            </div>
            <span className="text-sm font-medium text-text-secondary">
              Concluídos
            </span>
          </div>
          <span className="text-2xl font-bold text-accent-success">
            {stats.completedMatches}
          </span>
        </div>

        <div className="bg-background-card/95 backdrop-blur-sm border border-border-default rounded-lg p-4 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-full bg-accent-live flex items-center justify-center">
              <span className="text-xs text-white">🔴</span>
            </div>
            <span className="text-sm font-medium text-text-secondary">
              Ao Vivo
            </span>
          </div>
          <span className="text-2xl font-bold text-accent-live">
            {stats.liveMatches}
          </span>
        </div>

        <div className="bg-background-card/95 backdrop-blur-sm border border-border-default rounded-lg p-4 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-full bg-accent-secondary flex items-center justify-center">
              <span className="text-xs text-white">⏳</span>
            </div>
            <span className="text-sm font-medium text-text-secondary">
              Pendentes
            </span>
          </div>
          <span className="text-2xl font-bold text-accent-secondary">
            {stats.upcomingMatches}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-background-card/95 backdrop-blur-sm border border-border-default rounded-lg p-4 relative z-10 hover:shadow-lg transition-all duration-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-secondary">
            Progresso do Torneio
          </span>
          <span className="text-sm font-bold text-text-primary">
            {Math.round(stats.progressPercentage)}%
          </span>
        </div>
        <div className="w-full bg-background-elevated rounded-full h-2">
          <div
            className="bg-gradient-to-r from-accent-primary to-accent-secondary h-2 rounded-full transition-all duration-500"
            style={{ width: `${stats.progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Winner Section */}
      {winner && (
        <div className="bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 border border-accent-primary/20 rounded-lg p-6 relative z-10 backdrop-blur-sm hover:shadow-lg transition-all duration-200">
          <div className="flex items-center gap-3 mb-3">
            <Trophy className="w-6 h-6 text-accent-primary" />
            <span className="text-lg font-bold text-text-primary">Campeão</span>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full"
              style={{ backgroundColor: winner.color || "#ff6b35" }}
            />
            <span className="text-xl font-bold text-text-primary">
              {winner.name}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TournamentBracket({
  teams = mockTeams,
  sportData,
}: TournamentBracketProps) {
  const { activeSport } = useSport();
  const [viewMode, setViewMode] = useState("bracket");
  const [backgroundStyle, setBackgroundStyle] = useState("default");
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Generate tournament data
  const tournamentData = useMemo(() => {
    if (sportData) return sportData;
    return generateBracket(teams, activeSport);
  }, [teams, activeSport, sportData]);

  // Generate layout when tournament data changes
  useMemo(() => {
    if (tournamentData.rounds.length > 0) {
      const { nodes: newNodes, edges: newEdges } =
        generateLayout(tournamentData);
      console.log(
        "Generated nodes:",
        newNodes.length,
        "edges:",
        newEdges.length,
      );
      setNodes(newNodes);
      setEdges(newEdges);
    }
  }, [tournamentData, setNodes, setEdges]);

  // Node and edge types for ReactFlow
  const nodeTypes = useMemo(
    () => ({
      matchNode: EnhancedMatchNode,
    }),
    [],
  );

  const edgeTypes = useMemo(
    () => ({
      bracketEdge: BracketEdge,
    }),
    [],
  );

  // Get current background option
  const currentBackground =
    backgroundOptions.find((bg) => bg.key === backgroundStyle) ||
    backgroundOptions[0];

  if (!tournamentData || tournamentData.rounds.length === 0) {
    return (
      <div className="w-full max-w-full bg-background-card rounded-lg border border-border-default p-4 md:p-8 mt-4 flex items-center justify-center min-h-[200px]">
        <p className="text-text-secondary">
          Não há times suficientes para gerar o chaveamento para {activeSport}.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full bg-background-card rounded-lg border border-border-default p-4 md:p-8 mt-4 relative overflow-hidden">
      {/* Custom Background */}
      <CustomBackground
        pattern={currentBackground.pattern}
        className={currentBackground.className}
      />

      {/* View Mode Selector */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-2">
          {viewModes.map((mode) => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.key}
                onClick={() => setViewMode(mode.key)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 backdrop-blur-sm",
                  viewMode === mode.key
                    ? "bg-accent-primary text-white shadow-lg"
                    : "bg-background-elevated/80 text-text-secondary hover:text-text-primary hover:bg-background-card/80",
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>

        {/* Background Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-secondary">Fundo:</span>
          <div className="flex items-center gap-1">
            {backgroundOptions.map((bg) => {
              const Icon = bg.icon;
              return (
                <button
                  key={bg.key}
                  onClick={() => setBackgroundStyle(bg.key)}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all duration-200 backdrop-blur-sm",
                    backgroundStyle === bg.key
                      ? "bg-accent-primary text-white shadow-md"
                      : "bg-background-elevated/80 text-text-secondary hover:text-text-primary hover:bg-background-card/80",
                  )}
                  title={bg.label}
                >
                  <Icon className="w-3 h-3" />
                  <span className="hidden sm:inline">{bg.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === "bracket" && (
        <div className="h-[600px] border border-border-default rounded-lg overflow-hidden relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            fitViewOptions={{ padding: 0.1 }}
            attributionPosition="bottom-left"
            className={cn("relative z-10", currentBackground.className)}
            defaultEdgeOptions={{
              type: "bracketEdge",
              animated: false,
              style: {
                strokeWidth: 3,
                stroke: "#ff6b35",
                opacity: 1,
              },
            }}
            connectionLineStyle={{ stroke: "#ff6b35", strokeWidth: 2 }}
            connectionLineType={ConnectionLineType.Straight}
          >
            <Controls className="bg-background-card/80 backdrop-blur-sm border border-border-default rounded-lg" />
            <Background
              variant={BackgroundVariant.Dots}
              gap={currentBackground.pattern === "dots" ? 20 : 30}
              size={1}
              color={
                currentBackground.pattern === "dots"
                  ? "rgba(255, 107, 53, 0.1)"
                  : "rgba(255, 107, 53, 0.05)"
              }
            />
            <MiniMap
              nodeColor="#ff6b35"
              maskColor="rgba(0, 0, 0, 0.1)"
              className="bg-background-card/80 backdrop-blur-sm border border-border-default rounded-lg"
            />
          </ReactFlow>
        </div>
      )}

      {viewMode === "hierarchy" && (
        <HierarchyView tournamentData={tournamentData} />
      )}

      {viewMode === "stats" && (
        <StatisticsView tournamentData={tournamentData} />
      )}
    </div>
  );
}
