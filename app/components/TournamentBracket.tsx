// TournamentBracket.tsx
// Componente para exibir o chaveamento (bracket) e tabela de confrontos de um torneio esportivo.
// Usa dados mockados e permite alternar entre visualização de chaveamento e tabela.

"use client";

import { cn } from "@/lib/utils";
import { useSport } from '../providers/SportContext';
import { Shield } from "lucide-react"; 

// A interface para as props do componente foi movida para a página que o utiliza
// A função generateBracket foi movida para lib/bracket-utils.ts
// Os dados mockados foram removidos, pois o componente agora é dinâmico

// Modos de visualização disponíveis: chaveamento (bracket) e tabela
const viewModes = [
  { key: "bracket", label: "Chaveamento" },
  { key: "table", label: "Tabela" }
];

// Função utilitária para formatar datas
const formatDate = (dateString: string, format: 'short' | 'full' = 'short') => {
  const date = new Date(dateString);
  if (format === 'short') {
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  }
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
};

// Interface para as props do componente
interface TournamentBracketProps {
  teams: any[]; // Simplificado, já que a lógica de dados está fora
  sportData: any; // Recebe os dados já processados
}

// O componente agora recebe os dados prontos via props
export default function TournamentBracket({ sportData }: TournamentBracketProps) {
  const { activeSport } = useSport();

  if (!sportData || sportData.rounds.length === 0) {
    return (
      <div className="w-full max-w-full bg-background-card rounded-lg border border-border-default p-4 md:p-8 mt-4 flex items-center justify-center min-h-[200px]">
        <p className="text-text-secondary">Não há times suficientes para gerar o chaveamento para {activeSport}.</p>
      </div>
    );
  }
  
  return (
    // Container principal com estilos do design system
    <div className="w-full max-w-full bg-background-card rounded-lg border border-border-default p-4 md:p-8 mt-4">
      {/* Removido header com título principal */}
      {/* Renderização do esporte selecionado e seus rounds em chaveamento */}
      <div className="space-y-12">
        <div key={sportData.sport}>
          {/* Removido título do esporte com ícone */}
          {/* Visualização em chaveamento (bracket) */}
              <div className="overflow-x-auto">
                <div className="flex gap-8 min-w-[600px]">
              {/* Cada round do esporte */}
              {sportData.rounds.map((round: any) => (
                    <div key={round.name} className="flex flex-col gap-8 min-w-[200px]">
                  {/* Nome do round (ex: Quartas de Final) */}
                  <div className="text-xs text-shadow-gray-200 font-medium text-center uppercase tracking-tight">
                        {round.name}
                      </div>
                  {/* Cada partida do round */}
                      {round.matches.map((match: any) => (
                        <div
                          key={match.id}
                      className="bg-black rounded-md px-3 py-2 border border-border-default shadow flex flex-col gap-2"
                    >
                      {/* Times da partida */}
                      {match.teams.map((team: any) => (
                        <div
                          key={team.name}
                          className={cn(
                            "flex items-center justify-between",
                            team.isWinner
                              ? "bg-transparent"
                              : "bg-transparent text-text-muted"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-accent-primary fill-accent-primary" aria-label="Equipe" />
                            <span className="text-sm font-normal text-text-primary">{team.name}</span>
                          </div>
                          <span className="text-sm font-normal min-w-[24px] text-center">
                                {team.score}
                              </span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
          </div>
      </div>
    </div>
  );
} 