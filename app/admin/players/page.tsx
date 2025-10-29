"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import PlayerEditModal from "./components/PlayerEditModal"; // Import the new modal component
import { useAuth } from "@/app/providers/AuthContext";
import api from "@/src/services/apiClient";

type RawRow = {
  Nome: string;
  Ano: string;
  Turma: string;
  Sexo: string;
  Modalidade: string;
  [k: string]: string | undefined;
};

type Player = {
  id: string; // generated id (index-based)
  nome: string;
  ano: string;
  turma: string;
  sexo: string;
  modalidades: string[]; // normalized array of modality names
  // optional team/time association (populated from backend associations)
  timeId?: number | string;
  // local admin-managed stats (not persisted unless backend implemented)
  stats: {
    gols: number;
    cartoesAmarelos: number;
    cartoesVermelhos: number;
    jogos: number;
  };
  dbId?: number; // Optional database ID, if loaded from API
};

// Use internal API client + auth token instead of a hardcoded external URL.
// The client will be used inside the effect (see below).

/**
 * Map API response object to local Player type.
 * Accepts a variety of shapes (modalidades as array or comma-separated string,
 * different casing for field names) and normalizes into the local `Player`.
 */
function mapApiToPlayer(api: any, idx: number): Player {
  const modalidadesField =
    api.modalidades ??
    api.Modalidade ??
    api.Modalidades ??
    api.modalidade ??
    "";
  const modalidades = Array.isArray(modalidadesField)
    ? modalidadesField.map((m) => String(m).trim()).filter(Boolean)
    : String(modalidadesField || "")
        .split(",")
        .map((m) => m.trim())
        .filter(Boolean);

  return {
    id: api.id ? `db-${api.id}` : `api-${idx}`,
    nome: (api.nome ?? api.Nome ?? api.name ?? "").toString().trim(),
    ano: (api.ano ?? api.Ano ?? "").toString().trim(),
    turma: (api.turma ?? api.Turma ?? "").toString().trim(),
    sexo: (api.sexo ?? api.Sexo ?? "").toString().trim(),
    modalidades,
    stats: {
      gols: Number(api.stats?.gols ?? api.gols ?? 0),
      cartoesAmarelos: Number(
        api.stats?.cartoesAmarelos ?? api.cartoesAmarelos ?? api.amarelos ?? 0,
      ),
      cartoesVermelhos: Number(
        api.stats?.cartoesVermelhos ??
          api.cartoesVermelhos ??
          api.vermelhos ??
          0,
      ),
      jogos: Number(api.stats?.jogos ?? api.jogos ?? 0),
    },
    dbId: api.id ? Number(api.id) : undefined,
  };
}

