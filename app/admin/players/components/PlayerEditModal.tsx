"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Loader2, Save } from "lucide-react";
import api from "@/src/services/apiClient";
import { useAuth } from "@/app/providers/AuthContext";

// Re-use types from the AdminPlayersPage
interface Player {
  id: string; // generated id (index-based)
  nome: string;
  ano: string;
  turma: string;
  sexo: string;
  modalidades: string[]; // normalized array of modality names
  stats: {
    gols: number;
    cartoesAmarelos: number;
    cartoesVermelhos: number;
    jogos: number;
  };
  // Potentially add a backend ID if the player is persisted
  dbId?: number;
}

interface PlayerEditModalProps {
  player: Player | null; // The player to edit, or null if modal is closed
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedPlayer: Player) => void;
}

// API base is handled by `src/services/apiClient`. Use the centralized `api` instance
// (imported as `api` at the top of this file) for future network calls.
// Removed hard-coded BASE URL to avoid duplication and to rely on NEXT_PUBLIC_API_BASE.

export default function PlayerEditModal({
  player,
  isOpen,
  onClose,
  onSave: onSaveAction,
}: PlayerEditModalProps) {
  const { token } = useAuth();

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [nome, setNome] = useState("");
  const [numeroCamisa, setNumeroCamisa] = useState<number | "">("");
  const [turma, setTurma] = useState("");
  const [sexo, setSexo] = useState("");
  const [modalidades, setModalidades] = useState(""); // comma separated string

  // When player prop changes (e.g., when modal opens with a new player), update local state
  useEffect(() => {
    if (player) {
      setNome(player.nome);
      // Currently, `numeroCamisa` is not in the CSV, so it'll start empty.
      // If the Player type from the backend included it, it would be populated here.
      // For now, it's an editable field that won't persist unless backend integration is added.
      setNumeroCamisa("");
      // Combine ano and turma for the input field to show full context
      setTurma(`${player.ano} ${player.turma}`);
      setSexo(player.sexo);
      setModalidades(player.modalidades.join(", "));
      setError(null); // Clear any previous errors when a new player is selected
    } else {
      // Reset form when no player is selected (modal is closed or player becomes null)
      setNome("");
      setNumeroCamisa("");
      setTurma("");
      setSexo("");
      setModalidades("");
    }
  }, [player]);

  const handleSave = async () => {
    if (!player) return; // Should not happen if modal is open and player is provided

    setSaving(true);
    setError(null);

    try {
      // Create an updated player object based on current form state
      const updatedPlayer: Player = {
        ...player,
        nome,
        // The `turma` field is combined (e.g., "3º Ano B"),
        // you might need to split it for your backend depending on its schema
        ano: turma.split(" ")[0], // Simple split for 'Ano'
        turma: turma.split(" ")[1] || "", // Simple split for 'Turma'
        sexo,
        modalidades: modalidades
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        // stats are managed by the other modal, not this one, so keep original stats
        stats: { ...player.stats },
      };

      // TODO: Implement API call here to persist player details.
      // The `dbId` property on the `Player` interface could be used to determine
      // if this is an update (PATCH) or a creation (POST).

      // Persist edits via centralized API client.
      // Uses POST /api/players for creation or PATCH /api/players/:id for updates.
      try {
        // Ensure api client sends current auth token
        api.setAuthToken(token ?? null);

        const payload = {
          nome: updatedPlayer.nome,
          numeroCamisa: numeroCamisa === "" ? null : Number(numeroCamisa),
          genero: updatedPlayer.sexo,
          turmaNome: updatedPlayer.turma,
          modalidades: updatedPlayer.modalidades,
        };

        if (player.dbId) {
          // Update existing player
          await api.patch(`/api/players/${player.dbId}`, payload);
        } else {
          // Create new player
          await api.post("/api/players", payload);
        }
      } catch (err: any) {
        // Normalize error message and rethrow to be handled below
        const message =
          err?.body?.message || err?.message || "Falha ao salvar jogador";
        throw new Error(message);
      }

      // If API call was successful (or simulation finishes), update parent state
      onSaveAction(updatedPlayer);
      onClose(); // Close the modal on successful save
    } catch (err: any) {
      console.error("Erro ao salvar detalhes do jogador:", err);
      setError(String(err?.message || err));
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !player) return null; // Only render when open and a player is provided

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6 z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            Editar Jogador: {player.nome}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <label className="block">
            <div className="text-sm text-gray-600 mb-1">Nome</div>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-200"
              required
            />
          </label>

          <label className="block">
            <div className="text-sm text-gray-600 mb-1">Número da Camisa</div>
            <input
              type="number"
              value={numeroCamisa === "" ? "" : numeroCamisa} // Show empty string for empty state
              onChange={(e) =>
                setNumeroCamisa(
                  e.target.value === "" ? "" : Number(e.target.value),
                )
              }
              className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-200"
              min="0"
            />
          </label>

          <label className="block">
            <div className="text-sm text-gray-600 mb-1">Sexo</div>
            <select
              value={sexo}
              onChange={(e) => setSexo(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-200"
            >
              <option value="">Selecione</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Misto">Misto</option>
            </select>
          </label>

          <label className="block">
            <div className="text-sm text-gray-600 mb-1">
              Turma (Ano + Letra, ex: "1°A", "2°B")
            </div>
            <input
              value={turma}
              onChange={(e) => setTurma(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-200"
            />
          </label>

          <label className="block">
            <div className="text-sm text-gray-600 mb-1">
              Modalidades (separadas por vírgula, ex: "Futsal, Basquete")
            </div>
            <input
              value={modalidades}
              onChange={(e) => setModalidades(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-200"
            />
          </label>

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
