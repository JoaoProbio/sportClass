"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@/app/providers/AuthContext";
import api from "@/src/services/apiClient";

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
  time?: string; // ISO date/time or a string
  status?: string;
  score?: string; // "1 - 0" or "1 x 0" or "1x0" or volleyball sets "25-20,25-22"
  court?: string;
  sport?: string;
  [k: string]: any;
};

function normalizeName(t?: TeamLike) {
  if (!t) return "—";
  if (typeof t === "string") return t;
  return (t.nome || t.name || "Time").toString();
}

function teamInitials(name: string) {
  if (!name) return "";
  const parts = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]);
  return parts.join("").toUpperCase().slice(0, 2);
}

function formatShortDate(iso?: string) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const time = d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    // dd/mm HH:MM as requested (no year)
    return `${dd}/${mm} ${time}`;
  } catch {
    return "";
  }
}

/**
 * parseScore
 * Accepts several common score formats and returns [left, right]
 * Supported separators: '-', ' - ', 'x', ' X ', 'x', '×'
 * Also preserves composite scores (sets) for volleyball where comma separates sets.
 */
function parseScore(score?: string) {
  if (!score) return ["0", "0"];

  const s = score.toString().trim();

  // If it's a volleyball/multi-set style (contains comma), return as-is for set logic
  if (s.includes(",")) {
    // We'll return a compact representation for the quick pill display
    // but the rest of the component expects left/right for simple sports,
    // so for the quick pill we will extract first set left/right for ordering highlight.
    const first = s.split(",")[0] || "0-0";
    const parts = first.split(/[-x×]/i).map((p) => p.trim());
    const left = parts[0] || "0";
    const right = parts[1] || "0";
    return [left, right];
  }

  // Otherwise split by any of the common separators: '-', 'x', '×'
  const parts = s.split(/[-x×]/i).map((p) => p.trim());
  // Some inputs might be "1 - 0" (2 parts), or "1x0" (2 parts).
  const left = parts[0] || "0";
  const right = parts[1] || "0";
  return [left, right];
}

function statusBadgeConfig(s?: string) {
  const raw = (s || "").toString().toLowerCase();
  if (raw.includes("andamento") || raw === "live" || raw === "em_andamento")
    return { label: "EM ANDAMENTO", className: "bg-emerald-400 text-black" };
  if (raw.includes("final") || raw === "finished")
    return { label: "FINALIZADO", className: "bg-gray-700 text-white" };
  if (raw.includes("breve") || raw === "upcoming" || raw === "agendado")
    return { label: "EM BREVE", className: "bg-neutral-700 text-white" };
  if (raw.includes("adiad") || raw === "postponed")
    return { label: "ADIADO", className: "bg-gray-200 text-gray-700" };
  return { label: s || "DESCONHECIDO", className: "bg-gray-600 text-white" };
}

