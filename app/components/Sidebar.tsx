'use client';

import { useState } from 'react';
import TurmaDialog from './TurmaDialog';

export default function Sidebar() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTurma, setSelectedTurma] = useState<string>('');

  const turmas = [
    // Agro
    { id: '1a-agro', name: '1º Agro A', division: 'agro', year: 1, color: '#ff6b35' },
    { id: '1b-agro', name: '1º Agro B', division: 'agro', year: 1, color: '#ff8c42' },
    { id: '1c-agro', name: '1º Agro C', division: 'agro', year: 1, color: '#ffa726' },
    { id: '2a-agro', name: '2º Agro A', division: 'agro', year: 2, color: '#e65100' },
    { id: '2b-agro', name: '2º Agro B', division: 'agro', year: 2, color: '#f57c00' },
    { id: '2c-agro', name: '2º Agro C', division: 'agro', year: 2, color: '#ff8f00' },
    { id: '3a-agro', name: '3º Agro A', division: 'agro', year: 3, color: '#ffab00' },
    { id: '3b-agro', name: '3º Agro B', division: 'agro', year: 3, color: '#ffc400' },
    { id: '3c-agro', name: '3º Agro C', division: 'agro', year: 3, color: '#ffd54f' },
    
    // Meio
    { id: '1a-meio', name: '1º Meio A', division: 'meio', year: 1, color: '#ffb74d' },
    { id: '1b-meio', name: '1º Meio B', division: 'meio', year: 1, color: '#ffcc02' },
    { id: '1c-meio', name: '1º Meio C', division: 'meio', year: 1, color: '#ff9800' },
    { id: '2a-meio', name: '2º Meio A', division: 'meio', year: 2, color: '#ff6f00' },
    { id: '2b-meio', name: '2º Meio B', division: 'meio', year: 2, color: '#ff9100' },
    { id: '2c-meio', name: '2º Meio C', division: 'meio', year: 2, color: '#ffb300' },
    { id: '3a-meio', name: '3º Meio A', division: 'meio', year: 3, color: '#ffeb3b' },
    { id: '3b-meio', name: '3º Meio B', division: 'meio', year: 3, color: '#fff176' },
    { id: '3c-meio', name: '3º Meio C', division: 'meio', year: 3, color: '#fff59d' },
    
    // Info
    { id: '1a-info', name: '1º Info A', division: 'info', year: 1, color: '#ff5722' },
    { id: '1b-info', name: '1º Info B', division: 'info', year: 1, color: '#ff7043' },
    { id: '2a-info', name: '2º Info A', division: 'info', year: 2, color: '#ffc107' },
    { id: '2b-info', name: '2º Info B', division: 'info', year: 2, color: '#ffca28' },
    { id: '3a-info', name: '3º Info A', division: 'info', year: 3, color: '#fff9c4' },
    { id: '3b-info', name: '3º Info B', division: 'info', year: 3, color: '#fffde7' },
  ];

  const getTurmaIcon = (division: string) => {
    switch (division) {
      case 'agro':
        return (
          <svg className='w-4 h-4 text-text-secondary' viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" color="#000000" strokeWidth="1.5">
            <path fillRule="evenodd" clipRule="evenodd" d="M3.6 2.25C2.85442 2.25 2.25 2.85441 2.25 3.6V20.4C2.25 21.1456 2.85441 21.75 3.6 21.75H20.4C21.1456 21.75 21.75 21.1456 21.75 20.4V3.6C21.75 2.85442 21.1456 2.25 20.4 2.25H3.6ZM9.87884 8.42139H14.8286C15.0206 8.42139 15.2125 8.49461 15.3589 8.64106C15.4309 8.71296 15.4851 8.79584 15.5217 8.8843C15.5584 8.97273 15.5786 9.06969 15.5786 9.17139V14.1212C15.5786 14.5354 15.2428 14.8712 14.8286 14.8712C14.4144 14.8712 14.0786 14.5354 14.0786 14.1212V10.982L9.70207 15.3586C9.40918 15.6515 8.93431 15.6515 8.64141 15.3586C8.34852 15.0657 8.34852 14.5908 8.64141 14.2979L13.018 9.92139H9.87884C9.46463 9.92139 9.12884 9.5856 9.12884 9.17139C9.12884 8.75717 9.46463 8.42139 9.87884 8.42139Z" fill="currentColor"></path>
          </svg>
        );
      case 'meio':
        return (
          <svg className='w-4 h-4 text-text-secondary' viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" color="#000000" strokeWidth="1.5">
            <path fillRule="evenodd" clipRule="evenodd" d="M3.6 2.25C2.85442 2.25 2.25 2.85441 2.25 3.6V20.4C2.25 21.1456 2.85441 21.75 3.6 21.75H20.4C21.1456 21.75 21.75 21.1456 21.75 20.4V3.6C21.75 2.85442 21.1456 2.25 20.4 2.25H3.6ZM9.87884 8.42139H14.8286C15.0206 8.42139 15.2125 8.49461 15.3589 8.64106C15.4309 8.71296 15.4851 8.79584 15.5217 8.8843C15.5584 8.97273 15.5786 9.06969 15.5786 9.17139V14.1212C15.5786 14.5354 15.2428 14.8712 14.8286 14.8712C14.4144 14.8712 14.0786 14.5354 14.0786 14.1212V10.982L9.70207 15.3586C9.40918 15.6515 8.93431 15.6515 8.64141 15.3586C8.34852 15.0657 8.34852 14.5908 8.64141 14.2979L13.018 9.92139H9.87884C9.46463 9.92139 9.12884 9.5856 9.12884 9.17139C9.12884 8.75717 9.46463 8.42139 9.87884 8.42139Z" fill="currentColor"></path>
          </svg>
        );
      case 'info':
        return (
          <svg className='w-4 h-4 text-text-secondary' viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" color="#000000" strokeWidth="1.5">
            <path fillRule="evenodd" clipRule="evenodd" d="M3.6 2.25C2.85442 2.25 2.25 2.85441 2.25 3.6V20.4C2.25 21.1456 2.85441 21.75 3.6 21.75H20.4C21.1456 21.75 21.75 21.1456 21.75 20.4V3.6C21.75 2.85442 21.1456 2.25 20.4 2.25H3.6ZM9.87884 8.42139H14.8286C15.0206 8.42139 15.2125 8.49461 15.3589 8.64106C15.4309 8.71296 15.4851 8.79584 15.5217 8.8843C15.5584 8.97273 15.5786 9.06969 15.5786 9.17139V14.1212C15.5786 14.5354 15.2428 14.8712 14.8286 14.8712C14.4144 14.8712 14.0786 14.5354 14.0786 14.1212V10.982L9.70207 15.3586C9.40918 15.6515 8.93431 15.6515 8.64141 15.3586C8.34852 15.0657 8.34852 14.5908 8.64141 14.2979L13.018 9.92139H9.87884C9.46463 9.92139 9.12884 9.5856 9.12884 9.17139C9.12884 8.75717 9.46463 8.42139 9.87884 8.42139Z" fill="currentColor"></path>
          </svg>
        );
      default:
        return null;
    }
  };

  const getDivisionName = (division: string) => {
    switch (division) {
      case 'agro':
        return 'Agropecuária';
      case 'meio':
        return 'Meio Ambiente';
      case 'info':
        return 'Informática';
      default:
        return division;
    }
  };

  const handleTurmaClick = (turmaName: string) => {
    setSelectedTurma(turmaName);
    setIsDialogOpen(true);
  };

  // Group turmas by division
  const groupedTurmas = turmas.reduce((acc, turma) => {
    if (!acc[turma.division]) {
      acc[turma.division] = [];
    }
    acc[turma.division].push(turma);
    return acc;
  }, {} as Record<string, typeof turmas>);

  // Sort divisions in the order we want
  const divisionOrder = ['agro', 'meio', 'info'];

  return (
    <>
      <aside className="w-full md:w-70" id="sidebar-desktop">
        <div className="h-full flex flex-col">
          {/* Espaçamento no topo - apenas no desktop */}
          <div className="hidden md:block h-0"></div>
          
          {/* Seção de Turmas por Divisão */}
          <section className="flex-1 p-4 md:p-6">
            <div className="space-y-6 max-h-[calc(100vh-200px)] md:max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-hide">
              {divisionOrder.map((division) => {
                const divisionTurmas = groupedTurmas[division];
                if (!divisionTurmas || divisionTurmas.length === 0) return null;

                return (
                  <div key={division}>
                    <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
                      {getDivisionName(division)}
                    </h3>
                    <div className="space-y-1">
                      {divisionTurmas
                        .sort((a, b) => a.year - b.year || a.name.localeCompare(b.name))
                        .map((turma) => (
                        <button
                          key={turma.id}
                          onClick={() => handleTurmaClick(turma.name)}
                          className="w-full flex items-center gap-3 py-2 md:p-2 rounded-md text-sm text-text-secondary hover:bg-background-card hover:text-text-primary transition-all duration-200 cursor-pointer text-left border border-transparent hover:border-border-default"
                          aria-label={`Selecionar turma ${turma.name}`}
                        >
                          {getTurmaIcon(turma.division)}
                          <span className="truncate tracking-tight">{turma.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </aside>

      {/* Dialog para Turmas */}
      <TurmaDialog 
        turmaName={selectedTurma}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
} 