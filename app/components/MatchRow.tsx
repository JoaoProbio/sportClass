"use client";

import React, { useState } from "react";
import GameDetailsDialog from "./GameDetailsDialog";

/**
 * MatchRow
 *
 * - Responsive card for a single match.
 * - Mobile: stacked layout (teams, score, actions).
 * - Desktop (md+): two-column layout with teams on left/right and meta in the middle.
 * - Keeps functionality: opens details dialog and optional watch dialog.
 *
 * Note: This component intentionally uses simplified utility classes and theme tokens
 * already present in the project (e.g. bg-background-card, text-text-primary, border-border-default).
 */

type TeamLike =
  | string
  | {
      id?: number | string | null;
      nome?: string;
      name?: string;
      [k: string]: any;
    };

type MatchType = {
  id: number | string;
  team1?: TeamLike;
  team2?: TeamLike;
  time?: string;
  status?: "live" | "finished" | "upcoming" | "postponed" | string;
  score?: string;
  court?: string;
  sport?: string;
  [k: string]: any;
};

interface MatchRowProps {
  match: MatchType;
}

export default function MatchRow({ match }: MatchRowProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isWatchOpen, setIsWatchOpen] = useState(false);

  const normalizeName = (t?: TeamLike) => {
    if (!t) return "—";
    if (typeof t === "string") return t;
    return (t.nome || t.name || "Time").toString();
  };

  const team1 = normalizeName(match.team1);
  const team2 = normalizeName(match.team2);

  const teamShort = (name: string) =>
    name.split(" ").slice(0, 2).join(" ").slice(0, 12);

  const statusMap = (s?: string) => {
    switch (s) {
      case "live":
        return {
          label: "EM ANDAMENTO",
          className: "bg-accent-primary text-text-inverse",
        };
      case "finished":
        return {
          label: "FINALIZADO",
          className: "bg-background-elevated text-text-primary",
        };
      case "upcoming":
        return {
          label: "EM BREVE",
          className: "bg-background-elevated text-text-primary",
        };
      case "postponed":
        return { label: "ADIADO", className: "bg-gray-200 text-gray-700" };
      default:
        return {
          label: "DESCONHECIDO",
          className: "bg-gray-100 text-gray-600",
        };
    }
  };

  const status = statusMap(match.status);

  // Transform `match` to be compatible with the stricter `Game` type for the dialog.
  const gameForDialog = {
    id: Number(match.id) || 0,
    team1,
    team2,
    sport: match.sport || "Indefinido",
    time: match.time || "Indefinido",
    court: match.court || "Indefinido",
    score: match.score,
    status: (["live", "finished", "upcoming", "postponed"].includes(
      match.status || "",
    )
      ? match.status
      : "upcoming") as "live" | "finished" | "upcoming" | "postponed",
  };

  return (
    <>
      <article
        className="bg-background-card border border-border-default rounded-lg p-4 hover:shadow-md transition-shadow duration-150"
        role="group"
        aria-labelledby={`match-${String(match.id)}-title`}
      >
        {/* Responsive grid:
            - Mobile: stacked (grid-cols-1)
            - md+: three columns: left team, meta (score/status), right team
        */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
          {/* Left team */}
          <div className="flex items-center gap-3 md:justify-start">
            <div
              className="w-10 h-10 rounded-sm flex items-center justify-center font-bold text-xs text-text-inverse"
              style={{ backgroundColor: "var(--accent-1, #2f7a2f)" }}
              aria-hidden="true"
            >
              {teamShort(team1)}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-text-primary truncate">
                {team1}
              </div>
              <div className="text-xs text-text-muted truncate">
                {match.sport || "—"}
              </div>
            </div>
          </div>

          {/* Center meta (score / time / status) */}
          <div className="flex flex-col items-center justify-center text-center md:items-center md:justify-center">
            <div className="text-lg md:text-xl font-bold text-text-primary">
              {match.score || "vs"}
            </div>
            <div className="mt-1 text-xs text-text-muted">
              {match.time ?? match.court ?? ""}
            </div>
            <div
              className={`mt-2 inline-flex items-center px-2 py-1 rounded text-[11px] font-semibold ${status.className}`}
              aria-hidden="true"
            >
              {status.label}
            </div>
          </div>

          {/* Right team */}
          <div className="flex items-center gap-3 md:justify-end md:flex-row-reverse">
            <div
              className="w-10 h-10 rounded-sm flex items-center justify-center font-bold text-xs text-text-inverse"
              style={{ backgroundColor: "var(--accent-2, #0b6bd6)" }}
              aria-hidden="true"
            >
              {teamShort(team2)}
            </div>
            <div className="min-w-0 text-right md:text-right">
              <div className="text-sm font-medium text-text-primary truncate">
                {team2}
              </div>
              <div className="text-xs text-text-muted truncate">
                {match.court ?? ""}
              </div>
            </div>
          </div>
        </div>

        {/* Actions (stack on mobile) */}
        <div className="mt-3 flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => setIsDetailsOpen(true)}
            className="flex-1 px-3 py-2 rounded-md border border-border-default bg-background-elevated text-text-primary text-sm font-medium hover:bg-accent-primary hover:text-text-inverse transition"
            aria-label={`Ver detalhes do jogo ${team1} x ${team2}`}
          >
            Detalhes
          </button>

          {match.status === "live" && (
            <button
              onClick={() => setIsWatchOpen(true)}
              className="flex-1 px-3 py-2 rounded-md border border-accent-primary bg-accent-primary text-text-inverse text-sm font-medium hover:opacity-95 transition"
              aria-label={`Assistir partida ${team1} x ${team2}`}
            >
              Assistir
            </button>
          )}
        </div>
      </article>

      {/* Details dialog(s) */}
      <GameDetailsDialog
        game={gameForDialog}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />

      <GameDetailsDialog
        game={gameForDialog}
        isOpen={isWatchOpen}
        onClose={() => setIsWatchOpen(false)}
        // You might pass a prop like `mode="watch"` if the dialog supports it
      />
    </>
  );
}
