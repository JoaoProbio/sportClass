"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/app/providers/AuthContext";
import api from "@/src/services/apiClient";
import ProtectedRoute from "@/components/ProtectedRoute";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  ArrowLeft,
  Save,
  Play,
  Pause,
  Square,
  Plus,
  Eye,
} from "lucide-react";

// Interfaces
interface SimpleTeam {
  id: number;
  nome: string;
  modalidadeId?: number;
  [k: string]: any;
}

interface SimpleModalidade {
  id: number;
  nome: string;
  genero?: string;
  [k: string]: any;
}

interface Placar {
  time1: number;
  time2: number;
}

interface Player {
  id: number;
  nome: string;
  timeId: number | null;
  numeroCamisa?: number | null;
  _resolvedTimeId?: number | null;
  _raw?: any;
  [k: string]: any;
}

interface GameEvent {
  id: number;
  tipo: string;
  minuto: number;
  descricao?: string;
  jogador?: { nome: string };
  time?: { nome: string };
  jogadorSubstituido?: { nome: string };
  createdAt: string;
  [k: string]: any;
}

interface GameFromApi {
  id: number;
  time1Id: number;
  time2Id: number;
  modalidadeId: number;
  dataHora: string;
  local: string;
  status: "AGENDADO" | "EM_ANDAMENTO" | "PAUSADO" | "FINALIZADO" | "CANCELADO";
  placar?: Placar;
  [k: string]: any;
}

interface GameEnriched extends GameFromApi {
  time1: SimpleTeam;
  time2: SimpleTeam;
  modalidade: SimpleModalidade;
}

const safeNumber = (value: string | number) => {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};