const EventsList: React.FC<{ gameId: string }> = ({ gameId }) => {
  const { token } = useAuth();
  const [events, setEvents] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    setLoading(true);
    setEvents(null);

    (async () => {
      try {
        // Ensure api client has the current auth token
        api.setAuthToken(token ?? null);

        // Use centralized api client which returns parsed body or throws
        const body = await api.get(`/api/games/${gameId}/events`).catch((e) => {
          console.debug("Events api.get failed:", e);
          return null;
        });

        const list = Array.isArray(body) ? body : (body?.data ?? []);
        if (mounted.current) setEvents(list);
      } catch (e) {
        if (mounted.current) setEvents([]);
      } finally {
        if (mounted.current) setLoading(false);
      }
    })();

    return () => {
      mounted.current = false;
    };
  }, [gameId, token]);

  if (loading)
    return <div className="text-sm text-text-muted">Carregando eventos...</div>;
  if (!events || events.length === 0)
    return (
      <div className="text-sm text-text-muted">Nenhum evento registrado.</div>
    );

  return (
    <ul className="space-y-2">
      {events
        .slice()
        .sort((a, b) => (Number(b?.minuto) || 0) - (Number(a?.minuto) || 0))
        .map((ev) => {
          const teamName =
            ev?.time?.nome || ev?.team?.nome || ev?.teamName || "";
          const initials = teamName
            ? teamName
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((p: string) => p[0])
                .join("")
                .toUpperCase()
            : "";
          return (
            <li
              key={
                ev.id ??
                `${ev.tipo ?? "ev"}-${ev.minuto ?? "?"}-${Math.random()}`
              }
              className="p-2 border rounded bg-background-elevated"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-black text-white font-bold text-xs rounded-sm flex items-center justify-center flex-shrink-0">
                    {initials}
                  </div>
                  <div>
                    <div className="text-sm font-medium">
                      {ev.minuto ? `${ev.minuto}' ` : ""}
                      {ev.tipo ? String(ev.tipo).replace(/_/g, " ") : "Evento"}
                      {teamName ? ` — ${teamName}` : ""}
                    </div>
                    {ev.jogador && (
                      <div className="text-sm mt-1">{ev.jogador.nome}</div>
                    )}
                    {ev.descricao && (
                      <div className="text-xs text-text-muted mt-1">
                        {ev.descricao}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-xs text-text-muted">
                  {new Date(
                    ev.createdAt || ev.dataHora || Date.now(),
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </li>
          );
        })}
    </ul>
  );
};

export default function MatchRow({ match }: { match: MatchType }) {
  const [open, setOpen] = useState(false);
  const [watchOpen, setWatchOpen] = useState(false);

  const name1 = normalizeName(match.team1);
  const name2 = normalizeName(match.team2);
  const initials1 = teamInitials(name1);
  const initials2 = teamInitials(name2);
  const [leftScore, rightScore] = parseScore(match.score);
  const statusCfg = statusBadgeConfig(match.status);

  return (
    <>
      <article
        className="bg-background-card border border-border-default rounded-md p-3 hover:shadow-md transition-shadow duration-150"
        role="group"
        aria-labelledby={`match-${String(match.id)}-title`}
      >
        <div className="grid grid-cols-2 items-center gap-3">
          <div className="flex flex-col items-start justify-center">
            <div className="flex items-center gap-3 whitespace-nowrap">
              <div
                className="w-8 h-8 flex items-center justify-center bg-black text-white font-bold text-xs rounded-sm flex-shrink-0"
                aria-hidden="true"
                title={name1}
              >
                {initials1}
              </div>
              <div className="text-sm font-medium text-text-primary truncate">
                {name1}
              </div>
            </div>

            <div className="flex items-center gap-3 whitespace-nowrap mt-1">
              <div
                className="w-8 h-8 flex items-center justify-center bg-gray-200 text-[#5b5b5b] font-bold text-xs rounded-sm flex-shrink-0"
                aria-hidden="true"
                title={name2}
              >
                {initials2}
              </div>
              <div className="text-sm font-medium text-text-primary truncate">
                {name2}
              </div>
            </div>
          </div>

          {/* Right: score pills and status badge (far right) */}
          <div className="flex items-center justify-end space-x-4">
            <div className="flex flex-col items-center">
              {(() => {
                const sport = (match.sport || "").toString().toLowerCase();
                const isVoley =
                  sport.includes("volei") || sport.includes("vôlei");
                // Volleyball: score may be provided as sets "25-20,25-22,20-25,25-23"
                if (isVoley) {
                  const sets = (match.score || "")
                    .toString()
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean);
                  const leftSets = sets.map((s) =>
                    (s.split(/[-x×]/i)[0] || "0").trim(),
                  );
                  const rightSets = sets.map((s) =>
                    (s.split(/[-x×]/i)[1] || "0").trim(),
                  );
                  return (
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center">
                        {leftSets.map((v, i) => {
                          const a = Number(v) || 0;
                          const b = Number(rightSets[i] || "0") || 0;
                          const isWinner = a > b;
                          return (
                            <div
                              key={`lset-${i}`}
                              className={`${
                                isWinner
                                  ? "bg-primary-400 text-white"
                                  : "bg-gray-200 text-[#5b5b5b]"
                              } px-2 py-0.5 rounded text-sm mb-1`}
                            >
                              {v}
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex flex-col items-center">
                        {rightSets.map((v, i) => {
                          const a = Number(leftSets[i] || "0") || 0;
                          const b = Number(v) || 0;
                          const isWinner = b > a;
                          return (
                            <div
                              key={`rset-${i}`}
                              className={`${
                                isWinner
                                  ? "bg-primary-400 text-white"
                                  : "bg-gray-200 text-[#5b5b5b]"
                              } px-2 py-0.5 rounded text-sm mb-1`}
                            >
                              {v}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                }
                const a = Number(leftScore) || 0;
                const b = Number(rightScore) || 0;
                const leftIsWinner = a > b;
                const rightIsWinner = b > a;
                // Render winner with highlight, loser with gray style
                return (
                  <>
                    <div
                      className={`${
                        leftIsWinner
                          ? "bg-primary-400 text-white"
                          : "bg-gray-200 text-[#5b5b5b]"
                      } px-3 py-1 rounded-full text-sm font-semibold leading-none`}
                    >
                      {leftScore}
                    </div>
                    <div
                      className={`${
                        rightIsWinner
                          ? "bg-primary-400 text-white"
                          : "bg-gray-200 text-[#5b5b5b]"
                      } px-3 py-2 rounded-md text-sm font-semibold leading-none mt-1`}
                    >
                      {rightScore}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={() => setOpen(true)}
            className="px-3 py-2 rounded-md border border-border-default bg-background-elevated text-text-primary text-sm font-medium hover:bg-white/5 transition"
            aria-label={`Ver detalhes do jogo ${name1} x ${name2}`}
          >
            Detalhes
          </button>

          {match.status &&
            (match.status.toString().toLowerCase().includes("live") ||
              match.status.toString().toLowerCase().includes("andamento")) && (
              <button
                onClick={() => setWatchOpen(true)}
                className="px-3 py-2 rounded-md border border-emerald-400 bg-emerald-400 text-black text-sm font-medium hover:opacity-95 transition"
              >
                Assistir
              </button>
            )}
        </div>
      </article>

      {/* Details modal */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-2xl bg-background-card border border-border-default rounded-lg overflow-hidden">
            <div className="flex items-start justify-between p-4 border-b border-gray-700">
              <div>
                <div className="text-sm text-text-muted">
                  {formatShortDate(match.time)}
                </div>
                <div className="text-lg font-semibold text-text-primary">
                  {name1} vs {name2}
                </div>
                <div className="text-xs text-text-muted">
                  {match.sport || match.court || ""}
                </div>
              </div>
              <div className="flex flex-col items-end">
                {(() => {
                  const sport = (match.sport || "").toString().toLowerCase();
                  const isVoley =
                    sport.includes("volei") || sport.includes("vôlei");
                  if (isVoley) {
                    const sets = (match.score || "")
                      .toString()
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean);
                    const leftSets = sets.map((s) =>
                      (s.split(/[-x×]/i)[0] || "0").trim(),
                    );
                    const rightSets = sets.map((s) =>
                      (s.split(/[-x×]/i)[1] || "0").trim(),
                    );
                    const leftWins = leftSets.reduce(
                      (acc, v, i) =>
                        acc +
                        ((Number(v) || 0) > (Number(rightSets[i] || "0") || 0)
                          ? 1
                          : 0),
                      0,
                    );
                    const rightWins = rightSets.reduce(
                      (acc, v, i) =>
                        acc +
                        ((Number(v) || 0) > (Number(leftSets[i] || "0") || 0)
                          ? 1
                          : 0),
                      0,
                    );
                    return (
                      <>
                        <div className="flex items-center gap-3">
                          <div
                            className={`${
                              leftWins > rightWins
                                ? "bg-primary-400 text-white"
                                : "bg-gray-200 text-[#5b5b5b]"
                            } px-3 py-1 rounded-full text-xl font-extrabold`}
                          >
                            {leftWins}
                          </div>
                          <div className="text-lg text-text-muted">sets</div>
                          <div
                            className={`${
                              rightWins > leftWins
                                ? "bg-primary-400 text-white"
                                : "bg-gray-200 text-[#5b5b5b]"
                            } px-3 py-1 rounded-full text-xl font-extrabold`}
                          >
                            {rightWins}
                          </div>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <div className="flex flex-col gap-1">
                            {leftSets.map((v, i) => (
                              <div
                                key={`l${i}`}
                                className={`${
                                  (Number(v) || 0) >
                                  (Number(rightSets[i] || "0") || 0)
                                    ? "bg-primary-400 text-white"
                                    : "bg-gray-200 text-[#5b5b5b]"
                                } px-2 py-0.5 rounded text-sm font-bold`}
                              >
                                {v}
                              </div>
                            ))}
                          </div>
                          <div className="flex flex-col gap-1">
                            {rightSets.map((v, i) => (
                              <div
                                key={`r${i}`}
                                className={`${
                                  (Number(v) || 0) >
                                  (Number(leftSets[i] || "0") || 0)
                                    ? "bg-primary-400 text-white"
                                    : "bg-gray-200 text-[#5b5b5b]"
                                } px-2 py-0.5 rounded text-sm font-bold`}
                              >
                                {v}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="mt-2">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded text-[12px] font-semibold ${statusCfg.className}`}
                          >
                            {statusCfg.label}
                          </span>
                        </div>
                      </>
                    );
                  }
                  const a = Number(leftScore) || 0;
                  const b = Number(rightScore) || 0;
                  const leftIsWinner = a > b;
                  const rightIsWinner = b > a;
                  return (
                    <>
                      <div className="text-2xl font-extrabold flex items-center gap-3">
                        <span
                          className={`${
                            leftIsWinner
                              ? "bg-primary-400 text-white"
                              : "bg-gray-200 text-[#5b5b5b]"
                          } px-3 py-1 rounded-full`}
                        >
                          {leftScore}
                        </span>
                        <span className="mx-2 text-lg text-text-muted">-</span>
                        <span
                          className={`${
                            rightIsWinner
                              ? "bg-primary-400 text-white"
                              : "bg-gray-200 text-[#5b5b5b]"
                          } px-3 py-1 rounded-full`}
                        >
                          {rightScore}
                        </span>
                      </div>
                      <div className="mt-2">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded text-[12px] font-semibold ${statusCfg.className}`}
                        >
                          {statusCfg.label}
                        </span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            <div className="p-4 max-h-[60vh] overflow-auto">
              <h3 className="text-sm font-semibold mb-3">Eventos</h3>
              <EventsList gameId={String(match.id)} />
            </div>

            <div className="p-3 border-t border-gray-700 flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-md bg-background-elevated text-text-primary"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Watch modal (placeholder) */}
      {watchOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-40 flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setWatchOpen(false)}
          />
          <div className="relative w-full max-w-md bg-background-card border border-border-default rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-semibold">
                {name1} vs {name2}
              </div>
              <button
                onClick={() => setWatchOpen(false)}
                className="text-text-muted px-2 py-1 rounded hover:bg-white/5"
              >
                Fechar
              </button>
            </div>
            <div className="text-sm text-text-muted">
              Modo assistir - Em desenvolvimento
            </div>
          </div>
        </div>
      )}
    </>
  );
}
