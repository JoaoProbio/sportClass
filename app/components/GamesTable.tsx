'use client';

import MatchRow from './MatchRow';
import { useSport } from '../providers/SportContext';

interface Game {
  id: number;
  team1: string;
  team2: string;
  sport: string;
  time: string;
  status: 'live' | 'finished' | 'upcoming' | 'postponed';
  score?: string;
  court: string;
}

interface GamesTableProps {
  games?: Game[];
}

export default function GamesTable({ games = [] }: GamesTableProps) {
  const { activeSport } = useSport();

  // Dados de exemplo caso não sejam fornecidos
  const defaultGames: Game[] = [
    {
      id: 1,
      team1: '3º Ano A',
      team2: '3º Ano B',
      sport: 'Futsal',
      time: '14:00',
      status: 'live',
      score: '2 - 1',
      court: 'Ginásio Poliesportivo',
    },
    {
      id: 2,
      team1: '2º Ano A',
      team2: '2º Ano B',
      sport: 'Futsal',
      time: '15:30',
      status: 'upcoming',
      court: 'Ginásio Poliesportivo',
    },
    {
      id: 3,
      team1: '3º Ano A',
      team2: '2º Ano A',
      sport: 'Futsal',
      time: '16:00',
      status: 'finished',
      court: 'Ginásio Poliesportivo',
    },
    {
      id: 4,
      team1: '1º Ano A',
      team2: '1º Ano B',
      sport: 'Futsal',
      time: '13:00',
      status: 'upcoming',
      score: '0 - 3',
      court: 'Ginásio Poliesportivo',
    },
    {
      id: 5,
      team1: '3º Ano A',
      team2: '1º Ano A',
      sport: 'Futsal',
      time: '17:30',
      status: 'postponed',
      court: 'Quadra Coberta',
    },
    {
      id: 6,
      team1: '2º Ano A',
      team2: '1º Ano A',
      sport: 'Tênis de Mesa',
      time: '18:00',
      status: 'upcoming',
      court: 'Quadra de Tênis',
    }
  ];

  const gamesToUse = games.length > 0 ? games : defaultGames;

  const filteredMatches = gamesToUse.filter(game => {
    // Filtro apenas por esporte
    return game.sport.toLowerCase() === activeSport || activeSport === 'todos';
  });

  return (
    <div className="space-y-4">
      {/* Lista de Jogos */}
      {filteredMatches.map((game) => (
        <MatchRow key={game.id} match={game} />
      ))}
      
      {filteredMatches.length === 0 && (
        <div className="text-center py-12">
          <div className="text-text-muted mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <p className="text-lg font-medium text-text-secondary">Nenhum jogo encontrado</p>
            <p className="text-sm text-text-muted">Tente ajustar os filtros ou verificar mais tarde</p>
          </div>
          <button 
            className="px-4 py-2 text-sm font-medium text-text-primary bg-background-card border border-border-default rounded-md hover:bg-background-elevated cursor-pointer transition-all duration-200 hover:border-border-hover"
            aria-label="Recarregar jogos"
          >
            Recarregar
          </button>
        </div>
      )}
    </div>
  );
} 