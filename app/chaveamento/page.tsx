"use client";

import React from "react";
import PageLayout from "../components/PageLayout";
import TransitionLayout from "../components/TransitionLayout";
import { useSport } from "../providers/SportContext";
import { RiGroupLine } from "@remixicon/react";

function GroupStage({ sport }: { sport: string }) {
  // Only Futsal has group stage data in this mock — otherwise show informational message.
  if (sport.toLowerCase() !== "futsal") {
    return (
      <div className="flex items-center justify-center h-[60vh] w-full">
        <p className="bg-background-primary/80 px-4 py-2 text-text-secondary rounded-md text-center tracking-tighter border border-primary-50">
          Fase de grupos disponível apenas para Futsal.
        </p>
      </div>
    );
  }

  // Mocked group data (kept from previous implementation)
  const groupData: Record<
    string,
    {
      teams: {
        name: string;
        played: number;
        wins: number;
        draws: number;
        losses: number;
        goalsFor: number;
        goalsAgainst: number;
        points: number;
      }[];
      matches: {
        team1: string;
        team2: string;
        score: string;
        status: string;
        date: string;
        time: string;
      }[];
    }
  > = {
    "Grupo A": {
      teams: [
        {
          name: "3º Info A",
          played: 2,
          wins: 2,
          draws: 0,
          losses: 0,
          goalsFor: 6,
          goalsAgainst: 1,
          points: 6,
        },
        {
          name: "1º Agro A",
          played: 2,
          wins: 1,
          draws: 0,
          losses: 1,
          goalsFor: 3,
          goalsAgainst: 3,
          points: 3,
        },
        {
          name: "2º Meio Ambiente A",
          played: 2,
          wins: 0,
          draws: 0,
          losses: 2,
          goalsFor: 1,
          goalsAgainst: 6,
          points: 0,
        },
      ],
      matches: [
        {
          team1: "3º Info A",
          team2: "1º Agro A",
          score: "3-1",
          status: "finished",
          date: "15/01",
          time: "14:00",
        },
        {
          team1: "2º Meio Ambiente A",
          team2: "3º Info A",
          score: "0-3",
          status: "finished",
          date: "16/01",
          time: "15:30",
        },
        {
          team1: "1º Agro A",
          team2: "2º Meio Ambiente A",
          score: "2-0",
          status: "finished",
          date: "17/01",
          time: "16:00",
        },
      ],
    },
    "Grupo B": {
      teams: [
        {
          name: "1º Info A",
          played: 1,
          wins: 1,
          draws: 0,
          losses: 0,
          goalsFor: 4,
          goalsAgainst: 1,
          points: 3,
        },
        {
          name: "2º Ano B",
          played: 1,
          wins: 0,
          draws: 0,
          losses: 1,
          goalsFor: 1,
          goalsAgainst: 4,
          points: 0,
        },
        {
          name: "3º Ano A",
          played: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          points: 0,
        },
      ],
      matches: [
        {
          team1: "1º Info A",
          team2: "2º Ano B",
          score: "4-1",
          status: "finished",
          date: "15/01",
          time: "17:00",
        },
        {
          team1: "3º Ano A",
          team2: "1º Info A",
          score: "-",
          status: "upcoming",
          date: "18/01",
          time: "14:30",
        },
        {
          team1: "2º Ano B",
          team2: "3º Ano A",
          score: "-",
          status: "upcoming",
          date: "19/01",
          time: "15:00",
        },
      ],
    },
  };

  const getPositionColor = (position: number) => {
    if (position === 1) return "text-primary-700 font-bold";
    if (position === 2) return "text-secondary-700 font-semibold";
    return "text-text-secondary";
  };

  const getMatchStatus = (status: string) => {
    switch (status) {
      case "finished":
        return {
          label: "FINALIZADO",
          color: "bg-secondary-100 text-secondary-800 border-secondary-200",
        };
      case "upcoming":
        return {
          label: "AGENDADO",
          color: "bg-color-variant-light text-primary-800 border-secondary-200",
        };
      case "live":
        return {
          label: "AO VIVO",
          color: "bg-primary-50 text-primary-800 border-primary-200",
        };
      default:
        return {
          label: "INDEFINIDO",
          color: "bg-secondary-100 text-secondary-800 border-secondary-200",
        };
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Groups Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(groupData).map(([groupName, groupInfo]) => (
          <div
            key={groupName}
            className="bg-background-card border border-border-default rounded-lg overflow-hidden"
          >
            {/* Group Header */}
            <div className="bg-primary-500 text-text-inverse p-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <RiGroupLine className="w-5 h-5" />
                {groupName}
              </h3>
              <p className="text-sm text-text-inverse/80">
                Fase de Grupos - Futsal
              </p>
            </div>

            {/* Group Table */}
            <div className="p-4">
              <div className="bg-background-elevated rounded-lg overflow-hidden border border-border-default">
                <table className="w-full">
                  <thead className="bg-background-card border-b border-border-default">
                    <tr>
                      <th className="text-left p-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                        #
                      </th>
                      <th className="text-left p-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Time
                      </th>
                      <th className="text-center p-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                        J
                      </th>
                      <th className="text-center p-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                        V
                      </th>
                      <th className="text-center p-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                        E
                      </th>
                      <th className="text-center p-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                        D
                      </th>
                      <th className="text-center p-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                        SG
                      </th>
                      <th className="text-center p-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Pts
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupInfo.teams
                      .sort(
                        (a, b) =>
                          b.points - a.points ||
                          b.goalsFor -
                            b.goalsAgainst -
                            (a.goalsFor - a.goalsAgainst),
                      )
                      .map((team, index) => {
                        const position = index + 1;
                        const goalDifference =
                          team.goalsFor - team.goalsAgainst;
                        return (
                          <tr
                            key={team.name}
                            className="border-b border-border-default last:border-b-0 hover:bg-background-card/50"
                          >
                            <td className="p-3">
                              <span
                                className={`text-sm ${getPositionColor(position)}`}
                              >
                                {position}
                              </span>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-primary-500 rounded-sm flex items-center justify-center text-xs font-bold text-white">
                                  {team.name.split(" ")[0]}
                                </div>
                                <span className="text-sm font-medium text-text-primary">
                                  {team.name}
                                </span>
                              </div>
                            </td>
                            <td className="text-center p-3 text-sm text-text-secondary">
                              {team.played}
                            </td>
                            <td className="text-center p-3 text-sm text-primary-600 font-medium">
                              {team.wins}
                            </td>
                            <td className="text-center p-3 text-sm text-secondary-600 font-medium">
                              {team.draws}
                            </td>
                            <td className="text-center p-3 text-sm text-secondary-600 font-medium">
                              {team.losses}
                            </td>
                            <td className="text-center p-3 text-sm font-medium">
                              <span
                                className={
                                  goalDifference >= 0
                                    ? "text-primary-600"
                                    : "text-secondary-700"
                                }
                              >
                                {goalDifference >= 0 ? "+" : ""}
                                {goalDifference}
                              </span>
                            </td>
                            <td className="text-center p-3">
                              <span className="text-sm font-bold text-primary-500">
                                {team.points}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              {/* Group Matches */}
              <div className="mt-4">
                <h4 className="text-sm font-medium text-text-secondary mb-3">
                  Jogos do Grupo
                </h4>
                <div className="space-y-2">
                  {groupInfo.matches.map((match, index) => {
                    const statusInfo = getMatchStatus(match.status);
                    return (
                      <div
                        key={index}
                        className="bg-background-elevated border border-border-default rounded-md p-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 bg-primary-500 rounded-sm flex items-center justify-center text-xs font-bold text-white">
                                {match.team1.split(" ")[0]}
                              </div>
                              <span className="text-sm font-medium text-text-primary">
                                {match.team1}
                              </span>
                            </div>
                            <div className="text-sm font-bold text-text-primary mx-2">
                              {match.score}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-text-primary">
                                {match.team2}
                              </span>
                              <div className="w-5 h-5 bg-secondary-500 rounded-sm flex items-center justify-center text-xs font-bold text-white">
                                {match.team2.split(" ")[0]}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div
                              className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${statusInfo.color}`}
                            >
                              {statusInfo.label}
                            </div>
                            <div className="text-xs text-text-muted mt-1">
                              {match.date} - {match.time}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Qualification Info */}
      <div className="bg-background-card border border-border-default rounded-lg p-4">
        <h3 className="font-semibold text-lg text-text-primary mb-3">
          Classificação
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
            <span className="text-text-secondary">
              1º lugar: Classificado para as Semifinais
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-secondary-500 rounded-full"></div>
            <span className="text-text-secondary">
              2º lugar: Classificado para as Quartas
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-secondary-300 rounded-full"></div>
            <span className="text-text-secondary">3º lugar: Eliminado</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChaveamentoPage() {
  const { activeSport } = useSport();

  return (
    <TransitionLayout backgroundColor="var(--background)">
      <PageLayout>
        <div className="space-y-4 md:space-y-6">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-text-primary mb-1 md:mb-2">
              Chaveamento
            </h1>
            <p className="text-xs md:text-sm text-text-secondary">
              Veja a fase de grupos por modalidade
            </p>
          </div>

          {/* Only show GroupStage (no bracket/flow visuals) */}
          <GroupStage sport={activeSport} />
        </div>
      </PageLayout>
    </TransitionLayout>
  );
}
