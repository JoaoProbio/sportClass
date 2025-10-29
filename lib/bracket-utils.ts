import { Node, Edge } from '@xyflow/react';
import * as dagre from 'dagre';
import * as d3 from 'd3';

// Enhanced types for better type safety

export interface TournamentData {
  sport: string;
  rounds: Round[];
  totalTeams: number;
  totalRounds: number;
}

export interface Team {
  id: string;
  name: string;
  icon?: string;
  score?: number;
  isWinner?: boolean;
  division?: string;
  year?: number;
  color?: string;
}

export interface Match {
  id: string;
  teams: Team[];
  status?: 'completed' | 'upcoming' | 'live' | 'postponed';
  date?: string;
  time?: string;
  court?: string;
  winner?: Team;
}

export interface Round {
  id: string;
  name: string;
  matches: Match[];
  level: number;
}

// Dagre.js configuration
const GRAPH_CONFIG = {
  rankdir: 'LR', // Left to Right layout
  nodesep: 0,   // Vertical separation between nodes
  edgesep: 0,   // Horizontal separation between edges
  ranksep: 0,  // Horizontal separation between ranks
  marginx: 0,   // Horizontal margin
  marginy: 0,   // Vertical margin
};

const NODE_CONFIG = {
  width: 280,
  height: 120,
  borderRadius: 8,
};

/**
 * Enhanced bracket generation using D3 Hierarchy for better data structure
 */
export function generateBracket(teams: Team[], sport: string): TournamentData {
  console.log('Generating bracket for', teams.length, 'teams in', sport);
  if (teams.length < 2) {
    console.log('Not enough teams for bracket');
    return { sport, rounds: [], totalTeams: teams.length, totalRounds: 0 };
  }

  // Create hierarchical structure using D3
  const hierarchy = createTournamentHierarchy(teams);
  const rounds = buildRoundsFromHierarchy(hierarchy, sport);
  
  console.log('Generated tournament with', rounds.length, 'rounds');
  rounds.forEach((round, index) => {
    console.log(`Round ${index + 1}: ${round.name} with ${round.matches.length} matches`);
  });
  
  return {
    sport,
    rounds,
    totalTeams: teams.length,
    totalRounds: rounds.length,
  };
}

/**
 * Create tournament hierarchy using D3
 */
function createTournamentHierarchy(teams: Team[]) {
  // Shuffle teams for random matchups
  const shuffledTeams = d3.shuffle([...teams]);
  
  // Create initial matches
  const initialMatches = [];
  for (let i = 0; i < shuffledTeams.length; i += 2) {
    const team1 = shuffledTeams[i];
    const team2 = shuffledTeams[i + 1];
    
    if (team1 && team2) {
      initialMatches.push({
        id: `match-${i/2}`,
        teams: [team1, team2],
        status: 'upcoming' as const,
      });
    } else if (team1) {
      // Handle odd number of teams with bye
      initialMatches.push({
        id: `match-${i/2}`,
        teams: [team1, { id: 'bye', name: 'BYE', isWinner: false }],
        status: 'completed' as const,
        winner: team1,
      });
    }
  }

  return initialMatches;
}

/**
 * Build rounds from hierarchy
 */
