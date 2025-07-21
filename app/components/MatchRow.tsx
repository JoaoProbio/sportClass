'use client';

import { useState } from 'react';
import GameDetailsDialog from './GameDetailsDialog';
import { Status, StatusIndicator, StatusLabel } from '@/components/ui/status';


interface MatchRowProps {
  match: {
    id: number;
    team1: string;
    team2: string;
    sport: string;
    time: string;
    status: 'live' | 'finished' | 'upcoming' | 'postponed';
    score?: string;
    court: string;
  };
}

export default function MatchRow({ match }: MatchRowProps) {
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isWatchDialogOpen, setIsWatchDialogOpen] = useState(false);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'live':
        return {
          label: 'EM ANDAMENTO',
          color: 'bg-orange-700/10 border border-orange-700 text-orange-700',  
        };  
      case 'finished':
        return {
          label: 'FINALIZADO',
          color: 'bg-orange-400/20 border border-orange-400 text-orange-400',
        };
      case 'upcoming':
        return {
          label: 'EM BREVE',
          color: 'bg-orange-500/20 border border-orange-500 text-orange-500',
        };
      case 'postponed':
        return {
          label: 'ADIADO',
          color: 'bg-gray-400/20 border border-gray-400 text-gray-500',
        };
      default:
        return {
          label: 'DESCONHECIDO',
          color: 'bg-gray-400/20 border border-gray-400 text-gray-400',
        };
    }
  };

  const statusInfo = getStatusInfo(match.status);

  return (
    <>
      <div className="bg-background-card border border-border-default rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-xs text-xs font-normal uppercase ${statusInfo.color}`}>
              <span>{statusInfo.label}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-text-primary">{match.time}</div>
            <div className="text-xs text-text-muted">{match.court}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-text-secondary mb-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" clipRule="evenodd" d="M9.26804 1.85893C6.76169 2.53246 4.6258 4.1104 3.23178 6.22135L5.30255 6.78223L9.26804 3.90114V1.85893ZM2.47706 7.57097C1.85009 8.91673 1.5 10.4175 1.5 12C1.5 13.1358 1.68035 14.2295 2.01397 15.254L4.3836 15.5031L6.36391 12.8307L4.8651 8.2178L2.47706 7.57097ZM4.64445 19.4931C3.85602 18.719 3.18922 17.8215 2.67534 16.8318L4.11086 16.9827L4.64445 19.4931ZM6.4848 20.9366C8.0876 21.9279 9.97699 22.5 12 22.5C12.589 22.5 13.1666 22.4515 13.7292 22.3583C13.5422 22.1816 13.4556 21.917 13.5108 21.6573L14.6117 16.4781L12.4718 13.7166H7.57438L5.5351 16.4686L6.4848 20.9366ZM20.982 17.4412C19.7787 19.4233 17.9378 20.9754 15.7439 21.8129L15.0913 21.4361L16.0379 16.9827L20.5659 16.5068L20.982 17.4412ZM21.8383 15.6767C22.2661 14.5324 22.5 13.2935 22.5 12C22.5 11.1375 22.396 10.2994 22.1999 9.49734L18.3215 7.36435L15.171 8.21778L13.6753 12.8209L15.7546 15.5042L20.951 14.958C21.2742 14.9241 21.5824 15.1021 21.7146 15.3989L21.8383 15.6767ZM19.8221 4.99525C20.4559 5.70253 20.9952 6.49626 21.4201 7.35658L19.3522 6.21935L19.8221 4.99525ZM18.6469 3.87129C16.8365 2.38923 14.5221 1.5 12 1.5C11.5832 1.5 11.1721 1.52428 10.768 1.57151V3.90114L14.7335 6.78223L17.8539 5.93695L18.6469 3.87129ZM6.33464 7.88647L10.018 5.21033L13.7014 7.88647L12.2945 12.2166H7.74158L6.33464 7.88647Z" />
          </svg>
          <span>{match.sport}</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 flex-1">
            <span className="w-6 h-6 rounded-sm bg-accent-primary flex items-center justify-center text-xs font-bold">
              {match.team1.split(' ')[0]}
            </span>
            <span className="font-medium text-sm truncate">{match.team1}</span>
          </div>
          <div className="text-lg font-bold text-text-primary mx-2">
            {match.score || 'vs'}
          </div>
          <div className="flex items-center gap-2 flex-1 justify-end">
            <span className="font-medium text-sm truncate">{match.team2}</span>
            <span className="w-6 h-6 rounded-sm bg-accent-secondary flex items-center justify-center text-xs font-bold">
              {match.team2.split(' ')[0]}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => setIsDetailsDialogOpen(true)}
            className="flex-1 px-3 py-2 text-xs font-medium rounded-xs border border-border-default bg-background-elevated text-text-primary cursor-pointer transition-all hover:bg-accent-primary hover:border-accent-primary hover:text-text-inverse"
          >
            Detalhes
          </button>
          {match.status === 'live' && (
            <button 
              onClick={() => setIsWatchDialogOpen(true)}
              className="flex-1 px-3 py-2 text-xs font-medium rounded-xs border border-accent-primary bg-accent-primary text-text-inverse cursor-pointer transition-all hover:bg-accent-primary-hover"
            >
              Assistir
            </button>
          )}
        </div>
      </div>

      {/* Dialog para Detalhes */}
      <GameDetailsDialog 
        game={match}
        isOpen={isDetailsDialogOpen}
        onClose={() => setIsDetailsDialogOpen(false)}
      />

      {/* Dialog para Assistir */}
      <GameDetailsDialog 
        game={match}
        isOpen={isWatchDialogOpen}
        onClose={() => setIsWatchDialogOpen(false)}
      />
    </>
  );
} 