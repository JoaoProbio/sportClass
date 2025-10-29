"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/AuthContext";
import api from "@/src/services/apiClient";
import ProtectedRoute from "@/components/ProtectedRoute";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Settings,
  User,
  LogOut,
  Calendar,
  Users,
  Trophy,
  Clock,
  Plus,
  MapPin,
  Play,
  Edit,
  Trash2,
} from "lucide-react";

// Interfaces
interface Placar {
  time1: number;
  time2: number;
}

interface Game {
  id: number;
  dataHora: string;
  local: string;
  status: "AGENDADO" | "EM_ANDAMENTO" | "PAUSADO" | "FINALIZADO" | "CANCELADO";
  time1Id: number;
  time2Id: number;
  modalidadeId: number;
  placar?: Placar;
  time1: Team;
  time2: Team;
  modalidade: Modality;
}

interface Team {
  id: number;
  nome: string;
  modalidadeId: number;
  descricao?: string;
}

interface Modality {
  id: number;
  nome: string;
  genero: string;
}

export default function AdminDashboard() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [modalities, setModalities] = useState<Modality[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    if (!token) {
      setError("Autenticação necessária para carregar os dados.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      api.setAuthToken(token);

      const [gamesRes, teamsRes, modalitiesRes, playersRes] = await Promise.all(
        [
          api.get("/api/games"),
          api.get("/api/teams"),
          api.get("/api/modalities"),
          api.get("/api/players"),
        ],
      );

      const fetchedGames: Game[] = gamesRes?.data ?? gamesRes ?? [];
      const fetchedTeams: Team[] = teamsRes?.data ?? teamsRes ?? [];
      const fetchedModalities: Modality[] =
        modalitiesRes?.data ?? modalitiesRes ?? [];
      const fetchedPlayers: any[] = playersRes?.data ?? playersRes ?? [];

      const enrichedGames = fetchedGames.map((game) => {
        const team1 = fetchedTeams.find((team) => team.id === game.time1Id);
        const team2 = fetchedTeams.find((team) => team.id === game.time2Id);
        const modality = fetchedModalities.find(
          (mod) => mod.id === game.modalidadeId,
        );

        return {
          ...game,
          time1: team1 || {
            id: game.time1Id,
            nome: "Time Desconhecido",
            modalidadeId: game.modalidadeId,
          },
          time2: team2 || {
            id: game.time2Id,
            nome: "Time Desconhecido",
            modalidadeId: game.modalidadeId,
          },
          modalidade: modality || {
            id: game.modalidadeId,
            nome: "Modalidade Desconhecida",
            genero: "",
          },
        };
      });

      setGames(enrichedGames);
      setTeams(fetchedTeams);
      setModalities(fetchedModalities);
      // Populate players for dashboard (supports { data: [...] } or direct array)
      setPlayers(fetchedPlayers ?? []);
    } catch (err: any) {
      const errorMessage =
        err.body?.message || err.message || "Erro desconhecido";
      setError(`Falha ao carregar dados: ${errorMessage}`);
      console.error("Erro ao carregar dados:", err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleEditGame = (gameId: number) => {
    router.push(`/admin/games/edit/${gameId}`);
  };

  const handleDeleteGame = async (gameId: number) => {
    if (!confirm("Tem certeza que deseja excluir este jogo?")) {
      return;
    }

    try {
      setError("");
      await api.delete(`/api/games/${gameId}`);
      await loadData();
    } catch (err: any) {
      const errorMessage =
        err.body?.message || err.message || "Erro ao excluir jogo";
      setError(errorMessage);
      console.error("Erro ao excluir jogo:", err);
    }
  };

  const handleManageGame = (gameId: number) => {
    router.push(`/admin/games/manage/${gameId}`);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Data inválida";
      }
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

  const getStatusBadge = (status: string) => {
    const statusMap = {
      AGENDADO: { variant: "secondary" as const, label: "Agendado" },
      EM_ANDAMENTO: { variant: "default" as const, label: "Em Andamento" },
      PAUSADO: { variant: "outline" as const, label: "Pausado" },
      FINALIZADO: { variant: "destructive" as const, label: "Finalizado" },
      CANCELADO: { variant: "secondary" as const, label: "Cancelado" },
    };
    const config =
      statusMap[status as keyof typeof statusMap] ||
      ({
        variant: "secondary" as const,
        label: status || "Desconhecido",
      } as const);
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <header className="bg-background-card shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-text-primary">
                    Painel Administrativo
                  </h1>
                  <p className="text-sm text-text-secondary">
                    IFNMG Campus Januária - Interclasse XXV
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-text-secondary" />
                  <span className="text-sm text-text-primary">
                    {user?.nome}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {user?.tipo === "admin_geral"
                      ? "Admin Geral"
                      : "Admin Turma"}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="text-text-secondary hover:text-text-primary"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Jogos
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{games.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Times</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teams.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Modalidades
                </CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{modalities.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Jogadores</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{players.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Jogos Hoje
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    games.filter((game) => {
                      const gameDate = new Date(game.dataHora);
                      const today = new Date();
                      return gameDate.toDateString() === today.toDateString();
                    }).length
                  }
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Gerenciamento de Jogos</CardTitle>
                  <CardDescription>
                    Crie, edite e gerencie os jogos do campeonato
                  </CardDescription>
                </div>
                <Button
                  className="bg-primary-500 hover:bg-primary-600"
                  onClick={() => router.push("/admin/games/create")}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Jogo
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {games.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {games.map((game) => (
                      <Card
                        key={game.id}
                        className="relative group hover:shadow-lg transition-shadow duration-200"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-lg">
                                {game.time1?.nome || "N/A"} vs{" "}
                                {game.time2?.nome || "N/A"}
                              </h3>
                              {getStatusBadge(game.status)}
                            </div>
                            {game.placar && (
                              <Badge
                                variant="secondary"
                                className="text-sm font-bold"
                              >
                                {game.placar.time1} - {game.placar.time2}
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">
                              {game.modalidade?.nome || "N/A"}
                            </span>
                            {game.modalidade?.genero &&
                              ` (${game.modalidade.genero})`}
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(game.dataHora)}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <MapPin className="w-4 h-4" />
                            <span>{game.local}</span>
                          </div>

                          <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleManageGame(game.id)}
                              className="w-8 h-8 text-blue-600 hover:bg-blue-50"
                              aria-label="Gerenciar jogo"
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEditGame(game.id)}
                              className="w-8 h-8 text-primary-600 hover:bg-primary-50"
                              aria-label="Editar jogo"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDeleteGame(game.id)}
                              className="w-8 h-8 text-red-600 hover:bg-red-50"
                              aria-label="Excluir jogo"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Trophy className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
                    <p className="text-text-secondary font-medium">
                      Nenhum jogo cadastrado ainda.
                    </p>
                    <p className="text-sm text-text-secondary">
                      Crie seu primeiro jogo para começar a gerenciar.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Gerenciamento de Times</CardTitle>
                    <CardDescription>
                      Cadastre e gerencie os times participantes
                    </CardDescription>
                  </div>
                  <Button
                    className="bg-blue-500 hover:bg-blue-600"
                    onClick={() => router.push("/admin/teams/create")}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Time
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center py-2">
                    <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-gray-600 font-medium">
                      {teams.length} times cadastrados
                    </p>
                  </div>

                  {teams.length > 0 && (
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      <p className="text-sm font-medium text-gray-700">
                        Times Recentes:
                      </p>
                      {teams.map((team) => (
                        <div
                          key={team.id}
                          className="flex justify-between items-center p-2 bg-secondary-50 rounded"
                        >
                          <div>
                            <p className="text-sm font-medium text-text-primary">
                              {team.nome}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {
                              modalities.find((m) => m.id === team.modalidadeId)
                                ?.nome
                            }
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Gerenciamento de Jogadores</CardTitle>
                    <CardDescription>
                      Cadastre jogadores e associe aos times
                    </CardDescription>
                  </div>
                  <Button
                    className="bg-green-500 hover:bg-green-600"
                    onClick={() => router.push("/admin/players/create")}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Jogador
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center py-2">
                    <User className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-gray-600 font-medium">
                      {players.length} jogadores cadastrados
                    </p>
                  </div>

                  {players.length > 0 ? (
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      <p className="text-sm font-medium text-gray-700">
                        Jogadores Recentes:
                      </p>
                      {players.map((p) => (
                        <div
                          key={p.id}
                          className="flex justify-between items-center p-2 bg-secondary-50 rounded"
                        >
                          <div>
                            <p className="text-sm font-medium text-text-primary">
                              {p.nome}
                            </p>
                            <p className="text-xs text-gray-500">
                              {p.genero ? `${p.genero}` : ""}{" "}
                              {p.turmaId ? `• Turma ${p.turmaId}` : ""}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {p.time?.nome ?? "Sem time"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 text-center">
                      Nenhum jogador cadastrado
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
