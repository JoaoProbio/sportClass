"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import MatchRow from "./MatchRow";
import { useSport } from "../providers/SportContext";
import api from "@/src/services/apiClient";

// Define interfaces for Game, Team, Modality
interface Game {
  id: number | string;
  // Backend may use either `time1Id/time2Id` (Portuguese) or `team1Id/team2Id` (English).
  // Accept both and be tolerant to string/number id types.
  time1Id?: number | string;
  time2Id?: number | string;
  team1Id?: number | string;
  team2Id?: number | string;
  modalidadeId?: number | string;
  sport?: string; // The backend might send sport name directly or derive from modalidade
  time?: string;
  status?: "live" | "finished" | "upcoming" | "postponed" | string;
  score?: string;
  court?: string;
  // Enriched properties for display (Portuguese names used across the app: `time1`, `time2`, `modalidade`)
  time1: { id: number | string | null; nome: string };
  time2: { id: number | string | null; nome: string };
  modalidade: { id: number | string | null; nome: string; genero: string };
  // Keep backwards-compatible English fields if other components expect them
  team1?: { id: number | string | null; nome: string };
  team2?: { id: number | string | null; nome: string };
}

interface Team {
  id: number;
  nome: string;
  modalidadeId: number; // useful for filtering
  // ...other team properties if needed
}

interface Modality {
  id: number;
  nome: string;
  genero: string;
  // ...other modality properties if needed
}

interface GamesTableProps {
  // optional initial games (will be used while fetching or as fallback)
  games?: Game[];
  pollInterval?: number; // ms, optional polling to pick up admin-created games
}

/**
 * GamesTable
 *
 * - Fetches games, teams, and modalities from backend (configurable via NEXT_PUBLIC_API_BASE).
 * - Enriches game data with full team and modality objects for display.
 * - Shows loading / error states.
 * - Allows manual reload and polls periodically to keep data fresh.
 * - Filters by active sport from SportContext (supports 'todos' or 'all' to show all sports).
 */