export default function ManageGame() {
  const { token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const gameId = Array.isArray(params.id)
    ? params.id[0]
    : (params.id as string);

  const [game, setGame] = useState<GameEnriched | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [events, setEvents] = useState<GameEvent[]>([]);
  const [teams, setTeams] = useState<SimpleTeam[]>([]);
  const [modalities, setModalities] = useState<SimpleModalidade[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const [scoreForm, setScoreForm] = useState({
    placarTime1: "",
    placarTime2: "",
  });

  const [eventForm, setEventForm] = useState({
    tipo: "",
    minuto: "",
    timeId: "",
    jogadorId: "",
    jogadorSubstituidoId: "",
    descricao: "",
  });

  const eventTypes = [
    { value: "GOL", label: "Gol" },
    { value: "ASSISTENCIA", label: "Assistência" },
    { value: "CARTAO_AMARELO", label: "Cartão Amarelo" },
    { value: "CARTAO_VERMELHO", label: "Cartão Vermelho" },
    { value: "SUBSTITUICAO", label: "Substituição" },
    { value: "LESAO", label: "Lesão" },
    { value: "FALTA", label: "Falta" },
    { value: "PENALTI", label: "Pênalti" },
    { value: "OUTRO", label: "Outro" },
  ];

  const enrichGame = useCallback(
    (
      rawGame: GameFromApi | null,
      allTeams: SimpleTeam[],
      allModalities: SimpleModalidade[],
    ): GameEnriched | null => {
      if (!rawGame) return null;

      const time1 =
        allTeams.find((t) => t.id === rawGame.time1Id) ||
        ({ id: rawGame.time1Id, nome: "Time Desconhecido" } as SimpleTeam);
      const time2 =
        allTeams.find((t) => t.id === rawGame.time2Id) ||
        ({ id: rawGame.time2Id, nome: "Time Desconhecido" } as SimpleTeam);
      const modalidade =
        allModalities.find((m) => m.id === rawGame.modalidadeId) ||
        ({
          id: rawGame.modalidadeId,
          nome: "Modalidade Desconhecida",
          genero: "",
        } as SimpleModalidade);

      return {
        ...rawGame,
        time1,
        time2,
        modalidade,
        placar: rawGame.placar || { time1: 0, time2: 0 },
      };
    },
    [],
  );

  const loadData = useCallback(async () => {
    if (!gameId || !token) {
      setError("ID do jogo ou token de autenticação não encontrado.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");
    api.setAuthToken(token);

    try {
      const [gameRes, eventsRes, teamsRes, modalitiesRes] =
        await Promise.allSettled([
          api.get(`/api/games/${gameId}`),
          api.get(`/api/games/${gameId}/events`),
          api.get("/api/teams"),
          api.get("/api/modalities"),
        ]);

      // Fetch players with pagination (robust to shaped responses)
      let fetchedPlayersRaw: any[] = [];
      try {
        const pageSize = 50;
        let page = 1;
        let morePages = true;

        // Safety guard to prevent accidental infinite pagination loops.
        const MAX_PAGES = 50; // maximum number of pages to fetch
        let pagesFetched = 0;

        console.debug("Players pagination starting", { pageSize, MAX_PAGES });

        while (morePages) {
          // Increment guard and break if exceeded
          pagesFetched += 1;
          if (pagesFetched > MAX_PAGES) {
            console.warn(
              "Players pagination aborted: reached MAX_PAGES guard",
              { pageSize, MAX_PAGES, pagesFetched, lastPageAttempted: page },
            );
            break;
          }

          try {
            console.debug("Players pagination fetching page", {
              page,
              pagesFetched,
            });
            const res = await api.get(
              `/api/players?page=${page}&pageSize=${pageSize}`,
            );
            const body = res?.data ?? res ?? {};

            // Log shape of response for diagnostics (avoid heavy dumps)
            try {
              if (Array.isArray(body)) {
                console.debug("Players pagination got array body", {
                  page,
                  length: body.length,
                });
              } else if (body && typeof body === "object") {
                const sampleCount = Array.isArray(body.data)
                  ? body.data.length
                  : Array.isArray(body.players)
                    ? body.players.length
                    : undefined;
                console.debug("Players pagination got object body", {
                  page,
                  keys: Object.keys(body).slice(0, 10),
                  sampleCount,
                });
              } else {
                console.debug("Players pagination got unexpected body type", {
                  page,
                  bodyType: typeof body,
                });
              }
            } catch (logErr) {
              // Continue even if logging inspection fails
              console.debug("Players pagination debug-inspect failed", logErr);
            }

            if (Array.isArray(body)) {
              fetchedPlayersRaw.push(...body);
              if (body.length < pageSize) {
                morePages = false;
              } else {
                page += 1;
              }
              continue;
            }

            const pageData = Array.isArray(body.data)
              ? body.data
              : Array.isArray(body.players)
                ? body.players
                : null;
            const pagination =
              body.pagination ?? body.meta ?? body.paging ?? null;

            if (pageData) {
              fetchedPlayersRaw.push(...pageData);
              // If pagination metadata present, use it to detect last page
              if (
                pagination &&
                typeof pagination.currentPage !== "undefined" &&
                typeof pagination.totalPages !== "undefined"
              ) {
                console.debug("Players pagination metadata", {
                  currentPage: pagination.currentPage,
                  totalPages: pagination.totalPages,
                });
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

              if (pageData.length < pageSize) {
                morePages = false;
              } else {
                page += 1;
              }
              continue;
            }

            // No recognizable data in response — stop pagination
            console.debug("Players pagination stopping: no page data found", {
              page,
            });
            morePages = false;
          } catch (pageErr: any) {
            console.debug(
              "Players pagination page fetch failed (manage game):",
              page,
              pageErr?.message ?? pageErr,
            );
            // On errors, stop pagination to avoid repeated failing requests
            morePages = false;
            break;
          }
        }
      } catch (e) {
        console.debug("Players pagination failed in manage game:", e);
        fetchedPlayersRaw = [];
      }

      let fetchedGame: GameFromApi | null = null;
      if (gameRes.status === "fulfilled") {
        fetchedGame = gameRes.value.data ?? gameRes.value;
      } else {
        console.error("Failed to fetch game:", gameRes.reason);
        setError("Não foi possível carregar os dados do jogo.");
      }

      const rawPlayers = Array.isArray(fetchedPlayersRaw)
        ? fetchedPlayersRaw
        : [];
      const fetchedEvents =
        eventsRes.status === "fulfilled"
          ? (eventsRes.value.data ?? eventsRes.value)
          : [];
      const fetchedTeams =
        teamsRes.status === "fulfilled"
          ? (teamsRes.value.data ?? teamsRes.value)
          : [];
      const fetchedModalities =
        modalitiesRes.status === "fulfilled"
          ? (modalitiesRes.value.data ?? modalitiesRes.value)
          : [];

      const normalizePlayer = (p: any) => {
        if (!p) return null;
        const rawId =
          p.id ?? p._id ?? p.playerId ?? p.dbId ?? p.idPlayer ?? p.uid;
        const rawName =
          p.nome ??
          p.Nome ??
          p.name ??
          p.fullName ??
          p.full_name ??
          p.nomeCompleto ??
          "";
        const rawTimeId =
          p.timeId ??
          p.time_id ??
          p.teamId ??
          p.team_id ??
          p.time?.id ??
          p.team?.id ??
          p.timeIdStr ??
          p.turmaId ??
          p.turma?.id;
        const numeroCamisa =
          p.numeroCamisa ??
          p.shirtNumber ??
          p.numero_camisa ??
          p.numero ??
          p.number ??
          null;

        const timeId =
          rawTimeId === undefined || rawTimeId === null
            ? null
            : Number(rawTimeId);

        return {
          id: Number(rawId ?? NaN),
          nome: String(rawName || "").trim(),
          timeId: timeId,
          _resolvedTimeId: timeId,
          numeroCamisa: numeroCamisa == null ? null : Number(numeroCamisa),
          _raw: p,
        };
      };

      const normalizedPlayers = Array.isArray(rawPlayers)
        ? rawPlayers.map((p: any) => normalizePlayer(p)).filter(Boolean)
        : [];

      setPlayers(
        normalizedPlayers.map((p: any) => ({
          ...p,
          _resolvedTimeId:
            typeof p._resolvedTimeId !== "undefined"
              ? p._resolvedTimeId
              : (p.timeId ?? null),
        })),
      );

      // Attempt turma->time resolution for players missing timeId
      try {
        const missing = normalizedPlayers.filter(
          (p: any) =>
            p.timeId === null || p.timeId === undefined || p.timeId === 0,
        );
        if (missing.length > 0) {
          const turmaCandidates = Array.from(
            new Set(
              missing
                .map((p: any) => {
                  const r = p._raw || {};
                  return (
                    r.turmaId ??
                    r.turma ??
                    r.classId ??
                    r.turma_id ??
                    r.class_id ??
                    null
                  );
                })
                .filter(Boolean)
                .map(String),
            ),
          );

          const turmaToTeam: Record<string, number> = {};

          await Promise.all(
            turmaCandidates.map(async (turmaRaw) => {
              try {
                const rawStr = String(turmaRaw ?? "").trim();
                const withoutColons = rawStr.replace(/^:+/, "");
                const matched = withoutColons.match(/\d+/);
                if (!matched) {
                  console.debug("Skipping invalid turma identifier", turmaRaw);
                  return;
                }
                const turma = matched[0];

                const resp = await api.get(
                  `/api/turma-time/class/${turma}/teams`,
                );
                const list = resp.data ?? resp;
                if (Array.isArray(list) && list.length > 0) {
                  const first = list[0];
                  turmaToTeam[String(rawStr)] =
                    first.id ??
                    first._id ??
                    first.timeId ??
                    first.teamId ??
                    first.team?.id ??
                    first.time?.id;
                }
              } catch (e) {
                console.debug("turma->time lookup failed for", turmaRaw, e);
              }
            }),
          );

          if (Object.keys(turmaToTeam).length > 0) {
            const resolved = normalizedPlayers.map((p: any) => {
              if (
                p.timeId === null ||
                p.timeId === undefined ||
                p.timeId === 0
              ) {
                const r = p._raw || {};
                const turma =
                  r.turmaId ??
                  r.turma ??
                  r.classId ??
                  r.turma_id ??
                  r.class_id ??
                  null;
                const tid = turma ? turmaToTeam[String(turma)] : undefined;
                if (tid) {
                  const newTid = Number(tid);
                  return { ...p, timeId: newTid, _resolvedTimeId: newTid };
                }
              }
              return {
                ...p,
                _resolvedTimeId: p._resolvedTimeId ?? p.timeId ?? null,
              };
            });
            setPlayers(resolved);
          }
        }
      } catch (e) {
        console.debug("turma-time mapping failed", e);
      }

      setEvents(
        Array.isArray(fetchedEvents)
          ? fetchedEvents.sort((a, b) => b.minuto - a.minuto)
          : [],
      );
      setTeams(Array.isArray(fetchedTeams) ? fetchedTeams : []);
      setModalities(Array.isArray(fetchedModalities) ? fetchedModalities : []);

      if (fetchedGame && typeof fetchedGame.id !== "undefined") {
        const enriched = enrichGame(
          fetchedGame,
          Array.isArray(fetchedTeams) ? fetchedTeams : [],
          Array.isArray(fetchedModalities) ? fetchedModalities : [],
        );
        setGame(enriched);
        setScoreForm({
          placarTime1: String(enriched?.placar?.time1 ?? 0),
          placarTime2: String(enriched?.placar?.time2 ?? 0),
        });
      } else {
        setError("Jogo não encontrado ou dados da API inválidos.");
        setGame(null);
      }
    } catch (err: any) {
      console.error("Erro ao carregar dados:", err);
      const errorMessage =
        err.body?.message || err.message || "Erro desconhecido ao carregar.";
      setError(`Falha ao carregar dados do jogo: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [gameId, token, enrichGame]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFormSubmit = async (
    e: React.FormEvent,
    action: () => Promise<any>,
    successMessage: string,
    errorMessage: string,
  ) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      await action();
      setSuccess(successMessage);
      await loadData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error(err);
      const message = err.body?.message || err.message || errorMessage;
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScoreUpdate = (e: React.FormEvent) => {
    handleFormSubmit(
      e,
      () =>
        api.patch(`/api/games/${gameId}/score`, {
          placarTime1: safeNumber(scoreForm.placarTime1),
          placarTime2: safeNumber(scoreForm.placarTime2),
        }),
      "Placar atualizado com sucesso!",
      "Erro ao atualizar placar.",
    );
  };

  const handleEventAdd = (e: React.FormEvent) => {
    const payload = {
      tipo: eventForm.tipo,
      minuto: safeNumber(eventForm.minuto),
      timeId: safeNumber(eventForm.timeId) || null,
      jogadorId: safeNumber(eventForm.jogadorId) || null,
      jogadorSubstituidoId:
        eventForm.tipo === "SUBSTITUICAO" && eventForm.jogadorSubstituidoId
          ? safeNumber(eventForm.jogadorSubstituidoId)
          : null,
      descricao: eventForm.descricao,
    };

    handleFormSubmit(
      e,
      () => api.post(`/api/games/${gameId}/events`, payload),
      "Evento adicionado com sucesso!",
      "Erro ao adicionar evento.",
    ).then(() => {
      setEventForm({
        tipo: "",
        minuto: "",
        timeId: "",
        jogadorId: "",
        jogadorSubstituidoId: "",
        descricao: "",
      });
    });
  };

  const handleStatusChange = async (newStatus: string) => {
    setIsSubmitting(true);
    setError("");
    setSuccess("");
    try {
      await api.patch(`/api/games/${gameId}/status`, { status: newStatus });
      setSuccess(`Status do jogo alterado para ${newStatus}.`);
      await loadData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error(err);
      const message =
        err.body?.message || err.message || "Erro ao alterar status.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Data não informada";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Data inválida";
      return date.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (status?: string) => {
    const statusMap: Record<
      string,
      {
        variant: "secondary" | "default" | "outline" | "destructive";
        label: string;
      }
    > = {
      AGENDADO: { variant: "secondary", label: "Agendado" },
      EM_ANDAMENTO: { variant: "default", label: "Em Andamento" },
      PAUSADO: { variant: "outline", label: "Pausado" },
      FINALIZADO: { variant: "destructive", label: "Finalizado" },
      CANCELADO: { variant: "secondary", label: "Cancelado" },
    };

    const config = status
      ? (statusMap[status] ?? { variant: "secondary" as const, label: status })
      : { variant: "secondary" as const, label: "Desconhecido" };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (error && !game) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <h2 className="text-xl font-semibold text-destructive mb-4">
            {error}
          </h2>
          <Button onClick={() => router.push("/admin/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <h2 className="text-xl font-semibold mb-4">Jogo não encontrado</h2>
          <Button onClick={() => router.push("/admin/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Players that belong to either team in the game (resolved mapping)
  const playersForGame = players.filter(
    (p) =>
      String(p._resolvedTimeId ?? p.timeId ?? "") === String(game.time1.id) ||
      String(p._resolvedTimeId ?? p.timeId ?? "") === String(game.time2.id),
  );

  // Quick helper to set the time filter for the event form.
  // Clicking these "Mostrar somente ..." buttons will set the team and reset player fields,
  // allowing faster filtering when adding events.
  const setTimeFilter = (teamId: number | null) => {
    setEventForm((prev) => ({
      ...prev,
      timeId: teamId ? String(teamId) : "",
      jogadorId: "",
      jogadorSubstituidoId: "",
    }));
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <header className="bg-background-card shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => router.push("/admin/dashboard")}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                  <h1 className="text-xl font-semibold text-text-primary">
                    Gerenciar Jogo
                  </h1>
                  <p className="text-sm text-text-secondary">
                    {game.time1?.nome ?? "Time 1"} vs{" "}
                    {game.time2?.nome ?? "Time 2"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50 mb-6">
              <AlertDescription className="text-green-800">
                {success}
              </AlertDescription>
            </Alert>
          )}

          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl">
                    {game.time1.nome} vs {game.time2.nome}
                  </CardTitle>
                  <CardDescription>
                    {formatDate(game.dataHora)} • {game.local} •{" "}
                    {game.modalidade.nome}
                  </CardDescription>
                </div>
                {getStatusBadge(game.status)}
              </div>
            </CardHeader>
            <CardContent className="flex justify-center items-center space-x-8">
              <span className="text-4xl font-bold">
                {game.placar?.time1 ?? 0}
              </span>
              <span className="text-2xl text-muted-foreground">-</span>
              <span className="text-4xl font-bold">
                {game.placar?.time2 ?? 0}
              </span>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Atualizar Placar</CardTitle>
                <CardDescription>Modifique o placar do jogo.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleScoreUpdate} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="placarTime1">{game.time1.nome}</Label>
                      <Input
                        id="placarTime1"
                        type="number"
                        min="0"
                        value={scoreForm.placarTime1}
                        onChange={(e) =>
                          setScoreForm({
                            ...scoreForm,
                            placarTime1: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="placarTime2">{game.time2.nome}</Label>
                      <Input
                        id="placarTime2"
                        type="number"
                        min="0"
                        value={scoreForm.placarTime2}
                        onChange={(e) =>
                          setScoreForm({
                            ...scoreForm,
                            placarTime2: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Atualizar Placar
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status do Jogo</CardTitle>
                <CardDescription>
                  Controle o andamento da partida.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {game.status === "AGENDADO" && (
                  <Button
                    onClick={() => handleStatusChange("EM_ANDAMENTO")}
                    disabled={isSubmitting}
                  >
                    <Play className="w-4 h-4 mr-2" /> Iniciar
                  </Button>
                )}
                {game.status === "EM_ANDAMENTO" && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleStatusChange("PAUSADO")}
                      disabled={isSubmitting}
                    >
                      <Pause className="w-4 h-4 mr-2" /> Pausar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleStatusChange("FINALIZADO")}
                      disabled={isSubmitting}
                    >
                      <Square className="w-4 h-4 mr-2" /> Finalizar
                    </Button>
                  </>
                )}
                {game.status === "PAUSADO" && (
                  <>
                    <Button
                      onClick={() => handleStatusChange("EM_ANDAMENTO")}
                      disabled={isSubmitting}
                    >
                      <Play className="w-4 h-4 mr-2" /> Retomar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleStatusChange("FINALIZADO")}
                      disabled={isSubmitting}
                    >
                      <Square className="w-4 h-4 mr-2" /> Finalizar
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Eventos do Jogo</CardTitle>
              <CardDescription>Adicione gols, cartões, etc.</CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleEventAdd}
                className="space-y-4 mb-6 p-4 border rounded-lg"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    <Select
                      value={eventForm.tipo}
                      onValueChange={(v) =>
                        setEventForm({
                          ...eventForm,
                          tipo: v,
                          jogadorSubstituidoId: "",
                        })
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {eventTypes.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Minuto</Label>
                    <Input
                      type="number"
                      min="0"
                      value={eventForm.minuto}
                      onChange={(e) =>
                        setEventForm({ ...eventForm, minuto: e.target.value })
                      }
                      placeholder="Ex: 45"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Time</Label>
                    <Select
                      value={eventForm.timeId}
                      onValueChange={(v) =>
                        setEventForm({
                          ...eventForm,
                          timeId: v,
                          jogadorId: "",
                          jogadorSubstituidoId: "",
                        })
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={String(game.time1.id)}>
                          {game.time1.nome}
                        </SelectItem>
                        <SelectItem value={String(game.time2.id)}>
                          {game.time2.nome}
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Quick toggle buttons to filter players by team (compact, inline) */}
                    <div className="mt-2 flex items-center space-x-2">
                      <Button
                        size="icon"
                        variant={
                          eventForm.timeId === String(game.time1.id)
                            ? "default"
                            : "outline"
                        }
                        onClick={() => setTimeFilter(game.time1.id)}
                        title={`Mostrar somente ${game.time1.nome}`}
                        aria-label={`Mostrar somente ${game.time1.nome}`}
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant={
                          eventForm.timeId === String(game.time2.id)
                            ? "default"
                            : "outline"
                        }
                        onClick={() => setTimeFilter(game.time2.id)}
                        title={`Mostrar somente ${game.time2.nome}`}
                        aria-label={`Mostrar somente ${game.time2.nome}`}
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setTimeFilter(null)}
                        title="Mostrar todos os jogadores"
                        aria-label="Mostrar todos os jogadores"
                      >
                        {/* small count to indicate visible players */}
                        {eventForm.timeId
                          ? playersForGame.filter(
                              (p) =>
                                String(p._resolvedTimeId ?? p.timeId ?? "") ===
                                String(eventForm.timeId),
                            ).length
                          : playersForGame.length}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Jogador Principal</Label>
                      <span className="text-sm text-muted-foreground">
                        {eventForm.timeId
                          ? playersForGame.filter(
                              (p) =>
                                String(p._resolvedTimeId ?? p.timeId ?? "") ===
                                String(eventForm.timeId),
                            ).length
                          : playersForGame.length}{" "}
                        visíveis / {players.length} carregados
                      </span>
                    </div>
                    <Select
                      value={eventForm.jogadorId}
                      onValueChange={(v) =>
                        setEventForm({ ...eventForm, jogadorId: v })
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o jogador" />
                      </SelectTrigger>
                      <SelectContent>
                        {(eventForm.timeId
                          ? playersForGame.filter(
                              (p) =>
                                String(p._resolvedTimeId ?? p.timeId ?? "") ===
                                String(eventForm.timeId),
                            )
                          : playersForGame
                        ).map((p) => {
                          const teamName =
                            p._raw?.time?.nome ??
                            teams.find(
                              (t) =>
                                String(t.id) ===
                                String(p._resolvedTimeId ?? p.timeId ?? ""),
                            )?.nome ??
                            "";
                          return (
                            <SelectItem
                              key={`${p.id}-${String(p._resolvedTimeId ?? p.timeId ?? "")}`}
                              value={String(p.id)}
                            >
                              {p.nome}
                              {teamName ? ` — ${teamName}` : ""}
                              {p.numeroCamisa ? ` (${p.numeroCamisa})` : ""}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  {eventForm.tipo === "SUBSTITUICAO" && (
                    <div className="space-y-2">
                      <Label>Jogador Substituído</Label>
                      <Select
                        value={eventForm.jogadorSubstituidoId}
                        onValueChange={(v) =>
                          setEventForm({
                            ...eventForm,
                            jogadorSubstituidoId: v,
                          })
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Jogador que saiu" />
                        </SelectTrigger>
                        <SelectContent>
                          {(eventForm.timeId
                            ? playersForGame.filter(
                                (p) =>
                                  String(
                                    p._resolvedTimeId ?? p.timeId ?? "",
                                  ) === String(eventForm.timeId),
                              )
                            : playersForGame
                          )
                            .filter(
                              (p) =>
                                String(p.id) !== String(eventForm.jogadorId),
                            )
                            .map((p) => {
                              const teamName =
                                p._raw?.time?.nome ??
                                teams.find(
                                  (t) =>
                                    String(t.id) ===
                                    String(p._resolvedTimeId ?? p.timeId ?? ""),
                                )?.nome ??
                                "";
                              return (
                                <SelectItem
                                  key={`${p.id}-${String(p._resolvedTimeId ?? p.timeId ?? "")}`}
                                  value={String(p.id)}
                                >
                                  {p.nome}
                                  {teamName ? ` — ${teamName}` : ""}
                                  {p.numeroCamisa ? ` (${p.numeroCamisa})` : ""}
                                </SelectItem>
                              );
                            })}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2 md:col-span-2 lg:col-span-1">
                    <Label>Descrição (Opcional)</Label>
                    <Input
                      value={eventForm.descricao}
                      onChange={(e) =>
                        setEventForm({
                          ...eventForm,
                          descricao: e.target.value,
                        })
                      }
                      placeholder="Detalhes adicionais"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  Adicionar Evento
                </Button>
              </form>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Eventos Registrados</h3>
                {events.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    Nenhum evento registrado.
                  </p>
                ) : (
                  <ul className="divide-y">
                    {events.map((event) => (
                      <li key={event.id} className="py-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">
                              {eventTypes.find((t) => t.value === event.tipo)
                                ?.label ?? event.tipo}{" "}
                              - {event.minuto}'
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {event.jogador?.nome ?? "N/A"} (
                              {event.time?.nome ?? "N/A"})
                            </p>
                            {event.descricao && (
                              <p className="text-sm">{event.descricao}</p>
                            )}
                            {event.jogadorSubstituido && (
                              <p className="text-sm text-muted-foreground">
                                Saiu: {event.jogadorSubstituido.nome}
                              </p>
                            )}
                          </div>
                          <time className="text-xs text-muted-foreground">
                            {new Date(event.createdAt).toLocaleTimeString(
                              "pt-BR",
                              { hour: "2-digit", minute: "2-digit" },
                            )}
                          </time>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  );
}
