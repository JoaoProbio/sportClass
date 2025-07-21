'use client';

import { useState } from 'react';
import PageLayout from '../components/PageLayout';
import { useSport } from '../providers/SportContext';
import TransitionLayout from '../components/TransitionLayout';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function EstatisticasPage() {
  const { activeSport, setActiveSport } = useSport();

  const sports = [
    { id: 'futsal', label: 'Futsal', icon: '/soccer.svg', isSvg: true },
    { id: 'basquete', label: 'Basquete', icon: '/basketball.svg', isSvg: true },
    { id: 'volei', label: 'Vôlei', icon: '/volleyball.svg', isSvg: true },
    { id: 'handebol', label: 'Handebol', icon: '/handball.svg', isSvg: true },
    { id: 'tenis-de-mesa', label: 'Tênis de Mesa', icon: '/table-tennis.svg', isSvg: true },
  ];

  const estatisticas = {
    futsal: {
      artilheiros: [
        { nome: 'Pedro Santos', turma: '3º Ano A', gols: 6 },
        { nome: 'Lucas Costa', turma: '2º Ano A', gols: 5 },
        { nome: 'Gabriel Lima', turma: '1º Ano A', gols: 4 },
        { nome: 'Carlos Ferreira', turma: '3º Ano B', gols: 3 },
        { nome: 'Rafael Alves', turma: '2º Ano B', gols: 2 },
      ],
      assistencias: [
        { nome: 'Rafael Alves', turma: '3º Ano A', assistencias: 5 },
        { nome: 'Diego Silva', turma: '2º Ano A', assistencias: 4 },
        { nome: 'Bruno Costa', turma: '1º Ano A', assistencias: 3 },
        { nome: 'André Santos', turma: '3º Ano B', assistencias: 2 },
        { nome: 'Felipe Lima', turma: '2º Ano B', assistencias: 1 },
      ],
      goleiros: [
        { nome: 'Thiago Santos', turma: '3º Ano A', golsSofridos: 4, jogos: 5 },
        { nome: 'Felipe Costa', turma: '2º Ano A', golsSofridos: 6, jogos: 5 },
        { nome: 'Marcos Lima', turma: '1º Ano A', golsSofridos: 8, jogos: 5 },
        { nome: 'Roberto Silva', turma: '3º Ano B', golsSofridos: 10, jogos: 5 },
        { nome: 'Daniel Oliveira', turma: '2º Ano B', golsSofridos: 12, jogos: 5 },
      ]
    },
    basquete: {
      artilheiros: [
        { nome: 'Pedro Santos', turma: '3º Ano A', gols: 38 },
        { nome: 'Lucas Costa', turma: '2º Ano A', gols: 32 },
        { nome: 'Gabriel Lima', turma: '1º Ano A', gols: 28 },
        { nome: 'Carlos Ferreira', turma: '3º Ano B', gols: 25 },
        { nome: 'Rafael Alves', turma: '2º Ano B', gols: 20 },
      ],
      assistencias: [
        { nome: 'Rafael Alves', turma: '3º Ano A', assistencias: 10 },
        { nome: 'Diego Silva', turma: '2º Ano A', assistencias: 8 },
        { nome: 'Bruno Costa', turma: '1º Ano A', assistencias: 6 },
        { nome: 'André Santos', turma: '3º Ano B', assistencias: 5 },
        { nome: 'Felipe Lima', turma: '2º Ano B', assistencias: 4 },
      ],
      goleiros: [
        { nome: 'Thiago Santos', turma: '3º Ano A', golsSofridos: 22, jogos: 5 },
        { nome: 'Felipe Costa', turma: '2º Ano A', golsSofridos: 28, jogos: 5 },
        { nome: 'Marcos Lima', turma: '1º Ano A', golsSofridos: 35, jogos: 5 },
        { nome: 'Roberto Silva', turma: '3º Ano B', golsSofridos: 40, jogos: 5 },
        { nome: 'Daniel Oliveira', turma: '2º Ano B', golsSofridos: 45, jogos: 5 },
      ]
    },
    volei: {
      artilheiros: [
        { nome: 'Maria Santos', turma: '3º Ano A', gols: 20 },
        { nome: 'Julia Costa', turma: '2º Ano A', gols: 18 },
        { nome: 'Ana Lima', turma: '1º Ano A', gols: 15 },
        { nome: 'Paula Alves', turma: '3º Ano B', gols: 12 },
        { nome: 'Fernanda Silva', turma: '2º Ano B', gols: 10 },
      ],
      assistencias: [
        { nome: 'Paula Alves', turma: '3º Ano A', assistencias: 12 },
        { nome: 'Fernanda Silva', turma: '2º Ano A', assistencias: 10 },
        { nome: 'Camila Costa', turma: '1º Ano A', assistencias: 8 },
        { nome: 'Beatriz Santos', turma: '3º Ano B', assistencias: 6 },
        { nome: 'Amanda Lima', turma: '2º Ano B', assistencias: 5 },
      ],
      goleiros: [
        { nome: 'Carolina Santos', turma: '3º Ano A', golsSofridos: 12, jogos: 5 },
        { nome: 'Beatriz Costa', turma: '2º Ano A', golsSofridos: 15, jogos: 5 },
        { nome: 'Amanda Lima', turma: '1º Ano A', golsSofridos: 18, jogos: 5 },
        { nome: 'Juliana Silva', turma: '3º Ano B', golsSofridos: 20, jogos: 5 },
        { nome: 'Mariana Alves', turma: '2º Ano B', golsSofridos: 22, jogos: 5 },
      ]
    },
    handebol: {
      artilheiros: [
        { nome: 'André Santos', turma: '3º Ano A', gols: 10 },
        { nome: 'Felipe Costa', turma: '2º Ano A', gols: 8 },
        { nome: 'Marcos Lima', turma: '1º Ano A', gols: 6 },
        { nome: 'Ricardo Silva', turma: '3º Ano B', gols: 5 },
        { nome: 'Gustavo Alves', turma: '2º Ano B', gols: 4 },
      ],
      assistencias: [
        { nome: 'Marcos Alves', turma: '3º Ano A', assistencias: 6 },
        { nome: 'Ricardo Silva', turma: '2º Ano A', assistencias: 5 },
        { nome: 'Gustavo Costa', turma: '1º Ano A', assistencias: 4 },
        { nome: 'Eduardo Santos', turma: '3º Ano B', assistencias: 3 },
        { nome: 'Leonardo Lima', turma: '2º Ano B', assistencias: 2 },
      ],
      goleiros: [
        { nome: 'Eduardo Santos', turma: '3º Ano A', golsSofridos: 8, jogos: 5 },
        { nome: 'Leonardo Costa', turma: '2º Ano A', golsSofridos: 10, jogos: 5 },
        { nome: 'Victor Lima', turma: '1º Ano A', golsSofridos: 12, jogos: 5 },
        { nome: 'Thiago Silva', turma: '3º Ano B', golsSofridos: 15, jogos: 5 },
        { nome: 'Felipe Alves', turma: '2º Ano B', golsSofridos: 18, jogos: 5 },
      ]
    },
    'tenis-de-mesa': {
      artilheiros: [
        { nome: 'Bruno Santos', turma: '3º Ano A', gols: 12 },
        { nome: 'Carlos Costa', turma: '2º Ano A', gols: 10 },
        { nome: 'David Lima', turma: '1º Ano A', gols: 8 },
        { nome: 'Eduardo Silva', turma: '3º Ano B', gols: 6 },
        { nome: 'Fernando Alves', turma: '2º Ano B', gols: 5 },
      ],
      assistencias: [
        { nome: 'David Alves', turma: '3º Ano A', assistencias: 4 },
        { nome: 'Eduardo Silva', turma: '2º Ano A', assistencias: 3 },
        { nome: 'Fernando Costa', turma: '1º Ano A', assistencias: 2 },
        { nome: 'Gabriel Santos', turma: '3º Ano B', assistencias: 2 },
        { nome: 'Henrique Lima', turma: '2º Ano B', assistencias: 1 },
      ],
      goleiros: [
        { nome: 'Gabriel Santos', turma: '3º Ano A', golsSofridos: 5, jogos: 5 },
        { nome: 'Henrique Costa', turma: '2º Ano A', golsSofridos: 7, jogos: 5 },
        { nome: 'Igor Lima', turma: '1º Ano A', golsSofridos: 9, jogos: 5 },
        { nome: 'João Silva', turma: '3º Ano B', golsSofridos: 11, jogos: 5 },
        { nome: 'Pedro Costa', turma: '2º Ano B', golsSofridos: 13, jogos: 5 },
      ]
    }
  };

  const currentStats = estatisticas[activeSport as keyof typeof estatisticas] || estatisticas.futsal;

  const renderSportIcon = (iconType: string) => {
    switch (iconType) {
      case 'futsal':
        return <img src="/soccer.svg" alt="Futsal" className="w-4 h-4" />;
      case 'basquete':
        return <img src="/basketball.svg" alt="Basquete" className="w-4 h-4" />;
      case 'volei':
        return <img src="/volleyball.svg" alt="Vôlei" className="w-4 h-4" />;
      case 'handebol':
        return <img src="/handball.svg" alt="Handebol" className="w-4 h-4" />;
      case 'tenis-de-mesa':
        return <img src="/table-tennis.svg" alt="Tênis de Mesa" className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <TransitionLayout backgroundColor="var(--background)">
      <PageLayout>
        <div className="mt-2">
          <div className="space-y-4 md:space-y-6">
            {/* Header da Página */}
            <div>
              <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-text-primary mb-1 md:mb-2">
                Estatísticas
              </h1>
              <p className="text-xs md:text-sm text-text-secondary">
                Análise detalhada do desempenho das turmas
              </p>
            </div>

            {/* Seções de Estatísticas */}
            {currentStats && (
              <div className="space-y-6">
                {/* Artilheiros */}
                <div className="bg-background-card rounded-lg border border-border-default overflow-hidden">
                  <div className="p-4 md:p-4 border-b border-border-default">
                    <h3 className="text-lg font-semibold text-text-primary flex items-center">Artilheiros</h3>
                  </div>
                  <Table className="min-w-[400px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12 text-center">Pos</TableHead>
                        <TableHead>Jogador</TableHead>
                        <TableHead>Turma</TableHead>
                        <TableHead className="text-center">Gols</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                    {currentStats.artilheiros.map((artilheiro, index) => (
                        <TableRow key={index} className="hover:bg-background-elevated transition-colors">
                          <TableCell className="text-center font-medium">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              index < 3 
                                ? 'bg-accent-primary text-text-inverse' 
                                : 'bg-background-elevated text-text-primary'
                            }`}>
                              {index + 1}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-text-primary">{artilheiro.nome}</TableCell>
                          <TableCell className="text-text-secondary">{artilheiro.turma}</TableCell>
                          <TableCell className="text-center font-bold text-accent-primary">{artilheiro.gols}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Assistências */}
                <div className="bg-background-card rounded-lg border border-border-default overflow-hidden">
                  <div className="p-4 md:p-4 border-b border-border-default">
                    <h3 className="text-lg font-semibold text-text-primary flex items-center">Assistências</h3>
                  </div>
                  <Table className="min-w-[400px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12 text-center">Pos</TableHead>
                        <TableHead>Jogador</TableHead>
                        <TableHead>Turma</TableHead>
                        <TableHead className="text-center">Assistências</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                    {currentStats.assistencias.map((assistencia, index) => (
                        <TableRow key={index} className="hover:bg-background-elevated transition-colors">
                          <TableCell className="text-center font-medium">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              index < 3 
                                ? 'bg-accent-primary text-text-inverse' 
                                : 'bg-background-elevated text-text-primary'
                            }`}>
                              {index + 1}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-text-primary">{assistencia.nome}</TableCell>
                          <TableCell className="text-text-secondary">{assistencia.turma}</TableCell>
                          <TableCell className="text-center font-bold text-accent-primary">{assistencia.assistencias}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Goleiros */}
                <div className="bg-background-card rounded-lg border border-border-default overflow-hidden">
                  <div className="p-4 md:p-4 border-b border-border-default">
                    <h3 className="text-lg font-semibold text-text-primary flex items-center">Goleiros</h3>
                  </div>
                  <Table className="min-w-[500px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12 text-center">Pos</TableHead>
                        <TableHead>Jogador</TableHead>
                        <TableHead>Turma</TableHead>
                        <TableHead className="text-center">Gols Sofridos</TableHead>
                        <TableHead className="text-center">Jogos</TableHead>
                        <TableHead className="text-center">Média</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                    {currentStats.goleiros.map((goleiro, index) => (
                        <TableRow key={index} className="hover:bg-background-elevated transition-colors">
                          <TableCell className="text-center font-medium">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              index < 3 
                                ? 'bg-accent-primary text-text-inverse' 
                                : 'bg-background-elevated text-text-primary'
                            }`}>
                              {index + 1}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-text-primary">{goleiro.nome}</TableCell>
                          <TableCell className="text-text-secondary">{goleiro.turma}</TableCell>
                          <TableCell className="text-center text-text-secondary">{goleiro.golsSofridos}</TableCell>
                          <TableCell className="text-center text-text-secondary">{goleiro.jogos}</TableCell>
                          <TableCell className="text-center font-bold text-accent-primary">
                            {(goleiro.golsSofridos / goleiro.jogos).toFixed(1)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        </div>
      </PageLayout>
    </TransitionLayout>
  );
} 