export default function GamesTable({
  games: initialGames = [],
  pollInterval = 15000, // Default poll every 15 seconds
}: GamesTableProps) {
  const { activeSport } = useSport();

  const [games, setGames] = useState<Game[]>([]); // This will store enriched games
  const [loading, setLoading] = useState<boolean>(true); // Start loading true for initial fetch
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  const mountedRef = useRef(true); // To prevent state updates on unmounted component

  // Use centralized api client paths (api will prepend NEXT_PUBLIC_API_BASE automatically)
  // Endpoints are relative paths used by the api client.
  const GAMES_ENDPOINT = "/api/games";
  const TEAMS_ENDPOINT = "/api/teams";
  const MODALITIES_ENDPOINT = "/api/modalities";

  // Helper to safely parse response body for diagnostics
  const parseResponseBody = useCallback(
    async (res: Response): Promise<string> => {
      try {
        const body = await res.json();
        if (typeof body === "string") return body;
        return JSON.stringify(body);
      } catch {
        try {
          return await res.text();
        } catch {
          return "";
        }
      }
    },
    [],
  );

  const enrichGameData = useCallback(
    (rawGames: any[], allTeams: Team[], allModalities: Modality[]): Game[] => {
      if (!rawGames || !Array.isArray(rawGames)) return [];

      return rawGames.map((g) => {
        // Support multiple naming conventions and id types (number or string)
        const t1Id = g.time1Id ?? g.team1Id ?? null;
        const t2Id = g.time2Id ?? g.team2Id ?? null;
        const modId = g.modalidadeId ?? g.modalidade?.id ?? null;

        const team1 = allTeams.find((t) => t.id == t1Id); // loose equality to accept string/number
        const team2 = allTeams.find((t) => t.id == t2Id);
        const modality = allModalities.find((m) => m.id == modId);

        const resolvedId = g.id ?? `temp-${Math.random()}`;

        const resolvedTime1 = team1 || { id: t1Id, nome: "Time Desconhecido" };
        const resolvedTime2 = team2 || { id: t2Id, nome: "Time Desconhecido" };
        const resolvedModalidade = modality || {
          id: modId,
          nome: "Modalidade Desconhecida",
          genero: "",
        };

        // Return enriched object with Portuguese fields `time1`/`time2` (used across app),
        // and also keep `team1`/`team2` for backward compatibility.
        return {
          ...g,
          id: resolvedId, // Ensure ID is present
          sport: g.sport || resolvedModalidade.nome || "Desconhecido",
          time1: resolvedTime1,
          time2: resolvedTime2,
          team1: resolvedTime1,
          team2: resolvedTime2,
          modalidade: resolvedModalidade,
        } as Game;
      });
    },
    [],
  );

  const fetchAllData = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      setError(null);

      try {
        // Debug: log start of fetch and endpoints
        console.debug("GamesTable.fetchAllData - starting fetch", {
          GAMES_ENDPOINT,
          TEAMS_ENDPOINT,
          MODALITIES_ENDPOINT,
          pollInterval,
          signalProvided: !!signal,
        });

        // Fetch all data in parallel using Promise.allSettled to handle individual failures gracefully.
        // We call the centralized api client and adapt results into Response-like objects so existing
        // parsing logic (which expects Response-like shape) continues to work.
        const [gamesRes, teamsRes, modalitiesRes] = await Promise.allSettled([
          (async () => {
            const body = await api.get(GAMES_ENDPOINT).catch((e) => {
              throw e;
            });
            return {
              ok: true,
              json: async () => body,
              status: 200,
              value: body,
            };
          })(),
          (async () => {
            const body = await api.get(TEAMS_ENDPOINT).catch((e) => {
              throw e;
            });
            return {
              ok: true,
              json: async () => body,
              status: 200,
              value: body,
            };
          })(),
          (async () => {
            const body = await api.get(MODALITIES_ENDPOINT).catch((e) => {
              throw e;
            });
            return {
              ok: true,
              json: async () => body,
              status: 200,
              value: body,
            };
          })(),
        ]);

        // Debug: show raw promise results summary
        try {
          console.debug("GamesTable.fetchAllData - fetch results summary", {
            gamesResStatus: gamesRes.status,
            teamsResStatus: teamsRes.status,
            modalitiesResStatus: modalitiesRes.status,
          });
        } catch (dbgErr) {
          // ignore debug failures
        }

        let allGames: any[] = [];
        let allTeams: Team[] = [];
        let allModalities: Modality[] = [];
        const fetchErrors: string[] = [];

        // Helper to extract JSON or record a readable error.
        // Ignore AbortError (caused by timeouts or component unmount) so user doesn't see spurious messages.
        const extractResult = async (
          res: PromiseSettledResult<{
            ok: boolean;
            json: () => Promise<any>;
            status: number;
            value: any;
          }>,
          label: string,
        ) => {
          if (res.status === "fulfilled") {
            try {
              if (res.value.ok) {
                const parsed = await res.value.json();
                // Debug: show a small sample / length info
                try {
                  const sample = Array.isArray(parsed)
                    ? { length: parsed.length }
                    : { type: typeof parsed };
                  console.debug(
                    `GamesTable.fetchAllData - ${label} parsed`,
                    sample,
                  );
                } catch (dbg) {}
                return parsed;
              } else {
                const detail = JSON.stringify(res.value.value);
                fetchErrors.push(
                  `Falha ao carregar ${label} (${res.value.status}): ${detail}`,
                );
                return undefined;
              }
            } catch (e: any) {
              // If response reading failed due to abort, ignore it
              if (e?.name === "AbortError") {
                console.debug(`Ignored abort while reading ${label}`);
                return undefined;
              }
              fetchErrors.push(
                `Falha ao ler ${label}: ${String(e?.message ?? e)}`,
              );
              return undefined;
            }
          } else {
            // Rejected promise (fetch threw). If it's an AbortError, ignore it.
            const reason = res.reason;
            if (reason && reason.name === "AbortError") {
              // Common when user navigates away or timeout triggers - ignore gracefully
              console.debug(`Ignored abort while fetching ${label}`);
              return undefined;
            }
            // Otherwise record a friendly error message
            fetchErrors.push(
              `Falha ao carregar ${label} (Network Error): ${String(reason)}`,
            );
            return undefined;
          }
        };

        const gamesData = await extractResult(gamesRes, "jogos");
        const teamsData = await extractResult(teamsRes, "times");
        const modalitiesData = await extractResult(
          modalitiesRes,
          "modalidades",
        );

        // Debug: log raw extracted data shapes before normalization
        try {
          console.debug("GamesTable.fetchAllData - extracted data shapes", {
            gamesDataType: Array.isArray(gamesData)
              ? "array"
              : typeof gamesData,
            gamesDataLength: Array.isArray(gamesData)
              ? gamesData.length
              : undefined,
            teamsDataType: Array.isArray(teamsData)
              ? "array"
              : typeof teamsData,
            teamsDataLength: Array.isArray(teamsData)
              ? teamsData.length
              : undefined,
            modalitiesDataType: Array.isArray(modalitiesData)
              ? "array"
              : typeof modalitiesData,
            modalitiesDataLength: Array.isArray(modalitiesData)
              ? modalitiesData.length
              : undefined,
          });
        } catch (dbgErr) {}

        if (Array.isArray(gamesData)) allGames = gamesData;
        if (Array.isArray(teamsData)) allTeams = teamsData;
        if (Array.isArray(modalitiesData)) allModalities = modalitiesData;

        if (!mountedRef.current) return; // Prevent state updates if component unmounted

        if (fetchErrors.length > 0) {
          setError(fetchErrors.join("\n"));
          // Debug: log why we are enriching with empty games
          console.debug(
            "GamesTable.fetchAllData - enriching with empty games due to errors",
            {
              fetchErrors,
              allTeamsLength: allTeams.length,
              allModalitiesLength: allModalities.length,
            },
          );
          setGames(enrichGameData([], allTeams, allModalities)); // Still enrich, even if games failed
        } else {
          const enriched = enrichGameData(allGames, allTeams, allModalities);
          // Debug: log enriched results count and a small preview
          try {
            console.debug("GamesTable.fetchAllData - enriched games", {
              enrichedCount: enriched.length,
              preview: enriched.slice(0, 3).map((g) => ({
                id: g.id,
                time1: g.time1?.nome,
                time2: g.time2?.nome,
                modalidade: g.modalidade?.nome,
              })),
            });
          } catch (dbgErr) {}
          setGames(enriched);
          setLastUpdated(Date.now());
        }
      } catch (err: any) {
        if (!mountedRef.current) return;
        if (err?.name === "AbortError") {
          // ignore aborts
          console.debug("GamesTable.fetchAllData - aborted");
        } else {
          console.error("GamesTable.fetchAllData - unexpected error", err);
          setError(err?.message || "Erro desconhecido ao buscar dados.");
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
          console.debug("GamesTable.fetchAllData - finished (loading=false)");
        }
      }
    },
    [
      GAMES_ENDPOINT,
      TEAMS_ENDPOINT,
      MODALITIES_ENDPOINT,
      enrichGameData,
      parseResponseBody,
    ],
  );

  useEffect(() => {
    mountedRef.current = true;
    const controller = new AbortController();

    // Suppress a known noisy extension/browser message that sometimes appears as
    // an unhandled rejection: "A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received".
    // We only suppress that specific message to avoid hiding real issues.
    const handleUnhandledRejection = (ev: PromiseRejectionEvent) => {
      try {
        const reason = ev?.reason;
        const msg =
          (reason &&
            (reason.message ?? (reason.toString && reason.toString()))) ||
          String(reason || "");
        const noisyPrefix =
          "A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received";
        if (typeof msg === "string" && msg.includes(noisyPrefix)) {
          // Prevent the default logging of this known-extension issue and keep a debug trace.
          ev.preventDefault();
          console.debug("Suppressed noisy extension unhandled rejection:", msg);
        }
      } catch (err) {
        // If anything goes wrong while inspecting, do nothing — do not throw.
      }
    };
    if (typeof window !== "undefined" && window.addEventListener) {
      window.addEventListener("unhandledrejection", handleUnhandledRejection);
    }

    // Initial fetch
    fetchAllData(controller.signal);

    // Set up polling
    let intervalId: NodeJS.Timeout | null = null;
    if (pollInterval && pollInterval > 0) {
      intervalId = setInterval(() => {
        if (mountedRef.current) {
          fetchAllData(); // Fetch without a new signal for polling
        }
      }, pollInterval);
    }

    return () => {
      mountedRef.current = false;
      controller.abort();
      if (typeof window !== "undefined" && window.removeEventListener) {
        window.removeEventListener(
          "unhandledrejection",
          handleUnhandledRejection,
        );
      }
      if (intervalId) clearInterval(intervalId);
    };
  }, [fetchAllData, pollInterval]);

  const handleReload = () => fetchAllData();

  // Combine fetched games with initial fallback if fetched are empty
  const gamesToUse = games.length > 0 ? games : initialGames;

  // Filter by active sport (relaxed matching)
  // Previously we required exact equality between the selected sport and the modalidade name.
  // Relax to a case-insensitive substring match and fall back to `game.sport` if modalidade is missing.
  const active = (activeSport || "").toString().toLowerCase();
  const showAll = active === "todos" || active === "all" || active === "";

  const filteredMatches = gamesToUse.filter((game) => {
    if (showAll) return true;
    const gameSport = (
      (game.modalidade && game.modalidade.nome) ||
      game.sport ||
      ""
    )
      .toString()
      .toLowerCase();
    // Use substring match so selections like 'fut' will match 'Futsal', and support fallback to game.sport.
    return gameSport.includes(active);
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium text-text-primary">Jogos</h3>
          <p className="text-sm text-text-muted mt-1 sm:mt-0">
            {loading
              ? "Carregando jogos..."
              : error
                ? `Erro: ${error}`
                : `${filteredMatches.length} jogo(s) encontrados`}
          </p>
        </div>

        <div className="flex items-center gap-2 mt-3 sm:mt-0 w-full sm:w-auto">
          {lastUpdated ? (
            <span className="text-xs text-text-muted mr-2">
              Atualizado: {new Date(lastUpdated).toLocaleTimeString()}
            </span>
          ) : null}
          <button
            onClick={handleReload}
            className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition w-full sm:w-auto"
            aria-label="Recarregar jogos"
            disabled={loading}
          >
            {loading ? "Recarregando..." : "Recarregar"}
          </button>
        </div>
      </div>

      {/* Error box */}
      {error && (
        <div className="p-3 rounded border border-red-200 bg-red-50 text-sm text-red-700">
          <div className="font-medium mb-1">
            Não foi possível carregar os jogos
          </div>
          <div className="whitespace-pre-wrap break-words">{error}</div>
        </div>
      )}

      {/* List of matches */}
      {filteredMatches.length > 0 && (
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMatches.map((game) => (
            <div key={String(game.id)} className="w-full">
              {/* Keep MatchRow unchanged - we present it responsively via grid */}
              <MatchRow match={game as any} />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {filteredMatches.length === 0 && !loading && !error && (
        <div className="text-center py-12">
          <div className="text-text-muted mb-4">
            <svg
              className="w-16 h-16 mx-auto mb-4"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            <p className="text-lg font-medium text-text-secondary">
              Nenhum jogo encontrado
            </p>
            <p className="text-sm text-text-muted">
              Tente ajustar os filtros ou verifique se os jogos foram criados
              pelo admin.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleReload}
              className="px-4 py-2 text-sm font-medium text-text-primary bg-background-card border border-border-default rounded-md hover:bg-background-elevated cursor-pointer transition-all duration-200 hover:border-border-hover w-full max-w-xs"
              aria-label="Recarregar jogos"
            >
              Recarregar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