function buildRoundsFromHierarchy(initialMatches: any[], sport: string): Round[] {
  const rounds: Round[] = [];
  let currentMatches = initialMatches;
  let roundNumber = 1;

  // Add first round
  rounds.push({
    id: `round-${roundNumber}`,
    name: getRoundName(currentMatches.length, roundNumber),
    matches: currentMatches.map((match, index) => ({
      ...match,
      id: `${sport}-r${roundNumber}-${index + 1}`,
    })),
    level: roundNumber,
  });

  // Generate subsequent rounds
  while (currentMatches.length > 1) {
    roundNumber++;
    const nextRoundMatches = [];
    
    for (let i = 0; i < currentMatches.length; i += 2) {
      const match1 = currentMatches[i];
      const match2 = currentMatches[i + 1];
      
      const nextMatch = {
        id: `${sport}-r${roundNumber}-${Math.floor(i/2) + 1}`,
        teams: [
          { id: 'tbd', name: 'Aguardando...', isWinner: false },
          { id: 'tbd2', name: 'Aguardando...', isWinner: false },
        ],
        status: 'upcoming' as const,
      };
      
      nextRoundMatches.push(nextMatch);
    }
    
    rounds.push({
      id: `round-${roundNumber}`,
      name: getRoundName(nextRoundMatches.length, roundNumber),
      matches: nextRoundMatches,
      level: roundNumber,
    });
    
    currentMatches = nextRoundMatches;
  }

  return rounds;
}

/**
 * Get round name based on number of matches
 */
function getRoundName(matchCount: number, roundNumber: number): string {
  if (matchCount === 1) return 'Final';
  if (matchCount === 2) return 'Semifinal';
  if (matchCount <= 4) return 'Quartas de Final';
  if (matchCount <= 8) return 'Oitavas de Final';
  return `Rodada ${roundNumber}`;
}

/**
 * Enhanced layout generation using Dagre.js for automatic positioning
 */
export function generateLayout(tournamentData: TournamentData): { nodes: Node[], edges: Edge[] } {
  const g = new dagre.graphlib.Graph();
  
  // Set graph properties
  g.setGraph({
    rankdir: GRAPH_CONFIG.rankdir,
    nodesep: GRAPH_CONFIG.nodesep,
    edgesep: GRAPH_CONFIG.edgesep,
    ranksep: GRAPH_CONFIG.ranksep,
    marginx: GRAPH_CONFIG.marginx,
    marginy: GRAPH_CONFIG.marginy,
  });
  
  // Set default edge label
  g.setDefaultEdgeLabel(() => ({}));

  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const nodePositions = new Map<string, { x: number; y: number }>();

  // Add nodes to Dagre graph
  tournamentData.rounds.forEach((round, roundIndex) => {
    round.matches.forEach((match, matchIndex) => {
      const nodeId = match.id;
      
      // Add node to Dagre graph
      g.setNode(nodeId, {
        width: NODE_CONFIG.width,
        height: NODE_CONFIG.height,
        label: match.id,
      });
      
      // Create XYFlow node
      const node: Node = {
        id: nodeId,
        type: 'matchNode',
        position: { x: 0, y: 0 }, // Will be set by Dagre
        data: {
          teams: match.teams,
          round: round.name,
          status: match.status,
          date: match.date,
          time: match.time,
          court: match.court,
        },
        draggable: false,
      };
      
      nodes.push(node);
    });
  });

  // Add edges to Dagre graph
  console.log('Generating edges for', tournamentData.rounds.length, 'rounds');
  tournamentData.rounds.forEach((round, roundIndex) => {
    if (roundIndex === 0) {
      console.log('Skipping first round (roundIndex = 0)');
      return; // Skip first round
    }
    
    console.log(`Processing round ${roundIndex + 1} with ${round.matches.length} matches`);
    round.matches.forEach((match, matchIndex) => {
      const parentRound = tournamentData.rounds[roundIndex - 1];
      const parentMatch1Index = matchIndex * 2;
      const parentMatch2Index = matchIndex * 2 + 1;
      
      if (parentMatch1Index < parentRound.matches.length) {
        const parentMatch1 = parentRound.matches[parentMatch1Index];
        g.setEdge(parentMatch1.id, match.id, { weight: 1 });
        
        const edge = {
          id: `e-${parentMatch1.id}-${match.id}`,
          source: parentMatch1.id,
          target: match.id,
          type: 'bracketEdge',
          data: { 
            sourceHandle: 'winner', 
            targetHandle: 'team-0',
            status: match.status,
            round: match.id,
            label: `Rodada ${roundIndex + 1}`,
            winner: match.winner,
          },
        };
        edges.push(edge);
        console.log('Added edge:', edge.id);
      }
      
      if (parentMatch2Index < parentRound.matches.length) {
        const parentMatch2 = parentRound.matches[parentMatch2Index];
        g.setEdge(parentMatch2.id, match.id, { weight: 1 });
        
        const edge = {
          id: `e-${parentMatch2.id}-${match.id}`,
          source: parentMatch2.id,
          target: match.id,
          type: 'bracketEdge',
          data: { 
            sourceHandle: 'winner', 
            targetHandle: 'team-1',
            status: match.status,
            round: match.id,
            label: `Rodada ${roundIndex + 1}`,
            winner: match.winner,
          },
        };
        edges.push(edge);
        console.log('Added edge:', edge.id);
      }
    });
  });
  
  console.log('Total edges generated:', edges.length);

  // Calculate layout
  dagre.layout(g);

  // Update node positions
  nodes.forEach((node) => {
    const dagreNode = g.node(node.id);
    if (dagreNode) {
      node.position = {
        x: dagreNode.x - dagreNode.width / 2,
        y: dagreNode.y - dagreNode.height / 2,
      };
      nodePositions.set(node.id, node.position);
    }
  });

  return { nodes, edges };
}

