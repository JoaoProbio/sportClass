"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/app/providers/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { ArrowLeft, Users, Save } from "lucide-react";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import api from "@/src/services/apiClient";

interface Team {
  id: number;
  nome: string;
  modalidadeId: number;
  descricao?: string;
  cor?: string;
}

interface Modality {
  id: number;
  nome: string;
  tipo?: string;
  icone?: string;
  descricao?: string;
  genero?: string;
}

interface Player {
  id: number;
  nome: string;
  genero?: string;
  turmaId?: number;
  // possible shapes for modality association from backend
  modalidades?: any;
  modalidadesIds?: any;
  modalidadeId?: any;
  jogadorModalidades?: any;
  timeId?: number | null;
  email?: string;
  // sometimes backend returns nested turma object
  turma?: { id?: number; nome?: string };
}

export default function CreateTeamPage() {
  const { token } = useAuth();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [modalities, setModalities] = useState<Modality[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [turmas, setTurmas] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    nome: "",
    modalidadeId: "",
    turmaId: "", // filter by turma (single)
    edicaoId: "1",
    descricao: "",
    cor: "#3B82F6",
  });

  // selected player ids (strings) from the multi-select
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);

  // Helper: try multiple endpoints for turmas to avoid 404
  const tryFetchTurmas = async () => {
    const candidates = ["/api/turmas", "/api/classes", "/api/turma"];
    for (const path of candidates) {
      try {
        const res = await api.get(path);
        const data = res?.data ?? res ?? [];
        if (Array.isArray(data)) return data;
        if (data && Array.isArray((data as any).turmas))
          return (data as any).turmas;
        if (data && Array.isArray((data as any).items))
          return (data as any).items;
      } catch {
        // try next
      }
    }
    return [];
  };

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      api.setAuthToken(token ?? null);

      // Load modalities and players first
      const [modalRes, playersRes] = await Promise.all([
        api.get("/api/modalities"),
        api.get("/api/players"),
      ]);

      const modalData = modalRes?.data ?? modalRes ?? [];
      const playerData = playersRes?.data ?? playersRes ?? [];

      setModalities(Array.isArray(modalData) ? modalData : []);
      if (Array.isArray(playerData)) {
        setPlayers(playerData);
      } else if (
        (playerData as any)?.players &&
        Array.isArray((playerData as any).players)
      ) {
        setPlayers((playerData as any).players);
      } else {
        setPlayers([]);
      }

      // Turmas: use fallback
      const t = await tryFetchTurmas();
      setTurmas(Array.isArray(t) ? t : []);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setError("Erro ao carregar modalidades, jogadores ou turmas.");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    // when changing filters clear selected players to avoid mismatch
    if (name === "modalidadeId" || name === "turmaId") {
      setSelectedPlayerIds([]);
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Normalization helpers
  const normalize = (s?: any) => {
    if (s === undefined || s === null) return "";
    try {
      return String(s)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
    } catch {
      return String(s).toLowerCase().trim();
    }
  };

  const normalizeGenero = (g?: string) => {
    if (!g) return "";
    const s = normalize(g);
    if (s.includes("masc")) return "masculino";
    if (s.includes("fem")) return "feminino";
    if (s.includes("misto") || s === "mix") return "misto";
    return s;
  };

  // Extract modality ids from player record in multiple possible shapes
  const getPlayerModalityIds = (p: Player): number[] => {
    if (!p) return [];

    const asNum = (v: any) => {
      if (v == null) return null;
      if (typeof v === "number") return v;
      if (typeof v === "string" && v.trim() !== "") {
        const n = Number(v);
        return Number.isNaN(n) ? null : n;
      }
      if (typeof v === "object") {
        if ((v as any).id) return Number((v as any).id);
      }
      return null;
    };

    const arrays = [p.modalidades, p.modalidadesIds];
    for (const a of arrays) {
      if (Array.isArray(a) && a.length > 0) {
        const ids = a
          .map((it: any) => {
            if (it == null) return null;
            if (typeof it === "object") return it.id ?? it.modalidadeId ?? null;
            return Number(it);
          })
          .filter((v: any) => v != null && !Number.isNaN(Number(v)))
          .map(Number);
        if (ids.length > 0) return ids;
      }
    }

    if (p.modalidadeId !== undefined && p.modalidadeId !== null) {
      const n = asNum(p.modalidadeId);
      if (n !== null) return [Number(n)];
    }

    if (
      Array.isArray((p as any).jogadorModalidades) &&
      (p as any).jogadorModalidades.length > 0
    ) {
      const ids = (p as any).jogadorModalidades
        .map(
          (jm: any) =>
            jm.modalidadeId ??
            (jm.modalidade &&
              (jm.modalidade.id ?? jm.modalidade.modalidadeId)) ??
            null,
        )
        .filter((v: any) => v != null && !Number.isNaN(Number(v)))
        .map(Number);
      if (ids.length > 0) return ids;
    }

    if (
      Array.isArray((p as any).modalidades) &&
      (p as any).modalidades.length > 0
    ) {
      const ids = (p as any).modalidades
        .map((m: any) => (m && m.id ? Number(m.id) : Number(m)))
        .filter((n: any) => !Number.isNaN(n))
        .map(Number);
      if (ids.length > 0) return ids;
    }

    return [];
  };

  // Try to extract modality names/types from player (fallback when ids are not present)
  const getPlayerModalityTokens = (p: Player): string[] => {
    const out: string[] = [];
    if ((p as any).modalidadeNome) out.push(String((p as any).modalidadeNome));
    if ((p as any).modalidadeTipo) out.push(String((p as any).modalidadeTipo));
    if (Array.isArray((p as any).modalidades)) {
      for (const m of (p as any).modalidades) {
        if (!m) continue;
        if (typeof m === "object") {
          if (m.nome) out.push(String(m.nome));
          if (m.tipo) out.push(String(m.tipo));
        } else {
          out.push(String(m));
        }
      }
    }
    if (Array.isArray((p as any).jogadorModalidades)) {
      for (const jm of (p as any).jogadorModalidades) {
        if (!jm) continue;
        if (jm.modalidade) {
          if (jm.modalidade.nome) out.push(String(jm.modalidade.nome));
          if ((jm.modalidade as any).tipo)
            out.push(String((jm.modalidade as any).tipo));
        }
      }
    }
    return out.map(normalize).filter(Boolean);
  };

  const isGenderCompatible = (
    playerGenero?: string,
    modalityGenero?: string,
  ) => {
    const p = normalizeGenero(playerGenero);
    const m = normalizeGenero(modalityGenero);
    if (!m || m === "misto") return true;
    if (!p || p === "misto") return true;
    return p === m;
  };

  const isPlayerEligibleByModality = (
    p: Player,
    modality: Modality | undefined,
  ) => {
    if (!modality) return true; // if no modality filter chosen, treat as eligible
    const mid = Number(modality.id);
    if (Number.isNaN(mid)) return false;
    const pIds = getPlayerModalityIds(p);
    if (pIds.length > 0) {
      if (!pIds.includes(mid)) return false;
      return isGenderCompatible(p.genero, modality.genero);
    }
    const tokens = getPlayerModalityTokens(p);
    if (tokens.length > 0) {
      const targetName = normalize(modality.nome);
      const targetTipo = normalize(modality.tipo);
      for (const t of tokens) {
        if (!t) continue;
        if (t === targetName || t === targetTipo)
          return isGenderCompatible(p.genero, modality.genero);
        if (targetName.includes(t) || targetTipo.includes(t))
          return isGenderCompatible(p.genero, modality.genero);
      }
      return false;
    }
    // if no modality info at all, consider not eligible for a selected modality
    return false;
  };

  // Build filteredPlayers according to selected filters:
  // - show ALL players if no filters selected
  // - when a modality is selected, only show players eligible by modality
  // - when a turma is selected, only show players in that turma (player.turmaId or player.turma?.id)
  const filteredPlayers = useMemo(() => {
    const selModal = modalities.find(
      (m) => String(m.id) === String(formData.modalidadeId),
    );
    const selTurmaId = formData.turmaId ? Number(formData.turmaId) : undefined;

    return players.filter((p) => {
      // filter by turma if selected
      if (
        selTurmaId !== undefined &&
        selTurmaId !== null &&
        !Number.isNaN(selTurmaId)
      ) {
        const playerTurma = p.turmaId ?? (p.turma && p.turma.id) ?? undefined;
        if (!playerTurma || Number(playerTurma) !== selTurmaId) {
          return false;
        }
      }
      // filter by modality if selected (if none selected, pass)
      if (selModal) {
        return isPlayerEligibleByModality(p, selModal);
      }
      return true;
    });
  }, [players, modalities, formData.modalidadeId, formData.turmaId]);

  // Handle multiple-select HTML element change for players
  const handlePlayersSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const opts = e.target.options;
    const selected: string[] = [];
    for (let i = 0; i < opts.length; i++) {
      if (opts[i].selected) selected.push(opts[i].value);
    }
    setSelectedPlayerIds(selected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.nome.trim()) {
      setError("Nome do time é obrigatório.");
      return;
    }
    if (!formData.modalidadeId) {
      setError("Selecione uma modalidade.");
      return;
    }

    try {
      setIsLoading(true);
      api.setAuthToken(token ?? null);

      const payload: any = {
        nome: formData.nome.trim(),
        modalidadeId: parseInt(formData.modalidadeId, 10),
        edicaoId: parseInt(formData.edicaoId, 10),
        descricao: formData.descricao.trim() || null,
        cor: formData.cor,
      };

      const createRes = await api.post("/api/teams", payload);
      const createdTeamId = createRes?.data?.id ?? createRes?.id ?? undefined;

      if (createdTeamId && selectedPlayerIds.length > 0) {
        // Prefer bulk assign endpoint; fallback to per-player patch
        try {
          await api.post("/api/team-player/bulk-assign", {
            timeId: createdTeamId,
            jogadorIds: selectedPlayerIds.map(Number),
          });
        } catch {
          try {
            await Promise.all(
              selectedPlayerIds.map((idStr) =>
                api.patch(`/api/players/${idStr}`, { timeId: createdTeamId }),
              ),
            );
          } catch (attachErr) {
            console.error("Erro ao associar jogadores:", attachErr);
            setSuccess(
              "Time criado, mas houve erro ao associar alguns jogadores.",
            );
            setSelectedPlayerIds([]);
            setFormData({
              nome: "",
              modalidadeId: "",
              turmaId: "",
              edicaoId: "1",
              descricao: "",
              cor: "#3B82F6",
            });
            setIsLoading(false);
            setTimeout(() => router.push("/admin/dashboard"), 2000);
            return;
          }
        }
      }

      setSuccess("Time criado com sucesso!");
      setSelectedPlayerIds([]);
      setFormData({
        nome: "",
        modalidadeId: "",
        turmaId: "",
        edicaoId: "1",
        descricao: "",
        cor: "#3B82F6",
      });

      setTimeout(() => router.push("/admin/dashboard"), 1200);
    } catch (err: any) {
      console.error("Erro ao criar time:", err);
      const msg =
        err?.message ??
        (err?.data && err.data?.message) ??
        "Erro ao cadastrar time";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="mb-8">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
            </Button>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Cadastrar Time
                </h1>
                <p className="text-gray-600">
                  Crie um time e associe jogadores (tudo listado por padrão)
                </p>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informações do Time</CardTitle>
              <CardDescription>
                Preencha os dados e selecione jogadores (todos exibidos por
                padrão)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Time *</Label>
                  <Input
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    placeholder="Ex: Time Azul"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="modalidadeId">Modalidade *</Label>
                    <select
                      id="modalidadeId"
                      name="modalidadeId"
                      value={formData.modalidadeId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Todas as modalidades (filtrar)</option>
                      {modalities.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.icone ?? ""} {m.nome}{" "}
                          {m.genero ? `- ${m.genero}` : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="turmaId">
                      Turma (opcional) - filtrar por turma
                    </Label>
                    <select
                      id="turmaId"
                      name="turmaId"
                      value={formData.turmaId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Todas as turmas</option>
                      {turmas.map((t: any) => (
                        <option key={t.id} value={t.id}>
                          {t.nome ?? t.label ?? `Turma ${t.id}`}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Por padrão todos os jogadores são exibidos. Use modalidade
                      e/ou turma para filtrar.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="playersSelect">
                    Jogadores (multi-select)
                  </Label>
                  {/* Show all players by default; filteredPlayers applies filters */}
                  <select
                    id="playersSelect"
                    multiple
                    size={8}
                    value={selectedPlayerIds}
                    onChange={handlePlayersSelectChange}
                    className="w-full px-2 py-2 border border-gray-300 rounded-md bg-white"
                  >
                    {filteredPlayers.map((p) => (
                      <option key={p.id} value={String(p.id)}>
                        {p.nome} {p.genero ? `- ${p.genero}` : ""}{" "}
                        {p.turmaId ? `(${p.turmaId})` : ""}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Selecione múltiplos jogadores (Ctrl/Cmd + clique). Quando
                    não houver filtros selecionados, todos os jogadores
                    aparecem.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <textarea
                    id="descricao"
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleInputChange}
                    placeholder="Descrição opcional"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cor">Cor do Time</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      id="cor"
                      name="cor"
                      value={formData.cor}
                      onChange={handleInputChange}
                      className="w-12 h-10 border rounded cursor-pointer"
                    />
                    <Input
                      value={formData.cor}
                      name="cor"
                      onChange={handleInputChange}
                      placeholder="#3B82F6"
                      className="flex-1"
                    />
                  </div>
                </div>

                {error && <Alert variant="destructive">{error}</Alert>}
                {success && (
                  <Alert className="border-green-200 bg-green-50 text-green-800">
                    {success}
                  </Alert>
                )}

                <div className="flex gap-3">
                  <Button type="submit" disabled={isLoading} className="flex-1">
                    {isLoading ? (
                      "Cadastrando..."
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" /> Cadastrar Time
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/admin/dashboard")}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
