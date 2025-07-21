import { Node, Edge } from '@xyflow/react';

// Tipos importados do seu TournamentBracket.tsx
interface Team {
  name: string;
  icon?: string;
  score?: number;
  isWinner?: boolean;
}

interface Match {
  id: string;
  teams: Team[];
  status?: 'completed' | 'upcoming' | 'live';
}

interface Round {
  name: string;
  matches: Match[];
}

interface TournamentData {
  sport: string;
  rounds: Round[];
}

const NODE_WIDTH = 240;
const NODE_HEIGHT = 100;
const HORIZONTAL_GAP = 150;
const VERTICAL_GAP = 40;

export function generateBracket(teams: Team[], sport: string): TournamentData {
  if (teams.length < 2) {
    return { sport, rounds: [] };
  }

  const initialMatches: Match[] = [];
  const teamList = [...teams];

  // Embaralha a lista de times para confrontos aleatórios
  for (let i = teamList.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [teamList[i], teamList[j]] = [teamList[j], teamList[i]];
  }

  const numTeams = teamList.length;
  const numMatchesFirstRound = numTeams % 2 === 0 ? numTeams / 2 : (numTeams - 1) / 2;
  const teamsWithBye = numTeams % 2 !== 0 ? 1 : 0;
  
  let matchCount = 0;
  for (let i = 0; i < numMatchesFirstRound; i++) {
    const team1 = teamList.pop();
    const team2 = teamList.pop();
    if (team1 && team2) {
      initialMatches.push({
        id: `${sport}-r1-${++matchCount}`,
        teams: [
          { name: team1.name, icon: team1.icon },
          { name: team2.name, icon: team2.icon },
        ],
        status: 'upcoming'
      });
    }
  }

  // Adiciona o time com "bye" se o número de times for ímpar
  if (teamsWithBye > 0) {
    const byeTeam = teamList.pop();
    if (byeTeam) {
      initialMatches.push({
        id: `${sport}-r1-${++matchCount}`,
        teams: [
          { name: byeTeam.name, icon: byeTeam.icon, isWinner: true },
          { name: "BYE" },
        ],
        status: 'completed'
      });
    }
  }
  
  const rounds: Round[] = [{ name: "Rodada 1", matches: initialMatches }];
  let currentTeams = initialMatches.map(m => m.teams.find(t => t.isWinner) || m.teams[0]);
  let roundCount = 1;

  while(currentTeams.length > 1) {
    const nextRoundMatches: Match[] = [];
    for(let i = 0; i < currentTeams.length; i += 2) {
      const team1 = currentTeams[i];
      const team2 = currentTeams[i+1];
      
      const match: Match = {
        id: `${sport}-r${roundCount+1}-${i/2+1}`,
        teams: [
          { name: team1.name, icon: team1.icon },
          { name: team2 ? team2.name : "Aguardando...", icon: team2 ? team2.icon : undefined },
        ],
        status: 'upcoming'
      };
      nextRoundMatches.push(match);
    }
    
    roundCount++;
    const roundName = 
        nextRoundMatches.length === 1 ? "Final" 
      : nextRoundMatches.length === 2 ? "Semifinal"
      : nextRoundMatches.length <= 4 ? "Quartas de Final"
      : `Rodada ${roundCount}`;

    rounds.push({ name: roundName, matches: nextRoundMatches});
    currentTeams = nextRoundMatches.map(m => m.teams[0]); // Placeholder for winners
  }
  
  return { sport, rounds };
}

export function generateLayout(tournamentData: TournamentData): { nodes: Node[], edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const nodePositions = new Map<string, { x: number; y: number }>();

  let previousRoundMatches: string[] = [];

  tournamentData.rounds.forEach((round, roundIndex) => {
    const currentRoundMatches: string[] = [];
    const yOffset = (tournamentData.rounds[0].matches.length - round.matches.length) * (NODE_HEIGHT + VERTICAL_GAP) / 2;

    round.matches.forEach((match, matchIndex) => {
      const x = roundIndex * (NODE_WIDTH + HORIZONTAL_GAP);
      const y = yOffset + matchIndex * (NODE_HEIGHT + VERTICAL_GAP) * Math.pow(2, roundIndex) ;

      const node: Node = {
        id: match.id,
        type: 'matchNode',
        position: { x, y },
        data: {
          teams: match.teams.length > 1 ? [match.teams[0], match.teams[1]] : [match.teams[0], { name: 'BYE' }],
          round: round.name,
        },
        draggable: false, // Bloqueia o movimento individualmente
      };
      
      nodes.push(node);
      nodePositions.set(match.id, { x, y });
      currentRoundMatches.push(match.id);

      // Criar arestas a partir da segunda rodada
      if (roundIndex > 0) {
        const parentMatch1Id = previousRoundMatches[matchIndex * 2];
        const parentMatch2Id = previousRoundMatches[matchIndex * 2 + 1];

        if (parentMatch1Id) {
          edges.push({
            id: `e-${parentMatch1Id}-${match.id}`,
            source: parentMatch1Id,
            sourceHandle: 'winner',
            target: match.id,
            targetHandle: 'team-0',
            type: 'bracketEdge',
          });
        }
        if (parentMatch2Id) {
          edges.push({
            id: `e-${parentMatch2Id}-${match.id}`,
            source: parentMatch2Id,
            sourceHandle: 'winner',
            target: match.id,
            targetHandle: 'team-1',
            type: 'bracketEdge',
          });
        }
      }
    });
    previousRoundMatches = currentRoundMatches;
  });

  return { nodes, edges };
} 