export default function AdminPlayersPage() {
  const { token } = useAuth();
  const [players, setPlayers] = useState<Player[]>([]);
  // If the backend exposes a total count we surface it here (useful for UI / diagnostics)
  const [playersTotalCount, setPlayersTotalCount] = useState<number | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<string>("");
  const [selectedStatsPlayer, setSelectedStatsPlayer] = useState<Player | null>(
    null,
  ); // For Manage stats modal
  const [selectedEditPlayer, setSelectedEditPlayer] = useState<Player | null>(
    null,
  ); // For Edit details modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // load players from external API on mount
  useEffect(() => {
    let cancelled = false;
    async function loadAllPages() {
      try {
        setLoading(true);
        setError(null);

        api.setAuthToken(token ?? null);

        const allRaw: any[] = [];
        let page = 1;
        const pageSize = 50; // sensible page size; adjust if backend uses different default/param names
        let morePages = true;

        // We'll try to detect a total count if the API provides it and support limit/offset shaped responses as a fallback.
        let detectedTotalCount: number | null = null;
        let useLimitOffset = false;

        // small helper to attempt extracting total from common locations
        const extractTotal = (b: any) => {
          if (!b) return null;
          return (
            b.totalCount ??
            b.total ??
            b.count ??
            b.meta?.totalCount ??
            b.meta?.total ??
            b.pagination?.totalItems ??
            b.pagination?.totalCount ??
            b.pagination?.totalPages ??
            null
          );
        };

        while (!cancelled && morePages) {
          try {
            // Request a page. Many backends support `page` and `pageSize` or `limit/offset`.
            // If your backend uses different query params, change them accordingly.
            const res = await api.get(
              `/api/players?page=${page}&pageSize=${pageSize}`,
            );
            const body = res?.data ?? res ?? {};

            // Try to detect total count from the response (useful for stopping early)
            const maybeTotal = extractTotal(body);
            if (maybeTotal && Number.isFinite(Number(maybeTotal))) {
              detectedTotalCount = Number(maybeTotal);
              console.debug(
                "Players pagination - detected totalCount:",
                detectedTotalCount,
              );
            }

            // Case A: API returned a plain array for this page
            if (Array.isArray(body)) {
              allRaw.push(...body);
              console.debug(
                "Players pagination page",
                page,
                "received",
                body.length,
                "items; cumulative:",
                allRaw.length,
                "totalCount:",
                detectedTotalCount,
              );
              // If the page returned fewer items than requested, it's the last page
              if (body.length < pageSize) {
                morePages = false;
              } else {
                page += 1;
              }
              continue;
            }

            // Case B: API returned an object that contains data and pagination metadata
            const pageData = Array.isArray(body.data)
              ? body.data
              : Array.isArray(body.players)
                ? body.players
                : null;
            const pagination =
              body.pagination ?? body.meta ?? body.paging ?? null;

            if (pageData) {
              allRaw.push(...pageData);
              console.debug(
                "Players pagination page",
                page,
                "received",
                pageData.length,
                "items; cumulative:",
                allRaw.length,
                "totalCount:",
                detectedTotalCount,
              );

              // If total count is known, stop when we've collected that many items
              if (detectedTotalCount && allRaw.length >= detectedTotalCount) {
                morePages = false;
                break;
              }

              // If pagination info is present use it to decide whether to continue
              if (
                pagination &&
                typeof pagination.currentPage !== "undefined" &&
                typeof pagination.totalPages !== "undefined"
              ) {
                if (
                  Number(pagination.currentPage) >=
                  Number(pagination.totalPages)
                ) {
                  morePages = false;
                } else {
                  page += 1;
                }
                continue;
              }

              // Support limit/offset style responses if present (detect common fields)
              if (
                typeof body.limit !== "undefined" ||
                typeof body.offset !== "undefined"
              ) {
                useLimitOffset = true;
                const limit = Number(body.limit ?? pageSize);
                // compute next offset by incrementing page (we request next page via params above)
                if (pageData.length < limit) {
                  morePages = false;
                } else {
                  page = page + 1;
                }
                continue;
              }

              // If pageData length is less than pageSize, assume last page
              if (pageData.length < pageSize) {
                morePages = false;
              } else {
                page += 1;
              }
              continue;
            }

            // If we reach here the response shape is unexpected. Try to bail out gracefully.
            console.debug(
              "Players pagination unexpected response shape on page",
              page,
              body,
            );
            morePages = false;
          } catch (pageErr: any) {
            // If a single page returns 404 or similar, stop pagination but keep collected results.
            console.debug(
              "Players pagination page fetch failed:",
              page,
              pageErr?.message ?? pageErr,
            );
            // If it's a 4xx/5xx that should be surfaced, rethrow for global error handling.
            const status = pageErr?.status ?? pageErr?.body?.status;
            if (status && status >= 400 && status < 500) {
              // Stop trying further pages but keep what we have
              morePages = false;
              break;
            } else {
              // For network/server errors rethrow to be handled by outer catch
              throw pageErr;
            }
          }
        }

        // Normalize and set players (mapApiToPlayer already handles many shapes)
        const normalized: any[] = allRaw
          .map((a: any, idx: number) => mapApiToPlayer(a, idx))
          .filter(Boolean);

        if (!cancelled) {
          setPlayers(normalized);
          // expose detected totalCount to UI if present (null otherwise)
          setPlayersTotalCount(detectedTotalCount ?? null);
        }
      } catch (err: any) {
        console.error("Erro ao carregar jogadores (paginação):", err);
        if (!cancelled) setError(String(err?.message || err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAllPages();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const filtered = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    if (!q) return players;
    return players.filter((p) => {
      const modalities = p.modalidades.join(" ").toLowerCase();
      return (
        p.nome.toLowerCase().includes(q) ||
        p.ano.toLowerCase().includes(q) ||
        p.turma.toLowerCase().includes(q) ||
        p.sexo.toLowerCase().includes(q) ||
        modalities.includes(q)
      );
    });
  }, [players, query]);

  const handleOpenStatsManage = (p: Player) => {
    // clone to avoid direct mutation
    setSelectedStatsPlayer({ ...p, stats: { ...p.stats } });
  };

  const handleSaveStatsManage = (updated: Player) => {
    setPlayers((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setSelectedStatsPlayer(null);
  };

  const handleCloseStatsManage = () => setSelectedStatsPlayer(null);

  // Handlers for the new Edit Player Modal
  const handleOpenEditModal = (playerToEdit: Player) => {
    setSelectedEditPlayer(playerToEdit);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedEditPlayer(null);
  };

  const handleSaveEditModal = (updatedPlayer: Player) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === updatedPlayer.id ? updatedPlayer : p)),
    );
    handleCloseEditModal();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gerenciar Jogadores</h1>
          <p className="text-sm text-gray-600">
            Lista de jogadores importados da planilha. Pesquise, veja turmas e
            atribua gols/cartões clicando em Manage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            className="px-3 py-2 border rounded-md text-sm"
            placeholder="Pesquisar por nome, turma, modalidade..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Link
            href="/admin/players/import"
            className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
          >
            Importar CSV
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-600">Carregando...</div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center text-gray-600">
          Nenhum jogador encontrado. Tente ajustar o filtro.
        </div>
      ) : (
        <div className="overflow-x-auto border rounded-md">
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Nome
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Ano
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Turma
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Sexo
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Modalidades
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800">{p.nome}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{p.ano}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{p.turma}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{p.sexo}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div className="flex flex-wrap gap-1">
                      {p.modalidades.map((m, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="px-3 py-1 text-xs bg-amber-500 rounded text-white hover:opacity-95"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleOpenStatsManage(p)}
                        className="px-3 py-1 text-xs bg-green-600 rounded text-white hover:opacity-95"
                      >
                        Manage Stats
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Manage stats modal (local only) */}
      {selectedStatsPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={handleCloseStatsManage}
          />
          <div className="relative bg-white rounded shadow-lg w-full max-w-2xl p-6 z-10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">
                  {selectedStatsPlayer.nome}
                </h2>
                <div className="text-sm text-gray-600">
                  {selectedStatsPlayer.ano} • {selectedStatsPlayer.turma}
                </div>
                <div className="text-sm text-gray-500">
                  {selectedStatsPlayer.modalidades.join(", ")}
                </div>
              </div>
              <button
                onClick={handleCloseStatsManage}
                className="text-gray-400 hover:text-gray-700"
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>

            <ManageForm
              player={selectedStatsPlayer}
              onCancel={handleCloseStatsManage}
              onSave={(updated) => handleSaveStatsManage(updated)}
            />
          </div>
        </div>
      )}

      {/* Player Edit Modal */}
      <PlayerEditModal
        player={selectedEditPlayer}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveEditModal}
      />
    </div>
  );
}

/**
 * Small form component to manage a player's statistics locally.
 * This does not persist to the backend; to persist you'll need to implement
 * a backend API endpoint and call it from here.
 */
function ManageForm({
  player,
  onCancel,
  onSave,
}: {
  player: Player;
  onCancel: () => void;
  onSave: (p: Player) => void;
}) {
  const [gols, setGols] = useState<number>(player.stats.gols);
  const [amarelos, setAmarelos] = useState<number>(
    player.stats.cartoesAmarelos,
  );
  const [vermelhos, setVermelhos] = useState<number>(
    player.stats.cartoesVermelhos,
  );
  const [jogos, setJogos] = useState<number>(player.stats.jogos);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Local update
      const updated: Player = {
        ...player,
        stats: {
          gols,
          cartoesAmarelos: amarelos,
          cartoesVermelhos: vermelhos,
          jogos,
        },
      };

      // If you have a backend, replace this with a fetch/POST to save changes.
      // e.g. await fetch('/api/admin/players/stats', { method: 'POST', body: JSON.stringify(updated) })
      await new Promise((r) => setTimeout(r, 300)); // simulate latency
      onSave(updated);
    } catch (err) {
      console.error("Erro ao salvar estatísticas", err);
      alert("Erro ao salvar. Veja console para detalhes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Gols</label>
          <input
            type="number"
            value={gols}
            min={0}
            onChange={(e) => setGols(Number(e.target.value || 0))}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Jogos</label>
          <input
            type="number"
            value={jogos}
            min={0}
            onChange={(e) => setJogos(Number(e.target.value || 0))}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Cartões Amarelos
          </label>
          <input
            type="number"
            value={amarelos}
            min={0}
            onChange={(e) => setAmarelos(Number(e.target.value || 0))}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Cartões Vermelhos
          </label>
          <input
            type="number"
            value={vermelhos}
            min={0}
            onChange={(e) => setVermelhos(Number(e.target.value || 0))}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 mt-6">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-100 rounded text-sm"
          disabled={saving}
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-green-600 text-white rounded text-sm"
          disabled={saving}
        >
          {saving ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </>
  );
}