/**
 * Generate hierarchical data structure for D3 visualization
 */
export function generateHierarchicalData(tournamentData: TournamentData) {
  const root = {
    name: tournamentData.sport,
    children: tournamentData.rounds.map(round => ({
      name: round.name,
      level: round.level,
      children: round.matches.map(match => ({
        name: match.id,
        teams: match.teams,
        status: match.status,
        children: match.teams.map(team => ({
          name: team.name,
          id: team.id,
          isWinner: team.isWinner,
          division: team.division,
          year: team.year,
          color: team.color,
        })),
      })),
    })),
  };

  return d3.hierarchy(root);
}

/**
 * Calculate tournament statistics
 */
export function calculateTournamentStats(tournamentData: TournamentData) {
  const totalMatches = tournamentData.rounds.reduce((acc, round) => acc + round.matches.length, 0);
  const completedMatches = tournamentData.rounds.reduce((acc, round) => 
    acc + round.matches.filter(match => match.status === 'completed').length, 0
  );
  const liveMatches = tournamentData.rounds.reduce((acc, round) => 
    acc + round.matches.filter(match => match.status === 'live').length, 0
  );
  const upcomingMatches = tournamentData.rounds.reduce((acc, round) => 
    acc + round.matches.filter(match => match.status === 'upcoming').length, 0
  );

  return {
    totalMatches,
    completedMatches,
    liveMatches,
    upcomingMatches,
    progressPercentage: (completedMatches / totalMatches) * 100,
  };
}

/**
 * Get tournament winner
 */
export function getTournamentWinner(tournamentData: TournamentData): Team | null {
  const finalRound = tournamentData.rounds[tournamentData.rounds.length - 1];
  if (!finalRound || finalRound.matches.length === 0) return null;
  
  const finalMatch = finalRound.matches[0];
  return finalMatch.winner || finalMatch.teams.find(team => team.isWinner) || null;
}

/**
 * Update match result
 */
export function updateMatchResult(
  tournamentData: TournamentData,
  matchId: string,
  winner: Team,
  scores: [number, number]
): TournamentData {
  const updatedRounds = tournamentData.rounds.map(round => ({
    ...round,
    matches: round.matches.map(match => {
      if (match.id === matchId) {
        const updatedTeams = match.teams.map((team, index) => ({
          ...team,
          score: scores[index],
          isWinner: team.id === winner.id,
        }));
        
        return {
          ...match,
          teams: updatedTeams,
          winner,
          status: 'completed' as const,
        };
      }
      return match;
    }),
  }));

  return {
    ...tournamentData,
    rounds: updatedRounds,
  };
} 